'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Loader2, ShoppingBag, Sparkles } from 'lucide-react'

function ConvosLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="url(#checkout-g)"/>
      <defs><linearGradient id="checkout-g" x1="8" y1="2" x2="24" y2="28"><stop stopColor="#a855f7"/><stop offset="0.6" stopColor="#ec4899"/><stop offset="1" stopColor="#f97316"/></linearGradient></defs>
    </svg>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  // Shipping form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('USA')

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const u = JSON.parse(savedUser)
      setUser(u)
      setName(u.name || '')
      setEmail(u.email || '')
    }
  }, [])

  const updateQuantity = (productId, delta) => {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    })
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeItem = (productId) => {
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 5.00
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = async () => {
    if (!name || !email || !address || !city || !state || !zip) {
      alert('Please fill in all shipping details')
      return
    }

    setLoading(true)

    try {
      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: user?.id || 'guest',
          items: cart,
          subtotal,
          shipping,
          tax,
          total,
          status: 'pending',
          payment_status: 'unpaid',
          shipping_address: {
            name,
            email,
            street: address,
            city,
            state,
            zip,
            country
          }
        })
      })

      const order = await orderRes.json()

      // Create Stripe checkout
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          orderId: order.id,
          customerEmail: email
        })
      })

      const { url } = await checkoutRes.json()

      if (url) {
        // Clear cart and redirect to Stripe
        localStorage.setItem('cart', JSON.stringify([]))
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-card mx-auto mb-4">
            <ShoppingBag className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="text-[28px] font-semibold tracking-tight mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some items from the store to get started.</p>
          <Button onClick={() => router.push('/')} className="h-11 rounded-2xl px-6 font-semibold tracking-tight">
            <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/70 bg-card/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="rounded-xl h-9 font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
            </Button>
            <div className="flex items-center gap-2.5">
              <ConvosLogo size={22} />
              <h1 className="text-base font-semibold tracking-tight">Checkout</h1>
            </div>
          </div>
          <span className="rounded-full border border-border/70 bg-secondary px-3 py-0.5 text-xs font-semibold">{cart.length} items</span>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85 mb-1">Step 1</p>
              <h2 className="text-base font-semibold tracking-tight mb-5">Shipping Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">Full Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="h-11 rounded-2xl border-border/70 bg-secondary/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="h-11 rounded-2xl border-border/70 bg-secondary/20" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">Address</label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" required className="h-11 rounded-2xl border-border/70 bg-secondary/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="San Francisco" required className="h-11 rounded-2xl border-border/70 bg-secondary/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">State</label>
                  <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="CA" required className="h-11 rounded-2xl border-border/70 bg-secondary/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">ZIP Code</label>
                  <Input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="94102" required className="h-11 rounded-2xl border-border/70 bg-secondary/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">Country</label>
                  <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="USA" required className="h-11 rounded-2xl border-border/70 bg-secondary/20" />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85 mb-1">Step 2</p>
              <h2 className="text-base font-semibold tracking-tight mb-5">Cart Items</h2>
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="rounded-[18px] border border-border/70 bg-secondary/20 p-3.5 flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-[14px] object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold tracking-tight">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                      <p className="text-sm font-semibold tracking-tight mt-1">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-xl border-border/70" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus className="w-3.5 h-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-xl border-border/70" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl text-destructive hover:text-destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card p-5 sticky top-20">
              <h2 className="text-base font-semibold tracking-tight mb-4">Order Summary</h2>
              <div className="space-y-2.5 mb-4">
                <div className="rounded-[16px] border border-border/70 bg-secondary/20 px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Subtotal</span>
                  <span className="text-sm font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="rounded-[16px] border border-border/70 bg-secondary/20 px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Shipping</span>
                  <span className="text-sm font-semibold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="rounded-[16px] border border-border/70 bg-secondary/20 px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Tax (8%)</span>
                  <span className="text-sm font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="rounded-[16px] border border-border/70 bg-foreground px-4 py-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-background">Total</span>
                  <span className="text-lg font-semibold tracking-tight text-background">${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="rounded-[16px] border border-border/70 bg-secondary/20 px-4 py-3 mb-4 text-xs text-muted-foreground">
                  Add <span className="font-semibold text-foreground">${(50 - subtotal).toFixed(2)}</span> more for FREE shipping!
                </div>
              )}

              <Button
                className="w-full h-11 rounded-2xl bg-foreground hover:opacity-80 text-background font-semibold tracking-tight border-0"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                ) : (
                  <><CreditCard className="w-4 h-4 mr-2" />Proceed to Payment</>
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 mt-4">
                <Sparkles className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Secure checkout powered by Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
