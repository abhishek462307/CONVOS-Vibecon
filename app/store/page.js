'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  ShoppingCart, Send, Search, X, Plus, ArrowRight,
  Trash2, CreditCard, Tag, Sparkles, Bot, Minus,
  TruckIcon, Shield, Package, Zap
} from 'lucide-react'

// ── Coffee Brown Design Tokens ──────────────────────────────
// Espresso  : #4A2512  (darkest — buttons, active states)
// Coffee    : #6B3A2A  (medium — hover, secondary)
// Caramel   : #B8732A  (accent — badges, highlights)
// Latte     : #F5EBE0  (card bg tint, chip bg)
// Cream     : #FAF6F1  (page background)
// Tan       : #E5D0BC  (borders)

const CATEGORIES = [
  { name: 'All', image: null },
  { name: 'Single Origin', image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=200&h=200&fit=crop' },
  { name: 'Blends', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop' },
  { name: 'Espresso', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=200&h=200&fit=crop' },
  { name: 'Decaf', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' },
  { name: 'Equipment', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop' },
]

const QUICK_PROMPTS = [
  "What's your best seller?",
  'I need a gift under $50',
  'Show me espresso blends',
]

// Shared style tokens
const btn_primary = 'bg-[#4A2512] hover:bg-[#6B3A2A] text-white transition-colors shadow-sm'
const btn_outline  = 'border border-[#E5D0BC] bg-white text-[#6B3A2A] hover:border-[#B8732A] hover:bg-[#F5EBE0] hover:text-[#4A2512] transition-all'
const chip_active  = 'bg-[#4A2512] text-white shadow-sm'
const chip_idle    = 'bg-white text-[#6B3A2A] border border-[#E5D0BC] hover:border-[#B8732A] hover:bg-[#F5EBE0] hover:text-[#4A2512]'
const text_primary = 'text-[#4A2512]'
const text_accent  = 'text-[#B8732A]'
const border_tan   = 'border-[#E5D0BC]'
const bg_latte     = 'bg-[#F5EBE0]'
const bg_cream     = 'bg-[#FAF6F1]'

function ProductCard({ product, onAddToCart, onNegotiate }) {
  const [added, setAdded] = useState(false)
  const handleAdd = () => {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const discount = product.compare_at_price > product.price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border ${border_tan} hover:border-[#B8732A] hover:shadow-lg transition-all duration-300`}
      style={{ boxShadow: '0 1px 3px rgba(74,37,18,0.06)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#F5EBE0]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {discount > 0 && (
            <span className="bg-[#B8732A] text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wide uppercase shadow-sm">
              -{discount}%
            </span>
          )}
        </div>
        {product.bargain_enabled && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#4A2512] text-[#F5EBE0] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Zap className="w-2.5 h-2.5" /> AI Price
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] mb-1" style={{ color: '#B8732A' }}>{product.category}</p>
          <h4 className="text-sm font-bold leading-snug" style={{ color: '#1C0A04' }}>{product.name}</h4>
          <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: '#9B7B6B' }}>{product.description}</p>
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg font-extrabold tracking-tight" style={{ color: '#1C0A04' }}>${product.price}</span>
          {product.compare_at_price > product.price && (
            <span className="text-xs line-through" style={{ color: '#C4A898' }}>${product.compare_at_price}</span>
          )}
          {product.weight && <span className="text-[10px] ml-auto" style={{ color: '#C4A898' }}>{product.weight}</span>}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleAdd}
            className={`flex-1 h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${added
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : btn_primary
            }`}
          >
            {added ? <><span>✓</span> Added</> : <><Plus className="w-3 h-3" /> Add to Cart</>}
          </button>
          {product.bargain_enabled && (
            <button
              onClick={() => onNegotiate(product)}
              className={`h-9 w-9 rounded-xl flex items-center justify-center ${btn_outline}`}
              title="Negotiate price with AI"
            >
              <Tag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: '#B8732A' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

function ChatWidget({ messages, isLoading, onSend, onClear, onToggle, storeName, aiName }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) { onSend(input.trim()); setInput('') }
  }

  return (
    <div
      className="w-[360px] flex-shrink-0 flex flex-col h-[calc(100vh-96px)] sticky top-[96px] bg-white"
      style={{ borderLeft: '1px solid #E5D0BC' }}
    >
      {/* Header */}
      <div className="px-4 py-3.5 flex items-center justify-between shrink-0 bg-white" style={{ borderBottom: '1px solid #E5D0BC' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #4A2512, #7C4B2A)' }}>
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold" style={{ color: '#1C0A04' }}>{aiName || 'Convos AI'}</span>
              <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block animate-pulse" /> LIVE
              </span>
            </div>
            <p className="text-[10px]" style={{ color: '#9B7B6B' }}>{storeName || 'Agentic shopping assistant'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClear} className="p-1.5 rounded-lg transition-all" style={{ color: '#C4A898' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6B3A2A'}
            onMouseLeave={e => e.currentTarget.style.color = '#C4A898'}
            title="Clear chat">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onToggle} className="p-1.5 rounded-lg transition-all" style={{ color: '#C4A898' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6B3A2A'}
            onMouseLeave={e => e.currentTarget.style.color = '#C4A898'}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-4" style={{ background: '#FBF7F3' }}>
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user'
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start items-end gap-2'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mb-0.5" style={{ background: 'linear-gradient(135deg, #4A2512, #7C4B2A)' }}>
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                    style={isUser
                      ? { background: '#4A2512', color: '#FBF7F3' }
                      : { background: '#FFFFFF', color: '#3D1F10', border: '1px solid #E5D0BC' }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Product results */}
          {messages.length > 0 && messages[messages.length - 1].products?.length > 0 && (
            <div className="ml-8 flex flex-col gap-2">
              {messages[messages.length - 1].products.map(p => (
                <div
                  key={p.id}
                  className="rounded-xl p-2.5 flex gap-2.5 transition-all hover:shadow-sm"
                  style={{ background: '#FFFFFF', border: '1px solid #E5D0BC' }}
                >
                  <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover shrink-0" style={{ border: '1px solid #E5D0BC' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold truncate" style={{ color: '#1C0A04' }}>{p.name}</p>
                    <p className="text-[11px] font-bold mt-0.5" style={{ color: '#B8732A' }}>${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checkout link */}
          {messages.length > 0 && messages[messages.length - 1].checkout_url && (
            <div className="ml-8">
              <a href={messages[messages.length - 1].checkout_url} target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-bold ${btn_primary}`}>
                <CreditCard className="w-3.5 h-3.5" /> Checkout <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          )}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #4A2512, #7C4B2A)' }}>
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #E5D0BC' }}>
                <TypingDots />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 pt-2 flex gap-1.5 flex-wrap shrink-0 bg-white" style={{ borderTop: '1px solid #E5D0BC' }}>
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => onSend(p)}
              className="text-[10px] font-semibold rounded-full px-2.5 py-1 transition-all"
              style={{ color: '#7C4B2A', border: '1px solid #E5D0BC', background: '#F5EBE0' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8732A'; e.currentTarget.style.color = '#4A2512' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5D0BC'; e.currentTarget.style.color = '#7C4B2A' }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 bg-white" style={{ borderTop: '1px solid #E5D0BC' }}>
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about products, deals, advice…"
            disabled={isLoading}
            className="flex-1 h-10 rounded-xl text-[13px] px-3.5 outline-none transition-all"
            style={{
              background: '#FAF6F1',
              border: '1px solid #E5D0BC',
              color: '#1C0A04'
            }}
            onFocus={e => e.target.style.borderColor = '#B8732A'}
            onBlur={e => e.target.style.borderColor = '#E5D0BC'}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-colors disabled:opacity-40"
            style={{ background: '#4A2512' }}
            onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.background = '#6B3A2A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#4A2512')}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [sessionId, setSessionId] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const [store, setStore] = useState(null)

  // Force light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
    return () => { document.documentElement.style.colorScheme = '' }
  }, [])

  useEffect(() => {
    let sid = null
    try { sid = localStorage.getItem('convos_session_id') } catch (e) { }
    if (!sid) { sid = crypto.randomUUID(); try { localStorage.setItem('convos_session_id', sid) } catch (e) { } }
    setSessionId(sid)
    try { const s = localStorage.getItem('cart'); if (s) setCart(JSON.parse(s)) } catch (e) { }

    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'success') {
      setMessages(prev => [...prev, { role: 'assistant', content: '🎉 Payment successful! Your order has been placed.' }])
      window.history.replaceState({}, '', window.location.pathname)
    }

    fetch('/api/products/seed', { method: 'POST' }).then(() =>
      fetch('/api/products').then(r => r.json()).then(data => { if (Array.isArray(data)) setProducts(data) })
    )
    fetch('/api/store').then(r => r.json()).then(data => {
      if (data?.name) {
        setStore(data)
        setMessages([{ role: 'assistant', content: data.ai_greeting || 'Hey! Welcome. What are you shopping for today?' }])
      }
    })
  }, [])

  const sendMessage = useCallback(async (text) => {
    if (!sessionId || !text.trim()) return
    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: text }])
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: text })
      })
      const data = await res.json()
      if (data.response) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response.text,
          products: data.response.products || [],
          checkout_url: data.response.checkout_url || null
        }])
      }
      if (data.cart) setCart(data.cart)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    }
    setIsLoading(false)
  }, [sessionId])

  const addToCart = async (product) => {
    const newCart = cart.find(i => i.id === product.id)
      ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, { ...product, quantity: 1 }]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    if (sessionId) {
      try {
        await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, message: `[Internal] Added ${product.name} to cart` })
        })
      } catch (e) { }
    }
  }

  const updateQty = (id, delta) => {
    const newCart = cart.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const negotiate = (product) => {
    const target = Math.round(product.price * 0.82 * 100) / 100
    sendMessage(`Can I get ${product.name} for $${target}?`)
  }

  const clearChat = () => setMessages([{ role: 'assistant', content: store?.ai_greeting || 'Hey! What are you shopping for today?' }])

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
    }
    return true
  })

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <div className="min-h-screen" style={{ background: '#FAF6F1', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#1C0A04' }}>

      {/* Announcement bar */}
      <div className="text-center py-2.5 text-[11px] font-semibold tracking-wide text-white" style={{ background: 'linear-gradient(90deg, #3A1A0A, #6B3A2A, #3A1A0A)' }}>
        {store?.banner || '✦ FREE GLOBAL SHIPPING OVER $100 · USE CODE WELCOME FOR 10% OFF ✦'}
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white" style={{ borderBottom: '1px solid #E5D0BC', boxShadow: '0 1px 4px rgba(74,37,18,0.06)' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #4A2512, #7C4B2A)' }}>
              <svg width="13" height="13" viewBox="0 0 32 32" fill="none">
                <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-extrabold tracking-tight" style={{ color: '#1C0A04' }}>
              {store?.name || 'Artisan Coffee'}
            </span>
          </div>

          {/* Category tabs */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {CATEGORIES.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className="px-3 py-1.5 text-[13px] rounded-xl transition-all font-semibold"
                style={selectedCategory === c.name
                  ? { background: '#F5EBE0', color: '#4A2512', border: '1px solid #E5D0BC' }
                  : { color: '#9B7B6B' }
                }
                onMouseEnter={e => { if (selectedCategory !== c.name) e.currentTarget.style.color = '#4A2512' }}
                onMouseLeave={e => { if (selectedCategory !== c.name) e.currentTarget.style.color = '#9B7B6B' }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#C4A898' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="pl-8 pr-3 h-9 w-40 rounded-xl text-[12px] outline-none transition-all"
                style={{ background: '#FAF6F1', border: '1px solid #E5D0BC', color: '#1C0A04' }}
                onFocus={e => e.target.style.borderColor = '#B8732A'}
                onBlur={e => e.target.style.borderColor = '#E5D0BC'}
              />
            </div>

            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="relative h-9 w-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ border: '1px solid #E5D0BC', background: '#FFFFFF', color: '#9B7B6B' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8732A'; e.currentTarget.style.color = '#4A2512'; e.currentTarget.style.background = '#F5EBE0' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5D0BC'; e.currentTarget.style.color = '#9B7B6B'; e.currentTarget.style.background = '#FFFFFF' }}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-[18px] w-[18px] rounded-full text-[9px] font-black flex items-center justify-center text-white shadow-sm" style={{ background: '#4A2512' }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>

              <SheetContent className="w-[380px] flex flex-col" style={{ background: '#FFFFFF', borderLeft: '1px solid #E5D0BC', color: '#1C0A04' }}>
                <SheetHeader className="pb-4 shrink-0" style={{ borderBottom: '1px solid #E5D0BC' }}>
                  <SheetTitle className="flex items-center gap-2 text-base font-bold" style={{ color: '#1C0A04' }}>
                    <ShoppingCart className="w-4 h-4" style={{ color: '#9B7B6B' }} /> Your Cart
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold ml-1" style={{ border: '1px solid #E5D0BC', background: '#F5EBE0', color: '#6B3A2A' }}>
                      {cartCount}
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto mt-4 space-y-2.5">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16" style={{ color: '#C4A898' }}>
                      <ShoppingCart className="w-10 h-10 mb-3" />
                      <p className="text-sm font-medium" style={{ color: '#9B7B6B' }}>Your cart is empty</p>
                      <p className="text-xs mt-1" style={{ color: '#C4A898' }}>Add some products to get started</p>
                    </div>
                  ) : cart.map((item, i) => (
                    <div key={i} className="rounded-xl p-3 flex gap-3 items-center transition-all" style={{ border: '1px solid #E5D0BC', background: '#FAF6F1' }}>
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" style={{ border: '1px solid #E5D0BC' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold truncate" style={{ color: '#1C0A04' }}>{item.name}</p>
                        <p className="text-[12px] font-bold mt-0.5" style={{ color: '#B8732A' }}>${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={{ border: '1px solid #E5D0BC', background: '#FFFFFF', color: '#9B7B6B' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8732A'; e.currentTarget.style.color = '#4A2512' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5D0BC'; e.currentTarget.style.color = '#9B7B6B' }}>
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-5 text-center" style={{ color: '#1C0A04' }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={{ border: '1px solid #E5D0BC', background: '#FFFFFF', color: '#9B7B6B' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8732A'; e.currentTarget.style.color = '#4A2512' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5D0BC'; e.currentTarget.style.color = '#9B7B6B' }}>
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {cart.length > 0 && (
                  <div className="pt-4 mt-4 space-y-4 shrink-0" style={{ borderTop: '1px solid #E5D0BC' }}>
                    <div className="flex items-center justify-between text-xs" style={{ color: '#9B7B6B' }}>
                      <span className="flex items-center gap-1"><TruckIcon className="w-3 h-3" /> Free shipping</span>
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure checkout</span>
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" /> Easy returns</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium" style={{ color: '#6B3A2A' }}>Subtotal</span>
                      <span className="text-2xl font-extrabold tracking-tight" style={{ color: '#1C0A04' }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <a href="/checkout">
                      <button className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${btn_primary}`}>
                        Checkout <ArrowRight className="w-4 h-4" />
                      </button>
                    </a>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="flex">
        <div className="flex-1 min-w-0">

          {/* Hero */}
          <div className="relative h-[400px] overflow-hidden">
            <img
              src={store?.hero_image || 'https://images.unsplash.com/photo-1447933601403-56dc2e4c4949?w=1400&h=600&fit=crop'}
              alt="Store hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(28,10,4,0.82) 0%, rgba(28,10,4,0.45) 55%, transparent 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 w-fit mb-4" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Sparkles className="w-3 h-3" style={{ color: '#F5D5A8' }} />
                <span className="text-white text-[11px] font-semibold">AI-Powered Shopping</span>
              </div>
              <h1 className="text-4xl md:text-[52px] font-extrabold tracking-tight text-white leading-[1.05] mb-3 max-w-lg">
                {store?.name || 'Artisan Coffee Roasters'}
              </h1>
              <p className="text-base mb-7 max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                {store?.description || 'Premium single origin and blended coffees, roasted fresh to order.'}
              </p>
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold w-fit transition-all shadow-lg"
                style={{ background: '#FFFFFF', color: '#1C0A04' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F5EBE0'}
                onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trust bar */}
          <div className="bg-white" style={{ borderBottom: '1px solid #E5D0BC' }}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-8 text-xs font-semibold" style={{ color: '#9B7B6B' }}>
              <span className="flex items-center gap-1.5"><TruckIcon className="w-3.5 h-3.5" style={{ color: '#B8732A' }} /> Free shipping over $100</span>
              <span className="hidden sm:flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" style={{ color: '#B8732A' }} /> Secure &amp; encrypted checkout</span>
              <span className="hidden md:flex items-center gap-1.5"><Package className="w-3.5 h-3.5" style={{ color: '#B8732A' }} /> 30-day free returns</span>
              <span className="hidden lg:flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" style={{ color: '#B8732A' }} /> AI negotiates best prices for you</span>
            </div>
          </div>

          {/* Category pills */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-7 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className="flex items-center gap-2 shrink-0 rounded-full px-4 py-2 text-[12px] font-bold transition-all"
                  style={selectedCategory === c.name
                    ? { background: '#4A2512', color: '#FFFFFF' }
                    : { background: '#FFFFFF', color: '#6B3A2A', border: '1px solid #E5D0BC' }
                  }
                  onMouseEnter={e => { if (selectedCategory !== c.name) { e.currentTarget.style.borderColor = '#B8732A'; e.currentTarget.style.background = '#F5EBE0'; e.currentTarget.style.color = '#4A2512' } }}
                  onMouseLeave={e => { if (selectedCategory !== c.name) { e.currentTarget.style.borderColor = '#E5D0BC'; e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#6B3A2A' } }}
                >
                  {c.image && <img src={c.image} alt="" className="w-4 h-4 rounded-full object-cover" />}
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products grid */}
          <div id="products" className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-16">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight" style={{ color: '#1C0A04' }}>
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <p className="text-xs mt-0.5 font-medium" style={{ color: '#C4A898' }}>
                  {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: '#B8732A' }}>
                  <X className="w-3 h-3" /> Clear search
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} onNegotiate={negotiate} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#F5EBE0' }}>
                  <Search className="w-7 h-7" style={{ color: '#C4A898' }} />
                </div>
                <p className="text-base font-bold mb-1" style={{ color: '#4A2512' }}>No products found</p>
                <p className="text-sm" style={{ color: '#9B7B6B' }}>Try a different category or search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-white py-8" style={{ borderTop: '1px solid #E5D0BC' }}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: '#C4A898' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4A2512, #7C4B2A)' }}>
                  <svg width="10" height="10" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="white" />
                  </svg>
                </div>
                <span className="font-bold" style={{ color: '#4A2512' }}>{store?.name || 'Artisan Coffee'}</span>
              </div>
              <p className="text-xs">
                © {new Date().getFullYear()} {store?.name || 'Artisan Coffee'}. Powered by{' '}
                <span className="font-semibold" style={{ color: '#B8732A' }}>Convos AI</span>
              </p>
            </div>
          </footer>
        </div>

        {/* Chat widget */}
        {chatOpen && (
          <ChatWidget
            messages={messages}
            isLoading={isLoading}
            onSend={sendMessage}
            onClear={clearChat}
            onToggle={() => setChatOpen(false)}
            storeName={store?.name}
            aiName={store?.ai_name}
          />
        )}
      </div>

      {/* Chat FAB */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center text-white z-50 transition-colors"
          style={{ background: '#4A2512', boxShadow: '0 8px 24px rgba(74,37,18,0.3)' }}
          onMouseEnter={e => e.currentTarget.style.background = '#6B3A2A'}
          onMouseLeave={e => e.currentTarget.style.background = '#4A2512'}
        >
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
        </motion.button>
      )}
    </div>
  )
}
