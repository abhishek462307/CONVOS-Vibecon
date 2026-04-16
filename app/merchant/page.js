'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useRealtimeSync } from '@/components/RealtimeSync'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LayoutDashboard, MessageSquare, ShoppingBag, Package, Users, 
  Truck, Paintbrush, Star, Plus, Search, Filter,
  Edit, Trash2, Eye, Send, Check, X, Download, Calendar,
  TrendingUp, DollarSign, ShoppingCart, Activity, AlertCircle,
  MoreVertical, ExternalLink, Mail, Phone, MapPin, Clock,
  Bell, Settings, LogOut, ChevronDown, ChevronRight, RefreshCw,
  ArrowLeft, Copy, MessageCircle, Shield, BarChart3, Hash,
  Loader2, CheckCircle, XCircle, Archive, Reply
} from 'lucide-react'

const BASE_URL = '/api'

const SIDEBAR_ITEMS = [
  { section: 'OVERVIEW', items: [
    { key: 'home', label: 'Home', icon: LayoutDashboard },
    { key: 'conversations', label: 'Intent Stream', icon: MessageSquare },
  ]},
  { section: 'COMMERCE', items: [
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
    { key: 'catalog', label: 'Catalog', icon: Package },
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'shipments', label: 'Shipments', icon: Truck },
    { key: 'reviews', label: 'Reviews', icon: Star },
  ]},
  { section: 'SETTINGS', items: [
    { key: 'store-design', label: 'Store Design', icon: Paintbrush },
  ]}
]

const PRODUCT_CATEGORIES = ['Single Origin', 'Blends', 'Espresso', 'Decaf', 'Equipment', 'Accessories']

// ═══════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════

function StatCard({ title, value, change, icon: Icon, subtitle }) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {change && (
        <div className="flex items-center gap-1 text-xs text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          <span>{change}</span>
        </div>
      )}
      {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
    </div>
  )
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">{description}</p>
      {action}
    </div>
  )
}

function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
      type === 'success' ? 'bg-emerald-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-primary text-primary-foreground'
    }`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4" /> : type === 'error' ? <XCircle className="w-4 h-4" /> : null}
      {message}
    </div>
  )
}

// ═══════════════════════════════════════════
// CSV EXPORT HELPER
// ═══════════════════════════════════════════
function downloadCSV(data, filename) {
  if (!data || data.length === 0) return
  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h]
      const str = val === null || val === undefined ? '' : String(val)
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str
    }).join(','))
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ═══════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════

export default function MerchantDashboard() {
  const [activeSection, setActiveSection] = useState('home')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [reviews, setReviews] = useState([])
  const [intents, setIntents] = useState([])
  const [storeConfig, setStoreConfig] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Modal states
  const [productModal, setProductModal] = useState({ open: false, mode: 'create', data: null })
  const [orderDetailModal, setOrderDetailModal] = useState({ open: false, order: null })
  const [reviewModal, setReviewModal] = useState({ open: false, review: null })
  const [shipmentModal, setShipmentModal] = useState({ open: false, order: null })
  const [customerModal, setCustomerModal] = useState({ open: false, customer: null })
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: '', name: '' })

  // Filter/search states
  const [orderFilter, setOrderFilter] = useState('all')
  const [orderSearch, setOrderSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [reviewFilter, setReviewFilter] = useState('all')

  // Lifted form states (prevents auto-refresh from resetting modal form data)
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', compare_at_price: '', category: 'Single Origin',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
    stock: '', bargain_enabled: true, bargain_min_price: '', tags: [], weight: ''
  })
  const [reviewReplyText, setReviewReplyText] = useState('')
  const [shipmentForm, setShipmentForm] = useState({
    carrier: '', tracking_number: '', status: 'processing', notes: ''
  })

  const showToast = (message, type = 'success') => setToast({ message, type })

  // Check if any modal is open (to pause auto-refresh)
  const isAnyModalOpen = productModal.open || orderDetailModal.open || 
    reviewModal.open || shipmentModal.open || customerModal.open || deleteConfirm.open

  // Modal openers (initialize form state when opening)
  const openProductCreate = () => {
    setProductForm({
      name: '', description: '', price: '', compare_at_price: '', category: 'Single Origin',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
      stock: '', bargain_enabled: true, bargain_min_price: '', tags: [], weight: ''
    })
    setProductModal({ open: true, mode: 'create', data: null })
  }
  const openProductEdit = (product) => {
    setProductForm({ ...product })
    setProductModal({ open: true, mode: 'edit', data: product })
  }
  const openReviewReply = (review) => {
    setReviewReplyText(review.merchant_reply || '')
    setReviewModal({ open: true, review })
  }
  const openShipmentEdit = (order) => {
    setShipmentForm({
      carrier: order.carrier || '',
      tracking_number: order.tracking_number || '',
      status: order.status || 'processing',
      notes: order.notes || ''
    })
    setShipmentModal({ open: true, order })
  }

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
      const [statsRes, ordersRes, productsRes, customersRes, reviewsRes, intentsRes, configRes] = await Promise.all([
        fetch(`${BASE_URL}/stats`).then(r => r.json()),
        fetch(`${BASE_URL}/orders`).then(r => r.json()),
        fetch(`${BASE_URL}/products`).then(r => r.json()),
        fetch(`${BASE_URL}/consumer-matrix`).then(r => r.json()),
        fetch(`${BASE_URL}/reviews`).then(r => r.json()),
        fetch(`${BASE_URL}/intents?limit=50`).then(r => r.json()),
        fetch(`${BASE_URL}/store-config`).then(r => r.json())
      ])

      if (statsRes && !statsRes.error) setStats(statsRes)
      if (Array.isArray(ordersRes)) setOrders(ordersRes)
      if (Array.isArray(productsRes)) setProducts(productsRes)
      if (Array.isArray(customersRes)) setCustomers(customersRes)
      if (Array.isArray(reviewsRes)) setReviews(reviewsRes)
      if (Array.isArray(intentsRes)) setIntents(intentsRes)
      if (configRes && !configRes.error) setStoreConfig(configRes)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Real-time sync integration
  useRealtimeSync({
    isAuthenticated,
    onDataUpdate: (data) => {
      // Update orders with new data
      if (data.orders && data.orders.length > 0) {
        setOrders(prev => {
          const existingIds = new Set(prev.map(o => o.id))
          const newOrders = data.orders.filter(o => !existingIds.has(o.id))
          return [...newOrders, ...prev].slice(0, 100) // Keep latest 100
        })
      }

      // Update intents stream
      if (data.intents && data.intents.length > 0) {
        setIntents(prev => {
          const existingIds = new Set(prev.map(i => i.id))
          const newIntents = data.intents.filter(i => !existingIds.has(i.id))
          return [...newIntents, ...prev].slice(0, 50) // Keep latest 50
        })
      }

      // Update reviews
      if (data.reviews && data.reviews.length > 0) {
        setReviews(prev => {
          const existingIds = new Set(prev.map(r => r.id))
          const newReviews = data.reviews.filter(r => !existingIds.has(r.id))
          return [...newReviews, ...prev].slice(0, 100) // Keep latest 100
        })
      }

      // Show toast notification for new activity
      if (data.orders?.length > 0 || data.intents?.length > 0) {
        setToast({
          type: 'success',
          title: 'New Activity',
          message: `${(data.orders?.length || 0) + (data.intents?.length || 0)} new updates`
        })
        setTimeout(() => setToast(null), 3000)
      }
    },
    interval: 10000, // 10 seconds
    enabled: true
  })

  useEffect(() => {
    if (!isAnyModalOpen) {
      const interval = setInterval(fetchData, 10000)
      return () => clearInterval(interval)
    }
  }, [fetchData, isAnyModalOpen])

  // ═══════════════════════════════════════════
  // CRUD OPERATIONS
  // ═══════════════════════════════════════════

  // Products
  const saveProduct = async (productData) => {
    try {
      setLoading(true)
      const isEdit = productModal.mode === 'edit'
      const url = isEdit ? `${BASE_URL}/products/${productData.id}` : `${BASE_URL}/products`
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      const result = await res.json()
      if (res.ok) {
        showToast(isEdit ? 'Product updated successfully' : 'Product created successfully')
        setProductModal({ open: false, mode: 'create', data: null })
        await fetchData()
      } else {
        showToast(result.error || 'Failed to save product', 'error')
      }
    } catch (error) {
      showToast('Failed to save product', 'error')
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Product deleted successfully')
        setDeleteConfirm({ open: false, type: '', id: '', name: '' })
        await fetchData()
      } else {
        showToast('Failed to delete product', 'error')
      }
    } catch (error) {
      showToast('Failed to delete product', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Orders
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        showToast(`Order status updated to ${status}`)
        await fetchData()
      }
    } catch (error) {
      showToast('Failed to update order', 'error')
    }
  }

  // Shipments
  const updateShipment = async (orderId, shipmentData) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/shipments/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipmentData)
      })
      if (res.ok) {
        showToast('Shipment updated successfully')
        setShipmentModal({ open: false, order: null })
        await fetchData()
      }
    } catch (error) {
      showToast('Failed to update shipment', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Reviews
  const updateReview = async (reviewId, data) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        showToast('Review updated successfully')
        setReviewModal({ open: false, review: null })
        await fetchData()
      }
    } catch (error) {
      showToast('Failed to update review', 'error')
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Review deleted')
        setDeleteConfirm({ open: false, type: '', id: '', name: '' })
        await fetchData()
      }
    } catch (error) {
      showToast('Failed to delete review', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Store Config
  const updateStoreConfig = async (updates) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/store-config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (res.ok) {
        showToast('Store settings saved')
        await fetchData()
      }
    } catch (error) {
      showToast('Failed to save settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Export
  const handleExport = async (type) => {
    try {
      const res = await fetch(`${BASE_URL}/export/${type}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        downloadCSV(data, `${type}-export-${new Date().toISOString().split('T')[0]}.csv`)
        showToast(`${type} exported successfully`)
      }
    } catch (error) {
      showToast('Export failed', 'error')
    }
  }

  // Delete handler
  const handleDelete = async () => {
    const { type, id } = deleteConfirm
    if (type === 'product') await deleteProduct(id)
    else if (type === 'review') await deleteReview(id)
  }

  // ═══════════════════════════════════════════
  // SECTION RENDERERS
  // ═══════════════════════════════════════════

  const renderHome = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your store overview.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Revenue" value={`$${(stats.totalRevenue || 0).toFixed(2)}`} change="+12.5% this month" icon={DollarSign} />
          <StatCard title="Orders" value={stats.totalOrders || 0} subtitle={`${stats.pendingOrders || 0} pending`} icon={ShoppingCart} />
          <StatCard title="Products" value={stats.totalProducts || 0} icon={Package} />
          <StatCard title="Customers" value={stats.totalBuyers || 0} change="+15.3%" icon={Users} />
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Avg Rating" value={`${stats.avgRating || '0.0'} ★`} subtitle={`${stats.totalReviews || 0} reviews`} icon={Star} />
          <StatCard title="Conversations" value={stats.totalConversations || 0} icon={MessageSquare} />
          <StatCard title="Active Missions" value={stats.activeMissions || 0} icon={Activity} />
          <StatCard title="Trust Score" value={stats.avgTrustScore || 80} subtitle="avg across buyers" icon={Shield} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Recent Orders</h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('orders')}>View All →</Button>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 cursor-pointer hover:bg-muted/30 rounded px-2 -mx-2" onClick={() => setOrderDetailModal({ open: true, order })}>
                <div>
                  <div className="font-medium text-sm">{order.order_number}</div>
                  <div className="text-xs text-muted-foreground">{order.shipping_address?.name || 'N/A'}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">${parseFloat(order.total || 0).toFixed(2)}</div>
                  <Badge variant="outline" className="text-xs mt-1">{order.status}</Badge>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>}
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Live Activity</h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection('conversations')}>View All →</Button>
          </div>
          <div className="space-y-2">
            {intents.slice(0, 6).map((intent, i) => (
              <div key={i} className="flex items-start gap-2 py-2 border-b border-border last:border-0">
                <Activity className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate">{intent.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(intent.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] shrink-0">{intent.type}</Badge>
              </div>
            ))}
            {intents.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>}
          </div>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => {
    const filtered = orders.filter(o => {
      if (orderFilter !== 'all' && o.status !== orderFilter) return false
      if (orderSearch) {
        const s = orderSearch.toLowerCase()
        return (o.order_number?.toLowerCase().includes(s) || o.shipping_address?.name?.toLowerCase().includes(s))
      }
      return true
    })

    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground text-sm mt-1">{orders.length} total orders</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleExport('orders')}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-9" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} />
          </div>
          <Select value={orderFilter} onValueChange={setOrderFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const statusColors = {
                    pending: 'bg-amber-100 text-amber-700',
                    processing: 'bg-blue-100 text-blue-700',
                    shipped: 'bg-purple-100 text-purple-700',
                    delivered: 'bg-emerald-100 text-emerald-700',
                    cancelled: 'bg-red-100 text-red-700'
                  }
                  return (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm">{order.order_number}</div>
                        <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium">{order.shipping_address?.name || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-sm">${parseFloat(order.total || 0).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${statusColors[order.payment_status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.payment_status || 'unknown'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs px-2 py-1.5 rounded-lg border border-border bg-background cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button size="sm" variant="ghost" onClick={() => setOrderDetailModal({ open: true, order })}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <EmptyState icon={ShoppingBag} title="No orders found" description="Orders will appear here when customers make purchases." />
          )}
        </div>
      </div>
    )
  }

  const renderCatalog = () => {
    const filtered = products.filter(p => {
      if (productSearch) {
        const s = productSearch.toLowerCase()
        return p.name?.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s)
      }
      return true
    })

    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">Product Catalog</h1>
            <p className="text-muted-foreground text-sm mt-1">{products.length} products</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('products')}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button size="sm" onClick={openProductCreate}>
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Bargain</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description?.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-sm">${product.price}</div>
                      {product.compare_at_price > product.price && (
                        <div className="text-xs text-muted-foreground line-through">${product.compare_at_price}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-medium ${(product.stock || 0) < 20 ? 'text-amber-600' : 'text-foreground'}`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {product.bargain_enabled ? (
                        <span className="text-xs text-emerald-600">Min ${product.bargain_min_price}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Disabled</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button size="sm" variant="ghost" onClick={() => openProductEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => setDeleteConfirm({ open: true, type: 'product', id: product.id, name: product.name })}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <EmptyState 
              icon={Package} 
              title="No products found" 
              description="Start building your catalog by adding your first product."
              action={<Button size="sm" onClick={() => setProductModal({ open: true, mode: 'create', data: null })}><Plus className="w-4 h-4 mr-2" /> Add Product</Button>}
            />
          )}
        </div>
      </div>
    )
  }

  const renderCustomers = () => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground text-sm mt-1">{customers.length} customer profiles</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => handleExport('customers')}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {customers.length === 0 ? (
        <EmptyState icon={Users} title="No customers yet" description="Customer profiles are created automatically when buyers interact with your store." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(customer => (
            <div key={customer.id} className="bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCustomerModal({ open: true, customer })}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {customer.session_id?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">Session #{customer.session_id?.slice(0, 8)}</div>
                  <div className="text-xs text-muted-foreground">{customer.interactions || 0} interactions</div>
                </div>
                <Badge variant={customer.risk_level === 'low' ? 'outline' : 'destructive'} className="text-xs">
                  {customer.risk_level || 'low'}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-muted-foreground">Trust</div>
                  <div className="font-bold text-sm text-emerald-600">{customer.trust_score || 80}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Spent</div>
                  <div className="font-bold text-sm">${(customer.total_spent || 0).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Orders</div>
                  <div className="font-bold text-sm">{customer.total_orders || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderReviews = () => {
    const filtered = reviews.filter(r => reviewFilter === 'all' || r.status === reviewFilter)

    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">Reviews</h1>
            <p className="text-muted-foreground text-sm mt-1">{reviews.length} total • {reviews.filter(r => r.status === 'pending').length} pending</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Select value={reviewFilter} onValueChange={setReviewFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Star} title="No reviews found" description="Reviews will appear here when customers leave feedback." />
        ) : (
          <div className="space-y-3">
            {filtered.map(review => (
              <div key={review.id} className="bg-card rounded-xl p-5 border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {review.product?.image && (
                      <img src={review.product.image} alt={review.product.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{review.product?.name || 'Product'}</span>
                        <span className="text-xs text-muted-foreground">by {review.author_name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <Badge variant={review.status === 'published' ? 'default' : review.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                          {review.status}
                        </Badge>
                      </div>
                      {review.title && <div className="font-medium text-sm mb-1">{review.title}</div>}
                      <div className="text-sm text-muted-foreground">{review.content}</div>
                      {review.merchant_reply && (
                        <div className="mt-3 pl-3 border-l-2 border-primary/30 bg-primary/5 rounded-r-lg p-2">
                          <div className="text-xs font-medium text-primary mb-0.5">Merchant Reply</div>
                          <div className="text-xs text-muted-foreground">{review.merchant_reply}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {review.status === 'pending' && (
                      <>
                        <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => updateReview(review.id, { status: 'published' })}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => updateReview(review.id, { status: 'rejected' })}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => openReviewReply(review)}>
                      <Reply className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setDeleteConfirm({ open: true, type: 'review', id: review.id, name: review.title || 'this review' })}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderShipments = () => {
    const shipments = orders.filter(o => ['processing', 'shipped', 'delivered'].includes(o.status))

    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">Shipments</h1>
            <p className="text-muted-foreground text-sm mt-1">{shipments.length} active shipments</p>
          </div>
        </div>

        {shipments.length === 0 ? (
          <EmptyState icon={Truck} title="No shipments" description="Shipments will appear here when orders move to processing." />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Carrier</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Tracking</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map(shipment => (
                    <tr key={shipment.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm">{shipment.order_number}</div>
                        <div className="text-xs text-muted-foreground">{new Date(shipment.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">{shipment.shipping_address?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">{shipment.carrier || <span className="text-muted-foreground">Not set</span>}</td>
                      <td className="px-4 py-3">
                        {shipment.tracking_number ? (
                          <code className="text-xs bg-muted px-2 py-1 rounded">{shipment.tracking_number}</code>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not set</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={shipment.status === 'delivered' ? 'default' : 'secondary'}>
                          {shipment.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button size="sm" variant="ghost" onClick={() => openShipmentEdit(shipment)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderStoreDesign = () => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Store Design</h1>
          <p className="text-muted-foreground text-sm mt-1">Customize your store appearance and AI assistant</p>
        </div>
        <Button size="sm" onClick={() => updateStoreConfig(storeConfig)} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {storeConfig && (
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <div>
                <Label>Store Name</Label>
                <Input value={storeConfig.name || ''} onChange={(e) => setStoreConfig({...storeConfig, name: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label>Tagline</Label>
                <Input value={storeConfig.tagline || ''} onChange={(e) => setStoreConfig({...storeConfig, tagline: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={storeConfig.description || ''} onChange={(e) => setStoreConfig({...storeConfig, description: e.target.value})} className="mt-1" rows={3} />
              </div>
              <div>
                <Label>Banner Text</Label>
                <Input value={storeConfig.banner || ''} onChange={(e) => setStoreConfig({...storeConfig, banner: e.target.value})} className="mt-1" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <div>
                <Label>AI Assistant Name</Label>
                <Input value={storeConfig.ai_name || ''} onChange={(e) => setStoreConfig({...storeConfig, ai_name: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label>Greeting Message</Label>
                <Textarea value={storeConfig.ai_greeting || ''} onChange={(e) => setStoreConfig({...storeConfig, ai_greeting: e.target.value})} className="mt-1" rows={3} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <div>
                <Label>Hero Image URL</Label>
                <Input value={storeConfig.hero_image || ''} onChange={(e) => setStoreConfig({...storeConfig, hero_image: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label>Logo URL</Label>
                <Input value={storeConfig.logo_url || ''} onChange={(e) => setStoreConfig({...storeConfig, logo_url: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label>Store Status</Label>
                <Select value={storeConfig.status || 'live'} onValueChange={(v) => setStoreConfig({...storeConfig, status: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )

  const renderConversations = () => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Live Intent Stream</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time customer activity and AI interactions</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {intents.length === 0 ? (
        <EmptyState icon={Activity} title="No activity yet" description="Customer interactions will appear here in real-time." />
      ) : (
        <div className="space-y-2">
          {intents.map((intent, i) => {
            const typeColors = {
              search: 'bg-blue-100 text-blue-700',
              add_to_cart: 'bg-emerald-100 text-emerald-700',
              negotiate: 'bg-purple-100 text-purple-700',
              checkout: 'bg-amber-100 text-amber-700',
              message: 'bg-gray-100 text-gray-700',
              mission_create: 'bg-pink-100 text-pink-700'
            }
            return (
              <div key={i} className="bg-card rounded-lg p-4 border border-border flex items-start gap-3 hover:bg-muted/20 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[intent.type] || 'bg-gray-100 text-gray-700'}`}>
                  {intent.type === 'search' ? <Search className="w-4 h-4" /> :
                   intent.type === 'add_to_cart' ? <ShoppingCart className="w-4 h-4" /> :
                   intent.type === 'negotiate' ? <DollarSign className="w-4 h-4" /> :
                   intent.type === 'checkout' ? <CheckCircle className="w-4 h-4" /> :
                   intent.type === 'mission_create' ? <Activity className="w-4 h-4" /> :
                   <MessageSquare className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{intent.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(intent.timestamp).toLocaleString()} • Session: {intent.session_id?.slice(0, 8)}...
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">{intent.type}</Badge>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // ═══════════════════════════════════════════
  // MODALS
  // ═══════════════════════════════════════════

  const ProductModal = () => {
    return (
      <Dialog open={productModal.open} onOpenChange={(open) => !open && setProductModal({ open: false, mode: 'create', data: null })}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{productModal.mode === 'edit' ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {productModal.mode === 'edit' ? 'Update the product details below.' : 'Fill in the details to add a new product.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Product Name *</Label>
                <Input value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="mt-1" placeholder="e.g. Ethiopian Yirgacheffe" />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="mt-1" rows={3} placeholder="Product description..." />
              </div>
              <div>
                <Label>Price *</Label>
                <Input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="mt-1" placeholder="0.00" />
              </div>
              <div>
                <Label>Compare at Price</Label>
                <Input type="number" step="0.01" value={productForm.compare_at_price} onChange={(e) => setProductForm({...productForm, compare_at_price: e.target.value})} className="mt-1" placeholder="0.00" />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={productForm.category || 'Single Origin'} onValueChange={(v) => setProductForm({...productForm, category: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Stock</Label>
                <Input type="number" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} className="mt-1" placeholder="0" />
              </div>
              <div className="col-span-2">
                <Label>Image URL</Label>
                <Input value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} className="mt-1" placeholder="https://..." />
              </div>
              <div>
                <Label>Weight</Label>
                <Input value={productForm.weight} onChange={(e) => setProductForm({...productForm, weight: e.target.value})} className="mt-1" placeholder="e.g. 340g" />
              </div>
              <div>
                <Label>Min Bargain Price</Label>
                <Input type="number" step="0.01" value={productForm.bargain_min_price} onChange={(e) => setProductForm({...productForm, bargain_min_price: e.target.value})} className="mt-1" placeholder="0.00" />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Switch checked={productForm.bargain_enabled ?? true} onCheckedChange={(v) => setProductForm({...productForm, bargain_enabled: v})} />
                <Label>Enable price negotiation</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductModal({ open: false, mode: 'create', data: null })}>Cancel</Button>
            <Button onClick={() => saveProduct(productForm)} disabled={loading || !productForm.name || !productForm.price}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {productModal.mode === 'edit' ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const OrderDetailModal = () => {
    const order = orderDetailModal.order
    if (!order) return null

    return (
      <Dialog open={orderDetailModal.open} onOpenChange={(open) => !open && setOrderDetailModal({ open: false, order: null })}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {order.order_number}</DialogTitle>
            <DialogDescription>
              Created on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Status</div>
                <Badge className="mt-1">{order.status}</Badge>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Payment</div>
                <Badge variant="outline" className="mt-1">{order.payment_status}</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Items</h4>
              <div className="space-y-2">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-lg p-2">
                    {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${(order.subtotal || 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>${(order.shipping || 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${(order.tax || 0).toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>${parseFloat(order.total || 0).toFixed(2)}</span></div>
            </div>

            {order.shipping_address && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Shipping Address</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>{order.shipping_address.name}</div>
                    <div>{order.shipping_address.street}</div>
                    <div>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</div>
                    <div>{order.shipping_address.country}</div>
                  </div>
                </div>
              </>
            )}

            {(order.tracking_number || order.carrier) && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Tracking</h4>
                  <div className="text-sm text-muted-foreground">
                    {order.carrier && <div>Carrier: {order.carrier}</div>}
                    {order.tracking_number && <div>Tracking: <code className="bg-muted px-1 rounded">{order.tracking_number}</code></div>}
                  </div>
                </div>
              </>
            )}

            {order.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const ReviewReplyModal = () => {
    return (
      <Dialog open={reviewModal.open} onOpenChange={(open) => !open && setReviewModal({ open: false, review: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>
              Respond to {reviewModal.review?.author_name}'s review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${i <= (reviewModal.review?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <div className="text-sm">{reviewModal.review?.content}</div>
            </div>
            <div>
              <Label>Your Reply</Label>
              <Textarea value={reviewReplyText} onChange={(e) => setReviewReplyText(e.target.value)} className="mt-1" rows={3} placeholder="Thank you for your feedback..." />
            </div>
            <div>
              <Label className="text-xs">Review Status</Label>
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant={reviewModal.review?.status === 'published' ? 'default' : 'outline'} onClick={() => updateReview(reviewModal.review?.id, { status: 'published', merchant_reply: reviewReplyText })}>
                  <Check className="w-3 h-3 mr-1" /> Publish
                </Button>
                <Button size="sm" variant={reviewModal.review?.status === 'rejected' ? 'destructive' : 'outline'} onClick={() => updateReview(reviewModal.review?.id, { status: 'rejected', merchant_reply: reviewReplyText })}>
                  <X className="w-3 h-3 mr-1" /> Reject
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewModal({ open: false, review: null })}>Cancel</Button>
            <Button onClick={() => updateReview(reviewModal.review?.id, { merchant_reply: reviewReplyText })} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Save Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const ShipmentEditModal = () => {
    return (
      <Dialog open={shipmentModal.open} onOpenChange={(open) => !open && setShipmentModal({ open: false, order: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Shipment</DialogTitle>
            <DialogDescription>
              {shipmentModal.order?.order_number} — {shipmentModal.order?.shipping_address?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Carrier</Label>
              <Select value={shipmentForm.carrier || 'none'} onValueChange={(v) => setShipmentForm({...shipmentForm, carrier: v === 'none' ? '' : v})}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select carrier" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select carrier</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tracking Number</Label>
              <Input value={shipmentForm.tracking_number} onChange={(e) => setShipmentForm({...shipmentForm, tracking_number: e.target.value})} className="mt-1" placeholder="Enter tracking number" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={shipmentForm.status} onValueChange={(v) => setShipmentForm({...shipmentForm, status: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={shipmentForm.notes} onChange={(e) => setShipmentForm({...shipmentForm, notes: e.target.value})} className="mt-1" rows={2} placeholder="Internal notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShipmentModal({ open: false, order: null })}>Cancel</Button>
            <Button onClick={() => updateShipment(shipmentModal.order?.id, shipmentForm)} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Update Shipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const CustomerDetailModal = () => {
    const customer = customerModal.customer
    if (!customer) return null

    return (
      <Dialog open={customerModal.open} onOpenChange={(open) => !open && setCustomerModal({ open: false, customer: null })}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>Session #{customer.session_id?.slice(0, 12)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Trust Score</div>
                <div className="text-2xl font-bold text-emerald-600">{customer.trust_score || 80}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Risk Level</div>
                <div className="text-2xl font-bold capitalize">{customer.risk_level || 'low'}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Total Spent</div>
                <div className="text-2xl font-bold">${(customer.total_spent || 0).toFixed(2)}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Total Orders</div>
                <div className="text-2xl font-bold">{customer.total_orders || 0}</div>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex justify-between py-1"><span className="text-muted-foreground">Interactions</span><span className="font-medium">{customer.interactions || 0}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted-foreground">First Seen</span><span className="font-medium">{customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted-foreground">Last Active</span><span className="font-medium">{customer.updated_at ? new Date(customer.updated_at).toLocaleDateString() : 'N/A'}</span></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ═══════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════

  const renderContent = () => {
    switch (activeSection) {
      case 'home': return renderHome()
      case 'orders': return renderOrders()
      case 'catalog': return renderCatalog()
      case 'customers': return renderCustomers()
      case 'reviews': return renderReviews()
      case 'shipments': return renderShipments()
      case 'store-design': return renderStoreDesign()
      case 'conversations': return renderConversations()
      default: return <div>Section not found</div>
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-bold text-primary">Convos</h1>
          <p className="text-[11px] text-muted-foreground">Merchant Command Center</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          {SIDEBAR_ITEMS.map((section) => (
            <div key={section.section}>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-2">{section.section}</div>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === item.key
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.key === 'reviews' && reviews.filter(r => r.status === 'pending').length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                        {reviews.filter(r => r.status === 'pending').length}
                      </span>
                    )}
                    {item.key === 'orders' && orders.filter(o => o.status === 'pending').length > 0 && (
                      <span className="ml-auto bg-amber-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                        {orders.filter(o => o.status === 'pending').length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
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
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl">
          {renderContent()}
        </div>
      </main>

      {/* Modals */}
      <ProductModal />
      <OrderDetailModal />
      <ReviewReplyModal />
      <ShipmentEditModal />
      <CustomerDetailModal />
      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: '', id: '', name: '' })}
        onConfirm={handleDelete}
        title={`Delete ${deleteConfirm.type}?`}
        description={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        loading={loading}
      />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
