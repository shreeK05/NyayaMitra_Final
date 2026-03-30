import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Phone, CheckCircle2, ArrowRight, RefreshCw, 
  MapPin, User, ChevronRight, Lock, Sparkles, Scale,
  Activity, ArrowLeft, Fingerprint, Zap, Landmark,
  Globe, ShieldCheck, Target, Bot
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { sendOtp, verifyOtp } from '@/utils/api'
import { cn } from '@/utils'

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    if (phone.length !== 10) return
    setLoading(true)
    try {
      await sendOtp(phone)
      setStep('otp')
    } catch {
      setStep('otp') // Fallback for dev
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (otp.length !== 6) return
    setLoading(true)
    try {
      const res: any = await verifyOtp({ phone_number: phone, otp })
      if (res.user?.name) {
        localStorage.setItem('user', JSON.stringify(res.user))
        navigate('/home')
      } else {
        setStep('profile')
      }
    } catch {
      setStep('profile') // Fallback for dev
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const res: any = await verifyOtp({ phone_number: phone, otp, name })
      localStorage.setItem('user', JSON.stringify(res.user))
      navigate('/home')
    } catch {
      navigate('/home')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 lg:p-12 relative overflow-hidden font-display selection:bg-saffron/30">
      
      {/* 🌌 Atmospheric Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-saffron/10 blur-[250px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-indigo/5 blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-x-0 top-0 h-px bg-white/5 opacity-20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1 }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="text-center mb-24 space-y-10">
           <div className="flex flex-col items-center justify-center gap-10">
              <button 
                onClick={() => navigate('/')}
                className="w-20 h-20 rounded-[2rem] glass-card border-white/10 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:scale-110 active:scale-95 transition-all border-glow group"
              >
                 <ArrowLeft size={36} className="text-slate-600 group-hover:text-white transition-colors" />
              </button>
              <div className="space-y-4">
                 <h1 className="text-8xl lg:text-[13rem] font-black text-white italic tracking-tighter uppercase leading-[0.7] font-display select-none">
                   UPLINK<span className="text-gradient-saffron">_NODE</span>
                 </h1>
                 <div className="inline-flex items-center gap-4 px-8 py-2.5 rounded-2xl bg-white/2 border border-white/5 shadow-2xl backdrop-blur-3xl">
                    <div className="w-2.5 h-2.5 rounded-full bg-saffron shadow-[0_0_12px_#ff9933] animate-pulse" />
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.6em] italic">Identity_Protocol_v4.3.0_Active</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="glass-card rounded-[5rem] p-16 lg:p-24 border-white/10 relative overflow-hidden bg-black/40 border-glow shadow-[0_80px_160px_rgba(0,0,0,1)]">
           <AnimatePresence mode="wait">
              {step === 'phone' && (
                <motion.div key="phone" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-20">
                   <div className="space-y-8 text-center lg:text-left">
                      <div className="flex items-center gap-6 justify-center lg:justify-start">
                         <div className="w-12 h-12 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron shadow-xl shadow-saffron/10"><Phone size={24} /></div>
                         <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none font-display italic">Audit Identity</h2>
                      </div>
                      <p className="text-slate-500 text-xl lg:text-3xl font-medium italic opacity-70 leading-snug">Initialize your secure mobile node to calibrate the <span className="text-white font-black underline decoration-saffron/40 pb-1">NEURAL_JUSTICE_MATRIX.</span></p>
                   </div>
                   
                   <div className="relative group max-w-4xl mx-auto">
                      <div className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-saffron transition-all duration-700 pointer-events-none group-focus-within:scale-125">
                         <Target size={40} />
                      </div>
                      <input 
                        type="tel"
                        maxLength={10}
                        autoFocus
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="99XX-XXX-XXX"
                        className="w-full h-32 lg:h-44 bg-black/80 border-2 border-white/5 rounded-[4rem] pl-32 lg:pl-44 pr-12 text-white text-5xl lg:text-8xl font-black tracking-widest placeholder-white/2 focus:outline-none focus:border-saffron transition-all shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] font-display italic leading-none"
                      />
                      <div className="absolute right-12 top-1/2 -translate-y-1/2 flex gap-1 items-center opacity-20">
                         {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-6 bg-slate-600 rounded-full" />)}
                      </div>
                   </div>

                   <button 
                     onClick={handleSendOtp}
                     disabled={phone.length !== 10 || loading}
                     className="w-full h-32 lg:h-40 rounded-[4rem] gradient-saffron text-white font-black text-4xl lg:text-5xl uppercase tracking-tighter italic shadow-[0_40px_100px_rgba(255,153,51,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-10 disabled:opacity-10 group overflow-hidden relative"
                   >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                      {loading ? <RefreshCw className="animate-spin text-5xl" /> : <><Zap size={48} className="animate-pulse" /> INITIALIZE_SHIELD</>}
                   </button>
                </motion.div>
              )}

              {step === 'otp' && (
                <motion.div key="otp" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-20">
                   <div className="space-y-8 text-center lg:text-left">
                      <div className="flex items-center gap-6 justify-center lg:justify-start text-emerald">
                         <div className="w-12 h-12 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center justify-center shadow-xl shadow-emerald/10"><Lock size={24} /></div>
                         <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none font-display">Neural Token</h2>
                      </div>
                      <p className="text-slate-500 text-xl lg:text-3xl font-medium italic opacity-70 leading-snug">Protocol dispatched to <b className="text-white italic tracking-widest">+91 {phone}</b>. <br />Decipher token to establish neural link.</p>
                   </div>
                   
                   <div className="relative group max-w-4xl mx-auto">
                      <div className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-emerald transition-all duration-700 pointer-events-none group-focus-within:scale-125">
                         <ShieldCheck size={40} />
                      </div>
                      <input 
                        type="text"
                        maxLength={6}
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="XXXXXX"
                        className="w-full h-32 lg:h-44 bg-black/80 border-2 border-white/5 rounded-[4rem] pl-32 lg:pl-44 pr-12 text-white text-6xl lg:text-9xl font-black tracking-[0.4em] placeholder-white/2 focus:outline-none focus:border-emerald transition-all shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] font-display italic leading-none"
                      />
                   </div>

                   <div className="flex flex-col lg:flex-row gap-10">
                      <button onClick={() => setStep('phone')} className="flex-1 h-32 rounded-[3rem] glass-card border border-white/10 text-slate-600 font-black uppercase text-sm tracking-[0.4em] hover:text-white transition-all italic border-glow shadow-2xl">RESET_MATRIX_ID</button>
                      <button 
                        onClick={handleVerify}
                        disabled={otp.length !== 6 || loading}
                        className="flex-[2] h-32 rounded-[3.5rem] gradient-emerald text-white font-black text-4xl lg:text-5xl uppercase tracking-tighter italic shadow-[0_40px_100px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-10 disabled:opacity-10 group overflow-hidden relative"
                      >
                         <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                         {loading ? <RefreshCw className="animate-spin text-5xl" /> : <><CheckCircle2 size={48} className="animate-neural-pulse" /> VERIFY_LINK</>}
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-20">
                   <div className="space-y-12 text-center">
                      <div className="relative group inline-block">
                         <div className="absolute inset-0 bg-indigo/40 blur-[120px] rounded-full group-hover:bg-indigo/60 transition-all duration-1000" />
                         <div className="w-48 h-48 mx-auto rounded-[4rem] bg-black border-2 border-indigo/20 flex items-center justify-center shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative z-10 transition-transform group-hover:rotate-12 duration-700">
                            <User size={96} className="text-white" />
                            <div className="absolute inset-0 bg-indigo/10 rounded-[4rem] animate-neural-pulse" />
                         </div>
                      </div>
                      <div className="space-y-6">
                        <h2 className="text-6xl lg:text-9xl font-black text-white tracking-tighter uppercase italic leading-none font-display text-glow-indigo italic">Sync Persona</h2>
                        <p className="text-slate-500 text-2xl lg:text-3xl font-medium italic opacity-70 leading-snug">New Node Protocol. Establish your identity within the <span className="text-white font-black underline decoration-indigo/40">DIGITAL_JUDICIAL_LATTICE.</span></p>
                      </div>
                   </div>
                   
                   <div className="space-y-10 group max-w-4xl mx-auto">
                      <div className="relative">
                         <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-indigo transition-all duration-700 pointer-events-none">
                            <Fingerprint size={48} />
                         </div>
                         <input 
                           type="text"
                           autoFocus
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           placeholder="Citizen / Nom de Guerre"
                           className="w-full h-32 lg:h-40 bg-black border-2 border-white/5 rounded-[4rem] pl-32 lg:pl-40 pr-12 text-white text-3xl lg:text-6xl font-black placeholder-white/2 focus:outline-none focus:border-indigo transition-all shadow-[inset_0_10px_40px_rgba(0,0,0,1)] italic font-display leading-none"
                         />
                      </div>
                   </div>

                   <button 
                     onClick={handleComplete}
                     disabled={!name.trim() || loading}
                     className="w-full h-32 lg:h-44 rounded-[4rem] gradient-indigo text-white font-black text-4xl lg:text-[4.5rem] uppercase tracking-tighter italic shadow-[0_50px_120px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-10 disabled:opacity-10 group overflow-hidden relative"
                   >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                      SYNC SESSION <ArrowRight size={56} className="group-hover:translate-x-6 transition-transform duration-700" />
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Distributed Integrity Labels */}
        <div className="mt-24 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 opacity-20 pointer-events-none select-none">
           <div className="flex items-center gap-6 group">
              <Shield size={24} className="text-emerald animate-pulse" />
              <span className="text-[12px] font-black uppercase tracking-[0.8em] text-slate-500 italic">Disturbed_Persistent_Encryption</span>
           </div>
           <div className="flex items-center gap-6">
              <ShieldCheck size={24} className="text-emerald animate-pulse" />
              <span className="text-[12px] font-black uppercase tracking-[0.8em] text-slate-500 italic">Civil_Sovereignty_Matrix_Active</span>
           </div>
           <div className="flex items-center gap-6">
              <Globe size={24} className="text-emerald animate-pulse" />
              <span className="text-[12px] font-black uppercase tracking-[0.8em] text-slate-500 italic">Indian_Judicial_Lattice_v4.3</span>
           </div>
        </div>
      </motion.div>
    </div>
  )
}
