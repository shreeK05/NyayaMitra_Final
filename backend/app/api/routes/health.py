"""
Health & Admin API Router
GET /health     — App health check
GET /api/v1/rag/stats — ChromaDB stats
POST /api/v1/rag/seed — Load seed statutes into ChromaDB
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db, check_db_health
from app.core.config import settings
from app.rag.legal_brain import get_chroma_stats, load_statute_to_chroma

router = APIRouter(tags=["Health & Admin"])

SEED_STATUTES = [
    ("Payment of Wages Act 1936", "Section 3", "Responsibility for payment of wages: Every employer shall be responsible for the payment to persons employed by him of all wages required to be paid."),
    ("Payment of Wages Act 1936", "Section 15", "Claims arising out of deductions from wages or delay in payment of wages: An authority may direct the employer to pay the wages along with compensation not exceeding twenty times the amount of wages."),
    ("Industrial Disputes Act 1947", "Section 25F", "Conditions precedent to retrenchment of workmen: A workman employed for not less than 1 year shall be given 1 month written notice or wages in lieu. Compensation equal to 15 days wages for every completed year."),
    ("Industrial Disputes Act 1947", "Section 33C", "Recovery of money due from an employer: Any money due to an employee may be recovered by filing an application to the labour authority."),
    ("Consumer Protection Act 2019", "Section 2(11)", "Deficiency means any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance prescribed or under contract."),
    ("Consumer Protection Act 2019", "Section 35", "Complaint may be made to the District Commission for deficiency in goods or services for claims up to Rs. 1 crore."),
    ("Transfer of Property Act 1882", "Section 108(c)", "The lessor shall put the lessee in possession. The lessee shall have quiet enjoyment of the property without disturbance by the lessor."),
    ("Maharashtra Rent Control Act 1999", "Section 16", "No landlord shall recover possession from any tenant except in execution of a decree passed on one or more grounds mentioned in Section 15."),
    ("Bharatiya Nyaya Sanhita 2023", "Section 85", "Husband or relative of husband of a woman subjecting her to cruelty: imprisonment for a term which may extend to 3 years and fine."),
    ("Bharatiya Nyaya Sanhita 2023", "Section 103", "Punishment for murder: Death or imprisonment for life and fine."),
    ("RTI Act 2005", "Section 6", "Request for obtaining information: A person who desires to obtain any information under this Act shall make a request in writing to the CPIO."),
    ("RTI Act 2005", "Section 7", "The CPIO shall supply information within 30 days of the request. If information concerns the life or liberty of a person, it shall be provided within 48 hours."),
    ("Payment of Gratuity Act 1972", "Section 4", "Gratuity shall be payable to an employee who has rendered continuous service for not less than 5 years at the rate of 15 days wages for every year of service."),
    ("Protection of Women from Domestic Violence Act 2005", "Section 12", "An aggrieved person may apply to the Magistrate for relief: protection order, residence order, monetary relief, custody order."),
    ("IT Act 2000", "Section 66C", "Identity theft: Whoever, fraudulently or dishonestly makes use of the electronic signature, password or any other unique identification feature of any other person, shall be punished with imprisonment up to 3 years and fine of Rs. 1 lakh."),
    ("BNSS 2023", "Section 484", "Direction for grant of bail to person apprehending arrest (Anticipatory Bail): High Court or Court of Sessions may direct bail with conditions."),
    ("POCSO Act 2012", "Section 4", "Punishment for penetrative sexual assault on a child: Rigorous imprisonment for a term not less than 20 years, extendable to imprisonment for life, and fine."),
    ("Negotiable Instruments Act 1881", "Section 138", "Dishonour of cheque for insufficiency of funds: Imprisonment up to 2 years or penalty up to twice the amount of cheque, or both."),
    ("RERA 2016", "Section 18", "Return of amount and compensation: If a promoter fails to complete or deliver possession, the allottee may withdraw and the promoter shall return the amount with interest."),
    ("Maternity Benefit Act 1961", "Section 5", "Right to payment of maternity benefit: Every woman entitled to maternity benefit of 26 weeks (12 weeks for third child onwards)."),
    ("Employees PF Act 1952", "Section 7Q", "Interest on delayed payment: The employer shall pay simple interest at the rate of 12% per annum on delayed PF deposit."),
    ("POSH Act 2013", "Section 4", "Internal Complaints Committee: Every employer of a workplace with 10 or more employees shall constitute an Internal Complaints Committee."),
    ("Digital Personal Data Protection Act 2023", "Section 8", "Obligations of Data Fiduciary: Shall respond to data principal requests within a reasonable time. Shall erase data upon withdrawal of consent."),
    ("Consumer Protection E-Commerce Rules 2020", "Rule 6", "Duties of e-commerce entities: Display seller information, grievance officer contact, country of origin, estimated delivery date."),
    ("MGNREGA 2005", "Section 3", "Guarantee of rural employment: Every household whose adult members volunteer to do unskilled manual work shall be guaranteed at least 100 days of wage employment per financial year."),
    ("Factories Act 1948", "Section 59", "Overtime: Worker working more than 9 hours per day or 48 hours per week entitled to overtime wages at twice the ordinary rate."),
]


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Application health check with DB and vector DB status."""
    db_healthy = await check_db_health()
    chroma_stats = await get_chroma_stats()

    return {
        "status": "healthy" if db_healthy else "degraded",
        "app": settings.APP_NAME,
        "env": settings.APP_ENV,
        "database": "connected" if db_healthy else "disconnected",
        "vector_db": chroma_stats,
        "groq_configured": bool(settings.GROQ_API_KEY),
        "openai_configured": bool(settings.OPENAI_API_KEY),
        "sarvam_configured": bool(settings.SARVAM_API_KEY),
        "features": {
            "voice_counsellor": True,
            "document_generator": True,
            "document_decoder": True,
            "amendment_tracker": True,
            "case_tracker": True,
            "nyaya_score": True,
            "negotiation_coach": True,
        }
    }


@router.get("/api/v1/rag/stats")
async def rag_stats():
    """Get ChromaDB vector store statistics."""
    return await get_chroma_stats()


@router.post("/api/v1/rag/seed")
async def seed_chroma():
    """
    Seed ChromaDB with Indian law statute chunks.
    Call this once after setting up the backend.
    """
    loaded = 0
    failed = 0
    for act, section, text in SEED_STATUTES:
        success = await load_statute_to_chroma(act, section, text)
        if success:
            loaded += 1
        else:
            failed += 1

    return {
        "loaded": loaded,
        "failed": failed,
        "total": len(SEED_STATUTES),
        "message": f"Seeded {loaded}/{len(SEED_STATUTES)} statute chunks into ChromaDB.",
    }
