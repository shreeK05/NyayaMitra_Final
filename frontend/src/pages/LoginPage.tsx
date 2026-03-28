import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ArrowRight, ShieldCheck, ChevronLeft, Loader2, Scale, Lock } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useNavigate } from 'react-router-dom'
import { sendOtp, verifyOtp } from '@/utils/api'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
]

// Demo OTP for local development — real Twilio/SMS integration for production
const DEMO_OTP = '123456'

type Step = 'phone' | 'otp' | 'profile'

export default function LoginPage() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [name, setName] = useState('')
  const [state, setState] = useState('Maharashtra')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const { setUser } = useAppStore()
  const navigate = useNavigate()

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  const handleSendOtp = async () => {
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    setLoading(true)
    setError('')
    try {
      await sendOtp(phone)
      setStep('otp')
      setCountdown(30)
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
    e.preventDefault()
  }

  const handleVerifyOtp = async () => {
    // If it's just OTP checking, wait until user enters Name/State.
    // We will verify the OTP along with profile data in handleComplete to create the user in the DB.
    // Or we can verify OTP here and let backend just create a user with default state, then update it.
    const entered = otp.join('')
    if (entered.length !== 6) { setError('Please enter the 6-digit OTP'); return }
    setLoading(true)
    setError('')
    try {
      const res: any = await verifyOtp({ phone_number: phone, otp: entered })
      if (res.access_token) {
        // We defer full login state until they provide name/state, but we know OTP is valid.
        setStep('profile')
      }
    } catch (err: any) {
      setError('Invalid OTP. Use 123456 for demo.')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!name.trim()) { setError('Please enter your name'); return }
    setLoading(true)
    try {
      // Re-verify with profile details to update DB
      const res: any = await verifyOtp({ phone_number: phone, otp: otp.join(''), name: name.trim(), state })
      setUser({ phone: '+91' + phone, name: res.user.name, state: res.user.state, isLoggedIn: true, id: res.user.id })
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden bg-[#080c1f]">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.4) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)' }} />
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div key={i}
            className="absolute w-1 h-1 rounded-full bg-orange-400/30"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm mx-auto px-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary glow-saffron mb-4"
          >
            <Scale size={28} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-black text-white tracking-tight">NyayaMitra</h1>
          <p className="text-slate-400 text-sm mt-1">AI Legal Justice for Every Indian</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl overflow-hidden"
          style={{ background: 'rgba(15,22,40,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,153,51,0.15)' }}>
          
          {/* Progress bar */}
          <div className="h-1 w-full bg-slate-800">
            <motion.div
              className="h-full gradient-primary"
              animate={{ width: step === 'phone' ? '33%' : step === 'otp' ? '66%' : '100%' }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">

              {/* Step 1: Phone */}
              {step === 'phone' && (
                <motion.div key="phone"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Enter Mobile Number</h2>
                    <p className="text-slate-400 text-sm">We'll send a verification code via SMS</p>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <div className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-bold text-white"
                      style={{ background: 'rgba(255,153,51,0.12)', border: '1px solid rgba(255,153,51,0.25)' }}>
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                      placeholder="10-digit mobile number"
                      className="flex-1 px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs mb-4 flex items-center gap-1">
                      <span>⚠️</span> {error}
                    </p>
                  )}

                  <div className="text-xs text-slate-500 mb-5 flex items-center gap-1.5">
                    <Lock size={10} />
                    <span>Demo OTP: <strong className="text-orange-400">123456</strong> — No SMS needed for local testing</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSendOtp}
                    disabled={loading || phone.length !== 10}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #ff9933, #f59e0b)' }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                      <><Phone size={16} /> Send OTP <ArrowRight size={16} /></>
                    )}
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && (
                <motion.div key="otp"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                >
                  <button onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError('') }}
                    className="flex items-center gap-1 text-slate-400 text-xs mb-5 hover:text-white transition-colors">
                    <ChevronLeft size={14} /> Change Number
                  </button>

                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Verify OTP</h2>
                    <p className="text-slate-400 text-sm">Sent to +91 {phone}</p>
                    <p className="text-orange-400 text-xs mt-1 font-semibold">Demo: Enter 123456</p>
                  </div>

                  {/* OTP Inputs */}
                  <div className="flex gap-2 mb-5 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-11 h-13 text-center text-xl font-bold text-white rounded-xl outline-none transition-all"
                        style={{
                          background: digit ? 'rgba(255,153,51,0.2)' : 'rgba(255,255,255,0.05)',
                          border: digit ? '1.5px solid rgba(255,153,51,0.6)' : '1.5px solid rgba(255,255,255,0.1)',
                          height: '52px'
                        }}
                      />
                    ))}
                  </div>

                  {error && <p className="text-red-400 text-xs mb-4 text-center">⚠️ {error}</p>}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #ff9933, #f59e0b)' }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                      <><ShieldCheck size={16} /> Verify OTP</>
                    )}
                  </motion.button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-slate-500 text-xs">Resend in {countdown}s</p>
                    ) : (
                      <button onClick={handleSendOtp} className="text-orange-400 text-xs hover:text-orange-300 transition-colors">
                        Resend OTP
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Profile */}
              {step === 'profile' && (
                <motion.div key="profile"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                      style={{ background: 'rgba(16,185,129,0.2)', border: '1.5px solid rgba(16,185,129,0.5)' }}>
                      <ShieldCheck size={20} className="text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">Almost Done!</h2>
                    <p className="text-slate-400 text-sm">Tell us a bit about yourself</p>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError('') }}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Your State</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none appearance-none"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {INDIAN_STATES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs mb-4">⚠️ {error}</p>}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleComplete}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #ff9933, #f59e0b)' }}
                  >
                    Start Using NyayaMitra <ArrowRight size={16} />
                  </motion.button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Legal disclaimer */}
        <p className="text-center text-slate-600 text-[11px] mt-6 px-4 leading-relaxed">
          By continuing, you agree to our Terms of Service. Your data is encrypted & DPDP compliant.
        </p>
      </motion.div>
    </div>
  )
}
