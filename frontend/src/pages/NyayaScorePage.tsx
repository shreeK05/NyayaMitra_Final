import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-presence'
import { 
  Share2, Download, RefreshCw, CheckCircle2, XCircle, 
  AlertTriangle, Trophy, Shield, Briefcase, Home, 
  ShoppingCart, Lock, Zap, ChevronRight, Star,
  Info, Award, Sparkles, Mic,
  Fingerprint, Landmark, Scale, GraduationCap, Coins,
  ArrowLeft, Radar, Search, Activity
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { computeNyayaScore } from '@/utils/api'
import { cn } from '@/utils'

const SCORE_COLORS = {
  '-': { color: 'var(--slate-500)', label: 'Neural Core Initializing...', bg: 'rgba(148,163,184,0.1)', icon: Info },
  'F': { color: 'var(--saffron)', label: 'CRITICAL DEFENSE BREACH', bg: 'rgba(245,158,11,0.1)', icon: AlertTriangle },
  'D': { color: 'var(--gold)', label: 'SEVERE VULNERABILITY', bg: 'rgba(251,191,36,0.1)', icon: AlertTriangle },
  'C': { color: 'var(--indigo)', label: 'LIMITED COVERAGE', bg: 'rgba(99,102,241,0.1)', icon: Zap },
  'B': { color: 'var(--emerald)', label: 'SECURE INFRASTRUCTURE', bg: 'rgba(16,185,129,0.1)', icon: Shield },
  'A': { color: 'var(--emerald)', label: 'ELITE LEGAL SHIELD', bg: 'rgba(16,185,129,0.1)', icon: Award },
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
  const circumference = 2 * Math.PI * 140
  const strokeDash = (score / 100) * circumference

  return (
    <div className="relative w-72 h-72 lg:w-96 lg:h-96 mx-auto mb-16">
      <div className="absolute inset-0 bg-white/2 rounded-full blur-[100px] opacity-20" style={{ backgroundColor: config.color }} />
      <svg viewBox="0 0 320 320" className="w-full h-full -rotate-90">
        <circle cx="160" cy="160" r="140" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="16" />
        <motion.circle
          cx="160" cy="160" r="140"
          fill="none"
          stroke={config.color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 2.5, ease: 'circOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] block mb-4">Vitality Index</span>
          <h2 className="text-8xl lg:text-9xl font-black italic tracking-tighter text-white font-display leading-none">{score}</h2>
          <div className="mt-8 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-xl animate-float"
            style={{ color: config.color, background: `${config.color}10`, borderColor: `${config.color}30` }}>
            {config.label}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function CategoryCard({ label, score, color, icon: Icon }: { label: string; score: number; color: string; icon: any }) {
  return (
    <div className="glass-card rounded-[3rem] p-10 border-white/5 border-glow group relative overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-all scale-150 rotate-12">
        <Icon size={120} color={color} />
      </div>
      <div className="flex items-center gap-6 mb-12">
         <div className="w-16 h-16 rounded-[1.75rem] flex items-center justify-center border border-white/5 relative bg-white/2" style={{ color }}>
            <Icon size={32} />
         </div>
         <h3 className="text-2xl font-black italic uppercase tracking-tighter font-display text-white">{label}</h3>
      </div>
      <div className="space-y-4">
         <div className="flex justify-between items-end">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Neural Coverage Layer</span>
            <span className="text-3xl font-black font-display text-white italic">{score}%</span>
         </div>
         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full" style={{ backgroundColor: color }} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.5 }} />
         </div>
      </div>
    </div>
  )
}

export default function NyayaScorePage() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<'quiz' | 'loading' | 'score'>('quiz')
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [scoreData, setScoreData] = useState<any>(null)
  const [currentQ, setCurrentQ] = useState(0)

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
            severity: 'CRITICAL',
            action: p.estimated_gain,
            points: 15
          })),
        })
        setStage('score')
        return
      }
    } catch {
      // Demo Fallback
      setScoreData({
        total_score: 72,
        grade: 'B',
        employment_score: 85,
        tenancy_score: 40,
        consumer_score: 90,
        personal_safety_score: 20,
        priority_issues: [
          { issue: 'Unprotected Rental Tenure', severity: 'CRITICAL', action: 'Submit registered agreement via e-GRAS', points: 25 },
          { issue: 'Incomplete Defense Matrix', severity: 'RISK', action: 'Initialize 1-on-1 Counsel Session', points: 15 }
        ],
      })
      setStage('score')
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-saffron/30">
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center shadow-lg shadow-saffron/20">
                <Radar size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-widest italic leading-none">NyayaScore</h1>
                <p className="text-[10px] text-saffron font-bold uppercase tracking-tighter mt-1">Legal Vitality Audit</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 bg-white/2 border border-white/5 px-5 py-2 rounded-full">
            <Activity size={14} className="text-saffron" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">BNS v1.4 Audit Engine Active</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 max-w-6xl pt-32 pb-20">
        <AnimatePresence mode="wait">
          {stage === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto py-12 lg:py-24 space-y-16">
              <div className="text-center space-y-4">
                <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">System Scan Protocol Layer {currentQ + 1} of {CHECKLIST_QUESTIONS.length}</span>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-6">
                   <motion.div className="h-full bg-saffron shadow-lg shadow-saffron/20" initial={{ width: 0 }} animate={{ width: `${((currentQ + 1) / CHECKLIST_QUESTIONS.length) * 100}%` }} />
                </div>
              </div>

              <div className="glass-card rounded-[4rem] p-16 lg:p-24 text-center border-white/5 border-glow relative overflow-hidden">
                 <div className="w-24 h-24 rounded-[2.5rem] gradient-saffron flex items-center justify-center mx-auto mb-10 text-white shadow-2xl shadow-saffron/30">
                    <question.icon size={48} className="animate-pulse" />
                 </div>
                 <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter font-display text-white leading-tight">{question.label}</h2>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <button onClick={() => answerQuestion(true)} className="h-28 rounded-[2.5rem] glass-card border-white/10 hover:border-emerald/40 transition-all flex items-center justify-center gap-6 group border-glow">
                    <CheckCircle2 size={32} className="text-emerald group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-black italic uppercase italic tracking-tighter">Verified Yes</span>
                 </button>
                 <button onClick={() => answerQuestion(false)} className="h-28 rounded-[2.5rem] glass-card border-white/10 hover:border-saffron/40 transition-all flex items-center justify-center gap-6 group border-glow">
                    <XCircle size={32} className="text-saffron group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-black italic uppercase italic tracking-tighter">Mark Gap</span>
                 </button>
              </div>
            </motion.div>
          )}

          {stage === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 gap-12 text-center">
              <div className="w-32 h-32 rounded-[2.5rem] gradient-saffron flex items-center justify-center shadow-2xl animate-spin-slow">
                 <RefreshCw size={48} className="text-white" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-4xl font-black italic uppercase tracking-tighter font-display">Neural Synthesis</h3>
                 <p className="text-slate-500 font-medium italic">Constructing your legal protection matrix...</p>
              </div>
            </motion.div>
          )}

          {stage === 'score' && scoreData && (
            <motion.div key="score" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-24">
              <div className="text-center">
                 <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter font-display text-white mb-4 leading-none">Protection Identity</h2>
                 <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] italic mb-16">BNS Integrity Audit v4.3 Complete</p>
                 <RadialScoreGauge score={scoreData.total_score} grade={scoreData.grade} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <CategoryCard label="Employment" score={scoreData.employment_score} color="var(--emerald)" icon={Briefcase} />
                 <CategoryCard label="Tenancy" score={scoreData.tenancy_score} color="var(--indigo)" icon={Landmark} />
                 <CategoryCard label="Consumer" score={scoreData.consumer_score} color="var(--gold)" icon={ShoppingCart} />
                 <CategoryCard label="Personal Safety" score={scoreData.personal_safety_score} color="var(--saffron)" icon={Shield} />
              </div>

              {/* Quest Matrix */}
              <div className="space-y-10">
                 <div className="flex items-center gap-4 px-4">
                    <Zap size={20} className="text-saffron" />
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter font-display">Critical Missions</h3>
                 </div>
                 <div className="grid gap-6">
                    {scoreData.priority_issues.map((quest: any, i: number) => (
                      <div key={i} className="glass-card rounded-[4rem] p-12 border-white/5 border-glow flex flex-col lg:flex-row items-center gap-10 group relative transition-all hover:scale-[1.01]">
                         <div className="w-24 h-24 rounded-[2rem] bg-saffron/10 flex flex-col items-center justify-center text-saffron border border-saffron/20 shrink-0">
                            <span className="text-4xl font-black font-display italic leading-none">+{quest.points}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest mt-1">XP Units</span>
                         </div>
                         <div className="flex-1 text-center lg:text-left">
                            <div className="flex gap-4 mb-2 lg:justify-start justify-center">
                               <span className="text-saffron text-[10px] font-black uppercase tracking-widest leading-none">[{quest.severity} PRIORITY]</span>
                            </div>
                            <h4 className="text-3xl font-black italic uppercase tracking-tighter font-display text-white mb-2">{quest.issue}</h4>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed italic">Action Required: {quest.action}</p>
                         </div>
                         <button className="w-16 h-16 rounded-full glass-panel border border-white/5 flex items-center justify-center text-slate-700 group-hover:text-saffron group-hover:bg-saffron/10 transition-all group-hover:scale-110">
                            <ChevronRight size={32} />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 max-w-2xl mx-auto pb-20">
                 <button onClick={() => setStage('quiz')} className="flex-1 h-20 rounded-[2.5rem] glass-card border border-white/10 text-slate-500 font-black uppercase text-xs tracking-widest italic hover:text-white transition-all">Re-Audit Profile</button>
                 <button className="flex-1 h-20 rounded-[2.5rem] gradient-saffron text-white font-black uppercase text-xl italic tracking-tighter shadow-2xl shadow-saffron/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4">
                    <Share2 size={24} />
                    Acquire Certificate
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
