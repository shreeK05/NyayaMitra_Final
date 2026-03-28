"""
Case Tracker API Router
POST /api/v1/cases/            — Create new case
GET  /api/v1/cases/            — List user cases
GET  /api/v1/cases/{id}        — Get case details + timeline
PUT  /api/v1/cases/{id}        — Update case
POST /api/v1/cases/{id}/events — Add timeline event
GET  /api/v1/cases/limitation/{type} — Limitation period lookup
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.database import get_db
from app.models.models import Case, TimelineEvent, CaseStatus
from app.rag.legal_brain import LIMITATION_PERIODS
import structlog, uuid

logger = structlog.get_logger()
router = APIRouter(prefix="/cases", tags=["Case Tracker"])

SAMPLE_CASES = [
    {
        "id": "demo-001",
        "title": "Unpaid Salary — Rahul vs XYZ Corp",
        "case_type": "wage_dispute",
        "status": "active",
        "facts": "3 months salary not paid (Rs. 75,000). HR ignoring calls.",
        "acts_relevant": ["Payment of Wages Act 1936", "Industrial Disputes Act 1947"],
        "limitation_date": (datetime.now() + timedelta(days=730)).isoformat(),
        "next_step": "Send Registered Notice via Speed Post (15 days deadline)",
        "created_at": (datetime.now() - timedelta(days=12)).isoformat(),
        "timeline": [
            {"id": "t1", "label": "Employment Start", "is_done": True, "is_current": False, "description": "Joined XYZ Corp", "event_date": "2022-01-15"},
            {"id": "t2", "label": "Salary Stopped", "is_done": True, "is_current": False, "description": "Last salary received October 2024", "event_date": "2024-10-31"},
            {"id": "t3", "label": "HR Confronted", "is_done": True, "is_current": True, "description": "Verbal complaints made — HR unresponsive", "event_date": "2025-01-10"},
            {"id": "t4", "label": "Send Legal Notice", "is_done": False, "is_current": False, "description": "15-day registered notice to employer", "event_date": None},
            {"id": "t5", "label": "Labour Commissioner", "is_done": False, "is_current": False, "description": "File complaint if notice ignored", "event_date": None},
            {"id": "t6", "label": "Labour Court", "is_done": False, "is_current": False, "description": "File Section 33C application if needed", "event_date": None},
        ],
    },
    {
        "id": "demo-002",
        "title": "Illegal Eviction Threat — Tenant Rights",
        "case_type": "property",
        "status": "pending",
        "facts": "Landlord threatening eviction without court order. Maharashtra.",
        "acts_relevant": ["Maharashtra Rent Control Act 1999", "Transfer of Property Act 1882"],
        "limitation_date": (datetime.now() + timedelta(days=1082)).isoformat(),
        "next_step": "Reply notice + file complaint at Rent Control Authority",
        "created_at": (datetime.now() - timedelta(days=3)).isoformat(),
        "timeline": [
            {"id": "t1", "label": "Eviction Notice Received", "is_done": True, "is_current": True, "description": "Verbal and written threat from landlord", "event_date": datetime.now().strftime("%Y-%m-%d")},
            {"id": "t2", "label": "Send Reply Legal Notice", "is_done": False, "is_current": False, "description": "Assert tenant rights under MRC Act", "event_date": None},
            {"id": "t3", "label": "Rent Control Authority", "is_done": False, "is_current": False, "description": "File formal complaint if landlord persists", "event_date": None},
        ],
    },
]


class CreateCaseRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=256)
    case_type: str
    facts: str = Field(..., min_length=10)
    acts_relevant: list[str] = Field(default_factory=list)
    limitation_date: Optional[datetime] = None
    user_id: Optional[str] = None


class AddEventRequest(BaseModel):
    label: str
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    is_done: bool = False
    is_current: bool = False


@router.get("/")
async def list_cases(user_id: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """Get all cases for a user (returns sample data if DB empty)."""
    try:
        result = await db.execute(
            select(Case).order_by(desc(Case.created_at)).limit(50)
        )
        cases = result.scalars().all()
        if not cases:
            return {"cases": SAMPLE_CASES, "total": len(SAMPLE_CASES), "source": "demo"}

        return {
            "cases": [_case_to_dict(c) for c in cases],
            "total": len(cases),
            "source": "database",
        }
    except Exception as e:
        logger.warning("Cases DB query failed", error=str(e))
        return {"cases": SAMPLE_CASES, "total": len(SAMPLE_CASES), "source": "demo"}


@router.post("/")
async def create_case(req: CreateCaseRequest, db: AsyncSession = Depends(get_db)):
    """Create a new case with auto-computed limitation period."""
    limit_days = LIMITATION_PERIODS.get(req.case_type, 1095)
    limit_date = req.limitation_date or (datetime.now() + timedelta(days=limit_days))

    case = Case(
        id=str(uuid.uuid4()),
        user_id=req.user_id or "anonymous",
        title=req.title,
        case_type=req.case_type,
        facts_encrypted=req.facts,  # In prod: AES-256 encrypt before storing
        acts_relevant=req.acts_relevant,
        limitation_date=limit_date,
        next_step=_suggest_next_step(req.case_type),
        status=CaseStatus.active,
    )
    db.add(case)
    await db.flush()

    # Auto-create first timeline event
    event = TimelineEvent(
        case_id=case.id,
        label="Case Registered on NyayaMitra",
        description=f"Case '{req.title}' registered. AI analysis completed.",
        is_done=True,
        is_current=False,
        event_date=datetime.now(),
    )
    db.add(event)
    await db.commit()

    return {"success": True, "case": _case_to_dict(case), "limitation_days": limit_days}


@router.get("/demo")
async def get_demo_cases():
    """Return demo cases for frontend development."""
    return {"cases": SAMPLE_CASES, "total": len(SAMPLE_CASES)}


@router.get("/limitation/{case_type}")
async def get_limitation_period(case_type: str):
    """Get limitation period for a specific case type."""
    days = LIMITATION_PERIODS.get(case_type)
    if not days:
        # Return all limitation periods
        return {
            "limitation_periods": [
                {"case_type": k, "days": v, "years": round(v / 365, 1)}
                for k, v in LIMITATION_PERIODS.items()
            ]
        }
    deadline = datetime.now() + timedelta(days=days)
    return {
        "case_type": case_type,
        "limitation_days": days,
        "limitation_years": round(days / 365, 1),
        "deadline_from_today": deadline.strftime("%d %B %Y"),
        "legal_basis": _get_limitation_act(case_type),
    }


@router.get("/{case_id}")
async def get_case(case_id: str, db: AsyncSession = Depends(get_db)):
    """Get case details with full timeline."""
    # Check demo cases
    demo = next((c for c in SAMPLE_CASES if c["id"] == case_id), None)
    if demo:
        return demo

    try:
        result = await db.execute(select(Case).where(Case.id == case_id))
        case = result.scalar_one_or_none()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found.")

        events_result = await db.execute(
            select(TimelineEvent).where(TimelineEvent.case_id == case_id)
        )
        events = events_result.scalars().all()
        case_dict = _case_to_dict(case)
        case_dict["timeline"] = [_event_to_dict(e) for e in events]
        return case_dict
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{case_id}/events")
async def add_timeline_event(case_id: str, req: AddEventRequest, db: AsyncSession = Depends(get_db)):
    """Add a new event to the case timeline."""
    event = TimelineEvent(
        case_id=case_id,
        label=req.label,
        description=req.description,
        event_date=req.event_date,
        is_done=req.is_done,
        is_current=req.is_current,
    )
    db.add(event)
    await db.commit()
    return {"success": True, "event": _event_to_dict(event)}


def _suggest_next_step(case_type: str) -> str:
    steps = {
        "wage_dispute": "Send 15-day Registered Legal Notice to employer (Speed Post + AD)",
        "property": "Reply to eviction notice + file Rent Control Authority complaint",
        "consumer_complaint": "File complaint at District Consumer Disputes Redressal Commission",
        "criminal_complaint": "File FIR at nearest police station or approach Judicial Magistrate",
        "family_matter": "Consult DLSA for free legal aid lawyer — 15100",
        "cheque_bounce": "Send Section 138 NI Act notice within 30 days of bounce",
        "cyber_crime": "File complaint at cybercrime.gov.in + nearest Cyber Cell",
    }
    return steps.get(case_type, "Consult DLSA (District Legal Services Authority) — Helpline: 15100")


def _get_limitation_act(case_type: str) -> str:
    acts = {
        "wage_dispute": "Limitation Act 1963, Article 137 — 3 years from date of refusal",
        "consumer_complaint": "Consumer Protection Act 2019, Section 69 — 2 years from cause of action",
        "property_dispute": "Limitation Act 1963, Article 65 — 12 years for adverse possession",
        "cheque_bounce": "Negotiable Instruments Act 1881, Section 138 — 30 days from last notice",
        "criminal_complaint": "Bharatiya Nagarik Suraksha Sanhita 2023 — varies by offence",
    }
    return acts.get(case_type, "Limitation Act 1963 — varies by type. Consult DLSA.")


def _case_to_dict(case: Case) -> dict:
    return {
        "id": case.id,
        "title": case.title,
        "case_type": case.case_type,
        "status": case.status,
        "facts": case.facts_encrypted,  # In prod: decrypt here
        "acts_relevant": case.acts_relevant or [],
        "limitation_date": case.limitation_date.isoformat() if case.limitation_date else None,
        "next_step": case.next_step,
        "created_at": case.created_at.isoformat() if case.created_at else None,
    }


def _event_to_dict(event: TimelineEvent) -> dict:
    return {
        "id": event.id,
        "label": event.label,
        "description": event.description,
        "event_date": event.event_date.isoformat() if event.event_date else None,
        "is_done": event.is_done,
        "is_current": event.is_current,
    }
