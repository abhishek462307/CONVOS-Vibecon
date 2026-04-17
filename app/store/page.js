'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  ShoppingCart, Send, Search, X, Plus, ArrowRight,
  Trash2, CreditCard, Tag, Sparkles, Bot, Minus
} from 'lucide-react'

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

function ProductCard({ product, onAddToCart, onNegotiate }) {
  const [added, setAdded] = useState(false)
  const handleAdd = () => {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-white/[0.07] hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_32px_rgba(168,85,247,0.08)]"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {product.compare_at_price && (
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase">Sale</span>
          )}
        </div>
        {product.bargain_enabled && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-md border border-purple-500/30 text-purple-300 text-[9px] font-semibold px-2 py-0.5 rounded-full">
            <Sparkles className="w-2.5 h-2.5" /> AI Price
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3.5 gap-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-purple-400/70 mb-1">{product.category}</p>
          <h4 className="text-sm font-semibold text-white leading-snug tracking-tight">{product.name}</h4>
          <p className="text-[11px] text-white/35 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-white tracking-tight">${product.price}</span>
          {product.compare_at_price && (
            <span className="text-xs text-white/30 line-through">${product.compare_at_price}</span>
          )}
          {product.weight && <span className="text-[10px] text-white/25 ml-auto">{product.weight}</span>}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleAdd}
            className={`flex-1 h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              added
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'bg-white/[0.06] border border-white/10 text-white hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-300'
            }`}
          >
            {added ? (
              <><span className="text-emerald-400">✓</span> Added</>
            ) : (
              <><Plus className="w-3 h-3" /> Add to Cart</>
            )}
          </button>
          {product.bargain_enabled && (
            <button
              onClick={() => onNegotiate(product)}
              className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-white/40 hover:text-purple-400 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all flex items-center justify-center"
              title="Negotiate price"
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
          className="w-1.5 h-1.5 rounded-full bg-purple-400/60"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

function ChatWidget({ messages, isLoading, onSend, onClear, onToggle, storeName }) {
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
    <div className="w-[360px] flex-shrink-0 flex flex-col h-[calc(100vh-56px)] sticky top-14 bg-card border-l border-white/[0.07]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white tracking-tight">Convos AI</span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full">
                <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" /> LIVE
              </span>
            </div>
            <p className="text-[10px] text-white/30">{storeName || 'Agentic shopping assistant'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClear} className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all" title="Clear chat">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onToggle} className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-4">
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
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 mb-0.5">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    isUser
                      ? 'bg-purple-600/30 text-white border border-purple-500/20 rounded-br-sm'
                      : 'bg-white/[0.06] text-white/85 border border-white/[0.06] rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {messages.length > 0 && messages[messages.length - 1].products?.length > 0 && (
            <div className="ml-8 flex flex-col gap-2">
              {messages[messages.length - 1].products.map(p => (
                <div key={p.id} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5 flex gap-2.5 hover:border-purple-500/20 transition-colors">
                  <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-white/80 truncate">{p.name}</p>
                    <p className="text-[11px] text-purple-400 font-bold mt-0.5">${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {messages.length > 0 && messages[messages.length - 1].checkout_url && (
            <div className="ml-8">
              <a href={messages[messages.length - 1].checkout_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity">
                <CreditCard className="w-3.5 h-3.5" /> Checkout <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          )}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                <TypingDots />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 flex gap-1.5 flex-wrap shrink-0">
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => onSend(p)}
              className="text-[10px] font-medium text-white/40 border border-white/[0.08] bg-white/[0.03] hover:border-purple-500/30 hover:text-purple-300 hover:bg-purple-500/[0.08] rounded-full px-2.5 py-1 transition-all">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/[0.07] shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about products, deals, or advice…"
            disabled={isLoading}
            className="flex-1 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/25 text-[13px] px-3.5 outline-none focus:border-purple-500/50 focus:bg-purple-500/[0.05] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shrink-0 hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [sessionId, setSessionId] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const [store, setStore] = useState(null)

  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => document.documentElement.classList.remove('dark')
  }, [])

  useEffect(() => {
    let sid = null
    try { sid = localStorage.getItem('convos_session_id') } catch(e) {}
    if (!sid) { sid = crypto.randomUUID(); try { localStorage.setItem('convos_session_id', sid) } catch(e) {} }
    setSessionId(sid)
    try { const s = localStorage.getItem('cart'); if (s) setCart(JSON.parse(s)) } catch(e) {}
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
    // Optimistic UI update
    const newCart = cart.find(i => i.id === product.id)
      ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, { ...product, quantity: 1 }]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))

    // Server-side update
    if (sessionId) {
      try {
        await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: sessionId, 
            message: `[Internal] Added ${product.name} to cart` 
          })
        })
      } catch (e) {
        console.error('Failed to sync cart to server:', e)
      }
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
    <div className="min-h-screen bg-background text-foreground">

      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-pink-900/80 border-b border-white/[0.06] text-center py-2 text-[11px] font-medium tracking-wide text-white/70">
        {store?.banner || '✦ FREE GLOBAL SHIPPING OVER $100 · USE CODE WELCOME FOR 10% OFF ✦'}
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-border/70 bg-background">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Left: store name */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-semibold text-white tracking-tight">
              {store?.name || 'Artisan Coffee Roasters'}
            </span>
          </div>

          {/* Center: categories */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {CATEGORIES.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-3 py-1.5 text-[13px] rounded-xl transition-all font-medium ${
                  selectedCategory === c.name
                    ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Right: search + actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="pl-8 pr-3 h-8 w-40 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/25 text-[12px] outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            <a href="/merchant/login" className="text-[12px] font-medium text-white/35 hover:text-white/70 transition-colors px-2 hidden sm:block">
              Merchant
            </a>

            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative h-8 w-8 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white leading-none">
                      {cartCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="bg-card border-white/[0.08] w-[380px] flex flex-col">
                <SheetHeader className="border-b border-white/[0.07] pb-4 shrink-0">
                  <SheetTitle className="flex items-center gap-2 text-base font-semibold text-white tracking-tight">
                    <ShoppingCart className="w-4 h-4 text-white/50" /> Cart
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs font-bold ml-1 text-white/60">{cartCount}</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto mt-4 space-y-2.5">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-white/20">
                      <ShoppingCart className="w-8 h-8 mb-3" />
                      <p className="text-sm">Your cart is empty</p>
                    </div>
                  ) : cart.map((item, i) => (
                    <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-white truncate">{item.name}</p>
                        <p className="text-[12px] text-purple-400 font-bold mt-0.5">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg border border-white/10 bg-white/[0.04] text-white/50 hover:text-white flex items-center justify-center transition-colors">
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-sm font-bold text-white w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg border border-white/10 bg-white/[0.04] text-white/50 hover:text-white flex items-center justify-center transition-colors">
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="border-t border-white/[0.07] pt-4 mt-4 space-y-3 shrink-0">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-sm text-white/40">Total</span>
                      <span className="text-xl font-bold text-white tracking-tight">${cartTotal.toFixed(2)}</span>
                    </div>
                    <a href="/checkout">
                      <button className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
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

      {/* Main layout */}
      <div className="flex">
        <div className="flex-1 min-w-0">

          {/* Hero */}
          <div className="relative h-[420px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1447933601403-56dc2e4c4949?w=1400&h=600&fit=crop"
              alt="Store"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 w-fit mb-4">
                <Sparkles className="w-3 h-3 text-purple-300" />
                <span className="text-white/80 text-[11px] font-medium">AI-Powered Shopping</span>
              </div>
              <h1 className="text-4xl md:text-[52px] font-bold tracking-tight text-white leading-[1.06] mb-3 max-w-lg">
                {store?.name || 'Artisan Coffee Roasters'}
              </h1>
              <p className="text-white/50 text-[15px] mb-7 max-w-md leading-relaxed">
                {store?.description || 'Premium single origin and blended coffees, roasted fresh to order.'}
              </p>
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold w-fit transition-opacity shadow-lg shadow-purple-500/25"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-8 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`flex items-center gap-2 shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold transition-all ${
                    selectedCategory === c.name
                      ? 'bg-white text-black'
                      : 'bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.1]'
                  }`}
                >
                  {c.image && <img src={c.image} alt="" className="w-4 h-4 rounded-full object-cover" />}
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div id="products" className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-16">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <p className="text-[12px] text-white/30 mt-0.5">{filteredProducts.length} items</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} onNegotiate={negotiate} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-white/20">
                <Search className="w-8 h-8 mb-3" />
                <p className="text-sm font-medium">No products found</p>
                <p className="text-xs mt-1">Try a different category or search term</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat */}
        {chatOpen && (
          <ChatWidget
            messages={messages}
            isLoading={isLoading}
            onSend={sendMessage}
            onClear={clearChat}
            onToggle={() => setChatOpen(false)}
            storeName={store?.name}
          />
        )}
      </div>

      {/* Chat FAB */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-[0_8px_32px_rgba(168,85,247,0.35)] hover:opacity-90 transition-opacity z-50"
        >
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background" />
        </motion.button>
      )}
    </div>
  )
}

export default App
