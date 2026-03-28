import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Calendar, ChevronDown, ChevronUp, GitCompare, AlertCircle } from 'lucide-react'
import { SAMPLE_AMENDMENTS, formatDate } from '@/utils'

function AmendmentCard({ amendment }: { amendment: typeof SAMPLE_AMENDMENTS[0] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div layout className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/20 transition-all">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 shrink-0 mt-0.5">
            <Bell size={16} className="text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400">AMENDED</span>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Calendar size={10} />
                {formatDate(amendment.gazetteDate)}
              </div>
            </div>
            <p className="text-white font-bold text-sm">{amendment.actName}</p>
            <p className="text-orange-400 text-xs font-semibold">{amendment.section}</p>
            <p className="text-slate-400 text-xs mt-1 line-clamp-2">{amendment.diffSummary}</p>
          </div>
          <span className="text-slate-500 shrink-0">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
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
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <GitCompare size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Before / After</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-[10px] font-bold uppercase mb-2">❌ Old Text (Repealed)</p>
                  <p className="text-slate-300 text-xs leading-relaxed line-through opacity-70">{amendment.oldText}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-emerald-400 text-[10px] font-bold uppercase mb-2">✓ New Text (Current Law)</p>
                  <p className="text-emerald-200 text-xs leading-relaxed">{amendment.newText}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-blue-400 text-[10px] font-bold uppercase mb-1">Impact Analysis</p>
                <p className="text-blue-200 text-xs leading-relaxed">{amendment.diffSummary}</p>
              </div>

              {amendment.relevantCases && amendment.relevantCases.length > 0 && (
                <div className="flex items-start gap-2 p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <AlertCircle size={14} className="text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-orange-300 text-xs">
                    This amendment affects <strong>{amendment.relevantCases.length} of your active cases</strong>. Tap to update documents.
                  </p>
                </div>
              )}

              <button className="w-full py-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 
                                 text-orange-400 text-sm font-bold hover:bg-orange-500/25 transition-all">
                🔄 Regenerate Affected Documents
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AmendmentTrackerPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="px-4 py-5 space-y-5 max-w-lg mx-auto">

      <div>
        <h2 className="text-white font-bold text-xl">Amendment Live Tracker</h2>
        <p className="text-slate-400 text-sm mt-1">Daily gazette scraper • egazette.gov.in • indiacode.nic.in</p>
      </div>

      {/* Last Scraped */}
      <div className="glass-card rounded-2xl p-3 flex items-center gap-3 border border-emerald-500/20">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-400 text-xs font-semibold">Live scraper running</span>
        <span className="text-slate-500 text-xs ml-auto">Last scraped: 6:00 AM today</span>
      </div>

      {/* IPC→BNS Banner */}
      <div className="glass-card rounded-2xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">🔄 IPC → BNS Auto-Translator</span>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed">
          As of July 1, 2024: IPC replaced by BNS, CrPC by BNSS, Evidence Act by BSA. 
          <strong className="text-white"> 500+ section mappings</strong> automatically applied to all your documents.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { from: 'IPC 302', to: 'BNS 103', label: 'Murder' },
            { from: 'IPC 376', to: 'BNS 64', label: 'Assault' },
            { from: 'IPC 420', to: 'BNS 318', label: 'Cheating' },
          ].map(({ from, to, label }) => (
            <div key={label} className="text-center p-1.5 rounded-xl bg-white/5">
              <div className="text-red-400/70 text-[9px] line-through">{from}</div>
              <div className="text-emerald-400 text-[9px] font-bold">{to}</div>
              <div className="text-slate-500 text-[9px]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Amendments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">Recent Gazette Amendments</h3>
          <span className="text-slate-500 text-xs">{SAMPLE_AMENDMENTS.length} new this month</span>
        </div>
        <div className="space-y-3">
          {SAMPLE_AMENDMENTS.map((a) => <AmendmentCard key={a.id} amendment={a} />)}
        </div>
      </div>

      {/* WhatsApp Alert Setup */}
      <div className="glass-card rounded-2xl p-4 border border-green-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-400 text-sm">📱</span>
          <span className="text-green-400 text-xs font-bold uppercase">WhatsApp Amendment Alerts</span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed mb-3">
          Get instant WhatsApp alerts when laws affecting YOUR active cases change. No app needed.
        </p>
        <button className="w-full py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 
                           text-green-400 text-sm font-semibold hover:bg-green-500/25 transition-all">
          Enable WhatsApp Alerts
        </button>
      </div>
    </motion.div>
  )
}
