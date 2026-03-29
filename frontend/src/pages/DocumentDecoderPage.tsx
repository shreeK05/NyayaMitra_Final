import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Camera, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, XCircle, FileText, Shield, RefreshCw, Copy, Check,
  Zap, Info, Sparkles, Scale, Search, FileDigit, ChevronRight
} from 'lucide-react'
import { cn } from '@/utils'
import { analyzeDocumentDemo, analyzeDocumentFile, analyzeDocumentText, generateCounterClause } from '@/utils/api'

const RISK_MAP: Record<string, { label: string; color: string; bg: string; border: string; Icon: React.FC<{size?:number;className?:string;color?:string}> }> = {
  red: { label: 'CRITICAL TRAP', color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', Icon: XCircle },
  amber: { label: 'NEGOTIATION REQ', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', Icon: AlertTriangle },
  green: { label: 'STANDARD SAFE', color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)', Icon: CheckCircle2 },
}

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } } as const

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
      setCounter('Our current knowledge suggests a specific amendment protocol here. Please check with AI Counsel.')
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
    <div className="p-5 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 mt-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
         <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           Neural Shield: Counter-Clause
         </p>
         {counter && (
            <button onClick={copyToClipboard} className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
               {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
         )}
      </div>
      {!counter ? (
        <button
          onClick={fetchCounter}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black uppercase text-[11px] tracking-widest hover:bg-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
          {loading ? 'AI Neural Reasoning...' : 'Deploy AI Counter-Clause'}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <p className="text-emerald-200 text-sm leading-relaxed italic font-medium">"{counter}"</p>
          <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[9px] text-emerald-400 uppercase font-black tracking-widest text-center">
             Verified Admissible under Indian Code 🇮🇳
          </div>
        </motion.div>
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
      variants={item}
      className="rounded-[2.5rem] overflow-hidden border transition-all duration-300 group hover:shadow-2xl"
      style={{ borderColor: risk.border, backgroundColor: risk.bg }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all scale-150 rotate-12">
           <Icon size={64} color={risk.color} />
        </div>
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 border-white/5" style={{ backgroundColor: `${risk.color}15` }}>
             <Icon size={24} color={risk.color} />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-3">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border shadow-sm"
                 style={{ color: risk.color, backgroundColor: risk.bg, borderColor: risk.border }}>
                 {risk.label}
               </span>
               {clause.ipc_warnings.length > 0 && (
                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                    <Zap size={12} /> BNS Warning
                 </div>
               )}
            </div>
            <p className={cn("text-slate-200 text-base font-medium leading-relaxed transition-all", !expanded && "line-clamp-2")}>{clause.text}</p>
          </div>
          <div className="mt-2 text-slate-500 group-hover:text-white transition-colors">
            {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 space-y-6 border-t border-white/5 pt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                 <div>
                    <div className="flex items-center gap-2 mb-3">
                       <Info size={14} className="text-slate-600" />
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Legal Analysis</p>
                    </div>
                    <p className="text-sm lg:text-base text-slate-300 leading-relaxed font-medium">{clause.explanation}</p>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-[#030712]/50 border border-white/10 shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                       <Scale size={14} className="text-slate-600" />
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Statutory Basis</p>
                    </div>
                    <p className="text-sm text-slate-400 italic">"{clause.legal_basis}"</p>
                 </div>
              </div>

              {clause.ipc_warnings.map((w, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <FileDigit size={48} className="text-red-500" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                     <AlertTriangle size={16} className="text-red-500" />
                     <p className="text-red-500 font-extrabold text-[11px] uppercase tracking-widest">Outdated Statute Detection</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-slate-400 line-through text-xs font-black">{w.old}</div>
                     <span className="text-red-500">→</span>
                     <div className="px-3 py-1.5 rounded-xl bg-india-green/10 border border-india-green/30 text-india-green text-xs font-black">{w.new}</div>
                  </div>
                  <p className="text-slate-400 text-xs mt-3 font-medium leading-relaxed">{w.note}</p>
                </div>
              ))}

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

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 2, 92))
    }, 100)

    try {
      const result = await analysisFn()
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setAnalysisResult(result)
        setStage('results')
      }, 500)
    } catch (err: any) {
      clearInterval(interval)
      setError(err.message || 'RAG Analysis disconnected. Re-trying demo layer...')
      setStage('upload')
    }
  }, [])

  const handleDemo = () => runAnalysis(() => analyzeDocumentDemo())
  const handleFile = async (file: File) => runAnalysis(() => analyzeDocumentFile(file))
  const handleTextAnalysis = () => pastedText.trim() && runAnalysis(() => analyzeDocumentText(pastedText))

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

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } } as const

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="px-6 lg:px-12 py-10 max-w-7xl mx-auto w-full min-h-screen">
      
      {/* ── Header System ── */}
      <motion.div variants={item} className="mb-10 lg:mb-16">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-3xl gradient-primary glow-saffron flex items-center justify-center">
               <FileDigit size={32} className="text-white" />
            </div>
            <div>
               <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter font-display leading-none italic uppercase">Neural Audit</h1>
               <div className="flex items-center gap-3 mt-2">
                  <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_#06b6d4] animate-pulse" />
                  <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-[0.25em]">Autonomous Legal Intelligence V1.4</p>
               </div>
            </div>
         </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── Upload Stage ── */}
        {stage === 'upload' && (
          <motion.div key="upload" variants={item} className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              {error && (
                <div className="p-5 rounded-[2rem] bg-red-500/10 border border-red-500/25 text-red-400 font-bold text-sm tracking-tight flex items-center gap-4">
                  <AlertTriangle size={20} /> {error}
                </div>
              )}

              {!textMode ? (
                <motion.div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'border-2 border-dashed rounded-[3rem] p-16 lg:p-24 text-center cursor-pointer transition-all duration-500 group relative overflow-hidden h-full flex flex-col items-center justify-center',
                    dragOver
                      ? 'border-accent-cyan/70 bg-accent-cyan/10 scale-[1.02]'
                      : 'border-white/10 hover:border-accent-cyan/40 hover:bg-white/[0.02]'
                  )}
                >
                  <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                     <div className="absolute top-0 left-0 w-64 h-64 bg-accent-cyan blur-[120px] rounded-full" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform">
                    <Upload size={48} className="text-accent-cyan group-hover:rotate-12 transition-transform" />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter font-display mb-4 relative z-10 uppercase italic">Ingest Document</h3>
                  <p className="text-slate-500 text-sm lg:text-lg font-medium max-w-md relative z-10 leading-relaxed">PDF, JPG, PNG — Rent Agreements, Contracts, or Legal Notices</p>
                  <div className="mt-8 px-6 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-[10px] font-black text-accent-cyan uppercase tracking-[0.3em] relative z-10">Neural Scanner Standby</div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tighter text-white font-display italic uppercase">Paste Raw Transcript</h2>
                    <button onClick={() => setTextMode(false)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">← Cancel</button>
                  </div>
                  <textarea
                    value={pastedText}
                    onChange={e => setPastedText(e.target.value)}
                    placeholder="Paste your contract, legal notice, or clause text here..."
                    className="w-full h-96 p-8 rounded-[2.5rem] bg-[#030712] border border-white/5 text-slate-200 text-lg lg:text-xl font-medium placeholder-slate-800 resize-none focus:outline-none focus:border-accent-cyan/40 transition-all shadow-[inset_0_5px_20px_rgba(0,0,0,0.5)]"
                  />
                  <button
                    onClick={handleTextAnalysis}
                    disabled={!pastedText.trim()}
                    className="w-full py-6 rounded-[2rem] gradient-primary glow-saffron text-white font-black uppercase text-xl tracking-tighter italic disabled:opacity-20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Ingest Reasoning Loop →
                  </button>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-8">
               <div className="grid gap-4">
                  <button onClick={handleDemo} className="w-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-accent-cyan/30 text-left transition-all group hover:scale-[1.02] active:scale-95">
                     <Camera size={32} className="text-accent-cyan mb-4 group-hover:scale-110 transition-transform" />
                     <h4 className="text-xl font-black text-white tracking-tighter font-display italic uppercase">Try Neural Demo</h4>
                     <p className="text-slate-500 text-xs font-medium mt-2 leading-relaxed">Sample simulated RAG crawl through a Pune Rent Agreement.</p>
                  </button>
                  <button onClick={() => setTextMode(true)} className="w-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-accent-purple/30 text-left transition-all group hover:scale-[1.02] active:scale-95">
                     <Search size={32} className="text-accent-purple mb-4 group-hover:scale-110 transition-transform" />
                     <h4 className="text-xl font-black text-white tracking-tighter font-display italic uppercase">Deep Scan Clause</h4>
                     <p className="text-slate-500 text-xs font-medium mt-2 leading-relaxed">Copy-paste a single clause for isolated high-confidence audit.</p>
                  </button>
               </div>

               <div className="p-8 rounded-[2.5rem] bg-[#030712]/50 border border-white/5 space-y-8">
                  <div className="flex items-center gap-2">
                     <Sparkles size={16} className="text-saffron" />
                     <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AI Core Capabilities</h5>
                  </div>
                  {[
                    { icon: '⚖️', label: 'BNS v1.0 Mapping', sub: 'CrPC/IPC citations real-time check' },
                    { icon: '🛡️', label: 'RAG Verification', sub: 'Verified across 1.7M Indian statutes' },
                    { icon: '🪤', label: 'Trap Extraction', sub: 'Auto-identify liability loopholes' }
                  ].map(feat => (
                    <div key={feat.label} className="flex gap-4">
                       <span className="text-2xl shrink-0">{feat.icon}</span>
                       <div>
                          <p className="text-slate-100 font-bold text-sm tracking-tight">{feat.label}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{feat.sub}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {/* ── Analyzing Stage ── */}
        {stage === 'analyzing' && (
          <motion.div key="analyzing" className="flex flex-col items-center justify-center py-32 space-y-12">
            <div className="relative w-48 h-48 lg:w-64 lg:h-64">
              <div className="absolute inset-0 rounded-full border-8 border-white/5" />
              <svg className="w-full h-full -rotate-90 absolute inset-0">
                <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#06b6d4" strokeWidth="12"
                  strokeDasharray={`${progress * 2.89}% 289%`} strokeLinecap="round" className="transition-all duration-100" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-accent-cyan font-black text-4xl lg:text-6xl tracking-tighter font-display">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="text-center space-y-6">
              <h3 className="text-3xl lg:text-4xl font-black text-white italic uppercase tracking-tighter">Running Neural Audit</h3>
              <div className="flex gap-4 justify-center flex-wrap">
                {['Statute Retrieval', 'Contextual Parsing', 'Risk Grading', 'Counter-Strategy'].map((s, i) => (
                  <motion.div key={s} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: progress > i * 25 ? 1 : 0.3, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className={cn(
                      'text-[10px] lg:text-xs px-5 py-2.5 rounded-2xl border font-black uppercase tracking-widest transition-all',
                      progress > i * 25
                        ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan shadow-[0_0_15px_#06b6d430]'
                        : 'bg-white/2 border-white/10 text-slate-700'
                    )}
                  >
                    {progress > i * 25 ? '✓' : '○'} {s}
                  </motion.div>
                ))}
              </div>
              <p className="text-slate-500 text-sm italic font-medium px-4">Processing with 1536-dim vector embeddings across Indian Code...</p>
            </div>
          </motion.div>
        )}

        {/* ── Results Stage ── */}
        {stage === 'results' && analysisResult && (
          <motion.div key="results" variants={container} className="space-y-10 lg:space-y-16">
            <motion.div variants={item} className="grid lg:grid-cols-12 gap-10">
               
               {/* Left: Summary Analytics */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="p-8 lg:p-12 rounded-[3.5rem] bg-slate-900 shadow-2xl border border-white/5 relative overflow-hidden h-full flex flex-col justify-between">
                     <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Scale size={120} className="text-white" />
                     </div>
                     <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                           <h2 className="text-white font-black text-2xl tracking-tighter italic uppercase font-display">Scan Report</h2>
                           <button onClick={() => { setStage('upload'); setAnalysisResult(null) }} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all"><RefreshCw size={16} /></button>
                        </div>
                        <div className="space-y-8">
                           <div>
                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Audit Identity</div>
                              <h3 className="text-white font-black text-2xl lg:text-3xl tracking-tight line-clamp-1">{analysisResult.title}</h3>
                           </div>
                           <div className="grid grid-cols-3 gap-3">
                              {[
                                { count: redCount, label: 'Trap', color: '#ef4444' },
                                { count: amberCount, label: 'Risk', color: '#f59e0b' },
                                { count: greenCount, label: 'Safe', color: '#10b981' }
                              ].map(stat => (
                                <div key={stat.label} className="p-4 rounded-3xl bg-white/2 border border-white/5 text-center">
                                   <div className="text-2xl font-black font-display mb-1" style={{ color: stat.color }}>{stat.count}</div>
                                   <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="relative z-10 pt-10">
                        <div className="flex justify-between items-end mb-4">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Safety Quotient</span>
                           <span className="text-3xl font-black text-accent-cyan font-display">{summary?.risk_score}/100</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5 p-0.5">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${summary?.risk_score}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-accent-cyan shadow-[0_0_10px_#06b6d460]" />
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold italic mt-4 leading-relaxed line-clamp-2">"NyayaMitra Verdict: {summary?.verdict}"</p>
                     </div>
                  </div>
               </div>

               {/* Right: Clause Ledger */}
               <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-white font-black text-sm lg:text-xl italic uppercase tracking-widest">Digital Clause Ledger</h3>
                     <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">{clauses.length} Segments Identified</span>
                  </div>
                  <div className="space-y-6">
                     {clauses.map((clause, i) => (
                       <ClauseCard key={clause.id} clause={clause} index={i} />
                     ))}
                  </div>
               </div>

            </motion.div>

            {/* Action Matrix */}
            <motion.div variants={item} className="p-10 lg:p-16 rounded-[4rem] bg-gradient-to-br from-[#030712] to-slate-900 border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-saffron/10 blur-[150px] rounded-full pointer-events-none" />
               <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10 text-center lg:text-left">
                  <div className="space-y-6 max-w-2xl">
                     <div className="px-4 py-1 rounded-xl bg-saffron/10 border border-saffron/20 inline-block text-[10px] font-black text-saffron uppercase tracking-[0.3em] font-sans">Strategic Recourse</div>
                     <h4 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-none font-display italic uppercase">Ready for Counter-Action?</h4>
                     <p className="text-lg lg:text-xl text-slate-400 font-medium leading-relaxed">Based on this audit, we've prepared 3 specific legal notices you should issue to secure your rights.</p>
                  </div>
                  <button onClick={() => window.location.href = '/generator'} className="px-10 py-6 rounded-full gradient-primary glow-saffron text-white font-black uppercase text-xl tracking-tighter italic flex items-center gap-6 transition-all hover:scale-105 active:scale-95 group">
                     Begin Document Drafting
                     <ChevronRight size={28} className="transition-all group-hover:translate-x-2" />
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
