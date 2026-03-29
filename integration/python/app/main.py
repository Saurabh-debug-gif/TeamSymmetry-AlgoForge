import os
import shutil
import tempfile

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import UPLOAD_DIR, CORS_ORIGINS
from app.utils.logger import logger
from app.utils.text_cleaner import clean_text
from app.services.pdf_service import extract_text_from_pdf
from app.services.training_service import generate_training_content
from app.services.quiz_service import generate_quiz
from app.services.certificate_service import generate_certificate as _gen_cert
from app.services.pronounciation_service import pronounce_term as _pronounce
from app.services.llm_quiz_service import generate_llm_quiz

# ── App setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Master Control & Training Platform",
    description="AI-powered SOP processing, quiz generation, and GMP certification.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,     # "*" by default — restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files (audio, certs) as static files
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "ok", "service": "Master Control API v2.0"}


# ── POST /process-sop ─────────────────────────────────────────────────────────
@app.post("/process-sop")
async def process_sop(
        file: UploadFile = File(...),
        num_questions: int = Query(default=10, ge=5, le=30)
):
    """
    Upload a PDF SOP. Returns cleaned training content + MCQ quiz.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    # Save upload to a temp file
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    try:
        shutil.copyfileobj(file.file, tmp)
        tmp.close()

        # 1. Extract raw text
        raw_text = extract_text_from_pdf(tmp.name)
        if not raw_text or len(raw_text.strip()) < 100:
            raise HTTPException(
                status_code=422,
                detail="PDF appears to be empty or image-based (no extractable text)."
            )

        # 2. Clean
        clean = clean_text(raw_text)

        # 3. Generate training content
        training_content = generate_training_content(clean)

        # 4. Generate quiz
        quiz = generate_quiz(clean, target=num_questions)

        logger.info(
            f"Processed '{file.filename}': "
            f"{len(clean.split())} words, {len(quiz)} quiz questions."
        )

        return {
            "filename": file.filename,
            "word_count": len(clean.split()),
            "training_content": training_content,
            "quiz": quiz
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"SOP processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    finally:
        os.unlink(tmp.name)


# ── POST /generate-quiz-llm ───────────────────────────────────────────────────
@app.post("/generate-quiz-llm")
async def generate_quiz_llm(
        file: UploadFile = File(...),
        num_mcq: int = Query(default=4, ge=1, le=10),
        num_tf: int = Query(default=3, ge=1, le=10),
        num_scenario: int = Query(default=2, ge=0, le=5)
):
    """
    Generate an LLM-powered quiz from a PDF. Requires OPENAI_API_KEY env var.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    try:
        shutil.copyfileobj(file.file, tmp)
        tmp.close()

        raw_text = extract_text_from_pdf(tmp.name)
        clean = clean_text(raw_text)

        quiz_data = generate_llm_quiz(
            clean,
            num_mcq=num_mcq,
            num_tf=num_tf,
            num_scenario=num_scenario
        )
        return {"quiz": quiz_data}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"LLM quiz error: {e}")
        raise HTTPException(status_code=500, detail=f"LLM quiz failed: {str(e)}")
    finally:
        os.unlink(tmp.name)


# ── POST /pronounce ───────────────────────────────────────────────────────────
@app.post("/pronounce")
async def pronounce(
        term: str = Query(..., min_length=1, max_length=200),
        languages: str = Query(default="english,hindi")
):
    """
    Translate an SOP term and generate audio for each requested language.
    languages: comma-separated, e.g. "english,hindi,marathi,japanese"
    """
    lang_list = [l.strip().lower() for l in languages.split(",") if l.strip()]
    if not lang_list:
        raise HTTPException(status_code=400, detail="At least one language is required.")

    supported = {"english", "hindi", "marathi", "japanese"}
    invalid = [l for l in lang_list if l not in supported]
    if invalid:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported languages: {invalid}. Supported: {list(supported)}"
        )

    try:
        results = _pronounce(term, lang_list)
        return {"term": term, "pronunciations": results}
    except Exception as e:
        logger.error(f"Pronunciation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── POST /generate-certificate ────────────────────────────────────────────────
@app.post("/generate-certificate")
async def generate_certificate_endpoint(
        employee_name: str = Query(..., min_length=2, max_length=100),
        sop_topic: str = Query(..., min_length=3, max_length=200),
        score: float = Query(..., ge=0, le=100),
        passing_score: float = Query(default=80.0, ge=0, le=100)
):
    """
    Generate and return a PDF certificate.
    Returns 400 if score < passing_score.
    """
    if score < passing_score:
        raise HTTPException(
            status_code=400,
            detail=f"Score {score:.1f}% is below the passing threshold of {passing_score:.1f}%."
        )

    try:
        cert_path = _gen_cert(
            employee_name=employee_name,
            sop_topic=sop_topic,
            score=score,
            passing_score=passing_score
        )
        return FileResponse(
            path=cert_path,
            media_type="application/pdf",
            filename=os.path.basename(cert_path),
            headers={"Content-Disposition": f"attachment; filename={os.path.basename(cert_path)}"}
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Certificate generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Certificate generation failed: {str(e)}")

# ── Run directly ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
