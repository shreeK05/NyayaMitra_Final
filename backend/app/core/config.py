from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "NyayaMitra"
    APP_ENV: str = "development"
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:5173"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://nyayamitra:password@localhost:5432/nyayamitra"
    DATABASE_URL_SYNC: str = "postgresql://nyayamitra:password@localhost:5432/nyayamitra"

    # ChromaDB
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8001
    CHROMA_PERSIST_DIR: str = "./data/chroma"

    # AI / LLM
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_VISION_MODEL: str = "llama-3.2-11b-vision-preview"

    OPENAI_API_KEY: str = ""
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"

    # Voice
    SARVAM_API_KEY: str = ""
    SARVAM_STT_URL: str = "https://api.sarvam.ai/speech-to-text"
    SARVAM_TTS_URL: str = "https://api.sarvam.ai/text-to-speech"

    # WhatsApp
    WHATSAPP_TOKEN: str = ""
    WHATSAPP_PHONE_ID: str = ""
    WHATSAPP_WEBHOOK_VERIFY_TOKEN: str = "nyayamitra_webhook_secret"

    # Blockchain
    POLYGON_RPC_URL: str = "https://polygon-rpc.com"
    POLYGON_PRIVATE_KEY: str = ""

    # Scraper
    GAZETTE_SCRAPE_INTERVAL_HOURS: int = 12

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
