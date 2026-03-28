import nltk
import random
import string
from collections import Counter

nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('averaged_perceptron_tagger_eng', quiet=True)

from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.tag import pos_tag


STOP_WORDS = set(stopwords.words('english'))

# Pharmaceutical/SOP domain stopwords
DOMAIN_NOISE = {
    'shall', 'should', 'must', 'may', 'also', 'used', 'using',
    'within', 'accordance', 'ensure', 'following', 'procedure',
    'process', 'system', 'document', 'section', 'therefore'
}


def get_clean_sentences(text: str) -> list:
    sentences = sent_tokenize(text)
    cleaned = []
    seen = set()

    for s in sentences:
        s = s.strip()

        if len(s) < 80:
            continue
        if len(s.split()) < 12:
            continue
        if s.lower() in seen:
            continue
        if sum(1 for c in s if c.isdigit()) > len(s) * 0.3:
            continue
        if s.count('\\') > 2:
            continue

        seen.add(s.lower())
        cleaned.append(s)

    return cleaned


def extract_keywords(sentence: str, all_sentences: list) -> list:
    """Extract meaningful keywords using POS tagging — nouns and noun phrases only."""
    words = word_tokenize(sentence)
    tagged = pos_tag(words)

    keywords = []
    for word, tag in tagged:
        word_clean = word.strip(string.punctuation)
        if (
            tag in ('NN', 'NNS', 'NNP', 'NNPS')
            and word_clean.lower() not in STOP_WORDS
            and word_clean.lower() not in DOMAIN_NOISE
            and len(word_clean) > 5
            and word_clean.isalpha()
        ):
            keywords.append(word_clean)

    return keywords


def get_distractors(keyword: str, all_sentences: list, count: int = 3) -> list:
    """Get plausible wrong answers from same domain."""
    word_pool = []

    for sentence in all_sentences:
        words = word_tokenize(sentence)
        tagged = pos_tag(words)
        for word, tag in tagged:
            word_clean = word.strip(string.punctuation)
            if (
                tag in ('NN', 'NNS', 'NNP', 'NNPS')
                and word_clean.lower() not in STOP_WORDS
                and word_clean.lower() not in DOMAIN_NOISE
                and len(word_clean) > 5
                and word_clean.isalpha()
                and word_clean.lower() != keyword.lower()
            ):
                word_pool.append(word_clean)

    freq = Counter(word_pool)
    top_words = [w for w, _ in freq.most_common(30) if w != keyword]

    if len(top_words) >= count:
        return random.sample(top_words[:20], count)
    elif len(top_words) > 0:
        return top_words[:count]
    else:
        return ["Protocol", "Compliance", "Documentation"][:count]


def generate_quiz(text: str, target: int = 10) -> list:
    """
    Generate at least `target` MCQ questions from SOP text.
    Relaxes quality filters progressively if not enough sentences pass strict mode.
    """
    sentences = get_clean_sentences(text)

    # --- Fallback: relax filters if strict mode yields too few sentences ---
    if len(sentences) < target:
        all_sentences = sent_tokenize(text)
        relaxed = []
        seen = set()
        for s in all_sentences:
            s = s.strip()
            if len(s) < 40:
                continue
            if len(s.split()) < 7:
                continue
            if s.lower() in seen:
                continue
            seen.add(s.lower())
            relaxed.append(s)
        # Merge strict + relaxed, deduplicating
        combined = list(dict.fromkeys(sentences + relaxed))
        sentences = combined

    if len(sentences) < 3:
        return [{"error": "Not enough content in PDF to generate quiz."}]

    quiz = []
    used_sentences = set()
    index = 0

    while len(quiz) < target and index < len(sentences) * 2:
        sentence = sentences[index % len(sentences)]
        index += 1

        if sentence in used_sentences:
            continue

        keywords = extract_keywords(sentence, sentences)
        if not keywords:
            continue

        keyword = max(keywords, key=len)
        question_text = sentence.replace(keyword, "_______", 1)

        if "_______" not in question_text:
            continue

        distractors = get_distractors(keyword, sentences, count=3)
        if len(distractors) < 3:
            continue

        all_options = distractors + [keyword]
        random.shuffle(all_options)

        answer_letter = ["A", "B", "C", "D"][all_options.index(keyword)]

        quiz.append({
            "question_no": len(quiz) + 1,
            "question": question_text.strip(),
            "options": {
                "A": all_options[0],
                "B": all_options[1],
                "C": all_options[2],
                "D": all_options[3]
            },
            "correct_answer": answer_letter,
            "explanation": (
                f"'{keyword}' is the correct term in this context. "
                f"Understanding this concept is essential for SOP compliance."
            )
        })

        used_sentences.add(sentence)

    return quiz


def generate_summary(text: str) -> dict:
    from sumy.parsers.plaintext import PlaintextParser
    from sumy.nlp.tokenizers import Tokenizer
    from sumy.summarizers.lsa import LsaSummarizer
    from sumy.summarizers.lex_rank import LexRankSummarizer
    from sumy.summarizers.luhn import LuhnSummarizer

    parser = PlaintextParser.from_string(text, Tokenizer("english"))

    lsa  = LsaSummarizer()
    lex  = LexRankSummarizer()
    luhn = LuhnSummarizer()

    short_sentences    = [str(s) for s in lsa(parser.document,  3)]
    bullet_sentences   = [str(s) for s in lex(parser.document,  7)]
    beginner_sentences = [str(s) for s in luhn(parser.document, 2)]
    advanced_sentences = [str(s) for s in lsa(parser.document,  10)]

    word_count   = len(text.split())
    reading_time = max(1, round(word_count / 200))
    sentence_list = get_clean_sentences(text)

    return {
        "short_training": {
            "title": "Quick Training Summary (3 Key Points)",
            "content": " ".join(short_sentences)
        },
        "bullet_version": {
            "title": "Study Notes (Bullet Points)",
            "content": [f"• {s}" for s in bullet_sentences]
        },
        "beginner_version": {
            "title": "Simplified Explanation (Beginner Friendly)",
            "content": "In simple terms: " + " ".join(beginner_sentences)
        },
        "advanced_version": {
            "title": "Detailed Technical Analysis",
            "content": " ".join(advanced_sentences)
        },
        "document_stats": {
            "total_words": word_count,
            "total_sentences": len(sentence_list),
            "estimated_reading_time": f"{reading_time} min",
            "complexity_level": (
                "Advanced"     if word_count > 3000
                else "Intermediate" if word_count > 1000
                else "Basic"
            )
        }
    }