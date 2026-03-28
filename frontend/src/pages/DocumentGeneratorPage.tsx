import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, Share2, CheckCircle2, Loader2, Link } from 'lucide-react'
import { DOCUMENT_CATEGORIES, cn } from '@/utils'

const SAMPLE_DOCS = {
  employment: [
    'Unpaid Salary Notice',
    'Wrongful Termination Notice',
    'Gratuity Demand',
    'PF Non-Deposit EPFO Complaint',
    'Maternity Benefit Demand',
    'Labour Court Complaint',
    'POSH Workplace Harassment Complaint',
    'Overtime Payment Demand',
  ],
  property: [
    'Illegal Eviction Reply Notice',
    'Security Deposit Refund Notice',
    'RERA Builder Complaint',
    'Illegal Rent Hike Objection',
    'Tenant Rights Protection Petition',
    'Property Encroachment Notice',
    'Society Maintenance Demand',
  ],
  consumer: [
    'Consumer Forum Complaint',
    'E-Commerce Refund Demand',
    'Banking Ombudsman Complaint',
    'Insurance Claim Rejection Reply',
    'Loan Recovery Harassment Complaint',
    'UPI Online Fraud Complaint',
    'Cheque Bounce Notice (NI Act Section 138)',
  ],
}

const FORM_FIELDS = {
  employment: [
    { id: 'employer', label: 'Employer Name', placeholder: 'Sharma Textiles Pvt. Ltd.' },
    { id: 'amount', label: 'Amount Due (₹)', placeholder: '72,000', type: 'number' },
    { id: 'months', label: 'Months Unpaid', placeholder: '3', type: 'number' },
    { id: 'designation', label: 'Your Designation', placeholder: 'Factory Worker' },
    { id: 'joining_date', label: 'Date of Joining', type: 'date' },
  ],
  property: [
    { id: 'landlord', label: 'Landlord Name', placeholder: 'Mr. Mehta' },
    { id: 'property', label: 'Property Address', placeholder: 'Flat 204, Anand Nagar, Pune' },
    { id: 'deposit', label: 'Security Deposit (₹)', placeholder: '1,80,000', type: 'number' },
    { id: 'rent', label: 'Monthly Rent (₹)', placeholder: '18,000', type: 'number' },
    { id: 'move_in', label: 'Move-in Date', type: 'date' },
  ],
  consumer: [
    { id: 'company', label: 'Company / Platform Name', placeholder: 'Amazon.in' },
    { id: 'order_no', label: 'Order / Transaction ID', placeholder: 'AMZ-123456789' },
    { id: 'amount', label: 'Disputed Amount (₹)', placeholder: '5,000', type: 'number' },
    { id: 'issue', label: 'Nature of Issue', placeholder: 'Product not delivered but payment deducted' },
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
    const steps = [
      'Extracting case facts from conversation...',
      'Retrieving applicable law sections via RAG...',
      'Drafting legal document...',
      'Applying Blockchain timestamp (Polygon)...',
      'Generating PDF...',
    ]
    let stepIdx = 0
    const interval = setInterval(() => {
      p += Math.random() * 22
      setGenProgress(Math.min(p, 100))
      if (p >= 100) { clearInterval(interval); setTimeout(() => setStage('done'), 300) }
      else if (p > stepIdx * 22) stepIdx++
    }, 350)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="px-4 py-5 space-y-5 max-w-lg mx-auto">

      {/* Header */}
      <div>
        <h2 className="text-white font-bold text-xl">Document Generator</h2>
        <p className="text-slate-400 text-sm mt-1">47 legal document types • Generated in 60 seconds</p>
      </div>

      {/* Category Selector */}
      <div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DOCUMENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat); setSelectedDoc(null); if (stage !== 'select') setStage('select') }}
              className={cn(
                'shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200',
                selectedCategory.id === cat.id
                  ? 'text-white border border-white/20'
                  : 'glass-card text-slate-400 hover:text-white border border-white/5'
              )}
              style={selectedCategory.id === cat.id
                ? { backgroundColor: `${cat.color}20`, borderColor: `${cat.color}40` }
                : {}
              }
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black"
                style={{ color: cat.color, backgroundColor: `${cat.color}20` }}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-2">
              {catDocs.map((docName: string) => (
                <motion.button
                  key={docName}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedDoc(docName); setStage('form') }}
                  className={cn(
                    'w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all duration-200',
                    'glass-card border border-white/5 hover:border-white/15 hover-lift group'
                  )}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${selectedCategory.color}20` }}>
                    <FileText size={16} style={{ color: selectedCategory.color }} />
                  </div>
                  <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
                    {docName}
                  </span>
                  <span className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors">→</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {stage === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-4 border border-purple-500/20">
                <p className="text-purple-400 text-xs font-bold uppercase mb-1">Generating</p>
                <h3 className="text-white font-bold">{selectedDoc}</h3>
              </div>

              <div className="space-y-3">
                {((FORM_FIELDS as any)[selectedCategory.id] || FORM_FIELDS.employment).map((field: any) => (
                  <div key={field.id}>
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">
                      {field.label}
                    </label>
                    <input
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      value={formData[field.id] || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      className="w-full glass-card rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm
                                 border border-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-1 
                                 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-2xl p-3 border border-amber-500/20">
                <p className="text-amber-400 text-xs font-bold uppercase mb-1">💡 Pro Tip</p>
                <p className="text-slate-400 text-xs">
                  Use the Voice Counsellor first — all fields auto-fill from your conversation. Camera can also extract data from salary slips and receipts.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStage('select')}
                  className="flex-1 py-3 rounded-xl glass-card border border-white/10 text-slate-400 
                             hover:text-white text-sm font-semibold transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 py-3 rounded-xl gradient-primary text-white font-bold text-sm glow-saffron
                             hover:scale-[1.02] transition-all"
                >
                  Generate PDF →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center py-12 space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
              <svg className="w-24 h-24 -rotate-90 absolute inset-0">
                <circle cx="48" cy="48" r="44" fill="none" stroke="#7c3aed" strokeWidth="4"
                  strokeDasharray={`${genProgress * 2.76} 276`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="text-purple-400 animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-white font-bold">Generating {selectedDoc}</h3>
              <p className="text-slate-400 text-sm">RAG retrieval • Legal drafting • Blockchain timestamp</p>
            </div>
          </motion.div>
        )}

        {stage === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="space-y-4">
              {/* Success */}
              <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto glow-cyan">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Document Ready!</h3>
                  <p className="text-slate-400 text-sm mt-1">{selectedDoc}</p>
                </div>

                {/* Blockchain proof */}
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Link size={14} className="text-purple-400" />
                    <span className="text-purple-400 text-xs font-bold">Blockchain Timestamped</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Polygon Mainnet • SHA-256 Hash</p>
                  <p className="text-slate-500 text-[10px] font-mono mt-0.5">Tx: 0x7f3a...c9b2 • 2 sec finality</p>
                  <p className="text-purple-300 text-[10px] mt-1">✓ Court-admissible timing proof</p>
                </div>

                {/* Document preview snippet */}
                <div className="p-3 rounded-xl glass-card border border-white/5 text-left">
                  <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Document Preview</p>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong className="text-white">To: The Manager,</strong><br />
                    {formData.employer || 'Sharma Textiles Pvt. Ltd.'}<br /><br />
                    Sub: Demand for payment of outstanding wages under Payment of Wages Act 1936, Section 15.<br /><br />
                    I, the undersigned, hereby demand payment of Rs. {formData.amount || '72,000'} being wages due and outstanding for {formData.months || '3'} month(s)...
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl glass-card
                                   border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-all">
                  <Download size={18} className="text-slate-400" />
                  Download PDF
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl
                                   bg-green-500/15 border border-green-500/30 text-green-400 
                                   text-sm font-semibold hover:bg-green-500/25 transition-all">
                  <Share2 size={18} />
                  WhatsApp
                </button>
              </div>

              <button
                onClick={() => { setStage('select'); setSelectedDoc(null); setFormData({}) }}
                className="w-full py-3 rounded-2xl text-slate-400 text-sm hover:text-white 
                           transition-colors border border-white/5 hover:border-white/10"
              >
                Generate Another Document
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
