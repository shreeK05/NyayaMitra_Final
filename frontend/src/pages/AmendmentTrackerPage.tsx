import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, Calendar, ChevronDown, ChevronUp, GitCompare, AlertCircle, 
  Search, ShieldCheck, Globe, Zap, Database, Info, InfoIcon, 
  ArrowUpRight, Share2, Filter, Info as InfoIconLucide,
  FileDigit, FileText, XCircle, CheckCircle2, RefreshCw,
  ArrowLeft, History, Scale, ArrowRight, Activity
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAmendments, getIpcBnsMapping } from '@/utils/api'
import { formatDate, cn } from '@/utils'

function AmendmentCard({ amendment, index }: { amendment: any; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      whileInView={{ opacity: 1, scale: 1 }} 
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass-card rounded-[4rem] overflow-hidden border-white/5 border-glow relative group mb-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] bg-black/40"
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-12 lg:p-16 text-left relative overflow-hidden transition-all hover:bg-white/2">
        <div className="flex items-start gap-12 relative z-10">
          <div className="w-20 h-20 rounded-[2rem] bg-saffron/10 border border-saffron/30 text-saffron group-hover:scale-110 transition-transform flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(255,153,51,0.2)]">
            <div className="absolute inset-0 bg-saffron/5" />
            <Bell size={40} className="relative z-10" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-6 mb-4">
              <span className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] bg-saffron gradient-saffron text-white shadow-xl shadow-saffron/30 italic">Gazette Node Alpha</span>
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic bg-white/2 px-4 py-2 border border-white/5 rounded-xl">
                <Calendar size={14} className="text-saffron" />
                DATED: {formatDate(amendment.gazetteDate)}
              </div>
            </div>
            <h3 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.8] font-display mb-6 shadow-text">{amendment.actName}</h3>
            <div className="flex items-center gap-6">
               <div className="px-4 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest italic">{amendment.section} Protocol</div>
               <div className="h-px w-10 bg-slate-800" />
               <p className="text-slate-500 text-lg font-medium italic opacity-70 leading-relaxed max-w-3xl line-clamp-1">Analysis: {amendment.diffSummary}</p>
            </div>
          </div>
          <div className={cn("mt-6 p-4 transition-all duration-700 rounded-full w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 shadow-2xl hover:scale-110", expanded && "rotate-180 border-saffron bg-saffron/10 shadow-saffron/10")}>
             <ChevronDown size={32} className={cn("text-slate-800 transition-colors", expanded && "text-saffron")} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-16 lg:p-20 space-y-16 border-t border-white/5 bg-[#030712]/40 backdrop-blur-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                <div className="p-12 rounded-[3.5rem] bg-black/60 border border-white/5 shadow-inner relative group/old overflow-hidden">
                  <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
                  <div className="flex items-center gap-4 mb-8">
                     <XCircle size={18} className="text-slate-800" />
                     <p className="text-slate-800 text-[11px] font-black uppercase tracking-[0.5em] italic">Repealed Lattice Node</p>
                  </div>
                  <p className="text-slate-700 text-xl lg:text-3xl leading-relaxed line-through italic font-black font-display opacity-40">"{amendment.oldText}"</p>
                </div>
                <div className="p-12 rounded-[3.5rem] bg-emerald/5 border border-emerald/40 shadow-[0_40px_100px_rgba(16,185,129,0.1)] relative overflow-hidden group/new animate-neural-pulse">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent pointer-events-none" />
                  <div className="flex items-center gap-4 mb-8">
                     <CheckCircle2 size={18} className="text-emerald" />
                     <p className="text-emerald text-[11px] font-black uppercase tracking-[0.5em] italic">Active Provision v24.0</p>
                  </div>
                  <p className="text-white text-xl lg:text-3xl leading-relaxed italic font-black font-display text-glow-saffron">"{amendment.newText}"</p>
                </div>
              </div>

              <div className="p-16 rounded-[4rem] glass-card border border-white/10 relative overflow-hidden border-glow shadow-2xl bg-black/40">
                 <div className="absolute top-0 right-0 p-16 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-110"><Zap size={150} className="text-indigo" /></div>
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo border border-indigo/20"><Info size={20} /></div>
                    <p className="text-indigo text-[11px] font-black uppercase tracking-[0.4em] italic leading-none opacity-80">Strategic Transition Analysis</p>
                 </div>
                 <p className="text-slate-300 text-2xl lg:text-5xl font-black italic tracking-tighter leading-tight font-display text-glow-saffron">"{amendment.diffSummary}"</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AmendmentTrackerPage() {
  const navigate = useNavigate()
  const [amendments, setAmendments] = useState<any[]>([])
  const [mapping, setMapping] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aData, mData] = await Promise.all([
          getAmendments(),
          getIpcBnsMapping()
        ]) as [any, any]
        setAmendments(aData.amendments || [])
        setMapping(mData.mapping || [])
      } catch (err) {
        console.error("Failed to fetch amendments", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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
                 <History size={24} className="text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter font-display leading-none text-white">Law Timeline</h1>
                <p className="text-[9px] text-saffron font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-saffron animate-pulse shadow-[0_0_8px_#ff9933]" />
                  Gazette_Surveillance_Active
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-4 bg-white/2 border border-white/5 px-6 py-2.5 rounded-full glass-card">
              <Globe size={14} className="text-saffron" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Monitoring EGAZETTE.GOV.IN</span>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-black/40">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Profile" className="w-full h-full p-1 opacity-60" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 lg:px-12 max-w-7xl pt-40 pb-32">
        <div className="space-y-32">
          
          {/* BNS Hero Section */}
          <section className="p-20 lg:p-32 rounded-[5rem] glass-card border-indigo/20 bg-black/40 relative overflow-hidden border-glow shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 bg-indigo/2 pointer-events-none" />
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none scale-[2] rotate-12 group-hover:rotate-45 transition-transform duration-1000">
              <GitCompare size={200} className="text-indigo" />
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32 relative z-10">
               <div className="w-48 h-48 lg:w-72 lg:h-72 rounded-[4rem] gradient-indigo flex items-center justify-center shadow-[0_40px_100px_rgba(99,102,241,0.4)] relative shrink-0 animate-neural-pulse group">
                  <Scale size={100} className="text-white lg:scale-125 lg:rotate-12 transition-transform duration-700" />
               </div>
               <div className="flex-1 text-center lg:text-left space-y-10 group">
                  <div className="px-8 py-2.5 rounded-2xl bg-indigo/10 border border-indigo/30 inline-block text-xs font-black text-indigo uppercase tracking-[0.3em] italic shadow-2xl">Legislative Transition Protocol</div>
                  <h2 className="text-6xl lg:text-9xl font-black text-white tracking-tighter uppercase italic leading-[0.8] font-display mb-10 shadow-text">BNS Matrix Activated</h2>
                  <p className="text-slate-400 text-xl lg:text-3xl font-medium italic leading-relaxed opacity-80 max-w-4xl font-display">
                    The IPC (1860) has been <span className="text-indigo font-black underline decoration-indigo/30">DECOMMISSIONED</span>. The <span className="text-white font-black italic">Bharatiya Nyaya Sanhita (2023)</span> is now the primary penal lattice for all citizens.
                  </p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32 relative z-10">
              {(mapping.length > 0 ? mapping.slice(0, 4) : [
                { old: 'IPC 302', new: 'BNS 103', label: 'Culpable Homicide' },
                { old: 'IPC 376', new: 'BNS 64', label: 'Sexual Assault' },
                { old: 'IPC 420', new: 'BNS 318', label: 'Cheat & Fraud' },
                { old: 'IPC 124A', new: 'BNS 152', label: 'National Integrity' },
              ]).map(({ old, new: bns, label }, i) => (
                <motion.div 
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 rounded-[3rem] bg-black/60 border border-white/5 shadow-2xl group transition-all hover:scale-105 border-glow relative overflow-hidden"
                >
                   <div className="absolute inset-0 bg-indigo/2" />
                   <div className="text-slate-700 text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-center italic relative z-10">{label}</div>
                   <div className="flex items-center justify-center gap-6 relative z-10">
                      <div className="text-saffron text-2xl lg:text-3xl font-black line-through italic font-display opacity-30">{old}</div>
                      <ArrowRight size={24} className="text-slate-800 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                      <div className="text-emerald text-4xl lg:text-6xl font-black italic font-display text-glow-saffron">{bns}</div>
                   </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Scraper Ledger */}
          <section className="space-y-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 px-12">
               <div className="flex flex-col lg:flex-row items-center gap-10">
                  <div className="w-16 h-16 rounded-[1.75rem] bg-black border border-white/5 flex items-center justify-center text-slate-800 shadow-2xl"><Database size={28} /></div>
                  <div className="space-y-2 text-center lg:text-left">
                     <h3 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter font-display leading-none text-white">Gazette Ledger</h3>
                     <p className="text-slate-700 text-[11px] font-black uppercase tracking-[0.6em] italic leading-none opacity-60">Verified Amendments Synchronized: <span className="text-saffron">[{amendments.length} Nodes Indexed]</span></p>
                  </div>
               </div>
               <div className="flex gap-8">
                  <button className="w-20 h-20 rounded-[2rem] glass-card border border-white/10 text-slate-700 hover:text-white transition-all shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 border-glow"><Search size={32} /></button>
                  <button className="w-20 h-20 rounded-[2rem] glass-card border border-white/10 text-slate-700 hover:text-white transition-all shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 border-glow"><Filter size={32} /></button>
               </div>
            </div>
            
            <div className="pb-40">
              {loading ? (
                 <div className="flex flex-col items-center justify-center py-48 gap-8">
                    <RefreshCw className="text-saffron animate-[spin_3s_linear_infinite]" size={80} />
                    <p className="text-slate-700 text-sm font-black uppercase tracking-[0.8em]">Synchronizing Gazette Stream...</p>
                 </div>
              ) : (
                amendments.map((a, i) => <AmendmentCard key={a.id} amendment={a} index={i} />)
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Persistent Sync Shield */}
      <footer className="fixed bottom-0 left-0 right-0 z-[120] p-12 lg:p-16 flex justify-center pointer-events-none">
         <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 1 }} className="max-w-5xl w-full p-10 lg:p-14 rounded-[4rem] gradient-saffron text-white shadow-[0_40px_100px_rgba(255,153,51,0.4)] pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-12 group border-glow relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 pointer-events-none" />
            <div className="flex items-center gap-10 relative z-10">
               <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center backdrop-blur-3xl border-2 border-white/20 text-4xl shadow-2xl shadow-black/20 group-hover:scale-110 transition-transform">⚡</div>
               <div className="space-y-2">
                  <h4 className="text-3xl lg:text-5xl font-black italic uppercase tracking-tighter font-display leading-[0.8]">Surveillance Shield Active</h4>
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-80 italic">Real-time legislative alerts via distributed WhatsApp Nodes</p>
               </div>
            </div>
            <button className="w-full md:w-auto px-12 py-6 rounded-[2.5rem] bg-black text-white font-black uppercase text-xl shadow-2xl hover:scale-[1.05] active:scale-95 transition-all italic tracking-tighter shadow-black/40 border border-white/10 group-hover:bg-indigo group-hover:border-indigo/40 duration-700">Link Global Node ID</button>
         </motion.div>
      </footer>
    </div>
  )
}
