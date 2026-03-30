import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, FileSearch, FileText, Bell, Scale, Shield,
  TrendingUp, Clock, ChevronRight, Zap, Star,
  AlertCircle, CheckCircle2, ArrowRight, MessageSquare,
  Brain, Award, Phone, Info, LayoutGrid, Sparkles, ShieldCheck,
  ZapOff, Activity, Gavel, Handshake, Search, ArrowUpRight,
  Radar, History, Target, Landmark, Fingerprint, Lock, Bot
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { LANGUAGES, SAMPLE_AMENDMENTS, SAMPLE_CASES, formatDate, daysUntil, cn } from '@/utils'
import { useState, useEffect } from 'react'

const PILLARS = [
  { id: 'counsellor', path: '/counsellor', icon: Mic, label: 'Voice Counsel', sublabel: 'Statutory Advisory', color: 'var(--saffron)' },
  { id: 'decoder', path: '/decoder', icon: Zap, label: 'Doc Decoder', sublabel: 'Audit & Scanning', color: 'var(--indigo)' },
  { id: 'generator', path: '/generator', icon: FileText, label: 'Doc Foundry', sublabel: 'Drafting Protocol', color: 'var(--emerald)' },
  { id: 'tracker', path: '/tracker', icon: Target, label: 'Docket Control', sublabel: 'eCourts Intelligence', color: 'var(--gold)' },
  { id: 'score', path: '/score', icon: Activity, label: 'NyayaScore', sublabel: 'Vitality Audit', color: 'var(--saffron)' },
  { id: 'amendments', path: '/amendments', icon: History, label: 'Law Timeline', sublabel: 'Gazette Surveillance', color: 'var(--indigo)' },
  { id: 'negotiate', path: '/negotiate', icon: MessageSquare, label: 'Coach Matrix', sublabel: 'Conflict Simulation', color: 'var(--emerald)' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { language, nyayaScore, user } = useAppStore()
  const latestAmendment = SAMPLE_AMENDMENTS[0]
  const activeCase = SAMPLE_CASES[0]

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-saffron/30">
      
      {/* 🌌 Atmospheric Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-saffron/5 blur-[250px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-indigo/5 blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      {/* 🧭 Strategic Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-nav border-b border-white/5 bg-[#030712]/80 backdrop-blur-3xl">
        <div className="container mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl gradient-saffron flex items-center justify-center shadow-2xl shadow-saffron/20 group hover:rotate-12 transition-transform duration-500 border-glow">
                 <Scale size={24} className="text-white" />
              </div>
              <div className="flex flex-col">
                 <h1 className="text-2xl font-black italic uppercase tracking-tighter font-display leading-none text-white">NyayaMitra</h1>
                 <p className="text-[9px] text-saffron font-black uppercase tracking-[0.4em] mt-1">Neural_Justice_Node_v4.3</p>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="hidden lg:flex items-center gap-4 px-6 py-2 rounded-full bg-emerald/10 border border-emerald/20 shadow-xl">
                 <div className="w-2 h-2 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_#10b981]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald italic">System Integrity: Nominal</span>
              </div>
              <div className="flex items-center gap-4">
                 <button className="w-12 h-12 rounded-2xl glass-card border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all hover:scale-105">
                    <Bell size={20} />
                 </button>
                 <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-black/40 shadow-2xl">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Profile" className="w-full h-full p-1 opacity-60 hover:opacity-100 transition-opacity" />
                 </div>
              </div>
           </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 lg:px-12 max-w-7xl pt-40 pb-40">
        
        {/* Welcome Identity Section */}
        <section className="mb-32 relative text-center lg:text-left">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-600 font-black text-[10px] uppercase tracking-[0.5em] italic">Citizen_Protocol_Active</div>
              <h2 className="text-7xl lg:text-[10rem] font-black italic uppercase tracking-tighter font-display leading-[0.7] mb-8 text-white select-none">
                Namaste, <span className="text-glow-saffron text-gradient-saffron">{user?.name?.split(' ')[0] || 'Citizen'}</span>
              </h2>
              <p className="text-slate-500 text-2xl lg:text-3xl font-medium italic opacity-70 max-w-4xl leading-tight font-neural">
                 Defense Lattice Synchronized. Status: <span className="text-white font-black underline decoration-saffron/40">HIGH COVERAGE</span>
              </p>
           </motion.div>
        </section>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Main Strategic Dashboard */}
          <div className="lg:col-span-8 space-y-32">
            
            {/* NyayaScore Identity Card (Centered Hero) */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 1 }}>
               <button 
                onClick={() => navigate('/score')}
                className="w-full glass-card p-16 lg:p-20 rounded-[5rem] text-left relative overflow-hidden group border-glow shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-black/40"
               >
                  <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none group-hover:scale-125 group-hover:rotate-12 transition-transform duration-1000">
                     <Radar size={500} className="text-indigo" />
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                     <div className="relative group/score">
                        <div className="absolute inset-0 bg-indigo/20 blur-[100px] rounded-full group-hover/score:bg-indigo/40 transition-all" />
                        <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-[4rem] bg-black/80 border-2 border-white/5 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden group-hover:border-indigo/30 transition-all font-display italic">
                           <div className="absolute inset-0 bg-indigo/5 animate-neural-pulse" />
                           <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-800 mb-4 opacity-60">Neural_Index</span>
                           <div className="text-[9rem] font-black italic tracking-tighter text-white leading-none text-glow-indigo">{nyayaScore || 72}</div>
                           <div className="mt-6 px-5 py-2 rounded-xl bg-indigo text-white text-[10px] font-black uppercase tracking-[0.2em] leading-none shadow-xl shadow-indigo/20">STABLE_SECURE</div>
                        </div>
                     </div>
                     <div className="space-y-8 flex-1 text-center md:text-left">
                        <div className="flex items-center gap-5 md:justify-start justify-center">
                           <Activity size={20} className="text-saffron shadow-[0_0_10px_#ff9933] animate-pulse" />
                           <span className="text-[11px] font-black text-slate-700 uppercase tracking-[0.8em] leading-none italic">Legal_Vitality_Matrix</span>
                        </div>
                        <h3 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter font-display text-white leading-[0.8] mb-4">Protection Identity Profile</h3>
                        <p className="text-slate-500 text-xl lg:text-2xl font-medium italic opacity-80 max-w-xl leading-snug">
                           Your statutory footprint is currently <span className="text-white">72% Optimized</span>. System detected minor coverage gaps in Tenancy protocols.
                        </p>
                        <div className="flex items-center gap-4 text-saffron font-black text-xs uppercase tracking-[0.5em] mt-12 group-hover:translate-x-6 transition-all duration-700 italic border-b border-saffron/20 pb-4 inline-block">
                           INITIALIZE DEEP AUDIT <ArrowRight size={24} />
                        </div>
                     </div>
                  </div>
               </button>
            </motion.div>

            {/* Pillar Grid (The Neural Lattice) */}
            <div className="space-y-16">
               <div className="flex items-center gap-8 px-8">
                  <LayoutGrid size={32} className="text-slate-800" />
                  <h3 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter font-display text-white leading-none italic">The Neural Lattice</h3>
                  <div className="h-px bg-white/5 flex-1 opacity-20" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {PILLARS.filter(p => !['score'].includes(p.id)).map((p, i) => (
                    <motion.button 
                      key={p.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      onClick={() => navigate(p.path)}
                      className="glass-card p-12 lg:p-14 rounded-[4rem] text-left border-glow group hover:bg-white/2 transition-all relative overflow-hidden bg-black/40 shadow-2xl h-[420px] flex flex-col justify-between"
                    >
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.12] transition-all transform scale-150 rotate-12 pointer-events-none duration-700">
                          <p.icon size={250} style={{ color: p.color }} />
                       </div>
                       <div className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-12 border-2 transition-all group-hover:scale-110 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden" 
                         style={{ background: `${p.color}10`, borderColor: `${p.color}30`, color: p.color }}>
                          <div className="absolute inset-0 bg-white/5" />
                          <p.icon size={36} className="relative z-10" />
                       </div>
                       <div className="space-y-4 relative z-10">
                          <h4 className="text-4xl font-black italic uppercase tracking-tighter font-display text-white leading-none italic group-hover:text-glow-saffron transition-all font-neural">{p.label}</h4>
                          <p className="text-xl text-slate-500 font-medium italic leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{p.sublabel}</p>
                       </div>
                       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-slate-800 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-4 duration-700">
                          UPLINK_ESTABLISHED <ArrowRight size={16} />
                       </div>
                    </motion.button>
                  ))}
               </div>
            </div>
          </div>

          {/* Tactical Intelligence & Surveillance Panel */}
          <div className="lg:col-span-4 space-y-16">
            
            {/* Live Case Intelligence */}
            <div className="space-y-8">
               <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.6em] px-8 italic">Mission_Control</h4>
               <div className="p-12 rounded-[4rem] glass-card border-l-[12px] border-l-indigo relative overflow-hidden group border-glow bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-45 transition-transform duration-1000">
                     <Gavel size={120} className="text-indigo" />
                  </div>
                  <div className="relative z-10 space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-emerald shadow-[0_0_12px_#10b981] animate-neural-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald italic">eCourts_Feed_Active</span>
                     </div>
                     <div className="space-y-3">
                        <h5 className="text-4xl font-black italic uppercase tracking-tighter font-display leading-[0.9] text-white italic">{activeCase.title}</h5>
                        <div className="inline-block px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-700 text-[10px] font-black uppercase tracking-widest italic leading-none font-display">CNR: {activeCase.cnrNumber || 'MH-PN-0021-0x'}</div>
                     </div>
                     <div className="h-px w-full bg-white/5" />
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest block opacity-60">Status_Node</span>
                           <span className="text-white font-black text-xl italic uppercase tracking-tighter font-display">Conciliation</span>
                        </div>
                        <div className="text-right space-y-1">
                           <span className="text-[9px] font-black text-indigo uppercase tracking-widest block opacity-60">Est_Closure</span>
                           <span className="text-indigo font-black text-xl italic font-display">JUL 2024</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Gazette Alert Node */}
            <div className="space-y-8">
               <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.6em] px-8 italic">Gazette_Feed</h4>
               <button onClick={() => navigate('/amendments')} className="w-full p-12 rounded-[4rem] bg-indigo/5 border border-indigo/30 text-left group hover:bg-indigo/10 transition-all border-glow relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-indigo/1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-indigo/20 border border-indigo/40 text-[10px] font-black text-indigo uppercase tracking-widest italic mb-6">Latest Statutory Move</div>
                  <h6 className="font-black italic uppercase tracking-tighter font-display text-2xl lg:text-3xl mb-4 text-white italic leading-tight group-hover:translate-x-2 transition-transform duration-500">{latestAmendment.actName}</h6>
                  <p className="text-lg text-slate-500 font-medium italic line-clamp-3 mb-8 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">"{latestAmendment.diffSummary}"</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                     <span className="text-[10px] font-black text-indigo uppercase tracking-[0.3em] font-display">SYNC_LEDGER_NODE</span>
                     <ArrowUpRight size={24} className="text-indigo group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500" />
                  </div>
               </button>
            </div>

            {/* SOS Safety Grid */}
            <div className="p-12 rounded-[5rem] glass-card border-red-500/20 space-y-10 border-glow relative overflow-hidden shadow-[0_40px_100px_rgba(239,68,68,0.1)] bg-black/60 group">
               <div className="absolute inset-0 bg-red-500/2 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-[2rem] bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-500 shadow-2xl animate-float">
                     <Phone size={32} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-black text-red-500 uppercase tracking-[0.5em] leading-none mb-1 italic">Defense SOS Matrix</h5>
                    <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] italic">Statutory Red-Link Active</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6 relative z-10">
                 {[
                   { l: 'Women', n: '181', c: 'text-red-400' },
                   { l: 'Police', n: '100', c: 'text-white' },
                   { l: 'Legal Aid', n: '1551', c: 'text-indigo' },
                   { l: 'BNS Link', n: '112', c: 'text-emerald' }
                 ].map(sos => (
                   <a key={sos.l} href={`tel:${sos.n}`} className="p-6 rounded-[2.5rem] bg-black/80 border border-white/5 text-center group/sos hover:border-red-500/40 transition-all active:scale-95 shadow-2xl">
                     <div className="text-[9px] text-slate-800 font-black uppercase tracking-[0.2em] mb-2 opacity-50 group-hover/sos:opacity-100 italic">{sos.l}</div>
                     <div className={cn("text-3xl font-black italic font-display italic", sos.c)}>{sos.n}</div>
                   </a>
                 ))}
               </div>
            </div>

            {/* Neural Control Actions */}
            <div className="space-y-6">
               <button 
                onClick={() => { localStorage.clear(); navigate('/') }}
                className="w-full py-8 rounded-[3rem] glass-card border border-white/5 text-slate-800 hover:text-red-500 hover:bg-red-500/5 transition-all text-[11px] font-black uppercase tracking-[0.5em] italic flex items-center justify-center gap-6 group shadow-xl"
               >
                  <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" />
                  TERMINATE NEURAL SESSION
               </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
