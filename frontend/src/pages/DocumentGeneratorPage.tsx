import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Download, Share2, CheckCircle2, Loader2, Link, 
  ChevronRight, Sparkles, Database, ShieldCheck, Zap, 
  Search, Filter, Info, Award, FileDigit, 
  Box, Fingerprint, LucideFileText, Scan, Layers, ZapIcon
} from 'lucide-react'
import { DOCUMENT_CATEGORIES, cn } from '@/utils'

const SAMPLE_DOCS = {
  employment: [
    'Unpaid Salary Legal Notice',
    'Wrongful Termination Petition',
    'Gratuity Recovery Notice',
    'PF Non-Deposit Formal Complaint',
    'Maternity Benefit Rejection Reply',
    'Labour Court Direct Complaint',
    'POSH Violation Workplace Complaint',
    'Overtime Wage Demand Letter',
  ],
  property: [
    'Illegal Eviction Rebuttal Notice',
    'Security Deposit Refund Notice',
    'RERA Builder Delay Complaint',
    'Unlawful Rent Hike Objection',
    'Tenant Rights Enforcement Notice',
    'Property Encroachment Notice',
    'Society Maintenance Dispute',
  ],
  consumer: [
    'Consumer Forum Full Complaint',
    'E-Commerce Refund Formal Demand',
    'Banking Ombudsman Petition',
    'Insurance Claim Rejection Reply',
    'Loan Recovery Harassment Notice',
    'UPI Financial Fraud Complaint',
    'Cheque Bounce Notice (NI Act Sec 138)',
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
      p += Math.random() * 25
      setGenProgress(Math.min(p, 100))
      if (p >= 100) { clearInterval(interval); setTimeout(() => setStage('done'), 400) }
    }, 400)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 lg:px-12 py-10 max-w-7xl mx-auto space-y-16 mesh-gradient min-h-screen relative overflow-hidden">
      
      {/* Atmosphere */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none -ml-40 -mb-40" />

      {/* Header System */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
        <div className="space-y-4">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[2rem] gradient-primary glow-saffron flex items-center justify-center shadow-2xl">
                 <LucideFileText size={36} className="text-white" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none font-display">Contract Forge</h1>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_#06b6d4] animate-pulse" />
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em]">Autonomous Submission Generator v3.0</p>
           </div>
        </div>
        
        <div className="flex items-center gap-6 glass-diamond p-4 lg:p-4 pr-10 rounded-[3rem] border-white/5 shadow-2xl backdrop-blur-[60px] bg-slate-900/30">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
              <Database size={20} className="text-slate-500" />
           </div>
           <div className="text-right">
              <p className="text-white font-black text-xs uppercase tracking-tight italic">47 Formats Available</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1 italic">Source: 2024 Legal Code</p>
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'select' && (
          <motion.div key="select" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12 relative z-10">
            {/* Category Selector Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {DOCUMENT_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedCategory(cat); setSelectedDoc(null) }}
                  className={cn(
                    'p-8 rounded-[3rem] text-left transition-all duration-500 border relative overflow-hidden group/cat',
                    selectedCategory.id === cat.id ? 'bg-white/10 border-white/30 shadow-2xl' : 'glass-diamond border-white/5 opacity-60'
                  )}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/cat:opacity-10 transition-all font-display text-2xl">{cat.icon}</div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}20` }}>
                        <span className="text-xl">{cat.icon}</span>
                     </div>
                     <span className="text-white font-black text-lg lg:text-xl uppercase tracking-tighter italic font-display">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-500 opacity-20" style={{ width: '40%' }} />
                     </div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cat.count} Templates</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Document Ledger */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-10">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shadow-xl">
                        <Scan size={18} className="text-slate-500" />
                     </div>
                     <h2 className="text-white font-black text-xl lg:text-3xl italic tracking-tighter uppercase font-display leading-none">Drafting Catalog</h2>
                  </div>
                  <div className="flex items-center gap-4">
                     <Search size={22} className="text-slate-500 cursor-pointer" />
                     <Filter size={22} className="text-slate-500 cursor-pointer" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {catDocs.map((docName: string, i: number) => (
                   <motion.button
                     key={docName}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.04 }}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => { setSelectedDoc(docName); setStage('form') }}
                     className="p-8 rounded-[3rem] glass-diamond border-white/5 hover:border-saffron/40 hover:bg-white/5 transition-all text-left shadow-xl group relative overflow-hidden h-full flex flex-col justify-between"
                   >
                     <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-all scale-150 rotate-12">
                        <FileText size={100} className="text-saffron" />
                     </div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${selectedCategory.color}20` }}>
                           <FileText size={24} style={{ color: selectedCategory.color }} />
                        </div>
                        <h4 className="text-white font-black text-xl lg:text-2xl italic tracking-tighter leading-tight font-display mb-4 uppercase">{docName}</h4>
                     </div>
                     <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Procedural Grade: A++</span>
                        <ChevronRight size={20} className="text-slate-800 group-hover:text-saffron transition-all group-hover:translate-x-1" />
                     </div>
                   </motion.button>
                 ))}
               </div>
            </div>
          </motion.div>
        )}

        {stage === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto w-full relative z-10 py-10 lg:py-20">
            <div className="glass-diamond rounded-[5rem] overflow-hidden border-white/10 bg-slate-900/40 shadow-[0_50px_150px_rgba(0,0,0,0.5)]">
               <div className="p-10 lg:p-16 border-b border-white/5 bg-[#030712]/40 backdrop-blur-3xl flex items-center justify-between">
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 rounded-[2.25rem] glass-diamond flex items-center justify-center border-accent-purple/30 shadow-2xl relative">
                        <div className="absolute inset-0 bg-accent-purple/10 animate-pulse" />
                        <FileDigit size={40} className="text-accent-purple relative z-10" />
                     </div>
                     <div>
                        <span className="text-accent-purple text-[10px] font-black uppercase tracking-[0.4em] italic mb-1 block">Active Forge Session</span>
                        <h2 className="text-3xl lg:text-5xl font-black text-white italic tracking-tighter font-display uppercase">{selectedDoc}</h2>
                     </div>
                  </div>
                  <button onClick={() => setStage('select')} className="w-14 h-14 rounded-full glass-card border-white/10 text-slate-500 hover:text-white flex items-center justify-center transition-all">✕</button>
               </div>

               <div className="p-10 lg:p-16 space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {((FORM_FIELDS as any)[selectedCategory.id] || FORM_FIELDS.employment).map((field: any) => (
                      <div key={field.id} className="space-y-4">
                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] px-2 block italic">
                          {field.label} Protocol
                        </label>
                        <div className="relative group">
                           <input
                             type={field.type || 'text'}
                             placeholder={field.placeholder}
                             value={formData[field.id] || ''}
                             onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                             className="w-full h-16 lg:h-20 bg-slate-950/50 border border-white/5 rounded-[2.5rem] px-8 text-white text-lg font-medium placeholder-slate-700 focus:outline-none focus:border-accent-purple/40 focus:bg-slate-950 transition-all font-sans italic"
                           />
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity">
                              <Box size={20} className="text-slate-500" />
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-10 rounded-[4rem] bg-india-green/5 border border-india-green/20 relative overflow-hidden group/tip">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/tip:opacity-15 transition-all">
                       <ZapIcon size={80} className="text-india-green uppercase" />
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="w-16 h-16 rounded-[2rem] bg-india-green/10 flex items-center justify-center shrink-0 border border-india-green/20">
                          <Zap size={32} className="text-india-green" />
                       </div>
                       <div className="space-y-2">
                          <h5 className="text-india-green font-black text-xl italic font-display uppercase tracking-tight leading-none">AI Integration Tip</h5>
                          <p className="text-slate-400 text-lg font-medium italic leading-relaxed opacity-80">
                             Launch the <span className="text-white font-black">Voice Session</span> first — our RAG engine auto-populates this matrix from your dialogue transcript.
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6">
                    <button
                      onClick={() => setStage('select')}
                      className="flex-1 h-20 rounded-[2.5rem] glass-diamond border-white/10 text-slate-500 font-black text-xs lg:text-sm uppercase tracking-[0.3em] hover:text-white transition-all shadow-xl italic"
                    >
                      ← Abort Protocol
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="flex-[2] h-20 rounded-[2.5rem] gradient-primary glow-saffron text-white font-black text-xl tracking-tighter italic uppercase border-none shadow-[0_20px_60px_rgba(255,153,51,0.25)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-6"
                    >
                      Initialize Forgery Engine
                      <ChevronRight size={28} />
                    </button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {stage === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 gap-16 relative z-10">
            <div className="relative w-48 h-48 lg:w-64 lg:h-64">
              <div className="absolute inset-0 rounded-[4.5rem] border-8 border-white/5" />
              <svg className="w-full h-full -rotate-90 absolute inset-0">
                <rect x="10%" y="10%" width="80%" height="80%" rx="3rem" fill="none" stroke="#dc2626" strokeWidth="12"
                  strokeDasharray={`${genProgress * 2.8} 280`} strokeLinecap="round" className="transition-all duration-400" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={56} className="text-red-500 animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-6">
              <h3 className="text-4xl lg:text-6xl font-black text-white italic uppercase tracking-tighter font-display leading-none">Forging Submission</h3>
              <div className="flex gap-4 justify-center flex-wrap">
                {['Law Vector Mapping', 'Context Synthesis', 'Section Audit', 'Hash Deployment'].map((s, i) => (
                  <motion.div key={s} 
                    animate={{ opacity: genProgress > i * 25 ? 1 : 0.2 }}
                    className="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest"
                  >
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto w-full relative z-10 py-10 lg:py-20">
            <div className="space-y-10">
              {/* Massive Success Header */}
              <div className="glass-diamond rounded-[5rem] p-16 lg:p-24 border-india-green/30 bg-india-green/5 text-center space-y-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-[3] rotate-12">
                   <ShieldCheck size={128} className="text-india-green" />
                </div>
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[3rem] bg-india-green/10 flex items-center justify-center mx-auto border border-india-green/30 shadow-[0_0_50px_rgba(19,136,8,0.2)] animate-float">
                  <CheckCircle2 size={56} className="text-india-green" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-5xl lg:text-7xl font-black text-white tracking-tighter font-display italic uppercase leading-none">Draft Generated</h3>
                  <p className="text-slate-400 text-lg lg:text-2xl font-medium italic opacity-60">Verified Admissible Proof of Claim: {selectedDoc}</p>
                </div>

                {/* Blockchain Proof Core */}
                <div className="p-10 lg:p-12 rounded-[4rem] bg-slate-950/80 border border-accent-purple/40 text-left relative overflow-hidden group/block shadow-2xl">
                  <div className="absolute inset-0 bg-accent-purple/5 opacity-0 group-hover/block:opacity-100 transition-opacity" />
                  <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
                     <div className="w-20 h-20 rounded-[2rem] bg-accent-purple/10 flex items-center justify-center border border-accent-purple/30 group-hover/block:scale-110 transition-transform">
                        <Fingerprint size={36} className="text-accent-purple" />
                     </div>
                     <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                           <Link size={14} className="text-accent-purple" />
                           <span className="text-accent-purple text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Polygon Layer-2 Hash Matrix</span>
                        </div>
                        <p className="text-white font-black text-2xl tracking-tighter uppercase italic leading-none font-display">Neural Certificate of Integrity</p>
                        <p className="text-slate-600 text-[10px] font-mono leading-none mt-2 break-all opacity-60">TXN_ID: 0x7F3A5CCB9E2B1F0A4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D</p>
                     </div>
                     <div className="text-right">
                        <div className="text-accent-purple font-black text-xs font-display flex items-center justify-end gap-2 uppercase tracking-tight">ADMISSIBLE <Layers size={14} /></div>
                        <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest mt-1 block">Indian Evidence Act v1.4</span>
                     </div>
                  </div>
                </div>

                {/* Doc Preview Ledger */}
                <div className="p-10 lg:p-12 rounded-[4rem] glass-diamond border-white/5 text-left shadow-2xl bg-white/2 backdrop-blur-3xl group/ledger relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 grayscale invert">
                     <LucideFileText size={100} />
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-1.5 h-6 bg-slate-800 rounded-full" />
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] italic">Statutory Submission Preview</p>
                  </div>
                  <div className="text-slate-200 text-lg lg:text-3xl font-medium leading-tight font-display italic space-y-6 opacity-80">
                    <p className="font-black text-white">To: The Manager, {formData.employer || '{Commercial_Entity}'},</p>
                    <p>Sub: Formal demand for immediate payment of outstanding wages per <span className="text-saffron">Payment of Wages Act 1936, Section 15</span>.</p>
                    <p>I, the aggrieved party, hereby serve notice for recovery of ₹{formData.amount || '{Sum_Value}'} representing unresolved contractual wages for {formData.months || '{N}'} cycles...</p>
                  </div>
                </div>
              </div>

              {/* Action Matrix Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24">
                <button className="h-24 rounded-[3.5rem] glass-diamond border-white/10 text-white font-black text-xl lg:text-2xl tracking-tighter italic uppercase font-display flex items-center justify-center gap-6 shadow-2xl hover:bg-white/5 transition-all active:scale-95 group">
                  <Download size={32} className="text-slate-600 group-hover:text-white transition-colors" />
                  Acquire Global PDF
                </button>
                <button className="h-24 rounded-[3.5rem] bg-india-green/10 border border-india-green/30 text-india-green font-black text-xl lg:text-2xl tracking-tighter italic uppercase font-display flex items-center justify-center gap-6 shadow-2xl hover:bg-india-green/20 transition-all active:scale-95 group">
                  <Share2 size={32} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Channel: WhatsApp
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
