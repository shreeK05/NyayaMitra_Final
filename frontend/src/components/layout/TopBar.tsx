import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, Wifi, WifiOff, ChevronLeft, LogOut, Menu, Search, User } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { LANGUAGES } from '@/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Digital Bharat HQ',
  '/counsellor': 'Neural Counsellor',
  '/decoder': 'Document Decoder',
  '/generator': 'Notice Generator',
  '/amendments': 'Public Gazette',
  '/cases': 'Legal Case Docket',
  '/score': 'NyayaScore™ Profile',
  '/negotiate': 'AI Battle Coach',
}

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { language, setLanguage, isOnline, user, logout } = useAppStore()

  const title = PAGE_TITLES[location.pathname] || 'NyayaMitra'
  const isHome = location.pathname === '/'
  const canGoBack = !isHome

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-3xl border-b border-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between px-6 lg:px-10 h-16 lg:h-20">
        
        {/* Left Side: Dynamic Context */}
        <div className="flex items-center gap-5 lg:gap-8">
          <div className="lg:hidden">
             <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400">
                <Menu size={20} />
             </button>
          </div>
          
          <div className="flex items-center gap-4">
            {canGoBack && (
              <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-400 hover:text-white"
              >
                <ChevronLeft size={18} />
              </motion.button>
            )}
            <div>
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={title}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={cn(
                    'font-black tracking-tight font-display transition-all',
                    isHome ? 'text-2xl lg:text-3xl text-gradient-saffron' : 'text-lg lg:text-2xl text-white'
                  )}
                >
                  {title}
                </motion.h1>
              </AnimatePresence>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className={cn("w-1.5 h-1.5 rounded-full", isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500")} />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isOnline ? 'System Live' : 'Link Interrupted'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Identity & Intelligence */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/8 rounded-2xl px-4 py-2 hover:bg-white/10 transition-all group cursor-pointer relative">
             <Search size={16} className="text-slate-500 group-hover:text-white transition-colors" />
             <input type="text" placeholder="Search statutes..." className="bg-transparent border-none outline-none text-xs text-slate-400 placeholder-slate-600 font-bold w-32 focus:w-48 transition-all" />
             <div className="px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-black text-slate-500 border border-white/10">⌘ K</div>
          </div>

          <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-400 hover:text-white group">
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-saffron rounded-full border-2 border-[#030712] animate-pulse" />
          </button>

          <div className="h-8 lg:h-10 w-px bg-white/5" />

          {user?.isLoggedIn && (
            <div className="flex items-center gap-4 pl-2 lg:pl-4">
              <div className="text-right hidden sm:block">
                 <div className="text-xs font-black text-white hover-lift transition-all">{user.name?.split(' ')[0]}</div>
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-tight">{user.state || 'Maharashtra'}</div>
              </div>
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-saffron to-amber-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition-opacity" />
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-[#0f172a] border border-white/10 flex items-center justify-center text-lg font-black text-white shadow-2xl relative z-10 transition-transform group-hover:scale-105 active:scale-95">
                  <User size={22} className="text-saffron" />
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all shadow-lg"
                title="Secure Terminal Logoff"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Identity Gradient Sub-line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </header>
  )
}
