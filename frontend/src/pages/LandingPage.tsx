import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Scale, ArrowRight, Shield, Globe, Zap, Mic } from 'lucide-react'

// Simulated 3D Tilt Card
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`p-6 rounded-3xl backdrop-blur-xl border border-white/10 ${className}`}
    style={{ transformStyle: 'preserve-3d', background: 'rgba(21, 31, 58, 0.4)' }}
  >
    {children}
  </motion.div>
)

export default function LandingPage() {
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])

  return (
    <div className="min-h-dvh bg-slate-950 text-white overflow-x-hidden selection:bg-orange-500/30">
      
      {/* 3D Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none perspective-1000">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" 
             style={{ transform: 'rotateX(60deg) scale(1.5) translateY(20%)', transformOrigin: 'top center' }} />
             
        {/* Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <nav className="fixed top-0 w-full z-50 pt-6 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center glow-saffron shadow-lg shadow-orange-500/20">
            <Scale size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            NyayaMitra
          </span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-full text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md"
        >
          Sign In
        </button>
      </nav>

      <main className="relative z-10 pt-32 lg:pt-48 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-400 text-xs font-bold tracking-wider uppercase">V3.0 Legal Intelligence</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Predictive Justice, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 glow-text drop-shadow-[0_0_15px_rgba(255,153,51,0.3)]">
                In Your Language.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed font-medium">
              The world's first AI legal counselor natively designed for 600M+ Indians. 
              Voice-first rights guidance, document decoding, and predictive case tracking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg shadow-[0_0_40px_rgba(255,153,51,0.4)] hover:shadow-[0_0_60px_rgba(255,153,51,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              Start Free Consultation
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg backdrop-blur-md transition-all"
            >
              Explore Capabilities
            </button>
          </motion.div>
        </div>

        {/* Floating 3D Device Mocks (CSS pseudo-3D) */}
        <div className="mt-24 lg:mt-32 relative h-[400px] lg:h-[600px] perspective-1000 text-center">
          <motion.div style={{ y: y1 }} className="absolute left-0 top-10 lg:w-72 bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-4 border border-white/10 shadow-2xl rotate-y-[15deg] rotate-x-[5deg] -rotate-12 hidden lg:block opacity-60 blur-[1px]">
             <div className="h-40 bg-white/5 rounded-xl mb-3" />
             <div className="h-8 bg-white/5 rounded-lg w-3/4" />
          </motion.div>

          <motion.div className="mx-auto max-w-3xl aspect-video bg-slate-900 rounded-xl lg:rounded-[2rem] border border-white/10 shadow-[0_0_100px_rgba(124,58,237,0.15)] overflow-hidden relative z-10"
              initial={{ rotateX: 20, scale: 0.9, y: 50, opacity: 0 }}
              animate={{ rotateX: 0, scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, type: 'spring' }}
              style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Dashboard Mock UI */}
            <div className="w-full h-full flex flex-col">
              <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <div className="ml-4 h-6 w-48 bg-white/5 rounded-md" />
              </div>
              <div className="flex-1 p-6 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <div className="h-32 bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/20 rounded-2xl p-4 flex flex-col justify-end">
                     <div className="h-6 w-1/3 bg-orange-400/50 rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white/5 rounded-2xl" />
                    <div className="h-24 bg-white/5 rounded-2xl" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-40 bg-purple-500/10 border border-purple-500/20 rounded-2xl" />
                  <div className="h-20 bg-white/5 rounded-2xl" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="absolute right-0 bottom-10 lg:w-72 bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-4 border border-white/10 shadow-2xl -rotate-y-[15deg] rotate-x-[5deg] rotate-12 hidden lg:block opacity-60 blur-[1px]">
             <div className="h-40 bg-white/5 rounded-xl mb-3" />
             <div className="h-8 bg-white/5 rounded-lg w-3/4" />
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="mt-32 grid md:grid-cols-3 gap-6 lg:gap-8">
          <TiltCard className="group">
            <Mic className="text-orange-400 w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Voice Native AI</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Speak your problem in Hindi, Marathi, Bengali, Tamil, Telugu, or English. Instant, highly accurate legal mapping.
            </p>
          </TiltCard>
          <TiltCard className="group">
            <Globe className="text-cyan-400 w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Multimodal Decoder</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Scan complex court orders or property documents. The AI breaks them down into simple terms in seconds.
            </p>
          </TiltCard>
          <TiltCard className="group">
            <Shield className="text-purple-400 w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Predictive Tracking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Machine learning algorithms analyze millions of past verdicts to predict your case's win probability and next steps.
            </p>
          </TiltCard>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm relative z-10 backdrop-blur-lg">
        <p>&copy; 2026 NyayaMitra Web & Mobile Application. All rights reserved.</p>
        <p className="mt-2">Made for Bharat.</p>
      </footer>
    </div>
  )
}
