'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Loader2, ArrowRight, Sparkles, BarChart3, Zap, Shield, Globe,
  TrendingUp, Bot, Eye, EyeOff
} from 'lucide-react'

function ConvosLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="url(#ml-g)"/>
      <defs><linearGradient id="ml-g" x1="8" y1="2" x2="24" y2="28"><stop stopColor="#a855f7"/><stop offset="0.6" stopColor="#ec4899"/><stop offset="1" stopColor="#f97316"/></linearGradient></defs>
    </svg>
  )
}

const FEATURES = [
  { icon: Bot, label: 'Agentic AI', desc: 'AI that negotiates, closes, and re-engages autonomously' },
  { icon: TrendingUp, label: 'Revenue Intel', desc: 'Real-time conversion metrics and margin analytics' },
  { icon: Shield, label: 'Trust Matrix', desc: 'Platform-wide consumer trust scoring and fraud prevention' },
  { icon: Zap, label: 'Intent Stream', desc: 'Live feed of every buyer mission and AI action' },
]

const STATS = [
  { value: '3.2×', label: 'Avg. Revenue Lift' },
  { value: '68%', label: 'Autonomous Close Rate' },
  { value: '< 2s', label: 'AI Response Time' },
]

export default function MerchantLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type: 'merchant' })
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/merchant')
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col w-[52%] relative overflow-hidden p-12 xl:p-16">
        {/* Ambient orbs */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-pink-600/15 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 mb-auto">
          <ConvosLogo size={32} />
          <span className="text-white text-xl font-semibold tracking-tight">Convos</span>
          <span className="ml-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">Merchant</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 mt-16 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-[11px] font-semibold text-purple-300 mb-6">
            <Sparkles className="w-3 h-3" /> Agentic Commerce Platform
          </div>
          <h1 className="text-[52px] xl:text-[60px] font-semibold tracking-[-0.03em] text-white leading-[1.05] mb-5">
            Commerce that<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              works for you.
            </span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            AI agents that negotiate, convert, and grow your revenue while you focus on what matters.
          </p>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mb-12">
          {STATS.map(s => (
            <div key={s.label} className="rounded-2xl border border-white/8 bg-white/4 p-4 backdrop-blur-sm">
              <p className="text-2xl font-semibold tracking-tight text-white">{s.value}</p>
              <p className="text-[11px] text-white/40 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-3">
          {FEATURES.map(f => (
            <div key={f.label} className="flex items-start gap-3.5 group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 group-hover:border-purple-500/40 group-hover:bg-purple-500/10 transition-all">
                <f.icon className="w-3.5 h-3.5 text-white/60 group-hover:text-purple-300 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80">{f.label}</p>
                <p className="text-xs text-white/35 leading-snug mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        {/* Subtle right-side orb */}
        <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-pink-600/10 blur-[80px] pointer-events-none" />

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-10">
          <ConvosLogo size={28} />
          <span className="text-white text-lg font-semibold tracking-tight">Convos</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-[400px] relative z-10"
        >
          <div className="mb-8">
            <h2 className="text-[28px] font-semibold tracking-tight text-white">Welcome back</h2>
            <p className="text-sm text-white/40 mt-1">Sign in to your merchant dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@yourstore.com"
                required
                className="h-12 rounded-2xl bg-white/6 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50"
                autoComplete="email"
                suppressHydrationWarning
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  suppressHydrationWarning
                  className="h-12 rounded-2xl bg-white/6 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 font-medium"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white font-semibold tracking-tight border-0 mt-2 shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Access Dashboard <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 rounded-2xl border border-white/8 bg-white/4 px-4 py-3.5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30 mb-2">Demo Credentials</p>
            <p className="text-xs text-white/50"><span className="text-white/70 font-medium">Email:</span> merchant@demo.com</p>
            <p className="text-xs text-white/50 mt-0.5"><span className="text-white/70 font-medium">Password:</span> merchant123</p>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-[11px] text-white/25">or</span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          <div className="mt-5 space-y-2.5">
            <button
              onClick={() => router.push('/store')}
              className="w-full h-11 rounded-2xl border border-white/10 bg-white/4 text-sm font-semibold text-white/60 hover:text-white/90 hover:bg-white/8 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" /> View Storefront
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full text-center text-xs text-white/25 hover:text-white/50 transition-colors py-1"
            >
              Not a merchant? Shop as a customer →
            </button>
          </div>
        </motion.div>

        <p className="absolute bottom-6 text-[11px] text-white/20">
          © 2025 Convos · Agentic Commerce
        </p>
      </div>
    </div>
  )
}
