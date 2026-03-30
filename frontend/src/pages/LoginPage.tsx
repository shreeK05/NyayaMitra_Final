import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Phone, CheckCircle2, ArrowRight, RefreshCw, 
  MapPin, User, ChevronRight, Lock, Sparkles, Scale,
  Activity, ArrowLeft, Fingerprint, Zap
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
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden font-display selection:bg-saffron/30">
      
      {/* 🌌 Neural Ambiance */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-saffron/10 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-16 space-y-6">
           <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/')}
                className="w-16 h-16 rounded-2xl glass-card border-white/10 flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-glow"
              >
                 <ArrowLeft size={28} className="text-white" />
              </button>
              <h1 className="text-6xl lg:text-[7rem] font-black text-white italic tracking-tighter uppercase leading-none font-display">UPLINK</h1>
           </div>
           <div className="flex items-center justify-center gap-4">
              <div className="w-2 h-2 rounded-full bg-saffron shadow-[0_0_8px_#ff9933] animate-pulse" />
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] italic">Identity Protocol v4.0</p>
           </div>
        </div>

        <div className="glass-card rounded-[4rem] p-16 lg:p-24 border-white/10 relative overflow-hidden bg-black/40 border-glow shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
           <AnimatePresence mode="wait">
              {step === 'phone' && (
                <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                   <div className="space-y-4">
                      <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none font-display">Audit ID</h2>
                      <p className="text-slate-500 text-lg lg:text-xl font-medium italic opacity-70">Initialize your secure mobile node to calibrate the <span className="text-white font-black">Neural Defense Matrix.</span></p>
                   </div>
                   
                   <div className="relative group">
                      <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-saffron transition-colors">
                         <Phone size={32} />
                      </div>
                      <input 
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="99XX-XXX-XXX"
                        className="w-full h-28 lg:h-32 bg-black/50 border-2 border-white/5 rounded-[3rem] pl-28 pr-10 text-white text-4xl lg:text-5xl font-black tracking-widest placeholder-white/5 focus:outline-none focus:border-saffron transition-all shadow-inner"
                      />
                   </div>

                   <button 
                     onClick={handleSendOtp}
                     disabled={phone.length !== 10 || loading}
                     className="w-full h-28 lg:h-32 rounded-[3rem] gradient-saffron text-white font-black text-3xl uppercase tracking-tighter italic shadow-2xl shadow-saffron/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-20"
                   >
                      {loading ? <RefreshCw className="animate-spin text-3xl" /> : <><Zap size={32} /> Initialize Shield</>}
                   </button>
                </motion.div>
              )}

              {step === 'otp' && (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                   <div className="space-y-4">
                      <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none font-display">Neural Token</h2>
                      <p className="text-slate-500 text-lg lg:text-xl font-medium italic opacity-70">Protocol dispatched to <b className="text-white">+91 {phone}</b>. Decipher to link node.</p>
                   </div>
                   
                   <div className="relative group">
                      <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-emerald transition-colors">
                         <Lock size={32} />
                      </div>
                      <input 
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="XXXXXX"
                        className="w-full h-28 lg:h-32 bg-black/50 border-2 border-white/5 rounded-[3rem] pl-28 pr-12 text-white text-5xl lg:text-6xl font-black tracking-[0.8em] placeholder-white/5 focus:outline-none focus:border-emerald transition-all shadow-inner"
                      />
                   </div>

                   <div className="flex flex-col lg:flex-row gap-6">
                      <button onClick={() => setStep('phone')} className="flex-1 h-24 rounded-[2.5rem] glass-card border border-white/10 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-all italic">Reset Matrix ID</button>
                      <button 
                        onClick={handleVerify}
                        disabled={otp.length !== 6 || loading}
                        className="flex-[2] h-24 rounded-[2.5rem] gradient-emerald text-white font-black text-3xl uppercase tracking-tighter italic shadow-2xl shadow-emerald/20 transition-all flex items-center justify-center gap-6 disabled:opacity-20"
                      >
                         {loading ? <RefreshCw className="animate-spin text-3xl" /> : <><CheckCircle2 size={32} /> Verify Uplink</>}
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                   <div className="space-y-10 text-center">
                      <div className="w-32 h-32 mx-auto rounded-[2.5rem] card-indigo border border-indigo/20 flex items-center justify-center shadow-2xl relative">
                         <User size={64} className="text-white" />
                         <div className="absolute inset-0 bg-indigo/20 rounded-[2.5rem] animate-pulse" />
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none font-display">Sync Persona</h2>
                        <p className="text-slate-500 text-lg lg:text-xl font-medium italic opacity-70">New Node detected. Establish your identity within the <span className="text-white font-black">Digital Judicial Lattice.</span></p>
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="relative group max-w-2xl mx-auto">
                         <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo transition-colors">
                            <Fingerprint size={28} />
                         </div>
                         <input 
                           type="text"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           placeholder="Citizen / Nom de Guerre"
                           className="w-full h-24 bg-black/50 border-2 border-white/5 rounded-[2.5rem] pl-24 pr-10 text-white text-2xl lg:text-3xl font-black placeholder-white/5 focus:outline-none focus:border-indigo transition-all shadow-inner"
                         />
                      </div>
                   </div>

                   <button 
                     onClick={handleComplete}
                     disabled={!name.trim() || loading}
                     className="w-full h-28 lg:h-32 rounded-[3rem] gradient-indigo text-white font-black text-3xl uppercase tracking-tighter italic shadow-2xl shadow-indigo/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-20"
                   >
                      Complete Neural Sync <ArrowRight size={32} />
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <div className="mt-16 flex flex-col lg:flex-row items-center justify-center gap-12 opacity-30 pointer-events-none">
           <div className="flex items-center gap-3">
              <Shield size={16} className="text-emerald" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Persistent Node Encryption Active</span>
           </div>
           <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-emerald" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Citizen Data Sovereignty Protocol</span>
           </div>
        </div>
      </motion.div>
    </div>
  )
}
