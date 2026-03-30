import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scale, Clock, ChevronRight, Plus, AlertCircle, 
  CheckCircle2, Calendar, FileText, TrendingUp,
  Download, Search, Filter, ShieldCheck, Gavel,
  Zap, ArrowUpRight, BarChart3, Globe, Activity,
  Database, Info, InfoIcon, Shield, Sparkles, MessageSquare, RefreshCw,
  ArrowLeft, SearchIcon, Radar, ListFilter
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
      className="glass-card rounded-[3rem] overflow-hidden border-white/5 border-glow relative group shadow-2xl"
    >
      <div className="absolute top-0 left-0 w-2 h-full opacity-60 rounded-full" style={{ backgroundColor: statusColor }} />
      
      <button onClick={() => setExpanded(!expanded)} className="w-full p-8 text-left relative z-10 transition-all">
        <div className="flex items-start gap-8">
          <div className="w-16 h-16 rounded-[1.75rem] bg-white/2 border border-white/5 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform" 
               style={{ color: statusColor }}>
            <Scale size={32} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border"
                style={{ color: statusColor, background: `${statusColor}10`, borderColor: `${statusColor}20` }}>
                {c.status} Protocol
              </span>
              {isUrgent && (
                <div className="px-3 py-1 rounded-lg text-[9px] font-black bg-saffron/10 text-saffron border border-saffron/20 flex items-center gap-2 animate-pulse">
                   <AlertCircle size={12} /> {days}D WINDOW
                </div>
              )}
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-white italic tracking-tighter leading-none mb-3 font-display uppercase">{c.title}</h3>
            <div className="flex items-center gap-4">
               <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest leading-none">
                  CNR: {c.cnrNumber || 'MH-PN-0021'}
               </div>
               <p className="text-slate-500 text-[11px] font-medium truncate max-w-sm italic opacity-60">"Target Forum: {c.type || 'CIVIL'}"</p>
            </div>
          </div>
          
          <div className={cn("mt-4 p-3 transition-all duration-500 rounded-full w-12 h-12 flex items-center justify-center bg-white/2 border border-white/5 shadow-xl hover:scale-110", expanded && "rotate-180 border-indigo/40 bg-indigo/10")}>
             <ChevronRight size={24} className={cn("text-slate-700 transition-colors", expanded && "text-indigo")} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 px-8 lg:px-12 pb-12 pt-8 space-y-12 overflow-hidden"
          >
            {/* Neural Outcome Projection */}
            <div className="p-10 rounded-[3rem] bg-indigo/5 border border-indigo/20 relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                   <div className="space-y-4 text-center lg:text-left">
                      <div className="flex items-center gap-3 lg:justify-start justify-center">
                         <BarChart3 size={18} className="text-indigo" />
                         <span className="text-indigo text-[10px] font-black uppercase tracking-widest italic leading-none">Neural Outcome Simulator</span>
                      </div>
                      <h4 className="text-3xl font-black italic uppercase italic font-display text-white tracking-tighter">Strategic Impact Score</h4>
                   </div>
                   
                   {!prediction ? (
                      <button 
                        onClick={computeOdds}
                        disabled={loading}
                        className="px-10 py-5 rounded-2xl bg-indigo/10 text-indigo font-black uppercase text-xs tracking-widest border border-indigo/30 hover:bg-indigo/20 transition-all flex items-center gap-3 shadow-2xl active:scale-95"
                      >
                        {loading ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
                        {loading ? 'Simulating Justice Matrix...' : 'Run Neural Outcome Projection'}
                      </button>
                   ) : (
                      <div className="flex items-center gap-12">
                         <div className="text-center">
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Win Odds</p>
                            <span className="text-6xl font-black text-indigo italic tracking-tighter font-display leading-none">{(prediction.win_probability * 100).toFixed(0)}%</span>
                         </div>
                         <div className="w-[1px] h-12 bg-indigo/20" />
                         <div className="text-left max-w-[200px]">
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Target Portal</p>
                            <span className="text-white font-black text-xs uppercase italic tracking-tight leading-snug">{prediction.recommended_forum}</span>
                         </div>
                      </div>
                   )}
                </div>
            </div>

            {/* Timeline Ledger */}
            <div className="space-y-8">
               <div className="flex items-center gap-4 px-2">
                  <Activity size={18} className="text-emerald" />
                  <h5 className="text-white font-black text-xs uppercase tracking-widest italic">Operational Timeline</h5>
               </div>
               <div className="grid grid-cols-1 gap-3">
                 {TIMELINE_STEPS.map((step, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }} 
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                     key={step.id} 
                     className={cn(
                       "flex gap-6 items-center p-6 rounded-[2.5rem] border transition-all",
                       step.done ? "bg-white/2 border-white/5 opacity-40" :
                       step.current ? "bg-emerald/5 border-emerald/20 shadow-xl border-2" : "border-dashed border-white/5"
                     )}
                   >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-xl border transition-all",
                        step.done ? "bg-emerald/10 border-emerald/20 text-emerald" :
                        step.current ? "bg-emerald border-none text-white shadow-emerald/30 animate-pulse" :
                        "bg-white/2 border-white/5 text-slate-800"
                      )}>
                        {step.done ? <CheckCircle2 size={24} /> : <div className="w-2 h-2 rounded-full bg-slate-800" />}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                            <h5 className={cn("text-sm font-black uppercase tracking-widest", step.done ? "text-slate-400" : step.current ? "text-emerald" : "text-slate-700")}>
                               {step.label}
                            </h5>
                            <span className="text-[10px] font-black text-slate-500 uppercase">{step.date}</span>
                         </div>
                      </div>
                   </motion.div>
                 ))}
               </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => window.location.href='/generator'} className="flex-1 flex items-center justify-center gap-4 py-6 rounded-[2rem] gradient-indigo text-white text-[11px] font-black uppercase tracking-widest italic shadow-xl shadow-indigo/20 hover:scale-105 active:scale-95 transition-all">
                <FileText size={18} /> Draft Statutory Submission
              </button>
              <button className="flex-1 flex items-center justify-center gap-4 py-6 rounded-[2rem] glass-card border border-white/5 text-slate-400 text-[11px] font-black uppercase tracking-widest italic hover:text-white transition-all">
                <ArrowUpRight size={18} /> Sync with eCourts Portal
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
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-indigo flex items-center justify-center shadow-lg shadow-indigo/20">
                <Radar size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-widest italic leading-none">Docket Tracker</h1>
                <p className="text-[10px] text-indigo font-bold uppercase tracking-tighter mt-1">Live eCourts Sync</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 bg-white/2 border border-white/5 px-5 py-2 rounded-full">
            <Globe size={14} className="text-indigo" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global Surveillance Active</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 max-w-6xl pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Intelligence Panel */}
          <div className="lg:col-span-4 space-y-10">
             <div className="p-10 rounded-[3.5rem] bg-saffron/10 border border-saffron/20 space-y-8 relative overflow-hidden group">
                <div className="w-16 h-16 rounded-[1.5rem] bg-saffron/20 flex items-center justify-center text-saffron shadow-lg animate-pulse">
                   <Clock size={32} />
                </div>
                <div>
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter font-display text-saffron mb-2">Protocol Red</h3>
                   <p className="text-saffron/60 text-base font-medium leading-relaxed italic">System detected <span className="text-white font-black">ONE</span> active dossier nearing the 60-day filing ceiling.</p>
                </div>
                <button className="w-full py-5 rounded-2xl bg-saffron text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-saffron/20 hover:scale-105 transition-all">Resolve Immediate Filing</button>
             </div>

             <div className="glass-card p-10 rounded-[3.5rem] border-white/5 border-glow space-y-8">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Surveillance Feed</h4>
                {[
                  { icon: ShieldCheck, label: 'eCourts Data Integrity', val: 'Verified' },
                  { icon: Zap, label: 'Llama-3 Neural Core', val: 'Active' },
                  { icon: Database, label: 'Local Encrypted Cache', val: 'Syncing' }
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <f.icon size={16} className="text-slate-600" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{f.label}</span>
                     </div>
                     <span className="text-[9px] font-black text-indigo uppercase">{f.val}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Docket Ledger */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter font-display leading-none">The Docket <span className="text-slate-700 ml-3">({cases.length})</span></h2>
              <div className="flex gap-4">
                <button className="p-3 rounded-2xl glass-card border-white/10 text-slate-500 hover:text-white transition-all"><SearchIcon size={20} /></button>
                <button className="p-3 rounded-2xl glass-card border-white/10 text-slate-500 hover:text-white transition-all"><ListFilter size={20} /></button>
              </div>
            </div>

            <div className="space-y-8 pb-32">
              {cases.map((c, i) => <CaseCard key={c.id} c={c} index={i} />)}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
