"""
NyayaScore API Router
GET  /api/v1/score/{user_id}    — Get user's NyayaScore breakdown
POST /api/v1/score/compute      — Compute/recalculate score
GET  /api/v1/score/checklist    — Protection checklist items
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter(prefix="/score", tags=["NyayaScore"])


class ScoreInput(BaseModel):
    has_employment_contract: bool = False
    has_rent_agreement: bool = False
    agreement_decoded: bool = False
    pf_enrolled: bool = False
    consumer_insurance: bool = False
    emergency_contacts_set: bool = False
    docs_backed_up: bool = False
    whatsapp_alerts: bool = False
    aadhaar_linked: bool = False
    active_cases_count: int = 0


@router.post("/compute")
async def compute_nyaya_score(data: ScoreInput):
    """
    Compute NyayaScore based on user's legal protection checklist.
    Each component is scored 0-100. Total = weighted average.
    """
    # Employment Score (weight 25%)
    emp_score = 0
    emp_issues = []
    if data.has_employment_contract:
        emp_score += 50
    else:
        emp_issues.append("No written employment contract")
    if data.pf_enrolled:
        emp_score += 30
    else:
        emp_issues.append("PF/ESIC not enrolled")
    if data.agreement_decoded:
        emp_score += 20
    else:
        emp_issues.append("Contract not reviewed for illegal clauses")

    # Tenancy Score (weight 20%)
    ten_score = 0
    ten_issues = []
    if data.has_rent_agreement:
        ten_score += 50
    else:
        ten_issues.append("No registered rent agreement")
    if data.agreement_decoded:
        ten_score += 30
    else:
        ten_issues.append("Rent agreement not decoded for risk")
    ten_score = min(ten_score, 100)

    # Consumer Score (weight 20%)
    con_score = 0
    con_issues = []
    if data.consumer_insurance:
        con_score += 60
    else:
        con_issues.append("No consumer protection insurance")
    if data.aadhaar_linked:
        con_score += 40
    else:
        con_issues.append("Aadhaar not linked for fraud protection")

    # Personal Safety (weight 15%)
    safety_score = 40
    safety_issues = []
    if data.emergency_contacts_set:
        safety_score += 40
    else:
        safety_issues.append("No emergency contacts set")
    if data.aadhaar_linked:
        safety_score += 20

    # Document Readiness (weight 20%)
    doc_score = 0
    doc_issues = []
    if data.docs_backed_up:
        doc_score += 50
    else:
        doc_issues.append("Important documents not digitally backed up")
    if data.whatsapp_alerts:
        doc_score += 30
    else:
        doc_issues.append("Law alert notifications not enabled")
    if data.aadhaar_linked:
        doc_score += 20

    # Case Penalty
    case_penalty = min(data.active_cases_count * 5, 20)

    # Weighted total
    total = (
        emp_score * 0.25 +
        ten_score * 0.20 +
        con_score * 0.20 +
        safety_score * 0.15 +
        doc_score * 0.20
    ) - case_penalty

    total = max(0, min(int(total), 100))

    status = "At Risk" if total < 40 else "Fair" if total < 60 else "Good" if total < 80 else "Protected"
    color = "#ef4444" if total < 40 else "#f59e0b" if total < 60 else "#10b981" if total < 80 else "#7c3aed"

    return {
        "total_score": total,
        "status": status,
        "color": color,
        "components": {
            "employment": {"score": emp_score, "weight": 25, "issues": emp_issues},
            "tenancy": {"score": ten_score, "weight": 20, "issues": ten_issues},
            "consumer": {"score": con_score, "weight": 20, "issues": con_issues},
            "personal_safety": {"score": safety_score, "weight": 15, "issues": safety_issues},
            "document_readiness": {"score": doc_score, "weight": 20, "issues": doc_issues},
        },
        "all_issues": emp_issues + ten_issues + con_issues + safety_issues + doc_issues,
        "improvement_priority": _get_improvement_priority(emp_score, ten_score, con_score, safety_score, doc_score),
    }


def _get_improvement_priority(emp, ten, con, safety, doc) -> list[dict]:
    scores = [
        ("Employment Contract", emp, "/decoder", "+15 points"),
        ("Tenancy Safety", ten, "/decoder", "+12 points"),
        ("Consumer Protection", con, "/", "+10 points"),
        ("Document Readiness", doc, "/", "+8 points"),
        ("Personal Safety", safety, "/", "+5 points"),
    ]
    scores.sort(key=lambda x: x[1])
    return [
        {"action": f"Improve {name}", "estimated_gain": gain, "path": path}
        for name, score, path, gain in scores[:3]
        if score < 70
    ]


@router.get("/checklist")
async def get_protection_checklist():
    """Return the legal protection checklist items."""
    return {
        "checklist": [
            {"id": "employment_contract", "label": "Have a written employment contract", "category": "employment", "score_impact": 12},
            {"id": "pf_enrolled", "label": "PF/ESIC enrollment confirmed", "category": "employment", "score_impact": 8},
            {"id": "rent_agreement", "label": "Registered rent agreement in hand", "category": "tenancy", "score_impact": 10},
            {"id": "agreement_decoded", "label": "Contract decoded for illegal clauses", "category": "general", "score_impact": 8},
            {"id": "consumer_insurance", "label": "UPI/consumer fraud insurance active", "category": "consumer", "score_impact": 12},
            {"id": "emergency_contacts", "label": "Emergency SOS contacts added", "category": "safety", "score_impact": 8},
            {"id": "docs_backed_up", "label": "Legal documents digitally backed up", "category": "general", "score_impact": 10},
            {"id": "whatsapp_alerts", "label": "WhatsApp law alerts enabled", "category": "general", "score_impact": 5},
            {"id": "aadhaar_linked", "label": "Aadhaar-linked bank account verified", "category": "general", "score_impact": 7},
            {"id": "will_nomination", "label": "Will / bank nominations updated", "category": "general", "score_impact": 8},
        ]
    }
