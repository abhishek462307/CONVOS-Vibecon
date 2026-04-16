'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from 'ai'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  ShoppingCart, Send, User, Search, X, Plus, ArrowRight,
  MessageCircle, Trash2, Loader2, CreditCard, Tag, Sparkles, Bot
} from 'lucide-react'

function ProductCard({ product, onAddToCart, onNegotiate }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card shadow-sm group hover:shadow-md transition-all duration-300">
      <a href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {product.compare_at_price && (
            <div className="absolute top-2.5 left-2.5 bg-gradient-purple text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              SALE
            </div>
          )}
        </div>
      </a>
      <div className="p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85 mb-1">{product.category}</p>
        <a href={`/product/${product.id}`}>
          <h4 className="text-sm font-semibold tracking-tight text-foreground leading-snug hover:text-primary transition-colors">{product.name}</h4>
        </a>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-base font-semibold">${product.price}</span>
          {product.compare_at_price && (
            <span className="text-xs text-muted-foreground line-through">${product.compare_at_price}</span>
          )}
        </div>
        <div className="flex gap-1.5 mt-3">
          <Button 
            size="sm" 
            className="flex-1 h-9 text-xs bg-gradient-purple hover:opacity-90 text-white rounded-xl border-0"
            onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
          >
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
          {product.bargain_enabled && (
            <Button 
              size="sm" 
              variant="outline"
              className="h-9 w-9 rounded-xl"
              onClick={(e) => { e.preventDefault(); onNegotiate(product); }}
            >
              <Tag className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function AgenticChatWidget({ isOpen, onClose }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      // Handle tool results
      console.log('AI finished:', message)
    }
  })
  
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Extract products from tool calls
  const getProductsFromMessage = (message) => {
    const products = []
    
    if (message.toolInvocations) {
      for (const tool of message.toolInvocations) {
        if (tool.toolName === 'search_products' && tool.state === 'result' && Array.isArray(tool.result)) {
          products.push(...tool.result)
        }
      }
    }
    
    return products
  }

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(item => item.id === product.id)
    
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('storage'))
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-purple flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">Mark</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-muted-foreground">AI Shopping Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user'
            const products = getProductsFromMessage(msg)
            
            return (
              <div key={i} className="space-y-2">
                <div className={`flex ${isUser ? 'justify-end' : 'justify-start gap-2'}`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-purple flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    isUser 
                      ? 'bg-foreground text-background rounded-br-sm' 
                      : 'bg-secondary text-foreground rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>

                {/* Product Cards from Tool Results */}
                {products.length > 0 && (
                  <div className="pl-9 space-y-2">
                    {products.map(product => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border rounded-xl p-3 hover:shadow-md transition-all"
                      >
                        <div className="flex gap-3">
                          <a href={`/product/${product.id}`}>
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-16 h-16 rounded-lg object-cover hover:scale-105 transition-transform"
                            />
                          </a>
                          <div className="flex-1 min-w-0">
                            <a href={`/product/${product.id}`}>
                              <p className="text-xs font-semibold hover:text-primary transition-colors truncate">
                                {product.name}
                              </p>
                            </a>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold">${product.price}</span>
                              {product.compare_at_price && (
                                <span className="text-xs text-muted-foreground line-through">
                                  ${product.compare_at_price}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1.5 mt-2">
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-gradient-purple hover:opacity-90 text-white"
                                onClick={() => handleAddToCart(product)}
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add
                              </Button>
                              <a href={`/product/${product.id}`}>
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  View
                                </Button>
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {isLoading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-purple flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about coffee..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function StorePage() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    fetch('/api/products/seed', { method: 'POST' })
      .then(() => fetch('/api/products'))
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data)
      })

    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))

    const handleStorage = () => {
      const c = localStorage.getItem('cart')
      if (c) setCart(JSON.parse(c))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const filteredProducts = category === 'All' 
    ? products 
    : products.filter(p => p.category === category)

  const addToCart = (product) => {
    const newCart = [...cart]
    const existing = newCart.find(item => item.id === product.id)
    
    if (existing) {
      existing.quantity += 1
    } else {
      newCart.push({ ...product, quantity: 1 })
    }
    
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const categories = ['All', 'Single Origin', 'Blends', 'Espresso', 'Decaf', 'Equipment']

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-purple bg-clip-text text-transparent">
            Artisan Coffee Roasters
          </h1>
          <div className="flex items-center gap-3">
            <a href="/login">
              <Button variant="ghost" size="sm"><User className="w-4 h-4 mr-1" /> Login</Button>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="space-y-4">
                  <h3 className="font-semibold">Cart ({cart.length})</h3>
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-sm">${item.price} x {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {cart.length > 0 && (
                    <>
                      <div className="pt-4 border-t">
                        <p className="text-lg font-bold">Total: ${cartTotal.toFixed(2)}</p>
                      </div>
                      <a href="/checkout">
                        <Button className="w-full">Checkout</Button>
                      </a>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-gradient-purple text-white'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onNegotiate={(p) => {
                setChatOpen(true)
                setTimeout(() => {
                  const input = document.querySelector('[placeholder*="Ask"]')
                  if (input) input.value = `Can I get ${p.name} for $${(p.price * 0.85).toFixed(2)}?`
                }, 100)
              }}
            />
          ))}
        </div>
      </div>

      {/* Agentic Chat */}
      {chatOpen && (
        <AgenticChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      )}

      {/* Chat FAB */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-purple rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 transition-transform z-50"
        >
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
        </button>
      )}
    </div>
  )
}
