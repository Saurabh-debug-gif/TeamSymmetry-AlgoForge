from transformers import MarianMTModel, MarianTokenizer
from app.utils.logger import logger

# Supported language pairs using MarianMT
LANGUAGE_MODELS = {
    "hindi":   "Helsinki-NLP/opus-mt-en-hi",
    "marathi": "Helsinki-NLP/opus-mt-en-mr",
    "japanese": "Helsinki-NLP/opus-mt-en-jap",
}

_model_cache = {}


def _load_model(lang: str):
    if lang not in _model_cache:
        model_name = LANGUAGE_MODELS[lang]
        logger.info(f"Loading MarianMT model for {lang}")
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        _model_cache[lang] = (tokenizer, model)
    return _model_cache[lang]


def translate_text(text: str, target_lang: str) -> str:
    if target_lang == "english":
        return text

    if target_lang not in LANGUAGE_MODELS:
        raise ValueError(f"Unsupported language: {target_lang}")

    try:
        tokenizer, model = _load_model(target_lang)
        tokens = tokenizer([text], return_tensors="pt", padding=True)
        translated = model.generate(**tokens)
        result = tokenizer.decode(translated[0], skip_special_tokens=True)
        logger.info(f"Translated to {target_lang}: {result[:60]}...")
        return result
    except Exception as e:
        logger.error(f"Translation failed for {target_lang}: {e}")
        raise


def translate_to_all(text: str) -> dict:
    results = {"english": text}
    for lang in LANGUAGE_MODELS:
        try:
            results[lang] = translate_text(text, lang)
        except Exception as e:
            results[lang] = f"[Translation unavailable: {str(e)}]"
    return results