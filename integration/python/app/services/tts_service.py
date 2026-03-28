import os
import pyttsx3
from app.config import UPLOAD_DIR
from app.utils.logger import logger

GTTS_LANG_CODES = {
    "english":  "en",
    "hindi":    "hi",
    "marathi":  "mr",
    "japanese": "ja",
}


def speak_text_gtts(text: str, lang_code: str, filename: str) -> str:
    """Offline TTS using pyttsx3 — no internet required."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    output_path = f"{UPLOAD_DIR}/{filename}_{lang_code}.mp3"

    try:
        engine = pyttsx3.init()
        engine.setProperty('rate', 150)
        engine.setProperty('volume', 1.0)
        engine.save_to_file(text, output_path)
        engine.runAndWait()
        logger.info(f"pyttsx3 audio saved to {output_path}")
        return output_path
    except Exception as e:
        logger.error(f"pyttsx3 TTS failed: {e}")
        raise


def pronounce_term(term: str, target_languages: list) -> dict:
    from app.services.translation_service import translate_text

    results = {}
    for lang in target_languages:
        try:
            translated = translate_text(term, lang)
            lang_code = GTTS_LANG_CODES.get(lang, "en")
            safe_name = term.replace(" ", "_").lower()
            audio_path = speak_text_gtts(translated, lang_code, safe_name)
            results[lang] = {
                "translated_text": translated,
                "audio_file": audio_path
            }
            logger.info(f"Pronunciation ready for {lang}: {translated}")
        except Exception as e:
            logger.error(f"Pronunciation failed for {lang}: {e}")
            results[lang] = {"error": str(e)}

    return results