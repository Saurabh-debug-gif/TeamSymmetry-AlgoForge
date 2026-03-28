from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_service import extract_text_from_pdf
from app.services.quiz_service import generate_quiz
from app.services.ai_service import generate_training_content
from app.utils.text_cleaner import clean_text
from app.utils.logger import logger
from app.config import UPLOAD_DIR
import os

router = APIRouter()


@router.get("/")
def home():
    return {"message": "Python NLP service running"}


@router.post("/process-sop")
async def process_sop(file: UploadFile = File(...)):
    logger.info(f"Processing file: {file.filename}")

    # Validate file type
    if not file.filename.endswith(".pdf"):
        logger.warning(f"Rejected non-PDF file: {file.filename}")
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    path = f"{UPLOAD_DIR}/{file.filename}"

    # Save uploaded file
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        with open(path, "wb") as f:
            f.write(await file.read())
        logger.info(f"File saved to: {path}")
    except Exception as e:
        logger.error(f"Failed to save file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Extract text from PDF
    try:
        raw_text = extract_text_from_pdf(path)
        logger.info(f"PDF text extracted successfully for: {file.filename}")
    except Exception as e:
        logger.error(f"PDF extraction failed for {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")

    # Clean extracted text
    try:
        cleaned_text = clean_text(raw_text)
        logger.info("Text cleaning completed.")
    except Exception as e:
        logger.error(f"Text cleaning failed: {e}")
        raise HTTPException(status_code=500, detail=f"Text cleaning failed: {str(e)}")

    # Generate training content
    try:
        training_content = generate_training_content(cleaned_text)
        logger.info("Training content generated successfully.")
    except Exception as e:
        logger.error(f"Training content generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Training content generation failed: {str(e)}")

    # Generate quiz
    try:
        quiz = generate_quiz(cleaned_text)
        logger.info(f"Quiz generated successfully for: {file.filename}")
    except Exception as e:
        logger.error(f"Quiz generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")

    return {
        "training_content": training_content,
        "quiz": quiz
    }

from app.services.tts_service import pronounce_term

@router.post("/pronounce")
async def pronounce(term: str, languages: str = "english,hindi,marathi"):
    """
    Translate and speak an SOP term in multiple languages.
    languages: comma-separated list e.g. english,hindi,marathi,japanese
    """
    lang_list = [l.strip().lower() for l in languages.split(",")]

    try:
        result = pronounce_term(term, lang_list)
        logger.info(f"Pronunciation generated for term: '{term}' in {lang_list}")
        return {"term": term, "pronunciations": result}
    except Exception as e:
        logger.error(f"Pronunciation endpoint failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    


    from app.services.llm_quiz_service import generate_llm_quiz

@router.post("/generate-quiz-llm")
async def quiz_llm(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    path = f"{UPLOAD_DIR}/{file.filename}"
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        with open(path, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

    try:
        from app.services.pdf_service import extract_text_from_pdf
        from app.utils.text_cleaner import clean_text
        raw = extract_text_from_pdf(path)
        text = clean_text(raw)
        quiz = generate_llm_quiz(text, num_mcq=4, num_tf=3, num_scenario=2)
        logger.info(f"LLM quiz generated for: {file.filename}")
        return {"filename": file.filename, "quiz": quiz}
    except Exception as e:
        logger.error(f"LLM quiz endpoint failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    from app.services.certificate_service import generate_certificate
from fastapi.responses import FileResponse

@router.post("/generate-certificate")
async def certificate(
    employee_name: str,
    sop_topic: str,
    score: float
):
    try:
        path = generate_certificate(employee_name, sop_topic, score)
        logger.info(f"Certificate issued to {employee_name} for {sop_topic} ({score}%)")
        return FileResponse(
            path=path,
            media_type="application/pdf",
            filename=f"certificate_{employee_name.replace(' ', '_')}.pdf"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Certificate generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
