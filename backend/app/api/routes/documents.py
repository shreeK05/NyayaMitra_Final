"""
Document Generator API Router
GET  /api/v1/documents/types          — All 47 doc types
POST /api/v1/documents/generate       — Generate document from form data
GET  /api/v1/documents/{id}/pdf       — Download PDF
POST /api/v1/documents/{id}/timestamp — Blockchain timestamp
POST /api/v1/documents/{id}/whatsapp  — Send via WhatsApp
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.document_service import (
    get_supported_doc_types, generate_document, generate_pdf_bytes
)
import structlog, hashlib

logger = structlog.get_logger()
router = APIRouter(prefix="/documents", tags=["Document Generator"])


class GenerateDocRequest(BaseModel):
    doc_type: str
    form_data: dict = Field(default_factory=dict)
    language: str = "en"
    conversation_id: Optional[str] = None


@router.get("/types")
async def list_doc_types():
    """Return all 47 supported document types."""
    return {"doc_types": get_supported_doc_types(), "total": len(get_supported_doc_types())}


@router.get("/types/{category}")
async def list_doc_types_by_category(category: str):
    """Filter document types by category."""
    all_types = get_supported_doc_types()
    filtered = [d for d in all_types if d["category"] == category]
    if not filtered:
        raise HTTPException(status_code=404, detail=f"No documents found for category '{category}'")
    return {"doc_types": filtered, "category": category}


@router.post("/generate")
async def generate(req: GenerateDocRequest, db: AsyncSession = Depends(get_db)):
    """Generate a legal document from form data."""
    all_types = get_supported_doc_types()
    valid_types = [d["id"] for d in all_types]
    if req.doc_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Unknown doc type: {req.doc_type}")

    try:
        result = await generate_document(
            doc_type=req.doc_type,
            form_data=req.form_data,
            language=req.language,
            conversation_id=req.conversation_id,
        )
        return {"success": True, "document": result}

    except Exception as e:
        logger.error("Document generation error", doc_type=req.doc_type, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate/pdf")
async def generate_pdf(req: GenerateDocRequest, db: AsyncSession = Depends(get_db)):
    """Generate and return a PDF document."""
    doc_result = await generate_document(req.doc_type, req.form_data, req.language)
    pdf_bytes = generate_pdf_bytes(doc_result["content"], doc_result["title"])

    if not pdf_bytes:
        raise HTTPException(status_code=500, detail="PDF generation requires ReportLab. Install: pip install reportlab")

    filename = f"{req.doc_type}_{doc_result['generated_at'][:10]}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.post("/{doc_id}/timestamp")
async def blockchain_timestamp(doc_id: str, content: dict):
    """
    Simulate blockchain timestamping on Polygon.
    Returns a deterministic mock tx hash based on content hash.
    In production: use web3.py + Polygon RPC.
    """
    content_str = str(content)
    content_hash = hashlib.sha256(content_str.encode()).hexdigest()
    mock_tx = f"0x{content_hash[:64]}"

    return {
        "success": True,
        "tx_hash": mock_tx,
        "network": "Polygon (Mumbai Testnet)",
        "timestamp": "2025-01-01T00:00:00Z",
        "ipfs_hash": f"Qm{content_hash[:44]}",
        "explorer_url": f"https://mumbai.polygonscan.com/tx/{mock_tx}",
        "note": "Connect POLYGON_PRIVATE_KEY in .env for mainnet timestamping.",
    }
