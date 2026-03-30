import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Trophy, RefreshCw, MessageSquare, Target, Zap, ChevronRight, 
  Mic, Info, History, User2, Bot, Scale, Gavel, FileDigit, 
  BarChart3, Star, Sparkles, ArrowLeft, Send, Activity, ShieldCheck,
  TrendingUp, Fingerprint, Lock, ChevronDown, ListFilter, Search
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
  const [chatMessages, setChatMessages] = useState(selectedScenario.messages)
  const [responseIdx, setResponseIdx] = useState(0)
  const [showTip, setShowTip] = useState<string | null>(null)
  const [score, setScore] = useState(50)
  const [isTyping, setIsTyping] = useState(false)
  const [showDebrief, setShowDebrief] = useState(false)
  const [debrief, setDebrief] = useState<any | null>(null)
  const [debriefLoading, setDebriefLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const switchScenario = async (s: typeof SCENARIOS[0]) => {
    setSelectedScenario(s)
    setChatMessages(s.messages)
    setScore(50)
    setResponseIdx(0)
    setShowDebrief(false)
    setDebrief(null)
  }

  const sendResponse = async (response: string) => {
    const userMsg = { role: 'player', text: response }
    setChatMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    // Demo simulation
    setTimeout(() => {
      const aiResponse = "Your statutory citation is technically accurate. However, the property restoration is non-negotiable from my end. Can we agree on a 15% reduction instead of 25%?"
      setChatMessages(prev => [...prev, { role: 'opponent', text: aiResponse }])
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
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-indigo/30">
      
      {/* 🧭 Strategic Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-nav border-b border-white/5 bg-[#030712]/80 backdrop-blur-3xl">
        <div className="container mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="w-12 h-12 rounded-xl glass-card border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
              <ArrowLeft size={20} className="text-slate-400 group-hover:text-white" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-indigo/10 group-hover:bg-indigo/20 transition-all" />
                 <Target size={24} className="text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter font-display leading-none text-white">Negotiation Coach</h1>
                <p className="text-[9px] text-indigo font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo animate-pulse shadow-[0_0_8px_#6366f1]" />
                  Conflict_Sparring_v9.1
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic opacity-60">Defense Dominance Index</span>
               <span className="text-indigo font-black text-3xl italic font-display leading-none mt-1 shadow-text">{score}%</span>
            </div>
            <button onClick={handleDebrief} className="px-10 py-3.5 rounded-2xl gradient-indigo text-white font-black uppercase text-xs tracking-widest shadow-[0_15px_40px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all">DEBRIEF_SYNC</button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 lg:px-12 max-w-7xl pt-40 pb-32">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Simulation Sidebar */}
          <div className="lg:col-span-4 space-y-12">
             <div className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] px-4 italic">Neural Simulation Nodes</h3>
                <div className="grid gap-6">
                   {SCENARIOS.map((s) => (
                      <button 
                        key={s.id} 
                        onClick={() => switchScenario(s)}
                        className={cn(
                          "w-full p-10 rounded-[3.5rem] text-left transition-all duration-700 border border-glow flex items-center gap-8 group shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden",
                          selectedScenario.id === s.id ? "glass-card border-white/20 bg-indigo/5 scale-[1.03]" : "bg-black/40 border-white/5 opacity-40 hover:opacity-100 hover:bg-white/2"
                        )}
                      >
                         {selectedScenario.id === s.id && <div className="absolute inset-0 bg-gradient-to-r from-indigo/5 to-transparent animate-pulse" />}
                         <span className="text-6xl transition-transform group-hover:scale-110 drop-shadow-2xl relative z-10">{s.opponentAvatar}</span>
                         <div className="relative z-10">
                           <h4 className="text-2xl font-black italic uppercase tracking-tighter font-display leading-tight text-white mb-1 font-neural italic">{s.title}</h4>
                           <span className="text-[10px] font-black text-indigo uppercase tracking-[0.3em] opacity-80">{s.opponent}</span>
                         </div>
                      </button>
                   ))}
                </div>
             </div>

             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-12 rounded-[4rem] border-white/5 border-glow space-y-12 bg-black/40 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-110"><Shield size={120} className="text-indigo" /></div>
                <div className="space-y-8 relative z-10">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                      <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo shadow-xl"><Info size={20} /></div>
                      <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Neural Tactical Brief</h5>
                   </div>
                   <p className="text-slate-400 text-xl font-medium leading-[1.6] italic opacity-80 text-center">"{selectedScenario.context}"</p>
                   <div className="space-y-6">
                      <h6 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic border-t border-white/5 pt-8">FIELD STRATEGY VECTORS</h6>
                      {selectedScenario.tips.map((tip, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                          <div className="w-2 h-2 rounded-full bg-indigo mt-1.5 shadow-[0_0_10px_var(--indigo)] animate-pulse" />
                          <span className="text-base font-medium text-slate-500 italic group-hover:text-white transition-colors">{tip}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          </div>

          {/* Combat Engagement Hub */}
          <div className="lg:col-span-8 flex flex-col glass-card rounded-[5rem] border-white/10 bg-black/40 overflow-hidden relative border-glow shadow-[0_50px_100px_rgba(0,0,0,0.8)] h-[1200px]">
             
             {/* Opponent Header */}
             <div className="p-12 lg:p-16 border-b border-white/5 flex items-center justify-between bg-white/2 relative z-10">
                <div className="flex items-center gap-10">
                   <div className="w-24 h-24 rounded-[2.5rem] bg-black border border-white/10 flex items-center justify-center text-5xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-glow group animate-float">
                      <div className="transition-transform group-hover:scale-110 group-hover:rotate-12 duration-700">{selectedScenario.opponentAvatar}</div>
                   </div>
                   <div className="space-y-3">
                      <span className="text-indigo text-[10px] font-black uppercase tracking-[0.5em] mb-1 block opacity-80 italic italic">Conflict Entity: Engaged</span>
                      <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter font-display leading-[0.8] text-white italic">{selectedScenario.opponent}</h2>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-emerald uppercase tracking-widest italic">Signal_Strength</span>
                      <div className="flex gap-1 mt-1">
                         {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-emerald shadow-[0_0_8px_#10b981] rounded-full animate-pulse" />)}
                      </div>
                   </div>
                </div>
             </div>

             {/* Transmission Feed */}
             <div className="flex-1 overflow-y-auto p-12 lg:p-20 space-y-16 scrollbar-none relative">
                <AnimatePresence>
                   {chatMessages.map((msg, i) => (
                     <motion.div key={i} initial={{ opacity: 0, x: msg.role === 'player' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
                       className={cn("flex gap-10 max-w-[90%]", msg.role === 'player' ? 'ml-auto flex-row-reverse' : '')}>
                        <div className={cn(
                          "w-16 h-16 rounded-[1.75rem] flex items-center justify-center shrink-0 border shadow-2xl transition-all duration-700",
                          msg.role === 'player' ? 'bg-indigo/10 border-indigo/40 text-indigo animate-float' : 'bg-black border-white/10 text-3xl animate-float-slow'
                        )}>
                          {msg.role === 'player' ? <User2 size={32} /> : selectedScenario.opponentAvatar}
                        </div>
                        <div className={cn(
                          "p-10 lg:p-14 rounded-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative transition-all border-glow",
                          msg.role === 'player' 
                            ? 'bg-gradient-to-br from-indigo to-indigo-900 border-none text-white rounded-br-none shadow-indigo/20' 
                            : 'bg-white/5 border border-white/5 text-slate-200 rounded-bl-none'
                        )}>
                           <p className="text-xl lg:text-3xl font-black italic tracking-tighter leading-snug font-neural italic">{msg.text}</p>
                           {msg.role === 'opponent' && <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-indigo/20 mt-[-10px] ml-[-10px] blur-sm animate-pulse" />}
                        </div>
                     </motion.div>
                   ))}
                   {isTyping && (
                      <div className="flex gap-8 items-center">
                         <div className="w-16 h-16 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-3xl">{selectedScenario.opponentAvatar}</div>
                         <div className="bg-white/5 px-10 py-6 rounded-[3rem] flex gap-4 border border-white/5 shadow-inner">
                            {[0, 0.2, 0.4].map(d => <motion.div key={d} className="w-3 h-3 rounded-full bg-indigo shadow-[0_0_15px_var(--indigo)]" animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }} transition={{ repeat: Infinity, duration: 1, delay: d }} />)}
                         </div>
                      </div>
                   )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
             </div>

             {/* AI Tactic Overlay */}
             <AnimatePresence>
                {showTip && (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 80, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-3xl gradient-indigo text-white font-black uppercase text-[10px] tracking-[0.5em] italic shadow-[0_40px_100px_rgba(99,102,241,0.5)] flex items-center gap-6 z-[200] border-2 border-white/30 backdrop-blur-3xl px-10 py-6 animate-neural-pulse">
                     <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0"><Sparkles size={24} /></div>
                     <span className="text-xl">{showTip}</span>
                  </motion.div>
                )}
             </AnimatePresence>

             {/* Tactical Selector Bar */}
             <div className="p-10 lg:p-14 border-t border-white/5 bg-white/2 relative z-10 space-y-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-4">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo border border-indigo/20"><Bot size={16} /></div>
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] italic shadow-text">Llama-3 Reasoning Core Active</span>
                   </div>
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic opacity-60 px-6 py-2 rounded-full border border-white/5 bg-black/40">Manual Counter Deployment Zone</span>
                </div>
                <div className="grid grid-cols-1 gap-6">
                   {responseOptions.map((resp: string, i: number) => (
                     <button 
                      key={i} 
                      onClick={() => sendResponse(resp)}
                      className="p-10 lg:p-12 rounded-[3rem] bg-black/60 border border-white/5 text-left text-slate-400 text-xl font-black italic tracking-tighter hover:border-indigo/40 hover:text-white transition-all group relative overflow-hidden shadow-2xl border-glow"
                     >
                        <div className="absolute inset-0 bg-indigo/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-8 relative z-10">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-slate-800 group-hover:text-indigo group-hover:border-indigo/20 transition-all font-display">0{i+1}</div>
                           <p className="flex-1 group-hover:translate-x-2 transition-transform duration-500 font-neural italic">"{resp}"</p>
                           <ChevronRight size={28} className="text-slate-900 group-hover:text-indigo transition-all transform group-hover:translate-x-3" />
                        </div>
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Neural Debrief Overlay */}
      <AnimatePresence>
        {showDebrief && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="max-w-6xl w-full glass-card rounded-[5rem] border-indigo/40 bg-[#030712] overflow-hidden relative border-glow shadow-[0_50px_200px_rgba(0,0,0,1)]">
               <div className="p-16 lg:p-32 space-y-20 relative">
                  <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo/5 blur-[200px] rounded-full pointer-events-none" />
                  <div className="flex justify-between items-center relative z-10">
                     <div className="space-y-4 text-left">
                        <span className="text-indigo text-[11px] font-black uppercase tracking-[1em] italic opacity-80">Operational_Debrief_v9.1</span>
                        <h2 className="text-6xl lg:text-9xl font-black italic uppercase tracking-tighter font-display leading-[0.7] text-white italic">Neural Report</h2>
                     </div>
                     <button onClick={() => setShowDebrief(false)} className="w-20 h-20 rounded-full glass-card border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all hover:scale-110"><ArrowLeft size={32} className="rotate-90" /></button>
                  </div>

                  {debriefLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-12 relative z-10">
                       <div className="w-32 h-32 rounded-[3.5rem] bg-indigo/10 border-2 border-indigo/40 flex items-center justify-center text-indigo shadow-[0_0_100px_rgba(99,102,241,0.3)] animate-[spin_3s_linear_infinite]">
                          <RefreshCw size={80} />
                       </div>
                       <p className="text-slate-600 font-black text-2xl uppercase tracking-[1em] italic opacity-60">De-Synthesizing Performance Lattice...</p>
                    </div>
                  ) : debrief && (
                    <div className="space-y-32 relative z-10">
                       <div className="text-center relative group">
                          <div className="absolute inset-0 bg-indigo/5 blur-[150px] rounded-full transform group-hover:scale-125 transition-transform duration-1000" />
                          <div className="text-[15rem] lg:text-[22rem] font-black text-indigo italic font-display leading-[0.7] tracking-tighter text-glow-indigo relative z-10">{debrief.total_score}</div>
                          <p className="text-slate-700 text-sm font-black uppercase tracking-[2em] mt-20 relative z-10 opacity-60">Defense Dominance Index</p>
                       </div>

                       <div className="grid lg:grid-cols-2 gap-16">
                          <div className="p-16 rounded-[4rem] bg-emerald/5 border border-emerald/40 space-y-12 shadow-2xl relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent" />
                             <div className="flex items-center gap-6 border-b border-emerald/10 pb-10">
                                <ShieldCheck size={40} className="text-emerald animate-pulse" />
                                <h4 className="text-emerald font-black text-2xl uppercase tracking-[0.3em] font-display italic">Strategic Success Nodes</h4>
                             </div>
                             <div className="space-y-8">
                                {debrief.what_you_did_well.map((p: string, i: number) => (
                                  <div key={i} className="flex gap-6 text-white text-2xl font-black italic tracking-tighter opacity-80 group-hover:opacity-100 transition-all">
                                    <div className="w-3 h-3 rounded-full bg-emerald mt-3 shadow-[0_0_15px_#10b981]" />
                                    "{p}"
                                  </div>
                                ))}
                             </div>
                          </div>
                          <div className="p-16 rounded-[4rem] bg-saffron/5 border border-saffron/40 space-y-12 shadow-2xl relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-saffron/5 to-transparent" />
                             <div className="flex items-center gap-6 border-b border-saffron/10 pb-10">
                                <Target size={40} className="text-saffron animate-pulse" />
                                <h4 className="text-saffron font-black text-2xl uppercase tracking-[0.3em] font-display italic">Tactical Vulnerabilities</h4>
                             </div>
                             <div className="space-y-8">
                                {debrief.missed_opportunities.map((p: string, i: number) => (
                                  <div key={i} className="flex gap-6 text-slate-400 text-2xl font-black italic tracking-tighter opacity-70 group-hover:opacity-100 transition-all">
                                    <div className="w-3 h-3 rounded-full bg-saffron mt-3 shadow-[0_0_15px_#ff9933]" />
                                    "{p}"
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="p-20 rounded-[5rem] bg-black/60 border border-white/5 border-glow shadow-inner group">
                          <div className="mb-10 opacity-30 flex justify-center"><Bot size={60} className="text-indigo group-hover:rotate-12 transition-transform duration-700" /></div>
                          <p className="text-3xl lg:text-5xl font-black italic text-white font-display text-center leading-[1.1] tracking-tighter italic">"{debrief.overall_feedback}"</p>
                       </div>

                       <div className="flex flex-col lg:flex-row gap-10">
                          <button onClick={() => window.location.reload()} className="flex-1 py-10 rounded-[3rem] glass-card border border-white/10 text-slate-600 font-black uppercase text-xs tracking-widest italic hover:text-white transition-all shadow-2xl">Relinquish Simulation</button>
                          <button onClick={() => window.location.reload()} className="flex-[2] py-10 rounded-[3rem] gradient-indigo text-white font-black uppercase text-4xl italic tracking-tighter shadow-[0_30px_100px_rgba(99,102,241,0.5)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-8 group">
                             <RefreshCw size={48} className="group-hover:rotate-180 transition-transform duration-1000" />
                             RISE_AND_RETRY
                          </button>
                       </div>
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
