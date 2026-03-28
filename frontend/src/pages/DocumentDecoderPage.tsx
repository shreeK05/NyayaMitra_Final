import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Camera, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, XCircle, FileText, Shield, RefreshCw, Copy, Check
} from 'lucide-react'
import { cn } from '@/utils'
import { analyzeDocumentDemo, analyzeDocumentFile, analyzeDocumentText, generateCounterClause } from '@/utils/api'

// Risk level mapping: backend uses red/amber/green, UI uses danger/caution/safe
const RISK_MAP: Record<string, { label: string; color: string; bg: string; border: string; Icon: React.FC<{size?:number;className?:string}> }> = {
  red: { label: 'ILLEGAL', color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', Icon: XCircle },
  amber: { label: 'CAUTION', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', Icon: AlertTriangle },
  green: { label: 'SAFE', color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)', Icon: CheckCircle2 },
}

interface BackendClause {
  id: number
  text: string
  risk_level: 'red' | 'amber' | 'green'
  explanation: string
  legal_basis: string
  ipc_warnings: Array<{ old: string; new: string; note: string }>
  has_counter: boolean
}

function CounterClausePanel({ clause }: { clause: BackendClause }) {
  const [counter, setCounter] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchCounter = async () => {
    setLoading(true)
    try {
      const res = await generateCounterClause(clause.text, clause.risk_level)
      setCounter(res.counter_clause)
    } catch {
      setCounter('Could not generate counter-clause. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (counter) {
      navigator.clipboard.writeText(counter)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
      <p className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
        <Shield size={10} /> Counter-Clause Generator
      </p>
      {!counter ? (
        <button
          onClick={fetchCounter}
          disabled={loading}
          className="flex items-center gap-2 text-xs text-emerald-400 font-semibold hover:text-emerald-300 transition-colors disabled:opacity-50"
        >
          {loading ? <RefreshCw size={12} className="animate-spin" /> : <Shield size={12} />}
          {loading ? 'AI generating counter-clause...' : 'Generate AI Counter-Clause'}
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-emerald-200 text-xs leading-relaxed whitespace-pre-wrap">{counter}</p>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? 'Copied!' : 'Copy counter-clause'}
          </button>
        </div>
      )}
    </div>
  )
}

function ClauseCard({ clause, index }: { clause: BackendClause; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const risk = RISK_MAP[clause.risk_level] || RISK_MAP.green
  const { Icon } = risk

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden border transition-all duration-200"
      style={{ borderColor: risk.border, backgroundColor: risk.bg }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex items-start gap-3">
          <span style={{ color: risk.color }} className="shrink-0 mt-0.5">
            <Icon size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ color: risk.color, backgroundColor: risk.bg, border: `1px solid ${risk.border}` }}
              >
                {risk.label}
              </span>
              {clause.ipc_warnings.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-semibold">
                  ⚠ IPC→BNS Outdated
                </span>
              )}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">{clause.text}</p>
          </div>
          <span style={{ color: risk.color }}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              {/* Legal Analysis */}
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1.5">Legal Analysis</p>
                <p className="text-sm text-slate-300 leading-relaxed">{clause.explanation}</p>
              </div>

              {/* Legal Basis */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/8">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Applicable Law</p>
                <p className="text-xs text-slate-300">{clause.legal_basis}</p>
              </div>

              {/* IPC→BNS Warnings */}
              {clause.ipc_warnings.map((w, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <p className="text-[10px] text-orange-400 font-bold uppercase mb-1">⚠ Outdated Law Citation</p>
                  <p className="text-xs text-orange-200">
                    <strong>{w.old}</strong> → <strong>{w.new}</strong> — {w.note}
                  </p>
                </div>
              ))}

              {/* Counter Clause Generator */}
              {clause.has_counter && <CounterClausePanel clause={clause} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function DocumentDecoderPage() {
  const [stage, setStage] = useState<'upload' | 'analyzing' | 'results'>('upload')
  const [progress, setProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [textMode, setTextMode] = useState(false)
  const [pastedText, setPastedText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const runAnalysis = useCallback(async (analysisFn: () => Promise<any>) => {
    setStage('analyzing')
    setError(null)
    setProgress(0)

    // Animated progress bar while API call runs
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 3, 90))
    }, 150)

    try {
      const result = await analysisFn()
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setAnalysisResult(result)
        setStage('results')
      }, 400)
    } catch (err: any) {
      clearInterval(interval)
      setError(err.message || 'Analysis failed. Please try again.')
      setStage('upload')
    }
  }, [])

  const handleDemo = () => runAnalysis(() => analyzeDocumentDemo())

  const handleFile = async (file: File) => {
    runAnalysis(() => analyzeDocumentFile(file))
  }

  const handleTextAnalysis = () => {
    if (!pastedText.trim()) return
    runAnalysis(() => analyzeDocumentText(pastedText))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const clauses: BackendClause[] = analysisResult?.clauses || []
  const summary = analysisResult?.summary
  const redCount = clauses.filter(c => c.risk_level === 'red').length
  const amberCount = clauses.filter(c => c.risk_level === 'amber').length
  const greenCount = clauses.filter(c => c.risk_level === 'green').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-5 space-y-5 max-w-lg mx-auto"
    >
      {/* ── Upload Stage ── */}
      {stage === 'upload' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-white font-bold text-xl">Smart Document Decoder</h2>
            <p className="text-slate-400 text-sm mt-1">AI clause-by-clause analysis under Indian law</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm">
              ⚠ {error}
            </div>
          )}

          {/* File Drop Zone */}
          {!textMode ? (
            <>
              <motion.div
                whileTap={{ scale: 0.98 }}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all group',
                  dragOver
                    ? 'border-cyan-400/70 bg-cyan-500/10'
                    : 'border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/5'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/25 transition-colors">
                  <Upload size={28} className="text-cyan-400" />
                </div>
                <h3 className="text-white font-bold mb-1">Upload Document</h3>
                <p className="text-slate-400 text-sm">PDF, JPG, PNG — Rent agreement, Employment contract, Legal notice</p>
                <p className="text-cyan-400 text-xs mt-2 font-semibold">Drop file or tap to browse</p>
              </motion.div>

              {/* Actions row */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDemo}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-2xl glass-card border border-cyan-500/20 hover:border-cyan-500/40 transition-all group"
                >
                  <Camera size={20} className="text-cyan-400" />
                  <div className="text-left">
                    <div className="text-white font-semibold text-xs">Try Demo</div>
                    <div className="text-slate-400 text-[11px]">Sample rent agreement</div>
                  </div>
                </button>
                <button
                  onClick={() => setTextMode(true)}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-2xl glass-card border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                >
                  <FileText size={20} className="text-purple-400" />
                  <div className="text-left">
                    <div className="text-white font-semibold text-xs">Paste Text</div>
                    <div className="text-slate-400 text-[11px]">Copy-paste clause text</div>
                  </div>
                </button>
              </div>
            </>
          ) : (
            /* Paste Text Mode */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm font-semibold">Paste document text:</p>
                <button onClick={() => setTextMode(false)} className="text-xs text-slate-500 hover:text-slate-300">← Back</button>
              </div>
              <textarea
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="Paste your contract, legal notice, or clause text here..."
                className="w-full h-48 p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-sm placeholder-slate-600 resize-none focus:outline-none focus:border-cyan-500/40"
              />
              <button
                onClick={handleTextAnalysis}
                disabled={!pastedText.trim()}
                className="w-full py-3.5 rounded-2xl gradient-primary text-white font-bold disabled:opacity-40 transition-all hover:scale-[1.01]"
              >
                Analyse Text →
              </button>
            </div>
          )}

          {/* Feature highlights */}
          {!textMode && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🔍', title: 'Clause Scanner', desc: 'Every clause rated Red/Amber/Green' },
                { icon: '🪤', title: 'Trap Detector', desc: 'Forced arbitration, liability waivers' },
                { icon: '✏️', title: 'AI Counter-Clause', desc: 'Groq-powered replacements' },
                { icon: '📅', title: 'Amendment-Aware', desc: 'IPC→BNS outdated citations' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="glass-card rounded-2xl p-3 space-y-1.5">
                  <span className="text-xl">{icon}</span>
                  <div className="text-white text-xs font-bold">{title}</div>
                  <div className="text-slate-400 text-[11px]">{desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Analyzing Stage ── */}
      {stage === 'analyzing' && (
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
            <svg className="w-24 h-24 -rotate-90 absolute inset-0">
              <circle cx="48" cy="48" r="44" fill="none" stroke="#06b6d4" strokeWidth="4"
                strokeDasharray={`${progress * 2.76} 276`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-cyan-400 font-black text-lg">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-white font-bold">Analysing Document</h3>
            <p className="text-slate-400 text-sm">Running NyayaMitra RAG across Indian statutes...</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {['Extracting clauses', 'Checking BNS/IPC', 'Risk classification', 'Counter-clauses ready'].map((s, i) => (
                <span key={s} className={cn(
                  'text-[10px] px-2 py-1 rounded-full border',
                  progress > i * 25
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-slate-500'
                )}>
                  {progress > i * 25 ? '✓' : '○'} {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Results Stage ── */}
      {stage === 'results' && analysisResult && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white font-bold">{analysisResult.title}</h3>
                {summary && (
                  <p className={cn(
                    'text-xs mt-0.5 font-semibold',
                    summary.overall_risk === 'high_risk' ? 'text-red-400' :
                    summary.overall_risk === 'moderate_risk' ? 'text-amber-400' : 'text-emerald-400'
                  )}>
                    {summary.verdict}
                  </p>
                )}
              </div>
              <button
                onClick={() => { setStage('upload'); setAnalysisResult(null) }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors shrink-0"
              >
                ↩ New doc
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="text-red-400 font-black text-xl">{redCount}</div>
                <div className="text-red-400/70 text-[10px] font-semibold">ILLEGAL</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-amber-400 font-black text-xl">{amberCount}</div>
                <div className="text-amber-400/70 text-[10px] font-semibold">CAUTION</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-emerald-400 font-black text-xl">{greenCount}</div>
                <div className="text-emerald-400/70 text-[10px] font-semibold">SAFE</div>
              </div>
            </div>

            {/* Risk score */}
            {summary && (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 bg-white/5 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${summary.risk_score}%`,
                      backgroundColor: summary.risk_score > 60 ? '#34d399' : summary.risk_score > 30 ? '#fbbf24' : '#f87171'
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400 shrink-0">Safety: {summary.risk_score}/100</span>
              </div>
            )}
          </div>

          {/* Clause cards */}
          <div className="space-y-3">
            {clauses.map((clause, i) => (
              <ClauseCard key={clause.id} clause={clause} index={i} />
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => window.location.href = '/generator'}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl gradient-primary glow-saffron text-white font-bold transition-all hover:scale-[1.02]"
          >
            <FileText size={20} />
            Generate Legal Notice
          </button>
        </div>
      )}
    </motion.div>
  )
}
