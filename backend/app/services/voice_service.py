"""
Voice Service — Sarvam AI STT + TTS for 6 Indian languages.
Falls back gracefully when API key not configured.
"""
import base64
import httpx
import structlog
from app.core.config import settings

logger = structlog.get_logger()

LANGUAGE_CODES = {
    "hi": "hi-IN",
    "mr": "mr-IN",
    "ta": "ta-IN",
    "bn": "bn-IN",
    "te": "te-IN",
    "en": "en-IN",
}

SARVAM_SPEAKERS = {
    "hi": "meera",
    "mr": "meera",
    "ta": "anushka",
    "bn": "meera",
    "te": "pavithra",
    "en": "meera",
}


async def transcribe_audio(audio_bytes: bytes, language: str = "hi") -> dict:
    """
    Convert speech to text using Sarvam AI.
    Returns: {"text": "...", "language_detected": "hi", "confidence": 0.92}
    """
    if not settings.SARVAM_API_KEY:
        return {
            "text": "Saheb ne teen mahine se salary nahi di. Main kya karoon?",
            "language_detected": language,
            "confidence": 0.95,
            "mock": True,
        }

    lang_code = LANGUAGE_CODES.get(language, "hi-IN")

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                settings.SARVAM_STT_URL,
                headers={
                    "api-subscription-key": settings.SARVAM_API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "audio": base64.b64encode(audio_bytes).decode(),
                    "language_code": lang_code,
                    "model": "saarika:v2",
                    "with_timestamps": False,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "text": data.get("transcript", ""),
                "language_detected": language,
                "confidence": data.get("confidence", 0.9),
            }

    except Exception as e:
        logger.error("Sarvam STT failed", error=str(e))
        raise


async def synthesize_speech(text: str, language: str = "hi") -> bytes:
    """
    Convert text to speech using Sarvam AI.
    Returns: raw audio bytes (WAV format)
    """
    if not settings.SARVAM_API_KEY:
        # Return empty bytes in dev mode
        return b""

    lang_code = LANGUAGE_CODES.get(language, "hi-IN")
    speaker = SARVAM_SPEAKERS.get(language, "meera")

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                settings.SARVAM_TTS_URL,
                headers={
                    "api-subscription-key": settings.SARVAM_API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "inputs": [text[:500]],   # Sarvam limit
                    "target_language_code": lang_code,
                    "speaker": speaker,
                    "model": "bulbul:v1",
                    "enable_preprocessing": True,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            audio_b64 = data.get("audios", [""])[0]
            return base64.b64decode(audio_b64)

    except Exception as e:
        logger.error("Sarvam TTS failed", error=str(e))
        raise


async def translate_to_english(text: str, source_lang: str = "hi") -> str:
    """
    Translate Indian language text to English for RAG processing.
    Uses Sarvam AI translate API or Groq as fallback.
    """
    if source_lang == "en":
        return text

    if not settings.SARVAM_API_KEY:
        # Use Groq for translation in dev
        try:
            from groq import AsyncGroq
            client = AsyncGroq(api_key=settings.GROQ_API_KEY)
            resp = await client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "Translate the following text to English. Return only the translation, no explanation."},
                    {"role": "user", "content": text},
                ],
                max_tokens=512,
                temperature=0.1,
            )
            return resp.choices[0].message.content.strip()
        except Exception:
            return text   # Return original if translation fails

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                "https://api.sarvam.ai/translate",
                headers={
                    "api-subscription-key": settings.SARVAM_API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "input": text,
                    "source_language_code": LANGUAGE_CODES.get(source_lang, "hi-IN"),
                    "target_language_code": "en-IN",
                    "model": "mayura:v1",
                    "enable_preprocessing": False,
                },
            )
            resp.raise_for_status()
            return resp.json().get("translated_text", text)
    except Exception as e:
        logger.warning("Sarvam translation failed", error=str(e))
        return text
