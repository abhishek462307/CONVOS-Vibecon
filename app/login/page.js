'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Coffee, User, Store, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Customer Login
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPassword, setCustomerPassword] = useState('')

  // Merchant Login
  const [merchantEmail, setMerchantEmail] = useState('')
  const [merchantPassword, setMerchantPassword] = useState('')

  // Customer Sign Up
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  const handleCustomerLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerEmail, password: customerPassword, type: 'customer' })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleMerchantLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: merchantEmail, password: merchantPassword, type: 'merchant' })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/merchant')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword, type: 'customer' })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/')
      } else {
        setError(data.message || 'Signup failed')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Coffee className="w-10 h-10 text-[#8B6F47]" />
            <h1 className="text-4xl font-bold text-foreground">Convos</h1>
          </div>
          <p className="text-muted-foreground">Agentic Commerce Platform</p>
        </div>

        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Customer
            </TabsTrigger>
            <TabsTrigger value="merchant" className="flex items-center gap-2">
              <Store className="w-4 h-4" /> Merchant
            </TabsTrigger>
          </TabsList>

          {/* Customer Tab */}
          <TabsContent value="customer">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Login */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Customer Login</h2>
                <form onSubmit={handleCustomerLogin} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      value={customerPassword}
                      onChange={(e) => setCustomerPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                    <strong>Demo:</strong> customer@demo.com / password123
                  </div>
                </form>
              </Card>

              {/* Signup */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Create Account</h2>
                <form onSubmit={handleCustomerSignup} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => router.push('/')}>
                Continue as Guest <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </TabsContent>

          {/* Merchant Tab */}
          <TabsContent value="merchant">
            <div className="max-w-md mx-auto">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Merchant Dashboard Access</h2>
                <form onSubmit={handleMerchantLogin} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={merchantEmail}
                      onChange={(e) => setMerchantEmail(e.target.value)}
                      placeholder="merchant@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      value={merchantPassword}
                      onChange={(e) => setMerchantPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Logging in...' : 'Access Dashboard'}
                  </Button>
                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                    <strong>Demo:</strong> merchant@demo.com / merchant123
                  </div>
                </form>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
