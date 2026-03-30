import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  'F': { color: 'var(--saffron)', label: 'CRITICAL DEFENSE BREACH', bg: 'rgba(255,153,51,0.15)', icon: AlertTriangle },
  'D': { color: 'var(--gold)', label: 'SEVERE VULNERABILITY', bg: 'rgba(251,191,36,0.15)', icon: AlertTriangle },
  'C': { color: 'var(--indigo)', label: 'LIMITED COVERAGE', bg: 'rgba(99,102,241,0.15)', icon: Zap },
  'B': { color: 'var(--emerald)', label: 'SECURE INFRASTRUCTURE', bg: 'rgba(16,185,129,0.15)', icon: Shield },
  'A': { color: 'var(--emerald)', label: 'ELITE LEGAL SHIELD', bg: 'rgba(16,185,129,0.15)', icon: Award },
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
  const circumference = 2 * Math.PI * 155
  const strokeDash = (score / 100) * circumference

  return (
    <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px] mx-auto mb-20 group">
      <div className="absolute inset-0 bg-white/2 rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: config.color }} />
      <svg viewBox="0 0 360 360" className="w-full h-full -rotate-90 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <circle cx="180" cy="180" r="155" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="20" />
        <motion.circle
          cx="180" cy="180" r="155"
          fill="none"
          stroke={config.color}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 3, ease: 'circOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
          <span className="text-slate-600 text-[11px] font-black uppercase tracking-[0.5em] block mb-6 italic opacity-70">Defense_Index</span>
          <h2 className="text-9xl lg:text-[11rem] font-black italic tracking-tighter text-white font-display leading-none text-glow-saffron">{score}</h2>
          <div className="mt-10 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border shadow-2xl animate-float italic"
            style={{ color: config.color, background: `${config.color}15`, borderColor: `${config.color}40` }}>
            {config.label}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function CategoryCard({ label, score, color, icon: Icon }: { label: string; score: number; color: string; icon: any }) {
  return (
    <div className="glass-card rounded-[3.5rem] p-12 border-white/5 border-glow group relative overflow-hidden h-full flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
      <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all scale-150 rotate-12 group-hover:rotate-45">
        <Icon size={140} color={color} />
      </div>
      <div className="flex items-center gap-8 mb-16 relative z-10">
         <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-[2rem] flex items-center justify-center border border-white/10 relative bg-black/40 shadow-2xl transition-transform group-hover:scale-110" style={{ color }}>
            <Icon size={36} />
         </div>
         <h3 className="text-3xl font-black italic uppercase tracking-tighter font-display text-white leading-none">{label}</h3>
      </div>
      <div className="space-y-6 relative z-10">
         <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic opacity-60">Neural Matrix Coverage</span>
            <span className="text-4xl font-black font-display text-white italic tracking-tighter">{score}%</span>
         </div>
         <div className="h-2 bg-white/5 rounded-full overflow-hidden shadow-inner font-neural">
            <motion.div className="h-full shadow-[0_0_15px_rgba(255,153,51,0.2)]" style={{ backgroundColor: color }} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 2, delay: 0.5 }} />
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
        setTimeout(() => setStage('score'), 2000)
        return
      }
    } catch {
      // Demo Fallback
      setTimeout(() => {
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
      }, 2500)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-saffron/30">
      
      {/* 🧭 Strategic Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-nav border-b border-white/5 bg-[#030712]/80 backdrop-blur-3xl">
        <div className="container mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="w-12 h-12 rounded-xl glass-card border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
              <ArrowLeft size={20} className="text-slate-400 group-hover:text-white" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-saffron/10 group-hover:bg-saffron/20 transition-all" />
                 <Radar size={24} className="text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter font-display leading-none text-white">NyayaScore</h1>
                <p className="text-[9px] text-saffron font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-saffron animate-pulse shadow-[0_0_8px_#ff9933]" />
                  Vitality_Audit_Active
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-4 bg-white/2 border border-white/5 px-6 py-2.5 rounded-full glass-card">
              <Activity size={14} className="text-saffron" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Audit Engine v4.3</span>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-black/40">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Profile" className="w-full h-full p-1 opacity-60" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 lg:px-12 max-w-7xl pt-40 pb-32">
        <AnimatePresence mode="wait">
          {stage === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto py-12 lg:py-16 space-y-20">
              <div className="text-center space-y-6">
                <span className="text-slate-600 text-[11px] font-black uppercase tracking-[0.6em] italic opacity-60">System Security Audit Layer {currentQ + 1} of {CHECKLIST_QUESTIONS.length}</span>
                <div className="h-2 w-full bg-black border border-white/5 rounded-full overflow-hidden mt-8 shadow-inner">
                   <motion.div className="h-full gradient-saffron shadow-lg shadow-saffron/20" initial={{ width: 0 }} animate={{ width: `${((currentQ + 1) / CHECKLIST_QUESTIONS.length) * 100}%` }} transition={{ type: 'spring', stiffness: 50 }} />
                </div>
              </div>

              <div className="glass-card rounded-[5rem] p-16 lg:p-32 text-center border-white/10 border-glow relative overflow-hidden bg-black/40 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                 <div className="absolute inset-0 bg-gradient-to-br from-saffron/5 to-transparent pointer-events-none" />
                 <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-[4rem] gradient-saffron flex items-center justify-center mx-auto mb-16 text-white shadow-[0_30px_60px_rgba(255,153,51,0.3)] relative group animate-neural-pulse">
                    <question.icon size={64} className="lg:scale-125 transition-transform" />
                 </div>
                 <h2 className="text-5xl lg:text-8xl font-black italic uppercase tracking-tighter font-display text-white leading-tight mb-4">{question.label}</h2>
                 <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px] italic">Domain Analysis: {question.domain}</p>
              </div>

              <div className="grid grid-cols-2 gap-10">
                 <button onClick={() => answerQuestion(true)} className="h-32 rounded-[3rem] glass-card border-white/10 hover:border-emerald/40 hover:bg-emerald/5 transition-all flex items-center justify-center gap-8 group border-glow shadow-2xl">
                    <CheckCircle2 size={40} className="text-emerald group-hover:scale-110 transition-transform" />
                    <span className="text-3xl font-black italic uppercase tracking-tighter text-white">Verified</span>
                 </button>
                 <button onClick={() => answerQuestion(false)} className="h-32 rounded-[3rem] glass-card border-white/10 hover:border-saffron/40 hover:bg-saffron/5 transition-all flex items-center justify-center gap-8 group border-glow shadow-2xl">
                    <XCircle size={40} className="text-saffron group-hover:scale-110 transition-transform" />
                    <span className="text-3xl font-black italic uppercase tracking-tighter text-white">Mark Gap</span>
                 </button>
              </div>
            </motion.div>
          )}

          {stage === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-48 gap-16 text-center">
              <div className="relative w-48 h-48 group">
                <div className="absolute inset-0 rounded-[2.5rem] border-[10px] border-white/5 animate-pulse" />
                <div className="w-full h-full rounded-[2.5rem] gradient-saffron flex items-center justify-center shadow-[0_0_50px_rgba(255,153,51,0.4)] animate-[spin_4s_linear_infinite] border-glow">
                   <RefreshCw size={56} className="text-white" />
                </div>
              </div>
              <div className="space-y-6 max-w-2xl">
                 <h3 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter font-display text-white text-glow-saffron">Neural Synthesis</h3>
                 <p className="text-slate-600 text-xl font-medium italic tracking-widest opacity-70">Constructing legal protection lattice from distributed BNS nodes...</p>
              </div>
            </motion.div>
          )}

          {stage === 'score' && scoreData && (
            <motion.div key="score" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="space-y-40">
              <div className="text-center relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-saffron/5 blur-[200px] rounded-full pointer-events-none" />
                 <div className="relative z-10 space-y-6">
                    <h2 className="text-6xl lg:text-[7rem] font-black italic uppercase tracking-tighter font-display text-white leading-none shadow-text">Protection Identity</h2>
                    <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.8em] italic opacity-60">BNS_Integrity_Audit_v4.3_Complete</p>
                 </div>
                 <RadialScoreGauge score={scoreData.total_score} grade={scoreData.grade} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <CategoryCard label="Employment" score={scoreData.employment_score} color="var(--emerald)" icon={Briefcase} />
                 <CategoryCard label="Tenancy" score={scoreData.tenancy_score} color="var(--indigo)" icon={Landmark} />
                 <CategoryCard label="Consumer" score={scoreData.consumer_score} color="var(--gold)" icon={ShoppingCart} />
                 <CategoryCard label="Personal Safety" score={scoreData.personal_safety_score} color="var(--saffron)" icon={Shield} />
              </div>

              {/* Quest Matrix */}
              <div className="space-y-16">
                 <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <Zap size={40} className="text-saffron shadow-[0_0_20px_#ff9933] animate-pulse mb-4" />
                    <h3 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter font-display text-white">Critical Missions</h3>
                    <p className="text-slate-600 text-sm font-black uppercase tracking-[0.5em] italic">Immediate Recourse Optimization</p>
                 </div>
                 <div className="grid gap-8">
                    {scoreData.priority_issues.map((quest: any, i: number) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="glass-card rounded-[4rem] p-12 lg:p-16 border-white/5 border-glow flex flex-col lg:flex-row items-center gap-12 group relative transition-all hover:scale-[1.02] bg-black/40 shadow-2xl"
                      >
                         <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[3rem] bg-black border border-saffron/20 flex flex-col items-center justify-center text-saffron shrink-0 shadow-2xl relative overflow-hidden group-hover:border-saffron/40 transition-colors">
                            <div className="absolute inset-0 bg-saffron/5 group-hover:bg-saffron/10 transition-all" />
                            <span className="text-5xl lg:text-7xl font-black font-display italic leading-none tracking-tighter relative z-10">+{quest.points}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 relative z-10 opacity-70">Defense_XP</span>
                         </div>
                         <div className="flex-1 text-center lg:text-left space-y-6">
                            <div className="flex gap-4 mb-4 lg:justify-start justify-center">
                               <span className="text-saffron bg-saffron/10 border border-saffron/30 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest leading-none italic shadow-lg">[{quest.severity} PROTOCOL]</span>
                            </div>
                            <h4 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter font-display text-white leading-tight font-neural">{quest.issue}</h4>
                            <p className="text-slate-500 text-xl lg:text-2xl font-medium leading-relaxed italic opacity-80">Recommended Tactic: {quest.action}</p>
                         </div>
                         <button className="w-20 h-20 rounded-full glass-panel border border-white/10 flex items-center justify-center text-slate-800 group-hover:text-saffron group-hover:bg-saffron/10 transition-all group-hover:scale-110 shadow-2xl">
                            <ChevronRight size={48} />
                         </button>
                      </motion.div>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 max-w-3xl mx-auto pb-40">
                 <button onClick={() => setStage('quiz')} className="flex-1 h-24 rounded-[3rem] glass-card border border-white/10 text-slate-500 font-black uppercase text-xs tracking-widest italic hover:text-white hover:bg-white/5 transition-all shadow-xl">Re-Audit Neural Node</button>
                 <button className="flex-1 h-24 rounded-[3rem] gradient-saffron text-white font-black uppercase text-3xl italic tracking-tighter shadow-[0_20px_60px_rgba(255,153,51,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-6">
                    <Share2 size={32} />
                    Download Certification
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
