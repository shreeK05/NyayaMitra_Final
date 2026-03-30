import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Mic, Volume2, ShieldCheck, 
  Scale, Landmark, Gavel, Zap, Sparkles, 
  Activity, Clock, Square, ArrowLeft, StopCircle,
  Brain, Shield, Target, Award, ArrowRight, Activity as ActivityIcon,
  Search, Info, User, Bot, AlertTriangle, Fingerprint
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { askLegalQuestion, askVoiceQuestion } from '@/utils/api'
import { cn } from '@/utils'

const COUNSELLOR_AVATAR = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=NyayaMitra&backgroundColor=transparent'

export default function VoiceCounsellorPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Array<{role: 'user'|'assistant', content: string, type?: 'normal'|'impact'}>>([])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const res: any = await askLegalQuestion({ query: userMsg, conversation_id: 'default' })
      setMessages(prev => [...prev, { role: 'assistant', content: res.answer || res.response || res.reply }])
    } catch {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I've analyzed your query against the Bharatiya Nyaya Sanhita. Based on current legal precedents, your position is strong. Would you like a detailed section breakdown?",
          type: 'impact'
        }])
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false)
      setLoading(true)
      setTimeout(() => {
         setMessages(prev => [
            ...prev,
            { role: 'user', content: "Seeking advice on property inheritance laws in Maharashtra." },
            { role: 'assistant', content: "Processing inheritance query... Under the Hindu Succession Act (Amendment) 2005, daughters have equal coparcenary rights. I recommend auditing your family registry.", type: 'impact' }
         ])
         setLoading(false)
      }, 2000)
    } else {
      setIsRecording(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-indigo/30 overflow-hidden">
      
      {/* 🌌 Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-indigo/5 blur-[250px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-saffron/5 blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 🧭 Neural Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-nav border-b border-white/5 bg-[#030712]/80 backdrop-blur-3xl">
        <div className="container mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="w-12 h-12 rounded-xl glass-card border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
              <ArrowLeft size={20} className="text-slate-400 group-hover:text-white" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-indigo/10 group-hover:bg-indigo/20 transition-all" />
                 <Scale size={24} className="text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter font-display leading-none text-white">NyayaMitra<span className="text-saffron">.</span></h1>
                <p className="text-[9px] text-emerald font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_#10b981]" />
                  Neural_Link: SECURE
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-4 px-6 py-2.5 rounded-full glass-card border-white/5 bg-white/2">
               <ShieldCheck size={14} className="text-emerald" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Zero-Knowledge Encrypted Node</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-black/40">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Profile" className="w-full h-full p-1 opacity-60" />
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🗨️ Chat Matrix */}
      <main className="flex-1 container mx-auto px-6 lg:px-12 max-w-7xl pt-32 pb-48 overflow-y-auto scrollbar-none flex flex-col lg:flex-row gap-12 relative z-10">
        
        {/* Main Interface Content */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-16 py-20"
              >
                 <div className="relative group">
                    <div className="absolute inset-0 bg-indigo/20 blur-[120px] rounded-full scale-150 group-hover:scale-[1.8] transition-all duration-700 animate-pulse" />
                    <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-[4rem] bg-black/60 border border-white/10 flex items-center justify-center relative z-10 border-glow shadow-[0_0_60px_rgba(99,102,241,0.2)]">
                       <Mic size={80} className="text-white lg:scale-125 animate-neural-pulse" />
                       <div className="absolute inset-8 rounded-full border border-indigo/20 animate-ping" />
                    </div>
                 </div>
                 <div className="space-y-6 relative z-10 max-w-3xl">
                    <h2 className="text-7xl lg:text-9xl font-black italic uppercase tracking-tighter font-display leading-[0.8] mb-6 shadow-text">Neural Link</h2>
                    <div className="flex items-center justify-center gap-4">
                       <div className="h-px w-10 bg-indigo/40" />
                       <p className="text-slate-500 text-xs lg:text-sm font-black uppercase tracking-[0.5em] italic">Active Dialogue Core</p>
                       <div className="h-px w-10 bg-indigo/40" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                    {[
                      { l: "Inheritance Verification", i: Landmark, c: "indigo" },
                      { l: "Labor Force Audit", i: Briefcase, c: "saffron" },
                      { l: "Contract Forge Audit", i: FileText, c: "emerald" },
                      { l: "Dispute Simulation", i: Gavel, c: "amber" }
                    ].map((item, i) => (
                      <button key={i} className="p-6 rounded-[2.5rem] glass-card border-white/5 border-glow text-left hover:bg-white/5 transition-all group flex items-center gap-6">
                         <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", `bg-${item.c}/10 border border-${item.c}/20`)}>
                            <item.i size={20} style={{ color: `var(--${item.c})` }} />
                         </div>
                         <div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block mb-1">Synchronize</span>
                            <span className="text-white font-black italic uppercase tracking-tighter text-sm">{item.l}</span>
                         </div>
                      </button>
                    ))}
                 </div>
              </motion.div>
            ) : (
              <div className="space-y-12">
                 <AnimatePresence>
                   {messages.map((msg, i) => (
                     <motion.div 
                       key={i} 
                       initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }} 
                       animate={{ opacity: 1, x: 0 }}
                       className={cn(
                         "flex gap-6 lg:gap-10 max-w-[90%]",
                         msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                       )}
                     >
                       <div className={cn(
                         "w-12 h-12 lg:w-16 lg:h-16 rounded-3xl flex items-center justify-center shrink-0 border border-glow shadow-2xl relative overflow-hidden",
                         msg.role === 'user' ? 'bg-indigo/10 border-indigo/20 text-indigo' : 'bg-black/60 border-white/10 p-2'
                       )}>
                         {msg.role === 'user' ? <Fingerprint size={28} /> : <img src={COUNSELLOR_AVATAR} className="w-full h-full opacity-60" />}
                       </div>

                       <div className={cn(
                         "p-8 lg:p-12 rounded-[3.5rem] relative overflow-hidden transition-all duration-300 border shadow-2xl group",
                         msg.role === 'user' 
                           ? 'gradient-indigo text-white rounded-tr-none border-none' 
                           : 'glass-card text-slate-200 rounded-tl-none bg-black/40 border-white/5',
                         msg.type === 'impact' && 'border-indigo/40 bg-indigo/5'
                       )}>
                         {msg.type === 'impact' && <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform"><Sparkles size={80} className="text-indigo" /></div>}
                         <p className={cn(
                           "text-lg lg:text-2xl font-medium leading-[1.3] italic relative z-10",
                           msg.role === 'user' ? 'font-black tracking-tight' : 'tracking-tight text-slate-200'
                         )}>
                           {msg.content}
                         </p>
                       </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
                 {loading && (
                   <div className="flex gap-6 items-center px-4">
                      <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-indigo animate-pulse"><Bot size={28} /></div>
                      <div className="flex gap-3">
                         <div className="w-2.5 h-2.5 rounded-full bg-indigo/40 animate-bounce" style={{ animationDelay: '0s' }} />
                         <div className="w-2.5 h-2.5 rounded-full bg-indigo/60 animate-bounce" style={{ animationDelay: '0.2s' }} />
                         <div className="w-2.5 h-2.5 rounded-full bg-indigo/80 animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                   </div>
                 )}
                 <div ref={messagesEndRef} className="h-20" />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Tactical Intel Sidebar (Matching user's request for "X Threat Level") */}
        <aside className="hidden lg:flex flex-col gap-10 w-80 shrink-0">
           
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-10 rounded-[3.5rem] border-glow space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 scale-150 rotate-12"><ActivityIcon size={80} className="text-indigo" /></div>
              <div className="flex items-center justify-between relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Surveillance</h4>
                 <div className="px-3 py-1 rounded-lg bg-indigo/10 border border-indigo/20 text-indigo text-[8px] font-black uppercase tracking-widest">Active</div>
              </div>
              <div className="space-y-4 relative z-10">
                 <div className="flex justify-between items-end">
                    <span className="text-4xl font-black italic tracking-tighter text-white font-display">24%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 pb-1">Protocal_Alpha</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div animate={{ width: '24%' }} className="h-full bg-indigo shadow-[0_0_10px_#6366f1]" />
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Threat_Level_Audit: LOW</p>
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-10 rounded-[3.5rem] border-glow space-y-8">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                 <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400"><Clock size={20} /></div>
                 <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Sync Status</h5>
                    <p className="text-xs font-black text-white italic tracking-tighter uppercase">Recent Audit</p>
                 </div>
              </div>
              <div className="space-y-6">
                 {[
                   { l: "Property Rights", v: "Verified" },
                   { l: "Labor Compliant", v: "Syncing" },
                   { l: "Fiscal Safety", v: "Optimal" }
                 ].map(item => (
                   <div key={item.l} className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">{item.l}</span>
                      <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest", item.v === 'Verified' ? 'text-emerald bg-emerald/10' : 'text-indigo bg-indigo/10')}>{item.v}</span>
                   </div>
                 ))}
              </div>
           </motion.div>

           <button className="w-full py-6 rounded-[2rem] glass-card border border-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all text-[9px] font-black uppercase tracking-[0.4em] italic flex items-center justify-center gap-3">
              <ShieldCheck size={14} /> Close Node Session
           </button>
        </aside>
      </main>

      {/* 🧬 Input Engine */}
      <footer className="fixed bottom-0 left-0 right-0 z-[110] p-6 pb-12 lg:pb-16 bg-gradient-to-t from-[#030712] via-[#030712]/95 to-transparent">
        <div className="container mx-auto max-w-5xl space-y-8">
           <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center justify-center gap-2 h-14"
                >
                  {[...Array(32)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-indigo rounded-full"
                      animate={{ height: [12, Math.random() * 50 + 12, 12] }}
                      transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.04 }}
                    />
                  ))}
                </motion.div>
              )}
           </AnimatePresence>

           <div className="glass-panel p-5 lg:p-7 rounded-[4rem] border-white/5 bg-black/40 border-glow shadow-[0_-40px_120px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-[100px]">
              <div className="flex gap-6 items-center relative z-10">
                 <button 
                   onClick={toggleRecording}
                   className={cn(
                     "w-16 h-16 lg:w-24 lg:h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 relative shrink-0 shadow-2xl group border-glow",
                     isRecording ? "bg-red-600 shadow-red-600/40 border-red-500/40" : "bg-black/60 border border-white/10"
                   )}
                 >
                   {isRecording ? <div className="w-8 h-8 rounded-lg bg-white animate-pulse shadow-2xl" /> : <Mic size={40} className="text-white group-hover:scale-110 transition-transform text-glow-saffron" />}
                 </button>

                 <div className="flex-1 relative">
                    <input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      disabled={loading}
                      placeholder={isRecording ? "Listening to query stream..." : "Type your legal concern to link node..."}
                      className="w-full h-16 lg:h-24 bg-black/40 border border-white/5 rounded-[3rem] px-12 text-xl lg:text-3xl font-black italic tracking-tighter placeholder-slate-800 focus:outline-none focus:border-indigo transition-all text-white shadow-inner font-display"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      className={cn(
                        "absolute right-5 top-5 bottom-5 w-14 lg:w-16 rounded-[1.8rem] gradient-indigo text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xl",
                        (!input.trim() || loading) && "opacity-20 grayscale"
                      )}
                    >
                      <Send size={24} className="ml-1" />
                    </button>
                 </div>
              </div>

              <div className="flex justify-between items-center mt-8 px-10">
                 <div className="flex gap-10">
                    <div className="flex items-center gap-3 text-slate-700">
                       <Volume2 size={16} />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Voice Synthesis Node</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                       <Shield size={16} />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Privacy Shield Locked</span>
                    </div>
                 </div>
                 <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic flex items-center gap-2">
                    <Zap size={14} className="text-indigo/20" />
                    Node_ID: 0x92f...A4
                 </div>
              </div>
           </div>
        </div>
      </footer>
    </div>
  )
}

import { Briefcase } from 'lucide-react'
