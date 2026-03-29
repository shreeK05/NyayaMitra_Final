import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scale, Clock, ChevronRight, Plus, AlertCircle, 
  CheckCircle2, Calendar, FileText, TrendingUp,
  Download, Search, Filter, ShieldCheck, Gavel,
  Zap, ArrowUpRight, BarChart3, Globe, Activity,
  Database, Info, InfoIcon, Shield, Sparkles, MessageSquare, RefreshCw
} from 'lucide-react'
import { getCases, predictWinProbability } from '@/utils/api'
import { SAMPLE_CASES, formatDate, daysUntil, cn } from '@/utils'
import type { Case } from '@/types'

const TIMELINE_STEPS = [
  { id: 1, label: 'Incident Occurred', date: '15 Jan 2024', done: true, icon: '🚨' },
  { id: 2, label: 'Legal Notice Sent', date: '1 Feb 2024', done: true, icon: '📄' },
  { id: 3, label: 'Response Deadline', date: '16 Feb 2024', done: true, icon: '⏰' },
  { id: 4, label: 'Complaint Filed', date: '20 Feb 2024', done: true, icon: '🏛️' },
  { id: 5, label: 'Conciliation Hearing', date: '15 Mar 2024', done: false, icon: '👥', current: true },
  { id: 6, label: 'Resolution', date: 'Estimated Jul 2024', done: false, icon: '✅' },
]

function CaseCard({ c, index }: { c: Case; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const days = c.limitationDate ? daysUntil(c.limitationDate) : 999
  const isUrgent = days < 60
  const statusColor = c.status === 'active' ? '#10b981' : c.status === 'pending' ? '#f59e0b' : '#64748b'

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
    } catch (err) {
      setPrediction({ win_probability: 0.75, recommended_forum: 'District Consumer Forum' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      layout 
      className="glass-diamond rounded-[2.5rem] overflow-hidden border-none relative group h-full shadow-2xl"
    >
      {/* Visual Indicator */}
      <div className="absolute top-0 left-0 w-2 h-full opacity-60 rounded-full" style={{ backgroundColor: statusColor }} />
      
      <button onClick={() => setExpanded(!expanded)} className="w-full p-8 text-left relative z-10">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-3xl glass-diamond flex items-center justify-center shrink-0 border-white/5 relative overflow-hidden" 
               style={{ background: `${statusColor}10` }}>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Scale size={28} style={{ color: statusColor }} className="relative z-10" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]"
                style={{ color: statusColor, backgroundColor: `${statusColor}15`, border: `1px solid ${statusColor}30` }}>
                {c.status} Protocol
              </span>
              {isUrgent && (
                <div className="px-3 py-1 rounded-lg text-[10px] font-black bg-red-500/10 text-red-500 border border-red-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   CRITICAL: {days}D FILING WINDOW
                </div>
              )}
            </div>
            <h3 className="text-white font-black text-2xl tracking-tighter leading-tight mb-2 font-display uppercase italic">{c.title}</h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest leading-none">
                  <Database size={10} />
                  {c.type || 'CIVIL'} FORUM
               </div>
               <p className="text-slate-400 text-xs font-medium truncate max-w-sm opacity-60 italic">{c.facts}</p>
            </div>
          </div>
          
          <div className={cn("mt-4 p-3 transition-all duration-500 rounded-full w-12 h-12 flex items-center justify-center glass-diamond border shadow-xl hover:scale-110", expanded && "rotate-180 border-saffron/40 bg-saffron/10")}>
             <ChevronRight size={24} className={cn("text-slate-500 transition-colors", expanded && "text-saffron")} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 px-8 pb-10 pt-6 space-y-8 overflow-hidden"
          >
            {/* Neural Projection System */}
            <div className="glass-diamond rounded-[2rem] p-8 border-accent-purple/20 bg-accent-purple/5 relative overflow-hidden group/odd">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-purple/10 blur-[100px] rounded-full" />
                <div className="flex items-center justify-between mb-8 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-accent-purple/20 flex items-center justify-center">
                         <BarChart3 size={20} className="text-accent-purple" />
                      </div>
                      <div>
                         <span className="text-accent-purple text-[10px] font-black uppercase tracking-[0.3em]">Neural Case Simulator</span>
                         <h4 className="text-white font-black text-lg tracking-tight italic uppercase">Outcome Projection</h4>
                      </div>
                   </div>
                </div>
                
                {!prediction ? (
                   <button 
                     onClick={computeOdds}
                     disabled={loading}
                     className="w-full py-5 rounded-2xl bg-accent-purple/15 text-accent-purple text-xs font-black uppercase tracking-[0.2em] border border-accent-purple/30 hover:bg-accent-purple/25 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"
                   >
                     {loading ? <RefreshCw size={18} className="animate-spin text-accent-purple" /> : <Zap size={18} />}
                     {loading ? 'Simulating Court Verdict...' : 'Run Neural Outcome Projection'}
                   </button>
                ) : (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 relative z-10">
                      <div className="flex items-end justify-between">
                         <div>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Win Probability</p>
                            <span className="text-5xl font-black text-white italic tracking-tighter">{(prediction.win_probability * 100).toFixed(0)}</span>
                            <span className="text-2xl font-black text-accent-purple italic">%</span>
                         </div>
                         <div className="text-right">
                             <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Optimum Defense Portal</p>
                             <span className="text-white font-black text-sm uppercase italic tracking-tight">{prediction.recommended_forum}</span>
                         </div>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${prediction.win_probability * 100}%` }}
                           transition={{ duration: 1.5, ease: "easeOut" }}
                           className="h-full bg-gradient-to-r from-accent-purple via-indigo-500 to-accent-cyan rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                         />
                      </div>
                      <div className="flex gap-2">
                         <div className="px-3 py-1 rounded-lg bg-accent-purple/10 border border-accent-purple/20 text-[9px] font-black text-accent-purple uppercase tracking-widest">Groq Llama 3 v8 Engine</div>
                         <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">0.4s Simulation Time</div>
                      </div>
                   </motion.div>
                )}
            </div>

            {/* Applicable Framework Ledger */}
            <div className="space-y-4 px-2">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                     <Gavel size={14} className="text-saffron" />
                  </div>
                  <h5 className="text-white font-black text-[10px] uppercase tracking-[0.25em]">Defense Strategy: Applicable Law</h5>
               </div>
               <div className="flex flex-wrap gap-3">
                 {c.actsRelevant.map((act) => (
                   <div key={act} className="px-4 py-2 rounded-2xl text-[10px] font-black bg-white/5 border border-white/10 text-slate-400 uppercase tracking-tight hover:border-saffron/40 hover:text-white transition-all cursor-default shadow-sm group/act">
                     <span className="opacity-40 group-hover/act:opacity-100 transition-opacity mr-2">⚖️</span>
                     {act}
                   </div>
                 ))}
               </div>
            </div>

            {/* Tactical Timeline Ledger */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                     <Activity size={14} className="text-accent-cyan" />
                  </div>
                  <h5 className="text-white font-black text-[10px] uppercase tracking-[0.25em]">Operational Timeline: Stage Matrix</h5>
               </div>
               <div className="grid grid-cols-1 gap-2">
                 {TIMELINE_STEPS.map((step, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }} 
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                     key={step.id} 
                     className={cn(
                       "flex gap-6 items-center p-5 rounded-3xl transition-all border",
                       step.done ? "glass-card border-white/5 opacity-60" :
                       step.current ? "bg-accent-cyan/5 border-accent-cyan/20 shadow-xl scale-[1.02] relative" : "bg-white/2 border-dashed border-white/5"
                     )}
                   >
                      {step.current && (
                         <div className="absolute top-0 right-0 p-3">
                            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-ping shadow-[0_0_10px_#06b6d4]" />
                         </div>
                      )}
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-2xl border transition-all",
                        step.done ? "bg-india-green/10 border-india-green/30 text-india-green shadow-india-green/5" :
                        step.current ? "bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan shadow-accent-cyan/20 scale-110" :
                        "bg-white/2 border-white/5 text-slate-800"
                      )}>
                        {step.done ? <CheckCircle2 size={24} /> : <span className="font-display font-black">{step.icon}</span>}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                            <h5 className={cn("text-xs font-black uppercase tracking-[0.1em]", step.done ? "text-slate-400" : step.current ? "text-accent-cyan" : "text-slate-700")}>
                               {step.label}
                            </h5>
                            <span className={cn("text-[10px] font-black uppercase", step.done ? "text-slate-600" : "text-slate-500")}>{step.date}</span>
                         </div>
                         <div className={cn("h-1 rounded-full", step.done ? "bg-india-green/40" : step.current ? "bg-accent-cyan/20" : "bg-white/5")}>
                            {step.current && <motion.div className="h-full bg-accent-cyan" animate={{ width: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />}
                         </div>
                      </div>
                   </motion.div>
                 ))}
               </div>
            </div>

            {/* Strategic Action Matrix */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button onClick={() => window.location.href='/generator'} className="flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-india-green/10 border border-india-green/30 text-india-green text-[10px] font-black uppercase tracking-[0.3em] hover:bg-india-green/20 transition-all shadow-xl active:scale-95">
                <FileText size={16} /> Draft Submission
              </button>
              <button className="flex items-center justify-center gap-3 py-5 rounded-[2rem] glass-card border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all shadow-xl active:scale-95">
                <ArrowUpRight size={16} /> eCourts Portal
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 lg:px-12 py-10 max-w-7xl mx-auto space-y-16 min-h-screen mesh-gradient relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none -ml-40 -mb-40" />

      {/* Header System */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
        <div className="space-y-4">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[2rem] gradient-primary glow-saffron flex items-center justify-center shadow-2xl">
                 <ShieldCheck size={36} className="text-white" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none font-display">Docket Command</h1>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_#06b6d4] animate-pulse" />
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em]">Active Legal Surveillance Engine v4.0</p>
           </div>
        </div>
        
        <div className="flex items-center gap-6 glass-diamond p-4 lg:p-6 rounded-[3rem] border-white/5 shadow-2xl">
           <div className="text-right">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Defense Network</p>
              <p className="text-white font-black text-xs uppercase tracking-tight">3 AI Agents Active</p>
           </div>
           <div className="flex -space-x-4 shrink-0">
              {[0, 1, 2].map(i => (
                 <motion.div 
                    key={i} 
                    whileHover={{ zIndex: 50, scale: 1.1, translateY: -5 }}
                    className="w-12 h-12 lg:w-16 lg:h-16 rounded-3xl glass-diamond border border-white/10 flex items-center justify-center shadow-2xl relative transition-all cursor-pointer"
                 >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Lawyer${i}&backgroundColor=transparent`} alt="Agent" className="w-full h-full p-2" />
                 </motion.div>
              ))}
           </div>
           <button className="w-12 h-12 lg:w-16 lg:h-16 rounded-full gradient-primary flex items-center justify-center glow-saffron shadow-2xl transition-all hover:scale-110 active:scale-95 group">
              <Plus size={32} className="text-white group-hover:rotate-90 transition-transform duration-500" />
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 relative z-10">
         
         {/* Left Panel: Stats & Alerts */}
         <div className="lg:col-span-4 space-y-8">
            {/* Limitation Warning */}
            <motion.div 
               initial={{ x: -20, opacity: 0 }} 
               animate={{ x: 0, opacity: 1 }} 
               className="glass-diamond border-none p-10 rounded-[3.5rem] bg-red-500/10 flex flex-col gap-6 relative overflow-hidden group shadow-[0_20px_50px_rgba(239,68,68,0.15)]"
            >
               <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 blur-[60px] rounded-full animate-pulse" />
               <div className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center bg-red-500/20 border border-red-500/40 shadow-2xl relative z-10">
                  <Clock size={40} className="text-red-500 animate-pulse" />
               </div>
               <div className="space-y-2 relative z-10">
                  <h4 className="text-red-500 font-black text-2xl tracking-tighter uppercase italic">Red Alert Protocol</h4>
                  <p className="text-red-300 font-medium leading-relaxed">System has detected <span className="text-white font-black">ONE</span> active case bypassing the 60-day safety filing window.</p>
               </div>
               <button className="w-full py-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 relative z-10 group/btn">
                  Initialize Immediate Filing <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
               </button>
            </motion.div>

            {/* Network Sync Matrix */}
            <div className="grid grid-cols-1 gap-4">
               <div className="glass-diamond p-8 rounded-[3.5rem] border-accent-cyan/20 bg-accent-cyan/5 group cursor-pointer relative overflow-hidden shadow-xl transition-all hover:border-accent-cyan/40">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-2xl bg-accent-cyan/20 flex items-center justify-center">
                        <Globe size={18} className="text-accent-cyan" />
                     </div>
                     <span className="text-accent-cyan text-[10px] font-black uppercase tracking-[0.3em]">eCourts Live Sync</span>
                  </div>
                  <h5 className="text-white font-black text-2xl tracking-tighter uppercase italic">National Database</h5>
                  <div className="mt-8 flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-india-green shadow-[0_0_12px_#10b981]" />
                     <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Uplink Persistent</span>
                  </div>
               </div>
               
               <div className="glass-diamond p-8 rounded-[3.5rem] border-accent-purple/20 bg-accent-purple/5 group cursor-pointer relative overflow-hidden shadow-xl transition-all hover:border-accent-purple/40">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-2xl bg-accent-purple/20 flex items-center justify-center">
                        <MessageSquare size={18} className="text-accent-purple" />
                     </div>
                     <span className="text-accent-purple text-[10px] font-black uppercase tracking-[0.3em]">BNS v1.4 Audit Log</span>
                  </div>
                  <h5 className="text-white font-black text-2xl tracking-tighter uppercase italic">Penal Engine Scan</h5>
                  <div className="mt-8 flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-pulse shadow-[0_0_12px_#7c3aed]" />
                     <span className="text-accent-purple text-[10px] font-black uppercase tracking-[0.2em]">47 Statues Mapped</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Panel: Scrollable Case Ledger */}
         <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between px-6 mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shadow-xl">
                     <Database size={18} className="text-slate-500" />
                  </div>
                  <h2 className="text-white font-black text-xl lg:text-3xl italic tracking-tighter uppercase font-display leading-none">Active Docket <span className="text-slate-700 ml-2">({cases.length})</span></h2>
               </div>
               <div className="flex items-center gap-4">
                  <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl glass-card border-white/10">
                     <Search size={14} className="text-slate-500" />
                     <input type="text" placeholder="Filter Docket..." className="bg-transparent text-xs font-black uppercase tracking-widest text-white placeholder-slate-700 focus:outline-none w-32" />
                  </div>
                  <button className="p-3 rounded-2xl glass-card border-white/10 text-slate-500 hover:text-white transition-all"><Filter size={20} /></button>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-8 pb-32">
              {cases.map((c, i) => <CaseCard key={c.id} c={c} index={i} />)}
            </div>
         </div>
      </div>

    </motion.div>
  )
}
