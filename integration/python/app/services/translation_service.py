from app.utils.logger import logger

SUPPORTED_LANGUAGES = {
    "english":  None,                                  # no model needed
    "hindi":    "Helsinki-NLP/opus-mt-en-hi",
    "marathi":  "Helsinki-NLP/opus-mt-en-mr",
    "japanese": "Helsinki-NLP/opus-mt-en-jap",
}

_model_cache: dict = {}


def _load_model(lang: str):
    """Lazy-load a MarianMT model, caching it in memory."""
    if lang not in _model_cache:
        try:
            from transformers import MarianMTModel, MarianTokenizer
            model_name = SUPPORTED_LANGUAGES[lang]
            logger.info(f"Loading MarianMT model for '{lang}': {model_name}")
            tokenizer = MarianTokenizer.from_pretrained(model_name)
            model = MarianMTModel.from_pretrained(model_name)
            _model_cache[lang] = (tokenizer, model)
            logger.info(f"Model for '{lang}' loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load model for '{lang}': {e}")
            raise RuntimeError(
                f"Translation model for '{lang}' is unavailable. "
                f"Ensure internet access and transformers is installed. Error: {e}"
            )
    return _model_cache[lang]


def translate_text(text: str, target_lang: str) -> str:
    """
    Translate `text` to `target_lang`.
    Returns original text for English (no model needed).
    Raises RuntimeError with clear message if model unavailable.
    """
    if target_lang == "english":
        return text

    if target_lang not in SUPPORTED_LANGUAGES:
        raise ValueError(
            f"Unsupported language: '{target_lang}'. "
            f"Supported: {list(SUPPORTED_LANGUAGES.keys())}"
        )

    tokenizer, model = _load_model(target_lang)

    try:
        tokens = tokenizer([text], return_tensors="pt", padding=True, truncation=True, max_length=512)
        translated = model.generate(**tokens)
        result = tokenizer.decode(translated[0], skip_special_tokens=True)
        logger.info(f"Translated to {target_lang}: {result[:60]}...")
        return result
    except Exception as e:
        logger.error(f"Translation inference failed for {target_lang}: {e}")
        raise RuntimeError(f"Translation failed for '{target_lang}': {e}")