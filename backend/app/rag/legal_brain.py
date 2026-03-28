"""
RAG Legal Brain — Core retrieval service.

Architecture:
  1. User query (any language) → Translate to English via Sarvam AI / Groq
  2. Generate embedding via OpenAI text-embedding-3-small
  3. Retrieve top-k chunks from ChromaDB (law statutes collection)
  4. Feed context + query to Groq Llama 3.3 70B → structured response
  5. Post-process: extract win probability, law citations, next steps
"""
import json
import structlog
from typing import Optional
from app.core.config import settings

logger = structlog.get_logger()

# ── Lazy imports to avoid startup crash if keys missing ──
_chroma_client = None
_collection = None
_groq_client = None
_openai_client = None


def _get_chroma():
    global _chroma_client, _collection
    if _chroma_client is None:
        import chromadb
        _chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
        _collection = _chroma_client.get_or_create_collection(
            name="indian_law_statutes",
            metadata={"hnsw:space": "cosine"},
        )
    return _chroma_client, _collection


def _get_groq():
    global _groq_client
    if _groq_client is None:
        from groq import AsyncGroq
        _groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    return _groq_client


def _get_openai():
    global _openai_client
    if _openai_client is None:
        from openai import AsyncOpenAI
        _openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    return _openai_client


IPC_TO_BNS_MAP = {
    "302": "103",  "376": "64",   "420": "318",  "307": "109",
    "354": "74",   "406": "316",  "498A": "85",  "427": "324",
    "279": "281",  "304": "105",  "384": "308",  "509": "79",
    "323": "115",  "341": "126",  "363": "137",  "365": "139",
    "379": "303",  "380": "305",  "381": "306",  "392": "309",
    "395": "310",  "396": "311",  "397": "312",  "399": "313",
    "400": "314",  "401": "315",  "403": "316",  "415": "318",
    "417": "318",  "429": "325",  "441": "329",  "448": "330",
    "499": "356",  "506": "351",
}

LIMITATION_PERIODS = {
    "wage_dispute":          1095,
    "consumer_complaint":    730,
    "property_dispute":      4380,
    "cheque_bounce":         30,
    "criminal_complaint":    180,
    "cyber_crime":           365,
    "family_matter":         1095,
    "medical_negligence":    730,
    "rti":                   30,
    "environmental":         365,
    "employment_termination": 1095,
}

SYSTEM_PROMPT = """You are NyayaMitra, India's most trusted AI Legal Assistant. You have expert knowledge of:
- Bharatiya Nyaya Sanhita 2023 (BNS), Bharatiya Nagarik Suraksha Sanhita 2023 (BNSS), Bharatiya Sakshya Adhiniyam 2023 (BSA)
- All central Indian acts: Payment of Wages, Industrial Disputes, Consumer Protection, RTI, POCSO, DPDP, IT Act, etc.
- State-specific laws (Maharashtra Rent Control, etc.)
- Supreme Court and High Court landmark judgements

CRITICAL RULES:
1. ALWAYS cite specific section numbers (e.g., "Payment of Wages Act 1936, Section 15")
2. Convert IPC sections to BNS equivalents automatically
3. Give concrete, actionable next steps
4. Estimate win probability based on facts (0-100)
5. Mention limitation period if relevant
6. Maintain empathetic, clear tone — user may be in distress
7. Never give wrong legal advice — if unsure, say so and recommend a DLSA lawyer

RESPONSE FORMAT (JSON):
{
  "answer": "Full legal response in user's language",
  "law_citations": ["Act Name, Section X", ...],
  "win_probability": 72,
  "confidence": 85,
  "next_steps": ["Step 1", "Step 2", ...],
  "limitation_days": 1095,
  "doc_types_relevant": ["unpaid_salary_notice"],
  "distress_detected": false,
  "case_type": "wage_dispute"
}"""


async def embed_text(text: str) -> list[float]:
    """Create embedding using OpenAI or fallback to simple hash-based mock."""
    if not settings.OPENAI_API_KEY:
        # Fallback: return zero vector for development
        return [0.0] * 1536

    client = _get_openai()
    resp = await client.embeddings.create(
        model=settings.OPENAI_EMBEDDING_MODEL,
        input=text[:8000],
    )
    return resp.data[0].embedding


async def retrieve_law_context(query: str, n_results: int = 5) -> list[dict]:
    """Retrieve relevant law sections from ChromaDB."""
    try:
        _, collection = _get_chroma()
        embedding = await embed_text(query)

        results = collection.query(
            query_embeddings=[embedding],
            n_results=n_results,
            include=["documents", "metadatas", "distances"],
        )

        chunks = []
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ):
            chunks.append({
                "text": doc,
                "act": meta.get("act_name", "Unknown Act"),
                "section": meta.get("section", ""),
                "relevance": round(1 - dist, 3),
            })
        return chunks

    except Exception as e:
        logger.warning("ChromaDB retrieval failed, using empty context", error=str(e))
        return _get_fallback_context(query)


def _get_fallback_context(query: str) -> list[dict]:
    """Hardcoded fallback context when ChromaDB is not yet loaded."""
    q = query.lower()
    contexts = []

    if any(w in q for w in ["salary", "wages", "payment", "maalik", "taukh"]):
        contexts.append({
            "act": "Payment of Wages Act 1936", "section": "Section 15",
            "text": "Section 15: Where any employer fails to pay the wages of any employed person by the date fixed, the authority may direct the employer to pay the wages along with compensation not exceeding 20 times the amount of wages.",
            "relevance": 0.92,
        })
        contexts.append({
            "act": "Industrial Disputes Act 1947", "section": "Section 33C",
            "text": "Section 33C: Any money due from an employer to an employee under a settlement or award may be recovered by the employee himself at his option either by filing a claim with the authority.",
            "relevance": 0.88,
        })

    if any(w in q for w in ["eviction", "evict", "ghar", "makaan", "landlord", "rent"]):
        contexts.append({
            "act": "Transfer of Property Act 1882", "section": "Section 108(c)",
            "text": "Section 108(c): The lessor is bound to put the lessee in possession of the property. The lessee shall have quiet enjoyment of the property. The landlord must give 24-hour written notice before entering.",
            "relevance": 0.90,
        })
        contexts.append({
            "act": "Maharashtra Rent Control Act 1999", "section": "Section 16",
            "text": "Section 16: A landlord cannot evict a tenant except through an order of the Rent Control Court. Eviction without court order is illegal.",
            "relevance": 0.87,
        })

    if any(w in q for w in ["consumer", "product", "refund", "complaint", "ecommerce"]):
        contexts.append({
            "act": "Consumer Protection Act 2019", "section": "Section 35",
            "text": "Section 35: A consumer complaint may be made to the District Consumer Disputes Redressal Commission for deficiency in service or defect in goods.",
            "relevance": 0.89,
        })

    if any(w in q for w in ["domestic", "violence", "498", "498a", "wife", "husband", "dowry"]):
        contexts.append({
            "act": "Bharatiya Nyaya Sanhita 2023", "section": "Section 85",
            "text": "Section 85 (BNS) [Formerly IPC 498A]: Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for 5 years.",
            "relevance": 0.93,
        })

    if not contexts:
        contexts.append({
            "act": "General Legal Framework",
            "section": "Indian Constitution",
            "text": "Article 21: Protection of life and personal liberty — No person shall be deprived of his life or personal liberty except according to procedure established by law. Every Indian citizen has the right to free legal aid under Article 39A.",
            "relevance": 0.75,
        })

    return contexts


async def ask_legal_question(
    query: str,
    language: str = "en",
    conversation_history: Optional[list[dict]] = None,
    user_state: str = "Maharashtra",
) -> dict:
    """
    Main RAG pipeline:
    query → embed → retrieve → Groq LLM → structured response
    """
    # 1. Retrieve relevant legal context
    context_chunks = await retrieve_law_context(query)

    context_text = "\n\n".join([
        f"[{c['act']}, {c['section']}]\n{c['text']}"
        for c in context_chunks
    ])

    # 2. Build messages
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    if conversation_history:
        for m in conversation_history[-6:]:   # Last 3 turns
            messages.append({"role": m["role"], "content": m["content"]})

    user_message = f"""User State/Region: {user_state}
User Language: {language}

RETRIEVED LEGAL CONTEXT:
{context_text}

USER QUERY: {query}

Respond in {language} language. Return a valid JSON object."""

    messages.append({"role": "user", "content": user_message})

    # 3. Call Groq LLM
    try:
        if not settings.GROQ_API_KEY:
            raise ValueError("No GROQ_API_KEY")

        groq = _get_groq()
        resp = await groq.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            max_tokens=2048,
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        raw = resp.choices[0].message.content
        result = json.loads(raw)

    except Exception as e:
        logger.warning("Groq call failed, using mock response", error=str(e))
        result = _mock_legal_response(query, context_chunks, language)

    # 4. Add metadata
    result["retrieved_sections"] = [
        f"{c['act']}, {c['section']}" for c in context_chunks
    ]
    result["ipc_to_bns_applied"] = _apply_ipc_bns_remapping(result.get("law_citations", []))

    return result


def _mock_legal_response(query: str, context: list[dict], language: str) -> dict:
    """
    Fallback response when API keys are not configured.
    Returns a realistic demo response for development.
    """
    q = query.lower()
    citations = [f"{c['act']}, {c['section']}" for c in context[:3]]

    if any(w in q for w in ["salary", "wages", "payment"]):
        return {
            "answer": """आपके नियोक्ता द्वारा वेतन न देना **Payment of Wages Act 1936, Section 15** के तहत अवैध है।

**आपके अधिकार:**
1. 15 दिन की Registered Notice भेजें
2. Labour Commissioner के पास शिकायत करें  
3. Labour Court में वाद दायर करें

**Compensation:** बकाया राशि का 20 गुना तक मुआवजा मांग सकते हैं।

📊 जीत की संभावना: **76%** | ⏱ सीमा अवधि: 3 साल""",
            "law_citations": citations or ["Payment of Wages Act 1936, Section 15", "Industrial Disputes Act 1947, Section 33C"],
            "win_probability": 76,
            "confidence": 88,
            "next_steps": ["नोटिस भेजें (15 दिन)", "Labour Commissioner शिकायत", "Labour Court"],
            "limitation_days": 1095,
            "doc_types_relevant": ["unpaid_salary_notice", "labour_court_complaint"],
            "distress_detected": False,
            "case_type": "wage_dispute",
        }

    if any(w in q for w in ["evict", "eviction", "landlord", "ghar", "makaan"]):
        return {
            "answer": """मकान मालिक का बिना कोर्ट आदेश के निकालना **Maharashtra Rent Control Act 1999, Section 16** के तहत पूरी तरह अवैध है।

**आपके अधिकार:**
1. निष्कासन Illegal है — मत जाइए
2. **Rent Control Authority** में तुरंत शिकायत करें
3. Police में FIR दर्ज करें

⚠️ कोई भी मौखिक notice कानूनी रूप से अमान्य है।""",
            "law_citations": citations or ["Maharashtra Rent Control Act 1999, Section 16", "Transfer of Property Act, Section 108"],
            "win_probability": 84,
            "confidence": 91,
            "next_steps": ["Rent Control Authority शिकायत", "वकील से Notice", "High Court Writ (यदि जरूरी हो)"],
            "limitation_days": 1095,
            "doc_types_relevant": ["eviction_reply", "tenant_rights_petition"],
            "distress_detected": False,
            "case_type": "property",
        }

    return {
        "answer": f"आपकी समस्या के लिए कानूनी सहायता उपलब्ध है। प्रासंगिक कानून: {', '.join(citations)}। कृपया DLSA (जिला विधिक सेवा प्राधिकरण) से नि:शुल्क सहायता लें। Toll-free: 15100",
        "law_citations": citations,
        "win_probability": 65,
        "confidence": 70,
        "next_steps": ["तथ्य एकत्र करें", "DLSA से निःशुल्क परामर्श लें", "दस्तावेज़ सुरक्षित रखें"],
        "limitation_days": 1095,
        "doc_types_relevant": [],
        "distress_detected": False,
        "case_type": "general",
    }


def _apply_ipc_bns_remapping(citations: list[str]) -> dict:
    """Check cited sections and return IPC→BNS mapping if applicable."""
    mappings = {}
    for citation in citations:
        for ipc, bns in IPC_TO_BNS_MAP.items():
            if f"IPC {ipc}" in citation or f"Section {ipc}" in citation:
                mappings[f"IPC {ipc}"] = f"BNS {bns}"
    return mappings


async def load_statute_to_chroma(
    act_name: str,
    section: str,
    text: str,
    doc_id: Optional[str] = None,
    metadata: Optional[dict] = None
) -> bool:
    """Add a law statute chunk to ChromaDB."""
    try:
        _, collection = _get_chroma()
        embedding = await embed_text(f"{act_name} {section} {text}")
        _id = doc_id or f"{act_name}_{section}".replace(" ", "_")
        meta = metadata or {}
        meta.update({"act_name": act_name, "section": section})

        collection.upsert(
            ids=[_id],
            embeddings=[embedding],
            documents=[text],
            metadatas=[meta],
        )
        return True
    except Exception as e:
        logger.error("Failed to load statute to ChromaDB", error=str(e))
        return False


async def get_chroma_stats() -> dict:
    """Return ChromaDB collection statistics."""
    try:
        _, collection = _get_chroma()
        count = collection.count()
        return {"status": "connected", "document_count": count, "collection": "indian_law_statutes"}
    except Exception as e:
        return {"status": "error", "error": str(e), "document_count": 0}
