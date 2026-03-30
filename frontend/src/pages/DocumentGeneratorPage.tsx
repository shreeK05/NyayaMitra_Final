import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Download, Share2, CheckCircle2, Loader2, Link, 
  ChevronRight, Sparkles, Database, ShieldCheck, Zap, 
  Search, Filter, Info, Award, FileDigit, 
  Box, Fingerprint, LucideFileText, Scan, Layers, ZapIcon,
  ArrowLeft, FileDown, Send, FileCheck
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
      p += 2
      setGenProgress(p)
      if (p >= 100) { 
        clearInterval(interval)
        setTimeout(() => setStage('done'), 400) 
      }
    }, 50)
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-display selection:bg-emerald/30">
      {/* 🧭 Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shadow-lg shadow-emerald/20">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-widest italic leading-none">Document Generator</h1>
                <p className="text-[10px] text-emerald font-bold uppercase tracking-tighter mt-1">Foundry Protocol V3.0</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 bg-white/2 border border-white/5 px-5 py-2 rounded-full">
            <Database size={14} className="text-emerald" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">47 Validated BNS Templates</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 max-w-6xl pt-32 pb-20">
        <AnimatePresence mode="wait">
          {stage === 'select' && (
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              {/* Category Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat); setSelectedDoc(null) }}
                    className={cn(
                      'p-8 rounded-[2.5rem] text-left transition-all duration-500 border relative overflow-hidden group border-glow',
                      selectedCategory.id === cat.id ? 'glass-card border-white/20' : 'bg-white/2 border-white/5 opacity-50'
                    )}
                  >
                    <div className="text-3xl mb-4 transition-transform group-hover:scale-110">{cat.icon}</div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter font-display">{cat.name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{cat.count} Templates</p>
                  </button>
                ))}
              </div>

              {/* Template Ledger */}
              <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter font-display">Drafting Catalog</h2>
                  <div className="flex gap-4">
                    <Search size={20} className="text-slate-600" />
                    <Filter size={20} className="text-slate-600" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catDocs.map((docName: string, i: number) => (
                    <motion.button
                      key={docName}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => { setSelectedDoc(docName); setStage('form') }}
                      className="p-8 rounded-[2.5rem] glass-card border-white/5 hover:border-emerald/40 transition-all text-left shadow-xl group border-glow h-full flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center mb-6 text-emerald group-hover:scale-110 transition-transform">
                          <FileText size={24} />
                        </div>
                        <h4 className="text-xl font-black italic uppercase tracking-tighter leading-tight font-display text-slate-100">{docName}</h4>
                      </div>
                      <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Procedural Grade: A++</span>
                        <ChevronRight size={18} className="text-slate-700 group-hover:text-emerald group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto py-10 lg:py-20">
              <div className="glass-card rounded-[3.5rem] border-white/10 overflow-hidden border-glow">
                <div className="p-10 lg:p-14 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.75rem] bg-emerald/10 flex items-center justify-center border border-emerald/20 text-emerald animate-pulse">
                      <FileDigit size={32} />
                    </div>
                    <div>
                      <span className="text-emerald text-[9px] font-black uppercase tracking-widest mb-1 block opacity-60">Active Drafting Loom</span>
                      <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-tighter font-display leading-none">{selectedDoc}</h2>
                    </div>
                  </div>
                  <button onClick={() => setStage('select')} className="text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">Back</button>
                </div>

                <div className="p-10 lg:p-14 space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {((FORM_FIELDS as any)[selectedCategory.id] || FORM_FIELDS.employment).map((field: any) => (
                      <div key={field.id} className="space-y-3">
                        <label className="text-slate-600 text-[10px] font-black uppercase tracking-widest px-2">{field.label}</label>
                        <input
                          type={field.type || 'text'}
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                          className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl px-6 text-white text-lg font-medium focus:outline-none focus:border-emerald/40 transition-all font-display italic"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-8 rounded-3xl bg-emerald/5 border border-emerald/10 relative overflow-hidden group">
                    <div className="flex items-center gap-4 relative z-10">
                       <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
                          <Zap size={24} />
                       </div>
                       <div>
                          <h5 className="text-emerald font-black text-lg italic font-display uppercase tracking-tight">Pro Tip: Neural Link</h5>
                          <p className="text-slate-500 text-sm font-medium italic opacity-70">Use the Voice Counsellor first — we auto-populate this form from your transcript.</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStage('select')} className="flex-1 h-16 rounded-2xl glass-panel border border-white/5 text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">Abort Protocol</button>
                    <button onClick={handleGenerate} className="flex-[2] h-16 rounded-2xl gradient-emerald text-white font-black uppercase text-lg italic tracking-tighter shadow-xl shadow-emerald/20 transition-all hover:scale-105 active:scale-95">FORGE DOCUMENT</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'generating' && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 gap-12 text-center">
              <div className="relative w-48 h-48 lg:w-64 lg:h-64">
                <div className="absolute inset-0 rounded-[3rem] border-8 border-white/5" />
                <svg className="w-full h-full -rotate-90 absolute inset-0">
                  <rect x="10%" y="10%" width="80%" height="80%" rx="2rem" fill="none" stroke="var(--emerald)" strokeWidth="12" strokeDasharray={`${genProgress * 2.8} 280`} strokeLinecap="round" className="transition-all duration-100" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={48} className="text-emerald animate-spin" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter font-display leading-none">Forging Statutory File</h3>
                <p className="text-slate-500 font-medium italic opacity-60">Mapping law vectors and contextual synthesis...</p>
              </div>
            </motion.div>
          )}

          {stage === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto py-10 lg:py-20 text-center space-y-12">
              <div className="glass-card p-16 rounded-[4rem] border-emerald/30 bg-emerald/5 border-glow relative overflow-hidden">
                <div className="w-24 h-24 rounded-[2rem] bg-emerald/10 border border-emerald/20 flex items-center justify-center mx-auto mb-8 text-emerald shadow-2xl shadow-emerald/20">
                  <FileCheck size={48} />
                </div>
                <h3 className="text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none font-display mb-4">Draft Generated</h3>
                <p className="text-slate-500 text-lg font-medium italic opacity-70">Verified Legal Admissibility for: {selectedDoc}</p>

                {/* Preview */}
                <div className="p-10 rounded-[3rem] bg-black/60 border border-white/5 text-left mt-16 max-w-2xl mx-auto">
                   <div className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-6">Document Pulse Preview</div>
                   <div className="text-slate-300 text-xl font-medium leading-relaxed font-display italic opacity-90 space-y-6">
                      <p className="font-black text-white">To: Final Notice Entity,</p>
                      <p>Subject: Demand for Settlement under <span className="text-emerald">BNS Protocols</span>.</p>
                      <p>I hereby serve notice that per our contractual obligations dated {formData.joining_date || '{Date}'}, the sum of ₹{formData.amount || '{Sum}'} remains outstanding...</p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto pb-20">
                <button className="h-20 rounded-[2rem] glass-card border-white/10 text-white font-black uppercase text-xl italic flex items-center justify-center gap-4 transition-all hover:bg-white/5 border-glow">
                  <FileDown size={28} className="text-slate-500" />
                  PDF Download
                </button>
                <button className="h-20 rounded-[2rem] gradient-emerald shadow-xl shadow-emerald/20 text-white font-black uppercase text-xl italic flex items-center justify-center gap-4 transition-all hover:scale-105">
                  <Send size={24} />
                  WhatsApp
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
