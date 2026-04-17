'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  ShoppingCart, Send, Search, X, Plus, ArrowRight,
  Trash2, CreditCard, Tag, Sparkles, Bot, Minus,
  Star, ChevronRight, Zap, Package, TruckIcon, Shield
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

  const discount = product.compare_at_price > product.price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wide uppercase shadow-sm">
              -{discount}%
            </span>
          )}
        </div>
        {product.bargain_enabled && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Zap className="w-2.5 h-2.5" /> AI Price
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-violet-500 mb-1">{product.category}</p>
          <h4 className="text-sm font-bold text-gray-900 leading-snug">{product.name}</h4>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">${product.price}</span>
          {product.compare_at_price > product.price && (
            <span className="text-xs text-gray-400 line-through">${product.compare_at_price}</span>
          )}
          {product.weight && <span className="text-[10px] text-gray-400 ml-auto">{product.weight}</span>}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleAdd}
            className={`flex-1 h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${added
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
              : 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-200'
            }`}
          >
            {added ? (
              <><span>✓</span> Added</>
            ) : (
              <><Plus className="w-3 h-3" /> Add to Cart</>
            )}
          </button>
          {product.bargain_enabled && (
            <button
              onClick={() => onNegotiate(product)}
              className="h-9 w-9 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-all flex items-center justify-center"
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
          className="w-1.5 h-1.5 rounded-full bg-violet-400"
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
    <div className="w-[360px] flex-shrink-0 flex flex-col h-[calc(100vh-96px)] sticky top-[96px] bg-white border-l border-gray-100 shadow-sm">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shrink-0 shadow-sm shadow-violet-200">
            <Bot className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900">{aiName || 'Convos AI'}</span>
              <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block animate-pulse" /> LIVE
              </span>
            </div>
            <p className="text-[10px] text-gray-400">{storeName || 'Agentic shopping assistant'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClear} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all" title="Clear chat">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onToggle} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-4 bg-gray-50/40">
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
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shrink-0 mb-0.5 shadow-sm">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${isUser
                    ? 'bg-violet-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Product results in chat */}
          {messages.length > 0 && messages[messages.length - 1].products?.length > 0 && (
            <div className="ml-8 flex flex-col gap-2">
              {messages[messages.length - 1].products.map(p => (
                <div key={p.id} className="rounded-xl border border-gray-100 bg-white p-2.5 flex gap-2.5 hover:border-violet-200 hover:shadow-sm transition-all">
                  <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover shrink-0 border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-gray-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-violet-600 font-bold mt-0.5">${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checkout link in chat */}
          {messages.length > 0 && messages[messages.length - 1].checkout_url && (
            <div className="ml-8">
              <a href={messages[messages.length - 1].checkout_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shadow-sm">
                <CreditCard className="w-3.5 h-3.5" /> Checkout <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          )}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                <TypingDots />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 pt-1.5 flex gap-1.5 flex-wrap shrink-0 bg-white border-t border-gray-100">
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => onSend(p)}
              className="text-[10px] font-semibold text-gray-500 border border-gray-200 bg-gray-50 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 rounded-full px-2.5 py-1 transition-all">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-100 shrink-0 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about products, deals, advice…"
            disabled={isLoading}
            className="flex-1 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-[13px] px-3.5 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 rounded-xl bg-violet-600 hover:bg-violet-700 flex items-center justify-center text-white shrink-0 transition-colors disabled:opacity-40 shadow-sm"
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

  // Force light mode on the store page
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
    return () => {
      document.documentElement.style.colorScheme = ''
    }
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
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#111827' }}>

      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-violet-600 via-violet-600 to-purple-700 text-center py-2.5 text-[11px] font-semibold tracking-wide text-white">
        {store?.banner || '✦ FREE GLOBAL SHIPPING OVER $100 · USE CODE WELCOME FOR 10% OFF ✦'}
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo / Store name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-sm">
              <svg width="13" height="13" viewBox="0 0 32 32" fill="none">
                <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-extrabold text-gray-900 tracking-tight">
              {store?.name || 'Artisan Coffee'}
            </span>
          </div>

          {/* Center: categories */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {CATEGORIES.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-3 py-1.5 text-[13px] rounded-xl transition-all font-semibold ${selectedCategory === c.name
                  ? 'bg-violet-50 text-violet-700 border border-violet-200'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Right: search + actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="pl-8 pr-3 h-9 w-40 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-[12px] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>

            {/* Merchant link */}
            <a href="/merchant/login" className="text-[12px] font-semibold text-gray-400 hover:text-gray-700 transition-colors px-2 hidden sm:block">
              Merchant
            </a>

            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative h-9 w-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-all shadow-sm">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-[18px] w-[18px] bg-violet-600 rounded-full text-[9px] font-black flex items-center justify-center text-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="bg-white border-gray-200 w-[380px] flex flex-col" style={{ color: '#111827' }}>
                <SheetHeader className="border-b border-gray-100 pb-4 shrink-0">
                  <SheetTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                    <ShoppingCart className="w-4 h-4 text-gray-500" /> Your Cart
                    <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-bold ml-1 text-gray-600">{cartCount}</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto mt-4 space-y-2.5">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                      <ShoppingCart className="w-10 h-10 mb-3" />
                      <p className="text-sm font-medium text-gray-400">Your cart is empty</p>
                      <p className="text-xs text-gray-300 mt-1">Add some products to get started</p>
                    </div>
                  ) : cart.map((item, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3 flex gap-3 items-center hover:border-gray-200 transition-colors">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[12px] text-violet-600 font-bold mt-0.5">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-violet-600 hover:border-violet-200 flex items-center justify-center transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-gray-900 w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-violet-600 hover:border-violet-200 flex items-center justify-center transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 mt-4 space-y-4 shrink-0">
                    {/* Trust signals */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1"><TruckIcon className="w-3 h-3" /> Free shipping</span>
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure checkout</span>
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" /> Easy returns</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Subtotal</span>
                      <span className="text-2xl font-extrabold text-gray-900 tracking-tight">${cartTotal.toFixed(2)}</span>
                    </div>
                    <a href="/checkout">
                      <button className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm shadow-violet-200">
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
          <div className="relative h-[400px] overflow-hidden">
            <img
              src={store?.hero_image || 'https://images.unsplash.com/photo-1447933601403-56dc2e4c4949?w=1400&h=600&fit=crop'}
              alt="Store hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-3 py-1.5 w-fit mb-4">
                <Sparkles className="w-3 h-3 text-violet-300" />
                <span className="text-white text-[11px] font-semibold">AI-Powered Shopping</span>
              </div>
              <h1 className="text-4xl md:text-[52px] font-extrabold tracking-tight text-white leading-[1.05] mb-3 max-w-lg">
                {store?.name || 'Artisan Coffee Roasters'}
              </h1>
              <p className="text-white/70 text-base mb-7 max-w-md leading-relaxed">
                {store?.description || 'Premium single origin and blended coffees, roasted fresh to order.'}
              </p>
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-2.5 rounded-xl text-sm font-bold w-fit transition-colors shadow-lg"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trust bar */}
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-8 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5"><TruckIcon className="w-3.5 h-3.5 text-violet-500" /> Free shipping over $100</span>
              <span className="hidden sm:flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-violet-500" /> Secure & encrypted checkout</span>
              <span className="hidden md:flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-violet-500" /> 30-day free returns</span>
              <span className="hidden lg:flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-violet-500" /> AI negotiates best prices for you</span>
            </div>
          </div>

          {/* Category pills */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-7 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`flex items-center gap-2 shrink-0 rounded-full px-4 py-2 text-[12px] font-bold transition-all ${selectedCategory === c.name
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50'
                  }`}
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
                <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">{filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}</p>
              </div>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear search
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} onNegotiate={negotiate} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-base font-bold text-gray-700 mb-1">No products found</p>
                <p className="text-sm text-gray-400">Try a different category or search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-100 bg-white py-8">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="white" />
                  </svg>
                </div>
                <span className="font-bold text-gray-700">{store?.name || 'Artisan Coffee'}</span>
              </div>
              <p className="text-xs">© {new Date().getFullYear()} {store?.name || 'Artisan Coffee'}. Powered by <span className="text-violet-600 font-semibold">Convos AI</span></p>
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

      {/* Chat FAB (when chat is closed) */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-violet-600 hover:bg-violet-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-violet-200 transition-colors z-50"
        >
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
        </motion.button>
      )}
    </div>
  )
}

export default App
