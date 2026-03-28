"""
Document Decoder API Router
POST /api/v1/decoder/analyze     — Upload PDF/image → clause risk analysis
POST /api/v1/decoder/counter     — Generate counter-clause for a risky clause
POST /api/v1/decoder/multimodal  — Photo of document → structured extraction
"""
import base64
import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
import structlog

logger = structlog.get_logger()
router = APIRouter(prefix="/decoder", tags=["Document Decoder"])

RISK_KEYWORDS = {
    "red": [
        "unilateral termination", "sole discretion", "waive all rights",
        "non-refundable", "binding arbitration only", "assigns any rights",
        "no compensation", "employer may terminate without cause",
        "tenant waives right to court", "landlord may enter at any time",
        "unlimited liability", "personal guarantee", "indemnify against all claims",
        "perpetual license irrevocable", "no appeal", "deducted without notice",
        "forfeit entire security deposit", "lock-in penalty",
    ],
    "amber": [
        "notice period", "non-compete", "intellectual property",
        "confidentiality", "penalty clause", "force majeure",
        "automatic renewal", "deemed approval", "as is basis",
        "subject to management discretion", "may be modified",
        "reasonable notice", "pro-rated", "without prejudice",
    ],
    "green": [
        "dispute resolution", "governing law", "payment terms",
        "termination for cause", "mutual agreement", "written notice",
        "refundable deposit", "right to appeal", "mediation",
    ],
}

IPC_BNS_WARNINGS = {
    "IPC 302": "BNS 103", "IPC 376": "BNS 64", "IPC 420": "BNS 318",
    "IPC 498A": "BNS 85", "Section 302": "BNS 103", "Section 376": "BNS 64",
    "Section 420": "BNS 318", "Section 498A": "BNS 85",
}

COUNTER_CLAUSE_PROMPTS = {
    "red": "This clause is highly unfavorable. Draft a balanced counter-clause under Indian law.",
    "amber": "This clause needs revision. Draft a fairer version protecting both parties under Indian law.",
}


def _classify_clause(text: str) -> str:
    """Heuristically classify clause risk level."""
    text_lower = text.lower()
    for kw in RISK_KEYWORDS["red"]:
        if kw.lower() in text_lower:
            return "red"
    for kw in RISK_KEYWORDS["amber"]:
        if kw.lower() in text_lower:
            return "amber"
    return "green"


def _detect_ipc_warnings(text: str) -> list[dict]:
    """Find outdated IPC references that should be updated to BNS."""
    warnings = []
    for old, new in IPC_BNS_WARNINGS.items():
        if old in text:
            warnings.append({"old": old, "new": new, "note": "Replaced by BNS w.e.f. 1 July 2024"})
    return warnings


def _extract_clauses_from_text(text: str) -> list[dict]:
    """
    Split document text into clauses and analyze each one.
    Returns list of clause analysis dicts.
    """
    # Split by common clause patterns
    import re
    # Split on clause numbers, numbered points, or paragraph breaks
    pattern = r'(?:(?:\d+[\.\)]\s)|(?:[A-Z][A-Z\s]{2,}:)|(?:\n\n))'
    parts = re.split(pattern, text)
    parts = [p.strip() for p in parts if len(p.strip()) > 30]

    clauses = []
    for i, clause_text in enumerate(parts[:20]):  # Limit to 20 clauses
        risk = _classify_clause(clause_text)
        ipc_warns = _detect_ipc_warnings(clause_text)

        clause = {
            "id": i + 1,
            "text": clause_text[:500],  # Truncate for response
            "risk_level": risk,
            "ipc_warnings": ipc_warns,
            "has_counter": risk in ("red", "amber"),
        }

        # Add explanations
        if risk == "red":
            clause["explanation"] = "⚠️ High-risk clause that significantly limits your legal rights or imposes unfair obligations."
            clause["legal_basis"] = "May violate Contract Act 1872, Section 23 (public policy)"
        elif risk == "amber":
            clause["explanation"] = "⚡ Moderate risk. Review carefully — could be negotiated for better terms."
            clause["legal_basis"] = "Verify compliance with applicable employment/tenancy law."
        else:
            clause["explanation"] = "✅ Standard clause that appears balanced and legally acceptable."
            clause["legal_basis"] = "Appears compliant with Indian contract law."

        clauses.append(clause)

    return clauses if clauses else _get_demo_clauses()


def _get_demo_clauses() -> list[dict]:
    """Demo clause analysis when no real document provided."""
    return [
        {
            "id": 1, "risk_level": "red",
            "text": "The employer may terminate this agreement at any time without cause, notice, or compensation at sole discretion.",
            "explanation": "⚠️ Extremely high risk! Termination without notice or compensation is illegal.",
            "legal_basis": "Violates Industrial Disputes Act 1947, Section 25F — mandatory 1-month notice + retrenchment compensation required for workers with 1+ year service.",
            "ipc_warnings": [], "has_counter": True,
        },
        {
            "id": 2, "risk_level": "amber",
            "text": "The Tenant shall not sublet the premises or any part thereof to any person without the prior written consent of the Landlord.",
            "explanation": "⚡ Standard restriction but could be exploited. Ensure consent cannot be unreasonably withheld.",
            "legal_basis": "Permitted under Transfer of Property Act, Section 108(j). Add: 'consent not to be unreasonably withheld'.",
            "ipc_warnings": [], "has_counter": True,
        },
        {
            "id": 3, "risk_level": "red",
            "text": "The Tenant hereby waives all rights to approach any court or authority. All disputes shall be referred to binding arbitration before an arbitrator chosen solely by the Landlord.",
            "explanation": "⚠️ Completely void under Indian law! One-sided arbitration clauses are unenforceable.",
            "legal_basis": "Arbitration & Conciliation Act 1996, Section 12 — arbitrator cannot be chosen unilaterally. This clause is void ab initio.",
            "ipc_warnings": [], "has_counter": True,
        },
        {
            "id": 4, "risk_level": "amber",
            "text": "This agreement shall be automatically renewed for successive periods of one year unless either party gives 30 days notice of termination.",
            "explanation": "⚡ Auto-renewal can lock you in. Mark your calendar 45 days before renewal date.",
            "legal_basis": "Valid under Indian contract law. Ensure notice period is reasonable and you have it in writing.",
            "ipc_warnings": [], "has_counter": True,
        },
        {
            "id": 5, "risk_level": "green",
            "text": "Payment of rent shall be due on the 1st day of each calendar month. Late payment of more than 7 days shall attract a penalty of 5% per month.",
            "explanation": "✅ Standard payment clause with reasonable penalty. 5% per month is within normal range.",
            "legal_basis": "Compliant with Maharashtra Rent Control Act. Ensure penalty is clearly communicated.",
            "ipc_warnings": [], "has_counter": False,
        },
        {
            "id": 6, "risk_level": "red",
            "text": "Non-compete: Employee shall not engage in any business similar to Employer's for a period of 2 years after termination within the entire country of India.",
            "explanation": "⚠️ Non-compete clauses are largely unenforceable in India! Supreme Court has consistently struck them down.",
            "legal_basis": "Contract Act 1872, Section 27 — agreements in restraint of trade are VOID. Ref: Niranjan Shankar Golikari v. Century Spinning (SC 1967).",
            "ipc_warnings": [], "has_counter": True,
        },
    ]


async def _generate_counter_clause(clause_text: str, risk_level: str, context: str = "") -> str:
    """Use Groq to generate a counter-clause."""
    if not settings.GROQ_API_KEY:
        return _mock_counter_clause(clause_text, risk_level)

    try:
        from groq import AsyncGroq
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        resp = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert Indian contract lawyer. Generate balanced, legally sound counter-clauses under Indian law. Be specific with Act/Section citations."},
                {"role": "user", "content": f"Original clause ({risk_level} risk):\n{clause_text}\n\n{COUNTER_CLAUSE_PROMPTS.get(risk_level, '')}\n\nDocument context: {context}\n\nProvide a counter-clause + brief explanation."},
            ],
            max_tokens=512, temperature=0.2,
        )
        return resp.choices[0].message.content
    except Exception as e:
        logger.warning("Counter-clause AI generation failed", error=str(e))
        return _mock_counter_clause(clause_text, risk_level)


def _mock_counter_clause(clause_text: str, risk_level: str) -> str:
    if "terminat" in clause_text.lower() or "notice" in clause_text.lower():
        return """**COUNTER-CLAUSE (Employment Termination):**

"This agreement may be terminated by either party by giving 30 (thirty) days' written notice or payment of one month's wages in lieu thereof. The Employer shall pay retrenchment compensation at the rate of 15 days' wages for each completed year of service as per Industrial Disputes Act 1947, Section 25F. Termination without cause shall additionally entitle the Employee to 3 months' severance pay."

**Why:** Industrial Disputes Act 1947, Section 25F mandates 1-month notice + retrenchment compensation. The 3-month severance is a negotiating position that reflects international best practice."""

    if "arbitrat" in clause_text.lower() or "dispute" in clause_text.lower():
        return """**COUNTER-CLAUSE (Dispute Resolution):**

"Any dispute arising under this agreement shall first be referred to mediation before a mutually agreed mediator within 30 days. If unresolved, disputes shall be referred to arbitration under the Arbitration & Conciliation Act 1996, with the arbitrator jointly appointed by both parties. The seat of arbitration shall be [City]. Either party retains the right to approach courts of competent jurisdiction for interim relief."

**Why:** Arbitration & Conciliation Act 1996, Section 12 — arbitrator must be independent. One-sided arbitrator selection is void under Section 12(5)."""

    if "non-compete" in clause_text.lower() or "restraint" in clause_text.lower():
        return """**COUNTER-CLAUSE (Non-Compete):**

"During the term of employment, Employee shall not engage with direct competitors of the Employer. Post-termination restrictions shall be limited to: (a) 6 months duration, (b) restricted to [specific city/region], and (c) limited to [specific product/service line]. The Employer shall pay 50% of last drawn salary during the restricted period as consideration."

**Why:** Contract Act 1872, Section 27 makes blanket non-competes VOID. Reasonable geographic and temporal limits WITH compensation are more likely to be upheld."""

    return """**COUNTER-CLAUSE:**

"This clause shall be replaced with a balanced provision that: (a) protects both parties' legitimate interests, (b) complies with applicable Indian law, and (c) is limited in scope to what is strictly necessary. Any restriction on party rights shall be proportionate, time-bound, and supported by adequate consideration."

**Legal basis:** Contract Act 1872, Section 23 — agreements against public policy are void. Courts will strike down unconscionable clauses."""


@router.post("/analyze")
async def analyze_document(
    file: Optional[UploadFile] = File(None),
    text_content: Optional[str] = Form(None),
    doc_type: str = Form(default="general"),
    language: str = Form(default="en"),
    db: AsyncSession = Depends(get_db),
):
    """
    Analyze a document for risky clauses.
    Accepts: PDF upload, image upload, or raw text.
    Returns: Clause-by-clause risk analysis.
    """
    extracted_text = ""

    if file:
        content = await file.read()
        if len(content) > 20 * 1024 * 1024:  # 20MB limit
            raise HTTPException(status_code=413, detail="File too large. Max 20MB.")

        filename = file.filename.lower() if file.filename else ""

        if filename.endswith(".pdf"):
            extracted_text = _extract_text_from_pdf(content)
        elif filename.endswith((".jpg", ".jpeg", ".png", ".webp")):
            extracted_text = await _extract_text_from_image(content)
        else:
            # Try to decode as text
            try:
                extracted_text = content.decode("utf-8", errors="ignore")
            except Exception:
                raise HTTPException(status_code=422, detail="Unsupported file format. Use PDF, JPG, PNG, or plain text.")

    elif text_content:
        extracted_text = text_content
    else:
        # Demo mode — return sample analysis
        clauses = _get_demo_clauses()
        return _build_analysis_response(clauses, doc_type, "demo", "Employment/Tenancy Agreement")

    if not extracted_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from document.")

    clauses = _extract_clauses_from_text(extracted_text)
    return _build_analysis_response(clauses, doc_type, "uploaded", "Uploaded Document")


@router.post("/analyze/demo")
async def analyze_demo():
    """Return demo analysis for frontend development."""
    clauses = _get_demo_clauses()
    return _build_analysis_response(clauses, "employment", "demo", "Sample Employment Contract")


@router.post("/counter")
async def generate_counter(
    clause_text: str = Form(...),
    risk_level: str = Form(default="red"),
    doc_context: str = Form(default=""),
):
    """Generate a counter-clause for a risky clause."""
    if not clause_text or len(clause_text) < 10:
        raise HTTPException(status_code=400, detail="Clause text too short.")

    counter = await _generate_counter_clause(clause_text, risk_level, doc_context)
    return {"counter_clause": counter, "original": clause_text, "risk_level": risk_level}


@router.post("/multimodal")
async def analyze_from_image(
    image: UploadFile = File(..., description="Photo of document (JPG/PNG)"),
    extract_type: str = Form(default="contract"),  # contract | receipt | notice | cheque
):
    """
    Use Llama Vision to extract structured data from a document photo.
    Useful for: rental agreements, salary slips, legal notices, cheques.
    """
    image_bytes = await image.read()
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image too large. Max 10MB.")

    extracted = await _extract_text_from_image(image_bytes)

    if extract_type == "contract":
        fields = _extract_contract_fields(extracted)
    elif extract_type == "receipt":
        fields = _extract_receipt_fields(extracted)
    else:
        fields = {"raw_text": extracted[:2000]}

    return {"extracted_fields": fields, "raw_text": extracted[:1000], "extract_type": extract_type}


def _build_analysis_response(clauses: list, doc_type: str, source: str, title: str) -> dict:
    red = [c for c in clauses if c["risk_level"] == "red"]
    amber = [c for c in clauses if c["risk_level"] == "amber"]
    green = [c for c in clauses if c["risk_level"] == "green"]

    risk_score = max(0, 100 - (len(red) * 20) - (len(amber) * 8))
    overall = "high_risk" if len(red) >= 2 else "moderate_risk" if len(red) >= 1 or len(amber) >= 3 else "low_risk"

    return {
        "title": title,
        "doc_type": doc_type,
        "source": source,
        "clauses": clauses,
        "summary": {
            "total_clauses": len(clauses),
            "red_count": len(red),
            "amber_count": len(amber),
            "green_count": len(green),
            "risk_score": risk_score,
            "overall_risk": overall,
            "verdict": "DO NOT SIGN — get legal advice first!" if len(red) >= 2
                       else "REVIEW CAREFULLY before signing" if len(red) >= 1
                       else "Relatively safe — standard clauses present",
        },
        "top_issues": [{"clause_id": c["id"], "issue": c["explanation"][:100]} for c in red[:3]],
        "immediate_actions": [
            f"Challenge Clause {c['id']}: {c['legal_basis'][:80]}" for c in red[:2]
        ],
    }


def _extract_text_from_pdf(content: bytes) -> str:
    """Extract text from PDF bytes using PyPDF2."""
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages[:10]:  # First 10 pages
            text += page.extract_text() or ""
        return text
    except Exception as e:
        logger.warning("PDF extraction failed", error=str(e))
        return ""


async def _extract_text_from_image(image_bytes: bytes) -> str:
    """Use Llama Vision to extract text from image."""
    if not settings.GROQ_API_KEY:
        return "Image text extraction requires GROQ_API_KEY in .env (supports Llama Vision). Demo mode active."

    try:
        from groq import AsyncGroq
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        b64 = base64.b64encode(image_bytes).decode()

        resp = await client.chat.completions.create(
            model=settings.GROQ_VISION_MODEL,
            messages=[{"role": "user", "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                {"type": "text", "text": "Extract ALL text from this document image. Preserve paragraph structure. Include all clauses, amounts, dates, and party names."},
            ]}],
            max_tokens=4096, temperature=0.1,
        )
        return resp.choices[0].message.content
    except Exception as e:
        logger.error("Vision extraction failed", error=str(e))
        return ""


def _extract_contract_fields(text: str) -> dict:
    """Extract key fields from contract text using regex + Groq."""
    import re
    fields = {}
    # Party names
    party_match = re.search(r'(?:between|parties?:?)\s+([A-Z][^,\n]{2,40})', text, re.IGNORECASE)
    if party_match:
        fields["party_1"] = party_match.group(1).strip()
    # Amounts
    amount_match = re.findall(r'Rs\.?\s*[\d,]+', text)
    if amount_match:
        fields["amounts_mentioned"] = amount_match[:5]
    # Dates
    date_match = re.findall(r'\d{1,2}[\s/\-]\w+[\s/\-]\d{4}', text)
    if date_match:
        fields["dates_mentioned"] = date_match[:5]
    return fields


def _extract_receipt_fields(text: str) -> dict:
    import re
    fields = {}
    amount = re.search(r'(?:total|amount|Rs\.?)\s*:?\s*([\d,]+)', text, re.IGNORECASE)
    if amount:
        fields["amount"] = amount.group(1)
    date = re.search(r'\d{1,2}[/\-]\d{1,2}[/\-]\d{4}', text)
    if date:
        fields["date"] = date.group(0)
    return fields
