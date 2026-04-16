'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { 
  LayoutDashboard, MessageSquare, ShoppingBag, Package, Users, 
  Truck, Paintbrush, Star, Megaphone, Plus, Search, Filter,
  Edit, Trash2, Eye, Send, Check, X, Download, Calendar,
  TrendingUp, DollarSign, ShoppingCart, Activity, AlertCircle,
  MoreVertical, ExternalLink, Mail, Phone, MapPin, Clock,
  Bell, Settings, LogOut, ChevronDown, ChevronRight, RefreshCw
} from 'lucide-react'

const SIDEBAR_ITEMS = [
  { section: 'OVERVIEW', items: [
    { key: 'home', label: 'Home', icon: LayoutDashboard },
    { key: 'conversations', label: 'Conversations', icon: MessageSquare },
  ]},
  { section: 'COMMERCE', items: [
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
    { key: 'catalog', label: 'Catalog', icon: Package },
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'shipments', label: 'Shipments', icon: Truck },
    { key: 'store-design', label: 'Store Design', icon: Paintbrush },
    { key: 'reviews', label: 'Reviews', icon: Star },
  ]},
  { section: 'GROWTH', items: [
    { key: 'campaigns', label: 'Campaigns', icon: Megaphone },
  ]}
]

function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {change && (
        <div className="flex items-center gap-1 text-sm text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          <span>{change}</span>
        </div>
      )}
    </div>
  )
}

function OrderRow({ order, onUpdateStatus, onViewDetails }) {
  const [updating, setUpdating] = useState(false)

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700'
  }

  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div className="font-medium">{order.order_number}</div>
        <div className="text-xs text-muted-foreground">
          {new Date(order.created_at).toLocaleDateString()}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium">{order.shipping_address?.name || 'N/A'}</div>
        <div className="text-xs text-muted-foreground">{order.shipping_address?.email}</div>
      </td>
      <td className="px-4 py-3 text-right font-bold">${parseFloat(order.total).toFixed(2)}</td>
      <td className="px-4 py-3">
        <Badge className={`text-xs ${statusColors[order.payment_status] || 'bg-gray-100 text-gray-700'}`}>
          {order.payment_status}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <select
          value={order.status}
          onChange={(e) => {
            setUpdating(true)
            onUpdateStatus(order.id, e.target.value).finally(() => setUpdating(false))
          }}
          disabled={updating}
          className="text-xs px-2 py-1 rounded-lg border border-border bg-background"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <Button size="sm" variant="ghost" onClick={() => onViewDetails(order)}>
          <Eye className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  )
}

function ProductRow({ product, onEdit, onDelete }) {
  return (
    <tr className="border-b border-border hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-muted-foreground">{product.category}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right font-bold">${product.price}</td>
      <td className="px-4 py-3 text-center">{product.stock || 0}</td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="text-xs">{product.status || 'active'}</Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => onEdit(product)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(product.id)} className="text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default function MerchantDashboard() {
  const [activeSection, setActiveSection] = useState('home')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [reviews, setReviews] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [intents, setIntents] = useState([])
  const [storeConfig, setStoreConfig] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(false)

  // Auth check
  useEffect(() => {
    try {
      const user = localStorage.getItem('user')
      if (user) {
        const userData = JSON.parse(user)
        if (userData.type === 'merchant') {
          setIsAuthenticated(true)
        } else {
          window.location.href = '/merchant/login'
        }
      } else {
        window.location.href = '/merchant/login'
      }
    } catch (e) {
      window.location.href = '/merchant/login'
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return
    
    try {
      const [statsRes, ordersRes, productsRes, customersRes, reviewsRes, campaignsRes, intentsRes, configRes] = await Promise.all([
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/consumer-matrix').then(r => r.json()),
        fetch('/api/reviews').then(r => r.json()),
        fetch('/api/campaigns').then(r => r.json()),
        fetch('/api/intents?limit=50').then(r => r.json()),
        fetch('/api/store-config').then(r => r.json())
      ])

      if (statsRes && !statsRes.error) setStats(statsRes)
      if (Array.isArray(ordersRes)) setOrders(ordersRes)
      if (Array.isArray(productsRes)) setProducts(productsRes)
      if (Array.isArray(customersRes)) setCustomers(customersRes)
      if (Array.isArray(reviewsRes)) setReviews(reviewsRes)
      if (Array.isArray(campaignsRes)) setCampaigns(campaignsRes)
      if (Array.isArray(intentsRes)) setIntents(intentsRes)
      if (configRes && !configRes.error) setStoreConfig(configRes)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      await fetchData()
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  // Update store config
  const updateStoreConfig = async (updates) => {
    try {
      setLoading(true)
      await fetch('/api/store-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      await fetchData()
    } catch (error) {
      console.error('Update error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Render sections
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Here's your store overview.</p>
              </div>
              <Button onClick={fetchData}>
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>

            {stats && (
              <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard title="Revenue" value={`$${stats.totalRevenue?.toFixed(2) || '0.00'}`} change="+12.5%" icon={DollarSign} />
                <StatCard title="Orders" value={stats.totalOrders || 0} change="+8.2%" icon={ShoppingCart} />
                <StatCard title="Products" value={stats.totalProducts || 0} icon={Package} />
                <StatCard title="Customers" value={stats.totalBuyers || 0} change="+15.3%" icon={Users} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <div className="font-medium">{order.order_number}</div>
                        <div className="text-sm text-muted-foreground">{order.shipping_address?.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${parseFloat(order.total).toFixed(2)}</div>
                        <Badge className="text-xs mt-1">{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Live Activity</h3>
                <div className="space-y-3">
                  {intents.slice(0, 6).map((intent, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                      <Activity className="w-4 h-4 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="text-sm">{intent.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(intent.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'orders':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground mt-1">{orders.length} total orders</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Customer</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onUpdateStatus={updateOrderStatus}
                      onViewDetails={(o) => console.log('View:', o)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'catalog':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Product Catalog</h1>
                <p className="text-muted-foreground mt-1">{products.length} products</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Product</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase">Price</th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onEdit={(p) => console.log('Edit:', p)}
                      onDelete={(id) => console.log('Delete:', id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'customers':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Customers</h1>
                <p className="text-muted-foreground mt-1">{customers.length} registered customers</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {customers.map(customer => (
                <div key={customer.id} className="bg-card rounded-xl p-5 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center text-white font-bold">
                        {customer.session_id?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">Customer #{customer.session_id?.slice(0, 8)}</div>
                        <div className="text-xs text-muted-foreground">{customer.interactions || 0} interactions</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Trust Score</div>
                      <div className="font-bold text-emerald-600">{customer.trust_score || 80}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Total Spent</div>
                      <div className="font-bold">${customer.total_spent?.toFixed(2) || '0.00'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'reviews':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Reviews</h1>
                <p className="text-muted-foreground mt-1">{reviews.length} total reviews</p>
              </div>
            </div>

            <div className="grid gap-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-card rounded-xl p-5 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {review.product?.image && (
                        <img src={review.product.image} alt={review.product.name} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <div className="font-semibold">{review.product?.name || 'Product'}</div>
                        <div className="text-sm text-muted-foreground">{review.author_name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <Badge>{review.status}</Badge>
                    </div>
                  </div>
                  {review.title && <div className="font-medium mb-1">{review.title}</div>}
                  <div className="text-sm text-muted-foreground">{review.content}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'campaigns':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Campaigns</h1>
                <p className="text-muted-foreground mt-1">{campaigns.length} active campaigns</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Create Campaign
              </Button>
            </div>

            <div className="grid gap-4">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{campaign.name}</h3>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>{campaign.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{campaign.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Audience</div>
                      <div className="text-2xl font-bold">{campaign.audience_count}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Sent</div>
                      <div className="text-2xl font-bold">{campaign.sent_count}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Open Rate</div>
                      <div className="text-2xl font-bold">{campaign.open_rate}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'store-design':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Store Design</h1>
                <p className="text-muted-foreground mt-1">Customize your store appearance</p>
              </div>
              <Button onClick={() => updateStoreConfig(storeConfig)} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            {storeConfig && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-semibold mb-4">Store Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Store Name</label>
                      <Input
                        value={storeConfig.name || ''}
                        onChange={(e) => setStoreConfig({...storeConfig, name: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tagline</label>
                      <Input
                        value={storeConfig.tagline || ''}
                        onChange={(e) => setStoreConfig({...storeConfig, tagline: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={storeConfig.description || ''}
                        onChange={(e) => setStoreConfig({...storeConfig, description: e.target.value})}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-semibold mb-4">AI Assistant</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Assistant Name</label>
                      <Input
                        value={storeConfig.ai_name || ''}
                        onChange={(e) => setStoreConfig({...storeConfig, ai_name: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Greeting Message</label>
                      <Textarea
                        value={storeConfig.ai_greeting || ''}
                        onChange={(e) => setStoreConfig({...storeConfig, ai_greeting: e.target.value})}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'conversations':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Live Intent Stream</h1>
                <p className="text-muted-foreground mt-1">Real-time customer activity</p>
              </div>
            </div>

            <div className="space-y-2">
              {intents.map((intent, i) => (
                <div key={i} className="bg-card rounded-lg p-4 border border-border flex items-start gap-3">
                  <Activity className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">{intent.description}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(intent.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant="outline">{intent.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        )

      case 'shipments':
        const shipments = orders.filter(o => ['processing', 'shipped', 'delivered'].includes(o.status))
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Shipments</h1>
                <p className="text-muted-foreground mt-1">{shipments.length} active shipments</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Carrier</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Tracking</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map(shipment => (
                    <tr key={shipment.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{shipment.order_number}</td>
                      <td className="px-4 py-3">{shipment.shipping_address?.name}</td>
                      <td className="px-4 py-3">{shipment.carrier || '—'}</td>
                      <td className="px-4 py-3 font-mono text-xs">{shipment.tracking_number || '—'}</td>
                      <td className="px-4 py-3"><Badge>{shipment.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      default:
        return <div>Section not found</div>
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold bg-gradient-purple bg-clip-text text-transparent">Convos</h1>
          <p className="text-xs text-muted-foreground">Merchant Dashboard</p>
        </div>

        <nav className="space-y-6">
          {SIDEBAR_ITEMS.map((section) => (
            <div key={section.section}>
              <div className="text-xs font-bold text-muted-foreground uppercase mb-2">{section.section}</div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === item.key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              localStorage.removeItem('user')
              window.location.href = '/merchant/login'
            }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  )
}
