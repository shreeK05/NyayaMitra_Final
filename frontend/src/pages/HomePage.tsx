import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mic, FileSearch, FileText, Bell, Scale, Shield,
  TrendingUp, Clock, ChevronRight, Zap, Star,
  AlertCircle, CheckCircle2, ArrowRight, MessageSquare,
  Brain, Award, Phone
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { LANGUAGES, SAMPLE_AMENDMENTS, SAMPLE_CASES, formatDate, daysUntil } from '@/utils'
import { cn } from '@/utils'

const QUICK_ACTIONS = [
  { id: 'counsellor', path: '/counsellor', icon: MessageSquare, label: 'Ask NyayaMitra', sublabel: 'Type or Speak', color: '#ff9933', glow: 'rgba(255,153,51,0.35)', bg: 'rgba(255,153,51,0.08)' },
  { id: 'decoder', path: '/decoder', icon: FileSearch, label: 'Decode Document', sublabel: 'Analyse legal doc', color: '#06b6d4', glow: 'rgba(6,182,212,0.35)', bg: 'rgba(6,182,212,0.08)' },
  { id: 'generator', path: '/generator', icon: FileText, label: 'Draft Notice', sublabel: '47 types ready', color: '#7c3aed', glow: 'rgba(124,58,237,0.35)', bg: 'rgba(124,58,237,0.08)' },
  { id: 'amendments', path: '/amendments', icon: Bell, label: 'Law Updates', sublabel: 'Live gazette', color: '#10b981', glow: 'rgba(16,185,129,0.35)', bg: 'rgba(16,185,129,0.08)' },
  { id: 'cases', path: '/cases', icon: Scale, label: 'My Cases', sublabel: 'Track & predict', color: '#f59e0b', glow: 'rgba(245,158,11,0.35)', bg: 'rgba(245,158,11,0.08)' },
  { id: 'negotiate', path: '/negotiate', icon: Shield, label: 'Negotiation', sublabel: 'AI role-play', color: '#ec4899', glow: 'rgba(236,72,153,0.35)', bg: 'rgba(236,72,153,0.08)' },
]

const STATS = [
  { value: '35+', label: 'Features', icon: Zap, color: '#ff9933' },
  { value: '47', label: 'Doc Types', icon: FileText, color: '#06b6d4' },
  { value: '12', label: 'Law Domains', icon: Scale, color: '#7c3aed' },
  { value: '6', label: 'Languages', icon: Star, color: '#10b981' },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

export default function HomePage() {
  const navigate = useNavigate()
  const { language, nyayaScore, user } = useAppStore()
  const lang = LANGUAGES[language]
  const latestAmendment = SAMPLE_AMENDMENTS[0]
  const activeCase = SAMPLE_CASES[0]

  return (
    <motion.div variants={container} initial="hidden" animate="show"
      className="px-4 lg:px-8 py-5 lg:py-8 space-y-6 lg:space-y-8 max-w-lg lg:max-w-7xl mx-auto w-full"
    >
      {/* Top Section: Greeting & Hero CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
        {/* Greeting */}
        <motion.div variants={item} className="flex-1 space-y-4">
          <div className="flex items-center justify-between lg:justify-start lg:gap-6">
            <div>
              <p className="text-slate-400 text-sm lg:text-base">
                👋 Namaste{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
              </p>
              <h1 className="text-2xl lg:text-4xl font-black text-white leading-tight mt-0.5 lg:mt-2">
                Legal Justice <br className="hidden lg:block"/>
                <span className="text-gradient-saffron">For Every Indian</span>
              </h1>
            </div>
            <div className="flex flex-col items-end lg:items-start gap-1 lg:mt-2 lg:hidden">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
                ✓ DPDP Compliant
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.25)', color: '#fb923c' }}>
                🇮🇳 {lang.nativeName}
              </span>
            </div>
          </div>
          <p className="hidden lg:block text-slate-400 text-sm max-w-md leading-relaxed">
            AI-powered legal platform for automated document generation, voice-first rights guidance, and proactive case monitoring.
          </p>
        </motion.div>

        {/* Hero CTA */}
        <motion.div variants={item} className="lg:w-[500px] shrink-0">
          <button
            onClick={() => navigate('/counsellor')}
            className="w-full flex items-center justify-between p-4 lg:p-6 rounded-2xl lg:rounded-3xl overflow-hidden relative group transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg, #ff9933 0%, #f59e0b 60%, #ff6b35 100%)', boxShadow: '0 8px 32px rgba(255,153,51,0.35)' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)', backgroundSize: '200% 100%' }} />
            <div className="flex items-center gap-4 lg:gap-6 relative">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Mic size={24} className="text-white lg:w-8 lg:h-8" />
              </div>
              <div className="text-left">
                <div className="text-white font-black text-base lg:text-xl">Ask Legal Question</div>
                <div className="text-white/75 text-xs lg:text-sm font-medium mt-0.5">Type or Speak in 6 Indian Languages</div>
              </div>
            </div>
            <ArrowRight size={24} className="text-white/80 group-hover:translate-x-2 transition-transform relative" />
          </button>
        </motion.div>
      </div>

      {/* Grid Layout for Desktop vs Mobile flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
        
        {/* Main Content Column (Left on Desktop) */}
        <div className="space-y-5 lg:space-y-8 lg:col-span-8">
          
          {/* Stats Row */}
          <motion.div variants={item} className="grid grid-cols-4 gap-2 lg:gap-4">
            {STATS.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl p-3 lg:p-5 text-center space-y-1 lg:space-y-2 hover-lift transition-all"
                style={{ background: 'rgba(21,31,58,0.7)', border: `1px solid ${color}20`, backdropFilter: 'blur(10px)' }}>
                <Icon size={18} style={{ color }} className="mx-auto" />
                <div className="text-lg lg:text-2xl font-black" style={{ color }}>{value}</div>
                <div className="text-[9px] lg:text-xs text-slate-500 font-semibold uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h2 className="text-white font-bold text-sm lg:text-lg">All Features</h2>
              <span className="text-slate-500 text-xs lg:text-sm">Explore tools</span>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-3 gap-2.5 lg:gap-4">
              {QUICK_ACTIONS.map(({ id, path, icon: Icon, label, sublabel, color, glow, bg }) => (
                <button
                  key={id}
                  onClick={() => navigate(path)}
                  className="rounded-2xl p-3.5 lg:p-5 text-left flex flex-col gap-2 lg:gap-4 transition-all duration-200 hover:-translate-y-1"
                  style={{ background: bg, border: `1px solid ${color}20`, backdropFilter: 'blur(10px)' }}
                >
                  <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: `${color}18`, boxShadow: `0 4px 16px ${glow}` }}>
                    <Icon size={18} style={{ color }} className="lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <div className="text-white text-xs lg:text-base font-bold leading-tight">{label}</div>
                    <div className="text-slate-500 text-[10px] lg:text-xs mt-0.5 lg:mt-1">{sublabel}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* NyayaScore Card */}
          <motion.div variants={item}>
            <button onClick={() => navigate('/score')}
              className="w-full rounded-2xl p-4 lg:p-6 text-left group hover:scale-[1.01] transition-all duration-300"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.22)', backdropFilter: 'blur(10px)' }}>
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="relative shrink-0">
                  <svg width="60" height="60" viewBox="0 0 60 60" className="lg:w-20 lg:h-20">
                    <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="6" className="lg:cx-40 lg:cy-40 lg:r-32 lg:stroke-8" style={{ transformOrigin: 'center' }} />
                    <circle cx="30" cy="30" r="24" fill="none" stroke="url(#scoreGrad)" strokeWidth="6"
                      strokeDasharray={`${((nyayaScore || 34) / 100) * 150.8} 150.8`}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '30px 30px' }}
                      className="lg:cx-40 lg:cy-40 lg:r-32 lg:stroke-8"
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <text x="30" y="35" textAnchor="middle" fontSize="14" fontWeight="900" fill="#a78bfa" className="lg:text-xl lg:y-42">
                      {nyayaScore || 34}
                    </text>
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 lg:mb-1">
                    <Award size={14} className="text-purple-400" />
                    <span className="text-xs lg:text-sm text-purple-400 font-bold uppercase tracking-wider">NyayaScore™</span>
                  </div>
                  <div className="text-white font-bold text-sm lg:text-lg">Your Legal Health Score</div>
                  <div className="text-slate-400 text-xs lg:text-sm mt-0.5">Click to improve your score →</div>
                  <div className="grid grid-cols-4 gap-2 mt-3 lg:mt-4">
                    {[
                      { label: 'Employ.', pct: 60, color: '#f59e0b' },
                      { label: 'Tenancy', pct: 40, color: '#06b6d4' },
                      { label: 'Consumer', pct: 75, color: '#10b981' },
                      { label: 'Risk', pct: 20, color: '#ef4444' },
                    ].map(({ label, pct, color }) => (
                      <div key={label} className="space-y-1">
                        <div className="text-[8px] lg:text-[10px] text-slate-500 text-center font-medium uppercase">{label}</div>
                        <div className="h-1 lg:h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-600 group-hover:text-purple-400 transition-colors shrink-0 lg:ml-4" />
              </div>
            </button>
          </motion.div>

        </div>

        {/* Sidebar Column (Right on Desktop) */}
        <div className="space-y-5 lg:space-y-6 lg:col-span-4 flex flex-col pt-0 lg:pt-1">
          
          {/* Latest Amendment */}
          {latestAmendment && (
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-3 lg:hidden">
                <h2 className="text-white font-bold text-sm">Updates</h2>
              </div>
              <button onClick={() => navigate('/amendments')}
                className="w-full rounded-2xl p-4 lg:p-5 text-left group hover:-translate-y-1 transition-all"
                style={{ background: 'rgba(255,153,51,0.06)', border: '1px solid rgba(255,153,51,0.2)', backdropFilter: 'blur(10px)' }}>
                <div className="flex items-start gap-3">
                  <div className="p-2 lg:p-2.5 rounded-xl shrink-0" style={{ background: 'rgba(255,153,51,0.12)' }}>
                    <Bell size={16} className="text-orange-400 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-orange-400 text-[10px] lg:text-xs font-bold uppercase tracking-wider">Latest Amendment</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>NEW</span>
                    </div>
                    <p className="text-white font-bold text-sm lg:text-base leading-snug">{latestAmendment.actName}</p>
                    <p className="text-slate-400 text-xs mt-1">{latestAmendment.section} • {formatDate(latestAmendment.gazetteDate)}</p>
                    <p className="text-slate-300 text-xs lg:text-sm mt-2 leading-relaxed line-clamp-2">{latestAmendment.diffSummary}</p>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {/* Active Case */}
          {activeCase && (
            <motion.div variants={item}>
               <div className="flex items-center justify-between mb-3 lg:mb-3">
                <h2 className="text-white font-bold text-sm lg:text-base">Tracked Case</h2>
                <button onClick={() => navigate('/cases')} className="text-orange-400 text-xs lg:text-sm font-semibold">View All →</button>
              </div>
              <button onClick={() => navigate('/cases')}
                className="w-full rounded-2xl p-4 lg:p-5 text-left group hover:-translate-y-1 transition-all"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div className="flex items-start gap-3 lg:gap-4">
                  <div className="p-2 lg:p-2.5 rounded-xl shrink-0" style={{ background: 'rgba(245,158,11,0.12)' }}>
                    <Scale size={16} className="text-amber-400 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-sm lg:text-base line-clamp-1">{activeCase.title}</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>Active</span>
                    </div>
                    <p className="text-slate-400 text-xs lg:text-sm line-clamp-2 leading-relaxed">{activeCase.facts}</p>
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs lg:text-sm bg-black/20 p-2 rounded-lg w-fit border border-white/5">
                      <Clock size={12} className="text-amber-500" />
                      <span className="text-slate-400">Limitation:</span>
                      <span className="text-amber-400 font-bold">{activeCase.limitationDate ? daysUntil(activeCase.limitationDate) : 0} days left</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {/* Emergency / Badges Wrapper Desktop*/}
          <div className="grid grid-cols-1 gap-5">
            {/* Emergency Helplines */}
            <motion.div variants={item}>
              <div className="rounded-2xl p-4 lg:p-5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
                <div className="flex items-center gap-2 mb-3 lg:mb-4">
                  <AlertCircle size={15} className="text-red-400 lg:w-5 lg:h-5" />
                  <span className="text-red-400 text-xs lg:text-sm font-bold uppercase tracking-wider">Emergency Helplines</span>
                </div>
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  {[
                    { label: 'Women Helpline', number: '181', color: '#ec4899' },
                    { label: 'Police', number: '100', color: '#ef4444' },
                    { label: 'Legal Aid', number: '15100', color: '#f59e0b' },
                    { label: 'Mental Health', number: '9152987821', color: '#10b981' },
                  ].map(({ label, number, color }) => (
                    <a key={label} href={`tel:${number}`}
                      className="flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 rounded-xl transition-colors hover:bg-white/5 group">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                        <Phone size={14} style={{ color }} className="lg:w-4 lg:h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] lg:text-xs text-slate-400 leading-none">{label}</div>
                        <div className="text-xs lg:text-sm font-bold mt-1" style={{ color }}>{number}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* World Firsts */}
            <motion.div variants={item} className="hidden lg:block">
              <div className="rounded-2xl p-5 relative overflow-hidden"
                style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
                  style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
                <div className="flex items-center gap-2 mb-4 relative">
                  <Brain size={16} className="text-purple-400" />
                  <span className="text-purple-400 text-sm font-bold uppercase tracking-wider">13 World Firsts</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 relative">
                  {['Amendment Live Tracker', 'NyayaScore™ Legal Health', 'Blockchain Doc Proof', 'AI Negotiation Coach', 'Distress Detection AI', 'Zero-Download WhatsApp'].map((feat) => (
                    <div key={feat} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 shadow-[0_0_8px_#a855f7]" />
                      <span className="text-xs text-slate-300 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
