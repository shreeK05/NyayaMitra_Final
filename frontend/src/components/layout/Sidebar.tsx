import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MessageSquare, FileText, Scale, Bell, Shield, Zap, Sparkles, Brain, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home', badge: null },
  { path: '/counsellor', icon: MessageSquare, label: 'Counsellor', badge: 'AI' },
  { path: '/generator', icon: FileText, label: 'Docs', badge: '47' },
  { path: '/cases', icon: Scale, label: 'My Cases', badge: null },
  { path: '/amendments', icon: Bell, label: 'Updates', badge: 'New' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className="hidden lg:flex flex-col w-72 h-dvh fixed left-0 top-0 z-50 overflow-hidden bg-[#020617] border-right border-white/5 shadow-2xl">
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-saffron/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-accent-purple/5 via-transparent to-transparent" />
      </div>

      {/* Brand Section */}
      <div className="relative z-10 p-8 mb-4 group cursor-pointer" onClick={() => navigate('/')}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1.5 bg-saffron/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron to-amber-600 flex items-center justify-center shadow-2xl relative z-10 transition-transform group-hover:scale-105 group-hover:rotate-3">
              <Scale size={24} className="text-white drop-shadow-md" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white font-display">NyayaMitra</h1>
            <div className="flex items-center gap-1.5 opacity-60">
               <div className="w-1 h-1 rounded-full bg-saffron" />
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] font-sans">Legal Intelligence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Nav Menu */}
      <nav className="relative z-10 flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-none py-4">
        <div className="px-4 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.25em]">Command Center</div>
        {NAV_ITEMS.map(({ path, icon: Icon, label, badge }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden',
                active 
                  ? 'bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] shadow-xl' 
                  : 'hover:bg-white/[0.03] border border-transparent hover:border-white/5'
              )}
            >
              {active && (
                <motion.div 
                  layoutId="sidebar-active-pill"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-saffron rounded-full"
                />
              )}
              
              <div className={cn(
                'p-2.5 rounded-xl transition-all duration-300',
                active ? 'bg-saffron/10 text-saffron shadow-[0_0_20px_rgba(255,153,51,0.2)]' : 'text-slate-500 group-hover:text-slate-200'
              )}>
                <Icon size={20} className={active ? 'stroke-[2.5px]' : 'stroke-2'} />
              </div>
              
              <span className={cn(
                'font-bold text-[13px] tracking-tight transition-all duration-300',
                active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
              )}>
                {label}
              </span>

              {badge && (
                <div className={cn(
                   "ml-auto px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter shadow-sm",
                   active ? "bg-saffron/20 text-saffron border border-saffron/20" : "bg-white/5 text-slate-500 border border-white/5"
                )}>
                  {badge}
                </div>
              )}
            </button>
          )
        })}

        <div className="px-4 mt-12 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.25em]">Specialized AI</div>
        {[
           { label: 'Neural Score', icon: Brain, color: '#7c3aed', path: '/score' },
           { label: 'Battle Coach', icon: Award, color: '#ec4899', path: '/negotiate' },
           { label: 'Clause Audit', icon: Shield, color: '#06b6d4', path: '/decoder' }
        ].map(item => {
           const active = location.pathname === item.path
           return (
             <button key={item.label} onClick={() => navigate(item.path)}
               className={cn(
                 "w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all group",
                 active ? "bg-white/5 border border-white/10" : "hover:bg-white/2 border border-transparent"
               )}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-white/5" style={{ color: active ? item.color : '#475569' }}>
                   <item.icon size={16} />
                </div>
                <span className={cn("text-[11px] font-bold tracking-tight", active ? "text-white" : "text-slate-500")}>{item.label}</span>
             </button>
           )
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="relative z-10 p-6 pt-0">
        <div className="p-5 rounded-[2rem] bg-slate-900/40 border border-white/5 backdrop-blur-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Active</span>
            </div>
            <div className="text-[9px] font-bold text-slate-600">60ms</div>
          </div>
          <div className="space-y-1.5">
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  className="h-full bg-india-green rounded-full"
                />
             </div>
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">BNS Mapping Readiness: 85%</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
