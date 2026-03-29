import re
import random
from collections import Counter
from app.utils.logger import logger

STOP_WORDS = {
    'the','a','an','and','or','but','in','on','at','to','for','of','with',
    'by','from','as','is','was','are','were','be','been','being','have',
    'has','had','do','does','did','will','would','could','should','may',
    'might','shall','must','this','that','these','those','it','its',
    'which','who','what','when','where','how','all','each','every','both',
    'some','such','than','then','too','very','just','also','used','using',
    'within','ensure','following','procedure','process','system','document',
    'section','therefore','accordance','however','before','after','during',
    'while','above','below','between','into','through','under','until',
    'about','against','along','around','among','staff','personnel',
    'patient','patients','their','them','they','you','your','our','we',
    'he','she','his','her','not','any','if','so','there','where','here'
}

OPTION_KEYS = ["A", "B", "C", "D"]


def _split_sentences(text: str) -> list[str]:
    parts = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in parts if len(s.strip()) > 25]


def _get_clean_sentences(text: str, min_len: int = 60, min_words: int = 10) -> list[str]:
    sentences = _split_sentences(text)
    seen: set[str] = set()
    result = []
    for s in sentences:
        norm = s.lower()
        if norm in seen:
            continue
        if len(s) < min_len:
            continue
        if len(s.split()) < min_words:
            continue
        if sum(c.isdigit() for c in s) > len(s) * 0.25:
            continue
        seen.add(norm)
        result.append(s)
    return result


def _extract_keywords(sentence: str) -> list[str]:
    words = re.findall(r'\b[a-zA-Z]{5,}\b', sentence)
    keywords = [w for w in words if w.lower() not in STOP_WORDS]
    keywords.sort(key=lambda w: len(w) + (3 if w[0].isupper() else 0), reverse=True)
    return keywords


def _get_distractors(keyword: str, all_sentences: list[str], count: int = 3) -> list[str]:
    pool: list[str] = []
    kw_lower = keyword.lower()
    for s in all_sentences:
        for w in re.findall(r'\b[a-zA-Z]{5,}\b', s):
            if w.lower() not in STOP_WORDS and w.lower() != kw_lower:
                pool.append(w)

    freq = Counter(pool)
    candidates = [w for w, _ in freq.most_common(30) if w.lower() != kw_lower]

    if len(candidates) >= count:
        return random.sample(candidates[:20], count)

    padding = ["Protocol", "Compliance", "Documentation",
               "Procedure", "Validation", "Monitoring"]
    for p in padding:
        if p.lower() != kw_lower and p not in candidates:
            candidates.append(p)
        if len(candidates) >= count:
            break

    return candidates[:count] if candidates else ["Protocol", "Compliance", "Documentation"][:count]


def generate_quiz(text: str, target: int = 10) -> list[dict]:
    """
    Generate fill-in-the-blank MCQ questions from SOP text.
    This is the primary export used by main.py.
    """
    sentences = _get_clean_sentences(text, min_len=60, min_words=10)

    if len(sentences) < target:
        relaxed = _get_clean_sentences(text, min_len=35, min_words=6)
        combined = {s: True for s in sentences}
        for s in relaxed:
            combined.setdefault(s, True)
        sentences = list(combined.keys())

    if len(sentences) < 3:
        logger.warning("Not enough content for quiz generation.")
        return [{"error": "Not enough content in the PDF to generate quiz questions."}]

    quiz: list[dict] = []
    used: set[str] = set()
    attempts = 0
    max_attempts = len(sentences) * 3

    while len(quiz) < target and attempts < max_attempts:
        sentence = sentences[attempts % len(sentences)]
        attempts += 1

        if sentence in used:
            continue

        keywords = _extract_keywords(sentence)
        if not keywords:
            continue

        keyword = keywords[0]
        pattern = re.compile(re.escape(keyword), re.IGNORECASE)
        blanked = pattern.sub("_______", sentence, count=1)

        if "_______" not in blanked:
            continue

        distractors = _get_distractors(keyword, sentences, count=3)
        if len(distractors) < 3:
            continue

        options_list = distractors + [keyword]
        random.shuffle(options_list)
        correct_letter = OPTION_KEYS[options_list.index(keyword)]

        quiz.append({
            "question_no": len(quiz) + 1,
            "question": blanked.strip(),
            "options": {
                "A": options_list[0],
                "B": options_list[1],
                "C": options_list[2],
                "D": options_list[3],
            },
            "correct_answer": correct_letter,
            "explanation": (
                f"'{keyword}' is the correct term in this context. "
                "Understanding this concept is essential for SOP compliance."
            )
        })
        used.add(sentence)

    logger.info(f"Generated {len(quiz)} quiz questions.")
    return quiz