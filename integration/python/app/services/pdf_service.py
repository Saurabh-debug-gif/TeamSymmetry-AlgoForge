import fitz

def extract_text_from_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""

    for i, page in enumerate(doc):
        if i >= 2:
            text += page.get_text()

    return text