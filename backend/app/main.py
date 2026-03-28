"""
NyayaMitra FastAPI Application Entry Point
"""
import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import init_db
from app.api.routes import counsellor, documents, amendments, score, health, decoder, cases, negotiate, ml
from app.services.amendment_service import seed_amendments_to_db
from app.core.database import AsyncSessionLocal

logger = structlog.get_logger()

# Rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown tasks."""
    logger.info("🚀 NyayaMitra backend starting up...")

    # Initialize database tables
    try:
        await init_db()
        logger.info("✅ Database initialized")
    except Exception as e:
        logger.warning("⚠️  Database init failed (PostgreSQL not connected)", error=str(e))

    # Seed amendment data
    try:
        async with AsyncSessionLocal() as db:
            count = await seed_amendments_to_db(db)
            if count > 0:
                logger.info(f"✅ Seeded {count} amendments to DB")
    except Exception as e:
        logger.warning("⚠️  Amendment seeding failed", error=str(e))

    # Initialize Phase 10 Cron Jobs
    from app.services.scheduler import start_cron_jobs
    start_cron_jobs()

    logger.info("✅ NyayaMitra API ready!", url=settings.BACKEND_URL)

    yield

    logger.info("👋 NyayaMitra backend shutting down...")


# --- Application ---
app = FastAPI(
    title="NyayaMitra API",
    description="""
    ## NyayaMitra — AI-Powered Legal Justice for Every Indian
    
    ### Features:
    - 🎤 **Voice Counsellor** — RAG + Groq LLM in 6 Indian languages
    - 📄 **Document Generator** — 47 legal document types  
    - 🔍 **Document Decoder** — Clause-by-clause risk analysis
    - 📡 **Amendment Tracker** — Live Indian Gazette scraper
    - ⚖️ **Case Tracker** — Limitation period calculator
    - 📊 **NyayaScore** — Legal health metric
    - 🤝 **Negotiation Coach** — AI role-play scenarios
    - 🧠 **ML Models** — Emotion distress detection and case win prediction
    
    ### Auth: None required for MVP (anonymous sessions)
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Rate limiting error handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again."},
    )

from app.api.routes import counsellor, documents, amendments, score, health, decoder, cases, negotiate, ml, auth

# Include routers
app.include_router(health.router)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(counsellor.router, prefix="/api/v1")
app.include_router(documents.router, prefix="/api/v1")
app.include_router(amendments.router, prefix="/api/v1")
app.include_router(score.router, prefix="/api/v1")
app.include_router(decoder.router, prefix="/api/v1")
app.include_router(cases.router, prefix="/api/v1")
app.include_router(negotiate.router, prefix="/api/v1")
app.include_router(ml.router, prefix="/api/v1/ml", tags=["ML"])

# Root
@app.get("/", tags=["Root"])
async def root():
    return {
        "app": "NyayaMitra API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "status": "We are the Legal Guardian of Every Indian 🇮🇳",
    }
