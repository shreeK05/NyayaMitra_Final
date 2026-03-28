import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Trophy, RefreshCw } from 'lucide-react'
import { getNegotiationScenarios, startNegotiationSession, sendNegotiationMessage, getNegotiationDebrief } from '@/utils/api'

// Fallback local scenarios if backend is offline
const SCENARIOS = [
  {
    id: 'landlord',
    title: 'Landlord refusing deposit refund',
    role: 'Tenant',
    opponent: 'Landlord',
    opponentAvatar: '🏠',
    context: 'You vacated 2 months ago. Landlord claims damages worth Rs. 40,000 from your Rs. 1,80,000 deposit but refuses to show invoices.',
    stage: 0,
    messages: [
      { role: 'opponent', text: "You damaged the fridge and bathroom tiles. I need Rs. 40,000 from your deposit. Take it or leave it." },
    ],
    tips: [
      'Ask for itemized damage invoice with photos',
      'Cite Transfer of Property Act Section 108',
      'Set 7-day deadline else file RERA complaint',
      'Do NOT use aggressive language',
    ],
    winProbability: 78,
  },
  {
    id: 'employer',
    title: 'Negotiating salary on termination',
    role: 'Employee',
    opponent: 'HR Manager',
    opponentAvatar: '💼',
    context: 'You were terminated without cause or notice. HR offers 1 month severance but you are entitled to 3 months under Industrial Disputes Act.',
    stage: 0,
    messages: [
      { role: 'opponent', text: "We're offering 1 month salary as ex-gratia. Sign the settlement NDA today and you'll get payment in 5 days." },
    ],
    tips: [
      'Do NOT sign the NDA yet — get it reviewed',
      "Cite Industrial Disputes Act Section 25F for 3 months' notice pay",
      'Calculate full gratuity, PF, and pending leaves',
      'Request all communications in writing only',
    ],
    winProbability: 71,
  },
]

const AI_COACH_TIPS = [
  "⚠ Too emotional — keep it professional and factual",
  "✅ Good! You cited the correct law section",
  "💡 Pro tip: Ask for written confirmation of all verbal claims",
  "⚠ Avoid threatening — say 'legal recourse' not 'I'll destroy you'",
  "✅ Excellent! Deadline-setting creates appropriate urgency",
]

const PLAYER_RESPONSES = {
  landlord: [
    "I understand you have concerns about damage. Please provide me with itemized invoices with photos for each claimed item within 7 days, as required under Transfer of Property Act Section 108.",
    "I dispute your assessment. The property was in normal wear-and-tear condition. I have photographic evidence from move-in and move-out. I expect the balance Rs. 1,40,000 within 7 days or I will file a complaint with the Rent Control Authority.",
    "Let's resolve this amicably. According to law, you must return the deposit within 30 days of my vacating. I would prefer not to escalate, but I will if necessary.",
  ],
  employer: [
    "Thank you for the offer. I need to review this document with my legal counsel before signing. Per Industrial Disputes Act Section 25F, I am entitled to 3 months' compensation. Can we discuss the actual entitlement?",
    "I appreciate the discussion. My entitlements include: 3 months notice pay + 7 years gratuity + 42 days earned leave. I'd like an itemized settlement sheet before proceeding.",
    "I'm open to settlement, but it needs to reflect my statutory entitlements. I prefer we resolve this in good faith rather than at the Labour Commissioner.",
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

  // Load backend scenarios on mount
  useEffect(() => {
    getNegotiationScenarios()
      .then((res: any) => setBackendScenarios(res.scenarios || []))
      .catch(() => {/* use local fallback */})
  }, [])

  // Start a new session when scenario changes
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
      // Replace default opening with backend AI opening
      if (res.opening_message) {
        setChatMessages([{ role: 'opponent', text: res.opening_message }])
      }
    } catch { /* use local messages */ }
  }

  const sendResponse = async (idx: number) => {
    const scenarios = (PLAYER_RESPONSES as any)[selectedScenario.id] || PLAYER_RESPONSES.landlord
    const response = scenarios[idx % scenarios.length]

    const userMsg = { role: 'player', text: response }
    setChatMessages(prev => [...prev, userMsg])
    setTranscript(prev => [...prev, { role: 'user', content: response }])
    setIsTyping(true)

    try {
      // Try real backend
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
      setScore(s => Math.min(s + delta, 95))

      setTimeout(() => {
        const aiMsg = { role: 'opponent', text: res.ai_response }
        setChatMessages(prev => [...prev, aiMsg])
        setTranscript(prev => [...prev, { role: 'assistant', content: res.ai_response }])
        setIsTyping(false)
        setTimeout(() => setShowTip(null), 3000)
      }, 500)
    } catch {
      // Fallback to local responses
      setTimeout(() => {
        const tip = AI_COACH_TIPS[Math.floor(Math.random() * AI_COACH_TIPS.length)]
        setShowTip(tip)
        setScore(s => Math.min(s + Math.floor(Math.random() * 12) + 3, 95))

        setTimeout(() => {
          const opponentText = idx % 2 === 0
            ? "Fine. Send me the account details, I'll transfer the balance within 5 days."
            : "I cannot do more than what company policy allows. But I can check if there's any flexibility."
          setChatMessages(prev => [...prev, { role: 'opponent', text: opponentText }])
          setTranscript(prev => [...prev, { role: 'assistant', content: opponentText }])
          setIsTyping(false)
          setShowTip(null)
        }, 1800)
      }, 800)
    }

    setResponseIdx(i => i + 1)
  }

  const getDebrief = async () => {
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
        what_you_did_well: ['Maintained professional tone', 'Cited relevant laws'],
        missed_opportunities: ['Could have cited more specific sections', 'Did not set clear deadline'],
        overall_feedback: `You scored ${score}/100. Keep practicing to build legal confidence!`,
      })
    } finally {
      setDebriefLoading(false)
    }
  }

  const scenarios = (PLAYER_RESPONSES as any)[selectedScenario.id] || PLAYER_RESPONSES.landlord

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)] max-w-lg mx-auto">
      {/* Scenario Selector */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {SCENARIOS.map((s) => (
            <button key={s.id}
              onClick={() => switchScenario(s)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedScenario.id === s.id
                  ? 'gradient-primary text-white'
                  : 'glass-card text-slate-400 hover:text-white border border-white/5'
              }`}>
              {s.opponentAvatar} {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Info */}
      <div className="px-4 py-2">
        <div className="glass-card rounded-2xl p-3 border border-pink-500/20">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex gap-2 items-center mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-500/15 text-pink-400 font-bold">
                  You: {selectedScenario.role}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-700 text-slate-400 font-bold">
                  vs {selectedScenario.opponent}
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{selectedScenario.context}</p>
            </div>
            <div className="text-center shrink-0">
              <div className="text-emerald-400 font-black text-lg">{selectedScenario.winProbability}%</div>
              <div className="text-slate-500 text-[10px]">Win rate</div>
            </div>
          </div>

          {/* Your negotiation score */}
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Your Negotiation Score</span>
              <span className="text-emerald-400 font-bold">{score}/100</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {chatMessages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === 'player' ? 'justify-end' : 'justify-start'}`}>
            {msg.role !== 'player' && (
              <div className="w-8 h-8 rounded-xl glass-card border border-white/10 flex items-center justify-center shrink-0 text-base mt-auto">
                {selectedScenario.opponentAvatar}
              </div>
            )}
            <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm ${
              msg.role === 'player'
                ? 'bg-orange-500/15 border border-orange-500/25 text-white rounded-br-sm'
                : 'glass-card text-slate-200 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-2 items-end">
            <div className="w-8 h-8 rounded-xl glass-card border border-white/10 flex items-center justify-center text-base">
              {selectedScenario.opponentAvatar}
            </div>
            <div className="glass-card rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
              {[0, 0.2, 0.4].map((d, i) => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500"
                  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, delay: d, repeat: Infinity }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Coach Tip */}
      <AnimatePresence>
        {showTip && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-4 p-2.5 rounded-xl glass-card border border-purple-500/30">
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-purple-400 shrink-0" />
              <span className="text-purple-300 text-xs">{showTip}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Tips */}
      <div className="px-4 py-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {selectedScenario.tips.map((tip) => (
            <span key={tip}
              className="shrink-0 px-2.5 py-1 rounded-xl glass-card border border-white/5 text-[10px] text-slate-400">
              💡 {tip}
            </span>
          ))}
        </div>
      </div>

      {/* Response Options */}
      <div className="px-4 pb-2 space-y-2">
        <p className="text-slate-500 text-[10px] uppercase font-bold text-center">Choose Your Response</p>
        {scenarios.slice(0, 2).map((resp: string, i: number) => (
          <motion.button key={i} whileTap={{ scale: 0.98 }}
            onClick={() => sendResponse(i)}
            className="w-full text-left p-3 rounded-xl glass-card border border-white/5 
                       hover:border-orange-500/30 transition-all group">
            <p className="text-slate-300 text-xs leading-relaxed group-hover:text-white transition-colors line-clamp-2">
              {resp}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Get Debrief */}
      {transcript.length >= 2 && !showDebrief && (
        <div className="px-4 pb-4">
          <button
            onClick={getDebrief}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                       bg-purple-500/15 border border-purple-500/30 text-purple-300 
                       font-semibold text-sm hover:bg-purple-500/25 transition-all"
          >
            <Trophy size={16} />
            Get AI Coaching Report
          </button>
        </div>
      )}

      {/* Debrief Panel */}
      <AnimatePresence>
        {showDebrief && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-4 mb-4 p-4 rounded-2xl glass-card border border-purple-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-purple-400" />
              <h4 className="text-white font-bold text-sm">AI Coaching Report</h4>
              <button onClick={() => setShowDebrief(false)} className="ml-auto text-slate-500 hover:text-slate-300 text-xs">✕</button>
            </div>

            {debriefLoading ? (
              <div className="flex items-center gap-2 text-purple-300 text-sm">
                <RefreshCw size={14} className="animate-spin" />
                Analysing your negotiation...
              </div>
            ) : debrief && (
              <div className="space-y-3">
                {/* Score */}
                <div className="text-center py-2">
                  <div className="text-4xl font-black text-purple-400">{debrief.total_score}</div>
                  <div className="text-slate-400 text-xs">/100 Negotiation Score</div>
                </div>

                {/* What you did well */}
                {debrief.what_you_did_well?.length > 0 && (
                  <div>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1.5">✅ What You Did Well</p>
                    {debrief.what_you_did_well.map((p: string, i: number) => (
                      <p key={i} className="text-xs text-slate-300 mb-1">• {p}</p>
                    ))}
                  </div>
                )}

                {/* Missed opportunities */}
                {debrief.missed_opportunities?.length > 0 && (
                  <div>
                    <p className="text-[10px] text-amber-400 font-bold uppercase mb-1.5">💡 Missed Opportunities</p>
                    {debrief.missed_opportunities.map((p: string, i: number) => (
                      <p key={i} className="text-xs text-slate-300 mb-1">• {p}</p>
                    ))}
                  </div>
                )}

                {/* Overall */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/8">
                  <p className="text-xs text-slate-300 leading-relaxed">{debrief.overall_feedback}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
