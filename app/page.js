'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  ShoppingCart, Send, User, Search, X, Plus, Minus, ArrowRight,
  MessageCircle, Trash2, Home, ChevronRight, Coffee, Loader2, CreditCard, Tag
} from 'lucide-react'

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
    <div className="bg-card rounded-xl overflow-hidden store-shadow group hover:store-shadow-md transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.compare_at_price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            SALE
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">{product.category}</p>
        <h4 className="font-semibold text-sm text-foreground leading-tight">{product.name}</h4>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-foreground">${product.price}</span>
          {product.compare_at_price && (
            <span className="text-xs text-muted-foreground line-through">${product.compare_at_price}</span>
          )}
        </div>
        {product.weight && <p className="text-[10px] text-muted-foreground mt-0.5">{product.weight}</p>}
        <div className="flex gap-1.5 mt-3">
          <Button size="sm" className="flex-1 h-8 text-xs bg-[#8B6F47] hover:bg-[#725A3A] text-white rounded-full" onClick={() => onAddToCart(product)}>
            <Plus className="w-3 h-3 mr-1" /> Add to Cart
          </Button>
          {product.bargain_enabled && (
            <Button size="sm" variant="outline" className="h-8 text-xs rounded-full border-[#8B6F47]/30 text-[#8B6F47]" onClick={() => onNegotiate(product)}>
              <Tag className="w-3 h-3" />
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#8B6F47] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#725A3A] transition-all z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="w-[340px] flex-shrink-0 border-l border-border bg-card flex flex-col h-[calc(100vh-88px)]">
      {/* Chat Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#8B6F47] flex items-center justify-center text-white text-sm font-bold">M</div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">Mark</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-muted-foreground">Talk to Mark</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClear} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"><Trash2 className="w-4 h-4" /></button>
          <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-3">
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
                    <div className="w-7 h-7 rounded-full bg-[#8B6F47] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">M</div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#8B6F47] text-white rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
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
                <div key={p.id} className="bg-muted rounded-lg p-2 flex gap-2">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-xs font-bold text-[#8B6F47]">${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checkout link */}
          {messages.length > 0 && messages[messages.length - 1].checkout_url && (
            <div className="pl-9">
              <a href={messages[messages.length - 1].checkout_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-full">
                  <CreditCard className="w-3 h-3 mr-1.5" /> Complete Checkout <ArrowRight className="w-3 h-3 ml-1.5" />
                </Button>
              </a>
            </div>
          )}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-[#8B6F47] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">M</div>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search or ask anything..."
            className="text-sm bg-muted border-0 rounded-full h-9 focus-visible:ring-[#8B6F47]/30"
            disabled={isLoading}
          />
          <Button type="submit" size="sm" className="h-9 w-9 rounded-full bg-[#8B6F47] hover:bg-[#725A3A] p-0 flex-shrink-0" disabled={!input.trim() || isLoading}>
            <Send className="w-3.5 h-3.5 text-white" />
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

  const addToCart = (product) => { sendMessage(`Add ${product.name} to my cart`) }
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
      {/* Banner */}
      <div className="bg-[#8B6F47] text-white text-center py-2 text-xs font-medium tracking-wide">
        {store?.banner || 'FREE GLOBAL SHIPPING ON ORDERS OVER $100 | USE CODE WELCOME TO GET 10% OFF'}
      </div>

      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#8B6F47]" />
              <span className="font-bold text-base tracking-tight hidden sm:inline">{store?.name || 'Artisan Coffee Roasters'}</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {CATEGORIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                    selectedCategory === c.name
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9 h-9 w-48 rounded-full bg-muted border-0 text-sm"
              />
            </div>
            <a href="/merchant">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-8">Merchant</Button>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8">
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#8B6F47] rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-card w-[380px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-base">
                    <ShoppingCart className="w-4 h-4" /> Cart ({cartCount})
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  {cart.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Your cart is empty</p>
                  ) : (
                    <>
                      {cart.map((item, i) => (
                        <div key={i} className="rounded-lg border border-border p-3 flex gap-3">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-sm font-bold text-[#8B6F47]">${item.price.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button className="w-full bg-[#8B6F47] hover:bg-[#725A3A] text-white rounded-full" onClick={() => sendMessage('Generate checkout for my cart')}>
                        Checkout <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
              <p className="text-white/80 text-sm font-medium mb-2 tracking-wider uppercase">Premium Roasts</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
                {store?.name || 'Artisan Coffee Roasters'}
              </h1>
              <p className="text-white/80 text-base mb-6 max-w-lg">
                {store?.description || 'Premium single origin and blended coffees, roasted fresh to order.'}
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="flex items-center gap-2 bg-[#8B6F47] hover:bg-[#725A3A] text-white px-6 py-3 rounded-full text-sm font-semibold w-fit transition-colors"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browse by Category */}
          <div className="max-w-[1200px] mx-auto px-4 py-8">
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-5">Browse by Category</h2>
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
                    selectedCategory === c.name ? 'border-[#8B6F47]' : 'border-transparent'
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
          <div id="products" className="max-w-[1200px] mx-auto px-4 pb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                <span className="text-sm font-normal text-muted-foreground ml-2">({filteredProducts.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} onNegotiate={negotiate} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No products found in this category.</p>
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
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#8B6F47] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#725A3A] transition-all z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

export default App;
