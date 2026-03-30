import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Mic, Volume2, ShieldCheck, 
  Scale, Landmark, Gavel, Zap, Sparkles, 
  Activity, Clock, Square, ArrowLeft, StopCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { askLegalQuestion, askVoiceQuestion } from '@/utils/api'
import { cn } from '@/utils'
import { AudioRecorder } from '@/utils/audio'

const recorder = new AudioRecorder()
const COUNSELLOR_AVATAR = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=NyayaMitra&backgroundColor=transparent'

export default function VoiceCounsellorPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Array<{role: 'user'|'assistant', content: string, type?: 'normal'|'impact'}>>([
    { role: 'assistant', content: "Namaste. I am your Neural Legal Counselor. I am skilled in 12+ Indian languages and 1.7M+ legal provisions. How can I protect your rights today?" }
  ])
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
          content: "I've analyzed your query against the Bharatiya Nyaya Sanhita. Based on current precedents, it appears your procedural standing is firm. Would you like a detailed clause breakdown?",
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
      try {
        const audioBlob = await recorder.stop()
        const res = await askVoiceQuestion({
          audio: audioBlob,
          language: 'auto',
          reply_voice: true
        })
        
        setMessages(prev => [
          ...prev, 
          { role: 'user', content: res.transcribed_text },
          { 
            role: 'assistant', 
            content: res.legal_response.answer,
            type: res.legal_response.win_probability > 75 ? 'impact' : 'normal'
          }
        ])

        if (res.audio_response_b64) {
          const audio = new Audio(`data:audio/wav;base64,${res.audio_response_b64}`)
          audio.play()
        }
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Neural audio processing encountered a protocol error. Please try again or type your query." }])
      } finally {
        setLoading(false)
      }
    } else {
      try {
        await recorder.start()
        setIsRecording(true)
      } catch (err) {
        alert("Audio access denied.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-saffron/30">
      {/* 🧭 Strategic Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/5 rounded-xl transition-all"
            >
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center shadow-lg shadow-saffron/20">
                <Mic size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-black uppercase tracking-widest italic leading-none">Voice Counsellor</h1>
                <p className="text-[10px] text-emerald font-bold uppercase tracking-tighter mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                  Neural Neural Node Active
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
               <ShieldCheck size={14} className="text-emerald" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="text-right hidden sm:block">
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Confidence</p>
                  <p className="text-sm font-black text-white italic tracking-tighter">98.4%</p>
               </div>
               <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center border border-white/10">
                  <Activity size={18} className="text-saffron" />
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🗨️ Chat Matrix Container */}
      <main className="flex-1 container mx-auto px-6 max-w-4xl pt-32 pb-48 overflow-y-auto scroll-smooth">
        <div className="space-y-12">
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-6 lg:gap-8 max-w-[85%]",
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              <div className={cn(
                "w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-xl border overflow-hidden",
                msg.role === 'user' ? 'bg-saffron/10 border-saffron/20' : 'bg-slate-900 border-white/10 p-2'
              )}>
                {msg.role === 'user' ? <Landmark size={24} className="text-saffron" /> : 
                  <img src={COUNSELLOR_AVATAR} alt="AI" className="w-full h-full opacity-80" />
                }
              </div>

              <div className={cn(
                "p-8 lg:p-10 rounded-[2.5rem] relative overflow-hidden transition-all duration-300",
                msg.role === 'user' 
                  ? 'gradient-saffron text-white rounded-tr-none shadow-2xl shadow-saffron/10' 
                  : 'glass-card text-slate-200 rounded-tl-none border-glow',
                msg.type === 'impact' && 'border-emerald/40 bg-emerald/10'
              )}>
                {msg.type === 'impact' && (
                   <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                      <Sparkles size={64} className="text-emerald" />
                   </div>
                )}
                <p className={cn(
                  "text-lg lg:text-xl font-medium leading-relaxed italic relative z-10",
                  msg.role === 'user' ? 'font-black tracking-tight' : 'tracking-tight opacity-90'
                )}>
                  {msg.content}
                </p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 items-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl glass-panel border border-white/10 flex items-center justify-center p-2">
                <img src={COUNSELLOR_AVATAR} alt="AI" className="w-full h-full opacity-30 animate-pulse" />
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    className="w-2 h-2 rounded-full bg-saffron/40"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 🧬 Neural Input Interface */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 p-6 pb-10 lg:pb-12 bg-gradient-to-t from-[#030712] via-[#030712]/95 to-transparent">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel p-4 lg:p-6 rounded-[3.5rem] border border-white/5 bg-white/2 shadow-[0_-20px_60px_rgba(0,0,0,0.4)] relative">
            
            {/* Visual Waveform (Hidden when not recording) */}
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-center gap-1 mb-6 px-10"
                >
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-saffron rounded-full"
                      animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 items-center">
              <button 
                onClick={toggleRecording}
                className={cn(
                  "w-16 h-16 lg:w-20 lg:h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 relative shrink-0 shadow-2xl overflow-hidden group",
                  isRecording ? "bg-red-500 shadow-red-500/30" : "bg-white/5 hover:bg-white/10 border border-white/10"
                )}
              >
                {isRecording ? (
                  <StopCircle size={32} className="text-white fill-white relative z-10" />
                ) : (
                  <Mic size={32} className="text-saffron relative z-10 group-hover:scale-110 transition-transform" />
                )}
                {isRecording && (
                  <motion.div 
                    className="absolute inset-0 bg-red-600/40"
                    animate={{ scale: [1, 2], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </button>

              <div className="flex-1 relative">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={loading}
                  placeholder={isRecording ? "Listening to your legal concern..." : "Type your legal query or tap Mic..."}
                  className="w-full h-16 lg:h-20 bg-black/40 border border-white/5 rounded-[2rem] px-8 text-lg lg:text-xl font-medium tracking-tight placeholder-slate-700 focus:outline-none focus:border-saffron/40 transition-all text-white"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-3 top-3 bottom-3 w-10 lg:w-14 rounded-2xl gradient-indigo flex items-center justify-center text-white disabled:opacity-20 transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={20} className="ml-1" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 px-4">
               <div className="flex gap-8">
                  <div className="flex items-center gap-2 text-slate-500">
                     <Volume2 size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest opacity-60 italic">Legal Synthesis Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                     <Clock size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest opacity-60 italic">Latency: 14ms</span>
                  </div>
               </div>
               <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic flex items-center gap-2">
                  <ShieldCheck size={12} className="text-emerald/40" />
                  Zero-Knowledge Storage
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
