import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Share2, Download, RefreshCw, CheckCircle2, XCircle, 
  AlertTriangle, Trophy, Shield, Briefcase, Home, 
  ShoppingCart, Lock, Zap, ChevronRight, Star,
  Info, Award, Sparkles, Mic
} from 'lucide-react'
import { computeNyayaScore } from '@/utils/api'
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
  '-': { color: '#94a3b8', label: 'Computing...', bg: 'rgba(148,163,184,0.1)', icon: Info },
  'F': { color: '#ef4444', label: 'CRITICAL RISK', bg: 'rgba(239,68,68,0.1)', icon: AlertTriangle },
  'D': { color: '#f97316', label: 'HIGH RISK', bg: 'rgba(249,115,22,0.1)', icon: AlertTriangle },
  'C': { color: '#f59e0b', label: 'MODERATE RISK', bg: 'rgba(245,158,11,0.1)', icon: Zap },
  'B': { color: '#10b981', label: 'SECURE', bg: 'rgba(16,185,129,0.1)', icon: Shield },
  'A': { color: '#06b6d4', label: 'ELITE PROTECTION', bg: 'rgba(6,182,212,0.1)', icon: Award },
}

const CHECKLIST_QUESTIONS = [
  { id: 'employment_contract', label: 'Do you have a signed employment contract?', domain: 'employment', icon: Briefcase },
  { id: 'salary_slip', label: 'Do you receive regular, itemized salary slips?', domain: 'employment', icon: Briefcase },
  { id: 'rent_agreement', label: 'Is your rental agreement registered with the govt?', domain: 'tenancy', icon: Home },
  { id: 'rent_receipts', label: 'Do you have digital/paper rent receipts for 6 months?', domain: 'tenancy', icon: Home },
  { id: 'consumer_complaint', label: 'Have you used the National Consumer Helpline before?', domain: 'consumer', icon: ShoppingCart },
  { id: 'insurance_active', label: 'Do you have active Health or Term insurance?', domain: 'consumer', icon: ShoppingCart },
  { id: 'aadhaar_linked', label: 'Is your Aadhaar biometrics locked/linked correctly?', domain: 'document', icon: Lock },
  { id: 'nominee_updated', label: 'Are nominees updated in your bank/demat accounts?', domain: 'document', icon: Lock },
  { id: 'knows_dlsa', label: 'Do you know how to dial 15100 for Free Legal Aid?', domain: 'safety', icon: Shield },
  { id: 'women_helpline', label: 'Is the 1091/181 helpline saved in your phone?', domain: 'safety', icon: Shield },
]

function RadialScoreGauge({ score, grade }: { score: number; grade: string }) {
  const config = SCORE_COLORS[grade as keyof typeof SCORE_COLORS] || SCORE_COLORS['-']
  const circumference = 2 * Math.PI * 85
  const strokeDash = (score / 100) * circumference

  return (
    <div className="relative w-64 h-64 mx-auto mb-6">
      <div className="absolute inset-0 bg-white/5 rounded-full blur-[40px] opacity-10" style={{ backgroundColor: config.color }} />
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="14" />
        <motion.circle
          cx="100" cy="100" r="85"
          fill="none"
          stroke={config.color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        />
        <circle cx="100" cy="100" r="85" fill="none" stroke={config.color} strokeWidth="2" strokeDasharray={`${circumference}`} strokeDashoffset={circumference - strokeDash} opacity="0.3" filter="blur(8px)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">PROTECTION QUOTIENT</div>
          <div className="font-black text-6xl tracking-tighter text-white drop-shadow-lg">{score}</div>
          <div className="mt-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border" 
            style={{ color: config.color, backgroundColor: config.bg, borderColor: config.color + '40' }}>
            {config.label}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function CategoryCard({ label, score, color, icon: Icon }: { label: string; score: number; color: string; icon: any }) {
  return (
    <div className="glass-diamond rounded-3xl p-5 border-none group relative overflow-hidden" style={{ background: color + '05' }}>
      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
        <Icon size={40} style={{ color }} />
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '15' }}>
              <Icon size={18} style={{ color }} />
           </div>
           <span className="text-white font-black text-xs uppercase tracking-tighter">{label}</span>
        </div>
        <div className="space-y-2">
           <div className="flex justify-between items-end">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Legal Coverage</span>
              <span className="text-base font-black" style={{ color }}>{score}%</span>
           </div>
           <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: 0.5 }} />
           </div>
        </div>
      </div>
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
      const data: any = await computeNyayaScore(finalAnswers)
      if (data) {
        // Map backend components to frontend expectations
        const mappedData: ScoreData = {
          total_score: data.total_score,
          grade: data.status === 'Protected' ? 'A' : data.status === 'Good' ? 'B' : data.status === 'Fair' ? 'C' : data.status === 'At Risk' ? 'D' : 'F',
          employment_score: data.components.employment.score,
          tenancy_score: data.components.tenancy.score,
          consumer_score: data.components.consumer.score,
          personal_safety_score: data.components.personal_safety.score,
          document_readiness_score: data.components.document_readiness.score,
          priority_issues: data.improvement_priority.map((p: any) => ({
            issue: p.action,
            severity: 'high',
            action: p.estimated_gain,
            points: parseInt(p.estimated_gain) || 10
          })),
          strengths: data.total_score > 70 ? ['High Safety Awareness', 'Digital Ready'] : ['Basic Awareness Active'],
          immediate_actions: data.all_issues.slice(0, 2),
        }
        setScoreData(mappedData)
        setStage('score')
        return
      }
    } catch (err) {
      console.error('Score compute failed:', err)
    }

    const yesCount = Object.values(finalAnswers).filter(Boolean).length
    const score = Math.round((yesCount / CHECKLIST_QUESTIONS.length) * 100)
    const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F'

    const mockScore: ScoreData = {
      total_score: score,
      grade,
      employment_score: finalAnswers.employment_contract && finalAnswers.salary_slip ? 90 : 35,
      tenancy_score: finalAnswers.rent_agreement && finalAnswers.rent_receipts ? 85 : 30,
      consumer_score: finalAnswers.consumer_complaint && finalAnswers.insurance_active ? 80 : 40,
      personal_safety_score: finalAnswers.knows_dlsa && finalAnswers.women_helpline ? 95 : 20,
      document_readiness_score: finalAnswers.aadhaar_linked && finalAnswers.nominee_updated ? 75 : 25,
      priority_issues: score < 80 ? [
        { issue: 'Unprotected Rental Tenure', severity: 'high', action: 'Register agreement via e-portal', points: 15 },
        { issue: 'Lack of Service Document', severity: 'high', action: 'Draft formal contract via generator', points: 20 },
        { issue: 'Digital Identity Vulnerability', severity: 'medium', action: 'Review Aadhaar biometric locks', points: 10 },
      ] : [],
      strengths: yesCount > 7 ? ['High Safety Awareness', 'Digital Ready', 'Proactive Right Audit'] : ['Basic Awareness Active'],
      immediate_actions: ['Dial 15100 to verify aid eligibility', 'Register rent agreement before expiry'],
    }
    setScoreData(mockScore)
    setStage('score')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-6 max-w-2xl mx-auto space-y-8 mesh-gradient min-h-screen">
      
      {stage === 'quiz' && (
        <div className="space-y-8 py-10">
          <div className="text-center">
            <h1 className="text-white font-black text-3xl tracking-tighter uppercase italic">Legal Defense Audit</h1>
            <p className="text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest leading-loose">
               STEP {currentQ + 1} OF {CHECKLIST_QUESTIONS.length} • {question.domain} SYSTEM
            </p>
          </div>

          <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-saffron to-orange-600" animate={{ width: `${((currentQ + 1) / CHECKLIST_QUESTIONS.length) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="glass-diamond rounded-[2.5rem] p-10 text-center relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-[40px]" />
               <div className="w-16 h-16 rounded-2xl glass-diamond flex items-center justify-center mx-auto mb-8 border-orange-500/20">
                  <question.icon size={24} className="text-orange-400" />
               </div>
               <p className="text-white text-2xl font-black tracking-tight leading-tight">{question.label}</p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => answerQuestion(true)} className="py-7 rounded-[2rem] glass-diamond bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 transition-all">
               <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
               <div className="text-white font-black uppercase tracking-widest text-xs">Verify Yes</div>
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => answerQuestion(false)} className="py-7 rounded-[2rem] glass-diamond bg-red-500/10 border-red-500/30 hover:bg-red-500/20 transition-all">
               <XCircle size={32} className="text-red-400 mx-auto mb-3" />
               <div className="text-white font-black uppercase tracking-widest text-xs">Verify No</div>
            </motion.button>
          </div>
        </div>
      )}

      {stage === 'loading' && (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <div className="w-20 h-20 rounded-3xl glass-diamond border-none relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-orange-500/10 animate-pulse" />
             <RefreshCw size={32} className="text-orange-400 animate-spin" />
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">AI Protection Computation...</p>
        </div>
      )}

      {stage === 'score' && scoreData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20 overflow-visible">
          
          {/* Header */}
          <div className="text-center relative">
             <Star size={32} className="text-saffron opacity-20 absolute -top-10 left-1/2 -translate-x-1/2 animate-pulse" />
             <h2 className="text-white font-black text-3xl tracking-tighter uppercase italic">Legal Health Dashboard</h2>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Certified Security Grade AI</p>
          </div>

          <RadialScoreGauge score={scoreData.total_score} grade={scoreData.grade} />

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             <CategoryCard label="Employment" score={scoreData.employment_score} color="#34d399" icon={Briefcase} />
             <CategoryCard label="Tenancy" score={scoreData.tenancy_score} color="#06b6d4" icon={Home} />
             <CategoryCard label="Consumer" score={scoreData.consumer_score} color="#7c3aed" icon={ShoppingCart} />
             <CategoryCard label="Personal Safety" score={scoreData.personal_safety_score} color="#f59e0b" icon={Shield} />
          </div>

          {/* Priority Quests */}
          {scoreData.priority_issues.length > 0 && (
            <div className="space-y-4">
               <div className="flex items-center gap-2 px-2">
                  <Zap size={16} className="text-orange-400" />
                  <h3 className="text-white font-black text-sm uppercase tracking-widest">Active Legal Quests</h3>
               </div>
               <div className="grid gap-3">
                  {scoreData.priority_issues.map((quest, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.02 }} className="glass-diamond rounded-[2rem] p-6 border-saffron/10 flex items-center gap-5 relative group overflow-hidden">
                       <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="w-12 h-12 rounded-2xl glass-diamond flex flex-col items-center justify-center shrink-0 border-saffron/20">
                          <span className="text-saffron font-black text-xs">+{quest.points}</span>
                          <span className="text-[7px] text-slate-500 font-bold uppercase tracking-tighter">PTS</span>
                       </div>
                       <div className="flex-1">
                          <span className="text-red-400 text-[9px] font-black uppercase tracking-widest">{quest.severity} Priority</span>
                          <h4 className="text-white font-black text-base tracking-tight">{quest.issue}</h4>
                          <p className="text-slate-500 text-[10px] font-medium mt-1 leading-snug">{quest.action}</p>
                       </div>
                       <ChevronRight size={20} className="text-slate-700 group-hover:text-saffron transition-colors" />
                    </motion.div>
                  ))}
               </div>
            </div>
          )}

          {/* Social Proof Actions */}
          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => { setStage('quiz'); setCurrentQ(0) }} className="py-5 rounded-[2rem] glass-diamond text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">
                Re-Audit System
             </button>
             <button className="py-5 rounded-[2rem] glass-diamond text-saffron font-black text-[10px] uppercase tracking-widest border-saffron/20 flex items-center justify-center gap-2">
                <Share2 size={13} /> Share Grade
             </button>
          </div>

          <button onClick={() => window.location.href = '/counsellor'} className="w-full rounded-[2rem] py-8 gradient-primary glow-saffron flex flex-col items-center justify-center gap-1 group overflow-hidden relative">
             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-2">
                <Mic size={20} className="text-white" />
                <span className="text-white font-black text-xl tracking-tighter uppercase italic">Resolve Issues with AI</span>
             </div>
             <span className="text-white/60 text-[9px] font-bold uppercase tracking-[0.3em]">Start a 1-on-1 Legal Session</span>
          </button>

        </motion.div>
      )}
    </motion.div>
  )
}
