import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Download, Share2, CheckCircle2, Loader2, Link, 
  ChevronRight, Sparkles, Database, ShieldCheck, Zap, 
  Search, Filter, Info, Award, FileDigit, 
  Box, Fingerprint, LucideFileText, Scan, Layers, ZapIcon,
  ArrowLeft, FileDown, Send, FileCheck, Briefcase, Landmark, ShoppingCart, User2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DOCUMENT_CATEGORIES, cn } from '@/utils'

const SAMPLE_DOCS = {
  employment: [
    'Unpaid Salary Legal Notice',
    'Wrongful Termination Petition',
    'Gratuity Recovery Notice',
    'PF Non-Deposit Formal Complaint',
    'Maternity Benefit Rejection Reply',
    'Labour Court Direct Complaint',
    'POSH Violation Workplace Complaint'
  ],
  property: [
    'Illegal Eviction Rebuttal Notice',
    'Security Deposit Refund Notice',
    'RERA Builder Delay Complaint',
    'Unlawful Rent Hike Objection',
    'Property Encroachment Notice',
    'Society Maintenance Dispute'
  ],
  consumer: [
    'Consumer Forum Full Complaint',
    'E-Commerce Refund Formal Demand',
    'Banking Ombudsman Petition',
    'Insurance Claim Rejection Reply',
    'Loan Recovery Harassment Notice',
    'Cheque Bounce Notice (NI Act Sec 138)'
  ],
}

const FORM_FIELDS = {
  employment: [
    { id: 'employer', label: 'Commercial Entity Name', placeholder: 'Sharma Textiles Pvt. Ltd.' },
    { id: 'amount', label: 'Aggregate Due (₹)', placeholder: '72,000', type: 'number' },
    { id: 'months', label: 'Billing Period (Months)', placeholder: '3', type: 'number' },
    { id: 'designation', label: 'Service Designation', placeholder: 'Factory Operations Lead' },
    { id: 'joining_date', label: 'Contractual Joining Date', type: 'date' },
  ],
  property: [
    { id: 'landlord', label: 'Lessor / Landlord Identity', placeholder: 'Mr. R.K. Mehta' },
    { id: 'property', label: 'Demised Premise Address', placeholder: 'Flat 204, Anand Nagar, Pune' },
    { id: 'deposit', label: 'Security Deposit Held (₹)', placeholder: '1,80,000', type: 'number' },
    { id: 'rent', label: 'Agreed Monthly Rent (₹)', placeholder: '18,000', type: 'number' },
    { id: 'move_in', label: 'Move-in Date', type: 'date' },
  ],
  consumer: [
    { id: 'company', label: 'Opponent Merchant Platform', placeholder: 'Amazon.in' },
    { id: 'order_no', label: 'Order / Transaction Hash', placeholder: 'AMZ-123456789' },
    { id: 'amount', label: 'Value of Disputed Service (₹)', placeholder: '5,000', type: 'number' },
    { id: 'issue', label: 'Statutory Grievance Detail', placeholder: 'Service non-delivery after successful debit' },
  ],
}

export default function DocumentGeneratorPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(DOCUMENT_CATEGORIES[0])
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [stage, setStage] = useState<'select' | 'form' | 'generating' | 'done'>('select')
  const [genProgress, setGenProgress] = useState(0)

  const catDocs = (SAMPLE_DOCS as any)[selectedCategory.id] || (SAMPLE_DOCS as any).employment

  const handleGenerate = () => {
    setStage('generating')
    let p = 0
    const interval = setInterval(() => {
      p += 1.5
      setGenProgress(p)
      if (p >= 100) { 
        clearInterval(interval)
        setTimeout(() => setStage('done'), 800) 
      }
    }, 40)
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-emerald/30">
      
      {/* 🧭 Strategic Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] glass-nav border-b border-white/5 bg-[#030712]/80 backdrop-blur-3xl">
        <div className="container mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="w-12 h-12 rounded-xl glass-card border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
              <ArrowLeft size={20} className="text-slate-400 group-hover:text-white" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-emerald/10 group-hover:bg-emerald/20 transition-all" />
                 <FileText size={24} className="text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter font-display leading-none text-white">Document Forge</h1>
                <p className="text-[9px] text-emerald font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_#10b981]" />
                  Statutory_Foundry_v3.0
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-4 bg-white/2 border border-white/5 px-6 py-2.5 rounded-full glass-card">
              <Database size={14} className="text-emerald" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">47 Validated BNS Templates</span>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-black/40 text-glow-saffron">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Profile" className="w-full h-full p-1 opacity-60" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 lg:px-12 max-w-7xl pt-40 pb-32">
        <AnimatePresence mode="wait">
          {stage === 'select' && (
            <motion.div key="select" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-20">
              
              {/* Strategic Selection Hub */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat); setSelectedDoc(null) }}
                    className={cn(
                      'p-10 rounded-[3.5rem] text-left transition-all duration-700 border relative overflow-hidden group border-glow shadow-[0_20px_50px_rgba(0,0,0,0.4)]',
                      selectedCategory.id === cat.id ? 'glass-card border-white/20 bg-emerald/5 scale-105' : 'bg-black/40 border-white/5 opacity-40 hover:opacity-100 hover:bg-white/5'
                    )}
                  >
                    <div className="text-5xl mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl">{cat.icon}</div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter font-display text-white leading-none mb-3 font-neural">{cat.name}</h3>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">{cat.count} Templates Active</p>
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all">
                       <Zap size={80} className="text-emerald" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Template Ledger */}
              <div className="space-y-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-8">
                  <div className="space-y-2 text-center lg:text-left">
                    <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter font-display leading-none text-white">Drafting Ledger</h2>
                    <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.5em] italic">Validated Procedural Protocols for {selectedCategory.name}</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="w-16 h-16 rounded-2xl glass-card border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"><Search size={24} /></button>
                    <button className="w-16 h-16 rounded-2xl glass-card border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"><Filter size={24} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {catDocs.map((docName: string, i: number) => (
                    <motion.button
                      key={docName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => { setSelectedDoc(docName); setStage('form') }}
                      className="p-10 rounded-[3.5rem] glass-card border-white/5 hover:border-emerald/40 transition-all text-left shadow-2xl group border-glow h-full flex flex-col justify-between bg-black/40 hover:bg-emerald/5"
                    >
                      <div>
                        <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center mb-10 text-emerald group-hover:scale-110 transition-transform shadow-2xl relative overflow-hidden">
                          <div className="absolute inset-0 bg-emerald/5" />
                          <FileText size={32} className="relative z-10" />
                        </div>
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter leading-tight font-display text-white italic">{docName}</h4>
                      </div>
                      <div className="pt-10 border-t border-white/5 mt-10 flex justify-between items-center group/btn">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic leading-none mb-1">Standard_Grade</span>
                           <span className="text-emerald font-black uppercase text-xs">Procedural A++</span>
                        </div>
                        <ChevronRight size={24} className="text-slate-800 group-hover:text-emerald group-hover:translate-x-3 transition-all" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto py-10 lg:py-20">
              <div className="glass-card rounded-[5rem] border-white/10 overflow-hidden border-glow bg-black/40 shadow-[0_50px_120px_rgba(0,0,0,0.8)] relative">
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform">
                   <FileDigit size={200} className="text-emerald" />
                </div>
                <div className="p-12 lg:p-20 border-b border-white/5 flex items-center justify-between bg-white/2 relative z-10">
                  <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-[2rem] gradient-emerald flex items-center justify-center border border-white/20 text-white shadow-2xl shadow-emerald/30 animate-neural-pulse shrink-0">
                      <FileDigit size={40} />
                    </div>
                    <div className="space-y-3">
                      <span className="text-emerald text-[10px] font-black uppercase tracking-[0.5em] mb-1 block opacity-80 italic italic">Active Procedural Foundry</span>
                      <h2 className="text-4xl lg:text-7xl font-black italic uppercase tracking-tighter font-display leading-[0.8] text-white">{selectedDoc}</h2>
                    </div>
                  </div>
                  <button onClick={() => setStage('select')} className="px-8 py-3 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest border border-white/10 shadow-xl">Abort Forge</button>
                </div>

                <div className="p-12 lg:p-24 space-y-20 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {((FORM_FIELDS as any)[selectedCategory.id] || FORM_FIELDS.employment).map((field: any) => (
                      <div key={field.id} className="space-y-4">
                        <label className="text-slate-600 text-[11px] font-black uppercase tracking-[0.4em] px-4 italic">{field.label}</label>
                        <input
                          type={field.type || 'text'}
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                          className="w-full h-20 bg-black/60 border border-white/5 rounded-[2.5rem] px-10 text-white text-2xl font-black italic tracking-tighter focus:outline-none focus:border-emerald/40 transition-all font-display placeholder-slate-900 shadow-inner"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-12 rounded-[3.5rem] bg-emerald/5 border border-emerald/10 relative overflow-hidden group shadow-2xl">
                    <div className="flex items-center gap-8 relative z-10">
                       <div className="w-16 h-16 rounded-[1.75rem] bg-emerald/10 flex items-center justify-center text-emerald border border-emerald/20 transition-transform group-hover:rotate-12">
                          <Zap size={32} className="fill-emerald" />
                       </div>
                       <div className="space-y-2">
                          <h5 className="text-emerald font-black text-2xl italic font-display uppercase tracking-tight leading-none italic">Neural Sync: Enabled</h5>
                          <p className="text-slate-500 text-lg font-medium italic opacity-70 leading-snug">The foundry is linking your current session transcript for automatic entity extraction.</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    <button onClick={() => setStage('select')} className="flex-1 py-8 rounded-[2.5rem] glass-card border border-white/10 text-slate-600 font-bold uppercase text-xs tracking-widest italic hover:text-white hover:bg-white/5 transition-all">Relinquish Loom</button>
                    <button onClick={handleGenerate} className="flex-[2] py-8 rounded-[2.5rem] gradient-emerald text-white font-black uppercase text-3xl italic tracking-tighter shadow-[0_20px_60px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-6">
                       FORGE PROTOCOL <ChevronRight size={32} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'generating' && (
            <motion.div key="generating" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-40 gap-20 text-center">
              <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px] group">
                <div className="absolute inset-0 rounded-[5rem] border-[16px] border-white/5 animate-pulse" />
                <svg className="w-full h-full -rotate-90 absolute inset-0 drop-shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <rect x="10%" y="10%" width="80%" height="80%" rx="4rem" fill="none" stroke="var(--emerald)" strokeWidth="20" strokeDasharray={`${genProgress * 3.6} 360`} strokeLinecap="round" className="transition-all duration-300" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-black text-7xl lg:text-[10rem] tracking-tighter font-display italic leading-none">{Math.round(genProgress)}%</span>
                  <span className="text-emerald font-black text-[10px] uppercase tracking-[1em] mt-8 opacity-60">Forging...</span>
                </div>
              </div>
              <div className="space-y-6 max-w-2xl relative">
                <h3 className="text-5xl font-black italic uppercase tracking-tighter font-display text-white leading-none">Statutory Synthesis</h3>
                <p className="text-slate-600 text-xl font-medium italic opacity-70 tracking-widest">Mapping Law Vectors through Distributed Judicial Nodes...</p>
              </div>
            </motion.div>
          )}

          {stage === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-10 lg:py-20 text-center space-y-20">
              <div className="glass-card p-16 lg:p-28 rounded-[5rem] border-emerald/30 bg-black/40 border-glow shadow-[0_50px_150px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald/5 blur-[200px] rounded-full pointer-events-none" />
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-32 h-32 lg:w-48 lg:h-48 rounded-[3rem] gradient-emerald flex items-center justify-center mx-auto mb-16 text-white shadow-[0_30px_60px_rgba(16,185,129,0.3)] border-glow relative">
                  <FileCheck size={80} className="lg:scale-125" />
                  <div className="absolute inset-[-20px] rounded-full border border-emerald/20 animate-ping opacity-20" />
                </motion.div>
                <h3 className="text-6xl lg:text-[7rem] font-black italic uppercase tracking-tighter leading-none font-display mb-6 text-white text-glow-saffron">Forge Complete</h3>
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.8em] italic opacity-60 mb-20">Verified_Legal_Admissibility: {selectedDoc}</p>

                {/* Tactical Preview */}
                <div className="p-16 rounded-[4rem] bg-black border border-white/5 text-left max-w-4xl mx-auto shadow-inner relative group border-glow">
                   <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform"><FileDigit size={120} className="text-emerald" /></div>
                   <div className="text-[11px] text-slate-800 font-black uppercase tracking-[0.4em] mb-12 italic">Document_Lattice_Preview_0x9A</div>
                   <div className="text-slate-300 text-2xl lg:text-4xl font-medium leading-[1.3] font-display italic opacity-90 space-y-12">
                      <div className="space-y-4">
                        <p className="font-black text-white text-5xl">TO WHOMSOEVER IT CONCERNS,</p>
                        <p className="tracking-tighter opacity-70">SUBJECT: FORMAL DEMAND UNDER BNS PROTOCOLS.</p>
                      </div>
                      <div className="h-px w-20 bg-emerald/40" />
                      <p className="tracking-tight italic">
                        I hereby serve notice that per our contractual obligations dated <span className="text-emerald font-black">{formData.joining_date || '[UNSYNCH_DATE]'}</span>, the sum of <span className="text-emerald font-black">₹{formData.amount || '[NULL_SUM]'}</span> remains outstanding in your ledger. Failure to remediate within 72 hours will trigger an immediate Local Court Filing...
                      </p>
                   </div>
                   <div className="mt-16 flex items-center gap-3 text-emerald/40 font-black text-[10px] uppercase tracking-widest italic group-hover:text-emerald transition-colors">
                      <Lock size={14} /> End-to-End Encrypted Segment
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto pb-40">
                <button className="h-28 rounded-[3rem] glass-card border-white/10 text-white font-black uppercase text-3xl italic tracking-tighter flex items-center justify-center gap-6 transition-all hover:bg-white/5 border-glow shadow-2xl group">
                  <FileDown size={40} className="text-slate-600 group-hover:text-white transition-all group-hover:scale-110" />
                  PDF Secure
                </button>
                <button className="h-28 rounded-[3rem] gradient-emerald shadow-[0_30px_80px_rgba(16,185,129,0.4)] text-white font-black uppercase text-3xl italic tracking-tighter flex items-center justify-center gap-6 transition-all hover:scale-105 active:scale-95">
                  <Send size={40} />
                  Link WhatsApp
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
