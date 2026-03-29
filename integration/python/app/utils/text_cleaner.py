import re


def clean_text(text: str) -> str:
    """Clean raw PDF-extracted text for NLP processing."""

    # Remove page numbers like "Page 3 of 10"
    text = re.sub(r'Page\s*\d+\s*of\s*\d+', '', text, flags=re.IGNORECASE)
    # Remove standalone line numbers
    text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)
    # Remove Table of Contents blocks
    text = re.sub(r'Table of Contents.*?(\n{2,}|\Z)', '', text,
                  flags=re.DOTALL | re.IGNORECASE)
    # Remove document metadata lines
    text = re.sub(
        r'(Version|Revision|Approved by|Date|Author|Department)[\s:]+[^\n]+',
        '', text, flags=re.IGNORECASE
    )
    # Remove escape sequences
    text = re.sub(r'\\[ntr]', ' ', text)
    # Remove non-ASCII
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    # Remove table pipe separators
    text = re.sub(r'\s*\|\s*', ' ', text)
    # Remove repeated underscores, dashes, asterisks
    text = re.sub(r'_{2,}', '', text)
    text = re.sub(r'-{2,}', '', text)
    text = re.sub(r'\*{2,}', '', text)
    # Collapse newlines to spaces
    text = re.sub(r'\n+', ' ', text)
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text)

    # Filter short/trivial sentence fragments
    sentences = text.split('.')
    sentences = [
        s.strip() for s in sentences
        if len(s.strip()) > 30
           and not s.strip().isdigit()
           and len(s.strip().split()) > 5
    ]

    return '. '.join(sentences).strip()


def split_sentences(text: str) -> list[str]:
    """Split text into sentences using punctuation-aware regex."""
    parts = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in parts if len(s.strip()) > 25]