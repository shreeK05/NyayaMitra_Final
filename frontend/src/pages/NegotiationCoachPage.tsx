import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Trophy, RefreshCw, MessageSquare, Target, Zap, ChevronRight, 
  Mic, Info, History, User2, Bot, Scale, Gavel, FileDigit, 
  BarChart3, Star, Sparkles, ArrowLeft, Send
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getNegotiationScenarios, startNegotiationSession, sendNegotiationMessage, getNegotiationDebrief } from '@/utils/api'
import { cn } from '@/utils'

const SCENARIOS = [
  {
    id: 'landlord',
    title: 'Deposit Recovery Protocol',
    role: 'Primary Tenant',
    opponent: 'Hostile Landlord',
    opponentAvatar: '🏠',
    context: 'Post-vacation dispute. Landlord is withholding Rs. 40,000 from a Rs. 1,80,000 security deposit without statutory invoices.',
    messages: [
      { role: 'opponent', text: "The property has thermal damage on tiles and structural fridge issues. I'm retaining Rs. 40,000. Take the rest or I will withhold the entire sum for restoration." },
    ],
    tips: [
      'Demand Section 108 Trans. Property Act Invoices',
      'Cite Normal Wear & Tear vs Structural Damage',
      'Set 72hr Legal Recourse Deadline'
    ],
    winProbability: 78,
  },
  {
    id: 'employer',
    title: 'Severance Scaling Audit',
    role: 'Aggrieved Employee',
    opponent: 'Corporate HR Node',
    opponentAvatar: '💼',
    context: 'Unlawful termination without notice. Initial offer is 1 month severance; Entitlement is 3 months under Industrial Disputes Act.',
    messages: [
      { role: 'opponent', text: "The termination is final. We are offering a gesture of 1 month ex-gratia. Sign the Full & Final NDA by EOD to process the credit." },
    ],
    tips: [
      'Hold the NDA signature pending RAG Audit',
      "Cite Industrial Disputes Act Section 25F mandatory 3-month notice",
      'Specify all negotiation points in writing'
    ],
    winProbability: 71,
  },
]

const PLAYER_RESPONSES = {
  landlord: [
    "I understand your restoration concerns. However, per Transfer of Property Act Section 108, you are required to provide itemized invoices with date-stamped photo evidence for all claimed damages within 7 days.",
    "The property was returned in standard wear-and-tear condition as per the move-in audit. I expect the full Rs. 1,80,000 within 48 hours or I will initiate a formal Rent Control Authority complaint.",
    "I am open to an amicable resolution. Please demonstrate the legal basis for withholding deposit without invoices. Else, I must proceed with the 1-on-1 Legal Defense protocol.",
  ],
  employer: [
    "I have received the offer but must decline signature pending comprehensive legal audit. Under Industrial Disputes Act Section 25F, the mandatory notice pay is 3 months. Can we align our data on this?",
    "My computed entitlement includes: 3 months notice pay + 7 years statutory gratuity + 42-day earned leave accrual. Please provide an itemized F&F sheet for review before we proceed.",
    "I prefer to resolve this via consensus. However, the current offer falls short of mandatory Indian Labor Law codes. I'd like to discuss the gap before we engage the Labour Commissioner.",
  ],
}

export default function NegotiationCoachPage() {
  const navigate = useNavigate()
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState(selectedScenario.messages)
  const [responseIdx, setResponseIdx] = useState(0)
  const [showTip, setShowTip] = useState<string | null>(null)
  const [score, setScore] = useState(50)
  const [isTyping, setIsTyping] = useState(false)
  const [showDebrief, setShowDebrief] = useState(false)
  const [debrief, setDebrief] = useState<any | null>(null)
  const [debriefLoading, setDebriefLoading] = useState(false)
  const [transcript, setTranscript] = useState<Array<{role:string;content:string}>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const switchScenario = async (s: typeof SCENARIOS[0]) => {
    setSelectedScenario(s)
    setChatMessages(s.messages)
    setScore(50)
    setResponseIdx(0)
    setTranscript([])
    setShowDebrief(false)
    setDebrief(null)
  }

  const sendResponse = async (idx: number) => {
    const list = (PLAYER_RESPONSES as any)[selectedScenario.id] || PLAYER_RESPONSES.landlord
    const response = list[idx % list.length]

    const userMsg = { role: 'player', text: response }
    setChatMessages(prev => [...prev, userMsg])
    setTranscript(prev => [...prev, { role: 'user', content: response }])
    setIsTyping(true)

    // Demo simulation
    setTimeout(() => {
      const aiResponse = "Your statutory citation is technically accurate. However, the property restoration is non-negotiable from my end. Can we agree on a 15% reduction instead of 25%?"
      setChatMessages(prev => [...prev, { role: 'opponent', text: aiResponse }])
      setTranscript(prev => [...prev, { role: 'assistant', content: aiResponse }])
      setIsTyping(false)
      setShowTip("Neural Strategy: Counter with a 5% limit. Cite the Rent Control Act.")
      setScore(s => Math.min(s + 12, 95))
      setTimeout(() => setShowTip(null), 5000)
    }, 1500)

    setResponseIdx(i => i + 1)
  }

  const handleDebrief = () => {
    setDebriefLoading(true)
    setShowDebrief(true)
    setTimeout(() => {
      setDebrief({
        total_score: score,
        what_you_did_well: ['Precise statutory referencing', 'Maintained professional tonal dominance', 'Effective leverage identification'],
        missed_opportunities: ['Could have requested specific e-portal audit logs', 'Failed to mention penal interest'],
        overall_feedback: `Defense Grade: ${score}/100. Your neural negotiation level is Elite. You correctly identified Section 108 leverage points.`,
      })
      setDebriefLoading(false)
    }, 2000)
  }

  const responseOptions = (PLAYER_RESPONSES as any)[selectedScenario.id] || PLAYER_RESPONSES.landlord

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-indigo/30 overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-indigo flex items-center justify-center shadow-lg shadow-indigo/20">
                <Target size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-widest italic leading-none">Neural Coach</h1>
                <p className="text-[10px] text-indigo font-bold uppercase tracking-tighter mt-1">Conflict Sparring V9.1</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
             <div className="text-right">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Defense Dominance</span>
                <span className="text-indigo font-black text-xl italic font-display">{score}%</span>
             </div>
             <button onClick={handleDebrief} className="px-5 py-2 rounded-xl gradient-indigo text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo/20">Analyze Matrix</button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 max-w-7xl pt-32 pb-6 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Scenario Sidebar */}
        <aside className="lg:w-80 shrink-0 space-y-6 overflow-y-auto scrollbar-none pr-2 pb-6">
          <div className="space-y-3">
             <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-2">Simulation Nodes</h3>
             {SCENARIOS.map((s) => (
                <button 
                  key={s.id} 
                  onClick={() => switchScenario(s)}
                  className={cn(
                    "w-full p-6 rounded-[2.5rem] text-left transition-all border border-glow flex items-center gap-4 group",
                    selectedScenario.id === s.id ? "glass-card border-white/20" : "bg-white/2 border-white/5 opacity-40"
                  )}
                >
                  <span className="text-3xl transition-transform group-hover:scale-110">{s.opponentAvatar}</span>
                  <div>
                    <h4 className="text-base font-black italic uppercase tracking-tighter font-display leading-tight">{s.title}</h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">{s.opponent}</p>
                  </div>
                </button>
             ))}
          </div>

          <div className="glass-card p-8 rounded-[3rem] border-white/5 space-y-6 border-glow">
             <div className="flex items-center gap-3 text-indigo">
                <Info size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Tactical Brief</span>
             </div>
             <p className="text-slate-400 text-sm italic leading-relaxed opacity-70">"{selectedScenario.context}"</p>
             <div className="pt-6 border-t border-white/5 space-y-4">
                <h5 className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Field Strategy</h5>
                {selectedScenario.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo mt-1.5 shadow-[0_0_8px_var(--indigo)]" />
                    <span className="text-[11px] font-medium text-slate-500 italic">{tip}</span>
                  </div>
                ))}
             </div>
          </div>
        </aside>

        {/* Chat Hub */}
        <div className="flex-1 flex flex-col glass-card rounded-[3.5rem] border-white/10 bg-black/40 overflow-hidden relative border-glow">
           <div className="p-8 border-b border-white/5 flex items-center gap-6 bg-white/2">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-xl">
                 {selectedScenario.opponentAvatar}
              </div>
              <div>
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter font-display">{selectedScenario.opponent}</h3>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_8px_var(--emerald)] animate-pulse" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Live Neural Handshake Active</span>
                 </div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-none">
              <AnimatePresence>
                 {chatMessages.map((msg, i) => (
                   <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                     className={cn("flex gap-5 max-w-[85%]", msg.role === 'player' ? 'ml-auto flex-row-reverse' : '')}>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                        msg.role === 'player' ? 'bg-indigo/10 border-indigo/30 text-indigo' : 'bg-white/5 border-white/10 text-xl'
                      )}>
                        {msg.role === 'player' ? <User2 size={20} /> : msg.role === 'opponent' ? selectedScenario.opponentAvatar : <Bot size={20} />}
                      </div>
                      <div className={cn(
                        "p-6 lg:p-8 rounded-[2.5rem] shadow-xl relative transition-all",
                        msg.role === 'player' 
                          ? 'bg-gradient-to-br from-indigo to-indigo-900 border-none text-white rounded-br-none' 
                          : 'bg-white/5 border border-white/5 text-slate-200 rounded-bl-none'
                      )}>
                         <p className="text-base lg:text-lg font-medium leading-relaxed italic">{msg.text}</p>
                      </div>
                   </motion.div>
                 ))}
                 {isTyping && (
                    <div className="flex gap-4 items-center">
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">{selectedScenario.opponentAvatar}</div>
                       <div className="bg-white/5 px-6 py-4 rounded-full flex gap-2">
                          {[0, 0.2, 0.4].map(d => <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-indigo" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d }} />)}
                       </div>
                    </div>
                 )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
           </div>

           {/* AI Hint */}
           <AnimatePresence>
              {showTip && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                  className="absolute bottom-40 left-10 right-10 p-5 rounded-2xl gradient-indigo text-white font-black uppercase text-[10px] tracking-widest italic shadow-2xl flex items-center gap-4 z-20">
                   <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Sparkles size={16} /></div>
                   {showTip}
                </motion.div>
              )}
           </AnimatePresence>

           {/* Input Bar */}
           <div className="p-10 border-t border-white/5 bg-white/2 space-y-6">
              <div className="flex items-center justify-between text-[9px] font-black text-slate-700 uppercase tracking-widest px-2">
                 <span>Deploy Tactical Counter</span>
                 <span>Llama-3 Reasoning Core Active</span>
              </div>
              <div className="grid lg:grid-cols-2 gap-4">
                 {responseOptions.map((resp: string, i: number) => (
                   <button 
                    key={i} 
                    onClick={() => sendResponse(i)}
                    className="p-6 rounded-3xl bg-white/2 border border-white/5 text-left text-slate-400 text-sm font-medium italic hover:border-indigo/40 hover:text-white transition-all group"
                   >
                     {resp}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </main>

      {/* Debrief Overlay */}
      <AnimatePresence>
        {showDebrief && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl w-full glass-card rounded-[4rem] border-indigo/30 bg-slate-900 overflow-hidden relative border-glow">
               <div className="p-16 lg:p-20 space-y-12">
                  <div className="flex justify-between items-center">
                     <h2 className="text-5xl font-black italic uppercase tracking-tighter font-display leading-none">Neural Report</h2>
                     <button onClick={() => setShowDebrief(false)} className="text-slate-500 hover:text-white transition-colors uppercase text-xs font-black tracking-widest">Close</button>
                  </div>

                  {debriefLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-8">
                       <RefreshCw size={56} className="text-indigo animate-spin" />
                       <p className="text-slate-500 font-black text-xl uppercase tracking-widest">De-Synthesizing Performance...</p>
                    </div>
                  ) : debrief && (
                    <div className="space-y-12">
                       <div className="text-center">
                          <div className="text-[12rem] font-black text-indigo italic font-display leading-none leading-[0.8]">{debrief.total_score}</div>
                          <p className="text-slate-600 text-xs font-black uppercase tracking-[1em] mt-10">Defense Index</p>
                       </div>

                       <div className="grid lg:grid-cols-2 gap-8">
                          <div className="p-8 rounded-[2.5rem] bg-emerald/5 border border-emerald/20 space-y-6">
                             <h4 className="text-emerald font-black text-lg uppercase tracking-widest border-b border-emerald/10 pb-4">Strategic Hits</h4>
                             <div className="space-y-3">
                                {debrief.what_you_did_well.map((p: string, i: number) => (
                                  <div key={i} className="flex gap-3 text-slate-300 italic text-sm">
                                    <div className="w-1 h-1 rounded-full bg-emerald mt-2" />
                                    {p}
                                  </div>
                                ))}
                             </div>
                          </div>
                          <div className="p-8 rounded-[2.5rem] bg-saffron/5 border border-saffron/20 space-y-6">
                             <h4 className="text-saffron font-black text-lg uppercase tracking-widest border-b border-saffron/10 pb-4">Tactical Gaps</h4>
                             <div className="space-y-3">
                                {debrief.missed_opportunities.map((p: string, i: number) => (
                                  <div key={i} className="flex gap-3 text-slate-300 italic text-sm">
                                    <div className="w-1 h-1 rounded-full bg-saffron mt-2" />
                                    {p}
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="p-10 rounded-[3rem] bg-black/40 border border-white/5">
                          <p className="text-2xl font-black italic text-white font-display text-center leading-relaxed">"{debrief.overall_feedback}"</p>
                       </div>

                       <button onClick={() => window.location.reload()} className="w-full py-6 rounded-2xl gradient-indigo text-white font-black uppercase text-xl italic tracking-tighter shadow-2xl shadow-indigo/20 transition-all hover:scale-105 active:scale-95">Relaunch Simulation Mode</button>
                    </div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
