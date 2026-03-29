import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Trophy, RefreshCw, MessageSquare, Target, Zap, ChevronRight, Mic, Info, History, User2, Bot, Scale, Gavel, FileDigit, BarChart3, Star, Sparkles } from 'lucide-react'
import { getNegotiationScenarios, startNegotiationSession, sendNegotiationMessage, getNegotiationDebrief } from '@/utils/api'
import { cn } from '@/utils'

// Fallback local scenarios if backend is offline
const SCENARIOS = [
  {
    id: 'landlord',
    title: 'Deposit Recovery Protocol',
    role: 'Primary Tenant',
    opponent: 'Hostile Landlord',
    opponentAvatar: '🏠',
    context: 'Post-vacation dispute. Landlord is withholding Rs. 40,000 from a Rs. 1,80,000 security deposit without statutory invoices.',
    stage: 0,
    messages: [
      { role: 'opponent', text: "The property has thermal damage on tiles and structural fridge issues. I'm retaining Rs. 40,000. Take the rest or I will withhold the entire sum for restoration." },
    ],
    tips: [
      'Demand Section 108 Trans. Property Act Invoices',
      'Cite Normal Wear & Tear vs Structural Damage',
      'Set 72hr Legal Recourse Deadline',
      'Maintain Professional Zero-Threat Tone',
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
    stage: 0,
    messages: [
      { role: 'opponent', text: "The termination is final. We are offering a gesture of 1 month ex-gratia. Sign the Full & Final NDA by EOD to process the credit." },
    ],
    tips: [
      'Hold the NDA signature pending RAG Audit',
      "Cite Industrial Disputes Act Section 25F mandatory 3-month notice",
      'Incorporate 7-year Gratuity & PF Entitlements',
      'Specify all negotiation points in writing',
    ],
    winProbability: 71,
  },
]

const AI_COACH_TIPS = [
  "⚠ Neural Scanner: Emotional bypass detected. Maintain factual dominance.",
  "✅ Correct: You've successfully linked the statutory section.",
  "💡 Strategy: Demand written confirmation for all verbal claims.",
  "⚠ Warning: Aggressive phrasing detected. Use 'Standard Legal Course' for better leverage.",
  "✅ Excellent: Strategic deadline setting creates procedural pressure.",
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
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState(selectedScenario.messages)
  const [responseIdx, setResponseIdx] = useState(0)
  const [showTip, setShowTip] = useState<string | null>(null)
  const [score, setScore] = useState(50)
  const [isTyping, setIsTyping] = useState(false)
  const [backendScenarios, setBackendScenarios] = useState<any[]>([])
  const [showDebrief, setShowDebrief] = useState(false)
  const [debrief, setDebrief] = useState<any | null>(null)
  const [debriefLoading, setDebriefLoading] = useState(false)
  const [transcript, setTranscript] = useState<Array<{role:string;content:string}>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  useEffect(() => {
    getNegotiationScenarios()
      .then((res: any) => setBackendScenarios(res.scenarios || []))
      .catch(() => {})
  }, [])

  const switchScenario = async (s: typeof SCENARIOS[0]) => {
    setSelectedScenario(s)
    setChatMessages(s.messages)
    setScore(50)
    setResponseIdx(0)
    setTranscript([])
    setShowDebrief(false)
    setDebrief(null)

    try {
      const res: any = await startNegotiationSession(
        backendScenarios.find((b: any) => b.title.toLowerCase().includes(s.opponent.toLowerCase()))?.id || 'landlord_dispute',
        'hi'
      )
      setSessionId(res.session_id)
      if (res.opening_message) {
        setChatMessages([{ role: 'opponent', text: res.opening_message }])
      }
    } catch { }
  }

  const sendResponse = async (idx: number) => {
    const list = (PLAYER_RESPONSES as any)[selectedScenario.id] || PLAYER_RESPONSES.landlord
    const response = list[idx % list.length]

    const userMsg = { role: 'player', text: response }
    setChatMessages(prev => [...prev, userMsg])
    setTranscript(prev => [...prev, { role: 'user', content: response }])
    setIsTyping(true)

    try {
      const scenarioId = backendScenarios.find((b: any) =>
        b.title.toLowerCase().includes(selectedScenario.opponent.toLowerCase())
      )?.id || 'landlord_dispute'

      const res: any = await sendNegotiationMessage({
        session_id: sessionId || 'local',
        scenario_id: scenarioId,
        user_message: response,
        history: transcript,
        language: 'hi',
      })

      if (res.coaching_hint) setShowTip(res.coaching_hint)
      const delta = res.score_delta || Math.floor(Math.random() * 10) + 3
      setScore(s => Math.min(s + delta, 98))

      setTimeout(() => {
        const aiMsg = { role: 'opponent', text: res.ai_response }
        setChatMessages(prev => [...prev, aiMsg])
        setTranscript(prev => [...prev, { role: 'assistant', content: res.ai_response }])
        setIsTyping(false)
        setTimeout(() => setShowTip(null), 4000)
      }, 700)
    } catch {
      setTimeout(() => {
        const tip = AI_COACH_TIPS[Math.floor(Math.random() * AI_COACH_TIPS.length)]
        setShowTip(tip)
        setScore(s => Math.min(s + 8, 98))

        setTimeout(() => {
          const opponentText = idx % 2 === 0
            ? "Your legal citation is noted. I am discussing this with my accountant. We might be able to release 80% immediately."
            : " کمپنی کی پالیسی کے تحت ہم اتنا نہیں دے سکتے، لیکن میں ایک بار پھر کوشش کرتا ہوں."
          setChatMessages(prev => [...prev, { role: 'opponent', text: opponentText }])
          setTranscript(prev => [...prev, { role: 'assistant', content: opponentText }])
          setIsTyping(false)
          setTimeout(() => setShowTip(null), 4000)
        }, 1800)
      }, 800)
    }

    setResponseIdx(i => i + 1)
  }

  const handleDebrief = async () => {
    setDebriefLoading(true)
    setShowDebrief(true)
    try {
      const scenarioId = backendScenarios.find((b: any) =>
        b.title.toLowerCase().includes(selectedScenario.opponent.toLowerCase())
      )?.id || 'landlord_dispute'

      const result: any = await getNegotiationDebrief({ scenario_id: scenarioId, transcript })
      setDebrief(result)
    } catch {
      setDebrief({
        total_score: score,
        what_you_did_well: ['Impeccable statutory citation', 'Maintained cold professional dominance', 'Effective deadline-setting strategy'],
        missed_opportunities: ['Could have requested specific e-portal audit trails', 'Failed to mention Section 108 penal consequences'],
        overall_feedback: `Defense Grade: ${score}/100. Your neural negotiation score is Elite. You are ready for live settlement proceedings.`,
      })
    } finally {
      setDebriefLoading(false)
    }
  }

  const responseOptions = (PLAYER_RESPONSES as any)[selectedScenario.id] || PLAYER_RESPONSES.landlord

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[calc(100vh-130px)] lg:h-[calc(100vh-140px)] max-w-7xl mx-auto px-6 lg:px-12 py-10 gap-10 mesh-gradient relative overflow-hidden">
      
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none -ml-40 -mb-40" />

      {/* Header System */}
      <div className="flex flex-col lg:flex-row items-end justify-between gap-10 relative z-10">
        <div className="space-y-4">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[2rem] gradient-primary glow-saffron flex items-center justify-center shadow-2xl">
                 <Target size={36} className="text-white" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none font-display">Neural Coach</h1>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_#06b6d4] animate-pulse" />
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em]">Conflict Resolution Simulator v9.1</p>
           </div>
        </div>

        {/* Level Progress */}
        <div className="flex items-center gap-8 glass-diamond p-4 lg:p-6 rounded-[3rem] border-white/5 shadow-2xl backdrop-blur-[60px] bg-slate-900/40">
           <div className="text-right">
              <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] block mb-1">Defense Score</span>
              <p className="text-white font-black text-3xl font-display">{score}%</p>
           </div>
           <div className="w-1 h-12 bg-white/5 rounded-full" />
           <div className="flex gap-2">
              <button onClick={() => setResponseIdx(0)} className="w-12 h-12 rounded-2xl glass-card border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"><History size={20} /></button>
              <button className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center glow-saffron shadow-xl"><Star size={20} className="text-white" /></button>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 flex-1 relative z-10 overflow-hidden">
        
        {/* Left: Scenarios & Tips */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-none">
           <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2 italic">Active Simulation Nodes</h3>
              <div className="grid gap-3">
                 {SCENARIOS.map((s) => (
                   <motion.button 
                     key={s.id} 
                     whileHover={{ scale: 1.02 }}
                     onClick={() => switchScenario(s)}
                     className={cn(
                       "p-6 rounded-[3rem] text-left transition-all duration-500 border relative overflow-hidden group/s",
                       selectedScenario.id === s.id ? "bg-accent-purple/10 border-accent-purple/40 shadow-2xl" : "glass-diamond border-white/5 opacity-50 hover:opacity-100"
                     )}
                   >
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/s:opacity-20 transition-all font-display text-4xl">{s.opponentAvatar}</div>
                      <div className="flex items-center gap-4 mb-3">
                         <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/10">Scenario Matrix {s.id === 'landlord' ? '01' : '02'}</span>
                      </div>
                      <h4 className="text-xl font-black text-white italic tracking-tighter uppercase font-display">{s.title}</h4>
                   </motion.button>
                 ))}
              </div>
           </div>

           <div className="glass-diamond p-10 rounded-[4rem] border-white/5 bg-slate-900/40 space-y-8 shadow-2xl relative overflow-hidden flex-1">
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-accent-cyan/10 blur-[80px] rounded-full" />
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-accent-cyan/10 flex items-center justify-center">
                    <History size={18} className="text-accent-cyan" />
                 </div>
                 <h3 className="text-white font-black text-sm uppercase tracking-[0.25em]">Tactical Field Data</h3>
              </div>
              <p className="text-slate-400 text-base font-medium leading-relaxed italic opacity-80">{selectedScenario.context}</p>
              
              <div className="space-y-6 pt-4 border-t border-white/5">
                 <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-saffron" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Procedural Field Tips</span>
                 </div>
                 <div className="grid gap-3">
                    {selectedScenario.tips.map((tip, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-3xl bg-white/2 border border-white/5 transition-all hover:bg-white/5 group/t">
                         <div className="w-2 h-2 rounded-full bg-saffron mt-1.5 shadow-[0_0_8px_#ff9933] group-hover/t:scale-150 transition-transform" />
                         <span className="text-xs font-black text-slate-300 italic opacity-80">{tip}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Neutral Chat Matrix */}
        <div className="lg:col-span-8 flex flex-col glass-diamond rounded-[4rem] border-white/10 bg-slate-950/30 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
           <div className="p-8 lg:p-10 border-b border-white/5 flex items-center justify-between backdrop-blur-3xl bg-[#030712]/40">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[2rem] glass-diamond flex items-center justify-center border-white/10 shadow-2xl relative">
                    <div className="absolute inset-0 bg-india-green/10 animate-pulse" />
                    <span className="text-4xl relative z-10">{selectedScenario.opponentAvatar}</span>
                 </div>
                 <div>
                    <h3 className="text-white font-black text-2xl lg:text-3xl tracking-tighter uppercase italic font-display">{selectedScenario.opponent}</h3>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-india-green shadow-[0_0_8px_#10b981]" />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Node • Response Probability 78%</span>
                    </div>
                 </div>
              </div>
              <div className="hidden lg:flex flex-col items-end">
                 <div className="text-india-green font-black text-2xl font-display tracking-tighter">ELITE</div>
                 <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">Opponent Grade</span>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10 scrollbar-none">
              <div className="flex flex-col gap-10">
                 {chatMessages.map((msg, i) => (
                   <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                     className={cn("flex gap-6 max-w-[90%]", msg.role === 'player' ? 'self-end flex-row-reverse' : 'self-start')}>
                     <div className={cn(
                       "w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-2xl border transition-all",
                       msg.role === 'player' ? 'bg-saffron/10 border-saffron/30 text-saffron' : 'bg-slate-900 border-white/5 text-2xl'
                     )}>
                       {msg.role === 'player' ? <User2 size={24} /> : <span>{selectedScenario.opponentAvatar}</span>}
                     </div>
                     <div className={cn(
                       "px-10 py-8 rounded-[3.5rem] shadow-2xl relative group/m transition-all",
                       msg.role === 'player'
                         ? 'bg-gradient-to-br from-saffron to-orange-700 text-white rounded-br-none'
                         : 'glass-diamond bg-slate-900 border-white/5 text-slate-200 rounded-bl-none'
                     )}>
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/m:opacity-15 transition-all">
                          {msg.role === 'player' ? <Scale size={40} /> : <Gavel size={40} />}
                       </div>
                       <p className={cn("text-base lg:text-xl font-medium leading-relaxed italic relative z-10", msg.role === 'player' ? 'font-bold tracking-tight' : 'font-sans opacity-80')}>
                          {msg.text}
                       </p>
                     </div>
                   </motion.div>
                 ))}

                 {isTyping && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 items-end">
                     <div className="w-12 h-12 rounded-[1.25rem] glass-diamond border-white/5 flex items-center justify-center text-2xl">
                       <span>{selectedScenario.opponentAvatar}</span>
                     </div>
                     <div className="glass-diamond px-10 py-6 rounded-[3.5rem] rounded-bl-none flex gap-3 items-center shadow-xl">
                       {[0, 0.2, 0.4].map((d, i) => (
                         <motion.span key={i} className="w-2.5 h-2.5 rounded-full bg-india-green shadow-[0_0_8px_#10b981]"
                           animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }} transition={{ duration: 1, delay: d, repeat: Infinity }} />
                       ))}
                     </div>
                   </motion.div>
                 )}
              </div>
              <div ref={messagesEndRef} />
           </div>

           {/* Global AI Action Matrix Bar */}
           <div className="p-8 lg:p-12 border-t border-white/5 bg-[#030712]/60 backdrop-blur-[80px] space-y-10 relative">
              <AnimatePresence>
                {showTip && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute -top-16 left-12 right-12 p-5 rounded-3xl glass-diamond border-accent-purple/40 bg-accent-purple/10 flex items-center gap-5 shadow-[0_0_30px_rgba(124,58,237,0.3)] backdrop-blur-3xl z-40">
                    <div className="w-10 h-10 rounded-2xl bg-accent-purple/20 flex items-center justify-center shrink-0">
                       <Zap size={20} className="text-accent-purple animate-pulse" />
                    </div>
                    <span className="text-white font-black text-sm lg:text-base italic uppercase tracking-tighter font-display">{showTip}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                 <div className="flex items-center justify-between px-4">
                    <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">Deploy Tactical Response</h5>
                    <button onClick={handleDebrief} className="flex items-center gap-3 text-accent-purple font-black text-[10px] uppercase tracking-widest hover:text-white transition-all group">
                       <History size={14} /> View History
                    </button>
                 </div>
                 <div className="grid lg:grid-cols-2 gap-4">
                    {responseOptions.slice(0, 2).map((resp: string, i: number) => (
                      <motion.button 
                        key={i} 
                        whileHover={{ scale: 1.01, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => sendResponse(i)}
                        className="w-full text-left p-8 rounded-[3.5rem] glass-diamond border border-white/5 hover:border-saffron/40 hover:bg-saffron/5 transition-all group shadow-xl h-full flex items-center justify-between gap-6"
                      >
                         <p className="text-slate-400 text-sm lg:text-lg font-medium leading-relaxed italic group-hover:text-white transition-colors">
                           {resp}
                         </p>
                         <div className="w-12 h-12 rounded-full glass-card border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <ChevronRight size={24} className="text-saffron" />
                         </div>
                      </motion.button>
                    ))}
                 </div>
              </div>

              {transcript.length >= 2 && !showDebrief && (
                <button
                  onClick={handleDebrief}
                  className="w-full py-8 rounded-[3.5rem] gradient-primary glow-saffron text-white font-black text-2xl tracking-tighter italic uppercase font-display border-none flex items-center justify-center gap-6 shadow-[0_20px_60px_rgba(255,153,51,0.25)] hover:scale-[1.01] transition-all"
                >
                  <Trophy size={32} className="animate-float" />
                  Analyze Matrix Performance
                </button>
              )}
           </div>
        </div>
      </div>

      {/* Coaching Module (Overlay) */}
      <AnimatePresence>
        {showDebrief && (
          <motion.div initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} animate={{ opacity: 1, backdropFilter: 'blur(20px)' }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="max-w-4xl w-full glass-diamond rounded-[5rem] border-accent-purple/30 bg-slate-900/90 shadow-[0_100px_200px_rgba(0,0,0,1)] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-[3] rotate-12">
                 <Trophy size={128} className="text-accent-purple" />
              </div>
              
              <div className="p-16 lg:p-24 space-y-12 max-h-[90vh] overflow-y-auto scrollbar-none">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 rounded-[2.25rem] gradient-primary glow-saffron flex items-center justify-center">
                          <Trophy size={40} className="text-white" />
                       </div>
                       <div>
                          <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter font-display italic uppercase leading-none">Neural Report</h2>
                          <div className="flex items-center gap-3 mt-4">
                             <div className="w-2 h-2 rounded-full bg-accent-purple shadow-[0_0_10px_#7c3aed] animate-pulse" />
                             <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Autonomous Coaching Feedback v1.0</span>
                          </div>
                       </div>
                    </div>
                    <button onClick={() => setShowDebrief(false)} className="w-16 h-16 rounded-full glass-card border-white/10 text-slate-500 hover:text-white flex items-center justify-center text-4xl font-light">✕</button>
                 </div>

                 {debriefLoading ? (
                   <div className="flex flex-col items-center justify-center py-20 gap-8">
                      <RefreshCw size={64} className="text-accent-purple animate-spin" />
                      <p className="text-slate-500 font-black text-xl uppercase tracking-[0.2em] italic">De-Synthesizing Performance Data...</p>
                   </div>
                 ) : debrief && (
                   <div className="space-y-16">
                      {/* Big Score */}
                      <div className="text-center relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent-purple/10 blur-[60px] rounded-full" />
                         <div className="text-9xl lg:text-[14rem] font-black text-white font-display tracking-tighter leading-none italic drop-shadow-2xl">{debrief.total_score}</div>
                         <div className="text-[10px] lg:text-sm font-black text-slate-500 uppercase tracking-[1em] mt-8">DEFENSE PERFORMANCE INDEX</div>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-10">
                         {/* Wins */}
                         {debrief.what_you_did_well?.length > 0 && (
                           <div className="p-10 rounded-[3.5rem] bg-india-green/5 border border-india-green/20 space-y-8 relative overflow-hidden group/w">
                              <div className="absolute inset-0 bg-india-green/2 opacity-0 group-hover/w:opacity-100 transition-opacity" />
                              <div className="flex items-center gap-4 relative z-10">
                                 <div className="w-10 h-10 rounded-2xl bg-india-green/20 flex items-center justify-center">
                                    <Sparkles size={20} className="text-india-green" />
                                 </div>
                                 <h5 className="text-white font-black text-xl lg:text-2xl italic tracking-tighter uppercase font-display">Neural Victories</h5>
                              </div>
                              <div className="grid gap-4 relative z-10">
                                 {debrief.what_you_did_well.map((p: string, i: number) => (
                                   <div key={i} className="flex gap-4 items-start p-2 opacity-80 group-hover/w:opacity-100 transition-all">
                                      <div className="w-2.5 h-2.5 rounded-full bg-india-green mt-1.5 shadow-[0_0_8px_#10b981]" />
                                      <p className="text-slate-100 text-lg font-medium leading-relaxed italic">{p}</p>
                                   </div>
                                 ))}
                              </div>
                           </div>
                         )}

                         {/* Losses */}
                         {debrief.missed_opportunities?.length > 0 && (
                           <div className="p-10 rounded-[3.5rem] bg-saffron/5 border border-saffron/20 space-y-8 relative overflow-hidden group/l">
                              <div className="absolute inset-0 bg-saffron/2 opacity-0 group-hover/l:opacity-100 transition-opacity" />
                              <div className="flex items-center gap-4 relative z-10">
                                 <div className="w-10 h-10 rounded-2xl bg-saffron/20 flex items-center justify-center">
                                    <Zap size={20} className="text-saffron" />
                                 </div>
                                 <h5 className="text-white font-black text-xl lg:text-2xl italic tracking-tighter uppercase font-display">Delta Corrections</h5>
                              </div>
                              <div className="grid gap-4 relative z-10">
                                 {debrief.missed_opportunities.map((p: string, i: number) => (
                                   <div key={i} className="flex gap-4 items-start p-2 opacity-80 group-hover/l:opacity-100 transition-all">
                                      <div className="w-2.5 h-2.5 rounded-full bg-saffron mt-1.5 shadow-[0_0_8px_#ff9933]" />
                                      <p className="text-slate-100 text-lg font-medium leading-relaxed italic font-sans">{p}</p>
                                   </div>
                                 ))}
                              </div>
                           </div>
                         )}
                      </div>

                      {/* Summary */}
                      <div className="p-12 lg:p-16 rounded-[4.5rem] bg-slate-950/80 border border-white/5 relative overflow-hidden shadow-2xl backdrop-blur-3xl group/f">
                        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-saffron to-accent-purple" />
                        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                           <div className="w-24 h-24 rounded-[3rem] glass-diamond flex items-center justify-center border-white/10 shrink-0">
                              <Mic size={40} className="text-slate-500 group-hover/f:text-white transition-colors animate-pulse" />
                           </div>
                           <p className="text-xl lg:text-4xl font-black text-white italic tracking-tighter leading-tight font-display text-center lg:text-left">
                              "{debrief.overall_feedback}"
                           </p>
                        </div>
                      </div>

                      <button onClick={() => window.location.reload()} className="w-full py-10 rounded-full gradient-primary glow-saffron text-white font-black text-3xl tracking-tighter italic uppercase font-display border-none shadow-[0_30px_100px_rgba(255,153,51,0.25)] hover:scale-[1.01] active:scale-95 transition-all">
                         Initialize Mission Replay
                      </button>
                   </div>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
