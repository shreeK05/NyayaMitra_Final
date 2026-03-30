import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Camera, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, XCircle, FileText, Shield, RefreshCw, Copy, Check,
  Zap, Info, Sparkles, Scale, Search, FileDigit, ChevronRight,
  ArrowLeft, ShieldCheck, Microscope, Scan, FileSearch, User2, Bot,
  Briefcase
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils'
import { analyzeDocumentDemo, analyzeDocumentFile, analyzeDocumentText, generateCounterClause } from '@/utils/api'

const RISK_MAP: Record<string, { label: string; color: string; bg: string; border: string; Icon: any }> = {
  red: { label: 'CRITICAL TRAP', color: 'var(--saffron)', bg: 'rgba(255,153,51,0.05)', border: 'rgba(255,153,51,0.2)', Icon: AlertTriangle },
  amber: { label: 'RISK DETECTED', color: 'var(--gold)', bg: 'rgba(251,191,36,0.05)', border: 'rgba(251,191,36,0.2)', Icon: AlertTriangle },
  green: { label: 'STANDARD SAFE', color: 'var(--emerald)', bg: 'rgba(16,185,129,0.05)', border: 'rgba(16,185,129,0.2)', Icon: CheckCircle2 },
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
    <div className="p-8 rounded-[2.5rem] bg-emerald/5 border border-emerald/20 mt-8 space-y-4 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform pointer-events-none">
        <ShieldCheck size={100} className="text-emerald" />
      </div>
      <div className="flex items-center justify-between relative z-10">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            <p className="text-[10px] text-emerald font-black uppercase tracking-[0.4em]">Neural Shield: Optimized Clause</p>
         </div>
         {counter && (
            <button onClick={copyToClipboard} className="p-2.5 rounded-xl bg-emerald/10 text-emerald hover:bg-emerald/20 transition-all border border-emerald/20">
               {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
         )}
      </div>
      {!counter ? (
        <button
          onClick={fetchCounter}
          disabled={loading}
          className="w-full py-5 rounded-2xl bg-emerald/10 border border-emerald/30 text-emerald font-black uppercase text-xs tracking-widest hover:bg-emerald/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 relative z-10"
        >
          {loading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'AI Neural Reasoning...' : 'Deploy AI Counter-Clause'}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 relative z-10">
          <p className="text-emerald/80 text-lg italic leading-relaxed font-medium">"{counter}"</p>
          <div className="p-3 bg-emerald/5 rounded-xl border border-emerald/10 text-[9px] text-emerald/40 uppercase font-black tracking-widest text-center">
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
      className="rounded-[2.5rem] overflow-hidden border border-white/5 transition-all duration-500 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] glass-card border-glow"
      style={{ background: risk.bg }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-8 text-left relative z-10">
        <div className="flex items-start gap-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl border border-white/5 bg-black/40" style={{ color: risk.color }}>
             <Icon size={28} />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <div className="flex items-center gap-4 mb-4">
               <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border"
                 style={{ color: risk.color, background: `${risk.color}15`, borderColor: `${risk.color}30` }}>
                 {risk.label}
               </span>
               {clause.ipc_warnings.length > 0 && (
                 <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-saffron text-white text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-saffron/20 italic">
                    <Zap size={12} className="fill-white" /> BNS Alert
                 </div>
               )}
            </div>
            <p className={cn("text-slate-200 text-lg lg:text-xl font-medium leading-relaxed italic transition-all font-display", !expanded && "line-clamp-2")}>"{clause.text}"</p>
          </div>
          <div className={cn("mt-4 p-3 rounded-full bg-white/5 border border-white/10 transition-all", expanded && "rotate-180 bg-indigo/10 border-indigo/40")}>
            {expanded ? <ChevronUp size={24} className="text-indigo" /> : <ChevronDown size={24} className="text-slate-600" />}
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
            <div className="px-10 pb-12 pt-4 space-y-10 border-t border-white/5">
              <div className="grid lg:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Info size={16} className="text-slate-700" />
                       <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest italic">Neural Audit Extraction</p>
                    </div>
                    <p className="text-lg text-slate-400 leading-relaxed font-medium italic opacity-80">{clause.explanation}</p>
                 </div>
                 <div className="p-8 rounded-[2.5rem] bg-black/60 border border-white/5 shadow-inner">
                    <div className="flex items-center gap-3 mb-6">
                       <Scale size={16} className="text-slate-700" />
                       <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic">Judicial Precedent</p>
                    </div>
                    <p className="text-sm text-slate-500 italic leading-relaxed font-medium opacity-60">"{clause.legal_basis}"</p>
                 </div>
              </div>

              {clause.ipc_warnings.map((w, i) => (
                <div key={i} className="p-10 rounded-[3rem] bg-saffron/5 border border-saffron/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5"><ActivityIcon size={80} className="text-saffron" /></div>
                  <div className="flex items-center gap-3 mb-8">
                     <AlertTriangle size={20} className="text-saffron" />
                     <p className="text-saffron font-black text-xs uppercase tracking-[0.4em] italic">Statutory Transition Node</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                     <div className="flex-1 w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-slate-500 line-through text-sm font-black text-center">{w.old}</div>
                     <ArrowRight size={24} className="text-slate-800" />
                     <div className="flex-1 w-full p-4 rounded-2xl bg-saffron gradient-saffron text-white text-sm font-black text-center shadow-xl shadow-saffron/20 italic tracking-widest">{w.new}</div>
                  </div>
                  <p className="text-slate-400 text-sm mt-8 font-medium leading-relaxed italic opacity-70">"{w.note}"</p>
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
      setProgress(p => Math.min(p + 1.5, 98))
    }, 100)

    try {
      const result = await analysisFn()
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setAnalysisResult(result)
        setStage('results')
      }, 800)
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
      
      {/* 🧭 Strategic Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-nav border-b border-white/5 bg-[#030712]/80 backdrop-blur-3xl">
        <div className="container mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="w-12 h-12 rounded-xl glass-card border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
              <ArrowLeft size={20} className="text-slate-400 group-hover:text-white" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-indigo/10" />
                 <FileSearch size={24} className="text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter font-display leading-none text-white">Document Audit</h1>
                <p className="text-[9px] text-indigo font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo animate-pulse shadow-[0_0_8px_#6366f1]" />
                  Neural_Node_v4.2
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-4 bg-white/2 border border-white/5 px-6 py-2.5 rounded-full glass-card">
              <Microscope size={14} className="text-indigo" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Scanning 1.7M+ Statutes</span>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-black/40">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Profile" className="w-full h-full p-1 opacity-60" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 lg:px-12 max-w-7xl pt-40 pb-32">
        <AnimatePresence mode="wait">
          {stage === 'upload' && (
            <motion.div 
              key="upload" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="grid lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-8 space-y-12">
                {error && (
                  <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-8 rounded-3xl bg-saffron/10 border border-saffron/30 text-saffron font-black uppercase text-xs tracking-widest flex items-center gap-6 italic">
                    <AlertTriangle size={24} className="animate-pulse" /> {error}
                  </motion.div>
                )}

                {!textMode ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'border-2 border-dashed rounded-[5rem] p-16 lg:p-28 text-center cursor-pointer transition-all duration-700 group relative overflow-hidden bg-black/40 border-glow shadow-[0_50px_100px_rgba(0,0,0,0.8)]',
                      dragOver ? 'border-indigo bg-indigo/5 scale-[1.02]' : 'border-white/5 hover:border-indigo/40'
                    )}
                  >
                    <input ref={fileInputRef} type="file" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo/5 to-transparent pointer-events-none" />
                    <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-[4rem] bg-black border border-white/5 flex items-center justify-center mx-auto mb-12 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] border-glow relative overflow-hidden">
                       <div className="absolute inset-0 bg-indigo/5 group-hover:bg-indigo/10 transition-all" />
                       <Scan size={64} className="text-white lg:scale-125 transition-transform group-hover:rotate-12 relative z-10" />
                    </div>
                    <div className="space-y-6 relative z-10">
                      <h3 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.8] mb-6 font-display text-white">Scan Ledger</h3>
                      <p className="text-slate-500 text-lg lg:text-3xl font-medium max-w-lg mx-auto leading-tight italic opacity-70">Initiate a Neural Audit on your Rental, Corporate, or Civil Contract.</p>
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 glass-card p-12 rounded-[4rem] border-white/5 border-glow bg-black/40 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <h2 className="text-4xl font-black tracking-tighter italic uppercase font-display text-white">Deep Segment Scan</h2>
                      <button onClick={() => setTextMode(false)} className="px-6 py-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest border border-white/10 shadow-xl">Cancel Protocol</button>
                    </div>
                    <textarea
                      value={pastedText}
                      onChange={e => setPastedText(e.target.value)}
                      placeholder="Paste clause sequence here for immediate audit..."
                      className="w-full h-[500px] p-10 rounded-[3rem] bg-black/60 border border-white/5 text-slate-200 text-2xl font-black italic tracking-tighter leading-snug focus:outline-none focus:border-indigo/40 transition-all font-display placeholder-slate-900 shadow-inner"
                    />
                    <button onClick={handleTextAnalysis} disabled={!pastedText.trim()} className="w-full py-8 rounded-[2.5rem] gradient-indigo text-white font-black uppercase text-3xl tracking-tighter italic shadow-2xl shadow-indigo/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-6">
                       Initiate Neural Audit <Zap size={32} className="fill-white" />
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="lg:col-span-4 space-y-10">
                <button onClick={handleDemo} className="w-full p-12 rounded-[4rem] glass-diamond hover:bg-white/5 text-left transition-all group border-glow shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[1.8]"><Scan size={120} className="text-saffron" /></div>
                   <div className="w-16 h-16 rounded-[1.75rem] bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron mb-8 transition-all group-hover:scale-110 shadow-2xl shadow-saffron/10">
                      <FileSearch size={32} />
                   </div>
                   <div className="relative z-10">
                      <h4 className="text-3xl font-black tracking-tighter uppercase italic font-display text-white leading-none mb-3">Trial Protocol</h4>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic opacity-70">Audit a Sample Pune Rent Agreement Node</p>
                      <div className="mt-8 flex items-center gap-3 text-saffron font-black uppercase text-[10px] tracking-widest group-hover:gap-6 transition-all">
                         Load Mock Dataset <ArrowRight size={18} />
                      </div>
                   </div>
                </button>
                
                <div className="p-12 rounded-[4rem] glass-card border border-white/10 space-y-10 border-glow shadow-2xl bg-black/40">
                  <h5 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] italic mb-8">Neural_Matrix_Capabilities</h5>
                  {[
                    { icon: Shield, label: 'Trap Extraction', color: 'var(--saffron)' },
                    { icon: Scale, label: 'BNS v1.0 Mapping', color: 'var(--indigo)' },
                    { icon: ShieldCheck, label: 'RAG Verification', color: 'var(--emerald)' },
                    { icon: FileDigit, label: 'Statutory Ledger', color: 'var(--indigo)' }
                  ].map((f, i) => (
                    <motion.div key={f.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-5 group">
                      <div className="w-10 h-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <f.icon size={20} style={{ color: f.color }} />
                      </div>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] italic group-hover:text-white transition-colors">{f.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-40 space-y-20">
              <div className="relative w-72 h-72 lg:w-96 lg:h-96 group">
                <div className="absolute inset-0 rounded-full border-[12px] border-white/5 animate-pulse" />
                <svg className="w-full h-full -rotate-90 absolute inset-0 drop-shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                  <circle cx="50%" cy="50%" r="44%" fill="none" stroke="var(--indigo)" strokeWidth="16" strokeDasharray={`${progress * 2.76}% 276%`} strokeLinecap="round" className="transition-all duration-300" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-black text-7xl lg:text-9xl tracking-tighter font-display italic leading-none">{Math.round(progress)}%</span>
                  <span className="text-indigo font-black text-[10px] uppercase tracking-[0.8em] mt-4 ml-3 opacity-60">Scanning...</span>
                </div>
                <div className="absolute inset-[-40px] rounded-full border border-indigo/10 animate-[spin_10s_linear_infinite]" />
              </div>
              <div className="text-center space-y-6 max-w-2xl relative">
                <h3 className="text-5xl font-black italic uppercase tracking-tighter font-display text-white">Neural Core Audit</h3>
                <p className="text-slate-500 text-lg font-medium italic tracking-wide opacity-70">Processing 1,742,000 legal provisions through distributed reasoning nodes...</p>
                <div className="flex gap-4 items-center justify-center pt-8">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo shadow-[0_0_10px_#6366f1] animate-pulse" />
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo shadow-[0_0_10px_#6366f1] animate-pulse delay-75" />
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo shadow-[0_0_10px_#6366f1] animate-pulse delay-150" />
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'results' && analysisResult && (
            <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-20">
              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                  <div className="glass-diamond p-12 rounded-[4rem] border-white/10 space-y-12 border-glow h-full flex flex-col justify-between shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden bg-black/40">
                    <div className="absolute inset-0 bg-indigo/2 rounded-[4rem] pointer-events-none" />
                    <div>
                      <div className="flex justify-between items-start mb-12">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter font-display text-white">Audit Synopsis</h2>
                        <button onClick={() => setStage('upload')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo/20 transition-all text-slate-500 hover:text-white shadow-xl"><RefreshCw size={20} /></button>
                      </div>
                      <div className="space-y-10 relative z-10">
                        <div className="space-y-2">
                           <h3 className="text-4xl font-black italic tracking-tighter italic uppercase font-display text-white leading-none">{analysisResult.title}</h3>
                           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] italic mb-8">Subject Metadata</p>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          {[
                            { val: redCount, label: 'Traps', color: 'var(--saffron)' },
                            { val: amberCount, label: 'Risks', color: 'var(--gold)' },
                            { val: greenCount, label: 'Safe', color: 'var(--emerald)' }
                          ].map(s => (
                            <div key={s.label} className="text-center p-6 rounded-[2rem] bg-black/40 border border-white/5 shadow-inner">
                              <p className="text-3xl font-black font-display italic tracking-tighter mb-1" style={{ color: s.color }}>{s.val}</p>
                              <p className="text-[9px] font-black uppercase text-slate-700 tracking-widest">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pt-12 space-y-6 relative z-10">
                      <div className="flex justify-between items-end mb-4">
                        <div className="space-y-1">
                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic block">Neural Safety Score</span>
                           <span className="text-4xl font-black text-indigo italic font-display leading-none tracking-tighter uppercase">{summary?.risk_score}%</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-indigo/10 border border-indigo/30 text-indigo font-black uppercase text-[10px] tracking-widest italic animate-pulse">High Protection</div>
                      </div>
                      <div className="h-3 rounded-full bg-white/5 overflow-hidden shadow-inner">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${summary?.risk_score}%` }} className="h-full gradient-indigo shadow-[0_0_20px_#6366f1]" />
                      </div>
                      <div className="mt-8 p-6 rounded-3xl bg-white/2 border border-white/5">
                        <p className="text-sm text-slate-500 font-bold italic opacity-80 leading-relaxed text-center">"Verdict: {summary?.verdict}"</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-12">
                   <div className="flex items-center justify-between px-8">
                      <div className="flex items-center gap-4">
                        <LayoutGrid size={24} className="text-slate-800" />
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter font-display text-white">Neural Ledger</h3>
                      </div>
                      <div className="px-6 py-2 rounded-full bg-indigo/5 border border-indigo/20 text-indigo font-black uppercase text-[10px] tracking-widest italic shadow-xl">
                        {clauses.length} Segments Analyzed
                      </div>
                   </div>
                   <div className="space-y-10">
                      {clauses.map((clause) => (
                        <ClauseCard key={clause.id} clause={clause} />
                      ))}
                   </div>
                </div>
              </div>

              {/* Strategic Recourse Footer Block */}
              <div className="glass-diamond p-16 lg:p-24 rounded-[5rem] border border-white/5 overflow-hidden border-glow relative bg-black/40 shadow-[0_50px_120px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo/5 blur-[150px] rounded-full pointer-events-none" />
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                   <div className="flex items-center gap-10">
                      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] gradient-indigo flex items-center justify-center text-white shadow-2xl shadow-indigo/30 shrink-0 border-glow animate-neural-pulse">
                         <Zap size={56} className="fill-white" />
                      </div>
                      <div className="space-y-6 max-w-2xl">
                        <h4 className="text-5xl lg:text-7xl font-black italic uppercase font-display text-white tracking-tighter leading-none">Strategic Recourse</h4>
                        <p className="text-slate-400 text-xl lg:text-2xl italic leading-tight font-medium opacity-70">
                           Neural Audit complete. Secure your legal dominance by drafting formal responses to these traps.
                        </p>
                      </div>
                   </div>
                   <button onClick={() => navigate('/generator')} className="w-full lg:w-auto px-16 py-8 rounded-[3rem] gradient-indigo text-white font-black uppercase text-2xl shadow-[0_20px_80px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-6 italic group tracking-tighter">
                     Start Drafting
                     <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
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

import { Activity as ActivityIcon, LayoutGrid } from 'lucide-react'
