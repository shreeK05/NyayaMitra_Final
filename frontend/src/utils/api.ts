/**
 * NyayaMitra API Client
 * Connects frontend to FastAPI backend at localhost:8000
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface LegalResponse {
  answer: string
  law_citations: string[]
  win_probability: number
  confidence: number
  next_steps: string[]
  limitation_days?: number
  doc_types_relevant: string[]
  distress_detected: boolean
  case_type: string
  retrieved_sections: string[]
  ipc_to_bns_applied: Record<string, string>
  conversation_id?: string
}

interface DocType {
  id: string
  name: string
  category: string
  act: string
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Network error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Voice Counsellor ─────────────────────────────────
export async function askLegalQuestion(params: {
  query: string
  language?: string
  user_state?: string
  conversation_id?: string
  conversation_history?: Array<{ role: string; content: string }>
}): Promise<LegalResponse> {
  return apiFetch('/api/v1/counsellor/text', {
    method: 'POST',
    body: JSON.stringify({
      query: params.query,
      language: params.language || 'hi',
      user_state: params.user_state || 'Maharashtra',
      conversation_id: params.conversation_id,
      conversation_history: params.conversation_history || [],
    }),
  })
}

export async function getDemoLegalResponse(): Promise<LegalResponse> {
  return apiFetch('/api/v1/counsellor/demo')
}

// ── Document Generator ───────────────────────────────
export async function getDocumentTypes(): Promise<{ doc_types: DocType[]; total: number }> {
  return apiFetch('/api/v1/documents/types')
}

export async function generateDocument(params: {
  doc_type: string
  form_data: Record<string, string>
  language?: string
}) {
  return apiFetch('/api/v1/documents/generate', {
    method: 'POST',
    body: JSON.stringify({
      doc_type: params.doc_type,
      form_data: params.form_data,
      language: params.language || 'en',
    }),
  })
}

export async function timestampDocument(docId: string, content: Record<string, string>) {
  return apiFetch(`/api/v1/documents/${docId}/timestamp`, {
    method: 'POST',
    body: JSON.stringify(content),
  })
}

// ── Amendments ───────────────────────────────────────
export async function getAmendments(category?: string) {
  const qs = category ? `?category=${category}` : ''
  return apiFetch(`/api/v1/amendments/${qs}`)
}

export async function getIpcBnsMapping() {
  return apiFetch('/api/v1/amendments/ipc-bns')
}

export async function translateIpcToBns(section: string) {
  return apiFetch(`/api/v1/amendments/translate/${section}`)
}

// ── NyayaScore ───────────────────────────────────────
export async function computeNyayaScore(checklistResponses: Record<string, boolean>, activeCasesCount: number = 0) {
  return apiFetch('/api/v1/score/compute', {
    method: 'POST',
    body: JSON.stringify({
      checklist_responses: checklistResponses,
      active_cases_count: activeCasesCount,
    }),
  })
}

// ── Health ───────────────────────────────────────────
export async function getHealthStatus() {
  return apiFetch('/health')
}

export async function seedChromaDB() {
  return apiFetch('/api/v1/rag/seed', { method: 'POST' })
}

// ── Document Decoder ─────────────────────────────────
export async function analyzeDocumentDemo() {
  return apiFetch('/api/v1/decoder/analyze/demo', { method: 'POST' })
}

export async function analyzeDocumentText(text: string, docType: string = 'general') {
  const form = new FormData()
  form.append('text_content', text)
  form.append('doc_type', docType)
  const res = await fetch(`${BASE_URL}/api/v1/decoder/analyze`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function analyzeDocumentFile(file: File, docType: string = 'general') {
  const form = new FormData()
  form.append('file', file)
  form.append('doc_type', docType)
  const res = await fetch(`${BASE_URL}/api/v1/decoder/analyze`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function generateCounterClause(clauseText: string, riskLevel: string) {
  const form = new FormData()
  form.append('clause_text', clauseText)
  form.append('risk_level', riskLevel)
  const res = await fetch(`${BASE_URL}/api/v1/decoder/counter`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ── Case Tracker ─────────────────────────────────────
export async function getCases(userId?: string) {
  const qs = userId ? `?user_id=${userId}` : ''
  return apiFetch(`/api/v1/cases/${qs}`)
}

export async function getDemoCases() {
  return apiFetch('/api/v1/cases/demo')
}

export async function createCase(data: {
  title: string
  case_type: string
  facts: string
  acts_relevant?: string[]
}) {
  return apiFetch('/api/v1/cases/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getLimitationPeriod(caseType: string) {
  return apiFetch(`/api/v1/cases/limitation/${caseType}`)
}

// ── Negotiation Coach ─────────────────────────────────
export async function getNegotiationScenarios() {
  return apiFetch('/api/v1/negotiate/scenarios')
}

export async function startNegotiationSession(scenarioId: string, language: string = 'hi') {
  return apiFetch('/api/v1/negotiate/start', {
    method: 'POST',
    body: JSON.stringify({ scenario_id: scenarioId, language }),
  })
}

export async function sendNegotiationMessage(params: {
  session_id: string
  scenario_id: string
  user_message: string
  history: Array<{ role: string; content: string }>
  language?: string
}) {
  return apiFetch('/api/v1/negotiate/message', {
    method: 'POST',
    body: JSON.stringify({ ...params, language: params.language || 'hi' }),
  })
}

export async function getNegotiationDebrief(params: {
  scenario_id: string
  transcript: Array<{ role: string; content: string }>
}) {
  return apiFetch('/api/v1/negotiate/debrief', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

// ── ML Models ─────────────────────────────────────────

export async function predictWinProbability(params: {
  case_type: string
  state: string
  court_level: string
  evidence: string
  time_elapsed: number
}) {
  return apiFetch('/api/v1/ml/predict', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export async function analyzeVoiceEmotion(audioBlob: Blob) {
  const form = new FormData()
  form.append('audio', audioBlob, 'audio.webm')
  const res = await fetch(`${BASE_URL}/api/v1/ml/emotion`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ── Auth ──────────────────────────────────────────────
export async function sendOtp(phone_number: string) {
  return apiFetch('/api/v1/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone_number }),
  })
}

export async function verifyOtp(params: { phone_number: string; otp: string; name?: string; state?: string }) {
  return apiFetch('/api/v1/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export const API_BASE = BASE_URL

