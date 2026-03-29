import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MessageSquare, FileText, Scale, Bell, Search, Shield, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/counsellor', icon: MessageSquare, label: 'Counsel' },
  { path: '/generator', icon: FileText, label: 'Docs' },
  { path: '/cases', icon: Scale, label: 'Cases' },
  { path: '/amendments', icon: Bell, label: 'Updates' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom lg:hidden pointer-events-none px-6 pb-6">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="relative rounded-[2.5rem] bg-[#0f172a]/70 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 flex items-center justify-around translate-y-0 transition-transform active:translate-y-1">
          
          {/* Animated Selection Bubble Background */}
          <div className="absolute inset-2 flex items-center justify-around pointer-events-none">
             {NAV_ITEMS.map(({ path }) => (
               <div key={path} className="flex-1 flex justify-center">
                  {location.pathname === path && (
                    <motion.div 
                      layoutId="active-bubble"
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron/20 to-orange-600/10 border border-saffron/20 shadow-lg shadow-saffron/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
               </div>
             ))}
          </div>

          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            return (
              <motion.button
                key={path}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(path)}
                className="flex-1 flex flex-col items-center justify-center p-3 relative z-10 transition-all group"
              >
                <div className={cn(
                  'w-6 h-6 flex items-center justify-center transition-all duration-300',
                  active ? 'text-saffron scale-110 drop-shadow-[0_0_12px_rgba(255,153,51,0.5)]' : 'text-slate-500 group-hover:text-slate-300'
                )}>
                  <Icon size={22} className={active ? 'stroke-[2.5px]' : 'stroke-2'} />
                </div>
                <span className={cn(
                  'text-[9px] font-black uppercase tracking-tighter transition-all duration-300 transform origin-bottom',
                  active ? 'text-saffron opacity-100 scale-100 mt-1.5' : 'text-slate-600 opacity-60 scale-90 mt-1'
                )}>
                  {label}
                </span>
                
                {/* Active Indicator Glow */}
                {active && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-saffron shadow-[0_0_8px_rgba(255,153,51,1)]"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
