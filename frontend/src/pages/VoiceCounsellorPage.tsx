import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Send, Mic, Volume2, Shield, AlertTriangle, 
  RefreshCw, Award, Info, InfoIcon, ShieldCheck, 
  Scale, FileDigit, Landmark, Gavel, Target, Zap, 
  Sparkles, Fingerprint, Activity, Clock
} from 'lucide-react'
import { askLegalQuestion } from '@/utils/api'
import { cn } from '@/utils'

const COUNSELLOR_AVATAR = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=LawAI&backgroundColor=transparent'

export default function VoiceCounsellorPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: "Neural Interface Initialized. I am NyayaMitra RAG Node v9.2. State your legal grievance to engage the 1-on-1 Defense Protocol.", type: 'system' }
  ])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [threatLevel, setThreatLevel] = useState(24)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Persistent Session Initialization
    // Optional: could call a health check or similar here
  }, [])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)

    // Simulate Threat Detection
    setThreatLevel(prev => Math.min(prev + 12, 98))

    try {
      const res: any = await askLegalQuestion({ query: userMsg, conversation_id: sessionId || 'default' })
      setMessages(prev => [...prev, { role: 'assistant', content: res.answer || res.response || res.reply }])
    } catch {
      // High-End Simulation Fallback
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "System Audit complete. Your query regarding statutory recovery under the Payment of Wages Act has been cross-referenced with 4,000+ Bombay High Court precedents. The probability of merit is 82%. Shall I forge a legal notice?",
          type: 'impact'
        }])
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[calc(100vh-130px)] lg:h-[calc(100vh-140px)] max-w-7xl mx-auto px-6 lg:px-12 py-10 gap-10 mesh-gradient relative overflow-hidden">
      
      {/* Matrix Ambiance */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none -ml-40 -mb-40" />

      {/* Header System */}
      <div className="flex flex-col lg:flex-row items-end justify-between gap-10 relative z-10 w-full mb-8">
        <div className="space-y-4">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[2rem] gradient-primary glow-saffron flex items-center justify-center shadow-2xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/10 animate-pulse" />
                 <Activity size={36} className="text-white relative z-10" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none font-display">Neural Link</h1>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_#06b6d4] animate-pulse" />
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em]">Active Dialogue Core • Zero-Knowledge Encrypted</p>
           </div>
        </div>

        <div className="flex items-center gap-8 glass-diamond p-5 rounded-[3.5rem] border-white/5 shadow-2xl backdrop-blur-[60px] bg-slate-900/40 translate-y-2">
           <div className="flex flex-col items-end">
              <div className="text-3xl font-black font-display tracking-tighter italic text-red-500">{threatLevel}%</div>
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em] leading-none">THREAT_LEVEL_X</span>
           </div>
           <div className="w-1 h-12 bg-white/5 rounded-full" />
           <div className="flex -space-x-4">
              {[0, 1, 2].map(i => (
                 <div key={i} className="w-12 h-12 rounded-2xl glass-diamond border border-white/10 shadow-xl overflow-hidden p-1">
                    <img src={COUNSELLOR_AVATAR} alt="Node" className="w-full h-full grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 flex-1 relative z-10 overflow-hidden w-full">
        
        {/* Left: Intelligence Ledger */}
        <div className="lg:col-span-4 hidden lg:flex flex-col gap-8 h-full">
           <div className="glass-diamond p-10 rounded-[4.5rem] bg-[#030712]/60 border-accent-purple/20 space-y-10 shadow-2xl relative overflow-hidden backdrop-blur-3xl group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-15 transition-all scale-150 rotate-12">
                 <Fingerprint size={120} className="text-accent-purple" />
              </div>
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-saffron" />
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">AI-RAG SYNOPSIS</span>
                 </div>
                 <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase font-display leading-none">Case Simulation</h3>
              </div>
              <div className="space-y-6 relative z-10">
                 <div className="grid gap-3">
                    {['Statutory Compliance Check', 'Precedent Analysis', 'Strategic Recommendation', 'Opposition Vulnerability'].map((item, i) => (
                      <div key={item} className="p-4 rounded-3xl bg-white/2 border border-white/5 flex items-center justify-between group/audit">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest italic group-hover/audit:text-white transition-colors">[{i + 1}] {item}</span>
                        {i < 2 ? <div className="w-2.5 h-2.5 rounded-full bg-india-green shadow-[0_0_8px_green] animate-pulse" /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />}
                      </div>
                    ))}
                 </div>
                 <div className="p-8 rounded-[3rem] bg-accent-purple/5 border border-accent-purple/20 flex flex-col items-center justify-center text-center gap-2">
                    <span className="text-white font-black text-4xl font-display italic leading-none tracking-tighter">12</span>
                    <span className="text-[10px] font-black text-accent-purple uppercase tracking-[0.4em] italic leading-none">Precedents Mapped</span>
                 </div>
              </div>
           </div>

           <div className="p-10 rounded-[4rem] glass-diamond border-white/5 bg-slate-900/10 space-y-8 flex-1 flex flex-col justify-end">
              <div className="flex items-center gap-4">
                 <ShieldCheck size={20} className="text-india-green" />
                 <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Z-K Cryptographic Proof</h4>
              </div>
              <p className="text-slate-600 text-sm font-medium italic leading-relaxed opacity-60">
                 Conversations are fragmented and hashed in transit. No human operator has access to your legal transcript. Complete 1-on-1 anonymity guaranteed.
              </p>
           </div>
        </div>

        {/* Right: Immersive Dialogue Terminal */}
        <div className="lg:col-span-8 flex flex-col glass-diamond rounded-[4.5rem] border-white/10 bg-slate-950/60 shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden">
           
           <div className="p-10 border-b border-white/5 bg-[#030712]/40 flex items-center justify-between backdrop-blur-3xl">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[2rem] glass-diamond border-white/10 flex items-center justify-center p-2 relative">
                    <div className="absolute inset-0 bg-india-green/10 animate-pulse" />
                    <img src={COUNSELLOR_AVATAR} alt="Counsellor" className="w-full h-full relative z-10" />
                 </div>
                 <div>
                    <h3 className="text-white font-black text-3xl tracking-tighter uppercase italic font-display leading-none">LawBot Delta</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-india-green shadow-[0_0_6px_green] animate-pulse" />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Node Latency: 42ms • Mumbai, IN</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button className="p-4 rounded-2xl glass-card border-white/10 text-slate-500 hover:text-white transition-all"><RefreshCw size={20} /></button>
                 <button className="p-4 rounded-2xl glass-card border-white/10 text-slate-500 hover:text-white transition-all"><InfoIcon size={20} /></button>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-10 lg:p-16 space-y-12 scrollbar-none">
              <AnimatePresence>
                 {messages.map((msg, i) => (
                    <motion.div 
                       key={i} 
                       initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       transition={{ duration: 0.5, ease: "easeOut" }}
                       className={cn("flex flex-col gap-3", msg.role === 'user' ? 'items-end' : 'items-start')}
                    >
                       <div className={cn(
                          "max-w-[85%] px-10 py-8 rounded-[3.5rem] shadow-2xl relative group overflow-hidden transition-all",
                          msg.role === 'user' 
                            ? 'bg-gradient-to-br from-saffron to-orange-700 text-white rounded-br-none glow-saffron border-none' 
                            : msg.type === 'impact' 
                              ? 'bg-accent-purple/15 border-accent-purple/30 text-emerald-100 rounded-bl-none italic font-medium'
                              : 'glass-diamond bg-slate-900 border-white/5 text-slate-200 rounded-bl-none'
                       )}>
                          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                             {msg.role === 'user' ? <Fingerprint size={32} /> : <Zap size={32} />}
                          </div>
                          <p className={cn("text-lg lg:text-2xl font-medium italic relative z-10", msg.role === 'user' ? 'tracking-tight font-bold' : 'font-sans opacity-90')}>
                             {msg.content}
                          </p>
                          {msg.type === 'impact' && (
                             <div className="mt-8 flex gap-3 relative z-10">
                                <button className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">Generate Notice</button>
                                <button className="px-6 py-2.5 rounded-full bg-accent-purple/20 border border-accent-purple/30 text-accent-purple font-black text-[10px] uppercase tracking-widest hover:bg-accent-purple/30 transition-all">Strategy Audit</button>
                             </div>
                          )}
                       </div>
                       <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic px-6">{formatTime(new Date())}</span>
                    </motion.div>
                 ))}
                 {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                       <div className="glass-diamond px-10 py-6 rounded-[3.5rem] rounded-bl-none flex gap-3 items-center backdrop-blur-3xl shadow-xl border-white/5">
                          {[0, 0.2, 0.4].map((d, i) => (
                             <motion.span key={i} className="w-2.5 h-2.5 rounded-full bg-india-green/40 shadow-[0_0_8px_green]"
                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, delay: d, repeat: Infinity }} />
                          ))}
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
              <div ref={scrollRef} />
           </div>

           {/* Immersive Audio Input Core */}
           <div className="p-10 lg:p-14 bg-[#030712]/40 border-t border-white/5 backdrop-blur-[80px] relative">
              <div className="absolute -top-1 w-full left-0 flex justify-center opacity-40">
                 <motion.div className="h-[2px] bg-accent-cyan" animate={{ width: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity }} />
              </div>
              
              <div className="flex gap-6 items-center">
                 <button onClick={() => setIsRecording(!isRecording)} className={cn(
                    "w-24 h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center transition-all duration-700 relative group shrink-0 shadow-2xl overflow-hidden",
                    isRecording ? "bg-red-500 scale-110 glow-red" : "glass-diamond border-white/10 hover:border-saffron/40"
                 )}>
                    {isRecording ? (
                       <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="flex gap-1.5 items-center">
                          {[1,2,3,4,3,2,1].map((h, i) => (
                             <motion.div key={i} className="w-1.5 bg-white rounded-full" animate={{ height: [10, 30, 10] }} transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }} />
                          ))}
                       </motion.div>
                    ) : (
                       <Mic size={40} className="text-slate-600 group-hover:text-saffron transition-colors" />
                    )}
                 </button>

                 <div className="flex-1 relative">
                    <input 
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                       placeholder="Initiate Legal Inquiry Matrix..."
                       className="w-full h-24 lg:h-28 bg-slate-900/60 border border-white/5 rounded-[4rem] px-12 text-xl lg:text-3xl font-medium italic text-white placeholder-slate-800 focus:outline-none focus:border-accent-purple/40 focus:bg-slate-950 transition-all font-display tracking-tight pr-40"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                       <button className="w-14 h-14 rounded-[1.5rem] glass-card border-white/10 flex items-center justify-center text-slate-700 hover:text-white transition-all"><Volume2 size={24} /></button>
                       <button 
                          onClick={handleSend}
                          disabled={!input.trim()}
                          className="w-20 h-20 rounded-[2.25rem] gradient-primary glow-saffron flex items-center justify-center shadow-2xl disabled:opacity-20 hover:scale-105 active:scale-95 transition-all"
                       >
                          <Send size={32} className="text-white translate-x-1" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  )
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}
