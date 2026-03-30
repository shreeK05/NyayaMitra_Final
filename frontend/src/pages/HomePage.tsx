import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, FileSearch, FileText, Bell, Scale, Shield,
  TrendingUp, Clock, ChevronRight, Zap, Star,
  AlertCircle, CheckCircle2, ArrowRight, MessageSquare,
  Brain, Award, Phone, Info, LayoutGrid, Sparkles, ShieldCheck,
  ZapOff, Activity, Gavel, Handshake, Search, ArrowUpRight,
  Radar, History
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { LANGUAGES, SAMPLE_AMENDMENTS, SAMPLE_CASES, formatDate, daysUntil } from '@/utils'
import { useState, useEffect } from 'react'

const PILLARS = [
  { id: 'counsellor', path: '/counsellor', icon: Mic, label: 'Voice Counsellor', sublabel: 'Instant Advisory', color: 'var(--saffron)' },
  { id: 'decoder', path: '/decoder', icon: Zap, label: 'Document Audit', sublabel: 'Clause Risk Scanning', color: 'var(--indigo)' },
  { id: 'generator', path: '/generator', icon: FileText, label: 'Contract Forge', sublabel: 'Legal Drafting Studio', color: 'var(--emerald)' },
  { id: 'tracker', path: '/tracker', icon: Target, label: 'Docket Control', sublabel: 'Live Case Intelligence', color: 'var(--gold)' },
  { id: 'score', path: '/score', icon: Activity, label: 'NyayaScore', sublabel: 'Legal Health Matrix', color: 'var(--saffron)' },
  { id: 'amendments', path: '/amendments', icon: History, label: 'Gazette Ledger', sublabel: 'Statutory Transitions', color: 'var(--indigo)' },
  { id: 'negotiate', path: '/negotiate', icon: MessageSquare, label: 'Sparring Coach', sublabel: 'Conflict Simulation', color: 'var(--emerald)' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { language, nyayaScore, user } = useAppStore()
  const latestAmendment = SAMPLE_AMENDMENTS[0]
  const activeCase = SAMPLE_CASES[0]

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-saffron/30">
      
      {/* 🌌 Background Ambiance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-saffron/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo/5 blur-[150px] rounded-full" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center shadow-lg shadow-saffron/20 border-glow">
                 <Scale size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter font-display">NyayaMitra<span className="text-saffron">.</span></h1>
           </div>
           <div className="flex items-center gap-5">
              <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald/10 border border-emerald/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-emerald">Legal Lattice Online</span>
              </div>
              <button className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center">
                 <Bell size={18} className="text-slate-500" />
              </button>
              <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Profile" className="w-full h-full p-1 opacity-60" />
              </div>
           </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 max-w-7xl pt-32 pb-40">
        
        {/* Welcome Section */}
        <section className="mb-20">
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-5xl lg:text-8xl font-black italic uppercase tracking-tighter font-display leading-[0.8] mb-6">
                Namaste, <span className="text-gradient-saffron">{user?.name?.split(' ')[0] || 'Citizen'}</span>
              </h2>
              <p className="text-slate-500 text-lg lg:text-2xl font-medium italic opacity-70 max-w-2xl leading-tight">
                 Your legal command center is synchronized. Current protection status: <span className="text-white font-black">HIGH INTEGRITY.</span>
              </p>
           </motion.div>
        </section>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Main Dashboard */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* NyayaScore High-Impact Card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
               <button 
                onClick={() => navigate('/score')}
                className="w-full glass-card p-12 rounded-[4rem] text-left relative overflow-hidden group border-glow"
               >
                  <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                     <Radar size={240} className="text-indigo" />
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                     <div className="w-48 h-48 rounded-[3.5rem] bg-black/40 border border-white/10 flex flex-col items-center justify-center relative shadow-inner overflow-hidden">
                        <div className="absolute inset-0 bg-indigo/10 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Grade Index</span>
                        <div className="text-7xl font-black italic tracking-tighter text-white font-display leading-none">{nyayaScore || 72}</div>
                        <div className="mt-4 px-3 py-1 rounded-lg bg-indigo/20 border border-indigo/40 text-indigo text-[9px] font-black uppercase tracking-widest leading-none">Safe</div>
                     </div>
                     <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                           <Activity size={16} className="text-saffron" />
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Neural Vitality Matrix</span>
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter font-display text-white">NyayaScore Profile</h3>
                        <p className="text-slate-400 text-lg font-medium italic opacity-70 max-w-md leading-snug">
                           Your legal footprint is currently optimized. Periodic audits maintain your immunity scores.
                        </p>
                        <div className="flex items-center gap-3 text-saffron font-black text-sm uppercase tracking-widest mt-8 group-hover:gap-5 transition-all">
                           Initialize Detailed Audit <ArrowRight size={18} />
                        </div>
                     </div>
                  </div>
               </button>
            </motion.div>

            {/* Neural Lattice (Pillars Grid) */}
            <div className="space-y-10">
               <div className="flex items-center gap-6 px-4">
                  <LayoutGrid size={24} className="text-slate-700" />
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter font-display text-white">The Neural Lattice</h3>
                  <div className="h-px bg-white/5 flex-1" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {PILLARS.filter(p => !['score'].includes(p.id)).map((p, i) => (
                    <motion.button 
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(p.path)}
                      className="glass-card p-10 rounded-[3rem] text-left border-glow group hover:bg-white/2 transition-all relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-all transform scale-150 rotate-12 pointer-events-none">
                          <p.icon size={80} style={{ color: p.color }} />
                       </div>
                       <div className="w-16 h-16 rounded-[1.75rem] flex items-center justify-center mb-8 border transition-all group-hover:scale-110 shadow-2xl" 
                         style={{ background: `${p.color}10`, borderColor: `${p.color}20`, color: p.color }}>
                          <p.icon size={32} />
                       </div>
                       <div>
                          <h4 className="text-2xl font-black italic uppercase tracking-tighter font-display text-white mb-2">{p.label}</h4>
                          <p className="text-slate-500 font-medium italic text-sm">{p.sublabel}</p>
                       </div>
                       <div className="mt-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-700 opacity-0 group-hover:opacity-100 transition-all">
                          Link Established <ArrowRight size={12} />
                       </div>
                    </motion.button>
                  ))}
               </div>
            </div>
          </div>

          {/* Intel & SOS Panel */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Live Case Card */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-4">Live Mission Status</h4>
               <div className="p-10 rounded-[3rem] glass-card border-l-4 border-l-indigo relative overflow-hidden group border-glow">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <Gavel size={64} className="text-indigo" />
                  </div>
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_var(--emerald)] animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald">Tracking Active</span>
                     </div>
                     <div>
                        <h5 className="text-2xl font-black italic uppercase tracking-tighter font-display mb-1">{activeCase.title}</h5>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">CNR: {activeCase.cnrNumber || 'MH-PN-0021'}</p>
                     </div>
                     <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                        <div className="px-3 py-1 rounded bg-indigo/10 border border-indigo/20 text-indigo text-[9px] font-black uppercase tracking-widest">Next Hearing</div>
                        <span className="text-sm font-black italic text-white uppercase tracking-widest">{formatDate(activeCase.limitationDate || new Date())}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Gazette Alert Card */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-4">Gazette Surveillance</h4>
               <button onClick={() => navigate('/amendments')} className="w-full p-8 rounded-[2.5rem] bg-indigo/5 border border-indigo/20 text-left group hover:bg-indigo/10 transition-all border-glow">
                  <div className="text-[9px] font-black text-indigo uppercase tracking-widest mb-4">Latest Statutory Move</div>
                  <h6 className="font-black italic uppercase tracking-tighter font-display text-lg mb-2 text-white">{latestAmendment.actName}</h6>
                  <p className="text-xs text-slate-500 italic line-clamp-2 mb-4 leading-relaxed opacity-70">"{latestAmendment.diffSummary}"</p>
                  <div className="flex items-center gap-2 text-[9px] font-black text-indigo uppercase tracking-widest">
                     Uplink Ledger <ArrowUpRight size={14} />
                  </div>
               </button>
            </div>

            {/* SOS Grid */}
            <div className="p-10 rounded-[3.5rem] glass-card border-red-500/10 space-y-8 border-glow relative overflow-hidden">
               <div className="absolute inset-0 bg-red-500/2" />
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-xl">
                     <Phone size={20} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mb-1">Defense SOS</h5>
                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">Verified BNS Protocols</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 relative z-10">
                 {[
                   { l: 'Women', n: '181' },
                   { l: 'Police', n: '100' },
                   { l: 'Legal', n: '1551' },
                   { l: 'BNS', n: '112' }
                 ].map(sos => (
                   <a key={sos.l} href={`tel:${sos.n}`} className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center group hover:border-red-500/40 transition-all active:scale-95">
                     <div className="text-[8px] text-slate-700 font-black uppercase tracking-widest mb-1 opacity-50 group-hover:opacity-100">{sos.l}</div>
                     <div className="text-xl font-black text-white italic font-display">{sos.n}</div>
                   </a>
                 ))}
               </div>
            </div>

            {/* Session Actions */}
            <div className="space-y-4">
               <button 
                onClick={() => { localStorage.clear(); navigate('/') }}
                className="w-full py-5 rounded-[2rem] bg-white/2 border border-white/5 text-slate-700 hover:text-red-500 hover:bg-red-500/5 transition-all text-[9px] font-black uppercase tracking-[0.3em] italic flex items-center justify-center gap-3"
               >
                  <ShieldCheck size={14} />
                  Terminate Neural Session
               </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
