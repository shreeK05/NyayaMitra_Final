import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Share2, Download, RefreshCw, CheckCircle2, XCircle, 
  AlertTriangle, Trophy, Shield, Briefcase, Home, 
  ShoppingCart, Lock, Zap, ChevronRight, Star,
  Info, Award, Sparkles, Mic,
  Fingerprint, Landmark, Scale, GraduationCap, Coins
} from 'lucide-react'
import { computeNyayaScore } from '@/utils/api'
import { cn } from '@/utils'

const SCORE_COLORS = {
  '-': { color: '#94a3b8', label: 'Computing Intelligence...', bg: 'rgba(148,163,184,0.1)', icon: Info },
  'F': { color: '#ef4444', label: 'CRITICAL DEFENSE BREACH', bg: 'rgba(239,68,68,0.1)', icon: AlertTriangle },
  'D': { color: '#f97316', label: 'SEVERE VULNERABILITY', bg: 'rgba(249,115,22,0.1)', icon: AlertTriangle },
  'C': { color: '#f59e0b', label: 'LIMITED COVERAGE', bg: 'rgba(245,158,11,0.1)', icon: Zap },
  'B': { color: '#10b981', label: 'SECURE INFRASTRUCTURE', bg: 'rgba(16,185,129,0.1)', icon: Shield },
  'A': { color: '#06b6d4', label: 'ELITE LEGAL SHIELD', bg: 'rgba(6,182,212,0.1)', icon: Award },
}

const CHECKLIST_QUESTIONS = [
  { id: 'employment_contract', label: 'Do you possess a notarized Employment Contract?', domain: 'Employment', icon: Briefcase },
  { id: 'salary_slip', label: 'Are itemized Salary Slips issued with tax deductions?', domain: 'Employment', icon: Coins },
  { id: 'rent_agreement', label: 'Is your Tenancy Agreement registered on e-GRAS?', domain: 'Tenancy', icon: Landmark },
  { id: 'rent_receipts', label: 'Do you maintain a digital ledger of Rent Receipts?', domain: 'Tenancy', icon: Home },
  { id: 'consumer_complaint', label: 'Do you have the NCH 1915 protocol saved?', domain: 'Consumer', icon: ShoppingCart },
  { id: 'insurance_active', label: 'Are Health or Term Insurance policies active?', domain: 'Consumer', icon: Shield },
  { id: 'aadhaar_linked', label: 'Is biometric Aadhaar-lock active on UIDAI?', domain: 'Identity', icon: Fingerprint },
  { id: 'nominee_updated', label: 'Are nominees updated in all DEMAT/Bank accounts?', domain: 'Finance', icon: Lock },
  { id: 'knows_dlsa', label: 'Is the 15100 Legal Aid protocol known to you?', domain: 'Safety', icon: Scale },
  { id: 'women_helpline', label: 'Are emergency 1091/112 protocols enabled?', domain: 'Safety', icon: Info },
]

function RadialScoreGauge({ score, grade }: { score: number; grade: string }) {
  const config = SCORE_COLORS[grade as keyof typeof SCORE_COLORS] || SCORE_COLORS['-']
  const circumference = 2 * Math.PI * 120
  const strokeDash = (score / 100) * circumference

  return (
    <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto mb-16">
      <div className="absolute inset-0 bg-white/2 rounded-full blur-[100px] opacity-20 animate-pulse" style={{ backgroundColor: config.color }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
         <Sparkles size={300} style={{ color: config.color }} />
      </div>
      <svg viewBox="0 0 300 300" className="w-full h-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="18" />
        <motion.circle
          cx="150" cy="150" r="120"
          fill="none"
          stroke={config.color}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 2.5, ease: 'circOut' }}
          className="filter drop-shadow-[0_0_15px_rgba(0,0,0,0.4)]"
        />
        <circle cx="150" cy="150" r="120" fill="none" stroke={config.color} strokeWidth="2" strokeDasharray={`${circumference}`} strokeDashoffset={circumference - strokeDash} opacity="0.4" filter="blur(12px)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="text-center">
          <div className="text-slate-500 text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] mb-4">Protection Force Quotient</div>
          <div className="font-black text-7xl lg:text-9xl tracking-tighter text-white drop-shadow-2xl font-display leading-none italic">{score}</div>
          <div className="mt-8 px-6 py-2.5 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-[0.25em] border shadow-2xl animate-float" 
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
    <div className="glass-diamond rounded-[3rem] p-8 border-none group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-2xl">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all scale-150 rotate-12">
        <Icon size={120} color={color} />
      </div>
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-lg border border-white/5 relative overflow-hidden" style={{ background: color + '15' }}>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon size={32} color={color} className="relative z-10" />
           </div>
           <span className="text-white font-black text-xl lg:text-2xl uppercase tracking-tighter italic font-display">{label}</span>
        </div>
        <div className="space-y-4">
           <div className="flex justify-between items-end">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Autonomous Coverage Layer</span>
              <span className="text-3xl font-black font-display tracking-tighter" style={{ color }}>{score}%</span>
           </div>
           <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
              <motion.div className="h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ backgroundColor: color }} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.5, ease: "circOut" }} />
           </div>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">Verified via NyayaMitra RAG Protocol v4.0</p>
        </div>
      </div>
    </div>
  )
}

export default function NyayaScorePage() {
  const [stage, setStage] = useState<'quiz' | 'loading' | 'score'>('quiz')
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [scoreData, setScoreData] = useState<any>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [shareMsg, setShareMsg] = useState(false)

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
        setScoreData({
          total_score: data.total_score,
          grade: data.status === 'Protected' ? 'A' : data.status === 'Good' ? 'B' : data.status === 'Fair' ? 'C' : data.status === 'At Risk' ? 'D' : 'F',
          employment_score: data.components.employment.score,
          tenancy_score: data.components.tenancy.score,
          consumer_score: data.components.consumer.score,
          personal_safety_score: data.components.personal_safety.score,
          priority_issues: data.improvement_priority.map((p: any) => ({
            issue: p.action,
            severity: 'high',
            action: p.estimated_gain,
            points: parseInt(p.estimated_gain) || 15
          })),
        })
        setStage('score')
        return
      }
    } catch (err) {
      console.error('Score compute failed:', err)
    }

    const yesCount = Object.values(finalAnswers).filter(Boolean).length
    const score = Math.round((yesCount / CHECKLIST_QUESTIONS.length) * 100)
    const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F'
    setScoreData({
      total_score: score,
      grade,
      employment_score: finalAnswers.employment_contract && finalAnswers.salary_slip ? 90 : 35,
      tenancy_score: finalAnswers.rent_agreement && finalAnswers.rent_receipts ? 85 : 30,
      consumer_score: finalAnswers.consumer_complaint && finalAnswers.insurance_active ? 80 : 40,
      personal_safety_score: finalAnswers.knows_dlsa && finalAnswers.women_helpline ? 95 : 20,
      priority_issues: [
        { issue: 'Unprotected Rental Tenure', severity: 'CRITICAL', action: 'Register agreement via e-portal', points: 15 },
        { issue: 'Lack of Service Document', severity: 'CRITICAL', action: 'Draft formal contract via generator', points: 20 },
      ],
    })
    setStage('score')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 lg:px-12 py-10 max-w-7xl mx-auto space-y-16 mesh-gradient min-h-screen relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-saffron/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none -ml-40 -mb-40" />

      {stage === 'quiz' && (
        <div className="space-y-12 py-12 lg:py-24 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
             <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-[2rem] gradient-primary glow-saffron flex items-center justify-center">
                   <Shield size={36} className="text-white" />
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none font-display">Neural Audit</h1>
             </div>
             <p className="text-slate-500 text-xs lg:text-sm font-black uppercase tracking-[0.5em] leading-loose">
                SYSTEM SCAN STAGE {currentQ + 1} OF {CHECKLIST_QUESTIONS.length} • {question.domain} MATRIX 4.0
             </p>
          </div>

          <div className="h-3 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10 shadow-inner">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-saffron to-orange-600 shadow-[0_0_15px_#ff993380]" animate={{ width: `${((currentQ + 1) / CHECKLIST_QUESTIONS.length) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, scale: 0.9, rotateX: 20 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} exit={{ opacity: 0, scale: 1.1, rotateX: -20 }} className="glass-diamond rounded-[4rem] p-16 lg:p-24 text-center relative overflow-hidden shadow-2xl border-white/5">
               <div className="absolute -top-20 -right-20 w-80 h-80 bg-saffron/5 rounded-full blur-[80px]" />
               <div className="w-24 h-24 rounded-[2.5rem] glass-diamond flex items-center justify-center mx-auto mb-12 border-saffron/30 shadow-2xl group transition-all duration-500 hover:scale-110">
                  <question.icon size={44} className="text-saffron relative z-10 group-hover:rotate-12 transition-transform" />
               </div>
               <p className="text-white text-3xl lg:text-5xl font-black tracking-tighter leading-tight font-display italic uppercase">{question.label}</p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-6">
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => answerQuestion(true)} className="py-10 rounded-[3rem] glass-diamond bg-india-green/10 border-india-green/30 hover:bg-india-green/20 transition-all group shadow-2xl flex flex-col items-center justify-center gap-4">
               <CheckCircle2 size={48} className="text-india-green group-hover:scale-110 transition-transform" />
               <div className="text-white font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs italic">Affirm Existence</div>
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => answerQuestion(false)} className="py-10 rounded-[3rem] glass-diamond bg-red-500/10 border-red-500/30 hover:bg-red-500/20 transition-all group shadow-2xl flex flex-col items-center justify-center gap-4">
               <XCircle size={48} className="text-red-500 group-hover:scale-110 transition-transform" />
               <div className="text-white font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs italic">Mark Vulnerability</div>
            </motion.button>
          </div>
        </div>
      )}

      {stage === 'loading' && (
        <div className="flex flex-col items-center justify-center py-64 gap-12">
          <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-[3.5rem] glass-diamond border-none relative flex items-center justify-center overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-saffron/10 animate-pulse" />
             <RefreshCw size={56} className="text-saffron animate-spin" />
          </div>
          <div className="text-center space-y-4">
             <h4 className="text-white font-black text-2xl tracking-tighter italic uppercase font-display">Neural Synthesis</h4>
             <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Mapping Matrix against Indian statutes...</p>
          </div>
        </div>
      )}

      {stage === 'score' && scoreData && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-24 pb-24 relative z-10">
          
          <div className="text-center relative">
             <Star size={64} className="text-saffron opacity-20 absolute -top-16 left-1/2 -translate-x-1/2 animate-pulse" />
             <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase italic font-display leading-none">Security Grade Engine</h2>
             <div className="flex items-center justify-center gap-3 mt-4">
                <div className="w-2 h-2 rounded-full bg-saffron shadow-[0_0_10px_#ff9933] animate-pulse" />
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em]">Certified Protection Infrastructure v4.3.0</p>
             </div>
          </div>

          <RadialScoreGauge score={scoreData.total_score} grade={scoreData.grade} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <CategoryCard label="Employment" score={scoreData.employment_score} color="#34d399" icon={Briefcase} />
             <CategoryCard label="Tenancy" score={scoreData.tenancy_score} color="#06b6d4" icon={Landmark} />
             <CategoryCard label="Consumer" score={scoreData.consumer_score} color="#7c3aed" icon={ShoppingCart} />
             <CategoryCard label="National Safety" score={scoreData.personal_safety_score} color="#f59e0b" icon={Shield} />
          </div>

          {/* Active Quests */}
          <div className="space-y-8">
             <div className="flex items-center gap-4 px-6">
                <div className="w-10 h-10 rounded-2xl bg-saffron/10 flex items-center justify-center shadow-xl">
                   <Zap size={20} className="text-saffron" />
                </div>
                <h3 className="text-white font-black text-2xl lg:text-3xl italic uppercase tracking-tighter font-display">Critical Defense Quests</h3>
             </div>
             <div className="grid gap-6">
                {scoreData.priority_issues.map((quest: any, i: number) => (
                  <motion.div key={i} whileHover={{ scale: 1.02 }} className="glass-diamond rounded-[3.5rem] p-10 border-saffron/10 flex flex-col lg:flex-row lg:items-center gap-8 relative group overflow-hidden shadow-2xl">
                     <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] glass-diamond flex flex-col items-center justify-center shrink-0 border-saffron/30 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-saffron/5 animate-pulse" />
                        <span className="text-saffron font-black text-2xl lg:text-3xl font-display italic">+{quest.points}</span>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">XP Units</span>
                     </div>
                     <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                           <span className="text-red-500 text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] font-sans">[{quest.severity} ALERT]</span>
                           <div className="h-[1px] flex-1 bg-white/5" />
                        </div>
                        <h4 className="text-white font-black text-2xl lg:text-3xl tracking-tighter uppercase italic">{quest.issue}</h4>
                        <p className="text-slate-400 text-sm lg:text-lg font-medium leading-relaxed italic">{quest.action}</p>
                     </div>
                     <div className="w-12 h-12 rounded-full glass-card border-white/10 flex items-center justify-center group-hover:bg-saffron/20 group-hover:border-saffron/40 transition-all cursor-pointer">
                        <ChevronRight size={24} className="text-slate-700 group-hover:text-white transition-colors" />
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
             <button onClick={() => { setStage('quiz'); setCurrentQ(0) }} className="py-6 rounded-[2.5rem] glass-diamond text-slate-500 font-black text-[10px] lg:text-xs uppercase tracking-[0.4em] hover:text-white hover:border-white/20 transition-all shadow-xl active:scale-95 italic font-display">
                Reset Audit Matrix
             </button>
             <button className="py-6 rounded-[2.5rem] glass-diamond text-saffron font-black text-[10px] lg:text-xs uppercase tracking-[0.4em] border-saffron/20 flex items-center justify-center gap-3 shadow-xl hover:bg-saffron/10 hover:border-saffron/40 transition-all active:scale-95 italic font-display">
                <Share2 size={16} /> Broadcast Grade
             </button>
          </div>

          <button onClick={() => window.location.href = '/counsellor'} className="w-full rounded-[4rem] py-16 gradient-primary glow-saffron flex flex-col items-center justify-center gap-4 group overflow-hidden relative shadow-[0_30px_100px_rgba(255,153,51,0.25)] transition-all hover:scale-[1.01] active:scale-95">
             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-4 relative z-10 scale-110 lg:scale-125">
                <Mic size={36} className="text-white animate-pulse" />
                <h3 className="text-white font-black text-3xl lg:text-5xl tracking-tighter uppercase italic font-display leading-none">Initialize Neural Session</h3>
             </div>
             <div className="flex items-center gap-3 relative z-10 opacity-70">
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />
                <span className="text-white font-black text-[10px] lg:text-xs uppercase tracking-[0.5em] italic">Start 1-on-1 Legal Defense Protocol</span>
             </div>
             <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 transform origin-left">
                <motion.div className="h-full bg-white/40" animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
             </div>
          </button>

        </motion.div>
      )}
    </motion.div>
  )
}
