'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, ArrowRight, Eye, EyeOff, ShoppingBag, Sparkles } from 'lucide-react'

function ConvosLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="url(#cl-g)"/>
      <defs><linearGradient id="cl-g" x1="8" y1="2" x2="24" y2="28"><stop stopColor="#a855f7"/><stop offset="0.6" stopColor="#ec4899"/><stop offset="1" stopColor="#f97316"/></linearGradient></defs>
    </svg>
  )
}

export default function CustomerLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type: 'customer' })
      })
      const data = await res.json()
      if (data.success) { 
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/'
      }
      else setError(data.message || 'Invalid email or password')
    } catch { setError('Something went wrong. Try again.') } finally { setLoading(false) }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: signupEmail, password: signupPassword, type: 'customer' })
      })
      const data = await res.json()
      if (data.success) { 
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/'
      }
      else setError(data.message || 'Could not create account')
    } catch { setError('Something went wrong. Try again.') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-purple-500/8 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Back to store */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-5 left-5 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        ← Back to store
      </button>

      <div className="w-full max-w-[400px] relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <ConvosLogo size={32} />
            <span className="text-2xl font-semibold tracking-tight">Convos</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
            <ShoppingBag className="w-3 h-3" /> Customer Portal
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 rounded-2xl border border-border/70 bg-secondary/30 p-1.5 mb-6">
          {['login', 'signup'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold tracking-tight transition-all ${
                mode === m
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-sm">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                  autoComplete="off"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      suppressHydrationWarning
                      className="h-11 rounded-2xl border-border/70 bg-secondary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        suppressHydrationWarning
                        className="h-11 rounded-2xl border-border/70 bg-secondary/20 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-2xl bg-foreground hover:opacity-80 text-background font-semibold tracking-tight border-0"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                  </Button>
                  <div className="rounded-[16px] border border-border/70 bg-secondary/20 px-4 py-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Demo:</span> customer@demo.com / password123
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleSignup}
                  className="space-y-4"
                  autoComplete="off"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">Full Name</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Jane Smith"
                      required
                      autoComplete="name"
                      suppressHydrationWarning
                      className="h-11 rounded-2xl border-border/70 bg-secondary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">Email</label>
                    <Input
                      type="email"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      suppressHydrationWarning
                      className="h-11 rounded-2xl border-border/70 bg-secondary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        suppressHydrationWarning
                        className="h-11 rounded-2xl border-border/70 bg-secondary/20 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-2xl bg-foreground hover:opacity-80 text-background font-semibold tracking-tight border-0"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer inside card */}
          <div className="border-t border-border/70 bg-secondary/20 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 font-medium"
            >
              Continue as guest <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => router.push('/merchant/login')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 font-medium"
            >
              <Sparkles className="w-3 h-3" /> Merchant login
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/50 mt-6">
          Powered by Convos Agentic Commerce
        </p>
      </div>
    </div>
  )
}
