import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
/**
 * NyayaMitra - Production Deploy v1.0.1
 * Triggering fresh build with correct VITE_API_URL
 */
import { useEffect } from 'react'
import BottomNav from '@/components/layout/BottomNav'
import TopBar from '@/components/layout/TopBar'
import HomePage from '@/pages/HomePage'
import VoiceCounsellorPage from '@/pages/VoiceCounsellorPage'
import DocumentDecoderPage from '@/pages/DocumentDecoderPage'
import DocumentGeneratorPage from '@/pages/DocumentGeneratorPage'
import AmendmentTrackerPage from '@/pages/AmendmentTrackerPage'
import CaseTrackerPage from '@/pages/CaseTrackerPage'
import NyayaScorePage from '@/pages/NyayaScorePage'
import NegotiationCoachPage from '@/pages/NegotiationCoachPage'
import LoginPage from '@/pages/LoginPage'
import LandingPage from '@/pages/LandingPage'
import Sidebar from '@/components/layout/Sidebar'
import { useAppStore } from '@/store/appStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user)
  if (!user?.isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const location = useLocation()
  const { setIsOnline, user } = useAppStore()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setIsOnline])

  const isLoginPage = location.pathname === '/login'
  const isLandingPage = location.pathname === '/' && !user?.isLoggedIn
  const hideNav = ['/counsellor', '/negotiate'].includes(location.pathname) || isLandingPage

  if (isLoginPage || isLandingPage) {
    return (
      <AnimatePresence mode="wait">
        <Routes key="public">
          <Route path="/login" element={user?.isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col gradient-hero relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-64 -left-32 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #ff9933 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col lg:pl-64 w-full relative z-10 transition-all">
        <TopBar />

        <main className="flex-1 flex flex-col overflow-y-auto pb-20 lg:pb-0 relative">
          <AnimatePresence mode="wait">
            <Routes key={location.pathname} location={location}>
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/counsellor" element={<ProtectedRoute><VoiceCounsellorPage /></ProtectedRoute>} />
              <Route path="/decoder" element={<ProtectedRoute><DocumentDecoderPage /></ProtectedRoute>} />
              <Route path="/generator" element={<ProtectedRoute><DocumentGeneratorPage /></ProtectedRoute>} />
              <Route path="/amendments" element={<ProtectedRoute><AmendmentTrackerPage /></ProtectedRoute>} />
              <Route path="/cases" element={<ProtectedRoute><CaseTrackerPage /></ProtectedRoute>} />
              <Route path="/score" element={<ProtectedRoute><NyayaScorePage /></ProtectedRoute>} />
              <Route path="/negotiate" element={<ProtectedRoute><NegotiationCoachPage /></ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </main>

        {!hideNav && <BottomNav />}
      </div>
    </div>
  )
}
