import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MessageSquare, FileText, Scale, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/counsellor', icon: MessageSquare, label: 'Counsellor' },
  { path: '/generator', icon: FileText, label: 'Document Generator' },
  { path: '/cases', icon: Scale, label: 'My Cases' },
  { path: '/amendments', icon: Bell, label: 'Law Updates' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className="hidden lg:flex flex-col w-64 h-dvh fixed left-0 top-0 z-50 glass"
           style={{ background: 'rgba(8,12,31,0.95)', borderRight: '1px solid rgba(255,153,51,0.1)' }}>
      {/* Brand */}
      <div className="flex items-center gap-3 p-6 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-saffron">
          <span className="text-white font-black text-lg">N</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient-saffron">NyayaMitra</h1>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Legal Justice AI</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group',
                active 
                  ? 'bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20' 
                  : 'hover:bg-white/5 border border-transparent hover:border-white/10'
              )}
            >
              <div className={cn(
                'p-2 rounded-lg transition-colors',
                active ? 'bg-orange-500/20 text-orange-400 glow-saffron' : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
              )}>
                <Icon size={18} />
              </div>
              <span className={cn(
                'font-semibold text-sm',
                active ? 'text-orange-400' : 'text-slate-400 group-hover:text-white'
              )}>
                {label}
              </span>
              {active && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="w-1.5 h-6 bg-orange-500 rounded-full ml-auto"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer / Info */}
      <div className="p-6">
        <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">System Live</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Connecting to Indian legal databases, processing with AES-256 encryption.
          </p>
        </div>
      </div>
    </aside>
  )
}
