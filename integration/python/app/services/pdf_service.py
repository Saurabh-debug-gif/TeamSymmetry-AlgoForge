import fitz  # PyMuPDF
from app.utils.logger import logger


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file, skipping the first 2 pages
    (typically cover page + table of contents).
    """
    try:
        doc = fitz.open(file_path)
        text = ""
        start_page = min(2, len(doc))          # skip first 2 pages safely
        for i in range(start_page, len(doc)):
            text += doc[i].get_text()
        doc.close()
        logger.info(f"Extracted {len(text)} chars from {file_path}")
        return text
    except Exception as e:
        logger.error(f"PDF extraction failed: {e}")
        raise