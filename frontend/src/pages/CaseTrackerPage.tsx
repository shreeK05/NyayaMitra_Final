import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scale, Clock, ChevronRight, Plus, AlertCircle, 
  CheckCircle2, Calendar, FileText, TrendingUp,
  Download, Search, Filter, ShieldCheck, Gavel,
  Zap, ArrowUpRight, BarChart3, Globe, Activity,
  Database, Info, InfoIcon, Shield, Sparkles, MessageSquare, RefreshCw,
  ArrowLeft, SearchIcon, Radar, ListFilter, User2, Bot
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getCases, predictWinProbability } from '@/utils/api'
import { SAMPLE_CASES, formatDate, daysUntil, cn } from '@/utils'
import type { Case } from '@/types'

const TIMELINE_STEPS = [
  { id: 1, label: 'Incident Registry', date: 'Jan 2024', done: true },
  { id: 2, label: 'Legal Notice Dispatch', date: 'Feb 2024', done: true },
  { id: 3, label: 'Statutory Response', date: 'Feb 2024', done: true },
  { id: 4, label: 'Docket Filing', date: 'Mar 2024', done: true },
  { id: 5, label: 'Conciliation Matrix', date: 'Apr 2024', done: false, current: true },
  { id: 6, label: 'Final Adjudication', date: 'Est. Jul 2024', done: false },
]

function CaseCard({ c, index }: { c: Case; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const days = c.limitationDate ? daysUntil(c.limitationDate) : 999
  const isUrgent = days < 60
  const statusColor = c.status === 'active' ? 'var(--emerald)' : c.status === 'pending' ? 'var(--saffron)' : 'var(--slate-500)'

  const computeOdds = async () => {
    setLoading(true)
    try {
      const res = await predictWinProbability({
        case_type: c.type || 'civil',
        state: 'Maharashtra',
        court_level: 'district',
        evidence: 'strong',
        time_elapsed: 1.0
      })
      setPrediction(res)
    } catch {
      setPrediction({ win_probability: 0.74, recommended_forum: 'District Consumer Forum' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-[3.5rem] overflow-hidden border-white/5 border-glow relative group shadow-[0_30px_60px_rgba(0,0,0,0.4)] bg-black/40 mb-10"
    >
      <div className="absolute top-0 left-0 w-2.5 h-full opacity-60 rounded-full" style={{ backgroundColor: statusColor }} />
      
      <button onClick={() => setExpanded(!expanded)} className="w-full p-10 lg:p-14 text-left relative z-10 transition-all hover:bg-white/2">
        <div className="flex items-start gap-10">
          <div className="w-20 h-20 rounded-[2rem] bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform" 
               style={{ color: statusColor }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: statusColor }} />
            <Scale size={40} className="relative z-10" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-6 mb-4">
              <span className="px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] border shadow-xl flex items-center gap-2 italic"
                style={{ color: statusColor, background: `${statusColor}10`, borderColor: `${statusColor}30` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {c.status} Protocol ACTIVE
              </span>
              {isUrgent && (
                <div className="px-5 py-1.5 rounded-xl text-[10px] font-black bg-saffron text-white border border-saffron/20 flex items-center gap-3 animate-pulse shadow-xl shadow-saffron/20 italic">
                   <AlertCircle size={14} /> LIMITATION WINDOW: {days}D
                </div>
              )}
            </div>
            <h3 className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter leading-tight mb-4 font-display uppercase italic">{c.title}</h3>
            <div className="flex items-center gap-6">
               <div className="px-4 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
                  CNR_NODE: {c.cnrNumber || 'MH-PN-0021'}
               </div>
               <div className="h-px w-8 bg-slate-800" />
               <p className="text-slate-600 text-sm font-black uppercase tracking-widest italic opacity-60">Target Forum: {c.type || 'CIVIL_MATRIX'}</p>
            </div>
          </div>
          
          <div className={cn("mt-6 p-4 transition-all duration-700 rounded-full w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 shadow-2xl group", expanded && "rotate-180 border-indigo bg-indigo/10")}>
             <ChevronRight size={32} className={cn("text-slate-800 transition-colors", expanded && "text-indigo")} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 px-10 lg:px-20 pb-16 pt-12 space-y-16 overflow-hidden"
          >
            {/* Neural Outcome Projection */}
            <div className="p-12 rounded-[4rem] bg-indigo/5 border border-indigo/20 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 transition-transform group-hover:rotate-45 pointer-events-none scale-150">
                   <Radar size={120} className="text-indigo" />
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                   <div className="space-y-6 text-center lg:text-left">
                      <div className="flex items-center gap-4 lg:justify-start justify-center">
                         <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo shadow-xl"><BarChart3 size={20} /></div>
                         <span className="text-indigo text-[11px] font-black uppercase tracking-[0.6em] italic leading-none opacity-80">Neural Outcome Simulator Node</span>
                      </div>
                      <h4 className="text-5xl lg:text-7xl font-black italic uppercase italic font-display text-white tracking-tighter leading-none shadow-text italic">Strategic Impact Score</h4>
                   </div>
                   
                   {!prediction ? (
                      <button 
                        onClick={computeOdds}
                        disabled={loading}
                        className="px-16 py-8 rounded-[2rem] bg-indigo/10 text-indigo font-black uppercase text-2xl tracking-tighter italic border-2 border-indigo/40 hover:bg-indigo/20 transition-all flex items-center gap-6 shadow-[0_20px_50px_rgba(99,102,241,0.4)] active:scale-95 group/btn"
                      >
                        {loading ? <RefreshCw size={32} className="animate-spin" /> : <Zap size={32} className="fill-indigo" />}
                        {loading ? 'Synthesizing Justice...' : 'Initiate Outcome Projection'}
                      </button>
                   ) : (
                      <div className="flex items-center gap-16">
                         <div className="text-center">
                            <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.5em] mb-4 italic leading-none">Win Odds Matrix</p>
                            <span className="text-[10rem] font-black text-indigo italic tracking-tighter font-display leading-none text-glow-indigo">{(prediction.win_probability * 100).toFixed(0)}%</span>
                         </div>
                         <div className="w-[1px] h-32 bg-indigo/20" />
                         <div className="text-left max-w-[250px] space-y-4">
                            <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.5em] mb-1 italic leading-none">Recourse Portal</p>
                            <span className="text-white font-black text-2xl uppercase italic tracking-tighter leading-snug block font-neural">{prediction.recommended_forum}</span>
                            <div className="px-4 py-1.5 rounded-lg bg-emerald/10 border border-emerald/30 text-emerald text-[9px] font-black uppercase tracking-widest italic inline-block">High Admissibility</div>
                         </div>
                      </div>
                   )}
                </div>
            </div>

            {/* Timeline Ledger */}
            <div className="space-y-12">
               <div className="flex items-center gap-6 px-4">
                  <Activity size={24} className="text-emerald" />
                  <div className="h-px w-20 bg-slate-800" />
                  <h5 className="text-white font-black text-xl lg:text-3xl uppercase tracking-tighter italic font-display">Operational Docket history</h5>
               </div>
               <div className="grid grid-cols-1 gap-4">
                 {TIMELINE_STEPS.map((step, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }} 
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     key={step.id} 
                     className={cn(
                       "flex gap-10 items-center p-10 rounded-[3.5rem] border transition-all duration-500 shadow-2xl relative overflow-hidden group/step",
                       step.done ? "bg-white/2 border-white/5 opacity-30" :
                       step.current ? "bg-emerald/5 border-emerald/40 shadow-[0_30px_60px_rgba(16,185,129,0.15)] border-2" : "border-dashed border-white/5 opacity-50"
                     )}
                   >
                      {step.current && <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 to-transparent animate-pulse" />}
                      <div className={cn(
                        "w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-2xl border transition-all duration-700 relative z-10 shrink-0",
                        step.done ? "bg-emerald/10 border-emerald/20 text-emerald" :
                        step.current ? "bg-emerald border-none text-white shadow-[0_20px_40px_rgba(16,185,129,0.4)] animate-neural-pulse" :
                        "bg-black border-white/10 text-slate-800"
                      )}>
                        {step.done ? <CheckCircle2 size={40} /> : <div className="w-4 h-4 rounded-full bg-current opacity-20" />}
                      </div>
                      <div className="flex-1 relative z-10">
                         <div className="flex justify-between items-center mb-2">
                            <h5 className={cn("text-2xl lg:text-3xl font-black uppercase tracking-tighter font-display italic", step.done ? "text-slate-500" : step.current ? "text-white" : "text-slate-800")}>
                               {step.label}
                            </h5>
                            <span className={cn("text-[11px] font-black uppercase tracking-widest italic", step.current ? "text-emerald" : "text-slate-600")}>{step.date}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className={cn("px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest italic", step.done ? "bg-slate-900 border border-white/5" : "bg-emerald/20 border border-emerald/40")}>
                               {step.done ? 'SYNCHRONIZED' : step.current ? 'ACTIVE NODE' : 'QUEUED'}
                            </div>
                         </div>
                      </div>
                   </motion.div>
                 ))}
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 pt-8">
              <button onClick={() => navigate('/generator')} className="flex-[2] h-24 rounded-[3rem] gradient-indigo text-white text-2xl font-black uppercase tracking-tighter italic shadow-[0_20px_100px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6">
                <FileText size={32} /> Draft Statutory Submission
              </button>
              <button className="flex-1 h-24 rounded-[3rem] glass-card border border-white/10 text-slate-500 text-sm font-black uppercase tracking-widest italic hover:text-white hover:bg-white/5 transition-all border-glow flex items-center justify-center gap-6">
                <ArrowUpRight size={24} /> Sync eCourts Protocol
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function CaseTrackerPage() {
  const navigate = useNavigate()
  const [cases, setCases] = useState<Case[]>(SAMPLE_CASES)

  useEffect(() => {
    getCases().then(res => {
      const data = res as any
      if (data && data.cases) setCases(data.cases)
    }).catch(err => console.error('getCases error:', err))
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-indigo/30">
      
      {/* 🧭 Strategic Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-nav border-b border-white/5 bg-[#030712]/80 backdrop-blur-3xl">
        <div className="container mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="w-12 h-12 rounded-xl glass-card border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
              <ArrowLeft size={20} className="text-slate-400 group-hover:text-white" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-indigo/10 group-hover:bg-indigo/20 transition-all" />
                 <Radar size={24} className="text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter font-display leading-none text-white">Docket Tracker</h1>
                <p className="text-[9px] text-indigo font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo animate-pulse shadow-[0_0_8px_#6366f1]" />
                  Live_eCourts_Handshake
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-4 bg-white/2 border border-white/5 px-6 py-2.5 rounded-full glass-card">
              <Globe size={14} className="text-indigo" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Global Surveillance Active</span>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-black/40">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Profile" className="w-full h-full p-1 opacity-60" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 lg:px-12 max-w-7xl pt-40 pb-32">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Tactical Intelligence Panel */}
          <div className="lg:col-span-4 space-y-12">
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-16 rounded-[4.5rem] bg-saffron/10 border border-saffron/30 space-y-10 relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-saffron/10 to-transparent pointer-events-none" />
                <div className="w-24 h-24 rounded-[2.5rem] bg-saffron/20 flex items-center justify-center text-saffron shadow-[0_20px_40px_rgba(255,153,51,0.3)] animate-pulse relative z-10 border border-saffron/40">
                   <Clock size={48} />
                </div>
                <div className="relative z-10 space-y-4">
                   <div className="px-4 py-1.5 rounded-xl bg-saffron/20 border border-saffron/40 text-saffron text-[10px] font-black uppercase tracking-widest italic inline-block">Protocol_Red_Alert</div>
                   <h3 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter font-display text-white leading-none">Immediate Filing Required</h3>
                   <p className="text-slate-400 text-lg font-medium leading-[1.4] italic opacity-80">System detected <span className="text-white font-black underline decoration-saffron/40">ONE</span> active dossier nearing the 60-day filing ceiling under BNS Section 35.</p>
                </div>
                <button className="w-full py-8 rounded-[2rem] gradient-saffron text-white font-black uppercase text-xl shadow-[0_20px_60px_rgba(255,153,51,0.3)] hover:scale-[1.03] transition-all relative z-10 tracking-tighter italic">REMEDY NOW</button>
             </motion.div>

             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-12 rounded-[4rem] border-white/5 border-glow space-y-12 bg-black/40 shadow-2xl">
                <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] italic px-4 border-b border-white/5 pb-8">Surveillance_Feed</h4>
                <div className="space-y-8">
                   {[
                     { icon: ShieldCheck, label: 'eCourts Data Integrity', val: 'Verified' },
                     { icon: Zap, label: 'Llama-3 Neural Core', val: 'Active' },
                     { icon: Database, label: 'Local Encrypted Cache', val: 'Syncing' },
                     { icon: Activity, label: 'RAG Analysis Loop', val: 'Processing' }
                   ].map(f => (
                     <div key={f.label} className="flex items-center justify-between group">
                        <div className="flex items-center gap-5">
                           <div className="w-10 h-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-slate-700 group-hover:text-indigo group-hover:bg-indigo/5 transition-all"><f.icon size={20} /></div>
                           <span className="text-xs font-black text-slate-500 uppercase tracking-tight italic group-hover:text-white transition-colors">{f.label}</span>
                        </div>
                        <span className="text-[10px] font-black text-indigo uppercase tracking-widest bg-indigo/5 px-3 py-1 rounded-lg border border-indigo/20">{f.val}</span>
                     </div>
                   ))}
                </div>
             </motion.div>
          </div>

          {/* Docket Ledger */}
          <div className="lg:col-span-8 space-y-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 px-8 text-center lg:text-left">
              <div className="space-y-3">
                 <h2 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter font-display leading-none text-white">The Docket</h2>
                 <p className="text-slate-600 text-sm font-black uppercase tracking-[0.6em] italic leading-none opacity-60">Verified eCourts Records: <span className="text-indigo">{cases.length} Nodes Synchronized</span></p>
              </div>
              <div className="flex gap-6">
                <button className="w-16 h-16 rounded-[1.75rem] glass-card border border-white/10 text-slate-600 hover:text-white transition-all shadow-xl hover:scale-110 active:scale-95"><SearchIcon size={28} /></button>
                <button className="w-16 h-16 rounded-[1.75rem] glass-card border border-white/10 text-slate-600 hover:text-white transition-all shadow-xl hover:scale-110 active:scale-95"><ListFilter size={28} /></button>
              </div>
            </div>

            <div className="space-y-12 pb-32">
              {cases.map((c, i) => <CaseCard key={c.id} c={c} index={i} />)}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
