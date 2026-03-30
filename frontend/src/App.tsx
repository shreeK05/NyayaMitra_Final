import { Link, useNavigate, useLocation, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, FileText, Target, Scale, Zap, LayoutDashboard, 
  Settings, Award, MessageSquare, Briefcase, Home,
  Landmark, ShieldCheck, Activity, Search, User, Menu, X,
  History, Radar, History as HistoryIcon, Globe
} from 'lucide-react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
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
  const navigate = useNavigate()
  
  // Only show on dashboard-style pages, not Landing or Login or Home (which is the main hub)
  const isAuth = ['/login', '/'].includes(location.pathname)
  // If we are on HomePage, we might not need the floating nav if the cards handle it, 
  // but for mobile consistency, we might keep it. Let's show it on all internal pages.
  if (isAuth) return null

  const navItems = [
    { path: '/home', icon: Home, label: 'Hub' },
    { path: '/counsellor', icon: Mic, label: 'Counsellor' },
    { path: '/decoder', icon: Zap, label: 'Audit' },
    { path: '/tracker', icon: Target, label: 'Docket' },
    { path: '/generator', icon: FileText, label: 'Forge' },
    { path: '/negotiate', icon: MessageSquare, label: 'Coach' },
  ]

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-3 py-3 rounded-[2.5rem] glass-nav border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
               "flex items-center gap-3 px-4 py-3 rounded-[1.75rem] transition-all relative group",
               isActive ? "bg-saffron text-white shadow-lg shadow-saffron/20" : "text-slate-500 hover:text-white"
            )}
          >
            <item.icon size={18} />
            {isActive && (
              <motion.span 
                initial={{ width: 0, opacity: 0 }} 
                animate={{ width: 'auto', opacity: 1 }} 
                className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
            )}
          </Link>
        )
      })}
    </div>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#030712] flex flex-col">
        <FloatingNav />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            
            <Route path="/home" element={
              <ProtectedRoute>
                <PageTransition><HomePage /></PageTransition>
              </ProtectedRoute>
            } />
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
      </div>
    </Router>
  )
}

export default App
