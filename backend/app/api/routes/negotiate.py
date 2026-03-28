"""
Negotiation Coach API Router
POST /api/v1/negotiate/start     — Start a role-play scenario
POST /api/v1/negotiate/message   — Send message in role-play
POST /api/v1/negotiate/debrief   — Get post-session coaching analysis
GET  /api/v1/negotiate/scenarios — List available scenarios
"""
import json
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
import structlog

logger = structlog.get_logger()
router = APIRouter(prefix="/negotiate", tags=["Negotiation Coach"])

SCENARIOS = [
    {
        "id": "salary_negotiation",
        "title": "Salary Negotiation",
        "description": "Practice negotiating unpaid salary or raise with your employer/HR",
        "ai_persona": "HR Manager at a mid-size company in Mumbai",
        "difficulty": "beginner",
        "legal_context": "Payment of Wages Act 1936, Minimum Wages Act 1948",
        "tips": ["Always cite specific Act+Section", "Document all verbal agreements", "Set a firm deadline"],
    },
    {
        "id": "landlord_dispute",
        "title": "Landlord-Tenant Negotiation",
        "description": "Practice dealing with illegal eviction, rent hike, or deposit refusal",
        "ai_persona": "Aggressive landlord in Pune trying to evict a long-term tenant",
        "difficulty": "intermediate",
        "legal_context": "Maharashtra Rent Control Act 1999, Transfer of Property Act 1882",
        "tips": ["Know your rights under MRC Act", "Never vacate without court order", "Document all interactions"],
    },
    {
        "id": "consumer_dispute",
        "title": "Consumer Complaint Escalation",
        "description": "Practice escalating a complaint with an e-commerce company or bank",
        "ai_persona": "Customer Service Representative at a major e-commerce platform",
        "difficulty": "beginner",
        "legal_context": "Consumer Protection Act 2019, E-Commerce Rules 2020",
        "tips": ["Get everything in writing", "Escalate to Grievance Officer", "Mention Consumer Forum"],
    },
    {
        "id": "police_complaint",
        "title": "Police Station FIR Filing",
        "description": "Practice asserting your right to file an FIR when police are reluctant",
        "ai_persona": "Police officer at a Mumbai police station trying to discourage FIR filing",
        "difficulty": "advanced",
        "legal_context": "BNSS 2023, Section 173 (mandatory FIR registration)",
        "tips": ["BNSS 2023 makes FIR mandatory for cognizable offences", "SP can order FIR via Section 175", "Magistrate complaint is last resort"],
    },
    {
        "id": "insurance_claim",
        "title": "Insurance Claim Rejection",
        "description": "Practice disputing a rejected insurance claim",
        "ai_persona": "Insurance company claims officer who has sent a rejection letter",
        "difficulty": "intermediate",
        "legal_context": "Insurance Ombudsman Rules 2017, Consumer Protection Act 2019",
        "tips": ["Get rejection reasons in writing", "Request claim file documents", "File with Insurance Ombudsman (free)"],
    },
    {
        "id": "labour_commissioner",
        "title": "Labour Commissioner Hearing",
        "description": "Simulate presenting your wage complaint before a Labour Commissioner",
        "ai_persona": "Assistant Labour Commissioner conducting a conciliation hearing",
        "difficulty": "advanced",
        "legal_context": "Industrial Disputes Act 1947, Payment of Wages Act 1936",
        "tips": ["Bring all salary slips and communication", "State dates and amounts precisely", "Request conciliation order"],
    },
]

SYSTEM_PROMPTS = {
    "salary_negotiation": """You are playing the role of a stubborn HR Manager at XYZ Corporation in Mumbai. 
The user is an employee whose salary has been unpaid for 3 months (Rs. 45,000/month total: Rs. 1,35,000 owed).
Your initial position: "Company is going through difficult times. We'll pay when we can. Be patient."
Gradually yield based on the strength of legal arguments the user makes. If they cite specific Acts and Sections correctly, concede ground.
Score their performance: 0-100 based on legal accuracy, assertiveness, and outcome achieved.""",

    "landlord_dispute": """You are playing the role of an aggressive landlord in Pune who wants to evict a tenant.
Your initial position: "I need my flat back. You must leave in 7 days or I'll lock the flat."
Only back down if the user correctly cites: Maharashtra Rent Control Act 1999, Section 16 (eviction only via court).
If they don't know their rights, persist with threats.
Score their performance based on whether they avoided illegal eviction, cited correct law, and maintained composure.""",

    "consumer_dispute": """You are a Customer Service Rep at ShopFast (fictional e-commerce).
User's order was defective. You initially offer vouchers instead of refund.
Yield if user: (1) cites Consumer Protection Act 2019, (2) threatens Consumer Forum, (3) escalates to Grievance Officer.
Score based on whether they got full refund + compensation.""",

    "police_complaint": """You are a busy police officer. The user wants to file an FIR.
Initial position: "This is a civil matter. We can't file FIR for this. Go to a lawyer."
Only agree after user cites BNSS Section 173 (mandatory FIR for cognizable offences) or mentions Superintendent of Police.
Score based on legal knowledge and assertiveness.""",

    "insurance_claim": """You are a claims officer who has rejected the user's health insurance claim.
Stated reason: "Pre-existing condition clause applies."
If user asks for specific policy clauses in writing, disclosure documents, and mentions Insurance Ombudsman — gradually reconsider.
Score on whether they got claim reconsidered or proper escalation path.""",

    "labour_commissioner": """You are an Assistant Labour Commissioner conducting a conciliation hearing.
The user (employee) must present their case clearly with facts, amounts, and legal basis.
Ask targeted questions: "What Act Section are you relying on?" "What is the exact outstanding amount?" etc.
Score based on: legal clarity, documentation mentioned, and negotiation outcome.""",
}

DEBRIEF_PROMPT = """You are a senior Indian legal counsel. Analyze this negotiation session transcript and provide coaching feedback.

Evaluate on:
1. **Legal Knowledge** (0-25): Did they cite correct Acts and Sections?
2. **Assertiveness** (0-25): Did they hold their ground appropriately?
3. **Outcome** (0-25): Did they achieve their legal rights?
4. **Strategy** (0-25): Did they escalate correctly? Document requests?

Return a JSON response:
{
  "total_score": 0-100,
  "components": {"legal_knowledge": 0-25, "assertiveness": 0-25, "outcome": 0-25, "strategy": 0-25},
  "what_you_did_well": ["point 1", "point 2"],
  "missed_opportunities": ["point 1", "point 2"],
  "legal_rights_you_forgot": ["Right 1 — Act Section", "Right 2 — Act Section"],
  "ideal_next_phrase": "The strongest statement you could have made was...",
  "overall_feedback": "2-3 sentence summary"
}"""


class StartSessionRequest(BaseModel):
    scenario_id: str
    language: str = "hi"
    user_name: Optional[str] = None


class MessageRequest(BaseModel):
    session_id: str
    scenario_id: str
    user_message: str
    history: list[dict] = Field(default_factory=list)
    language: str = "hi"


class DebriefRequest(BaseModel):
    scenario_id: str
    transcript: list[dict]
    language: str = "hi"


@router.get("/scenarios")
async def list_scenarios():
    """List all available negotiation scenarios."""
    return {"scenarios": SCENARIOS, "total": len(SCENARIOS)}


@router.get("/scenarios/{scenario_id}")
async def get_scenario(scenario_id: str):
    scenario = next((s for s in SCENARIOS if s["id"] == scenario_id), None)
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario '{scenario_id}' not found.")
    return scenario


@router.post("/start")
async def start_session(req: StartSessionRequest, db: AsyncSession = Depends(get_db)):
    """Start a negotiation role-play session."""
    scenario = next((s for s in SCENARIOS if s["id"] == req.scenario_id), None)
    if not scenario:
        raise HTTPException(status_code=404, detail="Invalid scenario ID.")

    import uuid
    session_id = str(uuid.uuid4())
    system_prompt = SYSTEM_PROMPTS.get(req.scenario_id, "You are playing a negotiation role.")

    opening_message = await _get_ai_opening(req.scenario_id, req.language, system_prompt)

    return {
        "session_id": session_id,
        "scenario": scenario,
        "opening_message": opening_message,
        "instructions": f"You are negotiating with: {scenario['ai_persona']}. Use your legal knowledge wisely.",
        "legal_context": scenario["legal_context"],
        "tips": scenario["tips"],
    }


@router.post("/message")
async def send_message(req: MessageRequest, db: AsyncSession = Depends(get_db)):
    """Send a message in the role-play and get AI response + score update."""
    scenario = next((s for s in SCENARIOS if s["id"] == req.scenario_id), None)
    if not scenario:
        raise HTTPException(status_code=404, detail="Invalid scenario ID.")

    system_prompt = SYSTEM_PROMPTS.get(req.scenario_id, "")
    response, score_delta = await _get_ai_response(
        req.user_message, req.history, system_prompt, req.language, req.scenario_id
    )

    # Analyze if user cited laws correctly
    legal_points = _detect_legal_citations(req.user_message)

    return {
        "ai_response": response,
        "score_delta": score_delta,
        "legal_citations_detected": legal_points,
        "coaching_hint": _get_coaching_hint(req.user_message, req.scenario_id),
    }


@router.post("/debrief")
async def get_debrief(req: DebriefRequest):
    """Get comprehensive coaching feedback after a session."""
    transcript_text = "\n".join([
        f"{m['role'].upper()}: {m['content']}"
        for m in req.transcript
    ])

    if not settings.GROQ_API_KEY:
        return _mock_debrief(req.scenario_id)

    try:
        from groq import AsyncGroq
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        resp = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": DEBRIEF_PROMPT},
                {"role": "user", "content": f"Scenario: {req.scenario_id}\n\nTranscript:\n{transcript_text[:3000]}"},
            ],
            max_tokens=1024,
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        return json.loads(resp.choices[0].message.content)
    except Exception as e:
        logger.warning("Debrief AI failed", error=str(e))
        return _mock_debrief(req.scenario_id)


async def _get_ai_opening(scenario_id: str, language: str, system_prompt: str) -> str:
    """Get the AI's opening statement for a scenario."""
    if not settings.GROQ_API_KEY:
        openings = {
            "salary_negotiation": "Main samajhta hoon aap salary ke baare mein baat karna chahte hain. Dekho, company abhi mushkil daur se guzar rahi hai. Thoda baar karo.",
            "landlord_dispute": "Suno, main seedha baat karta hoon — mujhe apna ghar khaali chahiye. 7 din mein nikal jao, warna main khud lock laga doonga!",
            "consumer_dispute": "Hello! I see you have an issue with your recent order. I can offer you a 10% off coupon on your next purchase as goodwill gesture.",
            "police_complaint": "Dekho bhai, yeh civil matter lagta hai. Court jao seedha. Hum FIR nahi likhte aisi baaton ke liye.",
            "insurance_claim": "Thank you for calling. I've reviewed your claim file. Unfortunately, due to the pre-existing condition clause in your policy, we are unable to process this claim.",
            "labour_commissioner": "Both parties are present. Please state your full name, designation, and the nature of your grievance. Be precise.",
        }
        return openings.get(scenario_id, "Namaste. Let us begin the negotiation.")

    try:
        from groq import AsyncGroq
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        resp = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Start the role-play. Give a brief opening statement in {language} language. 2-3 sentences max. Be in character."},
            ],
            max_tokens=256, temperature=0.7,
        )
        return resp.choices[0].message.content
    except Exception:
        return "Let's begin. State your position."


async def _get_ai_response(
    user_message: str,
    history: list[dict],
    system_prompt: str,
    language: str,
    scenario_id: str,
) -> tuple[str, int]:
    """Get AI role-play response + score delta."""
    if not settings.GROQ_API_KEY:
        return _mock_ai_response(user_message, scenario_id), _estimate_score(user_message)

    try:
        from groq import AsyncGroq
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)

        messages = [{"role": "system", "content": system_prompt + f"\n\nRespond in {language} language. Stay in character. After your response, on a new line write: [SCORE_DELTA: +X or -X] based on quality of user's argument."}]
        for m in history[-8:]:
            messages.append({"role": m.get("role", "user"), "content": m.get("content", "")})
        messages.append({"role": "user", "content": user_message})

        resp = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            max_tokens=512, temperature=0.6,
        )
        content = resp.choices[0].message.content

        # Extract score delta if present
        score_delta = 0
        if "[SCORE_DELTA:" in content:
            parts = content.split("[SCORE_DELTA:")
            try:
                delta_str = parts[1].split("]")[0].strip()
                score_delta = int(delta_str.replace("+", ""))
                content = parts[0].strip()
            except Exception:
                pass

        return content, score_delta
    except Exception as e:
        logger.warning("Role-play AI failed", error=str(e))
        return _mock_ai_response(user_message, scenario_id), _estimate_score(user_message)


def _mock_ai_response(user_message: str, scenario_id: str) -> str:
    msg_lower = user_message.lower()

    if any(w in msg_lower for w in ["act", "section", "law", "court", "commissioner"]):
        return "Hmm... aapne legal reference diya. Dekhte hain kya ho sakta hai."
    if any(w in msg_lower for w in ["fir", "police", "complaint", "forum"]):
        return "Theek hai. Main authority se baat karta hoon aur ek hafte mein jawab doonga."
    return "Yeh meri final position hai. Aur kuch kehna hai aapko?"


def _estimate_score(user_message: str) -> int:
    msg_lower = user_message.lower()
    score = 0
    legal_words = ["act", "section", "court", "commissioner", "ipc", "bns", "bnss", "complaint", "notice"]
    for w in legal_words:
        if w in msg_lower:
            score += 5
    return min(score, 20)


def _detect_legal_citations(text: str) -> list[str]:
    """Detect explicitly cited laws in user's message."""
    citations = []
    acts = [
        "Payment of Wages Act", "Industrial Disputes Act", "Consumer Protection Act",
        "Transfer of Property Act", "Maharashtra Rent Control Act", "RTI Act",
        "BNS", "BNSS", "IPC", "CrPC", "IT Act", "DPDP", "RERA", "POSH",
    ]
    for act in acts:
        if act.lower() in text.lower():
            citations.append(act)
    return citations


def _get_coaching_hint(user_message: str, scenario_id: str) -> Optional[str]:
    """Return a contextual coaching tip based on what the user said."""
    msg_lower = user_message.lower()

    hints = {
        "salary_negotiation": {
            "no_act": "💡 Tip: Cite 'Payment of Wages Act 1936, Section 15' — it allows upto 20x compensation!",
            "good": "✅ Good citation! Also mention the 15-day notice deadline.",
        },
        "landlord_dispute": {
            "no_act": "💡 Tip: Quote 'Maharashtra Rent Control Act 1999, Section 16 — landlord CANNOT evict without court order'!",
            "good": "✅ Excellent! Also mention you'll file a complaint at Rent Control Authority.",
        },
    }

    scenario_hints = hints.get(scenario_id, {})
    if not _detect_legal_citations(user_message):
        return scenario_hints.get("no_act")
    return scenario_hints.get("good")


def _mock_debrief(scenario_id: str) -> dict:
    return {
        "total_score": 68,
        "components": {
            "legal_knowledge": 18,
            "assertiveness": 17,
            "outcome": 16,
            "strategy": 17,
        },
        "what_you_did_well": [
            "Maintained respectful tone throughout negotiation",
            "Clearly stated the amount owed and time period",
            "Did not accept the first counter-offer",
        ],
        "missed_opportunities": [
            "Did not cite Payment of Wages Act Section 15 (20x compensation clause)",
            "Did not mention filing complaint with Labour Commissioner",
            "Did not request payment in writing / acknowledgement",
        ],
        "legal_rights_you_forgot": [
            "Payment of Wages Act 1936, Section 15 — 20x compensation for delayed wages",
            "Industrial Disputes Act 1947, Section 33C — recovery of money through Labour Authority",
            "Maharashtra Shops & Establishment Act — employer must maintain wage register",
        ],
        "ideal_next_phrase": "Under Payment of Wages Act 1936, Section 15, I am entitled to claim Rs.1,35,000 (principal) plus compensation of upto Rs.27,00,000 (20x) before the Labour Authority. I am filing the complaint in 3 days unless payment is made.",
        "overall_feedback": "Good attempt with 68/100 score. Your assertiveness was strong but you missed key legal leverage points. The 20x compensation clause under PWA Section 15 is your most powerful tool — use it early to shift the power balance.",
    }
