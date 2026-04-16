'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  ShoppingCart, Send, Bot, User, Sparkles, Target, Package, DollarSign,
  TrendingUp, X, Plus, Minus, ArrowRight, Zap, MessageSquare, Loader2,
  ChevronRight, Shield, Globe, LayoutDashboard, Tag, CreditCard
} from 'lucide-react'

// Product Card Component
function ProductCard({ product, onAddToCart, onNegotiate }) {
  const savings = product.compare_at_price ? (product.compare_at_price - product.price).toFixed(2) : null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 w-full max-w-[280px]"
    >
      <div className="relative h-40 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {savings && (
          <div className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            SAVE ${savings}
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-black/60 text-white/90 text-[10px] border-0">{product.category}</Badge>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm text-foreground truncate">{product.name}</h4>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-indigo-400">${product.price}</span>
          {product.compare_at_price && (
            <span className="text-xs text-muted-foreground line-through">${product.compare_at_price}</span>
          )}
        </div>
        <div className="flex gap-1.5 mt-2">
          <Button size="sm" className="flex-1 h-7 text-xs bg-indigo-600 hover:bg-indigo-700" onClick={() => onAddToCart(product)}>
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
          {product.bargain_enabled && (
            <Button size="sm" variant="outline" className="h-7 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10" onClick={() => onNegotiate(product)}>
              <Tag className="w-3 h-3 mr-1" /> Deal
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Mission Card
function MissionCard({ mission }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-lg p-3 border-indigo-500/20">
      <div className="flex items-center gap-2 mb-1">
        <Target className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-xs font-medium text-indigo-300">Active Mission</span>
      </div>
      <p className="text-sm text-foreground">{mission.goal}</p>
      <div className="mt-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{mission.progress}%</span>
        </div>
        <Progress value={mission.progress} className="h-1.5" />
      </div>
      {mission.budget_max && (
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <DollarSign className="w-3 h-3" /> Budget: ${mission.budget_max}
        </div>
      )}
    </motion.div>
  )
}

// Message Bubble
function MessageBubble({ msg, onAddToCart, onNegotiate }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-indigo-400" />
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? '' : ''}`}>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-md'
            : 'glass-card text-foreground rounded-bl-md'
        }`}>
          {msg.content}
        </div>
        {/* Render inline products */}
        {msg.products && msg.products.length > 0 && (
          <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
            {msg.products.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNegotiate={onNegotiate} />
            ))}
          </div>
        )}
        {/* Render mission */}
        {msg.mission && <div className="mt-3"><MissionCard mission={msg.mission} /></div>}
        {/* Render negotiation */}
        {msg.negotiation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 glass-card rounded-lg p-3 border-amber-500/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-300">
                {msg.negotiation.status === 'accepted' ? 'Deal Accepted!' : 'Counter Offer'}
              </span>
            </div>
            <p className="text-sm">{msg.negotiation.message || `${msg.negotiation.product_name}: $${msg.negotiation.final_price}`}</p>
          </motion.div>
        )}
        {/* Checkout link */}
        {msg.checkout_url && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
            <a href={msg.checkout_url} target="_blank" rel="noopener noreferrer">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <CreditCard className="w-4 h-4 mr-2" /> Complete Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      )}
    </motion.div>
  )
}

// Header
function ConvosHeader({ cart, missions, onOpenCart, onGoHome, onGoMerchant }) {
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 glass-card border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <button onClick={onGoHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Convos</span>
          <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400 hidden sm:inline-flex">
            AI Commerce
          </Badge>
        </button>

        <div className="flex items-center gap-3">
          {missions.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-400">
              <Target className="w-3.5 h-3.5" />
              <span>{missions.length} mission{missions.length > 1 ? 's' : ''}</span>
            </div>
          )}
          <a href="/merchant">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> Merchant
            </Button>
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background border-border w-[380px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Cart ({cartCount})
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Your cart is empty. Start chatting to find products!</p>
                ) : (
                  <>
                    {cart.map((item, i) => (
                      <div key={i} className="glass-card rounded-lg p-3 flex gap-3">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-sm text-indigo-400 font-semibold">${item.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          {item.negotiated && <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-0 mt-1">Negotiated</Badge>}
                        </div>
                      </div>
                    ))}
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-xl font-bold text-indigo-400">${cartTotal.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

// Hero Section
function HeroSection({ onStartChat, products }) {
  const [inputValue, setInputValue] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) onStartChat(inputValue.trim())
  }
  const suggestions = [
    'Find me a gift under $50',
    'I need wireless headphones',
    'Show me home decor items',
    'Best deals on electronics'
  ]
  return (
    <div className="min-h-screen pt-14 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-xs text-indigo-400 mb-6">
            <Sparkles className="w-3 h-3" /> Agentic Commerce Platform
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent">
            Delegate Your Shopping<br />to AI Intelligence
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell Convos what you need. Our AI agent searches, recommends, negotiates prices, and guides you to checkout — all through natural conversation.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="w-full max-w-2xl"
        >
          <div className="relative gradient-border rounded-2xl animate-pulse-glow">
            <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-3">
              <MessageSquare className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tell me what you're looking for..."
                className="border-0 bg-transparent text-base focus-visible:ring-0 placeholder:text-muted-foreground/50 h-auto py-1"
              />
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-4" disabled={!inputValue.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-2 mt-4 justify-center"
        >
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => onStartChat(s)} className="text-xs px-3 py-1.5 rounded-full glass-card text-muted-foreground hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
              {s}
            </button>
          ))}
        </motion.div>

        {/* Feature badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 w-full max-w-2xl">
          {[
            { icon: Bot, label: 'AI Agent', desc: 'Smart shopping assistant' },
            { icon: Target, label: 'Missions', desc: 'Persistent goals' },
            { icon: DollarSign, label: 'Negotiate', desc: 'AI price bargaining' },
            { icon: Shield, label: 'Trust', desc: 'Consumer Matrix' }
          ].map((f, i) => (
            <div key={i} className="glass-card rounded-xl p-3 text-center">
              <f.icon className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
              <p className="text-xs font-semibold">{f.label}</p>
              <p className="text-[10px] text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Featured Products */}
      {products.length > 0 && (
        <div className="px-4 pb-12 max-w-7xl mx-auto w-full">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" /> Featured Products
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {products.slice(0, 5).map(p => (
              <div key={p.id} className="glass-card rounded-xl overflow-hidden cursor-pointer hover:border-indigo-500/30 transition-all" onClick={() => onStartChat(`Tell me about ${p.name}`)}>
                <div className="h-28 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium truncate">{p.name}</p>
                  <p className="text-sm font-bold text-indigo-400">${p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Chat Interface
function ChatInterface({ messages, isLoading, onSend, missions, onAddToCart, onNegotiate }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [isLoading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSend(input.trim())
      setInput('')
    }
  }

  return (
    <div className="pt-14 flex flex-col h-screen">
      {/* Missions bar */}
      {missions.length > 0 && (
        <div className="px-4 py-2 border-b border-border/50 glass-card">
          <div className="max-w-3xl mx-auto flex gap-3 overflow-x-auto">
            {missions.map(m => (
              <div key={m.id} className="flex items-center gap-2 text-xs text-indigo-400 whitespace-nowrap">
                <Target className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{m.goal}</span>
                <Badge variant="outline" className="text-[10px] border-indigo-500/30">{m.progress}%</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <h2 className="text-xl font-semibold mb-2">Welcome to Convos</h2>
              <p className="text-sm text-muted-foreground">I'm your AI shopping agent. Tell me what you're looking for!</p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} onAddToCart={onAddToCart} onNegotiate={onNegotiate} />
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span className="animate-shimmer bg-clip-text">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/50 glass-card">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="bg-card border-border/50 focus-visible:ring-indigo-500/30"
            disabled={isLoading}
          />
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

// Main App
function App() {
  const [view, setView] = useState('landing')
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [cart, setCart] = useState([])
  const [missions, setMissions] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let sid = null
    try { sid = localStorage.getItem('convos_session_id') } catch(e) {}
    if (!sid) {
      sid = crypto.randomUUID()
      try { localStorage.setItem('convos_session_id', sid) } catch(e) {}
    }
    setSessionId(sid)

    // Check URL params for checkout result
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'success') {
      setView('chat')
      setMessages(prev => [...prev, { role: 'assistant', content: 'Payment successful! Your order has been placed. Thank you for shopping with Convos!' }])
      window.history.replaceState({}, '', window.location.pathname)
    }

    // Seed products
    fetch('/api/products/seed', { method: 'POST' }).then(() => {
      fetch('/api/products').then(r => r.json()).then(data => {
        if (Array.isArray(data)) setProducts(data)
      }).catch(() => {})
    }).catch(() => {})
  }, [])

  const sendMessage = useCallback(async (text) => {
    if (!sessionId || !text.trim()) return
    setIsLoading(true)

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: text })
      })
      const data = await res.json()

      if (data.response) {
        const assistantMsg = {
          role: 'assistant',
          content: data.response.text,
          products: data.response.products || [],
          mission: data.response.mission_created || null,
          negotiation: data.response.negotiation || null,
          checkout_url: data.response.checkout_url || null
        }
        setMessages(prev => [...prev, assistantMsg])
      }

      if (data.cart) setCart(data.cart)
      if (data.missions) setMissions(data.missions)
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, something went wrong. Please try again.' }])
    }
    setIsLoading(false)
  }, [sessionId])

  const startChat = (text) => {
    setView('chat')
    if (text) setTimeout(() => sendMessage(text), 100)
  }

  const addToCart = (product) => {
    sendMessage(`Add ${product.name} to my cart`)
  }

  const negotiate = (product) => {
    const target = Math.round(product.price * 0.8)
    sendMessage(`Can I get ${product.name} for $${target}?`)
  }

  return (
    <div className="min-h-screen bg-background">
      <ConvosHeader
        cart={cart}
        missions={missions}
        onGoHome={() => setView('landing')}
      />
      {view === 'landing' ? (
        <HeroSection onStartChat={startChat} products={products} />
      ) : (
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
          missions={missions}
          onAddToCart={addToCart}
          onNegotiate={negotiate}
        />
      )}
    </div>
  )
}

export default App;
