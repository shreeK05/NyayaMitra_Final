import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Scale, Mic, FileText, Target, ArrowRight,
  ChevronDown, MessageSquare, Scan, PlayCircle,
  ShieldCheck, Landmark, Award
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

const FEATURES = [
  {
    title: 'Voice Legal Counsel',
    desc: 'Speak naturally in your language (Hindi, Marathi, etc.) and get instant legal guidance.',
    icon: Mic,
    color: '#ff9933',
    link: '/counsellor'
  },
  {
    title: 'Document Auditor',
    desc: 'Upload any legal document to find hidden risks and understand complex clauses instantly.',
    icon: Scan,
    color: '#06b6d4',
    link: '/decoder'
  },
  {
    title: 'Smart Case Tracker',
    desc: 'Never miss a court date. Track deadlines and limitation periods with automatic alerts.',
    icon: Target,
    color: '#10b981',
    link: '/tracker'
  },
  {
    title: 'Legal Forge',
    desc: 'Generate 40+ types of professional legal documents and notices in seconds.',
    icon: FileText,
    color: '#7c3aed',
    link: '/generator'
  }
]

const STATS = [
  { label: 'Citizen Trust', value: '1.4B+', sub: 'Built for India' },
  { label: 'Response Time', value: '< 1s', sub: 'Instant Help' },
  { label: 'Languages', value: '12+', sub: 'Vernacular Support' },
  { label: 'Accuracy', value: '99%', sub: 'Legal Precision' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <div ref={containerRef} className="bg-[#030712] min-h-screen text-white overflow-x-hidden font-display">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-saffron/5 blur-[150px] rounded-full opacity-50" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full opacity-50" />
      </div>

      {/* 1. Hero Hub (Properly Centered) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 z-10 text-center">
         <motion.div 
           initial={{ opacity: 0, y: 30 }} 
           animate={{ opacity: 1, y: 0 }} 
           transition={{ duration: 0.8 }}
           className="max-w-5xl space-y-10"
         >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-saffron text-[10px] lg:text-xs font-black uppercase tracking-[0.4em]">
               <div className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
               Empowering 1.4 Billion Indian Citizens
            </div>

            <h1 className="text-6xl lg:text-[10rem] font-black text-white leading-[0.85] tracking-tighter italic font-display uppercase">
               NYAYA <span className="text-gradient-saffron text-glow-saffron">MITRA</span>
            </h1>

            <p className="text-xl lg:text-4xl text-slate-400 font-medium tracking-tight leading-relaxed max-w-4xl mx-auto italic">
              AI-Powered Legal Justice for Every Indian. <br className="hidden lg:block" /> 
              Instant. Accurate. 100% Secure.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
               <button 
                 onClick={() => navigate('/login')} 
                 className="w-full sm:w-auto px-16 py-8 rounded-full gradient-primary text-white font-black uppercase text-2xl tracking-tighter italic shadow-[0_20px_80px_rgba(255,153,51,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center gap-6 group"
               >
                  Get Started
                  <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
               </button>
               <button className="w-full sm:w-auto px-12 py-8 rounded-full border border-white/10 bg-white/5 text-slate-300 font-black uppercase text-xl tracking-tighter italic hover:bg-white/10 transition-all">
                  Watch Demo
               </button>
            </div>
         </motion.div>

         <motion.div style={{ opacity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-slate-500">
            <span className="text-[10px] uppercase font-black tracking-widest italic opacity-40">Scroll to Explore Features</span>
            <ChevronDown size={32} className="animate-bounce" />
         </motion.div>
      </section>

      {/* 2. Impact Matrix */}
      <section className="py-32 relative z-10 bg-[#030712]/60 backdrop-blur-3xl border-y border-white/5">
         <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
               {STATS.map((s, i) => (
                 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={s.label} className="text-center lg:text-left">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic mb-4">{s.label}</div>
                    <div className="text-5xl lg:text-8xl font-black text-white italic tracking-tighter drop-shadow-2xl">{s.value}</div>
                    <div className="text-[10px] font-black text-saffron uppercase tracking-[0.2em] italic mt-2">{s.sub}</div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 3. Core Capability Hub (Proper Grid Alignment) */}
      <section className="py-48 relative z-10 px-8">
         <div className="max-w-7xl mx-auto space-y-32">
            <div className="text-center space-y-6">
               <h2 className="text-6xl lg:text-[8rem] font-black text-white tracking-tighter leading-none font-display italic uppercase">Simplified Justice</h2>
               <p className="text-slate-500 text-xs lg:text-sm font-black uppercase tracking-[0.5em] italic">Built for common citizens, complex cases, and everything in between.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
               {FEATURES.map((f) => (
                 <motion.div 
                    key={f.title} 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="p-12 lg:p-16 rounded-[4rem] glass-diamond border-white/10 flex flex-col justify-between group relative overflow-hidden h-[450px] shadow-2xl transition-all hover:border-white/20"
                 >
                    <div className="space-y-8 relative z-10">
                       <div className="w-20 h-20 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl" style={{ background: `${f.color}15` }}>
                          <f.icon size={36} style={{ color: f.color }} />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase font-display leading-none">{f.title}</h3>
                          <p className="text-slate-400 text-lg lg:text-xl font-medium leading-relaxed italic opacity-85">{f.desc}</p>
                       </div>
                    </div>
                    <Link to={f.link} className="relative z-10 inline-flex mt-8 self-end">
                       <button className="h-16 px-10 rounded-full glass-card border-white/20 flex items-center gap-4 group-hover:bg-white/5 transition-all shadow-xl group/btn">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover/btn:text-white">Explore Unit</span>
                          <ArrowRight size={20} className="text-slate-500 group-hover/btn:text-white group-hover/btn:translate-x-1" />
                       </button>
                    </Link>
                    {/* Shadow Decor */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 opacity-5 blur-[100px] pointer-events-none rounded-full" style={{ backgroundColor: f.color }} />
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. Final CTA Shield */}
      <section className="py-48 px-6 lg:px-12 relative z-10">
         <motion.div whileInView={{ scale: [0.98, 1], opacity: [0, 1] }} className="max-w-6xl mx-auto p-20 lg:p-32 rounded-[5rem] gradient-primary text-center space-y-12 relative overflow-hidden shadow-[0_50px_150px_rgba(255,153,51,0.25)]">
            <div className="space-y-6 relative z-10">
               <h2 className="text-6xl lg:text-[9rem] font-black text-white tracking-tighter leading-[0.85] italic font-display uppercase">
                  Justice for <br />
                  <span className="text-black/40">Everyone.</span>
               </h2>
               <p className="text-white/80 text-xl lg:text-3xl font-medium max-w-3xl mx-auto italic leading-relaxed mt-8">
                  No hidden fees. No complicated jargon. Just the legal help you deserve, in the language you speak.
               </p>
            </div>

            <div className="flex justify-center relative z-10 pt-10">
               <button 
                 onClick={() => navigate('/login')} 
                 className="h-28 px-16 rounded-full bg-slate-950 text-white font-black text-2xl lg:text-4xl tracking-tighter italic uppercase shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-8 group"
               >
                  Join NyayaMitra Now
                  <ArrowRight size={48} className="group-hover:translate-x-3 transition-transform" />
               </button>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-12 opacity-30">
               {[Award, ShieldCheck, Scale, Landmark].map((Icon, i) => (
                 <Icon key={i} size={48} className="text-white grayscale" />
               ))}
            </div>
         </motion.div>
      </section>

      {/* Footer Alignment */}
      <footer className="py-24 border-t border-white/5 bg-[#030712]/80 relative z-10">
         <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl">
                  <Scale size={24} className="text-saffron" />
               </div>
               <span className="text-2xl font-black italic tracking-tighter uppercase font-display">NyayaMitra<span className="text-saffron">.</span></span>
            </div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">
               <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
               <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
               <span className="hover:text-white cursor-pointer transition-colors">Support</span>
            </div>
         </div>
         <p className="text-center text-slate-800 text-[11px] font-black uppercase tracking-[1em] mt-24 italic">Automated Justice System 🇮🇳 2024</p>
      </footer>
    </div>
  )
}
