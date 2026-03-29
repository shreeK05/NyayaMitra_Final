import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, FileText, Target, Scale, Zap, LayoutDashboard, 
  Settings, Award, MessageSquare, Briefcase, Home,
  Landmark, ShieldCheck, Activity, Search, User
} from 'lucide-react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import VoiceCounsellorPage from './pages/VoiceCounsellorPage'
import DocumentDecoderPage from './pages/DocumentDecoderPage'
import DocumentGeneratorPage from './pages/DocumentGeneratorPage'
import CaseTrackerPage from './pages/CaseTrackerPage'
import NyayaScorePage from './pages/NyayaScorePage'
import AmendmentTrackerPage from './pages/AmendmentTrackerPage'
import NegotiationCoachPage from './pages/NegotiationCoachPage'
import { cn } from './utils'

// Protective Wrapper for Neural Nodes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem('user')
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

// Ultra-Premium Floating Nav Matrix
function FloatingNav() {
  const location = useLocation()
  const isAuth = ['/login', '/'].includes(location.pathname)
  if (isAuth) return null

  const navItems = [
    { path: '/counsellor', icon: Mic, label: 'Link' },
    { path: '/decoder', icon: Zap, label: 'Audit' },
    { path: '/tracker', icon: Target, label: 'Docket' },
    { path: '/generator', icon: FileText, label: 'Forge' },
    { path: '/negotiate', icon: MessageSquare, label: 'Coach' },
    { path: '/score', icon: Award, label: 'Grade' },
  ]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-[3rem] glass-diamond border-white/10 bg-slate-900/80 backdrop-blur-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center gap-3 border transition-all hover:scale-[1.01]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <motion.a
            key={item.path}
            href={item.path}
            whileTap={{ scale: 0.9 }}
            className={cn(
               "w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all relative overflow-hidden",
               isActive ? "gradient-primary shadow-2xl scale-110" : "text-slate-400 hover:text-white"
            )}
          >
            <item.icon size={isActive ? 20 : 18} className="relative z-10" />
            <span className={cn("text-[9px] font-black uppercase tracking-widest", isActive ? "text-white" : "text-slate-500")}>{item.label}</span>
            {isActive && <motion.div layoutId="nav-bg" className="absolute inset-x-0 bottom-0 h-1 bg-white opacity-40 shadow-[0_0_10px_white]" />}
          </motion.a>
        )
      })}
    </div>
  )
}

// Persistent Brand Navigation Core
function TopBar() {
  const location = useLocation()
  if (location.pathname === '/login') return null

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-6 flex items-center justify-between pointer-events-none">
       <div className="flex items-center gap-4 pointer-events-auto group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-[#030712] border border-white/10 flex items-center justify-center shadow-2xl transition-all group-hover:border-saffron/40 group-hover:scale-105">
             <Scale size={24} className="text-white group-hover:text-saffron transition-colors" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase font-display text-white">NyayaMitra<span className="text-saffron">.</span></span>
       </div>

       <div className="hidden lg:flex items-center gap-8 pointer-events-auto glass-diamond px-8 py-4 rounded-full border-white/5 bg-slate-900/30 backdrop-blur-3xl shadow-xl">
          <div className="flex items-center gap-3 pr-8 border-r border-white/5">
             <div className="w-2 h-2 rounded-full bg-india-green shadow-[0_0_8px_green] animate-pulse" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Node_Status: SECURE</span>
          </div>
          <div className="flex items-center gap-8">
             <a href="/amendments" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-saffron transition-colors">Gazette Ledger</a>
             <a href="/score" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-saffron transition-colors">Safety Audit</a>
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-white/40 transition-all overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Profile" className="w-full h-full p-1 opacity-60 group-hover:opacity-100" />
             </div>
          </div>
       </div>
    </nav>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  return (
    <Router>
      <TopBar />
      <FloatingNav />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          
          <Route path="/counsellor" element={
            <ProtectedRoute>
              <PageTransition><VoiceCounsellorPage /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/decoder" element={
            <ProtectedRoute>
              <PageTransition><DocumentDecoderPage /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/generator" element={
            <ProtectedRoute>
              <PageTransition><DocumentGeneratorPage /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/tracker" element={
            <ProtectedRoute>
              <PageTransition><CaseTrackerPage /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/score" element={
            <ProtectedRoute>
              <PageTransition><NyayaScorePage /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/amendments" element={
            <ProtectedRoute>
              <PageTransition><AmendmentTrackerPage /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/negotiate" element={
            <ProtectedRoute>
              <PageTransition><NegotiationCoachPage /></PageTransition>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App
