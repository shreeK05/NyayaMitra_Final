import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import {
  Mic, FileSearch, FileText, Bell, Scale, Shield,
  TrendingUp, Clock, ChevronRight, Zap, Star,
  AlertCircle, CheckCircle2, ArrowRight, MessageSquare,
  Brain, Award, Phone, Info
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { LANGUAGES, SAMPLE_AMENDMENTS, SAMPLE_CASES, formatDate, daysUntil } from '@/utils'
import { cn } from '@/utils'
import { useState, useEffect } from 'react'

const QUICK_ACTIONS = [
  { id: 'counsellor', path: '/counsellor', icon: MessageSquare, label: 'Ask NyayaMitra', sublabel: 'Type or Speak AI', color: '#ff9933', glow: 'rgba(255,153,51,0.45)', bg: 'rgba(255,153,51,0.12)' },
  { id: 'decoder', path: '/decoder', icon: FileSearch, label: 'Decode Document', sublabel: 'AI-Audit PDF/Text', color: '#06b6d4', glow: 'rgba(6,182,212,0.45)', bg: 'rgba(6,182,212,0.12)' },
  { id: 'generator', path: '/generator', icon: FileText, label: 'Draft Notice', sublabel: 'Court-Ready Forms', color: '#7c3aed', glow: 'rgba(124,58,237,0.45)', bg: 'rgba(124,58,237,0.12)' },
  { id: 'amendments', path: '/amendments', icon: Bell, label: 'Law Updates', sublabel: 'Live Gazette Feed', color: '#10b981', glow: 'rgba(16,185,129,0.45)', bg: 'rgba(16,185,129,0.12)' },
  { id: 'cases', path: '/cases', icon: Scale, label: 'My Cases', sublabel: 'AI Win-Probability', color: '#f59e0b', glow: 'rgba(245,158,11,0.45)', bg: 'rgba(245,158,11,0.12)' },
  { id: 'negotiate', path: '/negotiate', icon: Shield, label: 'Negotiation', sublabel: 'AI Battle Coach', color: '#ec4899', glow: 'rgba(236,72,153,0.45)', bg: 'rgba(236,72,153,0.12)' },
]

const STATS = [
  { value: '35+', label: 'AI Features', icon: Zap, color: '#ff9933' },
  { value: '47+', label: 'Templates', icon: FileText, color: '#06b6d4' },
  { value: '12', label: 'Domains', icon: Scale, color: '#7c3aed' },
  { value: '6', label: 'Languages', icon: Star, color: '#10b981' },
]

const TICKER_ITEMS = [
  "⚖️ BNS Update: New sections for digital evidence now active.",
  "⚖️ Consumer Protection: E-commerce liability rules amended.",
  "⚖️ NyayaMitra AI: Voice distress detection now 15% more accurate.",
  "⚖️ RTI Alert: Online portal downtime scheduled for Sunday.",
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }

// ── Interactive Tilt Card Component ──────────────────────────
function TiltCard({ children, className, style }: { children: React.ReactNode, className?: string, style?: any }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

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
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
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
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div variants={container} initial="hidden" animate="show"
      className="px-4 lg:px-8 py-4 lg:py-6 space-y-6 lg:space-y-8 max-w-lg lg:max-w-7xl mx-auto w-full mesh-gradient min-h-screen"
    >
      {/* Live News Ticker */}
      <motion.div variants={item} className="w-full h-8 glass-diamond rounded-full flex items-center px-4 gap-3 overflow-hidden border-orange-500/20 shadow-[0_0_20px_rgba(255,153,51,0.1)]">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">LIVE JUSTICE</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={tickerIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-[10px] lg:text-xs text-slate-300 font-medium whitespace-nowrap"
          >
            {TICKER_ITEMS[tickerIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Top Section: Greeting & Hero CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-saffron/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Greeting */}
        <motion.div variants={item} className="flex-1 space-y-4 relative">
          <div className="flex items-center justify-between lg:justify-start lg:gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm lg:text-base font-medium">🇮🇳 Namaste,</span>
                <span className="text-orange-400 text-sm lg:text-base font-bold">{user?.name ? user.name.split(' ')[0] : 'Citizen'}</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-white leading-[1.1] mt-2 tracking-tight">
                AI Legal Intelligence <br className="hidden lg:block"/>
                <span className="text-gradient-saffron text-glow-saffron">For Every Indian.</span>
              </h1>
            </div>
            <div className="hidden lg:flex flex-col gap-2 scale-110 ml-auto mr-4">
               <div className="glass-diamond px-3 py-1.5 rounded-xl flex items-center gap-2 border-green-500/10">
                  <Shield size={14} className="text-india-green" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">DPDP Compliant</span>
               </div>
               <div className="glass-diamond px-3 py-1.5 rounded-xl flex items-center gap-2 border-blue-500/10">
                  <Star size={14} className="text-saffron" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Bharat AI 🇮🇳</span>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Hero CTA */}
        <motion.div variants={item} className="lg:w-[480px] shrink-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <button
              onClick={() => navigate('/counsellor')}
              className="w-full flex items-center justify-between p-5 lg:p-8 rounded-[2rem] lg:rounded-[3rem] overflow-hidden relative group transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #ff9933 0%, #f59e0b 100%)', boxShadow: '0 20px 40px -10px rgba(255,153,51,0.5)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10" />
              <div className="flex items-center gap-5 lg:gap-7 relative">
                <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center relative"
                  style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <div className="absolute inset-0 mic-ring rounded-2xl bg-white/30" />
                  <Mic size={28} className="text-white lg:w-10 lg:h-10 relative z-10" />
                </div>
                <div className="text-left">
                  <div className="text-white font-black text-lg lg:text-2xl tracking-tighter leading-none">Voice Counsellor</div>
                  <p className="text-white/80 text-[11px] lg:text-sm font-semibold mt-2.5 max-w-[180px] lg:max-w-none leading-snug">
                    AI Legal advisory in your voice, in your language.
                  </p>
                </div>
              </div>
              <div className="bg-black/10 p-3 rounded-full group-hover:bg-white/20 transition-colors">
                <ArrowRight size={24} className="text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Grid Layout for Desktop vs Mobile flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* Main Content Column (Left on Desktop) */}
        <div className="space-y-6 lg:space-y-10 lg:col-span-8">
          
          {/* Stats Row */}
          <motion.div variants={item} className="grid grid-cols-4 gap-3 lg:gap-5">
            {STATS.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="glass-diamond rounded-2xl p-4 lg:p-7 text-center space-y-2 lg:space-y-3 hover-lift transition-all group overflow-hidden relative"
                style={{ border: `1px solid ${color}15` }}>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full blur-[20px] opacity-10 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: color }} />
                <Icon size={20} style={{ color }} className="mx-auto lg:w-8 lg:h-8" />
                <div className="text-xl lg:text-4xl font-black tracking-tighter" style={{ color }}>{value}</div>
                <div className="text-[10px] lg:text-[11px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4 lg:mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                   <Zap size={18} className="text-orange-400" />
                </div>
                <h2 className="text-white font-black text-base lg:text-3xl uppercase tracking-tighter">Legal Command Center</h2>
              </div>
              <span className="text-slate-500 text-xs lg:text-sm font-medium">All services live 🟢</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
              {QUICK_ACTIONS.map(({ id, path, icon: Icon, label, sublabel, color, glow, bg }) => (
                <TiltCard
                  key={id}
                  className="rounded-3xl cursor-pointer group"
                >
                  <button
                    onClick={() => navigate(path)}
                    className="w-full text-left p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] flex flex-col gap-5 lg:gap-8 transition-all duration-300 glass-card border-none card-aura h-full"
                    style={{ background: bg, border: `1px solid ${color}15` }}
                  >
                    <div className="w-12 h-12 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                      style={{ background: `${color}25`, boxShadow: `0 8px 32px -5px ${glow}` }}>
                      <Icon size={24} style={{ color }} className="lg:w-10 lg:h-10 font-black" />
                    </div>
                    <div>
                      <div className="text-white text-sm lg:text-2xl font-black leading-tight tracking-tight">{label}</div>
                      <div className="text-slate-500 text-[10px] lg:text-sm mt-2 font-medium leading-relaxed">{sublabel}</div>
                    </div>
                  </button>
                </TiltCard>
              ))}
            </div>
          </motion.div>

          {/* NyayaScore Card */}
          <motion.div variants={item}>
            <button onClick={() => navigate('/score')}
              className="w-full glass-card rounded-[2.5rem] lg:rounded-[4rem] p-7 lg:p-12 text-left group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden"
              style={{ border: '1px solid rgba(124,58,237,0.15)' }}>
              
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-7 lg:gap-16 relative">
                <div className="relative shrink-0 mx-auto lg:mx-0">
                  <div className="absolute inset-0 blur-[40px] opacity-20" style={{ background: 'radial-gradient(circle, #7c3aed, #06b6d4)' }} />
                  <svg width="120" height="120" viewBox="0 0 100 100" className="lg:w-40 lg:h-40">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#nyayaGrad)" strokeWidth="8"
                      strokeDasharray={`${((nyayaScore || 34) / 100) * 263.8} 263.8`}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                    <defs>
                      <linearGradient id="nyayaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="900" fill="white" className="drop-shadow-lg">
                      {nyayaScore || 34}
                    </text>
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="px-3 py-1 rounded-md bg-accent-purple/20 text-[10px] font-black text-accent-purple uppercase tracking-[0.2em] border border-accent-purple/20">NyayaScore™</div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">CIVIL HEALTH</span>
                  </div>
                  <h3 className="text-white font-black text-2xl lg:text-4xl tracking-tighter leading-none mb-3">Legal Protection Quotient</h3>
                  <p className="text-slate-400 text-xs lg:text-lg mt-2 font-medium max-w-sm leading-snug">AI Audit of your legal readiness. Upload more documents to increase accuracy.</p>
                  
                  <div className="grid grid-cols-4 gap-4 mt-8 lg:mt-10">
                    {[
                      { label: 'Employ.', pct: 60, color: '#f59e0b' },
                      { label: 'Tenancy', pct: 40, color: '#06b6d4' },
                      { label: 'Consumer', pct: 75, color: '#10b981' },
                      { label: 'Safety', pct: 20, color: '#ef4444' },
                    ].map(({ label, pct, color }) => (
                      <div key={label} className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] lg:text-[11px] font-black text-slate-500 uppercase tracking-tighter">
                          <span>{label}</span>
                          <span style={{ color }}>{pct}%</span>
                        </div>
                        <div className="h-2 lg:h-3 rounded-full bg-white/5 overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full rounded-full" 
                            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:flex flex-col items-center gap-3 text-slate-600 group-hover:text-accent-purple transition-all ml-12">
                   <div className="p-4 rounded-full bg-white/5 border border-white/10">
                      <ChevronRight size={32} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Analytics</span>
                </div>
              </div>
            </button>
          </motion.div>

        </div>

        {/* Sidebar Column (Right on Desktop) */}
        <div className="space-y-6 lg:space-y-10 lg:col-span-4 flex flex-col pt-2">
          
          {/* Latest Amendment */}
          {latestAmendment && (
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                   <Bell size={20} className="text-india-green" />
                   <h2 className="text-white font-black text-sm lg:text-xl uppercase tracking-wider">Public Gazette</h2>
                </div>
              </div>
              <button onClick={() => navigate('/amendments')}
                className="w-full glass-card rounded-[2rem] p-6 lg:p-8 text-left group hover:scale-[1.02] transition-all relative overflow-hidden"
                style={{ border: '1px solid rgba(16,185,129,0.15)' }}>
                <div className="flex items-start gap-5">
                  <div className="p-4 rounded-2xl shrink-0 glass-diamond" style={{ background: 'rgba(16,185,129,0.1)' }}>
                    <TrendingUp size={24} className="text-india-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-india-green text-[10px] font-black uppercase tracking-[0.2em]">Verified Law</span>
                      <div className="px-2 py-0.5 rounded-md bg-red-500/20 text-[9px] font-black text-red-400 border border-red-500/20">NEW GAZETTE</div>
                    </div>
                    <p className="text-white font-black text-lg lg:text-2xl line-clamp-2 leading-tight tracking-tight">{latestAmendment.actName}</p>
                    <div className="flex items-center gap-2 mt-3 p-1.5 px-3 rounded-xl bg-white/5 w-fit border border-white/5">
                       <Clock size={12} className="text-slate-500" />
                       <span className="text-slate-400 text-[10px] lg:text-xs font-black uppercase">{formatDate(latestAmendment.gazetteDate)}</span>
                    </div>
                    <p className="text-slate-400 text-xs lg:text-base mt-5 leading-relaxed line-clamp-3 font-medium">{latestAmendment.diffSummary}</p>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {/* Active Case Summary Card */}
          {activeCase && (
            <motion.div variants={item}>
               <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Scale size={20} className="text-accent-gold" />
                    <h2 className="text-white font-black text-sm lg:text-xl uppercase tracking-wider">Case Engine</h2>
                  </div>
                  <button onClick={() => navigate('/cases')} className="text-accent-gold text-xs font-black uppercase tracking-widest hover:underline">Full Docket →</button>
              </div>
              <button onClick={() => navigate('/cases')}
                className="w-full glass-card rounded-[2rem] p-6 lg:p-8 text-left group hover:scale-[1.02] transition-all"
                style={{ border: '1px solid rgba(245,158,11,0.15)' }}>
                <div className="flex items-start gap-5">
                  <div className="p-4 rounded-2xl shrink-0 glass-diamond" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <Shield size={24} className="text-accent-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-white font-black text-lg lg:text-2xl line-clamp-1 flex-1 tracking-tight">{activeCase.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-5">
                       <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-gold/10 text-accent-gold text-[10px] font-black uppercase border border-accent-gold/20">
                          <CheckCircle2 size={12} />
                          <span>AI TRACKING ACTIVE</span>
                       </div>
                    </div>
                    <p className="text-slate-400 text-xs lg:text-base line-clamp-3 leading-relaxed font-medium">{activeCase.facts}</p>
                    <div className="mt-8 p-5 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-between">
                       <div className="space-y-1">
                          <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Next Hearing Countdown</div>
                          <div className="text-accent-gold font-black text-lg lg:text-2xl">{activeCase.limitationDate ? daysUntil(activeCase.limitationDate) : 0} Days Remaining</div>
                       </div>
                       <div className="w-12 h-12 rounded-full border-2 border-accent-gold/20 flex items-center justify-center p-1 relative">
                          <div className="w-full h-full rounded-full bg-accent-gold/10 animate-pulse" />
                          <Clock size={16} className="text-accent-gold absolute" />
                       </div>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {/* Emergency / Badges Wrapper Desktop*/}
          <motion.div variants={item} className="space-y-8">
            {/* Emergency Helplines */}
            <div className="glass-card rounded-[2.5rem] p-8 lg:p-10 border-red-500/10" style={{ background: 'rgba(239,68,68,0.05)' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                   <Phone size={22} className="text-red-500 animate-pulse" />
                </div>
                <span className="text-red-500 text-sm lg:text-base font-black uppercase tracking-[0.25em]">SOS Helplines</span>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                {[
                  { label: 'Woman Help', number: '181', color: '#ec4899' },
                  { label: 'Police', number: '100', color: '#ef4444' },
                  { label: 'Legal Aid', number: '15100', color: '#f59e0b' },
                  { label: 'Mental Care', number: '915298', color: '#10b981' },
                ].map(({ label, number, color }) => (
                  <button key={label}
                    className="flex flex-col items-center gap-3 p-5 rounded-[2rem] transition-all hover:bg-white/5 border border-transparent hover:border-white/10 group bg-white/2">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-xl transition-all group-hover:scale-110 group-hover:-rotate-3"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                      <Phone size={20} style={{ color }} />
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-tighter leading-none">{label}</div>
                      <div className="text-sm lg:text-lg font-black mt-1 tracking-tight" style={{ color }}>{number}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Proactive Intelligence Badge */}
            <div className="glass-diamond rounded-[2.5rem] p-8 relative overflow-hidden hidden lg:block border-purple-500/10">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
              <div className="flex items-center gap-4 mb-8 relative">
                 <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center shadow-lg border border-accent-purple/20">
                    <Brain size={20} className="text-accent-purple" />
                 </div>
                 <span className="text-white font-black text-sm lg:text-lg uppercase tracking-[0.1em]">AI Neural Watch</span>
              </div>
              <p className="text-slate-400 text-sm lg:text-base font-medium leading-relaxed mb-8">NyayaMitra AI is actively screening the e-Gazette for BNS updates relevant to your ongoing tenancy cases.</p>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5 p-[1px]">
                 <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-accent-purple to-transparent rounded-full"
                 />
              </div>
            </div>

            {/* Logout Session */}
            <motion.div variants={item}>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.href = '/'
                }}
                className="w-full flex items-center justify-center gap-3 p-6 rounded-[2rem] bg-white/2 border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 transition-all uppercase text-[10px] font-black tracking-[0.3em]"
              >
                Secure Termination
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
