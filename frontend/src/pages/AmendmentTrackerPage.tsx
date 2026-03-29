import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, Calendar, ChevronDown, ChevronUp, GitCompare, AlertCircle, 
  Search, ShieldCheck, Globe, Zap, Database, Info, InfoIcon, 
  ArrowUpRight, Share2, Filter, Info as InfoIconLucide,
  FileDigit, FileText, XCircle, CheckCircle2
} from 'lucide-react'
import { SAMPLE_AMENDMENTS, formatDate, cn } from '@/utils'

function AmendmentCard({ amendment, index }: { amendment: typeof SAMPLE_AMENDMENTS[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.1 }}
      layout 
      className="glass-diamond rounded-[2.5rem] overflow-hidden border-none hover:shadow-2xl hover:border-saffron/20 transition-all duration-500 group"
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-8 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all scale-150 rotate-12">
           <Bell size={120} className="text-saffron" />
        </div>
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-saffron/20 shadow-xl group-hover:scale-110 transition-transform">
            <Bell size={32} className="text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-3">
              <span className="px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest bg-red-500/15 border border-red-500/30 text-red-400 uppercase italic">Legislative Shift Detected</span>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/2 px-3 py-1 rounded-lg border border-white/5">
                <Calendar size={12} />
                {formatDate(amendment.gazetteDate)}
              </div>
            </div>
            <h3 className="text-white font-black text-2xl tracking-tighter uppercase italic leading-none font-display mb-2">{amendment.actName}</h3>
            <div className="flex items-center gap-3">
               <span className="text-saffron text-[11px] font-black uppercase tracking-[0.2em]">{amendment.section} Protocol</span>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
               <p className="text-slate-400 text-sm font-medium line-clamp-1 italic max-w-sm opacity-60 leading-relaxed font-sans">{amendment.diffSummary}</p>
            </div>
          </div>
          <div className={cn("mt-4 p-3 transition-all duration-500 rounded-full w-12 h-12 flex items-center justify-center glass-diamond border shadow-xl hover:scale-110", expanded && "rotate-180 border-saffron/40 bg-saffron/10")}>
             <ChevronDown size={28} className={cn("text-slate-500 transition-colors", expanded && "text-saffron")} />
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
            <div className="px-10 pb-12 space-y-8 border-t border-white/5 pt-8">
              <div className="flex items-center gap-3 px-2">
                <GitCompare size={20} className="text-slate-600" />
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.3em]">Neural Delta Scan: Repealed vs Current</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-40">
                   <Zap size={32} className="text-slate-700 blur-[1px]" />
                </div>
                <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/20 shadow-xl relative overflow-hidden group/old">
                  <div className="absolute inset-0 bg-red-500/2 opacity-0 group-hover/old:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                     <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <XCircle size={14} className="text-red-500" />
                     </div>
                     <p className="text-red-500 text-[10px] font-black uppercase tracking-widest italic">Repealed Text (Post-Gazette)</p>
                  </div>
                  <p className="text-slate-500 text-base leading-relaxed line-through italic font-medium relative z-10">{amendment.oldText}</p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-india-green/5 border border-india-green/20 shadow-xl relative overflow-hidden group/new">
                  <div className="absolute inset-0 bg-india-green/2 opacity-0 group-hover/new:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                     <div className="w-8 h-8 rounded-xl bg-india-green/10 border border-india-green/20 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-india-green" />
                     </div>
                     <p className="text-india-green text-[10px] font-black uppercase tracking-widest italic">Current Force Projection</p>
                  </div>
                  <p className="text-emerald-100 text-base leading-relaxed italic font-medium relative z-10 shadow-emerald-500/5 drop-shadow-lg">{amendment.newText}</p>
                </div>
              </div>

              <div className="p-8 rounded-[3rem] bg-[#030712] border border-white/5 relative overflow-hidden group/impact shadow-2xl">
                <div className="absolute -bottom-10 -right-10 p-10 opacity-5 group-hover/impact:opacity-20 transition-all scale-150 rotate-6">
                   <InfoIconLucide size={120} className="text-accent-cyan" />
                </div>
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20">
                         <Info size={14} className="text-accent-cyan" />
                      </div>
                      <p className="text-accent-cyan text-[10px] font-black uppercase tracking-widest italic">NyayaMitra Impact Correlation Engine</p>
                   </div>
                   <p className="text-slate-300 text-lg leading-relaxed font-medium italic opacity-80">{amendment.diffSummary}</p>
                </div>
              </div>

              {amendment.relevantCases && amendment.relevantCases.length > 0 && (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col lg:flex-row items-center gap-10 p-10 rounded-[4rem] bg-orange-500/10 border-saffron/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-saffron/5 animate-pulse" />
                  <div className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center bg-saffron/20 border border-saffron/30 shrink-0 shadow-2xl relative z-10">
                    <AlertCircle size={48} className="text-saffron animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-2 relative z-10">
                    <h4 className="text-saffron font-black text-2xl tracking-tighter uppercase italic font-display">Docket Collision Detected</h4>
                    <p className="text-orange-200 text-lg font-medium leading-relaxed italic opacity-80">
                      This legislative shift impacts <span className="text-white font-black">{amendment.relevantCases.length}</span> active cases in your 1-on-1 docket.
                    </p>
                  </div>
                  <button className="px-10 py-6 rounded-full gradient-primary glow-saffron text-white font-black uppercase text-base tracking-tighter italic border-none shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-4 group/btn">
                     Recalibrate Case Strategy
                     <ChevronDown size={20} className="group-hover/btn:translate-y-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AmendmentTrackerPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 lg:px-12 py-10 max-w-7xl mx-auto space-y-20 mesh-gradient min-h-screen relative overflow-hidden">
      
      {/* Visual Ambiance */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-saffron/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none -ml-40 -mb-40" />

      {/* Header Intelligence System */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
        <div className="space-y-4">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[2rem] gradient-primary glow-saffron flex items-center justify-center shadow-2xl">
                 <Globe size={36} className="text-white" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none font-display">Legislative Pulse</h1>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_#06b6d4] animate-pulse" />
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em]">Autonomous Gazette Scraper Node v7.1</p>
           </div>
        </div>
        
        <div className="flex items-center gap-6 glass-diamond p-4 lg:p-6 rounded-[3rem] border-white/5 shadow-2xl backdrop-blur-[60px] bg-slate-900/30">
           <div className="text-right">
              <span className="text-india-green text-[9px] font-black uppercase tracking-[0.3em] block mb-1">Persistent Node Online</span>
              <p className="text-white font-black text-xs uppercase tracking-tight">Synced 4m ago</p>
           </div>
           <div className="flex items-center gap-4 pl-4 border-l border-white/5">
              <Search size={24} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
              <Filter size={24} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
           </div>
        </div>
      </div>

      {/* IPC → BNS Translation Core */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-diamond rounded-[4.5rem] p-12 lg:p-20 border-accent-purple/20 bg-accent-purple/5 relative overflow-hidden shadow-[0_30px_100px_rgba(124,58,237,0.15)] group">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-accent-purple/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
           <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-[3.5rem] glass-diamond flex items-center justify-center border-accent-purple/30 shadow-2xl relative shrink-0">
              <div className="absolute inset-0 bg-accent-purple/10 animate-pulse" />
              <GitCompare size={64} className="text-accent-purple animate-float" />
           </div>
           <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="px-4 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/30 inline-block text-[10px] font-black text-accent-purple uppercase tracking-[0.4em] italic font-display">Translation Core v2.0</div>
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.9] font-display">BNS Neural Protocol Deployment</h2>
              <p className="text-slate-400 text-lg lg:text-2xl font-medium leading-relaxed italic max-w-4xl opacity-80">
                July 1, 2024: IPC (1860) sunset. BNS (2023) initialized. NyayaMitra has autonomously mapped <span className="text-accent-purple font-black">500+ statutory shifts</span> across your document repository.
              </p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20 relative z-10">
          {[
            { from: 'IPC 302', to: 'BNS 103', label: 'Culpable Homicide' },
            { from: 'IPC 376', to: 'BNS 64', label: 'Sexual Assault' },
            { from: 'IPC 420', to: 'BNS 318', label: 'Cheat & Fraud' },
            { from: 'IPC 124A', to: 'BNS 152', label: 'National Integrity' },
          ].map(({ from, to, label }) => (
            <div key={label} className="p-8 rounded-[3rem] bg-[#030712] border border-white/10 shadow-xl group/map hover:scale-105 transition-all cursor-default">
               <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-center">{label}</div>
               <div className="flex items-center justify-center gap-4">
                  <div className="text-red-500/50 text-xl font-black line-through italic font-display">{from}</div>
                  <ChevronDown className="-rotate-90 text-slate-800" size={16} />
                  <div className="text-india-green text-3xl font-black italic font-display shadow-india-green/5 drop-shadow-lg">{to}</div>
               </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Legislative Ledger */}
      <div className="space-y-12 relative z-10">
        <div className="flex items-center justify-between px-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shadow-xl border border-white/5">
                 <Database size={20} className="text-slate-500" />
              </div>
              <h3 className="text-white font-black text-2xl lg:text-4xl italic tracking-tighter uppercase font-display leading-none">Gazette Ledger <span className="text-slate-700 ml-4">({SAMPLE_AMENDMENTS.length})</span></h3>
           </div>
           <p className="hidden lg:block text-slate-500 text-xs font-black uppercase tracking-[0.3em] font-sans">Persistent Source: egazette.gov.in</p>
        </div>
        <div className="space-y-10 pb-20">
          {SAMPLE_AMENDMENTS.map((a, i) => <AmendmentCard key={a.id} amendment={a} index={i} />)}
        </div>
      </div>

      {/* WhatsApp Intelligence Deployment */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="p-16 lg:p-24 rounded-[5rem] gradient-primary glow-saffron flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-[0_40px_100px_rgba(255,153,51,0.25)] group">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex-1 space-y-6 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
           <div className="flex items-center gap-4 scale-110 lg:scale-125 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-3xl shadow-2xl border border-white/30">
                 <span className="text-4xl">📱</span>
              </div>
              <h4 className="text-white font-black text-3xl lg:text-6xl tracking-tighter uppercase italic font-display leading-none">Instant Matrix Sync</h4>
           </div>
           <p className="text-white/80 text-lg lg:text-3xl font-medium leading-relaxed italic max-w-2xl opacity-80">
              Uplink your WhatsApp to our Neural Node for instant legislative triggers. Receive court-admissible updates within 120s of Gazette publication.
           </p>
        </div>
        <button className="px-12 py-8 rounded-full bg-slate-950 text-white font-black uppercase text-xl tracking-tighter italic border-none shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all relative z-10 group/sub">
           Deploy WhatsApp Uplink
           <motion.div className="h-0.5 bg-saffron mt-2 transform origin-left" animate={{ scaleX: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} />
        </button>
      </motion.div>
    </motion.div>
  )
}
