import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Scale, AlertCircle, FileText, Navigation,
  Send, MessageCircle, Sparkles, ChevronDown, Volume2, 
  VolumeX, Bot, User as UserIcon, ShieldCheck, Heart
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { EMERGENCY_CONTACTS } from '@/utils'
import type { Message, Language } from '@/types'
import { cn } from '@/utils'
import { askLegalQuestion } from '@/utils/api'

const LANGUAGE_OPTIONS: { code: Language; name: string; greeting: string; placeholder: string; voice: string }[] = [
  { code: 'hi', name: 'हिन्दी', greeting: 'नमस्ते! मैं आपकी कानूनी सहायता कैसे कर सकता हूँ?', placeholder: 'अपनी समस्या यहाँ लिखें...', voice: 'hi-IN' },
  { code: 'mr', name: 'मराठी', greeting: 'नमस्कार! मी तुमची कशी मदत करू शकतो?', placeholder: 'तुमची समस्या इथे लिहा...', voice: 'mr-IN' },
  { code: 'ta', name: 'தமிழ்', greeting: 'வணக்கம்! நான் உங்களுக்கு எப்படி உதவ முடியும்?', placeholder: 'உங்கள் பிரச்சனையை இங்கே எழுதுங்கள்...', voice: 'ta-IN' },
  { code: 'bn', name: 'বাংলা', greeting: 'নমস্কার! আমি আপনার কি সহায়তা করতে পারি?', placeholder: 'আপনার সমস্যা এখানে লিখুন...', voice: 'bn-IN' },
  { code: 'te', name: 'తెలుగు', greeting: 'నమస్కారం! నేను మీకు ఎలా సహాయపడగలను?', placeholder: 'మీ సమస్యను ఇక్కడ రాయండి...', voice: 'te-IN' },
  { code: 'en', name: 'English', greeting: 'Hello! How can I help you with your legal matter today?', placeholder: 'Type your legal problem here...', voice: 'en-IN' },
]

const DEMO_QA = [
  { q: 'Saheb ne teen mahine se salary nahi di. Kya karoon?', winProb: 76, confidence: 89, sections: ['Payment of Wages Act, Sec 15', 'Industrial Disputes Act, Sec 33C'], },
  { q: 'Landlord bina bataye ghar mein ghus aata hai. Ye galat hai?', winProb: 84, confidence: 92, sections: ['Transfer of Property Act, Sec 108', 'Rent Control Act, Sec 16'], },
  { q: 'Consumer forum mein complaint kaise karun?', winProb: 79, confidence: 87, sections: ['Consumer Protection Act 2019, Sec 35'], },
  { q: 'FIR file karna chahta hoon lekin police mana kar rahi hai.', winProb: 88, confidence: 91, sections: ['BNS Section 173', 'CrPC Section 154'], },
]

interface MessageBubbleProps {
  msg: Message;
  isSpeaking: boolean;
  onToggleSpeech: (text: string) => void;
}

function MessageBubble({ msg, isSpeaking, onToggleSpeech }: MessageBubbleProps) {
  const isUser = msg.role === 'user'

  const formatContent = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n/g, '<br/>')

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn('flex gap-3 mb-4', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-2xl glass-diamond flex items-center justify-center shrink-0 border-orange-500/20 shadow-lg mt-auto">
          <Bot size={20} className="text-orange-400" />
        </div>
      )}
      
      <div className={cn(
        'max-w-[85%] rounded-[1.5rem] px-5 py-4 text-sm leading-relaxed shadow-xl relative group',
        isUser
          ? 'text-white rounded-br-sm glass-diamond border-orange-500/30'
          : 'text-slate-100 rounded-bl-sm glass-card border-slate-700/50'
      )}
        style={isUser ? { background: 'linear-gradient(135deg, rgba(255,153,51,0.15), rgba(245,158,11,0.05))' } : {}}
      >
        {!isUser && (
           <button 
             onClick={() => onToggleSpeech(msg.content)}
             className={cn(
               "absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-navy border border-slate-700/50 shadow-xl z-20 hover:scale-110",
               isSpeaking ? "text-orange-400 border-orange-500/40" : "text-slate-400 hover:text-white"
             )}
           >
             {isSpeaking ? <VolumeX size={14} className="animate-pulse" /> : <Volume2 size={14} />}
           </button>
        )}

        {isUser ? (
          <p className="font-semibold">{msg.content}</p>
        ) : (
          <div className="space-y-4">
            <div className="text-slate-200 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />

            {/* Analysis Row */}
            {(msg.winProbability || msg.confidence) && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                {msg.winProbability && (
                  <div className="rounded-xl p-2.5 bg-emerald-500/10 border border-emerald-500/20">
                     <div className="flex items-center gap-2 mb-1">
                        <Scale size={12} className="text-emerald-400" />
                        <span className="text-[9px] font-black text-emerald-400/70 uppercase tracking-widest">Case Odds</span>
                     </div>
                     <div className="text-emerald-400 font-black text-base">{msg.winProbability}%</div>
                  </div>
                )}
                {msg.confidence && (
                  <div className="rounded-xl p-2.5 bg-indigo-500/10 border border-indigo-500/20">
                     <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={12} className="text-indigo-400" />
                        <span className="text-[9px] font-black text-indigo-400/70 uppercase tracking-widest">AI Confidence</span>
                     </div>
                     <div className="text-indigo-400 font-black text-base">{msg.confidence}%</div>
                  </div>
                )}
              </div>
            )}

            {/* Law Citations Card */}
            {msg.retrievedSections && msg.retrievedSections.length > 0 && (
              <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                   <ShieldCheck size={12} className="text-orange-400" />
                   <span className="text-[9px] font-black text-orange-400/70 uppercase tracking-widest">Legal Citations</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {msg.retrievedSections.map((s, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-orange-500/10 text-[10px] text-orange-400 font-bold border border-orange-500/10">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-2xl glass-diamond flex items-center justify-center shrink-0 border-orange-500/20 shadow-lg mt-auto overflow-hidden">
          <UserIcon size={20} className="text-slate-400" />
        </div>
      )}
    </motion.div>
  )
}

function NeuralWave({ color = "#ff9933" }: { color?: string }) {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ 
            height: [8, Math.random() * 32 + 8, 8],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 0.6 + Math.random() * 0.4, 
            delay: i * 0.05, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      ))}
    </div>
  )
}

export default function VoiceCounsellorPage() {
  const { language, setLanguage, messages, addMessage, isListening, setIsListening, isProcessing, setIsProcessing, user } = useAppStore()
  const [selectedLang, setSelectedLang] = useState<Language>(language)
  const [inputText, setInputText] = useState('')
  const [demoIndex, setDemoIndex] = useState(0)
  const [showDistress, setShowDistress] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('voice')
  const [speakingText, setSpeakingText] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Speech Synthesis Engine ──────────────────────────
  const toggleSpeech = (text: string) => {
    if (speakingText === text) {
      window.speechSynthesis.cancel()
      setSpeakingText(null)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''))
    
    // Find best Indian voice if available
    const voices = window.speechSynthesis.getVoices()
    const langOpt = LANGUAGE_OPTIONS.find(l => l.code === selectedLang)
    const targetVoice = voices.find(v => v.lang.startsWith(langOpt?.voice || 'en-IN'))
    
    if (targetVoice) utterance.voice = targetVoice
    utterance.rate = 0.95
    utterance.onend = () => setSpeakingText(null)
    
    setSpeakingText(text)
    window.speechSynthesis.speak(utterance)
  }

  const callBackend = async (query: string) => {
    if (!query.trim()) return
    setIsProcessing(true)
    addMessage({ id: Date.now().toString(), role: 'user', content: query, timestamp: new Date(), language: selectedLang })

    try {
      const result = await askLegalQuestion({ query, language: selectedLang, user_state: user?.state || 'Maharashtra' })
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
        timestamp: new Date(),
        language: selectedLang,
        retrievedSections: result.law_citations,
        winProbability: result.win_probability,
        confidence: result.confidence,
      })
      if (result.distress_detected) setShowDistress(true)
    } catch {
      const demo = DEMO_QA[demoIndex % DEMO_QA.length]
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**NyayaMitra Advisory**\n\nBased on your query regarding "${query}", under Indian Law:\n\n1. You have a legal right to file for relief under ${demo.sections[0]}.\n2. Your first step should be to issue a registered legal notice.\n3. The estimated probability of success is ${demo.winProb}%.\n\n*Please ensure your API keys are configured for full live intelligence.*`,
        timestamp: new Date(),
        language: selectedLang,
        retrievedSections: demo.sections,
        winProbability: demo.winProb,
        confidence: demo.confidence,
      })
      setDemoIndex(i => i + 1)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSend = () => {
    const q = inputText.trim()
    setInputText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    callBackend(q)
  }

  const handleMicPress = async () => {
    if (isListening) {
      setIsListening(false)
      const demo = DEMO_QA[demoIndex % DEMO_QA.length]
      await callBackend(demo.q)
    } else {
      setIsListening(true)
      // Stop speech if listening starts
      window.speechSynthesis.cancel()
      setSpeakingText(null)
      setTimeout(() => setIsListening(false), 4000)
    }
  }

  const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (inputText.trim() && !isProcessing) handleSend()
    }
  }

  const langOption = LANGUAGE_OPTIONS.find(l => l.code === selectedLang)!

  return (
    <div className={cn(
      "flex flex-col h-[calc(100dvh-120px)] max-w-2xl mx-auto transition-colors duration-1000",
      showDistress ? "bg-red-500/5" : "bg-transparent"
    )}>

      {/* Header with language picker */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="text-white font-black text-xl tracking-tighter uppercase italic">Neural Counsellor</h1>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-india-green" />
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Law Engine Online</span>
          </div>
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black text-white hover-lift transition-all"
            style={{ background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.25)' }}
          >
            {langOption.name}
            <ChevronDown size={14} className={cn('transition-transform', showLangMenu && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 z-50 rounded-2xl overflow-hidden glass-diamond shadow-2xl min-w-[150px]"
              >
                {LANGUAGE_OPTIONS.map(({ code, name }) => (
                  <button key={code}
                    onClick={() => { setSelectedLang(code); setLanguage(code); setShowLangMenu(false) }}
                    className={cn(
                      'w-full px-5 py-3 text-left text-xs font-black uppercase tracking-widest transition-colors',
                      selectedLang === code ? 'text-orange-400 bg-orange-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-none mesh-gradient">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full gap-8 py-10"
          >
            {/* Welcome card */}
            <div className="text-center group">
              <div className="w-24 h-24 rounded-[2rem] glass-diamond flex items-center justify-center glow-saffron animate-float mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-orange-500/10 rounded-[2rem] animate-pulse" />
                <Scale size={40} className="text-orange-400 relative z-10" />
              </div>
              <h2 className="text-white font-black text-2xl tracking-tighter uppercase italic">NyayaMitra Core</h2>
              <p className="text-slate-400 text-sm mt-3 max-w-sm mx-auto leading-relaxed font-medium px-6">{langOption.greeting}</p>
            </div>

            {/* Quick question chips */}
            <div className="w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                 <div className="h-px flex-1 bg-white/5" />
                 <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Sample Queries</span>
                 <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid gap-3">
                {DEMO_QA.map((d, i) => (
                  <motion.button key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => callBackend(d.q)}
                    className="w-full text-left p-4 rounded-2xl transition-all glass-card hover:border-orange-500/40 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-slate-200 text-sm group-hover:text-white transition-colors leading-relaxed font-semibold">"{d.q}"</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {messages.map(msg => (
          <MessageBubble 
            key={msg.id} 
            msg={msg} 
            isSpeaking={speakingText === msg.content}
            onToggleSpeech={toggleSpeech}
          />
        ))}

        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-end">
            <div className="w-10 h-10 rounded-2xl glass-diamond flex items-center justify-center shrink-0 border-orange-500/20 shadow-lg">
              <Bot size={20} className="text-orange-400" />
            </div>
            <div className="px-5 py-4 rounded-[1.5rem] rounded-bl-sm glass-card border-none"
              style={{ background: 'rgba(21,31,58,0.6)' }}>
              <div className="flex items-center gap-3">
                <NeuralWave />
                <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Reasoning...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emergency Distress Overlay */}
      <AnimatePresence>
        {showDistress && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-4 bottom-32 z-50 rounded-[2rem] p-6 glass-diamond border-red-500/30 overflow-hidden shadow-2xl"
            style={{ background: 'rgba(239, 68, 68, 0.08)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[40px] rounded-full" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                 <AlertCircle size={22} className="text-red-500 animate-pulse" />
              </div>
              <div>
                 <h3 className="text-red-500 font-black text-sm uppercase tracking-widest">Distress Detected</h3>
                 <p className="text-red-300/60 text-[10px] font-bold">Safe helplines are available anonymously.</p>
              </div>
              <button 
                onClick={() => setShowDistress(false)} 
                className="ml-auto w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <Heart size={16} className="text-red-300/40" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {EMERGENCY_CONTACTS.map(({ name, number }) => (
                <a key={name} href={`tel:${number}`}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl glass-diamond border-red-500/20 hover:bg-red-500/10 transition-colors">
                  <span className="text-red-400 font-black text-lg">{number}</span>
                  <span className="text-[9px] text-red-300/60 font-black uppercase">{name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Input Control Center */}
      <div className="px-4 pb-6 pt-2 flex-shrink-0 space-y-4">
        
        {/* Toggle Controls */}
        <div className="flex items-center justify-between">
            <div className="flex gap-1.5 p-1.5 rounded-2xl glass-diamond border-none" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {(['text', 'voice'] as const).map(mode => (
                <button key={mode}
                  onClick={() => setInputMode(mode)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                    inputMode === mode ? 'text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  )}
                  style={inputMode === mode ? { background: 'linear-gradient(135deg, #ff9933, #f59e0b)' } : {}}
                >
                  {mode === 'text' ? <MessageCircle size={14} /> : <Mic size={14} />}
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
               <button className="w-10 h-10 rounded-xl glass-diamond flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                  <Navigation size={18} />
               </button>
            </div>
        </div>

        {/* Text Input Mode */}
        {inputMode === 'text' ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                }}
                onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (inputText.trim() && !isProcessing) handleSend()
                   }
                }}
                placeholder={langOption.placeholder}
                className="w-full px-5 py-4 pr-16 rounded-[1.5rem] lg:rounded-[2rem] text-sm text-white outline-none resize-none glass-diamond border-none font-medium leading-relaxed"
                style={{ maxHeight: '120px' }}
                disabled={isProcessing}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!inputText.trim() || isProcessing}
                className="absolute right-3 bottom-3 w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-xl disabled:opacity-20"
                style={{ background: inputText.trim() ? 'linear-gradient(135deg, #ff9933, #f59e0b)' : 'rgba(255,255,255,0.05)' }}
              >
                <Send size={18} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Premium Voice Portal */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
            {isListening ? (
               <NeuralWave color="#ff9933" />
            ) : isProcessing ? (
               <NeuralWave color="#06b6d4" />
            ) : (
               <div className="h-12 flex items-center gap-2 text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  Voice Standby
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
               </div>
            )}

            <div className="relative group">
              {isListening && <div className="absolute inset-0 rounded-full animate-ping bg-orange-500/10" />}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleMicPress}
                disabled={isProcessing}
                className={cn(
                  'relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_50px_rgba(255,153,51,0.2)]',
                  isListening ? 'scale-110' : 'hover:scale-105',
                  isProcessing && 'opacity-50 grayscale'
                )}
                style={isListening 
                  ? { background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 0 60px rgba(239, 68, 68, 0.4)' } 
                  : { background: 'linear-gradient(135deg, #ff9933, #f59e0b)' }
                }
              >
                {isListening ? <MicOff size={36} className="text-white" /> : <Mic size={36} className="text-white" />}
                
                {/* Visual Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                   <circle cx="48" cy="48" r="46" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="288" />
                   {isListening && (
                      <motion.circle 
                         cx="48" cy="48" r="46" fill="none" stroke="#ffffff" strokeWidth="2" 
                         strokeDasharray="288"
                         initial={{ strokeDashoffset: 288 }}
                         animate={{ strokeDashoffset: 0 }}
                         transition={{ duration: 4, ease: "linear" }}
                      />
                   )}
                </svg>
              </motion.button>
            </div>
            
            <p className={cn(
               "text-[10px] lg:text-xs font-black uppercase tracking-[0.25em] transition-all duration-300",
               isListening ? "text-red-500" : isProcessing ? "text-cyan-400" : "text-slate-500"
            )}>
              {isListening ? 'Listening Native Speech...' : isProcessing ? 'AI Context Reasoning...' : 'Tap To Begin Counsel'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
