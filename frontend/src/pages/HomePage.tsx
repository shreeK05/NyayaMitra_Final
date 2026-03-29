import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import {
  Mic, FileSearch, FileText, Bell, Scale, Shield,
  TrendingUp, Clock, ChevronRight, Zap, Star,
  AlertCircle, CheckCircle2, ArrowRight, MessageSquare,
  Brain, Award, Phone, Info, LayoutGrid, Sparkles
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { LANGUAGES, SAMPLE_AMENDMENTS, SAMPLE_CASES, formatDate, daysUntil } from '@/utils'
import { cn } from '@/utils'
import { useState, useEffect } from 'react'

const QUICK_ACTIONS = [
  { id: 'counsellor', path: '/counsellor', icon: MessageSquare, label: 'Neural Counsel', sublabel: 'Type or Speak AI Advisory', color: '#ff9933', glow: 'rgba(255,153,51,0.5)', bg: 'rgba(255,153,51,0.1)' },
  { id: 'decoder', path: '/decoder', icon: FileSearch, label: 'Document Decoder', sublabel: 'AI-Audit Clause Risks', color: '#06b6d4', glow: 'rgba(6,182,212,0.5)', bg: 'rgba(6,182,212,0.1)' },
  { id: 'generator', path: '/generator', icon: FileText, label: 'Court Generator', sublabel: 'Ready Legal Drafting', color: '#7c3aed', glow: 'rgba(124,58,237,0.5)', bg: 'rgba(124,58,237,0.1)' },
  { id: 'amendments', path: '/amendments', icon: Bell, label: 'Gazette Feed', sublabel: 'Live Law Intelligence', color: '#10b981', glow: 'rgba(16,185,129,0.5)', bg: 'rgba(16,185,129,0.1)' },
  { id: 'cases', path: '/cases', icon: Scale, label: 'Legal Docket', sublabel: 'AI Case Tracking Engine', color: '#f59e0b', glow: 'rgba(245,158,11,0.5)', bg: 'rgba(245,158,11,0.1)' },
  { id: 'negotiate', path: '/negotiate', icon: Shield, label: 'Battle Coach', sublabel: 'AI Negotiation Training', color: '#ec4899', glow: 'rgba(236,72,153,0.5)', bg: 'rgba(236,72,153,0.1)' },
]

const STATS = [
  { value: '35+', label: 'AI Tools', icon: Zap, color: '#ff9933' },
  { value: '47+', label: 'Templates', icon: FileText, color: '#06b6d4' },
  { value: '1.4B', label: 'Citizens', icon: Scale, color: '#7c3aed' },
  { value: '22', label: 'Languages', icon: Star, color: '#10b981' },
]

const TICKER_ITEMS = [
  "⚖️ BNS v3.0 Deployment: Digital evidence protocols now live across 12 states.",
  "⚖️ Supreme Court Ruling: Privacy rights in digital transactions reaffirmed.",
  "⚖️ Gazette Alert: New Consumer Protection (E-commerce) Rules enforced Jan 2025.",
  "⚖️ Cyber Law: Mandatory 24h breach reporting for financial entities.",
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } } as const
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } } as const

// ── Interactive Tilt Card Component ──────────────────────────
function TiltCard({ children, className, style }: { children: React.ReactNode, className?: string, style?: any }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...style }}
      className={cn("perspective-1000", className)}
    >
      <div style={{ transform: "translateZ(40px)" }} className="h-full">{children}</div>
    </motion.div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { language, nyayaScore, user } = useAppStore()
  const lang = LANGUAGES[language]
  const latestAmendment = SAMPLE_AMENDMENTS[0]
  const activeCase = SAMPLE_CASES[0]
  const [tickerIndex, setTickerIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div variants={container} initial="hidden" animate="show"
      className="px-6 lg:px-12 py-6 lg:py-10 space-y-8 lg:space-y-12 max-w-7xl mx-auto w-full min-h-screen font-sans selection:bg-saffron/20"
    >
      {/* Dynamic News Ticker */}
      <motion.div variants={item} className="w-full h-10 rounded-[1.25rem] bg-orange-500/5 backdrop-blur-xl border border-orange-500/20 flex items-center px-6 gap-4 overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 shrink-0 border-r border-white/5 pr-4 mr-2">
          <div className="w-2 h-2 rounded-full bg-saffron animate-ping opacity-75" />
          <span className="text-[10px] font-black text-saffron uppercase tracking-[0.25em]">Gazette Live</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={tickerIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-[11px] lg:text-sm text-slate-300 font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {TICKER_ITEMS[tickerIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Hero Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-20">
        <motion.div variants={item} className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Citizen ID: 0047</div>
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-[#030712] bg-slate-800" />)}
                 <div className="w-6 h-6 rounded-full border-2 border-[#030712] bg-saffron flex items-center justify-center text-[10px] font-bold">+12</div>
               </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter font-display">
              Namaste, <span className="text-gradient-saffron text-glow-saffron">{user?.name?.split(' ')[0] || 'Citizen'}</span> <br />
              <div className="text-4xl lg:text-5xl text-slate-400 mt-2 font-black tracking-tight">Your Legal Pulse is <span className="text-india-green">Stable.</span></div>
            </h1>
          </div>
          <div className="flex flex-wrap gap-4">
             <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/2 border border-white/5 backdrop-blur-3xl group cursor-pointer hover:bg-white/5 transition-all">
                <Shield size={20} className="text-india-green group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">DPDP Compliant Platform</span>
             </div>
             <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/2 border border-white/5 backdrop-blur-3xl group cursor-pointer hover:bg-white/5 transition-all">
                <Star size={20} className="text-saffron group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Bharat AI Certified 🇮🇳</span>
             </div>
          </div>
        </motion.div>

        {/* Global Voice Command Button */}
        <motion.div variants={item} className="lg:w-[500px] shrink-0">
          <button
            onClick={() => navigate('/counsellor')}
            className="w-full relative group transition-all active:scale-95"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-saffron to-amber-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-60 transition duration-500" />
            <div className="relative h-28 lg:h-36 px-10 rounded-[3rem] bg-gradient-to-r from-saffron to-amber-600 flex items-center justify-between shadow-[0_20px_60px_rgba(255,153,51,0.4)] overflow-hidden">
               <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />
               <div className="flex items-center gap-6 lg:gap-10">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-3xl bg-white/20 flex items-center justify-center relative shadow-inner">
                     <div className="absolute inset-0 mic-ring rounded-3xl bg-white/40" />
                     <Mic size={32} className="text-white relative z-10 drop-shadow-lg" />
                  </div>
                  <div className="text-left">
                     <div className="text-white font-black text-xl lg:text-3xl tracking-tighter leading-tight font-display">Start Neural Counsel</div>
                     <p className="text-white/80 text-[10px] lg:text-sm font-black uppercase tracking-[0.1em] mt-1 lg:mt-2">Instant Legal Dialogue in 6 Languages</p>
                  </div>
               </div>
               <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/10 group-hover:bg-white/10 transition-colors">
                  <ArrowRight size={24} className="text-white transition-transform group-hover:translate-x-1" />
               </div>
            </div>
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        
        {/* Main Dashboard Panel */}
        <div className="lg:col-span-8 space-y-10 lg:space-y-16">
          
          {/* Performance Index Grid */}
          <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {STATS.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="p-6 lg:p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-3xl relative overflow-hidden group hover:border-white/10 transition-all hover-lift">
                 <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: color }} />
                 <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <Icon size={20} style={{ color }} className="font-black" />
                    <Sparkles size={12} className="text-slate-700" />
                 </div>
                 <div className="text-3xl lg:text-5xl font-black tracking-tighter text-white font-display mb-1">{value}</div>
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Capability Matrix */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-8 lg:mb-12">
               <div className="space-y-1">
                  <h2 className="text-4xl font-black text-white tracking-tighter font-display leading-none">Capability Matrix</h2>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Advanced Neural Legal Infrastructure</p>
               </div>
               <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <LayoutGrid size={20} />
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
              {QUICK_ACTIONS.map(({ id, path, icon: Icon, label, sublabel, color, glow, bg }) => (
                <TiltCard key={id} className="relative group cursor-pointer h-full">
                  <button onClick={() => navigate(path)}
                    className="w-full text-left p-8 rounded-[3rem] bg-slate-900/10 border border-white/5 hover:border-white/10 backdrop-blur-3xl flex flex-col gap-6 lg:gap-10 transition-all duration-500 h-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:-rotate-3 shadow-2xl relative z-10"
                      style={{ background: `${color}15`, border: `1px solid ${color}30`, boxShadow: `0 10px 40px -10px ${glow}` }}>
                      <Icon size={28} style={{ color }} className="font-black lg:w-10 lg:h-10" />
                    </div>
                    <div>
                      <div className="text-white text-lg lg:text-2xl font-black tracking-tighter leading-tight font-display">{label}</div>
                      <p className="text-slate-500 text-[11px] lg:text-sm font-bold tracking-tight mt-2 opacity-80">{sublabel}</p>
                    </div>
                    {/* Hover Glow */}
                    <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-10" style={{ background: `radial-gradient(circle at center, ${color}20, transparent)` }} />
                  </button>
                </TiltCard>
              ))}
            </div>
          </motion.div>

          {/* AI Score Index Section */}
          <motion.div variants={item}>
            <button
               onClick={() => navigate('/score')}
               className="w-full p-10 lg:p-20 rounded-[4rem] bg-slate-900/30 border border-white/10 backdrop-blur-3xl text-left group overflow-hidden relative"
            >
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[100px] rounded-full pointer-events-none" />
               <div className="flex flex-col lg:flex-row lg:items-center gap-14 lg:gap-24 relative z-10">
                  <div className="relative shrink-0 mx-auto">
                     <div className="absolute inset-0 blur-[50px] bg-accent-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                     <svg width="200" height="200" viewBox="0 0 100 100" className="lg:w-64 lg:h-64 filter drop-shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                        <motion.circle 
                          cx="50" cy="50" r="44" fill="none" stroke="url(#hpGrad)" strokeWidth="6"
                          strokeDasharray="276.4"
                          initial={{ strokeDashoffset: 276.4 }}
                          animate={{ strokeDashoffset: 276.4 - (276.4 * (nyayaScore || 74) / 100) }}
                          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                          strokeLinecap="round"
                          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                        />
                        <defs>
                          <linearGradient id="hpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#7c3aed" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                        <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="900" fill="white" className="font-display">{nyayaScore || 74}</text>
                     </svg>
                  </div>
                  <div className="flex-1 space-y-8">
                     <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-accent-purple/10 border border-accent-purple/20 rounded-md text-[10px] font-black text-accent-purple uppercase tracking-[0.2em]">NyayaScore™ Profile</div>
                        <div className="h-px flex-1 bg-white/5" />
                     </div>
                     <h3 className="text-5xl font-black text-white tracking-tighter font-display leading-[0.9]">Legal Protection Quotient</h3>
                     <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">Deep neural audit of your legal readiness. Your footprint is 14% more secure than the state average.</p>
                     
                     <div className="grid grid-cols-2 gap-8 pt-4">
                        {[
                          { label: "Contract Safety", pct: 85, color: "#10b981" },
                          { label: "Awareness", pct: 60, color: "#f59e0b" }
                        ].map(stat => (
                          <div key={stat.label} className="space-y-4">
                             <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-500">
                                <span>{stat.label}</span>
                                <span style={{ color: stat.color }}>{stat.pct}%</span>
                             </div>
                             <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }} 
                                  whileInView={{ width: `${stat.pct}%` }} 
                                  className="h-full rounded-full" 
                                  style={{ backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}40` }} 
                                />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </button>
          </motion.div>

        </div>

        {/* Intelligence Side Column */}
        <div className="lg:col-span-4 space-y-10 lg:space-y-14">
          
          {/* Gazette Intelligence */}
          <motion.div variants={item}>
             <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={20} className="text-india-green" />
                <h2 className="text-white font-black text-xl tracking-tighter uppercase font-display">Neural Gazette</h2>
             </div>
             <button
               onClick={() => navigate('/amendments')}
               className="w-full text-left p-8 rounded-[3rem] bg-slate-900/40 border border-white/5 backdrop-blur-3xl group hover:border-india-green/20 hover:scale-[1.02] transition-all relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-india-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded-md bg-india-green/10 text-[9px] font-black text-india-green border border-india-green/20 uppercase tracking-widest">Live Deployment</div>
                      <div className="text-[10px] text-slate-500 font-black tracking-tight">{formatDate(latestAmendment.gazetteDate)}</div>
                   </div>
                   <h3 className="text-2xl font-black text-white tracking-tighter font-display leading-tight">{latestAmendment.actName}</h3>
                   <p className="text-[13px] text-slate-400 font-medium leading-relaxed italic line-clamp-3">"{latestAmendment.diffSummary}"</p>
                   <div className="flex items-center gap-3 text-india-green font-black text-[10px] uppercase tracking-widest">
                      AI Reasoning Complete <ChevronRight size={14} />
                   </div>
                </div>
             </button>
          </motion.div>

          {/* Active Docket Summary */}
          <motion.div variants={item}>
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                   <LayoutGrid size={20} className="text-accent-cyan" />
                   <h2 className="text-white font-black text-xl tracking-tighter uppercase font-display">Live Docket</h2>
                </div>
                <button onClick={() => navigate('/cases')} className="text-accent-cyan text-[10px] font-black uppercase tracking-widest hover:underline">Full Docket →</button>
             </div>
             <button
               onClick={() => navigate('/cases')}
               className="w-full text-left p-8 rounded-[3rem] bg-slate-900/40 border border-white/5 backdrop-blur-3xl group hover:border-accent-cyan/20 hover:scale-[1.02] transition-all relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                         <Shield size={24} />
                      </div>
                      <div className="text-right">
                         <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Win Probability</div>
                         <div className="text-2xl font-black text-accent-cyan font-display">74.2%</div>
                      </div>
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-white tracking-tight line-clamp-1">{activeCase.title}</h4>
                      <p className="text-[11px] text-slate-500 font-bold uppercase mt-1">Status: Automated Tracking Active</p>
                   </div>
                   <div className="p-5 rounded-3xl bg-[#030712]/60 border border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                         <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Hearing Countdown</div>
                         <div className="text-white font-black text-xl tabular-nums">{daysUntil(activeCase.limitationDate || new Date())} Days</div>
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-accent-cyan/20 flex items-center justify-center p-1 relative">
                         <div className="w-full h-full rounded-full bg-accent-cyan/10 animate-pulse" />
                         <Clock size={14} className="text-accent-cyan absolute" />
                      </div>
                   </div>
                </div>
             </button>
          </motion.div>

          {/* Emergency SOS Center */}
          <motion.div variants={item} className="p-10 rounded-[4rem] bg-red-500/5 border border-red-500/10 space-y-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shadow-xl">
                   <Phone size={24} className="text-red-500 animate-pulse" />
                </div>
                <div>
                   <h5 className="text-red-500 font-black text-lg tracking-tighter uppercase font-display leading-none">Neural SOS</h5>
                   <p className="text-red-900/40 text-[9px] font-black uppercase tracking-widest">Authenticated Bharat Helplines</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Women', number: '181', color: '#ec4899' },
                 { label: 'Police', number: '100', color: '#ef4444' },
                 { label: 'Legal Aid', number: '1551', color: '#f59e0b' },
                 { label: 'Distress', number: '988', color: '#10b981' },
               ].map(sos => (
                 <a key={sos.label} href={`tel:${sos.number}`} className="p-5 rounded-[2.5rem] bg-slate-950/40 border border-white/5 flex flex-col items-center gap-3 group hover:border-red-500/20 transition-all active:scale-90">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 transition-transform group-hover:scale-110" style={{ color: sos.color }}>
                       <Phone size={20} />
                    </div>
                    <div className="text-center">
                       <div className="text-[10px] text-slate-600 font-black uppercase tracking-tighter mb-1">{sos.label}</div>
                       <div className="text-lg font-black text-white tabular-nums tracking-tighter">{sos.number}</div>
                    </div>
                 </a>
               ))}
             </div>
          </motion.div>

          {/* Platform Exit Terminal */}
          <motion.div variants={item}>
             <button
               onClick={() => { localStorage.clear(); window.location.href = '/' }}
               className="w-full p-6 rounded-[2.5rem] bg-white/2 border border-white/5 text-slate-700 hover:text-red-500 hover:bg-red-500/5 transition-all text-[11px] font-black uppercase tracking-[0.4em] italic flex items-center justify-center gap-4"
             >
                <Shield size={16} />
                Secure Terminal Logoff
             </button>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}
