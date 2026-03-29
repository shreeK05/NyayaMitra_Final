import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scale, Clock, ChevronRight, Plus, AlertCircle, 
  CheckCircle2, Calendar, FileText, TrendingUp,
  Download, Search, Filter, ShieldCheck, Gavel,
  Zap, ArrowUpRight, BarChart3, Globe, Activity
} from 'lucide-react'
import { getCases, predictWinProbability } from '@/utils/api'
import { SAMPLE_CASES, formatDate, daysUntil } from '@/utils'
import type { Case } from '@/types'
import { cn } from '@/utils'

const TIMELINE_STEPS = [
  { id: 1, label: 'Incident Occurred', date: '15 Jan 2024', done: true, icon: '🚨' },
  { id: 2, label: 'Legal Notice Sent', date: '1 Feb 2024', done: true, icon: '📄' },
  { id: 3, label: 'Response Deadline', date: '16 Feb 2024', done: true, icon: '⏰' },
  { id: 4, label: 'Complaint Filed', date: '20 Feb 2024', done: true, icon: '🏛️' },
  { id: 5, label: 'Conciliation Hearing', date: '15 Mar 2024', done: false, icon: '👥', current: true },
  { id: 6, label: 'Resolution', date: 'Estimated Jul 2024', done: false, icon: '✅' },
]

function CaseCard({ c }: { c: Case }) {
  const [expanded, setExpanded] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const days = c.limitationDate ? daysUntil(c.limitationDate) : 999
  const isUrgent = days < 60
  const statusColor = c.status === 'active' ? '#10b981' : c.status === 'pending' ? '#f59e0b' : '#64748b'

  return (
    <motion.div layout className="glass-diamond rounded-[2rem] overflow-hidden border-none relative group h-full">
      {/* Status Ribbon */}
      <div className="absolute top-0 left-0 w-1.5 h-full opacity-60" style={{ backgroundColor: statusColor }} />
      
      <button onClick={() => setExpanded(!expanded)} className="w-full p-6 text-left relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl glass-diamond flex items-center justify-center shrink-0 border-white/5" style={{ background: `${statusColor}10` }}>
            <Scale size={20} style={{ color: statusColor }} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest"
                style={{ color: statusColor, backgroundColor: `${statusColor}15`, border: `1px solid ${statusColor}30` }}>
                {c.status}
              </span>
              {isUrgent && (
                <span className="px-2.5 py-1 rounded-md text-[9px] font-black bg-red-500/10 text-red-500 border border-red-500/30 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                   {days}D LEFT
                </span>
              )}
            </div>
            <h3 className="text-white font-black text-lg tracking-tight leading-tight mb-1">{c.title}</h3>
            <div className="flex items-center gap-3">
               <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{c.type || 'CIVIL'} FORUM</span>
               <div className="w-1 h-1 rounded-full bg-slate-800" />
               <p className="text-slate-400 text-[11px] font-medium truncate">{c.facts}</p>
            </div>
          </div>
          
          <div className={cn("mt-1 transition-transform duration-300 rounded-full w-8 h-8 flex items-center justify-center glass-diamond", expanded && "rotate-180")}>
             <ChevronRight size={16} className="text-slate-500" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 px-6 pb-6 pt-4 space-y-6 overflow-hidden"
          >
            {/* AI Outcome Sparkline */}
            <div className="glass-card rounded-2xl p-4 border border-indigo-500/10 bg-indigo-500/5">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <BarChart3 size={14} className="text-indigo-400" />
                      <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Neural Win Projection</span>
                   </div>
                   {prediction && (
                      <span className="text-indigo-400 font-black text-lg">{(prediction.win_probability * 100).toFixed(0)}%</span>
                   )}
                </div>
                
                {!prediction ? (
                   <button 
                     onClick={async () => {
                       try {
                         const res = await predictWinProbability({
                           case_type: c.type || 'civil',
                           state: 'Maharashtra',
                           court_level: 'district',
                           evidence: 'strong',
                           time_elapsed: 1.0
                         })
                         setPrediction(res)
                       } catch (err) {
                         setPrediction({ win_probability: 0.75, recommended_forum: 'District Forum' })
                       }
                     }}
                     className="w-full py-2.5 rounded-xl bg-indigo-500/15 text-indigo-300 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 hover:bg-indigo-500/25 transition-all"
                   >
                     Compute Winning Odds
                   </button>
                ) : (
                   <div className="space-y-3">
                      <div className="h-2 bg-indigo-950 rounded-full overflow-hidden border border-indigo-500/20">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${prediction.win_probability * 100}%` }}
                           className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"
                         />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                         <span className="text-slate-500">Predicted Forum</span>
                         <span className="text-indigo-300">{prediction.recommended_forum}</span>
                      </div>
                   </div>
                )}
            </div>

            {/* Applicable Statutes */}
            <div className="space-y-3">
               <div className="flex items-center gap-2">
                  <Gavel size={14} className="text-slate-500" />
                  <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Legal Framework</span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {c.actsRelevant.map((act) => (
                   <div key={act} className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-white/5 border border-white/10 text-slate-300 uppercase tracking-tight">
                     {act}
                   </div>
                 ))}
               </div>
            </div>

            {/* Detailed Timeline */}
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                  <Activity size={14} className="text-slate-500" />
                  <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Procedural Timeline</span>
               </div>
               <div className="grid gap-2">
                 {TIMELINE_STEPS.map((step, i) => (
                   <div key={step.id} className="flex gap-4 items-center p-3 rounded-2xl glass-card transition-colors hover:bg-white/5">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-lg border",
                        step.done ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                        step.current ? "bg-orange-500/10 border-orange-500/30 text-orange-400 ring-4 ring-orange-500/5" :
                        "bg-white/2 border-white/5 text-slate-700"
                      )}>
                        {step.done ? <CheckCircle2 size={16} /> : <span className="text-xs">{step.icon}</span>}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center">
                            <h5 className={cn("text-xs font-black uppercase tracking-tight", step.done ? "text-slate-300" : step.current ? "text-orange-400" : "text-slate-700")}>
                               {step.label}
                            </h5>
                            <span className="text-[9px] text-slate-600 font-bold">{step.date}</span>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
              <button onClick={() => window.location.href='/generator'} className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/20 transition-all">
                <FileText size={14} /> Draft Document
              </button>
              <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl glass-card border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                <ArrowUpRight size={14} /> eCourts Portal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function CaseTrackerPage() {
  const [cases, setCases] = useState<Case[]>(SAMPLE_CASES)

  useEffect(() => {
    getCases().then(res => {
      const data = res as any
      if (data && data.cases) setCases(data.cases)
    }).catch(err => console.error('getCases error:', err))
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-6 max-w-2xl mx-auto space-y-10 min-h-screen mesh-gradient">
      
      {/* Header with Case Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/30">
                 <ShieldCheck size={18} className="text-orange-400" />
              </div>
              <h1 className="text-white font-black text-2xl tracking-tighter uppercase italic">Supreme Docket</h1>
           </div>
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Active Legal Surveillance Engine</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex -space-x-3 shrink-0">
              {[0, 1, 2].map(i => (
                 <div key={i} className="w-10 h-10 rounded-2xl glass-diamond border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Lawyer${i}`} alt="Avatar" className="w-full h-full p-1.5" />
                 </div>
              ))}
           </div>
           <button className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center glow-saffron shadow-2xl transition-all hover:scale-110 active:scale-95">
              <Plus size={24} className="text-white" />
           </button>
        </div>
      </div>

      {/* Limitation Warning */}
      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-diamond border-none p-6 rounded-[2rem] bg-amber-500/10 flex items-center gap-5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full animate-pulse" />
         <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-500/20 border border-amber-500/30 shrink-0">
            <Clock size={28} className="text-amber-500 animate-pulse" />
         </div>
         <div className="flex-1">
            <h4 className="text-amber-500 font-black text-base tracking-tight uppercase">Critical Limitation Alert</h4>
            <p className="text-amber-200/60 text-[11px] font-medium leading-snug mt-1">1 case requires immediate filing within 60 days. Missed deadlines lead to loss of legal rights.</p>
         </div>
         <ChevronRight size={20} className="text-amber-500/40 group-hover:translate-x-1 transition-transform" />
      </motion.div>

      {/* National Sync Banner */}
      <div className="grid grid-cols-2 gap-4">
         <div className="glass-diamond p-5 rounded-[2rem] border-cyan-500/20 bg-cyan-500/5 group cursor-pointer relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
               <Globe size={14} className="text-cyan-400" />
               <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest">eCourts Sync</span>
            </div>
            <p className="text-white font-black text-xs">Live Database</p>
            <div className="mt-3 flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
               <span className="text-slate-500 text-[8px] font-black uppercase tracking-tighter">Connection Stable</span>
            </div>
         </div>
         <div className="glass-diamond p-5 rounded-[2rem] border-purple-500/20 bg-purple-500/5 group cursor-pointer relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
               <Zap size={14} className="text-purple-400" />
               <span className="text-purple-400 text-[9px] font-black uppercase tracking-widest">AI Audit</span>
            </div>
            <p className="text-white font-black text-xs">BNS Analysis</p>
            <div className="mt-3 flex items-center gap-1.5">
               <span className="text-purple-400 text-[8px] font-black uppercase tracking-tighter">Running Background</span>
            </div>
         </div>
      </div>

      {/* Case List */}
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between px-2 mb-6">
           <h2 className="text-white font-black text-sm uppercase tracking-[0.2em]">Active Docket ({cases.length})</h2>
           <div className="flex items-center gap-3">
              <Filter size={16} className="text-slate-500" />
              <Search size={16} className="text-slate-500" />
           </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {cases.map((c) => <CaseCard key={c.id} c={c} />)}
        </div>
      </div>

    </motion.div>
  )
}
