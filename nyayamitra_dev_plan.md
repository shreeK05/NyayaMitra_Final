# NyayaMitra — Complete Development & Deployment Plan
## AI-Powered Legal Justice Platform | Team Return 0; | Hacksagon 2026

---

## 1. Project Overview

India has 600M+ citizens with zero meaningful legal access. A single consultation costs Rs.5,000+. 47M+ court cases are pending.

**NyayaMitra** is a full-stack AI legal justice platform with:
- **7 Pillars** / **35+ Features** / **47 Document Types**
- **13 World-First Innovations** / **12 Law Domains** / **6 Indian Languages**

### Deployment Targets

| Platform | URL |
|----------|-----|
| Web PWA | Vercel (nyaya-mitra-ai-legal-assistant.vercel.app) |
| Backend API | Railway or Render |
| Android APK | Direct / Play Store |
| WhatsApp Bot | Meta Business API Webhook |
| Blockchain Verify | nyayamitra.in/verify (Polygon) |

---

## 2. Tech Stack

### Frontend
| Tech | Version | Purpose |
|------|---------|---------|
| React | 18 | Core UI |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | Latest | Accessible components |
| Vite | 5.x | Build system |
| Capacitor | 5.x | Android APK wrapper |
| Zustand | 4.x | Local state |
| React Query | 5.x | Server state |
| jsPDF | 2.x | Client-side PDF generation |
| ethers.js | 6.x | Polygon blockchain |
| Recharts | 2.x | NyayaScore gauge |

### Backend
| Tech | Version | Purpose |
|------|---------|---------|
| FastAPI | 0.110+ | REST API server |
| Python | 3.11+ | Backend language |
| PostgreSQL | 15+ | Primary database |
| SQLAlchemy | 2.x | ORM |
| ChromaDB | 0.4.x | Vector DB for RAG |
| scikit-learn | 1.x | Win probability ML |
| librosa | Latest | Audio emotion analysis |
| BeautifulSoup4 | Latest | Gazette scraping |
| pdfplumber | Latest | PDF parsing |
| Node.js | 20+ | WhatsApp webhook |

### AI/ML APIs
| Service | Usage |
|---------|-------|
| Groq (Llama 3.3 70B) | LLM reasoning, doc generation |
| Groq (Llama 3.2 Vision 11B) | Document photo reading |
| Sarvam AI (STT + TTS) | Indian language voice |
| OpenAI text-embedding-3-small | Statute embeddings |
| Polygon Network | Blockchain timestamping |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend (PWA) hosting |
| Railway / Render | FastAPI backend |
| Cloudflare R2 | Encrypted document CDN |
| Firebase Cloud Messaging | Push notifications |
| WhatsApp Business API | WhatsApp bot |
| GitHub Actions | CI/CD |

---

## 3. Repository & Project Structure

```
nyayamitra/                          <- Root monorepo
+-- frontend/                        <- React 18 + TypeScript
|   +-- src/
|   |   +-- components/
|   |   |   +-- VoiceCounsellor/
|   |   |   +-- DocumentDecoder/
|   |   |   +-- DocumentGenerator/
|   |   |   +-- AmendmentTracker/
|   |   |   +-- CaseTracker/
|   |   |   +-- NyayaScore/
|   |   |   +-- NegotiationCoach/
|   |   +-- pages/
|   |   +-- stores/                  <- Zustand stores
|   |   +-- hooks/
|   |   +-- services/                <- API layer
|   |   +-- utils/                   <- AES-256, jsPDF, ethers
|   |   +-- types/
|   |   +-- sw/                      <- Service Worker
|   +-- capacitor.config.ts
|   +-- vite.config.ts
|   +-- package.json
|
+-- backend/                         <- FastAPI Python
|   +-- app/
|   |   +-- api/
|   |   |   +-- voice.py
|   |   |   +-- documents.py
|   |   |   +-- decoder.py
|   |   |   +-- amendments.py
|   |   |   +-- cases.py
|   |   |   +-- score.py
|   |   |   +-- rag.py
|   |   |   +-- ml.py
|   |   +-- services/
|   |   |   +-- llm_service.py
|   |   |   +-- rag_service.py
|   |   |   +-- voice_service.py
|   |   |   +-- gazette_scraper.py
|   |   |   +-- blockchain_service.py
|   |   |   +-- notification_service.py
|   |   |   +-- ml_predictor.py
|   |   |   +-- emotion_detector.py
|   |   +-- models/                  <- SQLAlchemy models
|   |   +-- schemas/                 <- Pydantic schemas
|   |   +-- data/
|   |   |   +-- statutes/            <- Indian law text files
|   |   |   +-- ipc_bns_map.json     <- 500+ section mappings
|   |   |   +-- dlsa_offices.json
|   |   |   +-- document_templates/  <- 47 doc types
|   |   +-- main.py
|   +-- scripts/
|   |   +-- load_statutes.py
|   |   +-- train_ml_model.py
|   |   +-- test_rag.py
|   +-- requirements.txt
|   +-- Dockerfile
|
+-- whatsapp-bot/                    <- Node.js webhook
|   +-- src/
|   |   +-- webhook.ts
|   |   +-- router.ts
|   |   +-- api-client.ts
|   +-- package.json
|
+-- data-pipeline/
|   +-- scrape_india_kanoon.py       <- 50k+ judgments
|   +-- embed_statutes.py
|   +-- build_bns_mapping.py
|
+-- .github/workflows/
+-- docker-compose.yml
+-- README.md
```

---

## 4. Phase 1 — Environment Setup & API Keys

### Step 1.1 — Install Prerequisites

```bash
# Node.js 20+
winget install OpenJS.NodeJS

# Python 3.11+
winget install Python.Python.3.11

# Android Studio (for APK)
# Download from https://developer.android.com/studio

# Java JDK 17+ (Capacitor Android)
winget install Microsoft.OpenJDK.17
```

### Step 1.2 — Required API Keys

| Service | URL | Cost |
|---------|-----|------|
| Groq API | https://console.groq.com | Free |
| Sarvam AI | https://dashboard.sarvam.ai | Free |
| OpenAI | https://platform.openai.com | Paid (embeddings) |
| Firebase | https://console.firebase.google.com | Free |
| WhatsApp Business API | https://developers.facebook.com | Free |
| Polygon RPC | https://polygon-rpc.com | Free |
| Cloudflare R2 | https://cloudflare.com | Free 10GB |

### Step 1.3 — Initialize Frontend

```bash
mkdir nyayamitra && cd nyayamitra
mkdir frontend && cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @shadcn/ui zustand @tanstack/react-query
npm install react-router-dom jspdf ethers axios
npm install recharts lucide-react date-fns
npx shadcn@latest init
```

### Step 1.4 — Initialize Backend

```bash
cd ../backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary
pip install chromadb openai groq pydantic python-dotenv
pip install pdfplumber beautifulsoup4 requests aiohttp
pip install scikit-learn numpy pandas joblib librosa
pip install python-jose passlib bcrypt apscheduler
pip install firebase-admin
```

### Step 1.5 — Local PostgreSQL (Docker)

```bash
docker run --name nyayamitra-db \
  -e POSTGRES_DB=nyayamitra \
  -e POSTGRES_USER=nyaya \
  -e POSTGRES_PASSWORD=secretpass \
  -p 5432:5432 -d postgres:15
```

---

## 5. Phase 2 — Data Pipeline (ChromaDB + Laws)

> **CRITICAL**: This phase determines the quality of every legal answer.

### Step 2.1 — Collect Indian Statutes

Download full text from `indiacode.nic.in` in this priority order:

1. Bharatiya Nyaya Sanhita 2023 (BNS) — replaces IPC
2. Bharatiya Nagarik Suraksha Sanhita 2023 (BNSS) — replaces CrPC
3. Bharatiya Sakshya Adhiniyam 2023 (BSA) — replaces Evidence Act
4. Payment of Wages Act 1936
5. Industrial Disputes Act 1947
6. Consumer Protection Act 2019
7. RERA 2016
8. IT Act 2000 + DPDP Act 2023
9. Hindu Marriage Act 1955 + DV Act 2005
10. RTI Act 2005 + Transfer of Property Act 1882
11. Negotiable Instruments Act 1881
12. Maternity Benefit Act 1961 + POSH Act 2013
13. Four Labour Codes (Wages, Industrial Relations, Social Security, OSH)
14. State Rent Acts: Maharashtra, Delhi, Karnataka, Tamil Nadu, West Bengal

### Step 2.2 — Embed & Load into ChromaDB

```python
# backend/scripts/load_statutes.py
import chromadb
from openai import OpenAI

client = OpenAI()
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection("indian_statutes")

def chunk_statute(text, chunk_size=300, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
    return chunks

def embed_and_store(act_name, text, state=None):
    chunks = chunk_statute(text)
    for i, chunk in enumerate(chunks):
        embedding = client.embeddings.create(
            model="text-embedding-3-small", input=chunk
        ).data[0].embedding
        metadata = {"act": act_name, "chunk_id": i}
        if state:
            metadata["state"] = state
        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            metadatas=[metadata],
            ids=[f"{act_name}_{i}"]
        )
```

### Step 2.3 — Build IPC to BNS Mapping Table

```json
// backend/app/data/ipc_bns_map.json
{
  "IPC_302": "BNS_103",
  "IPC_376": "BNS_64",
  "IPC_420": "BNS_318",
  "IPC_498A": "BNS_85"
}
```
(500+ entries verified against official gazette)

### Step 2.4 — Indian Kanoon Dataset (50k+ judgments)

```bash
python data-pipeline/scrape_india_kanoon.py \
  --domains "labour,consumer,property,criminal" \
  --count 50000 --output data/kanoon_judgments.csv
```

### Step 2.5 — DLSA Office Database

```json
// backend/app/data/dlsa_offices.json
[{
  "state": "Maharashtra", "district": "Pune",
  "name": "DLSA Pune",
  "address": "District Court Campus, Shivajinagar, Pune 411005",
  "phone": "020-25533825", "lat": 18.5308, "lng": 73.8475
}]
```

---

## 6. Phase 3 — Backend (FastAPI)

### Step 3.1 — FastAPI App Entry Point

```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import voice, documents, decoder, amendments, cases, score, rag, ml

app = FastAPI(title="NyayaMitra API", version="1.0.0")
app.add_middleware(CORSMiddleware,
    allow_origins=["https://nyaya-mitra-ai-legal-assistant.vercel.app",
                   "http://localhost:5173"],
    allow_methods=["*"], allow_headers=["*"])

app.include_router(voice.router, prefix="/api/voice")
app.include_router(documents.router, prefix="/api/documents")
app.include_router(decoder.router, prefix="/api/decoder")
app.include_router(amendments.router, prefix="/api/amendments")
app.include_router(cases.router, prefix="/api/cases")
app.include_router(score.router, prefix="/api/score")
app.include_router(rag.router, prefix="/api/rag")
app.include_router(ml.router, prefix="/api/ml")
```

### Step 3.2 — RAG Service (Core Legal Brain)

```python
# backend/app/services/rag_service.py
import chromadb
from openai import OpenAI
from groq import Groq

class RAGService:
    def __init__(self):
        self.chroma = chromadb.PersistentClient("./chroma_db")
        self.collection = self.chroma.get_collection("indian_statutes")
        self.openai = OpenAI()
        self.groq = Groq()

    def retrieve(self, query, state=None, top_k=3):
        embedding = self.openai.embeddings.create(
            model="text-embedding-3-small", input=query
        ).data[0].embedding
        results = self.collection.query(
            query_embeddings=[embedding], n_results=top_k,
            where={"state": state} if state else None
        )
        confidence = 1 - max(results["distances"][0])
        return results["documents"][0], confidence

    def query_with_rag(self, user_query, language="en", state=None):
        docs, confidence = self.retrieve(user_query, state)
        context = "\n\n".join(docs)
        low_conf = confidence < 0.65

        messages = [
            {"role": "system", "content": f"""You are NyayaMitra, AI legal assistant for Indian citizens.
RETRIEVED LEGAL CONTEXT:
{context}
RULES:
- Only cite laws from retrieved context
- Always include specific Act + Section number
- Respond in {language}
- Be empathetic and clear
{"[LOW CONFIDENCE] Recommend DLSA." if low_conf else ""}"""},
            {"role": "user", "content": user_query}
        ]
        response = self.groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages, temperature=0.1
        )
        return {
            "response": response.choices[0].message.content,
            "confidence": confidence,
            "low_confidence_warning": low_conf
        }
```

### Step 3.3 — Database Models

```python
# backend/app/models/models.py
from sqlalchemy import Column, String, Text, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    phone = Column(String, unique=True)
    language = Column(String, default="hi")
    state = Column(String)
    nyaya_score = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Case(Base):
    __tablename__ = "cases"
    id = Column(String, primary_key=True)
    user_id = Column(String)
    case_type = Column(String)
    status = Column(String)
    facts_encrypted = Column(Text)      # AES-256 encrypted
    acts_relevant = Column(JSON)
    limitation_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True)
    user_id = Column(String)
    doc_type = Column(String)
    blockchain_hash = Column(String)
    blockchain_tx_id = Column(String)
    polygon_timestamp = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class Amendment(Base):
    __tablename__ = "amendments"
    id = Column(String, primary_key=True)
    act_name = Column(String)
    section = Column(String)
    old_text = Column(Text)
    new_text = Column(Text)
    diff_summary = Column(Text)
    gazette_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Step 3.4 — Gazette Scraper (Daily Cron at 6 AM)

```python
# backend/app/services/gazette_scraper.py
import requests, pdfplumber, difflib
from bs4 import BeautifulSoup

class GazetteScraper:
    SOURCES = [
        "https://egazette.gov.in",
        "https://indiacode.nic.in",
        "https://prsindia.org"
    ]
    KEYWORDS = ["amendment","substitution","insertion","omission","section","Act"]

    async def scrape_daily(self):
        for source in self.SOURCES:
            notifications = await self._fetch_recent(source)
            for n in notifications:
                if any(kw in n["title"].lower() for kw in self.KEYWORDS):
                    await self._process_amendment(n)

    async def _process_amendment(self, notification):
        pdf_text = self._extract_pdf(notification["pdf_url"])
        act, section = self._parse_affected_law(pdf_text)
        old_text = await self._get_section_text(act, section)
        new_text = self._extract_new_text(pdf_text, section)
        diff = list(difflib.unified_diff(
            old_text.splitlines(), new_text.splitlines(), lineterm=""))
        summary = self._generate_summary(old_text, new_text, act)
        await self._store_amendment(act, section, old_text, new_text, summary)
        await self._trigger_user_alerts(act, section, summary)
```

### Step 3.5 — All API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/voice/query` | POST | Voice query -> RAG -> LLM response |
| `/api/voice/stt` | POST | Audio -> Sarvam STT -> text |
| `/api/voice/tts` | POST | Text -> Sarvam TTS -> audio |
| `/api/voice/emotion` | POST | Audio -> distress detection |
| `/api/rag/query` | POST | Text -> ChromaDB -> LLM |
| `/api/documents/generate` | POST | Generate any of 47 doc types |
| `/api/documents/verify` | GET | Verify blockchain hash |
| `/api/decoder/analyze` | POST | Upload doc -> clause analysis |
| `/api/decoder/counter-clause` | POST | Generate counter-clause |
| `/api/decoder/multimodal` | POST | Photo -> structured data |
| `/api/amendments/list` | GET | Recent amendments feed |
| `/api/amendments/diff/{id}` | GET | Before/after diff view |
| `/api/amendments/translate` | POST | IPC->BNS translation |
| `/api/cases/create` | POST | Create case |
| `/api/cases/list` | GET | User's cases |
| `/api/cases/ecourts/{no}` | GET | Live eCourts status |
| `/api/score/calculate` | POST | NyayaScore calculation |
| `/api/score/report` | GET | Monthly health report |
| `/api/ml/predict` | POST | Win probability |
| `/api/ml/negotiate` | POST | Negotiation role-play |

---

## 7. Phase 4 — Frontend (React 18 + TypeScript)

### Navigation Structure

```
4 Bottom Tabs:
  Tab 1: Home     - Dashboard, amendment alerts, quick actions
  Tab 2: Counsel  - Voice counsellor, negotiation coach
  Tab 3: Docs     - Document generator + decoder
  Tab 4: Profile  - NyayaScore, case tracker, settings
```

### Screen: Voice Counsellor
- Language selector (6 languages + flag icons)
- Large animated microphone button
- Real-time voice waveform
- Response card with law citations + win probability badge
- Confidence score bar
- "Draft as Legal Notice" CTA

### Screen: Document Decoder
- File upload + camera capture (Capacitor)
- Green/amber/red clause cards
- Tap clause -> law citation detail + counter-clause
- Hidden trap detection banner
- IPC->BNS outdated warning chips

### Screen: Document Generator
- 47 doc types in 9 category tabs
- Auto-fill from voice conversation
- Live PDF preview
- Blockchain timestamp indicator
- WhatsApp share + download buttons

### Screen: NyayaScore
```
0-100 circular gauge (Recharts RadialBar)
4 component breakdown:
  - Employment contract safety: 25%
  - Rental agreement safety: 25%
  - Active legal risks: 30%
  - Consumer/financial protection: 20%
Shareable PNG card generator
```

### Screen: Amendment Tracker
- Feed of recent amendments with date chips
- Side-by-side diff view (old strikethrough, new highlighted)
- Personal case alert cards
- "Update my docs" CTA

### AES-256 Client-Side Encryption

```typescript
// frontend/src/utils/crypto.ts
// User PIN -> PBKDF2 -> AES-256-GCM key
// All case data encrypted BEFORE transmission
// Server only receives ciphertext (zero-knowledge)
```

### Offline Mode (Service Workers)

```
Cached offline:
- 500 legal rights definitions
- 47 blank document templates
- State law summaries
- DLSA office directory (GPS + contacts)
- All user's previous documents
```

---

## 8. Phase 5 — AI/ML Components

### Sarvam AI Voice Pipeline

```
User audio -> Sarvam Saarika v2 STT -> text
Text -> IPC/BNS translator -> ChromaDB RAG -> Groq LLM -> response text
Response text -> Sarvam Bulbul v1 TTS -> audio
Target latency: < 2 seconds end-to-end
```

### Emotion Detection (Distress Escalation)

```python
import librosa, numpy as np
from sklearn.ensemble import RandomForestClassifier

def detect_distress(audio_bytes):
    y, sr = librosa.load(audio_bytes)
    pitch = librosa.yin(y, fmin=50, fmax=300)
    energy = librosa.feature.rms(y=y)[0]
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    features = np.array([np.std(pitch), tempo, np.mean(energy)]).reshape(1, -1)
    return clf.predict(features)[0]  # "distress" or "calm"

# On distress detection -> surface:
# Women Helpline: 181 | Police: 100 | iCall: 9152987821
```

### Win Probability ML Model

```python
# Random Forest trained on 50,000+ Indian Kanoon judgments
# Input features: case_type, state, court_level, evidence, time_elapsed
# Output: win_probability (0.0-1.0) + recommended_forum
from sklearn.ensemble import RandomForestClassifier
import joblib, pandas as pd

df = pd.read_csv("data/kanoon_judgments.csv")
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(df[["case_type", "state", "court_level", "evidence", "time_elapsed"]], df["outcome"])
joblib.dump(clf, "models/win_predictor.pkl")
```

### Multimodal Evidence Reader

```python
# Llama 3.2 Vision (11B) via Groq
async def read_evidence_photo(image_bytes):
    b64 = base64.b64encode(image_bytes).decode()
    response = groq.chat.completions.create(
        model="llama-3.2-11b-vision-preview",
        messages=[{"role": "user", "content": [
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
            {"type": "text", "text": "Extract party names, amounts, dates as JSON."}
        ]}]
    )
    return parse_json(response.choices[0].message.content)
```

### Negotiation Coach

```
Phase 1: Role-play session
  - System prompt injects persona (employer/landlord/bank manager)
  - Multi-turn conversation in user's language

Phase 2: Post-session debrief (second LLM call)
  - What you argued correctly
  - Where you conceded unnecessarily
  - Legal rights you forgot to assert
```

---

## 9. Phase 6 — WhatsApp Bot (Node.js)

```typescript
// whatsapp-bot/src/webhook.ts
app.post("/webhook", async (req, res) => {
  const msg = req.body.entry[0].changes[0].value.messages[0];
  const text = msg.text?.body;
  const phone = msg.from;
  const lang = await detectLanguage(text);

  const result = await axios.post("https://api.nyayamitra.in/api/rag/query", {
    query: text, language: lang, user_id: phone
  });

  // Format for WhatsApp (no markdown, short paragraphs)
  await sendWhatsAppMessage(phone, formatForWhatsApp(result.data));
  res.sendStatus(200);
});
```

---

## 10. Phase 7 — Blockchain Timestamping (Polygon)

```typescript
// frontend/src/utils/blockchain.ts
import { ethers } from "ethers";

export async function timestampDocument(content: string) {
  const hashBuffer = await crypto.subtle.digest("SHA-256",
    new TextEncoder().encode(content));
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0")).join("");

  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const wallet = new ethers.Wallet(RELAYER_KEY, provider);
  const tx = await wallet.sendTransaction({
    to: "0x0000000000000000000000000000000000000000",
    data: "0x" + hashHex
  });
  await tx.wait();
  return { txId: tx.hash, hash: hashHex, timestamp: new Date() };
}

// Verification portal at /verify
// User pastes content -> hash -> checks against Polygon record
```

---

## 11. Phase 8 — Android APK (Capacitor 5)

```bash
cd frontend
npx cap init "NyayaMitra" "in.nyayamitra.app"
npm install @capacitor/android @capacitor/camera
npm install @capacitor/geolocation @capacitor/push-notifications
npm install @capacitor/microphone @capacitor/filesystem
npx cap add android
npm run build
npx cap sync android
npx cap open android  # Opens Android Studio for final build
```

**AndroidManifest.xml permissions:**
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

**APK targets:** Min SDK API 23 (Android 6), Target API 34, Size < 15MB

---

## 12. Phase 9 — Testing & QA

### RAG Quality Tests
```python
TEST_QUERIES = [
    ("Saheb ne 3 mahine se salary nahi di", "Payment of Wages Act", "hi"),
    ("Landlord ghus aata hai bina bataye", "Transfer of Property Act", "hi"),
    ("FIR file nahi kar raha police", "BNS Section 173", "en"),
    ("Consumer forum complaint kaise file karu", "Consumer Protection Act 2019", "hi"),
]
# Verify: specific Act+Section cited, correct state law, confidence scores
```

### Voice Pipeline Tests
- STT accuracy: 10 Hindi/Marathi sentences
- TTS naturalness check
- Sub-2-second latency test
- Code-switching (Hinglish) test

### Document Generation Tests
- All 47 document types generate correctly
- Party names auto-filled from conversation
- Law sections correctly cited
- Blockchain hash recorded

### Security Audit
- AES-256 encryption verified client-side
- No plaintext case data in server logs
- DPDP Act 2023 compliance
- SQL injection tests

---

## 13. Phase 10 — Deployment

### Backend Deploy (Railway)

```bash
railway login
railway init
railway up

railway variables set DATABASE_URL=postgresql://...
railway variables set GROQ_API_KEY=gsk_...
railway variables set OPENAI_API_KEY=sk-...
railway variables set SARVAM_API_KEY=...
railway variables set POLYGON_RELAYER_KEY=0x...
railway variables set CLOUDFLARE_R2_ACCESS_KEY=...
railway variables set FIREBASE_SERVICE_ACCOUNT=...
```

### Frontend Deploy (Vercel)

```bash
cd frontend
vercel --prod

# Vercel dashboard env vars:
# VITE_API_URL=https://api.nyayamitra.in
# VITE_POLYGON_RPC=https://polygon-rpc.com
# VITE_FIREBASE_API_KEY=...
```

### Database Migration

```bash
alembic upgrade head
python scripts/load_statutes.py    # Load all Indian laws into ChromaDB
python scripts/train_ml_model.py   # Train win probability model on Kanoon data
```

### Setup Cron Jobs (APScheduler)

```python
# Daily gazette scraper: 6 AM IST
# Monthly health checkup: 1st of every month
# Limitation period alerts: daily at 9 AM
```

### WhatsApp Business API Setup

1. Create Meta Business Manager account
2. Add a phone number to WhatsApp Business API
3. Submit Meta App Review
4. Configure webhook: `https://bot.nyayamitra.in/webhook`
5. Set verify token and message templates

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy-frontend.yml
on: [push to main]
jobs:
  deploy:
    steps:
      - npm install
      - npm run build
      - vercel --prod --token $VERCEL_TOKEN

# .github/workflows/deploy-backend.yml  
on: [push to main]
jobs:
  deploy:
    steps:
      - pip install -r requirements.txt
      - pytest
      - railway up
```

---

## 14. Complete Feature Checklist

### Pillar 1 — Voice Legal Counsellor (5 features)
- [ ] Multilingual voice pipeline (Sarvam STT + TTS, 6 languages)
- [ ] Emotion-aware escalation engine (librosa + binary distress classifier)
- [ ] Stateful multi-turn case memory (Zustand + IndexedDB + PostgreSQL encrypted)
- [ ] Win probability predictor (scikit-learn RF on 50k+ Kanoon records)
- [ ] AI negotiation coach (role-play + post-session debrief)

### Pillar 2 — Smart Document Decoder (5 features)
- [ ] Clause-by-clause risk scanner (green/amber/red cards)
- [ ] Hidden trap detector (forced arbitration, liability waivers, auto-renewal)
- [ ] Counter-clause auto-drafter for every red/amber clause
- [ ] Outdated clause detector (IPC->BNS 500+ mapping table)
- [ ] Multimodal evidence reader (Llama 3.2 Vision, photo -> JSON)

### Pillar 3 — Amendment Live Tracker (4 features)
- [ ] Real-time gazette scraper (daily cron, egazette.gov.in)
- [ ] Personal case amendment alerts (WhatsApp + FCM push)
- [ ] IPC->BNS auto-translator (pre-processing middleware)
- [ ] Before/after diff view (side-by-side with plain-language summary)

### Pillar 4 — Action Document Generator (47 types)
- [ ] Full voice-to-PDF pipeline (jsPDF client-side)
- [ ] All 47 document types across 9 categories
- [ ] Blockchain timestamping (Polygon SHA-256 + tx ID in footer)
- [ ] WhatsApp share + Cloudflare R2 CDN (30-day link)

### Pillar 5 — Case Timeline Tracker (5 features)
- [ ] Limitation period auto-tracker (countdown + push alerts)
- [ ] eCourts API integration (NJDG live case status)
- [ ] Jurisdiction-aware next step guide (state-specific)
- [ ] NyayaScore (0-100 gauge, 4 components, shareable card)
- [ ] Monthly legal health checkup (cron job + WhatsApp delivery)

### Pillar 6 — RAG Legal Brain (3 features)
- [ ] ChromaDB with all Indian statutes embedded
- [ ] State-specific law filter (GPS detection + 28-state coverage)
- [ ] Confidence scoring + honest uncertainty + DLSA referral

### Pillar 7 — Platform & Accessibility (5 features)
- [ ] Android APK (Capacitor 5, < 15MB)
- [ ] PWA (Vercel, home-screen installable)
- [ ] WhatsApp Legal Bot (zero-download, full pipeline)
- [ ] Offline mode (Service Workers, IndexedDB)
- [ ] DPDP Act 2023 compliance (AES-256 client-side, zero-knowledge server)

---

## 15. Environment Variables Reference

### Backend `.env`

```env
DATABASE_URL=postgresql://nyaya:password@localhost:5432/nyayamitra

GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk-...
SARVAM_API_KEY=...

SARVAM_STT_URL=https://api.sarvam.ai/speech-to-text
SARVAM_TTS_URL=https://api.sarvam.ai/text-to-speech

WHATSAPP_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_VERIFY_TOKEN=nyayamitra_secret

FIREBASE_SERVICE_ACCOUNT_JSON=...

POLYGON_RPC_URL=https://polygon-rpc.com
RELAYER_PRIVATE_KEY=0x...

CLOUDFLARE_R2_ACCESS_KEY=...
CLOUDFLARE_R2_SECRET_KEY=...
CLOUDFLARE_R2_BUCKET=nyayamitra-docs

NJDG_API_URL=https://njdg.ecourts.gov.in/njdg_public
```

### Frontend `.env`

```env
VITE_API_URL=https://api.nyayamitra.in
VITE_POLYGON_RPC=https://polygon-rpc.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_WHATSAPP_NUMBER=+91XXXXXXXXXX
```

---

## Recommended Build Schedule (10 Days)

| Day | Phase | Key Deliverables |
|-----|-------|-----------------|
| Day 0 | Prep | API keys, DB setup, ChromaDB statute loading, IPC-BNS mapping |
| Day 1 | Backend Core | FastAPI scaffold, RAG pipeline, ChromaDB verified, voice endpoints |
| Day 2 | Frontend Base | React app, Tailwind, navigation, Home + Voice Counsellor screen |
| Day 3 | Document Engine | Generator (47 types) + Decoder (clause cards) working |
| Day 4 | ML + Blockchain | Win predictor trained, Polygon integration, emotion detection |
| Day 5 | Amendment Tracker | Gazette scraper, diff view, alert system |
| Day 6 | Case Tracker + NyayaScore | Timeline UI, limitation tracker, score gauge |
| Day 7 | WhatsApp + Offline | Bot webhook live, service workers, offline mode |
| Day 8 | APK + Polish | Capacitor build, UI consistency, edge case fixes |
| Day 9 | Testing | RAG quality, voice latency, security audit, e2e tests |
| Day 10 | Deployment | Vercel + Railway + custom domain + GitHub Actions CI/CD |

---

> **Start here**: ChromaDB statute loading -> RAG service -> Voice Counsellor endpoint -> Voice screen UI. This is the core flow that everything else builds on.

> **Live URL reference**: nyaya-mitra-ai-legal-assistant.vercel.app

---

*NyayaMitra does not give legal advice. It gives legal ACTION.*
*Team Return 0; - Shreeyash Kamble | Jatin Chenna | Ninad Shitole*
