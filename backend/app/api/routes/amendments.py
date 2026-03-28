"""
Amendment Tracker API Router
GET /api/v1/amendments/              — Latest amendments
GET /api/v1/amendments/ipc-bns       — Full IPC→BNS mapping table
GET /api/v1/amendments/translate/{section} — Translate specific IPC section
POST /api/v1/amendments/scrape       — Trigger manual scrape
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.database import get_db
from app.models.models import LawAmendment
from app.services.amendment_service import (
    get_ipc_bns_full_table, translate_ipc_to_bns,
    scrape_gazette, seed_amendments_to_db, SEED_AMENDMENTS
)
import structlog
from datetime import datetime

logger = structlog.get_logger()
router = APIRouter(prefix="/amendments", tags=["Amendment Tracker"])


@router.get("/")
async def get_amendments(
    category: str = None,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """Get latest law amendments from the DB (or seed data if DB empty)."""
    try:
        query = select(LawAmendment).order_by(desc(LawAmendment.gazette_date)).limit(limit)
        if category:
            query = query.where(LawAmendment.category == category)

        result = await db.execute(query)
        amendments = result.scalars().all()

        if not amendments:
            # Return seed data if DB is empty
            data = SEED_AMENDMENTS
            if category:
                data = [a for a in data if a.get("category") == category]
            return {"amendments": data, "total": len(data), "source": "seed"}

        return {
            "amendments": [
                {
                    "id": a.id,
                    "act_name": a.act_name,
                    "section": a.section,
                    "old_text": a.old_text,
                    "new_text": a.new_text,
                    "diff_summary": a.diff_summary,
                    "gazette_date": a.gazette_date.isoformat() if a.gazette_date else None,
                    "gazette_url": a.gazette_url,
                    "category": a.category,
                    "is_ipc_bns_mapping": a.is_ipc_bns_mapping,
                    "ipc_section": a.ipc_section,
                    "bns_section": a.bns_section,
                }
                for a in amendments
            ],
            "total": len(amendments),
            "source": "database",
        }

    except Exception as e:
        logger.warning("DB query failed, returning seed data", error=str(e))
        return {"amendments": SEED_AMENDMENTS, "total": len(SEED_AMENDMENTS), "source": "seed"}


@router.get("/ipc-bns")
async def get_ipc_bns_mapping():
    """Full IPC → BNS mapping table (80+ sections)."""
    return {"mapping": get_ipc_bns_full_table(), "effective_date": "1st July 2024"}


@router.get("/translate/{ipc_section}")
async def translate_section(ipc_section: str):
    """Translate a specific IPC section to BNS equivalent."""
    result = await translate_ipc_to_bns(ipc_section)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No BNS mapping found for IPC Section {ipc_section}. Section may be retained as is or repealed."
        )
    return result


@router.post("/seed")
async def seed_db(db: AsyncSession = Depends(get_db)):
    """Seed the database with hardcoded amendments (idempotent)."""
    count = await seed_amendments_to_db(db)
    return {"seeded": count, "message": f"{count} amendments added to database."}


@router.post("/scrape")
async def trigger_scrape(background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """Trigger a manual gazette scrape in the background."""
    background_tasks.add_task(_run_scrape, db)
    return {"message": "Gazette scrape started in background. Check /amendments in 30 seconds."}


async def _run_scrape(db: AsyncSession):
    """Background task for gazette scraping."""
    try:
        amendments = await scrape_gazette()
        for data in amendments:
            amendment = LawAmendment(
                act_name=data["act_name"],
                section=data.get("section", "Notification"),
                new_text=data["new_text"],
                diff_summary=data["diff_summary"],
                gazette_date=datetime.strptime(data["gazette_date"], "%Y-%m-%d"),
                gazette_url=data.get("gazette_url"),
                category=data.get("category", "general"),
            )
            db.add(amendment)
        await db.commit()
        logger.info("Gazette scrape completed", count=len(amendments))
    except Exception as e:
        logger.error("Background scrape failed", error=str(e))
