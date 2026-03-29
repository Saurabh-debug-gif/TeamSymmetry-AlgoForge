import os
from app.config import UPLOAD_DIR
from app.utils.logger import logger

GTTS_LANG_CODES = {
    "english":  "en",
    "hindi":    "hi",
    "marathi":  "mr",
    "japanese": "ja",
}


def _speak_pyttsx3(text: str, filename: str) -> str:
    """
    Generate audio using pyttsx3 (offline, no internet).
    Returns the output file path.
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    output_path = os.path.join(UPLOAD_DIR, filename)

    import pyttsx3
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)
    engine.setProperty('volume', 1.0)
    engine.save_to_file(text, output_path)
    engine.runAndWait()
    logger.info(f"Audio saved: {output_path}")
    return output_path


def pronounce_term(term: str, target_languages: list[str]) -> dict:
    """
    Translate `term` to each requested language and generate audio.
    Each language result is independent — one failure won't block others.
    """
    from app.services.translation_service import translate_text

    results: dict = {}

    for lang in target_languages:
        try:
            translated = translate_text(term, lang)
            lang_code = GTTS_LANG_CODES.get(lang, "en")
            safe_term = term.replace(" ", "_").lower()
            audio_filename = f"{safe_term}_{lang_code}.mp3"
            audio_path = _speak_pyttsx3(translated, audio_filename)

            results[lang] = {
                "translated_text": translated,
                "audio_file": audio_path
            }
        except Exception as e:
            logger.error(f"Pronunciation failed for '{lang}': {e}")
            results[lang] = {
                "translated_text": term if lang == "english" else None,
                "error": str(e)
            }

    return results