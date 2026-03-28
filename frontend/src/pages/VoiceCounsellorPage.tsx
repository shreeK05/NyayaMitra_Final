import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Scale, AlertCircle, FileText, Navigation,
  Send, MessageCircle, Sparkles, ChevronDown
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { EMERGENCY_CONTACTS } from '@/utils'
import type { Message, Language } from '@/types'
import { cn } from '@/utils'
import { askLegalQuestion } from '@/utils/api'

const LANGUAGE_OPTIONS: { code: Language; name: string; greeting: string; placeholder: string }[] = [
  { code: 'hi', name: 'हिन्दी', greeting: 'Namaste! Main aapki kaise madad kar sakta hoon?', placeholder: 'अपनी समस्या यहाँ लिखें...' },
  { code: 'mr', name: 'मराठी', greeting: 'Namaskar! Mi tumchi kashi madad karu shakto?', placeholder: 'तुमची समस्या इथे लिहा...' },
  { code: 'ta', name: 'தமிழ்', greeting: 'Vanakkam! Naan ungalukkU eppadi udava mudiyum?', placeholder: 'உங்கள் பிரச்சனையை இங்கே எழுதுங்கள்...' },
  { code: 'bn', name: 'বাংলা', greeting: 'Namaskar! Ami apnar ki sohayota korte pari?', placeholder: 'আপনার সমস্যা এখানে লিখুন...' },
  { code: 'te', name: 'తెలుగు', greeting: 'Namaskaram! Nenu mee ki ela sahayapadagalanu?', placeholder: 'మీ సమస్యను ఇక్కడ రాయండి...' },
  { code: 'en', name: 'English', greeting: 'Hello! How can I help you with your legal matter today?', placeholder: 'Type your legal problem here...' },
]

const DEMO_QA = [
  { q: 'Saheb ne teen mahine se salary nahi di. Kya karoon?', winProb: 76, confidence: 89, sections: ['Payment of Wages Act, Section 15', 'Industrial Disputes Act, Section 33C'], },
  { q: 'Landlord bina bataye ghar mein ghus aata hai. Ye galat hai?', winProb: 84, confidence: 92, sections: ['Transfer of Property Act, Section 108(c)', 'Maharashtra Rent Control Act 1999, Section 16'], },
  { q: 'Consumer forum mein complaint kaise karun? Company ne refund nahi diya.', winProb: 79, confidence: 87, sections: ['Consumer Protection Act 2019, Section 35', 'E-Commerce Rules 2020'], },
  { q: 'FIR file karna chahta hoon lekin police mana kar rahi hai.', winProb: 88, confidence: 91, sections: ['BNS Section 173', 'CrPC Section 154'], },
]

function WaveBar({ delay }: { delay: number }) {
  return (
    <motion.div className="w-1 rounded-full bg-orange-400"
      animate={{ height: [6, 22, 6] }}
      transition={{ duration: 0.7, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'

  const formatContent = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n/g, '<br/>')
        .replace(/^(\d+\.\s)/gm, '<br/>$1')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={cn('flex gap-2.5', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 glow-saffron mt-auto">
          <Scale size={14} className="text-white" />
        </div>
      )}
      <div className={cn(
        'max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg',
        isUser
          ? 'text-white rounded-br-sm'
          : 'text-slate-200 rounded-bl-sm'
      )}
        style={isUser
          ? { background: 'linear-gradient(135deg, rgba(255,153,51,0.25), rgba(245,158,11,0.15))', border: '1px solid rgba(255,153,51,0.3)' }
          : { background: 'rgba(21,31,58,0.8)', border: '1px solid rgba(42,61,110,0.5)', backdropFilter: 'blur(10px)' }
        }
      >
        {isUser ? (
          <p className="text-white font-medium">{msg.content}</p>
        ) : (
          <>
            <div className="text-slate-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />

            {/* Stats row */}
            {(msg.winProbability || msg.confidence) && (
              <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                {msg.winProbability && (
                  <div className="flex items-center gap-2 rounded-lg p-2" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Scale size={13} className="text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-emerald-400/70 leading-none">Win Probability</div>
                      <div className="text-emerald-400 font-bold text-sm">{msg.winProbability}%</div>
                    </div>
                  </div>
                )}
                {msg.confidence && (
                  <div className="flex items-center gap-2 rounded-lg p-2" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <Sparkles size={13} className="text-indigo-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-indigo-400/70 leading-none">Confidence</div>
                      <div className="text-indigo-400 font-bold text-sm">{msg.confidence}%</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Citations */}
            {msg.retrievedSections && msg.retrievedSections.length > 0 && (
              <div className="mt-2 space-y-1">
                {msg.retrievedSections.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-orange-400/80">
                    <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-auto text-xs font-bold text-white"
          style={{ background: 'rgba(255,153,51,0.2)', border: '1px solid rgba(255,153,51,0.3)' }}>
          U
        </div>
      )}
    </motion.div>
  )
}

export default function VoiceCounsellorPage() {
  const { language, setLanguage, messages, addMessage, isListening, setIsListening, isProcessing, setIsProcessing, user } = useAppStore()
  const [selectedLang, setSelectedLang] = useState<Language>(language)
  const [inputText, setInputText] = useState('')
  const [demoIndex, setDemoIndex] = useState(0)
  const [showDistress, setShowDistress] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
        content: `**Demo Response** (Backend connecting...)\n\nYour query has been received. Based on Indian law, here are your rights and next steps:\n\n1. Collect all evidence and documents\n2. Send a registered legal notice\n3. File a complaint with the appropriate authority\n\n*(Add your GROQ_API_KEY in .env for real AI responses)*`,
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
      setTimeout(() => setIsListening(false), 4000)
    }
  }

  const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (inputText.trim() && !isProcessing) handleSend()
    }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const langOption = LANGUAGE_OPTIONS.find(l => l.code === selectedLang)!

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)] max-w-2xl mx-auto">

      {/* Header with language picker */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="text-white font-bold text-base">AI Legal Counsel</h1>
          <p className="text-slate-500 text-xs">Ask in any language • Real-time law reference</p>
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'rgba(255,153,51,0.15)', border: '1px solid rgba(255,153,51,0.3)' }}
          >
            {langOption.name}
            <ChevronDown size={13} className={cn('transition-transform', showLangMenu && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 z-50 rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: 'rgba(15,22,40,0.97)', border: '1px solid rgba(42,61,110,0.8)', backdropFilter: 'blur(20px)', minWidth: '140px' }}
              >
                {LANGUAGE_OPTIONS.map(({ code, name }) => (
                  <button key={code}
                    onClick={() => { setSelectedLang(code); setLanguage(code); setShowLangMenu(false) }}
                    className={cn(
                      'w-full px-4 py-2.5 text-left text-sm font-medium transition-colors',
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

      {/* Mode toggle */}
      <div className="px-4 pb-2 flex-shrink-0">
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['text', 'voice'] as const).map(mode => (
            <button key={mode}
              onClick={() => setInputMode(mode)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                inputMode === mode ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              )}
              style={inputMode === mode ? { background: 'linear-gradient(135deg, #ff9933, #f59e0b)' } : {}}
            >
              {mode === 'text' ? <MessageCircle size={13} /> : <Mic size={13} />}
              {mode === 'text' ? 'Type' : 'Voice'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 scrollbar-none">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full gap-5 py-6"
          >
            {/* Welcome card */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center glow-saffron animate-float mx-auto mb-3">
                <Scale size={28} className="text-white" />
              </div>
              <h2 className="text-white font-bold text-lg">NyayaMitra Ready</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-52 mx-auto leading-relaxed">{langOption.greeting}</p>
            </div>

            {/* Quick question chips */}
            <div className="w-full">
              <p className="text-slate-500 text-xs text-center mb-3">— या इन सवालों में से कोई पूछें —</p>
              <div className="grid gap-2">
                {DEMO_QA.map((d, i) => (
                  <motion.button key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => callBackend(d.q)}
                    className="w-full text-left p-3 rounded-xl transition-all group"
                    style={{ background: 'rgba(21,31,58,0.5)', border: '1px solid rgba(42,61,110,0.4)' }}
                    whileHover={{ borderColor: 'rgba(255,153,51,0.4)', backgroundColor: 'rgba(255,153,51,0.05)' }}
                  >
                    <p className="text-slate-300 text-sm group-hover:text-white transition-colors leading-relaxed">"{d.q}"</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 items-end">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 glow-saffron">
              <Scale size={14} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm"
              style={{ background: 'rgba(21,31,58,0.8)', border: '1px solid rgba(42,61,110,0.5)' }}>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">Analysing Indian law</span>
                {[0, 0.2, 0.4].map((d, i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400"
                    animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: d, repeat: Infinity }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Distress Alert */}
      <AnimatePresence>
        {showDistress && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="mx-4 p-3 rounded-2xl mb-2 flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={14} className="text-red-400" />
              <span className="text-red-400 text-xs font-bold">Emergency Helplines</span>
              <button onClick={() => setShowDistress(false)} className="ml-auto text-red-300/40 hover:text-red-300 text-lg leading-none">×</button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {EMERGENCY_CONTACTS.map(({ name, number }) => (
                <a key={name} href={`tel:${number}`}
                  className="text-center p-2 rounded-xl transition-colors"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div className="text-white font-bold text-sm">{number}</div>
                  <div className="text-red-300 text-[10px]">{name}</div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 space-y-2">
        {/* Quick actions */}
        {messages.length > 0 && (
          <div className="flex gap-2">
            <button onClick={() => window.location.href = '/generator'}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'rgba(255,153,51,0.1)', border: '1px solid rgba(255,153,51,0.25)', color: '#fb923c' }}>
              <FileText size={13} /> Draft Notice
            </button>
            <button onClick={() => window.location.href = '/negotiate'}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
              <Navigation size={13} /> Negotiate
            </button>
          </div>
        )}

        {/* Text Input Mode */}
        {inputMode === 'text' && (
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaInput}
                onKeyDown={handleTextareaKeyDown}
                placeholder={langOption.placeholder}
                rows={1}
                className="w-full px-4 py-3 pr-12 rounded-2xl text-sm text-white outline-none resize-none transition-all"
                style={{
                  background: 'rgba(21,31,58,0.8)',
                  border: '1.5px solid rgba(42,61,110,0.6)',
                  backdropFilter: 'blur(10px)',
                  maxHeight: '120px',
                  lineHeight: '1.5',
                }}
                disabled={isProcessing}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!inputText.trim() || isProcessing}
                className="absolute right-2 bottom-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: inputText.trim() ? 'linear-gradient(135deg, #ff9933, #f59e0b)' : 'rgba(255,255,255,0.08)' }}
              >
                <Send size={14} className="text-white" />
              </motion.button>
            </div>

            {/* Small mic toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleMicPress}
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all"
              style={isListening
                ? { background: 'linear-gradient(135deg, #ff9933, #f59e0b)', boxShadow: '0 0 20px rgba(255,153,51,0.4)' }
                : { background: 'rgba(255,153,51,0.12)', border: '1.5px solid rgba(255,153,51,0.3)' }
              }
            >
              {isListening ? <MicOff size={18} className="text-white" /> : <Mic size={18} className="text-orange-400" />}
            </motion.button>
          </div>
        )}

        {/* Voice Input Mode */}
        {inputMode === 'voice' && (
          <div className="flex flex-col items-center gap-3">
            {isListening && (
              <div className="flex items-end gap-1 h-8">
                {Array.from({ length: 9 }, (_, i) => <WaveBar key={i} delay={i * 0.08} />)}
              </div>
            )}
            <div className="relative">
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full animate-ping bg-orange-500/20" />
                  <div className="absolute -inset-3 rounded-full mic-ring bg-orange-500/10" />
                </>
              )}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleMicPress}
                disabled={isProcessing}
                className={cn(
                  'relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xl',
                  isListening ? 'glow-saffron scale-110' : 'gradient-primary hover:scale-105 glow-saffron',
                  isProcessing && 'cursor-not-allowed opacity-50'
                )}
                style={isListening ? { background: 'linear-gradient(135deg, #ef4444, #dc2626)' } : { background: 'linear-gradient(135deg, #ff9933, #f59e0b)' }}
              >
                {isListening ? <MicOff size={30} className="text-white" /> : <Mic size={30} className="text-white" />}
              </motion.button>
            </div>
            <p className="text-slate-500 text-xs text-center">
              {isListening ? '🔴 Listening... tap to stop' : isProcessing ? '⏳ Processing your query...' : 'Tap mic to speak • 6 Indian languages'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
