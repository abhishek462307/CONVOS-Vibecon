'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  ShoppingCart, Send, User, Search, X, Plus, ArrowRight,
  MessageCircle, Trash2, Loader2, CreditCard, Tag, Sparkles
} from 'lucide-react'

function ConvosLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="url(#convos-g)"/>
      <defs><linearGradient id="convos-g" x1="8" y1="2" x2="24" y2="28"><stop stopColor="#a855f7"/><stop offset="0.6" stopColor="#ec4899"/><stop offset="1" stopColor="#f97316"/></linearGradient></defs>
    </svg>
  )
}

const CATEGORIES = [
  { name: 'All', image: null },
  { name: 'Single Origin', image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=200&h=200&fit=crop' },
  { name: 'Blends', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop' },
  { name: 'Espresso', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=200&h=200&fit=crop' },
  { name: 'Decaf', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' },
  { name: 'Equipment', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop' },
]

function ProductCard({ product, onAddToCart, onNegotiate }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card shadow-sm group hover:shadow-md transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.compare_at_price && (
          <div className="absolute top-2.5 left-2.5 bg-gradient-purple text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            SALE
          </div>
        )}
        {product.bargain_enabled && (
          <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> AI Price
          </div>
        )}
      </div>
      <div className="p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85 mb-1">{product.category}</p>
        <h4 className="text-sm font-semibold tracking-tight text-foreground leading-snug">{product.name}</h4>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-4">{product.description}</p>
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-base font-semibold tracking-tight text-foreground">${product.price}</span>
          {product.compare_at_price && (
            <span className="text-xs text-muted-foreground line-through">${product.compare_at_price}</span>
          )}
        </div>
        {product.weight && <p className="text-[10px] text-muted-foreground mt-0.5">{product.weight}</p>}
        <div className="flex gap-1.5 mt-3">
          <Button size="sm" className="flex-1 h-9 text-xs bg-gradient-purple hover:opacity-90 text-white rounded-xl border-0 font-semibold" onClick={() => onAddToCart(product)}>
            <Plus className="w-3 h-3 mr-1" /> Add to Cart
          </Button>
          {product.bargain_enabled && (
            <Button size="sm" variant="outline" className="h-9 w-9 rounded-xl border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/40" onClick={() => onNegotiate(product)}>
              <Tag className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function ChatWidget({ messages, isLoading, onSend, onClear, isOpen, onToggle }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSend(input.trim())
      setInput('')
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-purple rounded-full flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-all z-50 glow-purple"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="w-[340px] flex-shrink-0 border-l border-border/70 bg-card flex flex-col h-[calc(100vh-88px)] sticky top-14">
      {/* Chat Header */}
      <div className="px-4 py-3.5 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-purple flex items-center justify-center text-white flex-shrink-0">
            <ConvosLogo size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight">Convos AI</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-muted-foreground">Agentic shopping assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClear} className="p-1.5 rounded-xl hover:bg-secondary/60 text-muted-foreground transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          <button onClick={onToggle} className="p-1.5 rounded-xl hover:bg-secondary/60 text-muted-foreground transition-colors"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user'
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start gap-2'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-purple flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                      <ConvosLogo size={14} />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-[18px] px-3.5 py-2.5 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-foreground text-background rounded-br-sm font-medium'
                      : 'bg-secondary/60 text-foreground rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Inline product cards */}
          {messages.length > 0 && messages[messages.length - 1].products?.length > 0 && (
            <div className="space-y-2 pl-9">
              {messages[messages.length - 1].products.map(p => (
                <div key={p.id} className="rounded-[16px] border border-border/70 bg-secondary/20 p-2.5 flex gap-2.5">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-[12px] object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold tracking-tight truncate">{p.name}</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checkout link */}
          {messages.length > 0 && messages[messages.length - 1].checkout_url && (
            <div className="pl-9">
              <a href={messages[messages.length - 1].checkout_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="h-9 rounded-xl bg-gradient-purple hover:opacity-90 text-white border-0 text-xs font-semibold">
                  <CreditCard className="w-3 h-3 mr-1.5" /> Complete Checkout <ArrowRight className="w-3 h-3 ml-1.5" />
                </Button>
              </a>
            </div>
          )}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-purple flex items-center justify-center text-white flex-shrink-0">
                <ConvosLogo size={14} />
              </div>
              <div className="bg-secondary/60 rounded-[18px] rounded-bl-sm px-3.5 py-2.5 text-sm text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-border/70">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="text-sm bg-secondary/40 border-border/70 rounded-xl h-10 focus-visible:ring-1 focus-visible:ring-ring"
            disabled={isLoading}
          />
          <Button type="submit" size="sm" className="h-10 w-10 rounded-xl bg-foreground hover:opacity-80 p-0 flex-shrink-0 border-0" disabled={!input.trim() || isLoading}>
            <Send className="w-3.5 h-3.5 text-background" />
          </Button>
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
  const [missions, setMissions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const [store, setStore] = useState(null)

  useEffect(() => {
    let sid = null
    try { sid = localStorage.getItem('convos_session_id') } catch(e) {}
    if (!sid) {
      sid = crypto.randomUUID()
      try { localStorage.setItem('convos_session_id', sid) } catch(e) {}
    }
    setSessionId(sid)

    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch(e) {}

    // Check checkout result
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'success') {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Payment successful! Your order has been placed. Thank you for shopping with us!' }])
      window.history.replaceState({}, '', window.location.pathname)
    }

    // Seed + load
    fetch('/api/products/seed', { method: 'POST' }).then(() => {
      fetch('/api/products').then(r => r.json()).then(data => { if (Array.isArray(data)) setProducts(data) })
    })
    fetch('/api/store').then(r => r.json()).then(data => {
      if (data && data.name) {
        setStore(data)
        setMessages([{ role: 'assistant', content: data.ai_greeting || 'Hey! Welcome to our store. What are you shopping for today?' }])
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
          role: 'assistant', content: data.response.text,
          products: data.response.products || [],
          mission: data.response.mission_created || null,
          negotiation: data.response.negotiation || null,
          checkout_url: data.response.checkout_url || null
        }])
      }
      if (data.cart) setCart(data.cart)
      if (data.missions) setMissions(data.missions)
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    }
    setIsLoading(false)
  }, [sessionId])

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    let newCart
    
    if (existingItem) {
      newCart = cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      newCart = [...cart, { ...product, quantity: 1 }]
    }
    
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    setMessages(prev => [...prev, { role: 'assistant', content: `Added ${product.name} to your cart!` }])
  }
  
  const negotiate = (product) => {
    const target = Math.round(product.price * 0.8 * 100) / 100
    sendMessage(`Can I get ${product.name} for $${target}?`)
  }
  const clearChat = () => {
    setMessages([{ role: 'assistant', content: store?.ai_greeting || 'Hey! Welcome to our store. What are you shopping for today?' }])
  }

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    }
    return true
  })

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Banner + Nav wrapper — banner scrolls, nav sticks */}
      <div className="bg-gradient-purple text-white text-center py-2 text-[11px] font-semibold tracking-[0.04em]">
        {store?.banner || 'FREE GLOBAL SHIPPING OVER $100 · CODE WELCOME FOR 10% OFF'}
      </div>

      {/* Navigation */}
      <nav className="bg-card/95 backdrop-blur-md border-b border-border/70 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <ConvosLogo size={24} />
              <span className="text-base font-bold tracking-tight hidden sm:inline">{store?.name || 'Artisan Coffee Roasters'}</span>
            </div>
            <div className="hidden md:flex items-center gap-0.5">
              {CATEGORIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-3 py-1.5 text-sm rounded-xl transition-all font-medium ${
                    selectedCategory === c.name
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9 h-9 w-48 rounded-xl bg-muted border-0 text-sm"
              />
            </div>
            <a href="/login">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-9 rounded-xl font-semibold">
                <User className="w-3.5 h-3.5 mr-1.5" /> Login
              </Button>
            </a>
            <a href="/merchant/login">
              <Button variant="outline" size="sm" className="text-xs h-9 rounded-xl border-border/70 font-semibold">Merchant</Button>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-xl p-0">
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-purple rounded-full text-[9px] font-bold flex items-center justify-center text-white leading-none">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-card border-border/70 w-[380px]">
                <SheetHeader className="border-b border-border/70 pb-4">
                  <SheetTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                    <ShoppingCart className="w-4 h-4" /> Cart
                    <span className="rounded-full border border-border/70 bg-secondary px-2 py-0.5 text-xs font-bold ml-1">{cartCount}</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <ShoppingCart className="w-8 h-8 mb-3 opacity-30" />
                      <p className="text-sm">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      {cart.map((item, i) => (
                        <div key={i} className="rounded-[18px] border border-border/70 bg-secondary/20 p-3 flex gap-3">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-[14px] object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold tracking-tight truncate">{item.name}</p>
                            <p className="text-sm font-semibold text-foreground mt-0.5">${item.price.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      <div className="rounded-[18px] border border-border/70 bg-secondary/20 px-4 py-3 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-medium">Total</span>
                        <span className="text-xl font-semibold tracking-tight">${cartTotal.toFixed(2)}</span>
                      </div>
                      <a href="/checkout">
                        <Button className="w-full h-11 rounded-2xl bg-gradient-purple hover:opacity-90 text-white border-0 font-semibold tracking-tight">
                          Checkout <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Hero */}
          <div className="relative h-[380px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1447933601403-56dc2e4c4949?w=1400&h=600&fit=crop"
              alt="Coffee Shop"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1">
                  <Sparkles className="w-3 h-3 text-purple-300" />
                  <span className="text-white/90 text-xs font-medium">AI-Powered Shopping</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight mb-3">
                {store?.name || 'Artisan Coffee Roasters'}
              </h1>
              <p className="text-white/65 text-base mb-6 max-w-lg leading-relaxed">
                {store?.description || 'Premium single origin and blended coffees, roasted fresh to order.'}
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="flex items-center gap-2 bg-gradient-purple hover:opacity-90 text-white px-6 py-3 rounded-2xl text-sm font-semibold w-fit transition-opacity shadow-lg shadow-purple-500/20"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browse by Category */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85 mb-5">Browse by Category</p>
            <div className="flex gap-5 overflow-x-auto pb-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`flex flex-col items-center gap-2 min-w-[70px] transition-all ${
                    selectedCategory === c.name ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
                    selectedCategory === c.name ? 'border-purple-500' : 'border-transparent'
                  }`}>
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">ALL</div>
                    )}
                  </div>
                  <span className={`text-[11px] font-medium uppercase tracking-wide ${
                    selectedCategory === c.name ? 'text-foreground' : 'text-muted-foreground'
                  }`}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div id="products" className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[28px] font-semibold tracking-tight">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{filteredProducts.length} items available</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} onNegotiate={negotiate} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-card mb-4">
                  <Search className="w-5 h-5 opacity-40" />
                </div>
                <p className="text-sm font-medium">No products found</p>
                <p className="text-xs mt-1 opacity-60">Try a different category or search term</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat Widget */}
        {chatOpen && (
          <ChatWidget
            messages={messages}
            isLoading={isLoading}
            onSend={sendMessage}
            onClear={clearChat}
            isOpen={chatOpen}
            onToggle={() => setChatOpen(!chatOpen)}
          />
        )}
      </div>

      {/* Chat toggle when closed */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-purple rounded-2xl flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-all z-50 glow-purple"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default App;
