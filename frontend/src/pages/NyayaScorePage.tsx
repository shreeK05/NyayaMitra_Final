/**
 * NyayaScore Dashboard Page
 * Shows legal health score 0-100 with radial gauge + shareable card
 * Calls /api/v1/score/compute and /api/v1/score/checklist
 */
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Download, RefreshCw, CheckCircle2, XCircle, AlertTriangle, Trophy } from 'lucide-react'
import { cn } from '@/utils'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface ScoreData {
  total_score: number
  grade: string
  employment_score: number
  tenancy_score: number
  consumer_score: number
  personal_safety_score: number
  document_readiness_score: number
  priority_issues: Array<{ issue: string; severity: string; action: string; points: number }>
  strengths: string[]
  immediate_actions: string[]
}

const SCORE_COLORS = {
  '-': { color: '#94a3b8', label: 'Not computed', bg: 'rgba(148,163,184,0.1)' },
  'F': { color: '#f87171', label: 'Critical Risk', bg: 'rgba(239,68,68,0.1)' },
  'D': { color: '#fb923c', label: 'High Risk', bg: 'rgba(251,146,60,0.1)' },
  'C': { color: '#fbbf24', label: 'Moderate Risk', bg: 'rgba(251,191,36,0.1)' },
  'B': { color: '#34d399', label: 'Good', bg: 'rgba(52,211,153,0.1)' },
  'A': { color: '#22d3ee', label: 'Excellent', bg: 'rgba(34,211,238,0.1)' },
}

const CHECKLIST_QUESTIONS = [
  { id: 'employment_contract', label: 'Do you have a written employment contract?', domain: 'employment' },
  { id: 'salary_slip', label: 'Do you receive monthly salary slips?', domain: 'employment' },
  { id: 'pf_active', label: 'Is your PF/ESIC active with correct employer contributions?', domain: 'employment' },
  { id: 'rent_agreement', label: 'Is your rental agreement registered with sub-registrar?', domain: 'tenancy' },
  { id: 'rent_receipts', label: 'Do you keep rent payment receipts?', domain: 'tenancy' },
  { id: 'consumer_complaint', label: 'Have you ever filed a consumer complaint online at consumerhelpline.gov.in?', domain: 'consumer' },
  { id: 'insurance_active', label: 'Do you have active health insurance?', domain: 'consumer' },
  { id: 'aadhaar_linked', label: 'Is your Aadhaar linked to your bank account?', domain: 'document' },
  { id: 'nominee_updated', label: 'Have you updated nominee in all bank accounts?', domain: 'document' },
  { id: 'will_written', label: 'Have you written a Will (if applicable)?', domain: 'document' },
  { id: 'knows_dlsa', label: 'Do you know the DLSA helpline number (15100)?', domain: 'safety' },
  { id: 'women_helpline', label: 'Do you know the Women Helpline number (181)?', domain: 'safety' },
]

function RadialScoreGauge({ score, grade }: { score: number; grade: string }) {
  const config = SCORE_COLORS[grade as keyof typeof SCORE_COLORS] || SCORE_COLORS['-']
  const circumference = 2 * Math.PI * 76
  const strokeDash = (score / 100) * circumference

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 176 176" className="w-full h-full -rotate-90">
        {/* Background circle */}
        <circle cx="88" cy="88" r="76" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        {/* Score arc */}
        <motion.circle
          cx="88" cy="88" r="76"
          fill="none"
          stroke={config.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
        {/* Glow */}
        <motion.circle
          cx="88" cy="88" r="76"
          fill="none"
          stroke={config.color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          opacity={0.3}
          filter="blur(4px)"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-center"
        >
          <div className="font-black text-5xl" style={{ color: config.color }}>{score}</div>
          <div className="text-[11px] text-slate-400 font-semibold mt-0.5">/100</div>
          <div className="text-xs font-bold mt-1 px-2.5 py-0.5 rounded-full" style={{ color: config.color, backgroundColor: config.bg }}>
            Grade {grade}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function DomainBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400 text-[11px] w-32 shrink-0">{label}</span>
      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        />
      </div>
      <span className="text-xs font-bold shrink-0" style={{ color }}>{score}</span>
    </div>
  )
}

export default function NyayaScorePage() {
  const [stage, setStage] = useState<'quiz' | 'loading' | 'score'>('quiz')
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [scoreData, setScoreData] = useState<ScoreData | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [shareMsg, setShareMsg] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const question = CHECKLIST_QUESTIONS[currentQ]

  const answerQuestion = (yes: boolean) => {
    const newAnswers = { ...answers, [question.id]: yes }
    setAnswers(newAnswers)

    if (currentQ < CHECKLIST_QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1)
    } else {
      computeScore(newAnswers)
    }
  }

  const computeScore = async (finalAnswers: Record<string, boolean>) => {
    setStage('loading')
    
    try {
      const res = await fetch(`${API_BASE}/api/v1/score/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklist_responses: finalAnswers }),
      })
      if (res.ok) {
        const data = await res.json()
        setScoreData(data)
        setStage('score')
        return
      }
    } catch { /* fallback below */ }

    // Local computation fallback
    const yesCount = Object.values(finalAnswers).filter(Boolean).length
    const score = Math.round((yesCount / CHECKLIST_QUESTIONS.length) * 100)
    const grade = score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : score >= 35 ? 'D' : 'F'

    const mockScore: ScoreData = {
      total_score: score,
      grade,
      employment_score: finalAnswers.employment_contract && finalAnswers.salary_slip && finalAnswers.pf_active ? 85 : 40,
      tenancy_score: finalAnswers.rent_agreement && finalAnswers.rent_receipts ? 80 : 35,
      consumer_score: finalAnswers.consumer_complaint && finalAnswers.insurance_active ? 75 : 30,
      personal_safety_score: finalAnswers.knows_dlsa && finalAnswers.women_helpline ? 90 : 25,
      document_readiness_score: finalAnswers.aadhaar_linked && finalAnswers.nominee_updated ? 70 : 30,
      priority_issues: score < 60 ? [
        { issue: 'Unregistered rent agreement', severity: 'high', action: 'Register at sub-registrar office (Rs. 1000)', points: 15 },
        { issue: 'No written employment contract', severity: 'high', action: 'Request signed contract from employer', points: 20 },
      ] : [],
      strengths: yesCount > 6 ? ['Good document readiness', 'Aware of emergency helplines'] : [],
      immediate_actions: ['Call DLSA helpline 15100 for free advice', 'Register rent agreement if unregistered'],
    }
    setScoreData(mockScore)
    setStage('score')
  }

  const shareScore = async () => {
    if (!scoreData) return
    const text = `🏆 My NyayaMitra Legal Health Score: ${scoreData.total_score}/100 (Grade ${scoreData.grade})\n\nCheck yours FREE at: nyaya-mitra-ai-legal-assistant.vercel.app ⚖️`
    
    if (navigator.share) {
      await navigator.share({ text, title: 'My NyayaScore', url: 'https://nyaya-mitra-ai-legal-assistant.vercel.app' })
    } else {
      await navigator.clipboard.writeText(text)
      setShareMsg(true)
      setTimeout(() => setShareMsg(false), 2000)
    }
  }

  const config = scoreData ? (SCORE_COLORS[scoreData.grade as keyof typeof SCORE_COLORS] || SCORE_COLORS['-']) : SCORE_COLORS['-']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-5 space-y-5 max-w-lg mx-auto"
    >
      {/* ── Quiz Stage ── */}
      {stage === 'quiz' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-white font-bold text-xl">📊 NyayaScore</h2>
            <p className="text-slate-400 text-sm mt-1">
              {currentQ + 1} of {CHECKLIST_QUESTIONS.length} — Legal health check
            </p>
          </div>

          {/* Progress */}
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
              animate={{ width: `${((currentQ + 1) / CHECKLIST_QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Domain badge */}
          <div className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 font-bold w-fit uppercase tracking-wider">
            {question.domain.replace('_', ' ')} Domain
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-3xl p-6 border border-white/10"
            >
              <p className="text-white text-lg font-semibold leading-relaxed min-h-[3rem]">
                {question.label}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Answer buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => answerQuestion(true)}
              className="py-5 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 
                         hover:bg-emerald-500/25 hover:border-emerald-500/60 transition-all"
            >
              <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-2" />
              <div className="text-white font-bold">Yes</div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => answerQuestion(false)}
              className="py-5 rounded-2xl bg-red-500/10 border-2 border-red-500/25 
                         hover:bg-red-500/20 hover:border-red-500/50 transition-all"
            >
              <XCircle size={28} className="text-red-400 mx-auto mb-2" />
              <div className="text-white font-bold">No</div>
            </motion.button>
          </div>

          {currentQ > 0 && (
            <button
              onClick={() => setCurrentQ(q => q - 1)}
              className="text-slate-500 text-xs hover:text-slate-300 transition-colors w-full text-center"
            >
              ← Previous question
            </button>
          )}
        </div>
      )}

      {/* ── Loading ── */}
      {stage === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
          <p className="text-slate-400 text-sm">Computing your legal health score...</p>
        </div>
      )}

      {/* ── Score Display ── */}
      {stage === 'score' && scoreData && (
        <div className="space-y-5" ref={cardRef}>
          {/* Score card */}
          <div className="glass-card rounded-3xl p-6 border" style={{ borderColor: config.color + '40' }}>
            <div className="text-center mb-2">
              <h2 className="text-white font-bold text-xl mb-0.5">Your NyayaScore</h2>
              <p className="text-sm font-semibold" style={{ color: config.color }}>{config.label}</p>
            </div>

            <RadialScoreGauge score={scoreData.total_score} grade={scoreData.grade} />

            {/* Domain breakdown */}
            <div className="space-y-3 mt-5">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Domain Breakdown</p>
              <DomainBar label="Employment Safety" score={scoreData.employment_score} color="#34d399" />
              <DomainBar label="Tenancy Safety" score={scoreData.tenancy_score} color="#22d3ee" />
              <DomainBar label="Consumer Rights" score={scoreData.consumer_score} color="#a78bfa" />
              <DomainBar label="Personal Safety" score={scoreData.personal_safety_score} color="#f97316" />
              <DomainBar label="Document Readiness" score={scoreData.document_readiness_score} color="#fbbf24" />
            </div>
          </div>

          {/* Priority Issues */}
          {scoreData.priority_issues.length > 0 && (
            <div className="glass-card rounded-2xl p-4 border border-red-500/20">
              <p className="text-[10px] text-red-400 font-bold uppercase mb-3 flex items-center gap-1.5">
                <AlertTriangle size={12} /> Priority Issues
              </p>
              <div className="space-y-2">
                {scoreData.priority_issues.slice(0, 4).map((issue, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-red-500/8 border border-red-500/15">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-slate-200 font-semibold">{issue.issue}</p>
                      <span className="text-[10px] text-emerald-400 font-bold shrink-0">+{issue.points}pts</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{issue.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {scoreData.strengths.length > 0 && (
            <div className="glass-card rounded-2xl p-4 border border-emerald-500/20">
              <p className="text-[10px] text-emerald-400 font-bold uppercase mb-2 flex items-center gap-1.5">
                <Trophy size={12} /> Your Strengths
              </p>
              {scoreData.strengths.map((s, i) => (
                <p key={i} className="text-sm text-slate-300 mb-1">✅ {s}</p>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareScore}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl glass-card border border-white/10 hover:border-white/25 transition-all text-white font-semibold text-sm"
            >
              <Share2 size={16} />
              {shareMsg ? 'Copied!' : 'Share Score'}
            </button>
            <button
              onClick={() => { setStage('quiz'); setCurrentQ(0); setAnswers({}) }}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl glass-card border border-white/10 hover:border-white/25 transition-all text-white font-semibold text-sm"
            >
              <RefreshCw size={16} />
              Retake
            </button>
          </div>

          <button
            onClick={() => window.location.href = '/counsellor'}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl gradient-primary glow-saffron text-white font-bold transition-all hover:scale-[1.02]"
          >
            ⚖️ Get Legal Advice on Priority Issues
          </button>
        </div>
      )}
    </motion.div>
  )
}
