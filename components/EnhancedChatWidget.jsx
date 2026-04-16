'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, X, Plus, ArrowRight, Loader2, CreditCard, Tag, Trash2 } from 'lucide-react'

function ConvosLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="url(#convos-g)"/>
      <defs><linearGradient id="convos-g" x1="8" y1="2" x2="24" y2="28"><stop stopColor="#a855f7"/><stop offset="0.6" stopColor="#ec4899"/><stop offset="1" stopColor="#f97316"/></linearGradient></defs>
    </svg>
  )
}

export default function EnhancedChatWidget({ messages, isLoading, onSend, onClear, isOpen, onToggle }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSend(input)
    setInput('')
  }

  const handleQuickAction = (product, action) => {
    if (action === 'add') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existing = cart.find(item => item.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        cart.push({ ...product, quantity: 1 })
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('storage')) // Trigger cart update
    }
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-[24px] overflow-hidden shadow-2xl border border-border/70">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-card">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-purple flex items-center justify-center text-white shadow-md">
            <ConvosLogo size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight">Convos AI</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-muted-foreground">Shopping assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClear} className="p-1.5 rounded-xl hover:bg-secondary/60 text-muted-foreground transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onToggle} className="p-1.5 rounded-xl hover:bg-secondary/60 text-muted-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user'
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  {/* Message Bubble */}
                  <div className={`flex ${isUser ? 'justify-end' : 'justify-start gap-2'}`}>
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
                  </div>
                  
                  {/* Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2 pl-9">
                      {msg.products.map(p => (
                        <motion.div 
                          key={p.id} 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="rounded-[16px] border border-border/70 bg-card p-3 shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="flex gap-3">
                            <a href={`/product/${p.id}`} className="flex-shrink-0">
                              <img 
                                src={p.image} 
                                alt={p.name} 
                                className="w-16 h-16 rounded-[12px] object-cover group-hover:scale-105 transition-transform" 
                              />
                            </a>
                            <div className="flex-1 min-w-0">
                              <a href={`/product/${p.id}`} className="block">
                                <p className="text-xs font-semibold tracking-tight hover:text-primary transition-colors line-clamp-1">{p.name}</p>
                              </a>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{p.category}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-bold text-foreground">${p.price}</span>
                                {p.compare_at_price && (
                                  <span className="text-xs text-muted-foreground line-through">${p.compare_at_price}</span>
                                )}
                              </div>
                              <div className="flex gap-1.5 mt-2">
                                <Button 
                                  size="sm" 
                                  className="h-7 text-[10px] px-2 bg-gradient-purple hover:opacity-90 text-white rounded-lg border-0 font-semibold"
                                  onClick={(e) => {
                                    handleQuickAction(p, 'add')
                                    const btn = e.target.closest('button')
                                    const orig = btn.innerHTML
                                    btn.innerHTML = '✓ Added'
                                    setTimeout(() => btn.innerHTML = orig, 1500)
                                  }}
                                >
                                  <Plus className="w-3 h-3 mr-1" /> Add
                                </Button>
                                <a href={`/product/${p.id}`}>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 text-[10px] px-2 rounded-lg border-border/70"
                                  >
                                    Details
                                  </Button>
                                </a>
                                {p.bargain_enabled && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 text-[10px] px-2 rounded-lg text-muted-foreground hover:text-foreground"
                                    onClick={() => onSend(`Can I get ${p.name} for $${(p.price * 0.85).toFixed(2)}?`)}
                                  >
                                    <Tag className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {/* Checkout Button */}
                  {msg.checkout_url && (
                    <div className="pl-9">
                      <a href={msg.checkout_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="h-9 rounded-xl bg-gradient-purple hover:opacity-90 text-white border-0 text-xs font-semibold">
                          <CreditCard className="w-3 h-3 mr-1.5" /> Complete Checkout <ArrowRight className="w-3 h-3 ml-1.5" />
                        </Button>
                      </a>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Loading State */}
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
      <div className="p-3 border-t border-border/70 bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about products..."
            className="flex-1 h-10 rounded-xl border-border/70 text-sm"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-10 w-10 rounded-xl bg-gradient-purple hover:opacity-90 border-0"
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
