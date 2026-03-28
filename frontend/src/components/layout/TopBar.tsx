import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, Wifi, WifiOff, ChevronLeft, LogOut } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { LANGUAGES } from '@/utils'

const PAGE_TITLES: Record<string, string> = {
  '/': 'NyayaMitra',
  '/counsellor': 'AI Legal Counsel',
  '/decoder': 'Document Decoder',
  '/generator': 'Document Generator',
  '/amendments': 'Amendment Tracker',
  '/cases': 'My Cases',
  '/score': 'NyayaScore™',
  '/negotiate': 'Negotiation Coach',
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
    <header className="sticky top-0 z-40" style={{ background: 'rgba(8,12,31,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,153,51,0.08)' }}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left */}
        <div className="flex items-center gap-2.5">
          {canGoBack ? (
            <button onClick={() => navigate(-1)}
              className="p-1.5 rounded-xl hover:bg-white/8 transition-colors text-slate-300 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <ChevronLeft size={20} />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center glow-saffron">
              <span className="text-white font-black text-sm">N</span>
            </div>
          )}
          <h1 className={`font-bold tracking-tight ${isHome ? 'text-gradient-saffron text-xl' : 'text-white text-base'}`}>
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* Live indicator */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
            isOnline ? 'text-emerald-400' : 'text-red-400'
          }`} style={{ background: isOnline ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: isOnline ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)' }}>
            {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            <span>{isOnline ? 'Live' : 'Offline'}</span>
          </div>

          {/* Language selector */}
          <select value={language} onChange={(e) => setLanguage(e.target.value as any)}
            className="rounded-lg px-2 py-1 text-xs text-slate-300 cursor-pointer focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {Object.entries(LANGUAGES).map(([code, { nativeName }]) => (
              <option key={code} value={code} className="bg-slate-900">{nativeName}</option>
            ))}
          </select>

          {isHome && (
            <button className="relative p-2 rounded-xl transition-colors text-slate-400 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            </button>
          )}

          {/* User avatar / logout */}
          {user?.isLoggedIn && (
            <div className="flex items-center gap-1.5 ml-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
                style={{ background: 'linear-gradient(135deg, #ff9933, #f59e0b)' }}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button onClick={handleLogout}
                className="p-1.5 rounded-lg transition-colors text-slate-500 hover:text-red-400"
                title="Logout">
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gradient bottom border */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,153,51,0.25), transparent)' }} />
    </header>
  )
}
