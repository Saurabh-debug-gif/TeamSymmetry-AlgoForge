import re
from app.utils.logger import logger

SOP_KEYWORDS = [
    "must", "required", "storage", "dispense", "safety",
    "never", "avoid", "mandatory", "critical", "procedure",
    "ensure", "verify", "temperature", "dosage", "sterile",
    "contamination", "handling", "compliance", "refrigerate",
    "expiry", "label", "dose", "inject", "discard", "clean"
]

CRITICAL_TRIGGERS = {
    "must", "never", "avoid", "required",
    "mandatory", "critical", "warning", "caution", "do not"
}


def _score_sentence(sentence: str) -> int:
    lower = sentence.lower()
    return sum(1 for kw in SOP_KEYWORDS if kw in lower)


def generate_training_content(text: str) -> dict:
    raw_sentences = re.split(r'(?<=[.!?])\s+', text)
    sentences = [
        s.strip() for s in raw_sentences
        if len(s.strip()) > 20 and len(s.strip().split()) >= 4
    ]

    if not sentences:
        return {
            "basic_paragraph": "No content could be extracted from this document.",
            "bullet_learning": [],
            "critical_alerts": [],
            "quick_summary": "Document appears to have no readable text."
        }

    scored = sorted(
        [(s, _score_sentence(s)) for s in sentences],
        key=lambda x: x[1],
        reverse=True
    )
    top_sentences = [s for s, _ in scored]

    basic_paragraph = ". ".join(top_sentences[:3]).strip()
    if not basic_paragraph.endswith("."):
        basic_paragraph += "."

    bullet_learning = [s if s.endswith(".") else s + "." for s in top_sentences[:7]]

    critical_alerts = []
    for s in sentences:
        lower = s.lower()
        if any(trigger in lower for trigger in CRITICAL_TRIGGERS):
            alert = s if s.endswith(".") else s + "."
            critical_alerts.append(alert)
            if len(critical_alerts) >= 5:
                break

    quick_summary = ". ".join(top_sentences[:2]).strip()
    if quick_summary and not quick_summary.endswith("."):
        quick_summary += "."

    logger.info(f"Training content: {len(bullet_learning)} bullets, {len(critical_alerts)} alerts")

    return {
        "basic_paragraph": basic_paragraph,
        "bullet_learning": bullet_learning,
        "critical_alerts": critical_alerts,
        "quick_summary": quick_summary
    }


def generate_summary(text: str) -> dict:
    try:
        from sumy.nlp.tokenizers import Tokenizer

        class _RegexSentTok:
            def tokenize(self, t):
                return [s.strip() for s in re.split(r'(?<=[.!?])\s+', t) if len(s.strip()) > 5]

        class _RegexWordTok:
            def tokenize(self, t):
                return re.findall(r'\b[a-zA-Z]+\b', t.lower())

        Tokenizer.SPECIAL_SENTENCE_TOKENIZERS['english'] = _RegexSentTok()
        Tokenizer.SPECIAL_WORD_TOKENIZERS['english'] = _RegexWordTok()

        from sumy.parsers.plaintext import PlaintextParser
        from sumy.summarizers.lsa import LsaSummarizer
        from sumy.summarizers.lex_rank import LexRankSummarizer
        from sumy.summarizers.luhn import LuhnSummarizer

        parser = PlaintextParser.from_string(text, Tokenizer('english'))
        short    = [str(s) for s in LsaSummarizer()(parser.document, 3)]
        bullets  = [str(s) for s in LexRankSummarizer()(parser.document, 7)]
        beginner = [str(s) for s in LuhnSummarizer()(parser.document, 2)]
        advanced = [str(s) for s in LsaSummarizer()(parser.document, 10)]

    except Exception as e:
        logger.warning(f"Sumy failed, using fallback: {e}")
        raw = re.split(r'(?<=[.!?])\s+', text)
        sents = [s.strip() for s in raw if len(s.strip()) > 30]
        scored = sorted(sents, key=_score_sentence, reverse=True)
        short    = scored[:3]
        bullets  = scored[:7]
        beginner = scored[:2]
        advanced = scored[:10]

    word_count = len(text.split())
    return {
        "short_training":   {"title": "Quick Training Summary",      "content": " ".join(short)},
        "bullet_version":   {"title": "Study Notes (Bullet Points)", "content": [f"• {s}" for s in bullets]},
        "beginner_version": {"title": "Simplified Explanation",      "content": "In simple terms: " + " ".join(beginner)},
        "advanced_version": {"title": "Detailed Technical Analysis", "content": " ".join(advanced)},
        "document_stats": {
            "total_words": word_count,
            "estimated_reading_time": f"{max(1, round(word_count / 200))} min",
            "complexity_level": (
                "Advanced" if word_count > 3000
                else "Intermediate" if word_count > 1000
                else "Basic"
            )
        }
    }