import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  Scale, Shield, Mic, FileText, Search, Zap, ArrowRight,
  ChevronDown, MessageSquare, Globe, Target, Briefcase, 
  CheckCircle2, AlertTriangle, Fingerprint, Award,
  Sparkles, Bot, Clock, ChevronRight, ZapIcon, Scan, Star, PlayCircle,
  ShieldCheck, Landmark
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils'

const FEATURES = [
  {
    title: 'Neural Audio Matrix',
    desc: 'Voice-First AI session cross-referencing 50k+ Indian precedents in <1.2s.',
    icon: Mic,
    color: '#ff9933',
    link: '/counsellor'
  },
  {
    title: 'BNS Neural Audit',
    desc: 'Autonomous mapping of IPC(1860) to BNS(2023) across complex document sets.',
    icon: Scan,
    color: '#06b6d4',
    link: '/decoder'
  },
  {
    title: 'Strategy Ledger',
    desc: 'Real-time docket command with automated win-probability and filing alerts.',
    icon: Target,
    color: '#10b981',
    link: '/tracker'
  },
  {
    title: 'Contract Forge',
    desc: 'Zero-knowledge generation of court-admissible notices and petitions.',
    icon: FileText,
    color: '#7c3aed',
    link: '/generator'
  }
]

const STATS = [
  { label: 'Latency Node', value: '42ms', sub: 'Mumbai Edge' },
  { label: 'Neural Precision', value: '98.4%', sub: 'Precedent Match' },
  { label: 'Encrypted Proof', value: '256B', sub: 'AES-GCM' },
  { label: 'Admissibility', value: '99%', sub: 'High Court' },
]

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <div ref={containerRef} className="bg-[#030712] min-h-screen text-white overflow-hidden selection:bg-saffron/30 selection:text-white font-display">
      
      {/* Dynamic Background Matrix */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-saffron/5 blur-[180px] rounded-full -mr-80 -mt-80 animate-pulse" />
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent-purple/5 blur-[150px] rounded-full -ml-80 -mb-80" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-accent-cyan/2 blur-[200px] rounded-full opacity-40" />
         <div className="absolute inset-0 mesh-gradient opacity-40 mix-blend-overlay" />
      </div>

      {/* Hero Protocol */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 lg:px-12 text-center pt-24 z-10">
        <motion.div style={{ opacity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer">
           <ChevronDown size={40} className="text-slate-700" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="space-y-12 max-w-6xl">
           <div className="flex flex-col items-center gap-6">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="px-6 py-2 rounded-full glass-diamond border-white/10 text-[10px] lg:text-xs font-black uppercase tracking-[0.5em] text-slate-500 italic shadow-2xl flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-saffron shadow-[0_0_12px_#ff9933] animate-pulse" />
                 Neural Legal Infrastructure v9.4 Available
              </motion.div>
              <h1 className="text-7xl lg:text-[11rem] font-black tracking-tighter italic uppercase leading-[0.85] drop-shadow-2xl">
                Legal Jus<span className="text-saffron">t</span>ice <br />
                <span className="gradient-text gradient-primary">Redefined.</span>
              </h1>
           </div>

           <p className="text-lg lg:text-3xl font-medium text-slate-400 max-w-4xl mx-auto leading-relaxed italic opacity-80 font-sans tracking-tight">
              NyayaMitra is the world’s first <span className="text-white font-black">Neural Defense Node</span> for the Indian judicial system. Autonomous RAG sessions. Statutory 1-on-1 audits. Immediate legislative recourse.
           </p>

           <div className="flex flex-col lg:flex-row items-center justify-center gap-8 pt-6">
              <Link to="/counsellor">
                 <button className="h-24 px-14 rounded-full gradient-primary glow-saffron text-white font-black text-2xl lg:text-3xl tracking-tighter italic uppercase border-none shadow-[0_30px_100px_rgba(255,153,51,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center gap-6 group">
                   Initialize Defense Session
                   <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
                 </button>
              </Link>
              <button className="h-24 px-12 rounded-full glass-diamond border-white/10 text-white font-black text-xl lg:text-2xl tracking-tighter italic uppercase flex items-center gap-4 hover:bg-white/5 transition-all group shadow-2xl">
                 <PlayCircle size={32} className="text-slate-600 group-hover:text-white transition-colors" />
                 Neural Demo
              </button>
           </div>
        </motion.div>

        {/* Floating Matrix Elements */}
        <motion.div style={{ y: y1 }} className="absolute right-[5%] top-[20%] w-64 h-64 glass-diamond rounded-[3.5rem] p-8 border-accent-purple/20 bg-accent-purple/5 shadow-2xl hidden lg:block rotate-12 opacity-40">
           <div className="flex items-center gap-3 mb-6">
              <Fingerprint size={20} className="text-accent-purple" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">ID_HASH_PROOF</span>
           </div>
           <div className="h-2 bg-accent-purple/10 rounded-full w-3/4 mb-3" />
           <div className="h-2 bg-accent-purple/10 rounded-full w-full mb-3" />
           <div className="h-2 bg-accent-purple/10 rounded-full w-1/2" />
        </motion.div>

        <motion.div style={{ y: y2 }} className="absolute left-[5%] bottom-[15%] w-72 h-72 glass-diamond rounded-[3.5rem] p-10 border-accent-cyan/20 bg-accent-cyan/5 shadow-2xl hidden lg:block -rotate-12 opacity-40">
           <div className="w-16 h-16 rounded-[1.5rem] bg-accent-cyan/20 flex items-center justify-center mb-8">
              <Scan size={36} className="text-accent-cyan" />
           </div>
           <p className="text-white font-black text-xl italic tracking-tighter uppercase leading-none mb-3">Neural Ingest</p>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Actively Mapping BNS v1.4</p>
        </motion.div>
      </section>

      {/* Stats Matrix */}
      <section className="py-32 relative z-10 border-y border-white/5 bg-[#030712]/40 backdrop-blur-3xl">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
               {STATS.map((s, i) => (
                 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={s.label} className="text-center lg:text-left space-y-2">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic mb-4">{s.label}</div>
                    <div className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter leading-none drop-shadow-xl">{s.value}</div>
                    <div className="text-[10px] font-black text-saffron uppercase tracking-[0.2em] italic flex items-center justify-center lg:justify-start gap-2">
                       <Zap size={10} className="animate-pulse" />
                       {s.sub}
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* App Ecosystem Hub */}
      <section className="py-48 relative z-10">
         <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-32">
            <div className="text-center space-y-6">
               <h2 className="text-6xl lg:text-[7rem] font-black text-white tracking-tighter italic uppercase leading-none font-display">Neural Core Suite</h2>
               <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] w-24 bg-slate-800" />
                  <p className="text-slate-500 text-xs lg:text-sm font-black uppercase tracking-[0.5em] italic">Deploy Tactical Legal Units</p>
                  <div className="h-[1px] w-24 bg-slate-800" />
               </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
               {FEATURES.map((f, i) => (
                 <motion.div 
                    key={f.title} 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ translateY: -10 }}
                    className="p-12 lg:p-16 rounded-[5rem] glass-diamond border-white/5 flex flex-col justify-between group relative overflow-hidden h-[500px] shadow-2xl"
                 >
                    <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-10 transition-all scale-[3] rotate-12">
                       <f.icon size={128} style={{ color: f.color }} />
                    </div>
                    <div className="space-y-8 relative z-10">
                       <div className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden" style={{ background: `${f.color}15` }}>
                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <f.icon size={44} style={{ color: f.color }} className="relative z-10" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase font-display leading-none">{f.title}</h3>
                          <p className="text-slate-400 text-lg lg:text-2xl font-medium leading-relaxed italic opacity-80">{f.desc}</p>
                       </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between pt-12 border-t border-white/5">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Procedural Rank: S-Tier</span>
                       </div>
                       <Link to={f.link}>
                          <button className="w-16 h-16 rounded-full glass-card border-white/10 flex items-center justify-center group-hover:border-saffron/40 group-hover:bg-saffron/10 transition-all group shadow-xl">
                             <ChevronRight size={32} className="text-slate-700 group-hover:text-saffron transition-colors group-hover:translate-x-1" />
                          </button>
                       </Link>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Global Defense CTA */}
      <section className="py-48 px-6 lg:px-12 relative z-10">
         <motion.div whileInView={{ scale: [0.95, 1] }} className="max-w-6xl mx-auto p-20 lg:p-32 rounded-[6rem] gradient-primary glow-saffron text-center space-y-12 relative overflow-hidden shadow-[0_50px_150px_rgba(255,153,51,0.25)] group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full" />
            
            <div className="space-y-6 relative z-10">
               <h2 className="text-6xl lg:text-[9rem] font-black text-white tracking-tighter leading-[0.85] italic font-display uppercase drop-shadow-2xl">
                  Forge Your <br />
                  <span className="text-black/40">Shield.</span>
               </h2>
               <p className="text-white/80 text-xl lg:text-3xl font-medium max-w-3xl mx-auto italic leading-relaxed font-sans mt-8">
                  Deployment is instantaneous. Security is cryptographic. Justice is now algorithmic.
               </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 relative z-10 pt-10">
               <Link to="/counsellor">
                  <button className="h-28 px-16 rounded-full bg-slate-950 text-white font-black text-2xl lg:text-4xl tracking-tighter italic uppercase border-none shadow-[0_30px_100px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all flex items-center gap-8 group/btn">
                     Join Defense Network
                     <ArrowRight size={40} className="group-hover/btn:translate-x-3 transition-transform" />
                  </button>
               </Link>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-10 opacity-40 relative z-10">
               {[Award, ShieldCheck, Scale, Landmark].map((Icon, i) => (
                 <Icon key={i} size={40} className="text-white grayscale brightness-200" />
               ))}
            </div>
         </motion.div>
      </section>

      <footer className="py-24 border-t border-white/5 bg-[#030712]/80 relative z-10">
         <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-xl">
                  <Scale size={24} className="text-white" />
               </div>
               <span className="text-2xl font-black italic tracking-tighter uppercase font-display">NyayaMitra<span className="text-saffron">.</span></span>
            </div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
               <span className="hover:text-white cursor-pointer transition-colors">Neural Policy</span>
               <span className="hover:text-white cursor-pointer transition-colors">Encryption Audit</span>
               <span className="hover:text-white cursor-pointer transition-colors">Uptime Ledger</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-india-green shadow-[0_0_8px_green] animate-pulse" />
               <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">Node Status: Persistent</span>
            </div>
         </div>
         <p className="text-center text-slate-800 text-[11px] font-black uppercase tracking-[1em] mt-24 italic">Automated Justice System 2024</p>
      </footer>
    </div>
  )
}
