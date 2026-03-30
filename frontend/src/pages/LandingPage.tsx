import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scale, ShieldCheck, Globe, Zap, Database, 
  ChevronRight, ArrowRight, PlayCircle, Menu, 
  Lock, Activity, Gavel, Mic, FileText, BarChart3, 
  AlertCircle, MessageSquare
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pillars = [
    { icon: <Mic className="text-saffron" />, name: "Voice Counsellor", desc: "Speak naturally in your language for instant advice." },
    { icon: <FileText className="text-indigo" />, name: "Document Decoder", desc: "Scan complex legal docs for hidden traps." },
    { icon: <Database className="text-emerald" />, name: "Case Tracker", desc: "Real-time updates from eCourts & statutes." },
    { icon: <BarChart3 className="text-gold" />, name: "NyayaScore", desc: "Measure your legal health & risk profile." },
  ]

  return (
    <div className="bg-navy min-h-screen text-slate-100 font-display selection:bg-saffron/30 selection:text-white">
      
      {/* 🌌 Atmospheric Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-saffron/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* 🧭 Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'glass-nav py-4' : 'py-8'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center shadow-lg shadow-saffron/20 group-hover:rotate-12 transition-transform">
              <Scale size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Nyaya<span className="text-saffron">Mitra</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['Pillars', 'Architecture', 'Safety', 'Legislation'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-widest">{item}</a>
            ))}
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-3 rounded-full gradient-saffron text-white font-bold text-sm shadow-lg shadow-saffron/20 hover:scale-105 active:scale-95 transition-all"
            >
              Get Started
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="relative z-10 pt-48 pb-32 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald">Neural Legal v2.0 Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-8 italic uppercase">
            Justice <span className="text-gradient-saffron">Simplified.</span><br />
            AI <span className="text-white/20">Empowered.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto mb-12">
            The world's first <span className="text-white">Neural Justice Node</span> for every Indian citizen. Instant legal advice, document verification, and court tracking in your language.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl gradient-saffron text-white font-bold text-lg shadow-2xl shadow-saffron/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Start Your Consultation
              <ArrowRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 rounded-2xl glass-panel text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <PlayCircle size={20} className="text-saffron" />
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* 🏛️ The 7 Pillars Grid */}
      <section id="pillars" className="relative z-10 py-32 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">The Seven <span className="text-saffron">Pillars</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive legal assistance powered by advanced RAG and distributed ledger technology.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-[2.5rem] group cursor-pointer border-glow"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{pillar.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🛡️ Safety Node (Side highlight) */}
      <section className="relative z-10 py-32 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-1/2">
            <div className="inline-block px-4 py-2 rounded-lg bg-indigo/10 border border-indigo/20 text-indigo font-bold text-xs uppercase tracking-widest mb-6">
              Neural Security Protocol
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight uppercase">Your Data, <span className="text-indigo">Fortified.</span></h2>
            <div className="space-y-6">
              {[
                { title: "AES-256 Encryption", desc: "All legal data is encrypted client-side before reaching our nodes." },
                { title: "Blockchain Verification", desc: "Documents are timestamped on the Polygon network for immutable proof." },
                { title: "Zero-Knowledge Architecture", desc: "We never store your personal secrets in plaintext." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-indigo/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={14} className="text-indigo" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
             <div className="relative glass-card p-12 rounded-[3rem] border-white/5 rotate-3 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo/10 blur-[80px] rounded-full" />
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-indigo flex items-center justify-center">
                            <Lock size={24} className="text-white" />
                         </div>
                         <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status</span>
                            <h4 className="font-bold text-emerald">ACTIVE_PROTECT</h4>
                         </div>
                      </div>
                      <Activity size={24} className="text-slate-700" />
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-full bg-indigo shadow-[0_0_15px_#6366f1]" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                         <span className="text-[8px] font-black text-slate-500 uppercase">Latency</span>
                         <div className="text-lg font-black italic tracking-tighter">14ms</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                         <span className="text-[8px] font-black text-slate-500 uppercase">Uptime</span>
                         <div className="text-lg font-black italic tracking-tighter">100%</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 🏁 Footer */}
      <footer className="relative z-10 pt-32 pb-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg gradient-saffron flex items-center justify-center">
                  <Scale size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold">NyayaMitra</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-xs">
                Empowering every citizen with high-end AI legal intelligence. Accessible, affordable, and absolute.
              </p>
            </div>
            {[
              { name: 'Product', links: ['Features', 'NyayaScore', 'Voice AI', 'Case Tracking'] },
              { name: 'Company', links: ['About Us', 'Safety Protocol', 'Legal Ethics', 'Careers'] },
              { name: 'Support', links: ['Documentation', 'Help Center', 'API Access', 'Contact'] }
            ].map((col) => (
              <div key={col.name}>
                <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-300">{col.name}</h5>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5">
            <p className="text-xs text-slate-600">© 2026 Team Return 0; All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-slate-600 hover:text-white transition-colors cursor-pointer tracking-widest uppercase">Privacy</span>
              <span className="text-xs text-slate-600 hover:text-white transition-colors cursor-pointer tracking-widest uppercase">Terms</span>
              <span className="text-xs text-slate-600 hover:text-white transition-colors cursor-pointer tracking-widest uppercase">Nodes</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 🧩 Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[2000] bg-navy/95 backdrop-blur-2xl p-10 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5">
                <ArrowRight className="rotate-180" size={20} />
              </button>
            </div>
            <div className="space-y-8">
              {['Home', 'Pillars', 'Safety', 'Legislation'].map((item) => (
                <div key={item} className="text-6xl font-black uppercase italic tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-pointer">{item}</div>
              ))}
            </div>
            <button className="w-full py-6 rounded-2xl gradient-saffron text-white font-bold" onClick={() => navigate('/login')}>Initialize System</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

