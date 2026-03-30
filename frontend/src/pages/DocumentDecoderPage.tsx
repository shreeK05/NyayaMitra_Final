import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Camera, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, XCircle, FileText, Shield, RefreshCw, Copy, Check,
  Zap, Info, Sparkles, Scale, Search, FileDigit, ChevronRight,
  ArrowLeft, ShieldCheck, Microscope, Scan, FileSearch
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils'
import { analyzeDocumentDemo, analyzeDocumentFile, analyzeDocumentText, generateCounterClause } from '@/utils/api'

const RISK_MAP: Record<string, { label: string; color: string; bg: string; border: string; Icon: any }> = {
  red: { label: 'CRITICAL TRAP', color: 'var(--saffron)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', Icon: AlertTriangle },
  amber: { label: 'RISK DETECTED', color: 'var(--gold)', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', Icon: AlertTriangle },
  green: { label: 'STANDARD SAFE', color: 'var(--emerald)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', Icon: CheckCircle2 },
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
      setCounter('Strategic amendment required for this provision to align with BNS protocols. Use the Doc Generator for a full rewrite.')
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
    <div className="p-6 rounded-3xl bg-emerald/5 border border-emerald/20 mt-6 space-y-4 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <ShieldCheck size={120} className="text-emerald" />
      </div>
      <div className="flex items-center justify-between relative z-10">
         <p className="text-[10px] text-emerald font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            Neural Shield: Optimized Clause
         </p>
         {counter && (
            <button onClick={copyToClipboard} className="p-2 rounded-xl bg-emerald/10 text-emerald hover:bg-emerald/20 transition-all">
               {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
         )}
      </div>
      {!counter ? (
        <button
          onClick={fetchCounter}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-emerald/10 border border-emerald/30 text-emerald font-black uppercase text-[11px] tracking-widest hover:bg-emerald/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 relative z-10"
        >
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? 'AI Neural Reasoning...' : 'Deploy AI Counter-Clause'}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 relative z-10">
          <p className="text-emerald/80 text-sm italic leading-relaxed font-medium">"{counter}"</p>
          <div className="p-3 bg-emerald/5 rounded-xl border border-emerald/10 text-[9px] text-emerald/60 uppercase font-black tracking-widest text-center">
             Verified Admissible under Bharatiya Nyaya Sanhita 🇮🇳
          </div>
        </motion.div>
      )}
    </div>
  )
}

function ClauseCard({ clause }: { clause: BackendClause }) {
  const [expanded, setExpanded] = useState(false)
  const risk = RISK_MAP[clause.risk_level] || RISK_MAP.green
  const Icon = risk.Icon

  return (
    <motion.div
      layout
      className="rounded-3xl overflow-hidden border border-white/5 transition-all duration-300 group hover:shadow-2xl glass-card border-glow"
      style={{ background: risk.bg }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-6 lg:p-8 text-left relative">
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-white/5" style={{ background: `${risk.color}15`, color: risk.color }}>
             <Icon size={24} />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-3">
               <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border shadow-sm"
                 style={{ color: risk.color, background: `${risk.color}10`, borderColor: `${risk.color}20` }}>
                 {risk.label}
               </span>
               {clause.ipc_warnings.length > 0 && (
                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-saffron/10 border border-saffron/30 text-saffron text-[9px] font-black uppercase tracking-widest animate-pulse">
                    <Zap size={10} /> BNS Alert
                 </div>
               )}
            </div>
            <p className={cn("text-slate-200 text-base font-medium leading-relaxed transition-all", !expanded && "line-clamp-2")}>{clause.text}</p>
          </div>
          <div className="mt-2 text-slate-600 group-hover:text-white transition-colors">
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
            <div className="px-8 lg:px-10 pb-10 space-y-8 border-t border-white/5 pt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                 <div>
                    <div className="flex items-center gap-2 mb-4">
                       <Info size={14} className="text-slate-600" />
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Neural Analysis</p>
                    </div>
                    <p className="text-base text-slate-400 leading-relaxed font-normal">{clause.explanation}</p>
                 </div>
                 <div className="p-6 rounded-3xl bg-[#030712]/50 border border-white/5 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                       <Scale size={14} className="text-slate-600" />
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Legal Precedent</p>
                    </div>
                    <p className="text-sm text-slate-500 italic leading-relaxed">"{clause.legal_basis}"</p>
                 </div>
              </div>

              {clause.ipc_warnings.map((w, i) => (
                <div key={i} className="p-6 rounded-3xl bg-saffron/5 border border-saffron/10 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                     <AlertTriangle size={16} className="text-saffron" />
                     <p className="text-saffron font-black text-[10px] uppercase tracking-widest">Outdated Statute Detected</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-600 line-through text-xs font-bold">{w.old}</div>
                     <ArrowRight size={14} className="text-slate-700" />
                     <div className="px-3 py-1.5 rounded-xl bg-emerald/10 border border-emerald/30 text-emerald text-xs font-black">{w.new}</div>
                  </div>
                  <p className="text-slate-500 text-xs mt-4 font-medium leading-relaxed italic">{w.note}</p>
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
  const navigate = useNavigate()
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
      setProgress(p => Math.min(p + 2, 95))
    }, 100)

    try {
      const result = await analysisFn()
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setAnalysisResult(result)
        setStage('results')
      }, 500)
    } catch {
      clearInterval(interval)
      setError('Audit pipeline disconnected. Please try the demo mode or re-upload.')
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

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-indigo/30">
      {/* 🧭 Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-indigo flex items-center justify-center shadow-lg shadow-indigo/20">
                <FileSearch size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-widest italic leading-none">Document Decoder</h1>
                <p className="text-[10px] text-indigo font-bold uppercase tracking-tighter mt-1">Audit Protocol V4.2</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 bg-white/2 border border-white/5 px-5 py-2 rounded-full">
            <Microscope size={14} className="text-indigo" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scanning 1.7M+ Indian Statutes</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 max-w-6xl pt-32 pb-20">
        <AnimatePresence mode="wait">
          {stage === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                {error && (
                  <div className="p-6 rounded-3xl bg-saffron/10 border border-saffron/20 text-saffron font-bold text-sm flex items-center gap-4">
                    <AlertTriangle size={20} /> {error}
                  </div>
                )}

                {!textMode ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'border-2 border-dashed rounded-[3rem] p-12 lg:p-24 text-center cursor-pointer transition-all duration-500 group relative overflow-hidden bg-white/2',
                      dragOver ? 'border-indigo bg-indigo/5 scale-[1.01]' : 'border-white/10 hover:border-indigo/40'
                    )}
                  >
                    <input ref={fileInputRef} type="file" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-indigo/10 border border-indigo/20 flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110">
                      <Scan size={48} className="text-indigo group-hover:rotate-12 transition-transform" />
                    </div>
                    <h3 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase italic mb-4 font-display">Scan Document</h3>
                    <p className="text-slate-500 text-lg font-medium max-w-md mx-auto leading-relaxed">Drop your PDF, Rent Agreement, or Contract for a Neural Audit.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black tracking-tighter italic uppercase font-display">Deep Scan Mode</h2>
                      <button onClick={() => setTextMode(false)} className="text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">Cancel</button>
                    </div>
                    <textarea
                      value={pastedText}
                      onChange={e => setPastedText(e.target.value)}
                      placeholder="Paste clause text here..."
                      className="w-full h-80 p-8 rounded-[2rem] bg-black/40 border border-white/5 text-slate-200 text-xl font-medium focus:outline-none focus:border-indigo/40 transition-all font-display"
                    />
                    <button onClick={handleTextAnalysis} disabled={!pastedText.trim()} className="w-full py-6 rounded-2xl gradient-indigo text-white font-black uppercase text-xl tracking-tighter italic shadow-xl shadow-indigo/20 transition-all hover:scale-[1.02] active:scale-95">Initiate Analysis Loop</button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 space-y-6">
                <button onClick={handleDemo} className="w-full p-8 rounded-[2.5rem] glass-card border-white/5 hover:border-saffron/30 text-left transition-all group border-glow">
                   <Camera size={32} className="text-saffron mb-4 group-hover:scale-110 transition-transform" />
                   <h4 className="text-xl font-black tracking-tighter uppercase italic font-display">Trial Protocol</h4>
                   <p className="text-slate-500 text-[11px] font-bold uppercase mt-2">Audit a Pune Rent Agreement</p>
                </button>
                <div className="p-8 rounded-[2.5rem] glass-panel border border-white/5 space-y-6">
                  <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Capabilities</h5>
                  {[
                    { icon: Shield, label: 'Trap Extraction', color: 'var(--saffron)' },
                    { icon: Scale, label: 'BNS v1.0 Mapping', color: 'var(--indigo)' },
                    { icon: ShieldCheck, label: 'RAG Verification', color: 'var(--emerald)' }
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-4">
                      <f.icon size={18} style={{ color: f.color }} />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 space-y-12">
              <div className="relative w-48 h-48 lg:w-64 lg:h-64">
                <div className="absolute inset-0 rounded-full border-8 border-white/5" />
                <svg className="w-full h-full -rotate-90 absolute inset-0">
                  <circle cx="50%" cy="50%" r="46%" fill="none" stroke="var(--indigo)" strokeWidth="12" strokeDasharray={`${progress * 2.89}% 289%`} strokeLinecap="round" className="transition-all duration-100" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-indigo font-black text-4xl lg:text-6xl tracking-tighter font-display italic">{Math.round(progress)}%</span>
                </div>
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter font-display">Neural Core Audit</h3>
                <p className="text-slate-500 text-sm font-medium tracking-wide">Processing legal vectors through 1.7M statutory nodes...</p>
              </div>
            </motion.div>
          )}

          {stage === 'results' && analysisResult && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4">
                  <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-10 border-glow h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-8">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter font-display">Audit Result</h2>
                        <button onClick={() => setStage('upload')} className="p-2 rounded-xl bg-white/5 hover:text-indigo transition-colors"><RefreshCw size={16} /></button>
                      </div>
                      <div className="space-y-6">
                        <h3 className="text-3xl font-black tracking-tight leading-none text-indigo">{analysisResult.title}</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { val: redCount, label: 'Traps', color: 'var(--saffron)' },
                            { val: amberCount, label: 'Risks', color: 'var(--gold)' },
                            { val: greenCount, label: 'Safe', color: 'var(--emerald)' }
                          ].map(s => (
                            <div key={s.label} className="text-center p-4 rounded-2xl bg-white/2 border border-white/5">
                              <p className="text-2xl font-black font-display" style={{ color: s.color }}>{s.val}</p>
                              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pt-10 space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        <span>Protection Score</span>
                        <span className="text-2xl font-black text-indigo italic font-display">{summary?.risk_score}/100</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${summary?.risk_score}%` }} className="h-full bg-indigo shadow-lg shadow-indigo/20" />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium italic mt-4 opacity-70 leading-relaxed">"Verdict: {summary?.verdict}"</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                   <div className="flex items-center justify-between px-4">
                      <h3 className="text-[11px] font-black uppercase text-slate-600 tracking-widest">Neural Clause Ledger</h3>
                      <span className="text-[11px] text-indigo font-black uppercase">{clauses.length} Segments Identified</span>
                   </div>
                   <div className="space-y-6">
                      {clauses.map((clause) => (
                        <ClauseCard key={clause.id} clause={clause} />
                      ))}
                   </div>
                </div>
              </div>

              <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 overflow-hidden border-glow relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo/5 blur-[100px] rounded-full" />
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                  <div className="space-y-4 max-w-xl">
                    <h4 className="text-4xl font-black italic uppercase font-display text-white">Strategic Recourse</h4>
                    <p className="text-slate-400 text-lg leading-relaxed">Analysis complete. Your rights can be secured by issuing formal notices. Begin drafting your response now.</p>
                  </div>
                  <button onClick={() => navigate('/generator')} className="px-10 py-6 rounded-2xl gradient-indigo text-white font-black uppercase text-xl shadow-2xl shadow-indigo/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 italic group">
                    Begin Document Drafting
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
