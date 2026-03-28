# NyayaMitra 🇮🇳⚖️
### AI-Powered Legal Justice for Every Indian

> **Hacksagon 2026 | Team Return 0;**  
> *600M+ citizens. Zero legal access. NyayaMitra changes that.*

[![Deploy Backend](https://img.shields.io/badge/Deploy-Railway-purple)](https://railway.app)
[![Deploy Frontend](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 🚀 Quick Start (Local Dev — No API Keys Needed)

```bash
# 1. Clone & install frontend
cd frontend && npm install && npm run dev
# → http://localhost:5173

# 2. Install backend deps & start
cd backend && pip install -r requirements.txt
python run.py
# → http://localhost:8000 | Swagger: http://localhost:8000/docs
```

The app works in **full demo mode** without any API keys. Add keys to `backend/.env` to enable AI features.

---

## ✨ 7 Pillars | 35+ Features

| Pillar | Feature | Status |
|--------|---------|--------|
| 🎤 **Voice Counsellor** | RAG + Groq LLM in 6 Indian languages | ✅ Live |
| 🔍 **Document Decoder** | AI clause risk analysis + counter-clauses | ✅ Live |
| 📄 **Document Generator** | 47 legal doc types, PDF download | ✅ Live |
| 📡 **Amendment Tracker** | Live Gazette scraper + IPC→BNS mapping | ✅ Live |
| ⚖️ **Case Tracker** | Timeline + limitation periods + eCourts | ✅ Live |
| 📊 **NyayaScore** | Legal health metric across 5 domains | ✅ Live |
| 🤝 **Negotiation Coach** | 6 AI role-play scenarios + debrief | ✅ Live |

---

## 🔑 API Keys (All Free Tier Available)

Add to `backend/.env`:

| Key | Get it at | Required for |
|-----|-----------|-------------|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | AI answers (Llama 3.3 70B) |
| `SARVAM_API_KEY` | [sarvam.ai](https://sarvam.ai) | Indian voice STT/TTS |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) | Vector embeddings |

---

## 📦 Project Structure

```
NYAYAMITRA/
├── frontend/                   # React 18 + TypeScript + Tailwind
│   ├── src/pages/              # 7 feature pages
│   ├── src/utils/api.ts        # TypeScript API client  
│   ├── vercel.json             # Vercel deploy config
│   └── Dockerfile.frontend     # Nginx production container
│
├── backend/                    # FastAPI + Python
│   ├── app/main.py             # FastAPI app (38 routes)
│   ├── app/api/routes/         # 8 route modules
│   │   ├── counsellor.py       # Voice Counsellor + RAG
│   │   ├── decoder.py          # Document Decoder
│   │   ├── documents.py        # Document Generator (47 types)
│   │   ├── amendments.py       # Amendment Tracker
│   │   ├── cases.py            # Case Tracker
│   │   ├── negotiate.py        # Negotiation Coach (6 scenarios)
│   │   ├── score.py            # NyayaScore
│   │   └── health.py           # Health check + RAG seed
│   ├── app/rag/legal_brain.py  # RAG pipeline (ChromaDB + Groq)
│   ├── app/services/           # Voice, Document, Amendment services
│   ├── Dockerfile              # Multi-stage Python container
│   ├── railway.toml            # Railway deploy config
│   └── requirements.txt
│
├── docker-compose.yml          # Full stack local Docker
└── .github/workflows/deploy.yml # CI/CD (Vercel + Railway)
```

---

## 🌐 Deployment

### Option A — Vercel + Railway (Recommended, Free)

**Backend (Railway):**
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# From backend/ directory:
cd backend
railway init
railway up

# Set environment variables in Railway dashboard:
railway variables set GROQ_API_KEY=gsk_...
railway variables set OPENAI_API_KEY=sk-...
railway variables set SARVAM_API_KEY=...
railway variables set DATABASE_URL=postgresql://...  # Railway provides this
railway variables set APP_ENV=production
railway variables set DEBUG=false
```

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm install -g vercel

# From frontend/ directory:
cd frontend
vercel --prod

# Set in Vercel dashboard → Settings → Environment Variables:
VITE_API_URL=https://your-railway-url.up.railway.app
```

### Option B — Docker Compose (Self-hosted)

```bash
# Copy and fill env vars
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Launch entire stack
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option C — Seed ChromaDB after deployment

```bash
# After backend is running, seed the 25 core Indian statutes:
curl -X POST https://your-api-url.com/api/v1/rag/seed
```

---

## 🧪 API Endpoints Quick Reference

```
# Health
GET  /health                    → System status

# Voice Counsellor (RAG)  
POST /api/v1/counsellor/text    → Text query → legal answer
GET  /api/v1/counsellor/demo    → Sample response

# Document Decoder
POST /api/v1/decoder/analyze     → Upload/text → clause analysis
POST /api/v1/decoder/analyze/demo → Demo analysis
POST /api/v1/decoder/counter    → Generate counter-clause

# Document Generator
GET  /api/v1/documents/types    → All 47 doc types
POST /api/v1/documents/generate → Generate document

# Case Tracker
GET  /api/v1/cases/             → List cases
POST /api/v1/cases/             → Create case
GET  /api/v1/cases/limitation/{type} → Limitation period

# Negotiation Coach
GET  /api/v1/negotiate/scenarios → 6 role-play scenarios
POST /api/v1/negotiate/start    → Start session
POST /api/v1/negotiate/message  → Chat with AI persona
POST /api/v1/negotiate/debrief  → Get coaching report

# NyayaScore
POST /api/v1/score/compute      → Calculate score
GET  /api/v1/score/checklist    → Improvement checklist

# Amendments
GET  /api/v1/amendments/        → Recent amendments
GET  /api/v1/amendments/ipc-bns → IPC→BNS mapping
```

---

## 🛡️ Security & Compliance

- **DPDP Act 2023** compliant architecture
- **AES-256-GCM** client-side encryption for case data (zero-knowledge)
- No plaintext PII stored on server
- Rate limiting: 200 req/min per IP
- CORS configured for production domains only
- Security headers via Vercel (`vercel.json`)

---

## 📱 Android APK (Capacitor)

```bash
cd frontend
npx cap init "NyayaMitra" "in.nyayamitra.app"
npm install @capacitor/android @capacitor/camera @capacitor/microphone
npx cap add android
npm run build && npx cap sync android
npx cap open android   # Opens Android Studio
```

---

## 🤝 Team Return 0;

Built with ❤️ for Hacksagon 2026 — *Legal Justice for Every Indian*
