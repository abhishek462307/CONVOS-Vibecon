'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion'
import {
  Menu, X, ArrowRight, Play, Loader2, ChevronRight, Sparkles,
  MessageSquare, Mic, Globe, Shield, Zap, Bot, ArrowUpRight, Star,
  ShoppingCart, Smartphone, Lock, CreditCard, Send, Check, Sliders,
  DollarSign, Users, BarChart3, TrendingUp, Upload, FileSpreadsheet,
  Package, ChevronDown,
} from 'lucide-react'

const DARK_LOGO = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Blue-and-Black-Minimalist-Brand-Logo-3-1768609870958.png?width=8000&height=8000&resize=contain'


function GradientText({ children, className = '', colors = ['#a855f7', '#ec4899', '#f97316', '#ec4899', '#a855f7'], animationSpeed = 8 }) {
  return (
    <div className={`relative mx-auto flex max-w-fit items-center justify-center font-medium overflow-visible ${className}`}>
      <div className="inline-block bg-clip-text text-transparent animate-gradient" style={{ backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`, backgroundSize: '300% 100%', animationDuration: `${animationSpeed}s` }}>
        {children}
      </div>
    </div>
  )
}

function ScrollFloat({ children, className = '', containerClassName = '', as: Tag = 'h2' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const text = typeof children === 'string' ? children : String(children)
  const words = text.split(' ')
  let ci = 0
  return (
    <div ref={ref} className="overflow-hidden">
      <Tag className={containerClassName || className}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split('').map((char) => {
              const idx = ci++
              return (
                <span key={idx} className="inline-block" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(60px)', transition: `opacity 0.35s ease ${idx * 20}ms, transform 0.35s ease ${idx * 20}ms` }}>
                  {char}
                </span>
              )
            })}
            {wi < words.length - 1 && (
              <span className="inline-block" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(60px)', transition: `opacity 0.35s ease ${ci++ * 20}ms, transform 0.35s ease ${(ci - 1) * 20}ms` }}>&nbsp;</span>
            )}
          </span>
        ))}
      </Tag>
    </div>
  )
}

function CountUp({ from = 0, to, duration = 2, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const mv = useMotionValue(from)
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 })
  const [display, setDisplay] = useState(`${prefix}${from.toFixed(decimals)}${suffix}`)
  useEffect(() => { if (inView) mv.set(to) }, [inView, mv, to])
  useEffect(() => {
    return spring.on('change', v => {
      const fixed = v.toFixed(decimals)
      const [whole, dec] = fixed.split('.')
      const fmt = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      setDisplay(`${prefix}${dec !== undefined ? `${fmt}.${dec}` : fmt}${suffix}`)
    })
  }, [spring, prefix, suffix, decimals])
  return <motion.span ref={ref}>{display}</motion.span>
}

function SpotlightCard({ children, className = '', spotlightColor = 'rgba(168,85,247,0.15)' }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [op, setOp] = useState(0)
  return (
    <div ref={ref} onMouseMove={e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }) }} onMouseEnter={() => setOp(1)} onMouseLeave={() => setOp(0)} className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute -inset-px transition duration-300" style={{ opacity: op, background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 40%)` }} />
      {children}
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 } }),
}

const rotatingWords = ['sell', 'talk', 'negotiate', 'convert']

const techStack = [
  { name: 'Next.js', src: '/logos/nextjs-logotype-dark-background.svg', h: 22 },
  { name: 'Supabase', src: '/logos/supabase-logo-wordmark--dark.png', h: 24 },
  { name: 'Tailwind CSS', src: '/logos/tailwindcss-logotype-white.svg', h: 18 },
  { name: 'Stripe', src: '/logos/Stripe wordmark - White - Large.png', h: 32 },
  { name: 'OpenAI', src: '/logos/openai-combined.svg', h: 26 },
]

const testimonials = [
  { name: 'Early Adopter', role: 'DTC Brand Founder', content: "Switching to conversational commerce completely changed how our customers shop. The AI agents handle product questions and recommendations around the clock.", initials: 'EA' },
  { name: 'Beta Merchant', role: 'Online Store Owner', content: "Voice shopping feels like the future. Customers can just talk to the store instead of scrolling through pages — it's a much more natural experience.", initials: 'BM' },
  { name: 'Launch Partner', role: 'E-commerce Operator', content: "Having AI handle the first line of customer conversations frees us up to focus on product and growth. The support load dropped significantly.", initials: 'LP' },
  { name: 'Preview User', role: 'Brand Manager', content: "The real-time intent stream gives us insight into what customers are actually looking for. That kind of visibility is hard to get anywhere else.", initials: 'PU' },
]

const fallbackPlans = [
  { plan: 'Free', label: 'Get started for free', price: '0', features: ['10 products', '50 orders/month', 'Basic analytics', 'Email support', '1 team member'], ctaText: 'Get Started Free', ctaHref: '/login', footerText: 'No credit card required' },
  { plan: 'Starter', label: 'For growing businesses', price: '29', period: '/mo', features: ['100 products', '500 orders/month', 'Custom domain', 'Advanced analytics', '3 team members', 'Priority support'], ctaText: 'Start Free Trial', ctaHref: '/login' },
  { plan: 'Pro', label: 'For scaling brands', price: '79', period: '/mo', isFeatured: true, features: ['Unlimited products', '2000 orders/month', 'AI chat assistant', 'Abandoned cart recovery', '10 team members', 'API access', 'White-label'], ctaText: 'Start Free Trial', ctaHref: '/login', footerText: '14-day free trial included' },
  { plan: 'Enterprise', label: 'Custom solutions', price: 'Custom', features: ['Everything in Pro', 'Unlimited orders', 'Unlimited team', 'Dedicated support', 'SLA guarantee', 'Custom integrations'], ctaText: 'Contact Sales', ctaHref: '/login', footerText: 'Tailored to your business' },
]

const faqData = [
  { question: 'How is Convos different from Shopify?', answer: "Shopify gives you a static storefront. Convos gives you an agentic one — AI agents actively engage customers, negotiate prices, recommend products, and close sales. It's not a plugin; it's a full commerce platform built for the AI era." },
  { question: 'Can I migrate my existing Shopify or WooCommerce store?', answer: 'Yes. Import your product catalog from Shopify, WooCommerce, or via CSV in minutes. Your AI agents will index everything and be ready to sell immediately.' },
  { question: 'How do the AI agents handle pricing and discounts?', answer: 'You set pricing rules, minimum margins, and negotiation limits. AI agents work within your boundaries to autonomously negotiate with customers, maximizing both conversion and profit.' },
  { question: 'How does voice shopping work?', answer: 'Customers can speak naturally to browse products, ask questions, and make purchases. Our real-time voice AI processes speech instantly and responds conversationally — no typing needed.' },
  { question: 'Is there a free plan available?', answer: "Yes! Our Starter plan is free forever with up to 100 AI conversations per month and one storefront agent. Upgrade to Pro when you need more agents and advanced features like autonomous pricing." },
]

function NavLogo() {
  return (
    <Link href="/" className="flex items-center shrink-0">
      <img src={DARK_LOGO} alt="Convos" style={{ height: 28, width: 'auto', maxWidth: 110, objectFit: 'contain', display: 'block' }} />
    </Link>
  )
}

function NavLinks({ links, onClick }) {
  return (
    <>
      {links.map(item => (
        <Link key={item.label} href={item.href} onClick={onClick}
          className="text-white/70 px-3 py-1.5 transition-colors hover:text-white text-sm font-medium">
          {item.label}
        </Link>
      ))}
    </>
  )
}

function NavCta({ onClose }) {
  return (
    <>
      <Link href="/merchant/login" onClick={onClose}
        className="text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5">
        Log in
      </Link>
      <Link href="/merchant/login" onClick={onClose}
        className="px-4 py-2 text-sm font-bold rounded-full text-white bg-gradient-purple hover:-translate-y-0.5 transition duration-200">
        Get Started
      </Link>
    </>
  )
}

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ]
  return (
    <nav className="w-full fixed top-4 inset-x-0 z-50 px-4">
      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-3 items-center py-2 mx-auto px-6 rounded-full backdrop-saturate-[1.8] backdrop-blur-lg bg-black/60 border border-white/10 max-w-5xl">
        <NavLogo />
        <div className="flex items-center justify-center gap-1">
          <NavLinks links={links} />
        </div>
        <div className="flex items-center justify-end gap-3">
          <NavCta />
        </div>
      </div>
      {/* Mobile */}
      <div className="flex relative flex-col lg:hidden w-full max-w-[95%] mx-auto z-50 backdrop-blur-lg backdrop-saturate-[1.8] border border-white/10 bg-black/40 rounded-2xl px-4 py-2">
        <div className="flex flex-row justify-between items-center w-full h-11">
          <NavLogo />
          <button className="p-2" onClick={() => setMobileOpen(p => !p)}>
            {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="flex flex-col py-3 gap-1 border-t border-white/[0.06] mt-2">
            <NavLinks links={links} onClick={() => setMobileOpen(false)} />
            <div className="flex gap-3 pt-3 mt-1 border-t border-white/[0.06]">
              <Link href="/merchant/login" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 text-sm text-white/60 border border-white/10 rounded-full">
                Log in
              </Link>
              <Link href="/merchant/login" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 text-sm font-bold text-white bg-gradient-purple rounded-full">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function HeroSection() {
  const [loadingDemo, setLoadingDemo] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setWordIndex(p => (p + 1) % rotatingWords.length), 2200)
    return () => clearInterval(t)
  }, [])
  const handleViewDemo = () => {
    setLoadingDemo(true)
    window.open('/store', '_blank')
    setTimeout(() => setLoadingDemo(false), 1000)
  }
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-4 sm:pt-20 md:px-8 md:pt-40 md:pb-0 bg-background">
      <div className="absolute inset-0 z-0 bg-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] md:w-[900px] h-[300px] sm:h-[400px] md:h-[700px] opacity-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.35) 0%, rgba(236,72,153,0.2) 35%, rgba(192,38,211,0.1) 55%, transparent 75%)', filter: 'blur(80px)' }} />
      <div className="bg-grid-pattern absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      <div className="relative z-20 flex flex-col items-center text-center">
        <Link href="#features" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/[0.08] text-[13px] text-white/80 hover:bg-purple-500/[0.14] hover:border-purple-500/50 transition-all mb-6 md:mb-8 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <span className="flex h-5 items-center gap-1 px-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] font-bold text-white tracking-wide uppercase"><Sparkles className="h-2.5 w-2.5" />New</span>
          <span className="font-semibold text-white">Convos 2.0 is live</span>
          <span className="text-white/40">—</span>
          <span className="text-purple-300/80 text-[12px]">See what&apos;s new</span>
          <ChevronRight className="h-3.5 w-3.5 text-purple-400/60" />
        </Link>
        <GradientText colors={['#a855f7', '#ec4899', '#f97316', '#ec4899', '#a855f7']} animationSpeed={6} className="text-[2rem] sm:text-[2.75rem] md:text-8xl lg:text-[6.5rem] font-bold tracking-tight leading-none mb-2 md:mb-4 pb-2">
          <em>Agentic Commerce</em>
        </GradientText>
        <h1 className="text-balance max-w-4xl text-[1.75rem] sm:text-[2rem] md:text-7xl lg:text-[5rem] font-semibold tracking-tight leading-[1.1]">
          <span className="text-white">AI Agents</span>{' '}
          <span className="inline-block relative h-[1.15em] overflow-hidden align-bottom">
            <AnimatePresence mode="wait">
              <motion.span key={rotatingWords[wordIndex]} initial={{ y: '100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                {rotatingWords[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>
        <p className="relative z-20 mx-auto mt-4 md:mt-6 max-w-xl px-1 text-center text-sm md:text-lg text-[#737373] font-normal leading-relaxed">
          Convos is a conversational commerce platform where AI agents power your entire storefront. They talk to customers, negotiate deals, and close sales — all without you lifting a finger.
        </p>
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href="/merchant/login" className="relative w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 bg-gradient-purple">
            Get early access <ArrowRight className="h-4 w-4" />
          </Link>
          <button onClick={handleViewDemo} disabled={loadingDemo} className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-medium text-white/80 border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2">
            {loadingDemo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Live demo
          </button>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="relative z-20 mx-auto mt-6 md:mt-16 w-full max-w-7xl px-0 md:px-4 mb-2 md:mb-8">
        <div className="relative p-1.5 md:p-3 rounded-[20px] md:rounded-[40px] backdrop-blur-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 0 80px rgba(255,255,255,0.03), 0 0 160px rgba(0,0,0,0.5)' }}>
          <div className="relative rounded-[16px] md:rounded-[32px] overflow-hidden bg-[#0a0a0a] border border-[#1f1f1f] aspect-video flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/10" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-purple flex items-center justify-center mx-auto mb-4 glow-purple">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <p className="text-white/40 text-sm">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-30" />
    </section>
  )
}

function LogosSection() {
  const duplicated = [...techStack, ...techStack]
  return (
    <section className="relative w-full py-8 md:py-14 overflow-hidden bg-background border-y border-purple-500/[0.08]">
      <div className="container mx-auto px-4">
        <p className="text-center text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-purple-300/30 mb-5 md:mb-8 font-medium">Built with</p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex items-center gap-12 md:gap-20 animate-marquee w-max">
            {duplicated.map((tech, i) => (
              <div key={i} className="flex items-center opacity-60 hover:opacity-100 transition-opacity shrink-0">
                <img src={tech.src} alt={tech.name} style={{ height: `${tech.h}px`, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesGrid() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto py-16 sm:py-16 md:py-32 px-4 sm:px-4 md:px-8 bg-background">
      <div className="text-center mb-8 sm:mb-12 md:mb-20">
        <ScrollFloat className="text-balance relative z-20 mx-auto mb-4 max-w-4xl text-2xl sm:text-3xl md:text-6xl font-semibold tracking-tight leading-tight text-white">Everything your store needs, agent-first</ScrollFloat>
        <p className="max-w-lg text-sm md:text-base text-center mx-auto mt-4 text-[#737373]">A complete commerce platform where AI agents handle every customer interaction — from browsing to checkout.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 auto-rows-auto lg:auto-rows-[28rem]">
        {[0, 1].map(idx => (
          <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} custom={idx} className={idx === 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {idx === 0 ? (
              <div className="rounded-[20px] sm:rounded-[24px] bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden flex flex-col justify-between p-5 sm:p-6 md:p-8 hover:border-[#2a2a2a] transition-colors duration-500 min-h-[18rem] lg:h-full relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <div className="relative w-[180px] sm:w-[280px] h-[180px] sm:h-[280px]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border border-white/[0.04] animate-[spin_25s_linear_infinite]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full border border-white/[0.06] animate-[spin_18s_linear_infinite_reverse]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500/40 blur-sm" />
                    <div className="absolute top-2 left-1/2 -ml-4 w-8 h-8 sm:w-10 sm:h-10 bg-[#141414] border border-white/[0.08] rounded-xl flex items-center justify-center shadow-lg"><MessageSquare className="text-white/70 w-3.5 h-3.5" /></div>
                    <div className="absolute bottom-6 right-2 w-8 h-8 bg-[#141414] border border-white/[0.08] rounded-xl flex items-center justify-center shadow-lg"><Bot className="text-white/70 w-3.5 h-3.5" /></div>
                    <div className="absolute top-1/2 left-1 -mt-4 w-7 h-7 bg-[#141414] border border-white/[0.08] rounded-lg flex items-center justify-center shadow-lg"><Star className="text-purple-400/70 w-3 h-3" /></div>
                  </div>
                </div>
                <div className="relative z-10 flex items-start">
                  <div className="w-11 h-11 rounded-xl bg-[#141414] border border-white/[0.08] flex items-center justify-center"><MessageSquare className="w-5 h-5 text-white/80" /></div>
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 className="text-xl md:text-[2.25rem] font-medium leading-[1.15] tracking-tight text-white">AI-Powered<br />Conversations</h3>
                  <p className="max-w-[280px] text-[13px] font-normal leading-relaxed mt-3 text-[#737373]">Deploy AI agents that greet customers, answer questions, recommend products, and understand context, preferences, and intent — replacing static product pages.</p>
                  <button className="mt-5 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[13px] font-medium hover:from-purple-400 hover:to-pink-400 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.2)]">Learn More</button>
                </div>
              </div>
            ) : (
              <div className="rounded-[20px] sm:rounded-[24px] bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden flex flex-col p-0 hover:border-[#2a2a2a] transition-colors duration-500 h-full relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                <div className="flex flex-col h-full relative z-10">
                  <div className="p-5 sm:p-6 md:p-8 pb-0">
                    <h3 className="text-xl md:text-[2.25rem] font-medium leading-[1.15] tracking-tight text-white">Voice Shopping<br />Experience</h3>
                    <p className="max-w-md text-[13px] font-normal leading-relaxed mt-3 text-[#737373]">Let customers shop hands-free with built-in voice AI. They speak naturally to browse, compare, and buy — no typing needed.</p>
                  </div>
                  <div className="mt-auto p-5 sm:p-6 pt-4">
                    <div className="relative rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] p-5 overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.25)]"><Mic className="h-4 w-4 text-white" /></div>
                          <div className="absolute -inset-1 rounded-full border border-purple-500/20 animate-[pulse_2s_ease-in-out_infinite]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" /><span className="text-[10px] font-semibold text-purple-400/80 uppercase tracking-[0.15em]">Listening</span></div>
                          <div className="flex gap-[2px] h-5 items-center mt-1">
                            {[6,14,10,18,5,16,12,20,8,15,18,6,15,10,17,13,20,8,12,18].map((h, i) => (
                              <div key={i} className="w-[2px] rounded-full bg-gradient-to-t from-purple-500/30 to-pink-300/80" style={{ height: `${h}px`, animation: `pulse 1.5s ease-in-out ${i*0.08}s infinite alternate` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0"><Mic className="w-2.5 h-2.5 text-white/40" /></div>
                          <div className="bg-white/[0.04] border border-white/[0.05] rounded-2xl rounded-tl-sm px-3.5 py-2"><p className="text-[12px] text-white/60">&quot;Show me running shoes under $120&quot;</p></div>
                        </div>
                        <div className="flex items-start gap-2.5 justify-end">
                          <div className="bg-gradient-to-br from-purple-500/[0.08] to-pink-600/[0.03] border border-purple-500/[0.08] rounded-2xl rounded-tr-sm px-3.5 py-2 max-w-[85%]"><p className="text-[12px] text-white/60">Found 12 options. The Nike Pegasus 41 is trending — $109 with 4.8 stars. Want me to add it?</p></div>
                          <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-500/15 flex items-center justify-center shrink-0"><Bot className="w-2.5 h-2.5 text-purple-400" /></div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center"><Star className="w-2 h-2 text-emerald-400" /></div><span className="text-[10px] text-emerald-400/60">Order confirmed in 12s</span></div>
                        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] font-medium shadow-[0_0_12px_rgba(168,85,247,0.2)]"><ShoppingCart className="w-3 h-3" />Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 auto-rows-auto lg:auto-rows-[28rem] mt-4">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} custom={0} className="lg:col-span-3">
          <div className="rounded-[20px] sm:rounded-[24px] bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden flex flex-col justify-between p-5 sm:p-6 md:p-8 hover:border-[#2a2a2a] transition-colors duration-500 min-h-[18rem] lg:h-full relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
              <div>
                <h3 className="text-xl md:text-[2.25rem] font-medium leading-[1.15] tracking-tight text-white">Intent<br />Analytics</h3>
                <p className="text-[13px] font-normal leading-relaxed mt-3 text-[#737373] max-w-sm">See exactly what customers want in real-time. The platform streams live intent signals so you can optimize products, pricing, and inventory.</p>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/[0.08] border border-emerald-500/15 px-3 py-1.5 rounded-full"><ArrowUpRight className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400 text-[13px] font-semibold">+ 14%</span></div>
            </div>
            <div className="mt-auto">
              <div className="h-[140px] flex items-end gap-[6px]">
                {[{h:25,c:'from-purple-900/60 to-purple-500/40'},{h:35,c:'from-purple-900/60 to-purple-400/50'},{h:30,c:'from-purple-800/60 to-purple-400/50'},{h:45,c:'from-purple-700/60 to-fuchsia-400/50'},{h:40,c:'from-purple-600/50 to-fuchsia-400/50'},{h:55,c:'from-purple-600/50 to-pink-400/50'},{h:50,c:'from-purple-500/50 to-pink-400/50'},{h:65,c:'from-fuchsia-500/50 to-pink-400/50'},{h:60,c:'from-fuchsia-500/50 to-pink-400/50'},{h:75,c:'from-pink-600/50 to-pink-400/50'},{h:70,c:'from-pink-600/50 to-pink-300/50'},{h:85,c:'from-pink-500/50 to-pink-300/60'},{h:80,c:'from-pink-500/50 to-rose-300/60'},{h:92,c:'from-pink-400/50 to-rose-300/60'}].map((bar, i) => (
                  <div key={i} className={`flex-1 bg-gradient-to-t ${bar.c} rounded-t-[3px] hover:opacity-80 transition-all`} style={{ height: `${bar.h}%` }} />
                ))}
              </div>
              <button className="mt-5 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[13px] font-medium hover:from-purple-400 hover:to-pink-400 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.15)]">View Analytics</button>
            </div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} custom={1} className="lg:col-span-2">
          <div className="rounded-[20px] sm:rounded-[24px] bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden flex flex-col justify-between p-5 sm:p-6 md:p-8 hover:border-[#2a2a2a] transition-colors duration-500 min-h-[18rem] lg:h-full relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div>
              <h3 className="text-xl md:text-[2.25rem] font-medium leading-[1.15] tracking-tight text-white">Autonomous<br />Pricing</h3>
              <p className="max-w-[260px] text-[13px] font-normal leading-relaxed mt-3 text-[#737373]">AI agents negotiate within your margins automatically — maximizing both conversion and profit without human intervention.</p>
            </div>
            <div className="mt-auto space-y-4">
              <div className="flex items-end justify-between">
                <div><p className="text-[11px] text-[#555] uppercase tracking-[0.1em] font-medium">Avg. discount</p><p className="text-[1.5rem] md:text-[2rem] font-bold text-white leading-none mt-1">8.2%</p></div>
                <div className="text-right"><p className="text-[11px] text-[#555] uppercase tracking-[0.1em] font-medium">Revenue recovered</p><p className="text-[1.5rem] md:text-[2rem] font-bold text-white leading-none mt-1">$129k</p></div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-white/[0.05] gap-3">
                <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[13px] font-medium hover:from-purple-400 hover:to-pink-400 transition-all">Manage Pricing</button>
                <div className="flex items-center gap-1.5">
                  {['EN.', 'LET'].map(lang => <span key={lang} className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/40 font-medium">{lang}</span>)}
                  <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/40 font-medium">89%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-center mt-16 sm:mt-20 md:mt-28 mb-8 sm:mb-12 md:mb-20">
        <ScrollFloat className="text-balance relative z-20 mx-auto mb-4 max-w-4xl text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-white">Sell where your customers already are</ScrollFloat>
        <p className="max-w-lg text-sm md:text-base text-center mx-auto mt-4 text-[#737373]">WhatsApp, web, voice — one AI agent handles every channel. Customers shop without leaving their favorite app.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 auto-rows-auto lg:auto-rows-[28rem]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} custom={0} className="lg:col-span-3">
          <div className="rounded-[20px] sm:rounded-[24px] bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden flex flex-col p-0 hover:border-[#2a2a2a] transition-colors duration-500 h-full relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            <div className="flex flex-col h-full relative z-10">
              <div className="p-5 sm:p-6 md:p-8 pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <h3 className="text-xl md:text-[2.25rem] font-medium leading-[1.15] tracking-tight text-white">WhatsApp Commerce</h3>
                </div>
                <p className="max-w-md text-[13px] font-normal leading-relaxed text-[#737373]">Your AI agent lives inside WhatsApp. Customers browse products, add to cart, and pay — all without leaving the chat.</p>
              </div>
              <div className="mt-auto p-5 sm:p-6 pt-4">
                <div className="relative rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] p-5 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5"><div className="mt-0.5 w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0"><Smartphone className="w-2.5 h-2.5 text-white/40" /></div><div className="bg-white/[0.04] border border-white/[0.05] rounded-2xl rounded-tl-sm px-3.5 py-2"><p className="text-[12px] text-white/60">&quot;I want a birthday gift under $50&quot;</p></div></div>
                    <div className="flex items-start gap-2.5 justify-end"><div className="bg-gradient-to-br from-emerald-500/[0.08] to-emerald-600/[0.03] border border-emerald-500/[0.08] rounded-2xl rounded-tr-sm px-3.5 py-2 max-w-[85%]"><p className="text-[12px] text-white/60">Here are 3 perfect picks! The Scented Candle Set is our bestseller at $34.</p></div><div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0"><Bot className="w-2.5 h-2.5 text-emerald-400" /></div></div>
                    <div className="flex items-start gap-2.5 justify-end"><div className="flex gap-2"><span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">Add to Cart</span><span className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/50 font-medium">Tell me more</span><span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">Buy Now</span></div></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center"><Star className="w-2 h-2 text-emerald-400" /></div><span className="text-[10px] text-emerald-400/60">Full checkout in WhatsApp</span></div></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} custom={1} className="lg:col-span-2">
          <div className="rounded-[20px] sm:rounded-[24px] bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden flex flex-col justify-between p-5 sm:p-6 md:p-8 hover:border-[#2a2a2a] transition-colors duration-500 min-h-[18rem] lg:h-full relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[#141414] border border-white/[0.08] flex items-center justify-center mb-5"><Lock className="w-5 h-5 text-white/80" /></div>
              <h3 className="text-xl md:text-[2.25rem] font-medium leading-[1.15] tracking-tight text-white">OTP<br />Authentication</h3>
              <p className="max-w-[280px] text-[13px] font-normal leading-relaxed mt-3 text-[#737373]">Customers verify identity via email OTP — sent through your own SMTP. No passwords, no friction, just a code to their inbox.</p>
            </div>
            <div className="relative z-10 mt-auto space-y-3">
              <div className="rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] p-4">
                <div className="flex items-center gap-2 mb-3"><Send className="w-3.5 h-3.5 text-purple-400" /><span className="text-[11px] text-white/50 font-medium">OTP sent to j***n@email.com</span></div>
                <div className="flex gap-2 justify-center">{['4','8','2','9','1','7'].map((d, i) => <div key={i} className="w-9 h-11 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center"><span className="text-lg font-mono font-semibold text-white/80">{d}</span></div>)}</div>
                <div className="mt-3 flex items-center justify-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /></div><span className="text-[10px] text-emerald-400/70">Verified via your SMTP</span></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {[
          { icon: Globe, title: '50+ Languages', desc: 'Your store speaks every language. AI agents respond in any customer\'s native tongue, globally.', tags: ['EN', 'ES', 'FR', 'DE', 'CE', 'JP', 'AR'] },
          { icon: Shield, title: 'Built with Security in Mind', desc: 'Designed with privacy and data protection principles. Payments handled securely through Stripe.', tags: ['Privacy', 'Stripe', 'Encrypted'] },
          { icon: Zap, title: 'Launch in Minutes', desc: 'Migrate from Shopify, WooCommerce, or import a CSV. Your agentic store goes live instantly.', tags: ['Shopify', 'WooCommerce', 'CSV'] },
          { icon: Bot, title: 'ChatGPT MCP Support', desc: 'Connect your store directly to ChatGPT. Manage inventory, orders, and stats through natural language.', tags: ['Model Context Protocol', 'ChatGPT', 'Secure Auth'] },
        ].map((card, i) => (
          <motion.div key={card.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} custom={i}>
            <div className="rounded-[20px] sm:rounded-[24px] bg-[#0A0A0A] border border-[#1F1F1F] p-5 sm:p-7 hover:border-[#2a2a2a] transition-colors duration-500 h-full relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              <div className="w-10 h-10 rounded-xl bg-[#141414] border border-white/[0.08] flex items-center justify-center mb-5"><card.icon className="w-5 h-5 text-[#666]" /></div>
              <h3 className="text-lg font-medium text-white mb-1.5">{card.title}</h3>
              <p className="text-[13px] text-[#737373] leading-relaxed mb-5">{card.desc}</p>
              <div className="flex flex-wrap gap-1.5">{card.tags.map(tag => <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/40 font-medium">{tag}</span>)}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-16 md:py-40 bg-background overflow-hidden">
      <div className="container relative z-10 px-4 sm:px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-20">
          <ScrollFloat className="text-balance relative z-20 mx-auto mb-4 max-w-4xl text-2xl sm:text-3xl md:text-6xl font-semibold tracking-tight leading-tight text-white">Launch your agentic store</ScrollFloat>
          <p className="max-w-lg text-sm md:text-base text-center mx-auto mt-4 text-[#737373]">Three steps to go from zero to a fully autonomous AI-powered storefront.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 auto-rows-auto lg:auto-rows-[30rem]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} custom={0} className="lg:col-span-3">
            <div className="rounded-[20px] sm:rounded-[24px] bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden flex flex-col relative justify-between p-5 sm:p-6 md:p-8 hover:border-[#2a2a2a] transition-colors duration-500 h-full">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-5"><div className="w-11 h-11 rounded-xl bg-[#141414] border border-white/[0.08] flex items-center justify-center"><Upload className="w-5 h-5 text-white/80" /></div><span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/25">Step 01</span></div>
                  <h3 className="text-xl md:text-[2.25rem] font-medium leading-[1.15] tracking-tight text-white">Add Your<br />Products</h3>
                  <p className="max-w-sm text-[13px] font-normal leading-relaxed mt-3 text-[#737373]">Import your catalog from Shopify, WooCommerce, or upload a CSV. AI indexes and structures everything instantly.</p>
                </div>
                <div className="flex items-center gap-1.5 bg-purple-500/[0.08] border border-purple-500/15 px-3 py-1.5 rounded-full"><Zap className="w-3 h-3 text-purple-400" /><span className="text-purple-400 text-[13px] font-semibold">Instant</span></div>
              </div>
              <div className="mt-auto">
                <div className="rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] p-5 relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                  <div className="flex items-center gap-3 mb-4"><div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/15 flex items-center justify-center"><Upload className="w-3.5 h-3.5 text-purple-400" /></div><div><p className="text-[11px] font-semibold text-white/70">Product Import</p><p className="text-[10px] text-[#555]">3 sources connected</p></div></div>
                  <div className="space-y-2.5">
                    {[{ name: 'Shopify', icon: Package, count: '2,847 products', status: 'synced', color: 'purple' }, { name: 'WooCommerce', icon: Globe, count: '1,203 products', status: 'synced', color: 'purple' }, { name: 'catalog_q4.csv', icon: FileSpreadsheet, count: '486 products', status: 'indexing', color: 'pink' }].map((s, i) => (
                      <div key={s.name} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] rounded-xl px-3.5 py-2.5">
                        <div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center"><s.icon className="w-3.5 h-3.5 text-white/40" /></div><div><p className="text-[11px] font-medium text-white/70">{s.name}</p><p className="text-[10px] text-[#555]">{s.count}</p></div></div>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${s.color === 'purple' ? 'bg-purple-500/[0.08]' : 'bg-pink-500/[0.08]'}`}>{s.color === 'purple' ? <Check className="w-2.5 h-2.5 text-purple-400" /> : <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />}<span className={`text-[10px] font-medium ${s.color === 'purple' ? 'text-purple-400/80' : 'text-pink-400/80'}`}>{s.status}</span></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /><span className="text-[10px] text-purple-400/60">4,536 products indexed</span></div><div className="h-1.5 w-32 rounded-full bg-white/[0.04] overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400" style={{ width: '92%' }} /></div></div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} custom={1} className="lg:col-span-2">
            <div className="rounded-[20px] sm:rounded-[24px] bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden flex flex-col relative justify-between p-5 sm:p-6 md:p-8 hover:border-[#2a2a2a] transition-colors duration-500 h-full">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[240px] h-[240px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border border-white/[0.03] animate-[spin_25s_linear_infinite]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full border border-white/[0.05] animate-[spin_18s_linear_infinite_reverse]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-violet-500/40 blur-sm" />
                  <div className="absolute top-0 left-1/2 -ml-4 w-8 h-8 bg-[#141414] border border-white/[0.08] rounded-lg flex items-center justify-center"><Sliders className="w-3.5 h-3.5 text-white/60" /></div>
                  <div className="absolute bottom-6 right-2 w-8 h-8 bg-[#141414] border border-white/[0.08] rounded-lg flex items-center justify-center"><MessageSquare className="w-3.5 h-3.5 text-white/60" /></div>
                  <div className="absolute top-1/2 left-0 -mt-4 w-8 h-8 bg-[#141414] border border-white/[0.08] rounded-lg flex items-center justify-center"><DollarSign className="w-3.5 h-3.5 text-violet-400/70" /></div>
                </div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5"><div className="w-11 h-11 rounded-xl bg-[#141414] border border-white/[0.08] flex items-center justify-center"><Bot className="w-5 h-5 text-white/80" /></div><span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/25">Step 02</span></div>
                <h3 className="text-xl md:text-[2.25rem] font-medium leading-[1.15] tracking-tight text-white">Train Your<br />AI Agent</h3>
                <p className="max-w-[260px] text-[13px] font-normal leading-relaxed mt-3 text-[#737373]">Set your brand voice, pricing rules, negotiation limits, and sales personality. The agent learns your business.</p>
              </div>
              <div className="relative z-10 mt-auto space-y-3">
                {[{ label: 'Brand Voice', value: 'Friendly & Professional', pct: '88%', width: '88%', color: 'from-purple-500 to-pink-500' }, { label: 'Price Flexibility', value: 'Up to 15% discount', pct: '72%', width: '72%', color: 'from-purple-400 to-fuchsia-400' }, { label: 'Negotiation Style', value: 'Balanced', pct: '65%', width: '65%', color: 'from-pink-500 to-rose-400' }].map((item, i) => (
                  <div key={item.label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-3.5 py-2.5">
                    <div className="flex items-center justify-between mb-1.5"><span className="text-[10px] font-medium text-white/50 uppercase tracking-[0.1em]">{item.label}</span><span className="text-[10px] text-white/30">{item.pct}</span></div>
                    <p className="text-[11px] text-white/70 font-medium mb-2">{item.value}</p>
                    <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden"><div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: item.width }} /></div>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 pt-1">{['Tone', 'Rules', 'Limits'].map(tag => <span key={tag} className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/40 font-medium">{tag}</span>)}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} custom={2} className="mt-4 rounded-[20px] sm:rounded-[24px] bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden relative hover:border-[#2a2a2a] transition-colors duration-500">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-6 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5"><div className="w-11 h-11 rounded-xl bg-[#141414] border border-white/[0.08] flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white/80" /></div><span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/25">Step 03</span></div>
                <h3 className="text-xl md:text-[2.25rem] font-medium leading-[1.15] tracking-tight text-white">Go Live &<br />Scale Autonomously</h3>
                <p className="max-w-md text-[13px] font-normal leading-relaxed mt-3 text-[#737373]">Your store goes live with AI agents handling every customer. Monitor real-time analytics and watch revenue grow without lifting a finger.</p>
              </div>
              <div className="mt-6 md:mt-8 grid grid-cols-2 gap-2">
                {[{ label: 'Conversion Rate', value: 12.4, suffix: '%', change: '+3.2%', icon: ArrowUpRight, decimals: 1 }, { label: 'Avg. Order Value', value: 87.5, prefix: '$', suffix: '', change: '+$12', icon: DollarSign, decimals: 2 }, { label: 'AI Sessions', value: 14289, suffix: '', change: '+28%', icon: Users, decimals: 0 }, { label: 'Revenue', value: 182, prefix: '$', suffix: 'k', change: '+41%', icon: BarChart3, decimals: 0 }].map(stat => (
                  <div key={stat.label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3">
                    <div className="flex items-center justify-between mb-2"><span className="text-[10px] font-medium text-white/40 uppercase tracking-[0.1em]">{stat.label}</span><stat.icon className="w-3 h-3 text-white/20" /></div>
                    <p className="text-lg md:text-xl font-bold text-white leading-none"><CountUp from={0} to={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix} decimals={stat.decimals} duration={2.5} /></p>
                    <div className="flex items-center gap-1 mt-1.5"><ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" /><span className="text-[10px] font-semibold text-emerald-400">{stat.change}</span></div>
                  </div>
                ))}
              </div>
              <button className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[13px] font-medium hover:from-purple-400 hover:to-pink-400 transition-all w-fit">Launch Your Store</button>
            </div>
            <div className="p-6 md:p-8 lg:border-l border-t lg:border-t-0 border-[#1a1a1a] flex flex-col justify-center">
              <div className="rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] p-5 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                <div className="flex items-center justify-between mb-5"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /><span className="text-[10px] font-semibold text-purple-400/80 uppercase tracking-[0.15em]">Live Dashboard</span></div><span className="text-[10px] text-[#555]">Last 30 days</span></div>
                <div className="h-[120px] sm:h-[160px] flex items-end gap-[3px] sm:gap-[5px] mb-4">
                  {[{h:18,c:'from-purple-900/60 to-purple-500/40'},{h:28,c:'from-purple-900/60 to-purple-400/50'},{h:22,c:'from-purple-800/60 to-purple-400/50'},{h:38,c:'from-purple-700/60 to-fuchsia-400/50'},{h:32,c:'from-purple-600/50 to-fuchsia-400/50'},{h:48,c:'from-purple-600/50 to-pink-400/50'},{h:42,c:'from-purple-500/50 to-pink-400/50'},{h:55,c:'from-fuchsia-500/50 to-pink-400/50'},{h:50,c:'from-fuchsia-500/50 to-pink-400/50'},{h:62,c:'from-pink-600/50 to-pink-400/50'},{h:58,c:'from-pink-600/50 to-pink-300/50'},{h:72,c:'from-pink-500/50 to-pink-300/60'},{h:68,c:'from-pink-500/50 to-rose-300/60'},{h:78,c:'from-pink-400/50 to-rose-300/60'},{h:85,c:'from-pink-400/50 to-rose-300/60'},{h:92,c:'from-pink-400/60 to-rose-300/70'}].map((bar, i) => (
                    <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${bar.h}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.05 }} className={`flex-1 bg-gradient-to-t ${bar.c} rounded-t-[3px]`} />
                  ))}
                </div>
                <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400" /><span className="text-[10px] text-white/40">Sessions</span></div><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400" /><span className="text-[10px] text-white/40">Revenue</span></div></div><div className="flex items-center gap-1 bg-purple-500/[0.08] px-2 py-1 rounded-md"><ArrowUpRight className="w-2.5 h-2.5 text-purple-400" /><span className="text-[10px] font-semibold text-purple-400">+41%</span></div></div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {[{ label: 'Uptime', value: '99.9%' }, { label: 'Avg Response', value: '0.8s' }, { label: 'CSAT Score', value: '4.9/5' }].map(m => (
                  <div key={m.label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-3 py-3 text-center"><p className="text-[10px] text-[#555] uppercase tracking-[0.1em] font-medium mb-1">{m.label}</p><p className="text-sm font-bold text-white">{m.value}</p></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="relative w-full bg-background py-16 sm:py-16 md:py-40 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-15 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.2) 40%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="container relative z-10 px-4 sm:px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 sm:gap-8 lg:gap-16 lg:items-start">
        <div className="lg:sticky lg:top-40 lg:w-1/3 space-y-3 md:space-y-4 text-center lg:text-left">
          <ScrollFloat className="text-3xl md:text-6xl font-semibold tracking-tight leading-[1.1] text-white">What they say about us</ScrollFloat>
          <p className="max-w-md mx-auto lg:mx-0 text-sm md:text-base text-[#737373] leading-relaxed">Early feedback from merchants exploring agentic commerce with Convos.</p>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 md:gap-6">
          <div className="flex flex-col gap-4 sm:gap-4 md:gap-6">
            {[testimonials[0], testimonials[2]].map((t, i) => (
              <div key={i} className="p-4 sm:p-6 bg-[#0a0a0a] rounded-2xl border border-white/10 flex flex-col gap-3 sm:gap-4 group hover:border-white/20 transition-colors">
                <div className="flex gap-0.5 mb-1">{[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-purple-400 text-purple-400" />)}</div>
                <p className="text-[#737373] text-[13px] sm:text-sm leading-relaxed">&quot;{t.content}&quot;</p>
                <div className="flex items-center gap-3 mt-auto"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/15 flex items-center justify-center text-[11px] font-bold text-white/60">{t.initials}</div><div><h3 className="text-white font-medium text-sm">{t.name}</h3><p className="text-[#737373] text-xs">{t.role}</p></div></div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:gap-4 md:gap-6 sm:translate-y-0 lg:translate-y-12">
            {[testimonials[1], testimonials[3]].map((t, i) => (
              <div key={i} className="p-4 sm:p-6 bg-[#0a0a0a] rounded-2xl border border-white/10 flex flex-col gap-3 sm:gap-4 group hover:border-white/20 transition-colors">
                <div className="flex gap-0.5 mb-1">{[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-purple-400 text-purple-400" />)}</div>
                <p className="text-[#737373] text-[13px] sm:text-sm leading-relaxed">&quot;{t.content}&quot;</p>
                <div className="flex items-center gap-3 mt-auto"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/15 flex items-center justify-center text-[11px] font-bold text-white/60">{t.initials}</div><div><h3 className="text-white font-medium text-sm">{t.name}</h3><p className="text-[#737373] text-xs">{t.role}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="relative py-16 sm:py-16 md:py-40 bg-background overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.15) 40%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="container relative z-10 px-4 sm:px-4">
        <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12 md:mb-20">
          <ScrollFloat containerClassName="text-3xl md:text-[3rem] font-semibold tracking-tight mb-4 md:mb-6 text-white">Choose Your Plan</ScrollFloat>
          <p className="text-base text-[#737373] max-w-xl mx-auto">Start free and scale as your agentic store grows. No hidden fees, no transaction cuts.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto items-stretch">
          {fallbackPlans.map((plan, index) => (
            <SpotlightCard key={index} className={`relative flex flex-col p-3 sm:p-5 md:p-7 rounded-[16px] sm:rounded-[24px] md:rounded-[32px] bg-[#0A0A0A] border transition-all duration-300 hover:border-[#3B3B3B] ${plan.isFeatured ? 'lg:scale-105 z-10 border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.1)]' : 'border-[#1F1F1F]'}`} spotlightColor={plan.isFeatured ? 'rgba(168,85,247,0.25)' : 'rgba(168,85,247,0.12)'}>
              {plan.isFeatured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-white uppercase z-20">Most Popular</div>}
              <div className="flex flex-col mb-3 sm:mb-6">
                <div className="bg-[#171717] border border-purple-500/15 rounded-md px-2 py-1 w-fit text-[11px] sm:text-[12px] font-medium text-white mb-2 sm:mb-5">{plan.plan}</div>
                <p className="text-xs sm:text-sm font-medium text-[#737373] mb-2 sm:mb-4">{plan.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] sm:text-[32px] md:text-[48px] font-semibold text-white tracking-tighter leading-none">{plan.price === 'Custom' ? '' : '$'}{plan.price}</span>
                  {plan.period && <span className="text-sm text-[#737373]">{plan.period}</span>}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-7">
                {plan.features.map((f, i) => <div key={i} className="flex items-center gap-2 sm:gap-3"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" /><span className="text-xs sm:text-sm text-neutral-300">{f}</span></div>)}
              </div>
              <Link href="/merchant/login" className="w-full h-10 sm:h-12 rounded-full relative overflow-hidden flex items-center justify-center transition-transform hover:-translate-y-0.5 active:scale-95 duration-200 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                <span className="relative z-10 text-xs sm:text-sm font-bold text-white">{plan.ctaText}</span>
              </Link>
              {plan.footerText && <p className="text-center text-[12px] text-[#737373] mt-4">{plan.footerText}</p>}
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <section className="relative w-full py-16 md:py-40 bg-background overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.2) 40%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="container relative z-10 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-10 md:mb-20">
          <ScrollFloat containerClassName="text-3xl md:text-6xl mb-4 md:mb-6 font-semibold tracking-tight text-white">Frequently Asked Questions</ScrollFloat>
          <p className="max-w-2xl mx-auto text-[#737373] text-sm md:text-lg">Everything you need to know about Convos — the agentic commerce platform.</p>
        </div>
        <div className="w-full max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <div key={index} className="border-b border-purple-500/10 last:border-0">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between py-5 md:py-6 text-left group">
                <span className="text-sm md:text-xl font-medium text-white group-hover:text-neutral-300 transition-colors pr-4">{item.question}</span>
                <ChevronDown className={`w-5 h-5 text-purple-400/60 transition-transform duration-300 shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-52 pb-6' : 'max-h-0'}`}>
                <div className="text-neutral-500 text-sm md:text-base leading-relaxed pr-4 md:pr-8">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaFinal() {
  const [loadingDemo, setLoadingDemo] = useState(false)
  const handleViewDemo = () => {
    setLoadingDemo(true)
    window.open('/store', '_blank')
    setTimeout(() => setLoadingDemo(false), 1000)
  }
  return (
    <section className="relative w-full bg-background py-16 sm:py-16 md:py-40 overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(107,33,168,0.15) 0%, transparent 70%)' }} />
      </div>
      <div className="container relative z-10 flex flex-col items-center text-center">
        <ScrollFloat containerClassName="text-2xl sm:text-3xl md:text-7xl font-semibold tracking-tight leading-[1.1] text-white mb-4 md:mb-6 max-w-4xl px-3 sm:px-4">Your store deserves an AI upgrade</ScrollFloat>
        <p className="mx-auto mt-3 sm:mt-4 max-w-xl px-3 sm:px-4 text-center text-sm sm:text-base md:text-lg text-[#737373] font-normal leading-relaxed">We pre-launched the most powerful agentic commerce platform ever built. Be among the first to experience it.</p>
        <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto sm:max-w-none sm:w-auto px-3 sm:px-0">
          <Link href="/merchant/login" className="relative w-full sm:w-auto px-8 py-3 rounded-full text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500">
            Start free trial <ArrowRight className="h-4 w-4" />
          </Link>
          <button onClick={handleViewDemo} disabled={loadingDemo} className="w-full sm:w-auto px-8 py-3 rounded-full text-sm font-medium text-white/80 border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2">
            {loadingDemo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            View demo
          </button>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5 text-[13px] text-white/30">
          {['No credit card required', '14-day free trial', 'Cancel anytime'].map(item => (
            <div key={item} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400/60" /><span>{item}</span></div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Twitter = () => <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
const Linkedin = () => <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
const Github = () => <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>

function Footer() {
  const footerLinks = [
    { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }] },
    { title: 'Company', links: [{ label: 'Blog', href: '/blog' }] },
    { title: 'Legal', links: [{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }] },
  ]
  return (
    <footer className="w-full bg-background py-12 sm:py-12 md:py-16 px-4 sm:px-4 md:px-12">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent mb-10 md:mb-16 max-w-7xl mx-auto" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 sm:gap-12">
        <div className="flex flex-col gap-6 w-full md:w-auto">
          <Link href="/" className="flex items-center shrink-0">
            <img src={DARK_LOGO} alt="Convos" style={{ height: 28, width: 'auto', maxWidth: 110, objectFit: 'contain', display: 'block' }} />
          </Link>
          <p className="text-[13px] text-white/30 max-w-[280px] leading-relaxed">Agentic commerce. AI agents run your store.</p>
          <div className="flex gap-3">
            {[Twitter, Linkedin, Github].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 border border-purple-500/10 text-neutral-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-200"><Icon /></a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 md:gap-x-12 gap-y-8 md:gap-y-10 w-full md:w-auto lg:gap-x-20">
          {footerLinks.map(cat => (
            <div key={cat.title} className="flex flex-col gap-4">
              <h4 className="text-white text-sm font-semibold tracking-wide">{cat.title}</h4>
              <ul className="flex flex-col gap-3">{cat.links.map(link => <li key={link.label}><Link href={link.href} className="text-neutral-500 hover:text-white text-sm transition-colors duration-200">{link.label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full mt-12 md:mt-20"><p className="text-[11px] text-neutral-700 tracking-widest uppercase text-center">&copy; 2026 Convos. All rights reserved.</p></div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <Navigation />
      <main>
        <HeroSection />
        <LogosSection />
        <FeaturesGrid />
        <HowItWorks />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  )
}
