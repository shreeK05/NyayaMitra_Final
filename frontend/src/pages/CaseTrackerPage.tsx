import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scale, Clock, ChevronRight, Plus, AlertCircle, CheckCircle2, Calendar, FileText } from 'lucide-react'
import { SAMPLE_CASES, formatDate, daysUntil } from '@/utils'
import type { Case } from '@/types'
import { cn } from '@/utils'

const TIMELINE_STEPS = [
  { id: 1, label: 'Incident Occurred', date: '15 Jan 2024', done: true, icon: '🚨' },
  { id: 2, label: 'Legal Notice Sent', date: '1 Feb 2024', done: true, icon: '📄' },
  { id: 3, label: 'Response Deadline', date: '16 Feb 2024', done: true, icon: '⏰' },
  { id: 4, label: 'Labour Commissioner Complaint', date: '20 Feb 2024', done: true, icon: '🏛️' },
  { id: 5, label: 'Conciliation Hearing', date: '15 Mar 2024', done: false, icon: '👥', current: true },
  { id: 6, label: 'Labour Court Filing', date: 'Upcoming', done: false, icon: '⚖️' },
  { id: 7, label: 'Resolution', date: 'Estimated Jul 2024', done: false, icon: '✅' },
]

function CaseCard({ c }: { c: Case }) {
  const [expanded, setExpanded] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const days = c.limitationDate ? daysUntil(c.limitationDate) : 999
  const isUrgent = days < 60
  const statusColor = c.status === 'active' ? '#10b981' : c.status === 'pending' ? '#f59e0b' : '#64748b'

  return (
    <motion.div layout className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: `${statusColor}15` }}>
            <Scale size={18} style={{ color: statusColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ color: statusColor, backgroundColor: `${statusColor}15` }}>
                {c.status.toUpperCase()}
              </span>
              {isUrgent && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 animate-pulse">
                  ⚡ {days}d left
                </span>
              )}
            </div>
            <p className="text-white font-bold text-sm">{c.title}</p>
            <p className="text-slate-400 text-xs mt-0.5 truncate">{c.facts}</p>
            {c.limitationDate && (
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                <Clock size={10} />
                <span>File by {formatDate(c.limitationDate)} ({days} days)</span>
              </div>
            )}
          </div>
          <span className="text-slate-500">{expanded ? '↑' : '↓'}</span>
        </div>
      </button>

      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-white/5 px-4 pb-4 pt-3 space-y-4">

          {/* Acts */}
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Applicable Laws</p>
            <div className="flex flex-wrap gap-2">
              {c.actsRelevant.map((act) => (
                <span key={act} className="px-2.5 py-1 rounded-xl text-[11px] bg-blue-500/10 border border-blue-500/20 text-blue-300">
                  {act}
                </span>
              ))}
            </div>
          </div>

          {/* Next Step */}
          {c.nextStep && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-400 text-[10px] font-bold uppercase mb-0.5">Next Action</p>
                <p className="text-emerald-200 text-xs">{c.nextStep}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase mb-3">Case Timeline</p>
            <div className="space-y-2">
              {TIMELINE_STEPS.map((step, i) => (
                <div key={step.id} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0',
                      step.done ? 'bg-emerald-500/20 text-emerald-400' :
                      step.current ? 'bg-orange-500/20 text-orange-400 ring-2 ring-orange-500/30' :
                      'bg-white/5 text-slate-600'
                    )}>
                      {step.done ? '✓' : step.icon}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={cn('w-0.5 h-4 mt-1', step.done ? 'bg-emerald-500/30' : 'bg-white/10')} />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className={cn('text-xs font-semibold', step.done ? 'text-slate-300' : step.current ? 'text-orange-400' : 'text-slate-600')}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Calendar size={9} /> {step.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ML Win Predictor */}
          <div className="glass-card rounded-xl p-3 border border-indigo-500/20 bg-indigo-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-indigo-400 font-bold uppercase mb-0.5">AI Outcome Predictor</p>
                <p className="text-xs text-indigo-300">Trained on 50,000+ judgments</p>
              </div>
              {!prediction ? (
                <button 
                  onClick={async () => {
                    import('@/utils/api').then(({ predictWinProbability }) => {
                      predictWinProbability({
                        case_type: c.type || 'civil',
                        state: 'Maharashtra',
                        court_level: 'district',
                        evidence: 'strong',
                        time_elapsed: 1.0
                      }).then(res => setPrediction(res))
                    })
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold hover:bg-indigo-500/30 transition-colors"
                >
                  Predict Win %
                </button>
              ) : (
                <div className="text-right">
                  <span className="text-indigo-400 text-xs mr-2">Win Probability:</span>
                  <span className="text-xl font-black text-indigo-300">{(prediction.win_probability * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
            {prediction && (
              <div className="mt-3 pt-3 border-t border-indigo-500/10">
                <p className="text-[10px] text-slate-400">Recommended Forum: <span className="text-slate-200">{prediction.recommended_forum}</span></p>
                <div className="w-full h-1.5 bg-indigo-950 rounded-full mt-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${prediction.win_probability * 100}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = '/generator'}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                         bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold hover:bg-orange-500/25 transition-all">
              <FileText size={14} />
              Generate Doc
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                       glass-card border border-white/10 text-slate-300 text-xs font-bold hover:border-white/20 transition-all">
              <ChevronRight size={14} />
              eCourts Status
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function CaseTrackerPage() {
  const [cases] = useState<Case[]>(SAMPLE_CASES)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="px-4 py-5 space-y-5 max-w-lg mx-auto">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-xl">My Cases</h2>
          <p className="text-slate-400 text-sm mt-0.5">Track limitation periods • Court dates • Next actions</p>
        </div>
        <button className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center 
                           glow-saffron transition-all hover:scale-105">
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Limitation Urgency Banner */}
      <div className="glass-card rounded-2xl p-3 border border-amber-500/20 flex items-start gap-2">
        <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-amber-200 text-xs leading-relaxed">
          <strong>1 case</strong> has a limitation period expiring within 60 days. 
          File immediately to preserve your legal rights.
        </p>
      </div>

      {/* Cases */}
      <div className="space-y-3">
        {cases.map((c) => <CaseCard key={c.id} c={c} />)}
      </div>

      {/* eCourts Integration */}
      <div className="glass-card rounded-2xl p-4 border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">📡 eCourts Integration</span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          Auto-sync your case status from eCourts.gov.in. Get alerts for hearing dates, orders, and judgements.
        </p>
        <button className="mt-3 w-full py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 
                           text-cyan-400 text-sm font-semibold hover:bg-cyan-500/25 transition-all">
          Connect eCourts Account
        </button>
      </div>

      {/* Limitation Calculator */}
      <div className="glass-card rounded-2xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-purple-400" />
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Limitation Period Guide</span>
        </div>
        <div className="space-y-2">
          {[
            { type: 'Consumer Complaint', days: 730, color: '#7c3aed' },
            { type: 'Wage Dispute', days: 1095, color: '#f59e0b' },
            { type: 'Cheque Bounce', days: 30, color: '#ef4444' },
            { type: 'Property Dispute', days: 4380, color: '#06b6d4' },
          ].map(({ type, days, color }) => (
            <div key={type} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
              <span className="text-slate-300 text-xs">{type}</span>
              <span className="text-xs font-bold" style={{ color }}>{days < 365 ? `${days} days` : `${Math.round(days/365)} years`}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
