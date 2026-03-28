"""
Voice Counsellor API Router
POST /api/v1/counsellor/text   — Text query → legal answer (JSON)
POST /api/v1/counsellor/voice  — Audio → STT → RAG → TTS
GET  /api/v1/counsellor/history/{conversation_id}
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.rag.legal_brain import ask_legal_question
from app.services.voice_service import transcribe_audio, synthesize_speech
import structlog

logger = structlog.get_logger()
router = APIRouter(prefix="/counsellor", tags=["Voice Counsellor"])


class TextQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=5000)
    language: str = Field(default="hi")
    user_state: str = Field(default="Maharashtra")
    conversation_id: Optional[str] = None
    conversation_history: Optional[list[dict]] = None


class LegalResponse(BaseModel):
    answer: str
    law_citations: list[str]
    win_probability: int
    confidence: int
    next_steps: list[str]
    limitation_days: Optional[int]
    doc_types_relevant: list[str]
    distress_detected: bool
    case_type: str
    retrieved_sections: list[str]
    ipc_to_bns_applied: dict
    conversation_id: Optional[str]


@router.post("/text", response_model=LegalResponse)
async def ask_text(request: TextQueryRequest, db: AsyncSession = Depends(get_db)):
    """Process a text legal query through the RAG pipeline."""
    try:
        result = await ask_legal_question(
            query=request.query,
            language=request.language,
            conversation_history=request.conversation_history,
            user_state=request.user_state,
        )
        result["conversation_id"] = request.conversation_id
        return result

    except Exception as e:
        logger.error("Text counsellor error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/voice")
async def ask_voice(
    audio: UploadFile = File(..., description="WAV/MP3 audio file (max 10MB)"),
    language: str = Form(default="hi"),
    user_state: str = Form(default="Maharashtra"),
    reply_voice: bool = Form(default=True),
    db: AsyncSession = Depends(get_db),
):
    """
    Full voice pipeline:
    1. Upload audio → Sarvam STT → text
    2. text → RAG → legal answer
    3. (optional) answer → Sarvam TTS → audio bytes
    """
    # Validate file size (10MB)
    audio_bytes = await audio.read()
    if len(audio_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Audio file too large. Max 10MB.")

    # Step 1: STT
    try:
        stt_result = await transcribe_audio(audio_bytes, language)
        query_text = stt_result["text"]
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Speech recognition failed: {str(e)}")

    # Step 2: RAG
    legal_result = await ask_legal_question(
        query=query_text,
        language=language,
        user_state=user_state,
    )

    # Step 3: TTS (optional)
    audio_response_b64 = None
    if reply_voice:
        try:
            audio_bytes_out = await synthesize_speech(legal_result["answer"][:400], language)
            import base64
            audio_response_b64 = base64.b64encode(audio_bytes_out).decode() if audio_bytes_out else None
        except Exception:
            pass

    return {
        "transcribed_text": query_text,
        "stt_confidence": stt_result.get("confidence", 0.9),
        "legal_response": legal_result,
        "audio_response_b64": audio_response_b64,
    }


@router.get("/demo")
async def get_demo_response():
    """
    Returns a demo legal consultation response — no API keys needed.
    Great for frontend development and demo purposes.
    """
    result = await ask_legal_question(
        query="Mera maalik 3 mahine se salary nahi de raha. Main kya karoon?",
        language="hi",
        user_state="Maharashtra",
    )
    return result
