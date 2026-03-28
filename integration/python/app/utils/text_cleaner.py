import re


def clean_text(text: str) -> str:
    # Remove page numbers
    text = re.sub(r'Page\s*\d+\s*of\s*\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)

    # Remove table of contents blocks
    text = re.sub(r'Table of Contents.*?(\n{2,}|\Z)', '', text, flags=re.DOTALL | re.IGNORECASE)

    # Remove document metadata noise
    text = re.sub(r'(Version|Revision|Approved by|Date|Author|Department)[\s:]+[^\n]+', '', text, flags=re.IGNORECASE)

    # Remove special characters and formatting artifacts
    text = re.sub(r'\\[ntr]', ' ', text)
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    text = re.sub(r'\s*\|\s*', ' ', text)
    text = re.sub(r'_{2,}', '', text)
    text = re.sub(r'-{2,}', '', text)
    text = re.sub(r'\*{2,}', '', text)

    # Normalize whitespace
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text)

    # Keep only meaningful sentences
    sentences = text.split('.')
    sentences = [
        s.strip() for s in sentences
        if len(s.strip()) > 30
        and not s.strip().isdigit()
        and len(s.strip().split()) > 5
    ]

    return '. '.join(sentences).strip()


def split_sentences(text: str):
    sentences = re.split(r'(?<=[.!?])\s+', text)

    return [
        s.strip() for s in sentences
        if len(s.strip()) > 25
    ]