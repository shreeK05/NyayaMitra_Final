import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MessageSquare, FileText, Scale, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom lg:hidden"
      style={{ background: 'rgba(8,12,31,0.92)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,153,51,0.1)' }}>
      <div className="flex items-center justify-around px-1 pt-2 pb-3 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <motion.button
              key={path}
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 min-w-[52px]',
                active ? '' : 'text-slate-500 hover:text-slate-300'
              )}
              style={active ? { background: 'rgba(255,153,51,0.1)' } : {}}
            >
              <div className="relative">
                <Icon size={21} className={cn('transition-all duration-200',
                  active ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(255,153,51,0.7)]' : 'text-slate-500'
                )} />
                {active && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #ff9933, #f59e0b)' }}
                  />
                )}
              </div>
              <span className={cn(
                'text-[9px] font-bold tracking-wide mt-1 transition-all',
                active ? 'text-orange-400' : 'text-slate-600'
              )}>
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
