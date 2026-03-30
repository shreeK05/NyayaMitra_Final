import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, Calendar, ChevronDown, ChevronUp, GitCompare, AlertCircle, 
  Search, ShieldCheck, Globe, Zap, Database, Info, InfoIcon, 
  ArrowUpRight, Share2, Filter, Info as InfoIconLucide,
  FileDigit, FileText, XCircle, CheckCircle2, RefreshCw,
  ArrowLeft, History, Scale, ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAmendments, getIpcBnsMapping } from '@/utils/api'
import { formatDate, cn } from '@/utils'

function AmendmentCard({ amendment, index }: { amendment: any; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-[3rem] overflow-hidden border-white/5 border-glow relative group mb-8"
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-10 lg:p-12 text-left relative overflow-hidden">
        <div className="flex items-start gap-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-saffron/10 flex items-center justify-center shrink-0 border border-saffron/20 text-saffron group-hover:scale-110 transition-transform">
            <Bell size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-3">
              <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-saffron/10 border border-saffron/30 text-saffron">Gazette Alert</span>
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <Calendar size={12} />
                {formatDate(amendment.gazetteDate)}
              </div>
            </div>
            <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic leading-none font-display mb-3">{amendment.actName}</h3>
            <div className="flex items-center gap-4">
               <span className="text-saffron text-[10px] font-black uppercase tracking-widest">{amendment.section} Protocol</span>
               <div className="w-1 h-1 rounded-full bg-slate-800" />
               <p className="text-slate-500 text-sm font-medium italic opacity-60 leading-relaxed max-w-2xl line-clamp-1">{amendment.diffSummary}</p>
            </div>
          </div>
          <div className={cn("mt-4 p-3 transition-all duration-500 rounded-full w-12 h-12 flex items-center justify-center bg-white/2 border border-white/5 shadow-xl hover:scale-110", expanded && "rotate-180 border-saffron/60 bg-saffron/10")}>
             <ChevronDown size={24} className={cn("text-slate-600 transition-colors", expanded && "text-saffron")} />
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
            <div className="px-10 pb-12 space-y-10 border-t border-white/5 pt-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                <div className="p-10 rounded-[2.5rem] bg-black/40 border border-white/5 shadow-inner">
                  <div className="flex items-center gap-3 mb-6">
                     <XCircle size={14} className="text-slate-600" />
                     <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Repealed Lattice</p>
                  </div>
                  <p className="text-slate-500 text-lg lg:text-xl leading-relaxed line-through italic font-medium opacity-40">{amendment.oldText}</p>
                </div>
                <div className="p-10 rounded-[2.5rem] bg-emerald/5 border border-emerald/20 shadow-xl relative overflow-hidden group/new">
                  <div className="flex items-center gap-3 mb-6">
                     <CheckCircle2 size={14} className="text-emerald" />
                     <p className="text-emerald text-[10px] font-black uppercase tracking-widest">Active Provision</p>
                  </div>
                  <p className="text-white text-lg lg:text-xl leading-relaxed italic font-black">{amendment.newText}</p>
                </div>
              </div>

              <div className="p-10 rounded-[3rem] glass-card border border-white/10 relative overflow-hidden border-glow">
                 <div className="flex items-center gap-4 mb-6">
                    <InfoIcon size={16} className="text-indigo" />
                    <p className="text-indigo text-[10px] font-black uppercase tracking-widest">Impact Summary</p>
                 </div>
                 <p className="text-slate-300 text-xl font-black italic tracking-tighter leading-relaxed">{amendment.diffSummary}</p>
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
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center shadow-lg shadow-saffron/20">
                <History size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-widest italic leading-none">Law Timeline</h1>
                <p className="text-[10px] text-saffron font-bold uppercase tracking-tighter mt-1">Gazette Surveillance</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 bg-white/2 border border-white/5 px-5 py-2 rounded-full">
            <Globe size={14} className="text-saffron" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Monitoring EGAZETTE.GOV.IN</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 max-w-6xl pt-32 pb-20">
        <div className="space-y-20">
          
          {/* BNS Hero Section */}
          <section className="p-16 lg:p-24 rounded-[4rem] glass-card border-indigo/20 bg-indigo/5 relative overflow-hidden border-glow">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <GitCompare size={200} className="text-indigo" />
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
               <div className="w-48 h-48 rounded-[3rem] gradient-indigo flex items-center justify-center shadow-2xl relative shrink-0">
                  <Scale size={64} className="text-white" />
               </div>
               <div className="flex-1 text-center lg:text-left space-y-6">
                  <div className="px-5 py-1.5 rounded-full bg-indigo/10 border border-indigo/30 inline-block text-[10px] font-black text-indigo uppercase tracking-widest italic">Statutory Transition Lattice</div>
                  <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none font-display">BNS Deployment</h2>
                  <p className="text-slate-400 text-xl font-medium italic leading-relaxed opacity-80 max-w-3xl mx-auto lg:mx-0">
                    The IPC (1860) has been decommissioned. In its place, the <span className="text-indigo font-black">Bharatiya Nyaya Sanhita (2023)</span> is now active. We’ve mapped the entire shift for you.
                  </p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 relative z-10">
              {(mapping.length > 0 ? mapping.slice(0, 4) : [
                { old: 'IPC 302', new: 'BNS 103', label: 'Culpable Homicide' },
                { old: 'IPC 376', new: 'BNS 64', label: 'Sexual Assault' },
                { old: 'IPC 420', new: 'BNS 318', label: 'Cheat & Fraud' },
                { old: 'IPC 124A', new: 'BNS 152', label: 'National Integrity' },
              ]).map(({ old, new: bns, label }) => (
                <div key={label} className="p-8 rounded-[2.5rem] bg-black/40 border border-white/10 shadow-2xl group transition-all hover:scale-105 border-glow">
                   <div className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-4 text-center">{label}</div>
                   <div className="flex items-center justify-center gap-4">
                      <div className="text-saffron text-xl font-black line-through italic font-display opacity-40">{old}</div>
                      <ArrowRight size={16} className="text-slate-800" />
                      <div className="text-emerald text-3xl font-black italic font-display">{bns}</div>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Scraper Ledger */}
          <section className="space-y-12">
            <div className="flex items-center justify-between px-6">
               <div className="flex items-center gap-5">
                  <Database size={24} className="text-slate-600" />
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter font-display leading-none text-white">Scraper Ledger <span className="text-slate-800 ml-4">[{amendments.length}]</span></h3>
               </div>
               <div className="flex gap-4">
                  <button className="p-3 rounded-2xl glass-card border border-white/5 text-slate-500 hover:text-white transition-all"><Search size={20} /></button>
                  <button className="p-3 rounded-2xl glass-card border border-white/5 text-slate-500 hover:text-white transition-all"><Filter size={20} /></button>
               </div>
            </div>
            
            <div className="pb-32">
              {loading ? (
                 <div className="flex justify-center py-40"><RefreshCw className="text-saffron animate-spin" size={60} /></div>
              ) : (
                amendments.map((a, i) => <AmendmentCard key={a.id} amendment={a} index={i} />)
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Persistent Sync Shield */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 p-8 flex justify-center pointer-events-none">
         <div className="max-w-4xl w-full p-8 rounded-[2.5rem] gradient-saffron text-white shadow-2xl shadow-saffron/30 pointer-events-auto flex items-center justify-between group">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xl border border-white/30 text-2xl">⚡</div>
               <div>
                  <h4 className="text-2xl font-black italic uppercase tracking-tighter font-display leading-none">Matrix Sync Active</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-1">Real-time legislative alerts via WhatsApp Node</p>
               </div>
            </div>
            <button className="px-8 py-4 rounded-xl bg-black text-white font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">Link Node ID</button>
         </div>
      </footer>
    </div>
  )
}
