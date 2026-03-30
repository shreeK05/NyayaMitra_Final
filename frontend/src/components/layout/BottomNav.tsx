import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MessageSquare, FileText, Scale, Bell, Search, Shield, Zap, Target, Activity, History } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'

const NAV_ITEMS = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/counsellor', icon: MessageSquare, label: 'Counsel' },
  { path: '/generator', icon: FileText, label: 'Forge' },
  { path: '/tracker', icon: Target, label: 'Docket' },
  { path: '/score', icon: Activity, label: 'Audit' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] lg:hidden pointer-events-none px-6 pb-12">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="relative rounded-[3.5rem] bg-[#030712]/80 backdrop-blur-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] p-2.5 flex items-center justify-around border-glow group/nav">
          
          {/* 🌌 Neural Glow Trace */}
          <div className="absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent shadow-[0_0_20px_#ff9933] opacity-0 group-hover/nav:opacity-100 transition-opacity duration-1000" />
          
          <AnimatePresence>
             <div className="absolute inset-0 flex items-center justify-around pointer-events-none px-2.5">
                {NAV_ITEMS.map(({ path }) => (
                  <div key={path} className="flex-1 flex justify-center">
                     {location.pathname === path && (
                       <motion.div 
                         layoutId="active-diamond"
                         className="w-14 h-14 rounded-2xl bg-black border border-white/10 shadow-[0_0_40px_rgba(255,153,51,0.15)] relative overflow-hidden"
                         transition={{ type: "spring", stiffness: 400, damping: 30 }}
                       >
                          <div className="absolute inset-0 bg-saffron/10 animate-pulse" />
                          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-saffron shadow-[0_0_10px_#ff9933]" />
                       </motion.div>
                     )}
                  </div>
                ))}
             </div>
          </AnimatePresence>

          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            return (
              <motion.button
                key={path}
                whileTap={{ scale: 0.85 }}
                onClick={() => navigate(path)}
                className="flex-1 flex flex-col items-center justify-center py-4 relative z-10 transition-all group/btn"
              >
                <div className={cn(
                  'w-8 h-8 flex items-center justify-center transition-all duration-500',
                  active ? 'text-saffron scale-110' : 'text-slate-700 group-hover/btn:text-slate-400'
                )}>
                  <Icon size={24} className={cn(active ? 'stroke-[2.5px]' : 'stroke-2', 'transition-transform duration-500', active ? 'animate-neural-pulse' : 'group-hover/btn:scale-110')} />
                </div>
                
                <span className={cn(
                  'text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 transform origin-bottom font-display italic mt-2',
                  active ? 'text-saffron opacity-100 scale-100' : 'text-slate-800 opacity-40 scale-90'
                )}>
                  {label}
                </span>

                {/* Micro Indicator */}
                {active && (
                   <motion.div layoutId="dot" className="absolute -bottom-2 w-1 h-1 rounded-full bg-saffron shadow-[0_0_10px_#ff9933]" />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
