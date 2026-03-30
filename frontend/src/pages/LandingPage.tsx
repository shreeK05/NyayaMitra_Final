import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scale, ShieldCheck, Globe, Zap, Database, 
  ChevronRight, ArrowRight, PlayCircle, Menu, 
  Lock, Activity, Gavel, Mic, FileText, BarChart3, 
  AlertCircle, MessageSquare, Fingerprint, Sparkles,
  Search, Shield, Briefcase, Landmark, ShoppingCart
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils'

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
    { icon: <Mic />, name: "Voice Counsel", desc: "Speak naturally in your native language for instant statutory guidance.", color: "var(--saffron)" },
    { icon: <FileText />, name: "Doc Decoder", desc: "Scan complex legal instruments for hidden risks and hidden traps.", color: "var(--indigo)" },
    { icon: <Database />, name: "Docket Tracker", desc: "Real-time synchronization with eCourts and legislative nodes.", color: "var(--emerald)" },
    { icon: <BarChart3 />, name: "NyayaScore", desc: "A comprehensive neural audit of your legal health and risk profile.", color: "var(--gold)" },
    { icon: <ShieldCheck />, name: "Law Timeline", desc: "Gazette-level surveillance for all Bharatiya Nyaya Sanhita updates.", color: "var(--saffron)" },
    { icon: <MessageSquare />, name: "Coach Matrix", desc: "Simulate high-stakes negotiations with AI-driven tactical insights.", color: "var(--emerald)" },
    { icon: <Sparkles />, name: "Doc Foundry", desc: "Forge admissible legal drafts using validated procedural templates.", color: "var(--indigo)" },
    { icon: <Briefcase />, name: "Entity Hub", desc: "Manage corporate and individual statutory identities in one vault.", color: "var(--gold)" },
  ]

  return (
    <div className="bg-[#030712] min-h-screen text-slate-100 font-display selection:bg-saffron/30 selection:text-white overflow-x-hidden">
      
      {/* 🌌 Atmospheric Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-indigo/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-saffron/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      {/* 🧭 Strategic Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 w-full z-[1000] transition-all duration-700",
        scrolled ? "glass-nav py-4 bg-[#030712]/80 backdrop-blur-3xl border-b border-white/5" : "py-10"
      )}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-12 h-12 rounded-xl gradient-saffron flex items-center justify-center shadow-2xl shadow-saffron/20 group-hover:rotate-12 transition-transform duration-500">
              <Scale size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter italic uppercase font-display leading-none">Nyaya<span className="text-saffron">Mitra</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-12 bg-white/2 border border-white/5 px-10 py-3 rounded-full glass-card">
            {['Pillars', 'Security', 'Intelligence', 'Sync'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.4em] italic">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="hidden sm:flex px-10 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest transition-all border border-white/10 shadow-xl"
            >
              INITIALIZE_LOG
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-10 py-3.5 rounded-2xl gradient-saffron text-white font-black text-xs uppercase tracking-widest shadow-[0_15px_40px_rgba(255,153,51,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              LAUNCH_NODE
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Centerpiece */}
      <section className="relative z-10 pt-56 pb-40 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/2 border border-white/5 mb-16 backdrop-blur-2xl shadow-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Neural Justice Network Active <span className="text-emerald ml-4">v4.3.0</span></span>
          </div>
          
          <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.85] tracking-tighter mb-12 italic uppercase font-display select-none">
            Justice <span className="text-glow-saffron text-gradient-saffron">Decoded.</span><br />
            AI <span className="text-white/10">Unified.</span>
          </h1>

          <p className="text-2xl md:text-3xl text-slate-500 font-medium leading-relaxed max-w-4xl mx-auto mb-20 italic">
            The world's first <span className="text-white font-black">Neural Justice Node</span> for every Indian citizen. Instant statutory guidance, forensic document audits, and real-time eCourts synchronization.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-16 py-8 rounded-[2.5rem] gradient-saffron text-white font-black text-2xl uppercase tracking-tighter italic shadow-[0_40px_100px_rgba(255,153,51,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6"
            >
              LAUNCH INTERFACE
              <ArrowRight size={28} />
            </button>
            <button className="w-full sm:w-auto px-16 py-8 rounded-[2.5rem] glass-card border-white/10 text-white font-black text-2xl uppercase tracking-tighter italic hover:bg-white/5 transition-all flex items-center justify-center gap-6 border-glow shadow-2xl">
              <PlayCircle size={28} className="text-saffron" />
              SYSTEM_DEMO
            </button>
          </div>
        </motion.div>

        {/* Floating Asset */}
        <motion.div 
           initial={{ opacity: 0, y: 100 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, duration: 1 }}
           className="mt-40 relative max-w-5xl mx-auto group"
        >
           <div className="absolute inset-0 bg-saffron/10 blur-[150px] rounded-full group-hover:bg-saffron/20 transition-all duration-1000" />
           <div className="relative glass-card rounded-[4rem] border-white/10 border-glow overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.8)]">
              <div className="h-16 border-b border-white/5 bg-white/2 flex items-center justify-between px-10">
                 <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald/40" />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800 italic">Neural_Interface_Preview</div>
                 <div className="w-20" />
              </div>
              <div className="p-16 aspect-video bg-black/40 flex flex-col items-center justify-center text-center space-y-10 group-hover:scale-[1.01] transition-transform duration-1000">
                 <div className="w-32 h-32 rounded-[2.5rem] bg-indigo/10 border border-indigo/20 flex items-center justify-center text-indigo shadow-[0_0_50px_rgba(99,102,241,0.2)] animate-neural-pulse">
                    <Fingerprint size={64} />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-5xl font-black italic uppercase tracking-tighter font-display leading-none text-white">Identity Verified</h3>
                    <p className="text-slate-600 text-xl font-medium italic tracking-widest opacity-60">Synchronizing BNS Ledger v4.3.0...</p>
                 </div>
              </div>
           </div>
        </motion.div>
      </section>

      {/* 🏛️ The Eight Pillars Grid */}
      <section id="pillars" className="relative z-10 py-40 container mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center justify-center text-center space-y-8 mb-32">
          <span className="text-[11px] font-black uppercase tracking-[1em] text-saffron italic opacity-80">Operational_Core</span>
          <h2 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter italic font-display leading-none text-white">The Eight <span className="text-gradient-saffron">Pillars</span></h2>
          <p className="text-slate-500 text-xl md:text-2xl font-medium max-w-3xl leading-relaxed italic opacity-80">A comprehensive legal architecture powering real-time justice for Bharat.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="glass-card p-12 rounded-[3.5rem] group cursor-pointer border-glow bg-black/40 shadow-2xl relative overflow-hidden h-[380px] flex flex-col justify-between hover:scale-[1.02] transition-all"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-45" style={{ color: pillar.color }}>
                {pillar.icon}
              </div>
              <div className="w-20 h-20 rounded-[2rem] bg-black border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-2xl relative overflow-hidden" style={{ color: pillar.color }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: pillar.color }} />
                <div className="scale-125 relative z-10">{pillar.icon}</div>
              </div>
              <div className="space-y-4 relative z-10">
                 <h3 className="text-3xl font-black italic uppercase tracking-tighter font-display text-white leading-none italic">{pillar.name}</h3>
                 <p className="text-lg text-slate-500 font-medium leading-relaxed italic opacity-70 group-hover:opacity-100 transition-opacity">{pillar.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🛡️ Safety Hub */}
      <section id="security" className="relative z-10 py-40 overflow-hidden bg-white/[0.01]">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-32">
          <div className="w-full lg:w-1/2 space-y-16">
            <div className="space-y-6">
              <div className="inline-block px-8 py-2.5 rounded-2xl bg-indigo/10 border border-indigo/20 text-indigo font-black text-xs uppercase tracking-[0.4em] italic shadow-2xl">
                Neural Governance Protocol
              </div>
              <h2 className="text-6xl md:text-8xl font-black mb-8 leading-[0.85] uppercase italic font-display tracking-tighter text-white">Your Data, <br /><span className="text-indigo text-glow-indigo">Fortified.</span></h2>
            </div>
            <div className="space-y-12">
              {[
                { title: "AES-256 Core Encryption", desc: "Every transcript and document hash is encrypted with military-grade protocols before decentralization." },
                { title: "Distributed Ledger Proof", desc: "Statutory submissions are timestamped on-chain for immutable verification across global nodes." },
                { title: "Zero-Knowledge Synthesis", desc: "NyayaMitra processes your legal queries without storing personally identifiable plaintext." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="mt-1 w-12 h-12 rounded-[1.25rem] bg-indigo/10 border border-indigo/20 flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 group-hover:bg-indigo group-hover:text-white shadow-2xl">
                    <ShieldCheck size={24} className="text-indigo group-hover:text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white font-display italic leading-none">{feature.title}</h4>
                    <p className="text-lg text-slate-600 font-medium italic opacity-80 leading-relaxed max-w-xl">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative group">
             <div className="absolute inset-0 bg-indigo/10 blur-[200px] rounded-full group-hover:bg-indigo/20 transition-all duration-1000" />
             <div className="relative glass-card p-16 lg:p-24 rounded-[5rem] border-white/10 rotate-3 overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.8)] border-glow bg-black/60 scale-105 group-hover:scale-110 transition-transform duration-700">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo/10 blur-[100px] rounded-full" />
                <div className="relative z-10 space-y-16">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                         <div className="w-20 h-20 rounded-[2.5rem] bg-indigo flex items-center justify-center shadow-[0_20px_50px_rgba(99,102,241,0.4)] animate-neural-pulse border-2 border-white/20">
                            <Lock size={36} className="text-white" />
                         </div>
                         <div className="space-y-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-700 italic">Security_Layer_Active</span>
                            <h4 className="text-3xl font-black text-emerald italic uppercase tracking-tighter font-display leading-none">ACTIVE_PROTECT_MODE</h4>
                         </div>
                      </div>
                      <Activity size={32} className="text-slate-800" />
                   </div>
                   <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden shadow-inner border border-white/5">
                      <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-indigo shadow-[0_0_30px_#6366f1]" />
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 shadow-inner">
                         <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] block mb-4 italic">Neural_Latency</span>
                         <div className="text-4xl font-black italic tracking-tighter text-white font-display text-glow-indigo leading-none">12ms</div>
                      </div>
                      <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 shadow-inner">
                         <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] block mb-4 italic">Node_Uptime</span>
                         <div className="text-4xl font-black italic tracking-tighter text-emerald font-display text-glow-indigo leading-none">100%</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 🏁 Footer */}
      <footer className="relative z-10 pt-48 pb-20 border-t border-white/5 bg-[#030712]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
            <div className="col-span-2 lg:col-span-1 space-y-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl gradient-saffron flex items-center justify-center shadow-2xl shadow-saffron/20">
                  <Scale size={24} className="text-white" />
                </div>
                <span className="text-3xl font-black tracking-tighter uppercase italic font-display">NyayaMitra</span>
              </div>
              <p className="text-xl text-slate-600 font-medium leading-relaxed italic opacity-80 max-w-sm font-display">
                Empowering every citizen with elite AI legal intelligence. <br />Accessible. Affordable. Absolute.
              </p>
              <div className="flex gap-4">
                 {['X', 'LinkedIn', 'Github'].map(s => (
                   <div key={s} className="w-12 h-12 rounded-xl glass-card border border-white/10 flex items-center justify-center text-[10px] font-black uppercase text-slate-700 hover:text-white hover:border-white/20 transition-all cursor-pointer">{s[0]}</div>
                 ))}
              </div>
            </div>
            {[
              { name: 'Capabilities', links: ['Neural Audit', 'Voice Link', 'Forge Node', 'Surveillance'] },
              { name: 'Governance', links: ['Safety Protocols', 'Transparency', 'Ethics Board', 'Node Uptime'] },
              { name: 'Ecosystem', links: ['Architecture', 'API Access', 'Whitepaper', 'Contact Support'] }
            ].map((col) => (
              <div key={col.name} className="space-y-10">
                <h5 className="font-black mb-8 uppercase text-[10px] tracking-[0.6em] text-slate-700 italic border-b border-white/5 pb-6">{col.name}</h5>
                <ul className="space-y-6">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-lg font-black text-slate-600 hover:text-white transition-all uppercase italic tracking-tighter font-display leading-none">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-16 border-t border-white/5">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.8em] italic">© 2026 Team Return 0_ | Distributed Justice Matrix</p>
            <div className="flex items-center gap-10">
              {['Privacy', 'Standard', 'Status'].map(t => (
                 <span key={t} className="text-[10px] font-black text-slate-800 hover:text-indigo transition-colors cursor-pointer tracking-[0.4em] uppercase italic">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* 🧩 Neural Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[2000] bg-[#030712]/98 backdrop-blur-3xl p-12 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-12">
              <span className="text-3xl font-black italic uppercase tracking-tighter font-display">Interface</span>
              <button onClick={() => setIsMenuOpen(false)} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <ArrowRight className="rotate-180" size={28} />
              </button>
            </div>
            <div className="space-y-12">
              {['Pillars', 'Security', 'Intelligence', 'Protocol'].map((item) => (
                <div key={item} className="text-7xl font-black uppercase italic tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-pointer font-display leading-none">{item}</div>
              ))}
            </div>
            <button className="w-full py-8 rounded-[2.5rem] gradient-saffron text-white font-black text-2xl uppercase tracking-tighter italic" onClick={() => navigate('/login')}>INITIALIZE SESSION</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
