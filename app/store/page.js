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

const PAYMENT_LOGOS = [
  { name: 'Stripe', src: 'https://convos.store/_next/image?url=%2Flogos%2FStripe%20wordmark%20-%20White%20-%20Large.png&w=1200&q=75', h: 24 },
  { name: 'Visa', src: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg', h: 14 },
  { name: 'Mastercard', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg', h: 20 },
  { name: 'Apple Pay', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg', h: 18 },
  { name: 'Google Pay', src: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg', h: 18 },
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

function ProductCard({ product, onAddToCart, onNegotiate, onOpen }) {
  const [added, setAdded] = useState(false)
  const handleAdd = (e) => {
    e.stopPropagation()
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
      onClick={() => onOpen(product)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border ${border_tan} hover:border-[#B8732A] hover:shadow-lg transition-all duration-300 cursor-pointer`}
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
        {/* Quick view hint on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white/90 backdrop-blur-sm text-[#4A2512] text-xs font-bold px-3 py-1.5 rounded-full shadow">
            Quick View
          </span>
        </div>
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
              onClick={e => { e.stopPropagation(); onNegotiate(product) }}
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

// ── Product Detail Popup ────────────────────────────────────
function ProductPopup({ product, onClose, onAddToCart, onNegotiate }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const discount = product.compare_at_price > product.price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product)
    setAdded(true)
    setTimeout(() => { setAdded(false) }, 1800)
  }

  const handleNegotiate = () => {
    onNegotiate(product)
    onClose()
  }

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: 'rgba(28,10,4,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl"
          style={{ maxHeight: '90vh' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="grid md:grid-cols-2" style={{ maxHeight: '90vh' }}>

            {/* Left — Image */}
            <div className="relative bg-[#F5EBE0] aspect-square md:aspect-auto overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {discount > 0 && (
                  <span className="bg-[#B8732A] text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wide uppercase shadow">
                    -{discount}% OFF
                  </span>
                )}
                {product.bargain_enabled && (
                  <span className="bg-[#4A2512] text-[#F5EBE0] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <Zap className="w-3 h-3" /> AI Price
                  </span>
                )}
              </div>
            </div>

            {/* Right — Details */}
            <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '90vh' }}>
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #F5EBE0' }}>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1.5" style={{ color: '#B8732A' }}>{product.category}</p>
                  <h2 className="text-xl font-extrabold leading-tight" style={{ color: '#1C0A04' }}>{product.name}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-3 transition-all hover:bg-[#F5EBE0]"
                  style={{ color: '#9B7B6B' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price */}
              <div className="px-6 py-4" style={{ borderBottom: '1px solid #F5EBE0' }}>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold tracking-tight" style={{ color: '#1C0A04' }}>${product.price}</span>
                  {product.compare_at_price > product.price && (
                    <span className="text-base line-through font-medium" style={{ color: '#C4A898' }}>${product.compare_at_price}</span>
                  )}
                  {discount > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Save ${(product.compare_at_price - product.price).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.weight && (
                  <p className="text-xs mt-1" style={{ color: '#9B7B6B' }}>{product.weight} · {product.category}</p>
                )}
              </div>

              {/* Description */}
              <div className="px-6 py-4 flex-1">
                <p className="text-sm leading-relaxed" style={{ color: '#6B3A2A' }}>{product.description}</p>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {product.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#F5EBE0', color: '#7C4B2A', border: '1px solid #E5D0BC' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stock */}
                {product.stock !== undefined && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.stock > 20 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <p className="text-xs font-semibold" style={{ color: '#9B7B6B' }}>
                      {product.stock > 20 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
                    </p>
                  </div>
                )}

                {/* AI Bargain info */}
                {product.bargain_enabled && (
                  <div className="mt-4 rounded-xl px-4 py-3 flex items-start gap-2.5" style={{ background: '#F5EBE0', border: '1px solid #E5D0BC' }}>
                    <Zap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#B8732A' }} />
                    <div>
                      <p className="text-xs font-bold" style={{ color: '#4A2512' }}>AI Price Negotiation Available</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#9B7B6B' }}>
                        Our AI can negotiate a better price for you. Best deal starts at ${product.bargain_min_price || 'flexible'}.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity + Actions */}
              <div className="px-6 pb-6 pt-4 space-y-3" style={{ borderTop: '1px solid #F5EBE0' }}>
                {/* Qty selector */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: '#4A2512' }}>Quantity</span>
                  <div className="flex items-center gap-3 rounded-xl px-4 py-2" style={{ border: '1px solid #E5D0BC', background: '#FAF6F1' }}>
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                      style={{ color: '#9B7B6B' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#4A2512'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9B7B6B'}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-extrabold w-5 text-center" style={{ color: '#1C0A04' }}>{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                      style={{ color: '#9B7B6B' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#4A2512'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9B7B6B'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs" style={{ color: '#9B7B6B' }}>Total</span>
                  <span className="text-lg font-extrabold" style={{ color: '#1C0A04' }}>
                    ${(product.price * qty).toFixed(2)}
                  </span>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className="w-full h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  style={{ background: added ? '#059669' : '#4A2512', color: 'white' }}
                  onMouseEnter={e => { if (!added) e.currentTarget.style.background = '#6B3A2A' }}
                  onMouseLeave={e => { if (!added) e.currentTarget.style.background = '#4A2512' }}
                >
                  {added
                    ? <><span className="text-base">✓</span> Added to Cart!</>
                    : <><ShoppingCart className="w-4 h-4" /> Add {qty > 1 ? `${qty} items` : 'to Cart'}</>}
                </button>

                {/* Negotiate */}
                {product.bargain_enabled && (
                  <button
                    onClick={handleNegotiate}
                    className="w-full h-10 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                    style={{ border: '1px solid #E5D0BC', background: '#FAF6F1', color: '#7C4B2A' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8732A'; e.currentTarget.style.background = '#F5EBE0' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5D0BC'; e.currentTarget.style.background = '#FAF6F1' }}
                  >
                    <Tag className="w-3.5 h-3.5" /> Negotiate Price with AI
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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

// Simple markdown renderer: **bold**, *italic*, newlines
function renderMarkdown(text) {
  if (!text) return null
  // Split by double newlines for paragraphs, single newlines for breaks
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 700, color: 'inherit' }}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    // Handle line breaks within plain text
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
    ))
  })
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
      className="w-[360px] flex-shrink-0 flex flex-col bg-white"
      style={{ borderLeft: '1px solid #E5D0BC', height: 'calc(100vh - 56px)', position: 'sticky', top: '56px' }}
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
                    {renderMarkdown(msg.content)}
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

// ── Product Focus Panel (single product, embedded) ─────────────
function ProductFocusPanel({ product, onClose, onAddToCart, onNegotiate }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const discount = product.compare_at_price > product.price
    ? Math.round((1 - product.price / product.compare_at_price) * 100) : 0

  return (
    <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: '#FAF6F1' }}>
      {/* Back bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white sticky top-0 z-10" style={{ borderBottom: '1px solid #E5D0BC' }}>
        <button onClick={onClose} className="flex items-center gap-1.5 text-xs font-semibold transition-colors" style={{ color: '#9B7B6B' }}
          onMouseEnter={e => e.currentTarget.style.color = '#4A2512'} onMouseLeave={e => e.currentTarget.style.color = '#9B7B6B'}>
          ← Back to store
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#B8732A' }}>Product Detail</span>
      </div>

      <div className="max-w-2xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Hero image */}
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#F5EBE0]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {discount > 0 && <span className="absolute top-4 left-4 text-[10px] font-black px-3 py-1 rounded-full text-white uppercase" style={{ background: '#B8732A' }}>-{discount}% OFF</span>}
          {product.bargain_enabled && <span className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full text-[#F5EBE0]" style={{ background: '#4A2512' }}><Zap className="w-3 h-3" /> AI Price</span>}
        </div>

        {/* Info */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: '#B8732A' }}>{product.category}</p>
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#1C0A04' }}>{product.name}</h2>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-extrabold" style={{ color: '#1C0A04' }}>${product.price}</span>
            {product.compare_at_price > product.price && <span className="text-base line-through font-medium" style={{ color: '#C4A898' }}>${product.compare_at_price}</span>}
            {discount > 0 && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Save ${(product.compare_at_price - product.price).toFixed(2)}</span>}
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B3A2A' }}>{product.description}</p>
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.tags.map(t => <span key={t} className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#F5EBE0', color: '#7C4B2A', border: '1px solid #E5D0BC' }}>{t}</span>)}
            </div>
          )}
          {product.stock !== undefined && (
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${product.stock > 20 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <p className="text-xs font-semibold" style={{ color: '#9B7B6B' }}>{product.stock > 20 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}</p>
            </div>
          )}
          {product.bargain_enabled && (
            <div className="rounded-xl px-4 py-3 flex items-start gap-2.5 mb-4" style={{ background: '#F5EBE0', border: '1px solid #E5D0BC' }}>
              <Zap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#B8732A' }} />
              <div><p className="text-xs font-bold" style={{ color: '#4A2512' }}>AI Negotiation Available</p><p className="text-[10px] mt-0.5" style={{ color: '#9B7B6B' }}>Best deal starts at ${product.bargain_min_price || 'flexible'}</p></div>
            </div>
          )}
        </div>

        {/* Qty + actions */}
        <div className="space-y-3 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: '#4A2512' }}>Quantity</span>
            <div className="flex items-center gap-3 rounded-xl px-4 py-2" style={{ border: '1px solid #E5D0BC', background: '#FAF6F1' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ color: '#9B7B6B' }}><Minus className="w-3.5 h-3.5" /></button>
              <span className="text-sm font-extrabold w-5 text-center" style={{ color: '#1C0A04' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ color: '#9B7B6B' }}><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className="flex justify-between px-1"><span className="text-xs" style={{ color: '#9B7B6B' }}>Total</span><span className="text-lg font-extrabold" style={{ color: '#1C0A04' }}>${(product.price * qty).toFixed(2)}</span></div>
          <button onClick={() => { for(let i=0;i<qty;i++) onAddToCart(product); setAdded(true); setTimeout(()=>setAdded(false),2000) }}
            className="w-full h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all text-white"
            style={{ background: added ? '#059669' : '#4A2512' }}>
            {added ? '✓ Added to Cart!' : <><ShoppingCart className="w-4 h-4" /> Add {qty > 1 ? `${qty} ×` : ''} to Cart — ${(product.price * qty).toFixed(2)}</>}
          </button>
          {product.bargain_enabled && (
            <button onClick={() => onNegotiate(product)} className="w-full h-10 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              style={{ border: '1px solid #E5D0BC', background: '#FAF6F1', color: '#7C4B2A' }}>
              <Tag className="w-3.5 h-3.5" /> Negotiate Price with AI
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Category / Results Panel ──────────────────────────────────
function CategoryFocusPanel({ title, panelProducts, onClose, onAddToCart, onNegotiate, onOpenProduct }) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: '#FAF6F1' }}>
      <div className="flex items-center justify-between px-6 py-3 bg-white sticky top-0 z-10" style={{ borderBottom: '1px solid #E5D0BC' }}>
        <button onClick={onClose} className="flex items-center gap-1.5 text-xs font-semibold transition-colors" style={{ color: '#9B7B6B' }}
          onMouseEnter={e => e.currentTarget.style.color = '#4A2512'} onMouseLeave={e => e.currentTarget.style.color = '#9B7B6B'}>
          ← Browse all
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#B8732A' }}>{title} · {panelProducts.length} items</span>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-extrabold mb-1" style={{ color: '#1C0A04' }}>{title}</h2>
        <p className="text-xs mb-5" style={{ color: '#9B7B6B' }}>{panelProducts.length} product{panelProducts.length !== 1 ? 's' : ''} recommended by AI</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {panelProducts.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNegotiate={onNegotiate} onOpen={onOpenProduct} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Comparison Panel ──────────────────────────────────────────
function ComparisonPanel({ panelProducts, onClose, onAddToCart, onNegotiate }) {
  const [addedId, setAddedId] = useState(null)

  // Pick best value product (lowest price) and premium (highest price)
  const sortedByPrice = [...panelProducts].sort((a, b) => a.price - b.price)
  const bestValue = sortedByPrice[0]
  const premium = sortedByPrice[sortedByPrice.length - 1]

  const handleAdd = (p) => {
    onAddToCart(p)
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  const features = [
    {
      icon: '💰',
      label: 'Price',
      render: (p) => {
        const isCheapest = p.id === bestValue?.id
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-extrabold" style={{ color: '#1C0A04' }}>${p.price}</span>
            {p.compare_at_price > p.price && (
              <span className="text-xs line-through" style={{ color: '#C4A898' }}>${p.compare_at_price}</span>
            )}
            {isCheapest && panelProducts.length > 1 && (
              <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200">Best Value</span>
            )}
          </div>
        )
      }
    },
    {
      icon: '📦',
      label: 'Category',
      render: (p) => <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#F5EBE0', color: '#7C4B2A', border: '1px solid #E5D0BC' }}>{p.category}</span>
    },
    {
      icon: '⚖️',
      label: 'Weight',
      render: (p) => <span className="text-sm font-semibold" style={{ color: '#4A2512' }}>{p.weight || '—'}</span>
    },
    {
      icon: '🤖',
      label: 'AI Deal',
      render: (p) => p.bargain_enabled
        ? <div className="flex flex-col items-center gap-0.5"><span className="text-xs font-bold" style={{ color: '#059669' }}>Available</span><span className="text-[10px]" style={{ color: '#9B7B6B' }}>from ${p.bargain_min_price}</span></div>
        : <span className="text-xs" style={{ color: '#C4A898' }}>Not available</span>
    },
    {
      icon: '📊',
      label: 'Stock',
      render: (p) => (
        <div className="flex flex-col items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${(p.stock || 0) > 20 ? 'bg-emerald-500' : (p.stock || 0) > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
          <span className="text-xs font-semibold" style={{ color: (p.stock || 0) > 20 ? '#059669' : '#D97706' }}>
            {(p.stock || 0) > 20 ? 'In Stock' : (p.stock || 0) > 0 ? `${p.stock} left` : 'Sold Out'}
          </span>
        </div>
      )
    },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: '#FAF6F1' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white sticky top-0 z-10" style={{ borderBottom: '1px solid #E5D0BC' }}>
        <button onClick={onClose} className="flex items-center gap-1.5 text-xs font-semibold transition-colors" style={{ color: '#9B7B6B' }}
          onMouseEnter={e => e.currentTarget.style.color = '#4A2512'} onMouseLeave={e => e.currentTarget.style.color = '#9B7B6B'}>
          ← Back to store
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#B8732A' }}>AI Comparison</span>
      </div>

      <div className="p-6 pb-12 max-w-4xl mx-auto w-full">
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1C0A04' }}>Side-by-Side Comparison</h2>
          <p className="text-sm" style={{ color: '#9B7B6B' }}>
            Comparing <strong style={{ color: '#4A2512' }}>{panelProducts.length} products</strong> · AI highlights the best pick for you
          </p>
        </div>

        {/* Product header cards */}
        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${panelProducts.length}, 1fr)` }}>
          {panelProducts.map(p => {
            const isBest = p.id === bestValue?.id
            return (
              <div key={p.id} className="relative rounded-2xl overflow-hidden flex flex-col"
                style={isBest
                  ? { border: '2px solid #B8732A', background: '#FFFAF5', boxShadow: '0 4px 20px rgba(184,115,42,0.15)' }
                  : { border: '1px solid #E5D0BC', background: '#FFFFFF', boxShadow: '0 1px 4px rgba(74,37,18,0.06)' }}>

                {/* Best pick ribbon */}
                {isBest && (
                  <div className="absolute top-0 left-0 right-0 py-1.5 text-center text-[10px] font-black uppercase tracking-widest text-white z-10"
                    style={{ background: 'linear-gradient(90deg, #B8732A, #6B3A2A)' }}>
                    ⭐ AI Best Pick
                  </div>
                )}

                {/* Product image */}
                <div className={`relative overflow-hidden ${isBest ? 'mt-7' : ''}`} style={{ aspectRatio: '1', background: '#F5EBE0' }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  {p.compare_at_price > p.price && (
                    <span className="absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white" style={{ background: '#B8732A' }}>
                      -{Math.round((1 - p.price / p.compare_at_price) * 100)}%
                    </span>
                  )}
                </div>

                {/* Product name + price */}
                <div className="p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#B8732A' }}>{p.category}</p>
                  <h3 className="text-base font-extrabold leading-tight mb-2" style={{ color: '#1C0A04' }}>{p.name}</h3>
                  <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: '#9B7B6B' }}>{p.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold" style={{ color: '#1C0A04' }}>${p.price}</span>
                    {p.compare_at_price > p.price && (
                      <span className="text-sm line-through" style={{ color: '#C4A898' }}>${p.compare_at_price}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Feature comparison rows */}
        <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid #E5D0BC' }}>
          {features.map((feat, fi) => (
            <div key={feat.label} className="grid items-center"
              style={{
                gridTemplateColumns: `140px repeat(${panelProducts.length}, 1fr)`,
                background: fi % 2 === 0 ? '#FFFFFF' : '#FAF6F1',
                borderBottom: fi < features.length - 1 ? '1px solid #F0E8DE' : 'none'
              }}>
              {/* Feature label */}
              <div className="px-5 py-4 flex items-center gap-2.5">
                <span className="text-base">{feat.icon}</span>
                <span className="text-xs font-bold" style={{ color: '#6B3A2A' }}>{feat.label}</span>
              </div>
              {/* Values per product */}
              {panelProducts.map(p => (
                <div key={p.id} className="px-4 py-4 text-center flex items-center justify-center"
                  style={p.id === bestValue?.id ? { background: 'rgba(184,115,42,0.04)' } : {}}>
                  {feat.render(p)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${panelProducts.length}, 1fr)` }}>
          {panelProducts.map(p => {
            const isBest = p.id === bestValue?.id
            return (
              <div key={p.id} className="space-y-2">
                <button
                  onClick={() => handleAdd(p)}
                  className="w-full h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 text-white transition-all"
                  style={{ background: addedId === p.id ? '#059669' : isBest ? '#B8732A' : '#4A2512' }}>
                  {addedId === p.id
                    ? '✓ Added to Cart!'
                    : <><ShoppingCart className="w-4 h-4" /> {isBest ? '⭐ Add Best Pick' : 'Add to Cart'}</>}
                </button>
                {p.bargain_enabled && (
                  <button
                    onClick={() => onNegotiate(p)}
                    className="w-full h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    style={{ border: '1px solid #E5D0BC', background: '#FAF6F1', color: '#7C4B2A' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8732A'; e.currentTarget.style.background = '#F5EBE0' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5D0BC'; e.currentTarget.style.background = '#FAF6F1' }}>
                    <Tag className="w-3.5 h-3.5" /> Negotiate Price
                  </button>
                )}
              </div>
            )
          })}
        </div>
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
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [contextPanel, setContextPanel] = useState(null)
  // contextPanel: null | { type: 'product'|'category'|'comparison', data: any, title?: string }

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

        // ── Smart context panel detection ────────────────────
        const prods = data.response.products || []
        const isComparison = /compar|vs\b|versus|difference|better|which.*best|side.by.side/i.test(text)
        const isCategoryBrowse = /show.*all|all.*product|browse|list|what.*do you have/i.test(text)

        if (prods.length === 1 && !isCategoryBrowse) {
          // Single product mentioned → product focus panel
          setContextPanel({ type: 'product', data: prods[0] })
        } else if (prods.length >= 2 && isComparison) {
          // Multiple products + compare intent → comparison panel
          setContextPanel({ type: 'comparison', data: prods })
        } else if (prods.length >= 2) {
          // Multiple products → category/results panel
          const title = prods.every(p => p.category === prods[0].category) ? prods[0].category : 'Recommended for you'
          setContextPanel({ type: 'category', data: prods, title })
        } else if (prods.length === 0 && /bye|thanks|ok|great|awesome|got it/i.test(text)) {
          // Closing phrase → clear panel
          setContextPanel(null)
        }
        // If no products in response, keep existing context
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
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: '#FAF6F1', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#1C0A04' }}>

      {/* Announcement bar */}
      <div className="shrink-0 text-center py-2 text-[11px] font-semibold tracking-wide text-white" style={{ background: 'linear-gradient(90deg, #3A1A0A, #6B3A2A, #3A1A0A)' }}>
        {store?.banner || '✦ FREE GLOBAL SHIPPING OVER $100 · USE CODE WELCOME FOR 10% OFF ✦'}
      </div>

      {/* Navbar */}
      <nav className="shrink-0 bg-white z-40" style={{ borderBottom: '1px solid #E5D0BC', boxShadow: '0 1px 4px rgba(74,37,18,0.06)' }}>
        <div className="px-4 sm:px-6 flex items-center justify-between gap-4" style={{ height: '52px' }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4A2512, #7C4B2A)' }}>
              <svg width="11" height="11" viewBox="0 0 32 32" fill="none"><path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="white" /></svg>
            </div>
            <span className="text-sm font-extrabold tracking-tight" style={{ color: '#1C0A04' }}>{store?.name || 'Artisan Coffee'}</span>
          </div>

          {/* Category tabs */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {CATEGORIES.map(c => (
              <button key={c.name} onClick={() => { setSelectedCategory(c.name); setContextPanel(null) }}
                className="px-3 py-1.5 text-[13px] rounded-xl transition-all font-semibold"
                style={selectedCategory === c.name && !contextPanel ? { background: '#F5EBE0', color: '#4A2512', border: '1px solid #E5D0BC' } : { color: '#9B7B6B' }}
                onMouseEnter={e => { if (selectedCategory !== c.name) e.currentTarget.style.color = '#4A2512' }}
                onMouseLeave={e => { if (selectedCategory !== c.name) e.currentTarget.style.color = '#9B7B6B' }}>
                {c.name}
              </button>
            ))}
          </div>

          {/* Search + Cart */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#C4A898' }} />
              <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setContextPanel(null) }} placeholder="Search…"
                className="pl-8 pr-3 h-8 w-36 rounded-xl text-[12px] outline-none"
                style={{ background: '#FAF6F1', border: '1px solid #E5D0BC', color: '#1C0A04' }}
                onFocus={e => e.target.style.borderColor = '#B8732A'} onBlur={e => e.target.style.borderColor = '#E5D0BC'} />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <button className="relative h-8 w-8 rounded-xl flex items-center justify-center"
                  style={{ border: '1px solid #E5D0BC', background: '#FFFFFF', color: '#9B7B6B' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8732A'; e.currentTarget.style.color = '#4A2512'; e.currentTarget.style.background = '#F5EBE0' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5D0BC'; e.currentTarget.style.color = '#9B7B6B'; e.currentTarget.style.background = '#FFFFFF' }}>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[9px] font-black flex items-center justify-center text-white" style={{ background: '#4A2512' }}>{cartCount}</span>}
                </button>
              </SheetTrigger>
              <SheetContent className="w-[360px] flex flex-col" style={{ background: '#FFFFFF', borderLeft: '1px solid #E5D0BC', color: '#1C0A04' }}>
                <SheetHeader className="pb-4 shrink-0" style={{ borderBottom: '1px solid #E5D0BC' }}>
                  <SheetTitle className="flex items-center gap-2 text-base font-bold" style={{ color: '#1C0A04' }}>
                    <ShoppingCart className="w-4 h-4" style={{ color: '#9B7B6B' }} /> Your Cart
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ border: '1px solid #E5D0BC', background: '#F5EBE0', color: '#6B3A2A' }}>{cartCount}</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto mt-4 space-y-2.5">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16"><ShoppingCart className="w-10 h-10 mb-3" style={{ color: '#C4A898' }} /><p className="text-sm font-medium" style={{ color: '#9B7B6B' }}>Your cart is empty</p></div>
                  ) : cart.map((item, i) => (
                    <div key={i} className="rounded-xl p-3 flex gap-3 items-center" style={{ border: '1px solid #E5D0BC', background: '#FAF6F1' }}>
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: '#1C0A04' }}>{item.name}</p>
                        <p className="text-xs font-bold" style={{ color: '#B8732A' }}>${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ border: '1px solid #E5D0BC', background: '#FFFFFF', color: '#9B7B6B' }}><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-bold w-5 text-center" style={{ color: '#1C0A04' }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ border: '1px solid #E5D0BC', background: '#FFFFFF', color: '#9B7B6B' }}><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="pt-4 mt-4 space-y-3 shrink-0" style={{ borderTop: '1px solid #E5D0BC' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium" style={{ color: '#6B3A2A' }}>Total</span>
                      <span className="text-xl font-extrabold" style={{ color: '#1C0A04' }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <a href="/checkout"><button className={`w-full h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${btn_primary}`}>Checkout <ArrowRight className="w-4 h-4" /></button></a>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main: two-pane layout fills remaining viewport */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Left: context panel OR scrollable product browse */}
        {contextPanel ? (
          <div className="flex-1 min-w-0 flex overflow-hidden">
            {contextPanel.type === 'product' && <ProductFocusPanel product={contextPanel.data} onClose={() => setContextPanel(null)} onAddToCart={addToCart} onNegotiate={negotiate} />}
            {contextPanel.type === 'category' && <CategoryFocusPanel title={contextPanel.title || 'Recommended'} panelProducts={contextPanel.data} onClose={() => setContextPanel(null)} onAddToCart={addToCart} onNegotiate={negotiate} onOpenProduct={setSelectedProduct} />}
            {contextPanel.type === 'comparison' && <ComparisonPanel panelProducts={contextPanel.data} onClose={() => setContextPanel(null)} onAddToCart={addToCart} onNegotiate={negotiate} />}
          </div>
        ) : (
          <div className="flex-1 min-w-0 overflow-y-auto">
            {/* Compact hero */}
            <div className="relative overflow-hidden shrink-0" style={{ height: '148px' }}>
              <img src={store?.hero_image || 'https://images.unsplash.com/photo-1447933601403-56dc2e4c4949?w=1400&h=400&fit=crop'} alt="hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(28,10,4,0.82) 0%, rgba(28,10,4,0.35) 60%, transparent 100%)' }} />
              <div className="absolute inset-0 flex items-center px-7 gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3 h-3 shrink-0" style={{ color: '#F5D5A8' }} />
                    <span className="text-white text-[10px] font-semibold uppercase tracking-wider">AI-Powered Shopping</span>
                  </div>
                  <h1 className="text-xl font-extrabold text-white leading-tight">{store?.name || 'Artisan Coffee Roasters'}</h1>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{store?.description || 'Premium coffees, roasted fresh to order.'}</p>
                </div>
                <div className="flex flex-col gap-1 text-[10px] font-medium shrink-0" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <span className="flex items-center gap-1"><TruckIcon className="w-3 h-3" /> Free shipping $100+</span>
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure checkout</span>
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI negotiates prices</span>
                </div>
              </div>
            </div>

            {/* Category pills strip */}
            <div className="px-5 py-2.5 bg-white flex items-center gap-2 overflow-x-auto shrink-0" style={{ borderBottom: '1px solid #E5D0BC', scrollbarWidth: 'none' }}>
              {CATEGORIES.map(c => (
                <button key={c.name} onClick={() => setSelectedCategory(c.name)}
                  className="flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-all"
                  style={selectedCategory === c.name ? { background: '#4A2512', color: '#FFFFFF' } : { background: '#F5EBE0', color: '#6B3A2A', border: '1px solid #E5D0BC' }}
                  onMouseEnter={e => { if (selectedCategory !== c.name) { e.currentTarget.style.background = '#EDD9C5'; e.currentTarget.style.color = '#4A2512' } }}
                  onMouseLeave={e => { if (selectedCategory !== c.name) { e.currentTarget.style.background = '#F5EBE0'; e.currentTarget.style.color = '#6B3A2A' } }}>
                  {c.image && <img src={c.image} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />}
                  {c.name}
                </button>
              ))}
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="flex items-center gap-1 text-xs font-semibold shrink-0 ml-auto" style={{ color: '#B8732A' }}>
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Products grid */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-extrabold" style={{ color: '#1C0A04' }}>{selectedCategory === 'All' ? 'All Products' : selectedCategory}</span>
                  <span className="ml-2 text-xs" style={{ color: '#C4A898' }}>{filteredProducts.length} items</span>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: '#F5EBE0' }}>
                    <Search className="w-5 h-5" style={{ color: '#C4A898' }} />
                  </div>
                  <p className="font-bold text-sm mb-1" style={{ color: '#4A2512' }}>No products found</p>
                  <p className="text-xs" style={{ color: '#9B7B6B' }}>Try a different category or search</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} onNegotiate={negotiate} onOpen={setSelectedProduct} />)}
                </div>
              )}

              <div className="mt-8 pt-4 flex items-center justify-between text-xs" style={{ borderTop: '1px solid #E5D0BC', color: '#C4A898' }}>
                <span className="font-bold" style={{ color: '#4A2512' }}>{store?.name || 'Artisan Coffee'}</span>
                <span>Powered by <span className="font-semibold" style={{ color: '#B8732A' }}>Convos AI</span></span>
              </div>
            </div>
          </div>
        )}

        {/* Right: Chat panel */}
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

      {/* Product Detail Popup */}
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onNegotiate={p => { negotiate(p); setSelectedProduct(null) }}
        />
      )}

      {/* Chat FAB */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setChatOpen(true)}
          className="fixed bottom-5 right-5 w-12 h-12 rounded-2xl flex items-center justify-center text-white z-50"
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
