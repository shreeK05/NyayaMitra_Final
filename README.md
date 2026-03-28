# NyayaMitra 🇮🇳⚖️
### AI-Powered Legal Justice for Every Indian

> **NyayaMitra** is a high-performance, AI-driven legal assistance platform designed to provide instant, accurate, and accessible legal guidance to 1.4 billion Indian citizens. Built with a 3D glassmorphism UI and a robust RAG (Retrieval-Augmented Generation) backend.

[![Deploy Backend (Render)](https://img.shields.io/badge/Deploy-Render-blue)](https://render.com)
[![Deploy Frontend (Netlify)](https://img.shields.io/badge/Deploy-Netlify-00C7B7)](https://netlify.com)
[![Mobile App (Flutter)](https://img.shields.io/badge/App-Flutter-02569B)](https://flutter.dev)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## ✨ 7 Pillars | 35+ Features

| Pillar | Feature | Status |
|--------|---------|--------|
| 🎤 **Voice Counsellor** | RAG + Groq LLM in 6 Indian languages (Hindi, Marathi, Tamil, etc.) | ✅ Live |
| 🔍 **Document Decoder** | AI clause-by-clause risk analysis + counter-clause generation | ✅ Live |
| 📄 **Document Generator** | Draft 47 legal document types (Notices, Affidavits) in seconds | ✅ Live |
| 📡 **Amendment Tracker** | Live Indian Gazette scraper + Automatic IPC→BNS section mapping | ✅ Live |
| ⚖️ **Case Tracker** | Smart timeline tracking + limitation period calculator | ✅ Live |
| 📊 **NyayaScore** | Unified legal health metric based on documentation & compliance | ✅ Live |
| 🤝 **Negotiation Coach** | AI role-play scenarios for out-of-court settlements | ✅ Live |

---

## 🔑 Project Structure (Single Repo)

This is a monolithic repository containing the entire NyayaMitra ecosystem:

```
NyayaMitra_Final/
├── backend/            # FastAPI (Python 3.12) - The Legal Brain
├── frontend/           # React 18 + Vite + Tailwind - The 3D UI
├── mobile_flutter/     # Flutter WebView Wrapper - Cross-platform Mobile
└── whatsapp-bot/       # Node.js Webhook - Automated Helpdesk
```

---

## 🌐 Deployment Instructions

### 1. Backend (Render.com)
*   **Root Directory:** `backend`
*   **Build Command:** `pip install -r requirements.txt`
*   **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
*   **Environment Variables:** Add `GROQ_API_KEY`, `OPENAI_API_KEY`, `SARVAM_API_KEY`.

### 2. Frontend (Netlify.com)
*   **Base directory:** `frontend`
*   **Build command:** `npm run build`
*   **Publish directory:** `dist`
*   **Environment Variable:** Add `VITE_API_URL` (points to your Render URL).

### 3. Mobile App (Flutter)
Point the URL in `lib/main.dart` to your live Netlify site and build:
```bash
cd mobile_flutter
flutter build apk --release
```

---

## 🛠️ Local Development

```bash
# Start Backend
cd backend && python run.py

# Start Frontend
cd frontend && npm install && npm run dev
```

---

## 🛡️ Security & Compliance
- **DPDP Act 2023** compliant architecture.
- **IPC to BNS Transition:** Automatic mapping for all sections of the Bharatiya Nyaya Sanhita.
- **Zero-Knowledge Privacy:** Case data is encrypted client-side.

---

## 🤝 Team Return 0;
Built with ❤️ for Hacksagon 2026 — *Legal Justice for Every Indian*
