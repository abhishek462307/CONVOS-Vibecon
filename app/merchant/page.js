'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  LayoutDashboard, MessageSquare, ShoppingBag, Package, Users,
  Truck, Paintbrush, Star, Megaphone, Plus, Search, Edit, Trash2,
  Eye, Send, Check, X, Download, TrendingUp, DollarSign, ShoppingCart,
  Activity, ExternalLink, MapPin, LogOut, RefreshCw, ArrowUpRight,
  ArrowDownRight, LayoutGrid, List, Shield, Target, Bot, AlertTriangle,
  Loader2, CheckCircle, XCircle, Reply, Zap, Tag, Package2, Globe,
  Sparkles, ChevronRight, CircleDot, BarChart2, Settings, Hash
} from 'lucide-react'

const BASE_URL = '/api'

const NAV_SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [
      { key: 'home', label: 'Home', icon: LayoutDashboard },
      { key: 'conversations', label: 'Conversations', icon: MessageSquare },
      { key: 'missions', label: 'AI Authority', icon: Target },
    ]
  },
  {
    label: 'COMMERCE',
    items: [
      { key: 'orders', label: 'Orders', icon: ShoppingBag, badge: 'orders' },
      { key: 'catalog', label: 'Catalog', icon: Package },
      { key: 'customers', label: 'Customers', icon: Users },
      { key: 'shipments', label: 'Shipments', icon: Truck },
      { key: 'store-design', label: 'Store Design', icon: Paintbrush },
      { key: 'reviews', label: 'Reviews', icon: Star, badge: 'reviews' },
    ]
  },
  {
    label: 'GROWTH',
    items: [
      { key: 'campaigns', label: 'Campaigns', icon: Megaphone },
    ]
  }
]

const PRODUCT_CATEGORIES = ['Single Origin', 'Blends', 'Espresso', 'Decaf', 'Equipment', 'Accessories']

const STATUS_ORDER = {
  pending: { label: 'Pending', dot: 'bg-amber-400', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  processing: { label: 'Processing', dot: 'bg-blue-400', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  shipped: { label: 'Shipped', dot: 'bg-purple-400', pill: 'bg-purple-50 text-purple-700 border-purple-200' },
  delivered: { label: 'Delivered', dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', dot: 'bg-red-400', pill: 'bg-red-50 text-red-700 border-red-200' },
}

const STATUS_REVIEW = {
  pending: { label: 'Pending', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  published: { label: 'Published', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', pill: 'bg-red-50 text-red-700 border-red-200' },
}

const STATUS_CAMPAIGN = {
  draft: { label: 'Draft', pill: 'bg-gray-100 text-gray-600 border-gray-200' },
  active: { label: 'Active', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  scheduled: { label: 'Scheduled', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  paused: { label: 'Paused', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
}

const TYPE_APPROVAL = {
  price_override: { label: 'Price Override', icon: Tag, bg: 'bg-purple-50', text: 'text-purple-600', pill: 'bg-purple-50 text-purple-700 border-purple-200' },
  large_order: { label: 'Large Order', icon: ShoppingBag, bg: 'bg-red-50', text: 'text-red-600', pill: 'bg-red-50 text-red-700 border-red-200' },
  bundle_deal: { label: 'Bundle Deal', icon: Package2, bg: 'bg-blue-50', text: 'text-blue-600', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  refund: { label: 'Refund', icon: DollarSign, bg: 'bg-amber-50', text: 'text-amber-600', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
}

const INTENT_TYPE = {
  search: { color: 'bg-blue-50 text-blue-600', icon: Search },
  add_to_cart: { color: 'bg-emerald-50 text-emerald-600', icon: ShoppingCart },
  negotiate: { color: 'bg-purple-50 text-purple-600', icon: DollarSign },
  checkout: { color: 'bg-amber-50 text-amber-600', icon: CheckCircle },
  message: { color: 'bg-gray-100 text-gray-600', icon: MessageSquare },
  mission_create: { color: 'bg-pink-50 text-pink-600', icon: Target },
}

// ─── UI Primitives ─────────────────────────────────────────────

function StatusPill({ status, map = STATUS_ORDER }) {
  const cfg = map[status] || { label: status, pill: 'bg-gray-100 text-gray-600 border-gray-200' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.pill}`}>
      {cfg.dot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
      {cfg.label || status}
    </span>
  )
}

function EmptySlate({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-gray-300" />
      </div>
      <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
      <p className="text-xs text-gray-400 mb-5 max-w-xs">{description}</p>
      {action}
    </div>
  )
}

function ConfirmDialog({ open, onClose, onConfirm, title, description, loading, confirmLabel = 'Delete' }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{title}</DialogTitle>
          <DialogDescription className="text-gray-500">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-xl border-gray-200">Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading} className="rounded-xl">
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium border max-w-sm ${type === 'success' ? 'bg-white text-emerald-700 border-emerald-200' : type === 'error' ? 'bg-white text-red-600 border-red-200' : 'bg-white text-gray-800 border-gray-200'}`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : type === 'error' ? <XCircle className="w-4 h-4 shrink-0" /> : null}
      {message}
    </div>
  )
}

function PageHeader({ title, description, actions }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="shrink-0 ml-6 flex items-center gap-2">{actions}</div>}
    </div>
  )
}

function DataTable({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

function TH({ children, right, center }) {
  return <th className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50 ${right ? 'text-right' : center ? 'text-center' : 'text-left'}`}>{children}</th>
}

function TD({ children, right, center, className = '' }) {
  return <td className={`px-5 py-4 ${right ? 'text-right' : center ? 'text-center' : ''} ${className}`}>{children}</td>
}

function downloadCSV(data, filename) {
  if (!data?.length) return
  const headers = Object.keys(data[0])
  const csv = [headers.join(','), ...data.map(row => headers.map(h => { const v = row[h] == null ? '' : String(row[h]); return v.includes(',') ? `"${v}"` : v }).join(','))].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = filename; a.click()
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3.5 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-gray-600 mb-1.5">{label}</p>
      {payload.map((e, i) => (
        <p key={i} className="font-semibold" style={{ color: e.color }}>
          {e.name}: {e.name === 'Revenue' ? `$${Number(e.value).toFixed(0)}` : e.value}
        </p>
      ))}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────

export default function MerchantDashboard() {
  const [activeSection, setActiveSection] = useState('home')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [reviews, setReviews] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [intents, setIntents] = useState([])
  const [missions, setMissions] = useState([])
  const [approvals, setApprovals] = useState([])
  const [storeConfig, setStoreConfig] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [chartRange, setChartRange] = useState('7D')
  const [catalogView, setCatalogView] = useState('grid')

  const [headerSearch, setHeaderSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setTimeout(() => setRefreshing(false), 800)
  }

  const searchResults = useMemo(() => {
    if (!headerSearch.trim() || headerSearch.length < 2) return []
    const q = headerSearch.toLowerCase()
    const results = []
    orders.filter(o => o.order_number?.toLowerCase().includes(q) || o.shipping_address?.name?.toLowerCase().includes(q))
      .slice(0, 3).forEach(o => results.push({ type: 'order', label: o.order_number, sub: o.shipping_address?.name || 'N/A', id: o.id, section: 'orders' }))
    products.filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .slice(0, 3).forEach(p => results.push({ type: 'product', label: p.name, sub: `$${p.price} · ${p.category}`, id: p.id, section: 'catalog' }))
    customers.filter(c => c.session_id?.toLowerCase().includes(q))
      .slice(0, 2).forEach(c => results.push({ type: 'customer', label: `Session #${c.session_id?.slice(0, 8)}`, sub: `${c.interactions || 0} interactions`, id: c.id, section: 'customers' }))
    return results
  }, [headerSearch, orders, products, customers])

  const [productModal, setProductModal] = useState({ open: false, mode: 'create', data: null })
  const [orderModal, setOrderModal] = useState({ open: false, order: null })
  const [campaignModal, setCampaignModal] = useState({ open: false, mode: 'create', data: null })
  const [reviewModal, setReviewModal] = useState({ open: false, review: null })
  const [shipmentModal, setShipmentModal] = useState({ open: false, order: null })
  const [customerModal, setCustomerModal] = useState({ open: false, customer: null })
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: '', name: '' })

  const [orderFilter, setOrderFilter] = useState('all')
  const [orderSearch, setOrderSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [productCatFilter, setProductCatFilter] = useState('all')
  const [reviewFilter, setReviewFilter] = useState('all')
  const [intentFilter, setIntentFilter] = useState('all')
  const [missionFilter, setMissionFilter] = useState('all')

  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', compare_at_price: '', category: 'Single Origin', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', stock: '', bargain_enabled: true, bargain_min_price: '', weight: '' })
  const [campaignForm, setCampaignForm] = useState({ name: '', description: '', type: 'email', status: 'draft', audience_count: '', content: { subject: '', body: '', cta: '' } })
  const [reviewReply, setReviewReply] = useState('')
  const [shipmentForm, setShipmentForm] = useState({ carrier: '', tracking_number: '', status: 'processing', notes: '' })

  const notify = (message, type = 'success') => setToast({ message, type })

  const isModalOpen = productModal.open || orderModal.open || campaignModal.open || reviewModal.open || shipmentModal.open || customerModal.open || deleteConfirm.open

  // Auth
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null')
      if (u?.type === 'merchant') setIsAuthenticated(true)
      else window.location.href = '/merchant/login'
    } catch { window.location.href = '/merchant/login' }
    finally { setAuthLoading(false) }
  }, [])

  // Chart data
  const chartData = useMemo(() => {
    const days = chartRange === '1D' ? 1 : chartRange === '7D' ? 7 : 30
    const data = Array.from({ length: days }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (days - 1 - i))
      return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), dateStr: d.toISOString().split('T')[0], Revenue: 0, Orders: 0 }
    })
    orders.forEach(o => {
      const entry = data.find(x => x.dateStr === new Date(o.created_at).toISOString().split('T')[0])
      if (entry) { entry.Revenue += parseFloat(o.total || 0); entry.Orders++ }
    })
    return data
  }, [orders, chartRange])

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const [sR, oR, pR, cR, rvR, cpR, iR, cfR, mR, aR] = await Promise.all([
        fetch(`${BASE_URL}/stats`).then(r => r.json()),
        fetch(`${BASE_URL}/orders`).then(r => r.json()),
        fetch(`${BASE_URL}/products`).then(r => r.json()),
        fetch(`${BASE_URL}/consumer-matrix`).then(r => r.json()),
        fetch(`${BASE_URL}/reviews`).then(r => r.json()),
        fetch(`${BASE_URL}/campaigns`).then(r => r.json()),
        fetch(`${BASE_URL}/intents?limit=100`).then(r => r.json()),
        fetch(`${BASE_URL}/store-config`).then(r => r.json()),
        fetch(`${BASE_URL}/missions`).then(r => r.json()),
        fetch(`${BASE_URL}/approvals?status=all`).then(r => r.json()),
      ])
      if (sR && !sR.error) setStats(sR)
      if (Array.isArray(oR)) setOrders(oR)
      if (Array.isArray(pR)) setProducts(pR)
      if (Array.isArray(cR)) setCustomers(cR)
      if (Array.isArray(rvR)) setReviews(rvR)
      if (Array.isArray(cpR)) setCampaigns(cpR)
      if (Array.isArray(iR)) setIntents(iR)
      if (cfR && !cfR.error) setStoreConfig(cfR)
      if (Array.isArray(mR)) setMissions(mR)
      if (Array.isArray(aR)) setApprovals(aR)
    } catch (e) { console.error(e) }
  }, [isAuthenticated])

  useEffect(() => {
    fetchData()
    if (!isModalOpen) { const t = setInterval(fetchData, 12000); return () => clearInterval(t) }
  }, [fetchData, isModalOpen])

  // ─── CRUD ───────────────────────────────────────────────────

  const saveProduct = async (data) => {
    try {
      setLoading(true)
      const isEdit = productModal.mode === 'edit'
      const res = await fetch(isEdit ? `${BASE_URL}/products/${data.id}` : `${BASE_URL}/products`, {
        method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      })
      if (res.ok) { notify(isEdit ? 'Product updated' : 'Product created'); setProductModal({ open: false, mode: 'create', data: null }); fetchData() }
      else { const r = await res.json(); notify(r.error || 'Failed to save', 'error') }
    } catch { notify('Failed to save', 'error') }
    finally { setLoading(false) }
  }

  const deleteProduct = async (id) => {
    try { setLoading(true); const r = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' }); if (r.ok) { notify('Product deleted'); setDeleteConfirm({ open: false, type: '', id: '', name: '' }); fetchData() } }
    catch { notify('Failed to delete', 'error') }
    finally { setLoading(false) }
  }

  const updateOrderStatus = async (id, status) => {
    const r = await fetch(`${BASE_URL}/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    if (r.ok) { notify(`Order updated`); fetchData() }
  }

  const updateShipment = async (orderId, data) => {
    try { setLoading(true); const r = await fetch(`${BASE_URL}/shipments/${orderId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (r.ok) { notify('Shipment updated'); setShipmentModal({ open: false, order: null }); fetchData() } }
    catch { notify('Failed', 'error') }
    finally { setLoading(false) }
  }

  const updateReview = async (id, data) => {
    try { setLoading(true); const r = await fetch(`${BASE_URL}/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (r.ok) { notify('Review updated'); setReviewModal({ open: false, review: null }); fetchData() } }
    catch { notify('Failed', 'error') }
    finally { setLoading(false) }
  }

  const deleteReview = async (id) => {
    try { setLoading(true); const r = await fetch(`${BASE_URL}/reviews/${id}`, { method: 'DELETE' }); if (r.ok) { notify('Review deleted'); setDeleteConfirm({ open: false, type: '', id: '', name: '' }); fetchData() } }
    catch { notify('Failed', 'error') }
    finally { setLoading(false) }
  }

  const saveCampaign = async (data) => {
    try {
      setLoading(true); const isEdit = campaignModal.mode === 'edit'
      const r = await fetch(isEdit ? `${BASE_URL}/campaigns/${data.id}` : `${BASE_URL}/campaigns`, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (r.ok) { notify(isEdit ? 'Campaign updated' : 'Campaign created'); setCampaignModal({ open: false, mode: 'create', data: null }); fetchData() }
    } catch { notify('Failed', 'error') }
    finally { setLoading(false) }
  }

  const deleteCampaign = async (id) => {
    try { setLoading(true); const r = await fetch(`${BASE_URL}/campaigns/${id}`, { method: 'DELETE' }); if (r.ok) { notify('Campaign deleted'); setDeleteConfirm({ open: false, type: '', id: '', name: '' }); fetchData() } }
    catch { notify('Failed', 'error') }
    finally { setLoading(false) }
  }

  const updateStoreConfig = async (data) => {
    try { setLoading(true); const r = await fetch(`${BASE_URL}/store-config`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (r.ok) { notify('Settings saved'); fetchData() } }
    catch { notify('Failed', 'error') }
    finally { setLoading(false) }
  }

  const handleApproval = async (id, status) => {
    const r = await fetch(`${BASE_URL}/approvals/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    if (r.ok) { notify(status === 'approved' ? 'Approved' : 'Rejected', status === 'approved' ? 'success' : 'error'); fetchData() }
  }

  const handleExport = async (type) => {
    const r = await fetch(`${BASE_URL}/export/${type}`); const data = await r.json()
    if (Array.isArray(data)) { downloadCSV(data, `${type}-${new Date().toISOString().split('T')[0]}.csv`); notify('Export ready') }
  }

  const handleDelete = async () => {
    const { type, id } = deleteConfirm
    if (type === 'product') await deleteProduct(id)
    else if (type === 'review') await deleteReview(id)
    else if (type === 'campaign') await deleteCampaign(id)
  }

  // ─── SECTION: HOME ──────────────────────────────────────────

  const renderHome = () => {
    const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total || 0), 0)
    const conversionRate = stats?.totalConversations > 0 ? ((orders.length / stats.totalConversations) * 100).toFixed(1) : '0.0'

    const kpiCards = [
      {
        label: 'REVENUE', value: `$${totalRevenue.toFixed(2)}`,
        desc: 'Gross sales in the selected range', change: '+12.5%', up: true,
        icon: DollarSign,
      },
      {
        label: 'ORDERS', value: orders.length,
        desc: 'Completed and active transactions', change: '+8.2%', up: true,
        icon: ShoppingCart,
      },
      {
        label: 'AI SESSIONS', value: stats?.totalConversations || 0,
        desc: 'Live assistant-led shopping chats', change: '+24.0%', up: true,
        icon: MessageSquare,
      },
      {
        label: 'CONVERSION', value: `${conversionRate}%`,
        desc: 'Sessions that turned into orders', change: '-2.1%', up: false,
        icon: TrendingUp,
      },
    ]

    const storePulse = [
      { label: 'Orders in range', desc: 'Total transactions captured', value: orders.length },
      { label: 'AI-assisted orders', desc: orders.length === 0 ? 'No AI-assisted orders yet' : `${Math.floor(orders.length * 0.6)} orders via AI`, value: Math.floor(orders.length * 0.6) },
      { label: 'Active AI workflows', desc: `${missions.filter(m => m.status === 'active').length} completed workflows`, value: missions.filter(m => m.status === 'active').length },
    ]

    return (
      <div>
        {/* Top controls bar */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 border border-gray-200 bg-white rounded-full px-3 py-1.5">
              <Sparkles className="w-3 h-3" /> LIVE COMMERCE OPERATIONS
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Time range */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
              {['1D', '7D', '30D'].map(r => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${chartRange === r ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={() => setActiveSection('conversations')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:border-gray-300 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Conversations
            </button>
            <button
              onClick={() => { setProductModal({ open: true, mode: 'create', data: null }); setActiveSection('catalog') }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Create product
            </button>
          </div>
        </div>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Overview</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
            Watch revenue, AI activity, and storefront readiness from one control surface for {storeConfig?.name || 'your store'}.
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {kpiCards.map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{card.label}</span>
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <card.icon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900 tracking-tight mb-2">{card.value}</p>
              <p className="text-xs text-gray-400 leading-snug mb-3">{card.desc}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${card.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </span>
            </div>
          ))}
        </div>

        {/* Sales performance + Store pulse */}
        <div className="grid grid-cols-3 gap-4">
          {/* Sales performance chart */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Sales performance</h3>
                <p className="text-xs text-gray-400 mt-0.5">A cleaner view of what your store and AI agent generated over the last {chartRange === '1D' ? '24 hours' : chartRange === '7D' ? '7 days' : '30 days'}.</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">NET SALES</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold mt-1 ${totalRevenue > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {totalRevenue > 0 ? '+' : ''}0.0% vs prior period
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111827" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={chartRange === '7D' ? 0 : 4} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="Revenue" stroke="#111827" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 3, fill: '#111827' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Store pulse */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 className="text-base font-bold text-gray-900 mb-4">Store pulse</h3>
            <div className="space-y-0">
              {storePulse.map((item, i) => (
                <div key={item.label} className={`flex items-center justify-between py-4 ${i < storePulse.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 shrink-0 ml-4">{item.value}</span>
                </div>
              ))}
            </div>
            {/* Recent orders quick view */}
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500">Recent Orders</p>
                <button onClick={() => setActiveSection('orders')} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">View all →</button>
              </div>
              <div className="space-y-2">
                {orders.slice(0, 3).map(o => (
                  <div key={o.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{o.order_number}</p>
                      <p className="text-[10px] text-gray-400">{o.shipping_address?.name || 'N/A'}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-700">${parseFloat(o.total || 0).toFixed(2)}</span>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No orders yet</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── SECTION: ORDERS ────────────────────────────────────────

  const renderOrders = () => {
    const filtered = orders.filter(o => {
      if (orderFilter !== 'all' && o.status !== orderFilter) return false
      if (orderSearch) { const s = orderSearch.toLowerCase(); return o.order_number?.toLowerCase().includes(s) || o.shipping_address?.name?.toLowerCase().includes(s) }
      return true
    })
    const counts = { all: orders.length, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
    orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++ })

    return (
      <div>
        <PageHeader
          title="Orders"
          description={`${orders.length} total orders · ${counts.pending} pending`}
          actions={<Button variant="outline" size="sm" onClick={() => handleExport('orders')} className="rounded-xl border-gray-200 text-sm h-9"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>}
        />

        {/* Status cards */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { key: 'pending', label: 'Pending', color: 'text-amber-600' },
            { key: 'processing', label: 'Processing', color: 'text-blue-600' },
            { key: 'shipped', label: 'Shipped', color: 'text-purple-600' },
            { key: 'delivered', label: 'Delivered', color: 'text-emerald-600' },
            { key: 'cancelled', label: 'Cancelled', color: 'text-red-500' },
          ].map(s => (
            <button key={s.key} onClick={() => setOrderFilter(s.key)}
              className={`bg-white rounded-2xl border p-4 text-center transition-all ${orderFilter === s.key ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-100 hover:border-gray-200'}`}
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <p className={`text-3xl font-bold ${orderFilter === s.key ? s.color : 'text-gray-800'}`}>{counts[s.key]}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Search + All filter */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search order # or customer…" className="w-full pl-10 pr-4 h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
          </div>
          <button onClick={() => setOrderFilter('all')} className={`h-10 px-4 rounded-xl text-sm font-semibold transition-colors ${orderFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            All Orders ({counts.all})
          </button>
        </div>

        <DataTable>
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><TH>Order</TH><TH>Customer</TH><TH>Items</TH><TH right>Total</TH><TH center>Payment</TH><TH center>Status</TH><TH center>View</TH></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors group">
                  <TD><div><p className="text-sm font-semibold text-gray-900">{o.order_number}</p><p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p></div></TD>
                  <TD>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">{o.shipping_address?.name?.charAt(0)?.toUpperCase() || '?'}</div>
                      <span className="text-sm text-gray-700">{o.shipping_address?.name || 'N/A'}</span>
                    </div>
                  </TD>
                  <TD><span className="text-sm text-gray-600">{(o.items || []).length} item{(o.items || []).length !== 1 ? 's' : ''}</span></TD>
                  <TD right><span className="text-sm font-bold text-gray-900">${parseFloat(o.total || 0).toFixed(2)}</span></TD>
                  <TD center>
                    <StatusPill status={o.payment_status || 'unknown'} map={{ paid: { label: 'Paid', dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' }, pending: { label: 'Pending', dot: 'bg-amber-400', pill: 'bg-amber-50 text-amber-700 border-amber-200' }, failed: { label: 'Failed', dot: 'bg-red-400', pill: 'bg-red-50 text-red-700 border-red-200' }, unknown: { label: 'Unpaid', dot: 'bg-gray-400', pill: 'bg-gray-100 text-gray-600 border-gray-200' }, unpaid: { label: 'Unpaid', dot: 'bg-gray-400', pill: 'bg-gray-100 text-gray-600 border-gray-200' } }} />
                  </TD>
                  <TD center>
                    <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} className="text-xs px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 outline-none focus:border-gray-400 cursor-pointer">
                      {Object.entries(STATUS_ORDER).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                    </select>
                  </TD>
                  <TD center>
                    <button onClick={() => setOrderModal({ open: true, order: o })} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"><Eye className="w-4 h-4" /></button>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptySlate icon={ShoppingBag} title="No orders found" description="Orders appear here after customers complete purchases." />}
        </DataTable>
      </div>
    )
  }

  // ─── SECTION: CATALOG ────────────────────────────────────────

  const renderCatalog = () => {
    const filtered = products.filter(p => {
      const q = productSearch.toLowerCase()
      return (!productSearch || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)) &&
        (productCatFilter === 'all' || p.category === productCatFilter)
    })
    const lowStock = products.filter(p => (p.stock || 0) < 20)

    return (
      <div>
        <PageHeader
          title="Product Catalog"
          description={`${products.length} products · ${lowStock.length} low on stock`}
          actions={
            <>
              <Button variant="outline" size="sm" onClick={() => handleExport('products')} className="rounded-xl border-gray-200 text-sm h-9"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
              <button onClick={() => { setProductForm({ name: '', description: '', price: '', compare_at_price: '', category: 'Single Origin', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', stock: '', bargain_enabled: true, bargain_min_price: '', weight: '' }); setProductModal({ open: true, mode: 'create', data: null }) }}
                className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </>
          }
        />

        {lowStock.length > 0 && (
          <div className="mb-5 flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-3.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800"><strong>{lowStock.length} product{lowStock.length > 1 ? 's' : ''}</strong> running low on stock — under 20 units</p>
            <span className="ml-auto text-xs font-medium text-amber-600">{lowStock.slice(0, 2).map(p => p.name).join(', ')}{lowStock.length > 2 ? ` +${lowStock.length - 2}` : ''}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search products…" className="w-full pl-10 pr-4 h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors" value={productSearch} onChange={e => setProductSearch(e.target.value)} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['all', ...PRODUCT_CATEGORIES].map(c => (
              <button key={c} onClick={() => setProductCatFilter(c)}
                className={`px-3 h-10 rounded-xl text-xs font-semibold transition-all ${productCatFilter === c ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}>
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button onClick={() => setCatalogView('grid')} className={`px-3 h-10 flex items-center transition-colors ${catalogView === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
            <button onClick={() => setCatalogView('table')} className={`px-3 h-10 flex items-center transition-colors ${catalogView === 'table' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}><List className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {catalogView === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button onClick={() => { setProductForm({ ...p }); setProductModal({ open: true, mode: 'edit', data: p }) }} className="w-9 h-9 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-gray-900"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteConfirm({ open: true, type: 'product', id: p.id, name: p.name })} className="w-9 h-9 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  {(p.stock || 0) < 20 && <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">Low</div>}
                  {p.bargain_enabled && <div className="absolute top-2 left-2 bg-gray-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5"><Zap className="w-2.5 h-2.5" /> AI</div>}
                </div>
                <div className="p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{p.category}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900">${p.price}</span>
                    <span className={`text-xs font-medium ${(p.stock || 0) < 20 ? 'text-amber-600' : 'text-gray-400'}`}>{p.stock || 0} left</span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="col-span-full"><EmptySlate icon={Package} title="No products found" description="Add your first product." /></div>}
          </div>
        ) : (
          <DataTable>
            <table className="w-full">
              <thead><tr className="border-b border-gray-100"><TH>Product</TH><TH right>Price</TH><TH center>Stock</TH><TH>Category</TH><TH center>AI Bargain</TH><TH center>Actions</TH></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <TD>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
                        <div><p className="text-sm font-semibold text-gray-900">{p.name}</p><p className="text-xs text-gray-400 max-w-[180px] truncate">{p.description?.substring(0, 50)}…</p></div>
                      </div>
                    </TD>
                    <TD right><p className="font-bold text-gray-900">${p.price}</p>{p.compare_at_price > p.price && <p className="text-xs text-gray-400 line-through">${p.compare_at_price}</p>}</TD>
                    <TD center><p className={`text-sm font-bold ${(p.stock || 0) < 20 ? 'text-amber-600' : 'text-gray-700'}`}>{p.stock || 0}</p></TD>
                    <TD><span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">{p.category}</span></TD>
                    <TD center>{p.bargain_enabled ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg"><Zap className="w-3 h-3" /> ${p.bargain_min_price}</span> : <span className="text-xs text-gray-300">Off</span>}</TD>
                    <TD center>
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => { setProductForm({ ...p }); setProductModal({ open: true, mode: 'edit', data: p }) }} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteConfirm({ open: true, type: 'product', id: p.id, name: p.name })} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <EmptySlate icon={Package} title="No products found" description="Add your first product." />}
          </DataTable>
        )}
      </div>
    )
  }

  // ─── SECTION: CUSTOMERS ────────────────────────────────────

  const renderCustomers = () => {
    const avgTrust = customers.length ? Math.round(customers.reduce((s, c) => s + (c.trust_score || 80), 0) / customers.length) : 0
    return (
      <div>
        <PageHeader title="Customer Intelligence" description={`${customers.length} consumer profiles tracked by AI`} actions={<Button variant="outline" size="sm" onClick={() => handleExport('customers')} className="rounded-xl border-gray-200 h-9"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>} />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[{ label: 'Total', value: customers.length, icon: Users, color: 'text-gray-700' }, { label: 'Avg Trust Score', value: `${avgTrust}/100`, icon: Shield, color: 'text-emerald-600' }, { label: 'Total Spent', value: `$${customers.reduce((s, c) => s + (c.total_spent || 0), 0).toFixed(0)}`, icon: DollarSign, color: 'text-blue-600' }, { label: 'High Risk', value: customers.filter(c => c.risk_level === 'high').length, icon: AlertTriangle, color: 'text-red-500' }].map(m => (
            <div key={m.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0"><m.icon className={`w-5 h-5 ${m.color}`} /></div>
              <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{m.label}</p><p className={`text-2xl font-bold ${m.color}`}>{m.value}</p></div>
            </div>
          ))}
        </div>
        {customers.length === 0 ? <EmptySlate icon={Users} title="No customers yet" description="Profiles are created when buyers interact with your AI store." /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-all" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }} onClick={() => setCustomerModal({ open: true, customer: c })}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm shrink-0">{c.session_id?.charAt(0)?.toUpperCase() || '?'}</div>
                  <div className="flex-1 min-w-0"><p className="font-bold text-gray-900 text-sm">#{c.session_id?.slice(0, 8)}</p><p className="text-xs text-gray-400">{c.interactions || 0} interactions</p></div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${c.risk_level === 'high' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{c.risk_level || 'low'} risk</span>
                </div>
                <div className="mb-3"><div className="flex justify-between mb-1.5"><span className="text-xs text-gray-500">Trust Score</span><span className="text-xs font-bold text-emerald-600">{c.trust_score || 80}/100</span></div><div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.trust_score || 80}%` }} /></div></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center"><p className="text-[10px] text-gray-400">Spent</p><p className="font-bold text-gray-900 text-sm">${(c.total_spent || 0).toFixed(2)}</p></div>
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center"><p className="text-[10px] text-gray-400">Orders</p><p className="font-bold text-gray-900 text-sm">{c.total_orders || 0}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ─── SECTION: REVIEWS ────────────────────────────────────

  const renderReviews = () => {
    const filtered = reviews.filter(r => reviewFilter === 'all' || r.status === reviewFilter)
    const pending = reviews.filter(r => r.status === 'pending').length
    const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : '0.0'
    return (
      <div>
        <PageHeader title="Reviews" description={`${reviews.length} total · ★ ${avg} average · ${pending} pending moderation`} />
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 flex items-center gap-8" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="text-center shrink-0"><p className="text-5xl font-black text-gray-900">{avg}</p><div className="flex gap-0.5 mt-1 justify-center">{[1,2,3,4,5].map(i=><Star key={i} className={`w-3.5 h-3.5 ${i<=Math.round(parseFloat(avg))? 'fill-amber-400 text-amber-400':'text-gray-200'}`}/>)}</div><p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p></div>
            <div className="flex-1 space-y-1.5">{[5,4,3,2,1].map(s=>{const c=reviews.filter(r=>r.rating===s).length;const p=reviews.length?(c/reviews.length)*100:0;return(<div key={s} className="flex items-center gap-2"><span className="text-xs text-gray-500 w-3">{s}</span><Star className="w-3 h-3 fill-amber-400 text-amber-400"/><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{width:`${p}%`}}/></div><span className="text-xs text-gray-400 w-5 text-right">{c}</span></div>)})}</div>
          </div>
        )}
        <div className="flex gap-2 mb-5">
          {[{v:'all',l:'All'},{v:'pending',l:'Pending',count:pending},{v:'published',l:'Published'},{v:'rejected',l:'Rejected'}].map(s=>(
            <button key={s.v} onClick={()=>setReviewFilter(s.v)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${reviewFilter===s.v?'bg-gray-900 text-white':'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              {s.l}{s.count>0&&<span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${reviewFilter===s.v?'bg-white/20':'bg-red-500 text-white'}`}>{s.count}</span>}
            </button>
          ))}
        </div>
        {filtered.length===0?<EmptySlate icon={Star} title="No reviews" description="Customer reviews will appear here." />:(
          <div className="space-y-3">
            {filtered.map(r=>(
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    {r.product?.image&&<img src={r.product.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"/>}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2"><span className="font-bold text-gray-900 text-sm">{r.product?.name||'Product'}</span><span className="text-xs text-gray-400">by {r.author_name}</span><StatusPill status={r.status} map={STATUS_REVIEW}/></div>
                      <div className="flex items-center gap-0.5 mb-2">{[1,2,3,4,5].map(i=><Star key={i} className={`w-3.5 h-3.5 ${i<=r.rating?'fill-amber-400 text-amber-400':'text-gray-200'}`}/>)}{r.title&&<span className="ml-2 text-sm font-semibold text-gray-700">"{r.title}"</span>}</div>
                      <p className="text-sm text-gray-600 leading-relaxed">{r.content}</p>
                      {r.merchant_reply&&<div className="mt-3 pl-4 border-l-2 border-gray-200 bg-gray-50 rounded-r-xl p-3"><p className="text-xs font-bold text-gray-600 mb-0.5">Your Reply</p><p className="text-xs text-gray-500">{r.merchant_reply}</p></div>}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {r.status==='pending'&&<><button onClick={()=>updateReview(r.id,{status:'published'})} className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 transition-colors"><Check className="w-3.5 h-3.5"/></button><button onClick={()=>updateReview(r.id,{status:'rejected'})} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-colors"><X className="w-3.5 h-3.5"/></button></>}
                    <button onClick={()=>{setReviewReply(r.merchant_reply||'');setReviewModal({open:true,review:r})}} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-gray-100 transition-colors"><Reply className="w-3.5 h-3.5"/></button>
                    <button onClick={()=>setDeleteConfirm({open:true,type:'review',id:r.id,name:r.title||'review'})} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-100 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ─── SECTION: SHIPMENTS ────────────────────────────────────

  const renderShipments = () => {
    const shipments = orders.filter(o => ['processing','shipped','delivered'].includes(o.status))
    return (
      <div>
        <PageHeader title="Shipments" description={`${shipments.length} active shipment records`} />
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[{l:'Processing',v:shipments.filter(s=>s.status==='processing').length,c:'text-blue-600',i:Truck},{l:'In Transit',v:shipments.filter(s=>s.status==='shipped').length,c:'text-purple-600',i:Truck},{l:'Delivered',v:shipments.filter(s=>s.status==='delivered').length,c:'text-emerald-600',i:CheckCircle}].map(m=>(
            <div key={m.l} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
              <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center shrink-0"><m.i className={`w-5 h-5 ${m.c}`}/></div>
              <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{m.l}</p><p className={`text-3xl font-bold ${m.c}`}>{m.v}</p></div>
            </div>
          ))}
        </div>
        {shipments.length===0?<EmptySlate icon={Truck} title="No shipments" description="Orders in processing or shipped status appear here."/>:(
          <DataTable>
            <table className="w-full">
              <thead><tr className="border-b border-gray-100"><TH>Order</TH><TH>Customer</TH><TH>Carrier</TH><TH>Tracking #</TH><TH center>Status</TH><TH center>Edit</TH></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {shipments.map(s=>(
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <TD><p className="text-sm font-semibold text-gray-900">{s.order_number}</p><p className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString()}</p></TD>
                    <TD><span className="text-sm text-gray-700">{s.shipping_address?.name||'N/A'}</span></TD>
                    <TD>{s.carrier?<span className="text-sm font-semibold text-gray-900">{s.carrier}</span>:<span className="text-xs text-gray-300 italic">Not assigned</span>}</TD>
                    <TD>{s.tracking_number?<code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-mono">{s.tracking_number}</code>:<span className="text-xs text-gray-300 italic">No tracking</span>}</TD>
                    <TD center><StatusPill status={s.status}/></TD>
                    <TD center><button onClick={()=>{setShipmentForm({carrier:s.carrier||'',tracking_number:s.tracking_number||'',status:s.status||'processing',notes:s.notes||''});setShipmentModal({open:true,order:s})}} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"><Edit className="w-3.5 h-3.5"/></button></TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>
        )}
      </div>
    )
  }

  // ─── SECTION: CAMPAIGNS ────────────────────────────────────

  const renderCampaigns = () => (
    <div>
      <PageHeader title="Campaigns" description={`${campaigns.length} campaigns · ${campaigns.filter(c=>c.status==='active').length} active`} actions={<button onClick={()=>{setCampaignForm({name:'',description:'',type:'email',status:'draft',audience_count:'',content:{subject:'',body:'',cta:''}});setCampaignModal({open:true,mode:'create',data:null})}} className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold"><Plus className="w-3.5 h-3.5"/> Create Campaign</button>} />
      {campaigns.length===0?<EmptySlate icon={Megaphone} title="No campaigns" description="Create email, SMS, or push campaigns to reach customers."/>:(
        <div className="space-y-3">
          {campaigns.map(c=>(
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-all" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
              <div className="flex items-start justify-between mb-4">
                <div><div className="flex items-center gap-2.5 mb-1.5"><h3 className="font-bold text-gray-900">{c.name}</h3><StatusPill status={c.status} map={STATUS_CAMPAIGN}/><span className="text-xs font-bold uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{c.type}</span></div><p className="text-sm text-gray-500">{c.description}</p></div>
                <div className="flex gap-1.5 ml-4"><button onClick={()=>{setCampaignForm({...c});setCampaignModal({open:true,mode:'edit',data:c})}} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"><Edit className="w-3.5 h-3.5"/></button><button onClick={()=>setDeleteConfirm({open:true,type:'campaign',id:c.id,name:c.name})} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-3.5 h-3.5"/></button></div>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-50">{[{l:'Audience',v:c.audience_count||0},{l:'Sent',v:c.sent_count||0},{l:'Open Rate',v:`${c.open_rate||0}%`},{l:'Click Rate',v:`${c.click_rate||0}%`}].map(m=><div key={m.l}><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{m.l}</p><p className="text-2xl font-bold text-gray-900 mt-0.5">{m.v}</p></div>)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ─── SECTION: CONVERSATIONS ────────────────────────────────

  const renderConversations = () => {
    const filtered = intents.filter(i => intentFilter === 'all' || i.type === intentFilter)
    return (
      <div>
        <PageHeader title="Live Intent Stream" description="Real-time buyer activity and AI interactions" actions={<button onClick={fetchData} className="h-9 w-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all"><RefreshCw className="w-4 h-4"/></button>} />
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>LIVE</span>
          {['all','search','add_to_cart','negotiate','checkout','message','mission_create'].map(t=>(
            <button key={t} onClick={()=>setIntentFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${intentFilter===t?'bg-gray-900 text-white':'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>{t==='all'?'All':t.replace('_',' ')}</button>
          ))}
        </div>
        {filtered.length===0?<EmptySlate icon={Activity} title="No activity yet" description="Customer interactions stream here in real-time."/>:(
          <div className="space-y-2">
            {filtered.map((intent,i)=>{const cfg=INTENT_TYPE[intent.type]||{color:'bg-gray-100 text-gray-600',icon:Activity};const Icon=cfg.icon;return(
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 hover:bg-gray-50/50 transition-colors" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.03)'}}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.color}`}><Icon className="w-4 h-4"/></div>
                <div className="flex-1 min-w-0"><p className="text-sm text-gray-700">{intent.description}</p><div className="flex items-center gap-2 mt-1"><span className="text-xs text-gray-400">{new Date(intent.timestamp).toLocaleString()}</span><span className="text-gray-200">·</span><span className="text-xs text-gray-400 font-mono">#{intent.session_id?.slice(0,8)}</span></div></div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${cfg.color}`}>{intent.type?.replace('_',' ')}</span>
              </div>
            )})}
          </div>
        )}
      </div>
    )
  }

  // ─── SECTION: AI AUTHORITY (MISSIONS) ──────────────────────

  const renderMissions = () => {
    const filtered = missions.filter(m => missionFilter === 'all' || m.status === missionFilter)
    return (
      <div>
        <PageHeader title="AI Authority" description="Buyer AI agents working on active shopping goals" actions={<span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>{missions.filter(m=>m.status==='active').length} running</span>} />
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[{l:'Active',v:missions.filter(m=>m.status==='active').length,c:'text-gray-900'},{l:'Completed',v:missions.filter(m=>m.status==='completed').length,c:'text-emerald-600'},{l:'Total',v:missions.length,c:'text-gray-700'}].map(m=>(
            <div key={m.l} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}><div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0"><Target className={`w-5 h-5 ${m.c}`}/></div><div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{m.l}</p><p className={`text-3xl font-bold ${m.c}`}>{m.v}</p></div></div>
          ))}
        </div>
        <div className="flex gap-2 mb-5">{['all','active','completed','failed'].map(s=><button key={s} onClick={()=>setMissionFilter(s)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${missionFilter===s?'bg-gray-900 text-white':'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>{s==='all'?'All Missions':s}</button>)}</div>
        {filtered.length===0?<EmptySlate icon={Target} title="No missions" description="Buyer AI missions appear here when customers set shopping goals."/>:(
          <div className="space-y-3">
            {filtered.map(m=>(
              <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-5" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.status==='active'?'bg-gray-100':'m.status==="completed"'?'bg-emerald-50':'bg-gray-50'}`}><Bot className={`w-5 h-5 ${m.status==='active'?'text-gray-700':m.status==='completed'?'text-emerald-600':'text-gray-400'}`}/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5"><h3 className="font-bold text-gray-900 text-sm">{m.goal}</h3><span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${m.status==='active'?'bg-gray-900 text-white':m.status==='completed'?'bg-emerald-50 text-emerald-700 border border-emerald-200':'bg-gray-100 text-gray-500'}`}>{m.status}</span>{m.status==='active'&&<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3"><span className="font-mono bg-gray-50 px-2 py-0.5 rounded-md">#{m.session_id?.slice(0,12)}</span>{m.budget_max&&<span className="bg-gray-50 px-2 py-0.5 rounded-md">Budget: ${m.budget_max}</span>}<span>{new Date(m.created_at).toLocaleString()}</span></div>
                    <div><div className="flex justify-between mb-1.5"><span className="text-xs text-gray-500">Progress</span><span className="text-xs font-bold text-gray-700">{m.progress||0}%</span></div><div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${m.status==='active'?'bg-gray-900':m.status==='completed'?'bg-emerald-500':'bg-gray-300'}`} style={{width:`${m.progress||0}%`}}/></div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ─── SECTION: APPROVALS ────────────────────────────────────

  const renderApprovals = () => {
    const pending = approvals.filter(a => a.status === 'pending')
    const resolved = approvals.filter(a => a.status !== 'pending')
    return (
      <div>
        <PageHeader title="AI Approval Queue" description="Review sensitive AI agent actions before they execute" actions={pending.length>0?<span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700"><AlertTriangle className="w-3.5 h-3.5"/>{pending.length} awaiting</span>:<span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700"><CheckCircle className="w-3.5 h-3.5"/>All clear</span>} />
        {pending.length===0&&<div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center mb-6"><CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3"/><p className="font-bold text-emerald-800">All caught up!</p><p className="text-sm text-emerald-600 mt-1">No pending AI actions require your approval.</p></div>}
        {pending.length>0&&(
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3"><div className="w-1 h-5 bg-amber-400 rounded-full"/><p className="text-sm font-bold text-gray-900">Pending Actions ({pending.length})</p></div>
            <div className="space-y-3">
              {pending.map(a=>{const t=TYPE_APPROVAL[a.type]||{label:a.type,bg:'bg-gray-50',text:'text-gray-600',pill:'bg-gray-100 text-gray-600 border-gray-200'};const TI=t.icon||Shield;return(
                <div key={a.id} className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden" style={{boxShadow:'0 2px 8px rgba(251,191,36,0.1)'}}>
                  <div className="bg-amber-50 px-5 py-3 flex items-center gap-3 border-b border-amber-100"><span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${t.pill}`}>{t.label}</span><span className="text-xs text-amber-700 font-mono">Session: {a.session_id?.slice(0,12)}…</span><span className="text-xs text-amber-500 ml-auto">{new Date(a.created_at).toLocaleString()}</span></div>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl ${t.bg} flex items-center justify-center shrink-0`}><TI className={`w-5 h-5 ${t.text}`}/></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium mb-4">{a.description}</p>
                        {(a.original_price||a.requested_price)&&<div className="flex items-center gap-3 mb-4">{a.original_price&&<div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5"><p className="text-xs text-gray-400">Original</p><p className="font-bold text-gray-700 text-lg">${a.original_price}</p></div>}<ChevronRight className="w-4 h-4 text-gray-300"/>{a.requested_price&&<div className="bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-2.5"><p className="text-xs text-amber-600">AI Requested</p><p className="font-bold text-amber-700 text-lg">${a.requested_price}</p></div>}{a.original_price&&a.requested_price&&<div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5"><p className="text-xs text-red-400">Discount</p><p className="font-bold text-red-600 text-lg">-{(((a.original_price-a.requested_price)/a.original_price)*100).toFixed(1)}%</p></div>}</div>}
                        <div className="flex gap-2"><button onClick={()=>handleApproval(a.id,'approved')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold transition-colors"><Check className="w-4 h-4"/> Approve</button><button onClick={()=>handleApproval(a.id,'rejected')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-bold transition-colors"><X className="w-4 h-4"/> Reject</button></div>
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}
        {resolved.length>0&&<div><div className="flex items-center gap-2 mb-3"><div className="w-1 h-5 bg-gray-200 rounded-full"/><p className="text-sm font-bold text-gray-400">Resolved ({resolved.length})</p></div><div className="space-y-2">{resolved.map(a=><div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3"><div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${a.status==='approved'?'bg-emerald-50':'bg-red-50'}`}>{a.status==='approved'?<Check className="w-3.5 h-3.5 text-emerald-600"/>:<X className="w-3.5 h-3.5 text-red-500"/>}</div><div className="flex-1 min-w-0"><p className="text-sm text-gray-700 truncate">{a.description}</p><p className="text-xs text-gray-400">{a.status==='approved'?'Approved':'Rejected'} · {new Date(a.resolved_at||a.updated_at).toLocaleString()}</p></div><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.status==='approved'?'bg-emerald-50 text-emerald-700 border border-emerald-200':'bg-red-50 text-red-600 border border-red-200'}`}>{a.status}</span></div>)}</div></div>}
      </div>
    )
  }

  // ─── SECTION: STORE DESIGN ────────────────────────────────

  const renderStoreDesign = () => (
    <div>
      <PageHeader title="Store Design" description="Customize your storefront appearance and AI assistant" actions={<><a href="/store" target="_blank" rel="noopener noreferrer"><button className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:border-gray-300 transition-all"><ExternalLink className="w-3.5 h-3.5"/> Preview</button></a><button onClick={()=>updateStoreConfig(storeConfig)} disabled={loading} className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold disabled:opacity-50 transition-colors">{loading?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<Check className="w-3.5 h-3.5"/>} Save</button></>} />
      {storeConfig?(
        <Tabs defaultValue="general" className="space-y-5">
          <TabsList className="bg-gray-100 border border-gray-200 p-1 rounded-xl"><TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">General</TabsTrigger><TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">AI Assistant</TabsTrigger><TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">Appearance</TabsTrigger></TabsList>
          <TabsContent value="general"><div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>{[{label:'Store Name',key:'name',placeholder:'e.g. Artisan Coffee Roasters'},{label:'Tagline',key:'tagline',placeholder:'e.g. Best coffee in town'},{label:'Banner Text',key:'banner',placeholder:'e.g. FREE SHIPPING OVER $100'}].map(f=><div key={f.key}><Label className="text-sm font-semibold text-gray-700">{f.label}</Label><Input value={storeConfig[f.key]||''} onChange={e=>setStoreConfig({...storeConfig,[f.key]:e.target.value})} className="mt-2 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder={f.placeholder}/></div>)}<div><Label className="text-sm font-semibold text-gray-700">Description</Label><Textarea value={storeConfig.description||''} onChange={e=>setStoreConfig({...storeConfig,description:e.target.value})} className="mt-2 border-gray-200 rounded-xl text-gray-900 bg-white" rows={3}/></div><div><Label className="text-sm font-semibold text-gray-700">Store Status</Label><Select value={storeConfig.status||'live'} onValueChange={v=>setStoreConfig({...storeConfig,status:v})}><SelectTrigger className="mt-2 border-gray-200 rounded-xl h-10 text-gray-900 bg-white"><SelectValue/></SelectTrigger><SelectContent className="bg-white border-gray-200 rounded-xl"><SelectItem value="live">🟢 Live</SelectItem><SelectItem value="maintenance">🟡 Maintenance</SelectItem><SelectItem value="closed">🔴 Closed</SelectItem></SelectContent></Select></div></div></TabsContent>
          <TabsContent value="ai"><div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}><div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"><div className="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center shrink-0"><Bot className="w-5 h-5 text-white"/></div><div><p className="text-sm font-bold text-gray-900">AI Assistant Configuration</p><p className="text-xs text-gray-500 mt-0.5">Control how your AI shopping assistant introduces itself</p></div></div><div><Label className="text-sm font-semibold text-gray-700">AI Name</Label><Input value={storeConfig.ai_name||''} onChange={e=>setStoreConfig({...storeConfig,ai_name:e.target.value})} className="mt-2 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="e.g. Aria, Mark, Sage"/></div><div><Label className="text-sm font-semibold text-gray-700">Greeting Message</Label><Textarea value={storeConfig.ai_greeting||''} onChange={e=>setStoreConfig({...storeConfig,ai_greeting:e.target.value})} className="mt-2 border-gray-200 rounded-xl text-gray-900 bg-white" rows={3} placeholder="Hey! What are you shopping for today?"/></div></div></TabsContent>
          <TabsContent value="appearance"><div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}><div><Label className="text-sm font-semibold text-gray-700">Hero Image URL</Label><Input value={storeConfig.hero_image||''} onChange={e=>setStoreConfig({...storeConfig,hero_image:e.target.value})} className="mt-2 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="https://…"/>{storeConfig.hero_image&&<img src={storeConfig.hero_image} alt="Preview" className="mt-3 w-full h-36 object-cover rounded-xl border border-gray-100" onError={e=>e.target.style.display='none'}/>}</div><div><Label className="text-sm font-semibold text-gray-700">Logo URL</Label><Input value={storeConfig.logo_url||''} onChange={e=>setStoreConfig({...storeConfig,logo_url:e.target.value})} className="mt-2 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="https://…"/></div></div></TabsContent>
        </Tabs>
      ):<div className="bg-white rounded-2xl border border-gray-100 p-16 text-center"><Loader2 className="w-8 h-8 animate-spin text-gray-200 mx-auto"/></div>}
    </div>
  )

  // ─── MODALS ─────────────────────────────────────────────────

  const ProductModal = () => (
    <Dialog open={productModal.open} onOpenChange={o=>!o&&setProductModal({open:false,mode:'create',data:null})}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader><DialogTitle className="text-gray-900 text-lg">{productModal.mode==='edit'?'Edit Product':'Add New Product'}</DialogTitle><DialogDescription className="text-gray-400">Fill in the product details below</DialogDescription></DialogHeader>
        <div className="space-y-4 py-2">
          {productForm.image&&<div className="relative h-40 bg-gray-100 rounded-2xl overflow-hidden"><img src={productForm.image} alt="Preview" className="w-full h-full object-cover" onError={e=>e.target.style.display='none'}/><span className="absolute bottom-3 left-3 text-white text-xs font-semibold bg-black/40 px-2.5 py-1 rounded-lg">Preview</span></div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Label className="text-sm font-semibold text-gray-700">Name *</Label><Input value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="e.g. Ethiopian Yirgacheffe"/></div>
            <div className="col-span-2"><Label className="text-sm font-semibold text-gray-700">Description</Label><Textarea value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl text-gray-900 bg-white" rows={2}/></div>
            <div><Label className="text-sm font-semibold text-gray-700">Price *</Label><Input type="number" step="0.01" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="0.00"/></div>
            <div><Label className="text-sm font-semibold text-gray-700">Compare at Price</Label><Input type="number" step="0.01" value={productForm.compare_at_price} onChange={e=>setProductForm({...productForm,compare_at_price:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="0.00"/></div>
            <div><Label className="text-sm font-semibold text-gray-700">Category</Label><Select value={productForm.category||'Single Origin'} onValueChange={v=>setProductForm({...productForm,category:v})}><SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue/></SelectTrigger><SelectContent className="bg-white border-gray-200 rounded-xl">{PRODUCT_CATEGORIES.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-sm font-semibold text-gray-700">Stock</Label><Input type="number" value={productForm.stock} onChange={e=>setProductForm({...productForm,stock:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="0"/></div>
            <div className="col-span-2"><Label className="text-sm font-semibold text-gray-700">Image URL</Label><Input value={productForm.image} onChange={e=>setProductForm({...productForm,image:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="https://…"/></div>
            <div><Label className="text-sm font-semibold text-gray-700">Weight</Label><Input value={productForm.weight} onChange={e=>setProductForm({...productForm,weight:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="e.g. 340g"/></div>
            <div><Label className="text-sm font-semibold text-gray-700">Min Bargain Price</Label><Input type="number" step="0.01" value={productForm.bargain_min_price} onChange={e=>setProductForm({...productForm,bargain_min_price:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="0.00"/></div>
            <div className="col-span-2 flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100"><Switch checked={productForm.bargain_enabled??true} onCheckedChange={v=>setProductForm({...productForm,bargain_enabled:v})}/><div><Label className="text-gray-800 font-semibold text-sm">Enable AI Price Negotiation</Label><p className="text-xs text-gray-400 mt-0.5">Allow AI to negotiate prices with buyers</p></div><Zap className="w-4 h-4 text-gray-400 ml-auto"/></div>
          </div>
        </div>
        <DialogFooter className="gap-2 mt-2"><Button variant="outline" onClick={()=>setProductModal({open:false,mode:'create',data:null})} className="rounded-xl border-gray-200">Cancel</Button><Button onClick={()=>saveProduct(productForm)} disabled={loading||!productForm.name||!productForm.price} className="rounded-xl bg-gray-900 hover:bg-gray-800 text-white">{loading&&<Loader2 className="w-4 h-4 animate-spin mr-2"/>}{productModal.mode==='edit'?'Update':'Create'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const OrderModal = () => {
    const o = orderModal.order; if (!o) return null
    return (
      <Dialog open={orderModal.open} onOpenChange={op=>!op&&setOrderModal({open:false,order:null})}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
          <DialogHeader><DialogTitle className="text-gray-900 text-lg">{o.order_number}</DialogTitle><DialogDescription className="text-gray-400">{new Date(o.created_at).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3"><div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100"><p className="text-xs text-gray-400 mb-1.5">Order Status</p><StatusPill status={o.status}/></div><div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100"><p className="text-xs text-gray-400 mb-1.5">Payment</p><StatusPill status={o.payment_status||'unknown'} map={{paid:{label:'Paid',dot:'bg-emerald-400',pill:'bg-emerald-50 text-emerald-700 border-emerald-200'},pending:{label:'Pending',dot:'bg-amber-400',pill:'bg-amber-50 text-amber-700 border-amber-200'},failed:{label:'Failed',dot:'bg-red-400',pill:'bg-red-50 text-red-700 border-red-200'},unknown:{label:'Unknown',dot:'bg-gray-400',pill:'bg-gray-100 text-gray-600 border-gray-200'},unpaid:{label:'Unpaid',dot:'bg-gray-400',pill:'bg-gray-100 text-gray-600 border-gray-200'}}}/></div></div>
            <div><h4 className="text-sm font-bold text-gray-900 mb-2.5">Items</h4><div className="space-y-2">{(o.items||[]).map((item,i)=><div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">{item.image&&<img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100"/>}<div className="flex-1"><p className="text-sm font-bold text-gray-900">{item.name}</p><p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price}</p></div><p className="font-bold text-gray-900">${(item.price*item.quantity).toFixed(2)}</p></div>)}</div></div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 text-sm"><div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${(o.subtotal||0).toFixed(2)}</span></div><div className="flex justify-between text-gray-500"><span>Shipping</span><span>${(o.shipping||0).toFixed(2)}</span></div><Separator className="my-1 bg-gray-200"/><div className="flex justify-between font-bold text-base text-gray-900"><span>Total</span><span>${parseFloat(o.total||0).toFixed(2)}</span></div></div>
            {o.shipping_address&&<div className="bg-gray-50 rounded-xl p-4 border border-gray-100"><h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400"/> Shipping Address</h4><div className="text-sm text-gray-600 space-y-1"><p className="font-semibold text-gray-800">{o.shipping_address.name}</p><p>{o.shipping_address.street}</p><p>{o.shipping_address.city}, {o.shipping_address.state} {o.shipping_address.zip}</p></div></div>}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const CampaignModal = () => (
    <Dialog open={campaignModal.open} onOpenChange={o=>!o&&setCampaignModal({open:false,mode:'create',data:null})}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader><DialogTitle className="text-gray-900 text-lg">{campaignModal.mode==='edit'?'Edit Campaign':'Create Campaign'}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div><Label className="text-sm font-semibold text-gray-700">Name *</Label><Input value={campaignForm.name} onChange={e=>setCampaignForm({...campaignForm,name:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl h-10 text-gray-900 bg-white"/></div>
          <div><Label className="text-sm font-semibold text-gray-700">Description</Label><Textarea value={campaignForm.description} onChange={e=>setCampaignForm({...campaignForm,description:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl text-gray-900 bg-white" rows={2}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-sm font-semibold text-gray-700">Type</Label><Select value={campaignForm.type} onValueChange={v=>setCampaignForm({...campaignForm,type:v})}><SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue/></SelectTrigger><SelectContent className="bg-white border-gray-200 rounded-xl"><SelectItem value="email">Email</SelectItem><SelectItem value="sms">SMS</SelectItem><SelectItem value="push">Push</SelectItem></SelectContent></Select></div>
            <div><Label className="text-sm font-semibold text-gray-700">Status</Label><Select value={campaignForm.status} onValueChange={v=>setCampaignForm({...campaignForm,status:v})}><SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue/></SelectTrigger><SelectContent className="bg-white border-gray-200 rounded-xl"><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="paused">Paused</SelectItem></SelectContent></Select></div>
          </div>
          <Separator className="bg-gray-100"/>
          <div><Label className="text-sm font-semibold text-gray-700">Subject</Label><Input value={campaignForm.content?.subject||''} onChange={e=>setCampaignForm({...campaignForm,content:{...(campaignForm.content||{}),subject:e.target.value}})} className="mt-1.5 border-gray-200 rounded-xl h-10 text-gray-900 bg-white"/></div>
          <div><Label className="text-sm font-semibold text-gray-700">Body</Label><Textarea value={campaignForm.content?.body||''} onChange={e=>setCampaignForm({...campaignForm,content:{...(campaignForm.content||{}),body:e.target.value}})} className="mt-1.5 border-gray-200 rounded-xl text-gray-900 bg-white" rows={3}/></div>
        </div>
        <DialogFooter className="gap-2 mt-2"><Button variant="outline" onClick={()=>setCampaignModal({open:false,mode:'create',data:null})} className="rounded-xl border-gray-200">Cancel</Button><Button onClick={()=>saveCampaign(campaignForm)} disabled={loading||!campaignForm.name} className="rounded-xl bg-gray-900 hover:bg-gray-800 text-white">{loading&&<Loader2 className="w-4 h-4 animate-spin mr-2"/>}{campaignModal.mode==='edit'?'Update':'Create'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const ReviewModal = () => (
    <Dialog open={reviewModal.open} onOpenChange={o=>!o&&setReviewModal({open:false,review:null})}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl">
        <DialogHeader><DialogTitle className="text-gray-900 text-lg">Reply to Review</DialogTitle><DialogDescription className="text-gray-400">Responding to {reviewModal.review?.author_name}</DialogDescription></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100"><div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(i=><Star key={i} className={`w-3.5 h-3.5 ${i<=(reviewModal.review?.rating||0)?'fill-amber-400 text-amber-400':'text-gray-200'}`}/>)}</div><p className="text-sm text-gray-700">{reviewModal.review?.content}</p></div>
          <div><Label className="text-sm font-semibold text-gray-700">Your Reply</Label><Textarea value={reviewReply} onChange={e=>setReviewReply(e.target.value)} className="mt-1.5 border-gray-200 rounded-xl text-gray-900 bg-white" rows={3} placeholder="Thank you for your feedback…"/></div>
          <div className="flex gap-2"><button onClick={()=>updateReview(reviewModal.review?.id,{status:'published',merchant_reply:reviewReply})} className={`flex-1 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border ${reviewModal.review?.status==='published'?'bg-emerald-600 text-white border-emerald-600':'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}><Check className="w-3 h-3"/> Publish</button><button onClick={()=>updateReview(reviewModal.review?.id,{status:'rejected',merchant_reply:reviewReply})} className={`flex-1 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border ${reviewModal.review?.status==='rejected'?'bg-red-500 text-white border-red-500':'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}><X className="w-3 h-3"/> Reject</button></div>
        </div>
        <DialogFooter className="gap-2 mt-2"><Button variant="outline" onClick={()=>setReviewModal({open:false,review:null})} className="rounded-xl border-gray-200">Cancel</Button><Button onClick={()=>updateReview(reviewModal.review?.id,{merchant_reply:reviewReply})} disabled={loading} className="rounded-xl bg-gray-900 hover:bg-gray-800 text-white">{loading?<Loader2 className="w-4 h-4 animate-spin mr-2"/>:<Send className="w-3.5 h-3.5 mr-2"/>}Save Reply</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const ShipmentModal = () => (
    <Dialog open={shipmentModal.open} onOpenChange={o=>!o&&setShipmentModal({open:false,order:null})}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl">
        <DialogHeader><DialogTitle className="text-gray-900 text-lg">Update Shipment</DialogTitle><DialogDescription className="text-gray-400">{shipmentModal.order?.order_number} — {shipmentModal.order?.shipping_address?.name}</DialogDescription></DialogHeader>
        <div className="space-y-4 py-2">
          <div><Label className="text-sm font-semibold text-gray-700">Carrier</Label><Select value={shipmentForm.carrier||'none'} onValueChange={v=>setShipmentForm({...shipmentForm,carrier:v==='none'?'':v})}><SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue placeholder="Select carrier"/></SelectTrigger><SelectContent className="bg-white border-gray-200 rounded-xl"><SelectItem value="none">Select carrier</SelectItem>{['UPS','USPS','FedEx','DHL','Other'].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          <div><Label className="text-sm font-semibold text-gray-700">Tracking Number</Label><Input value={shipmentForm.tracking_number} onChange={e=>setShipmentForm({...shipmentForm,tracking_number:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl h-10 text-gray-900 bg-white" placeholder="Enter tracking number"/></div>
          <div><Label className="text-sm font-semibold text-gray-700">Status</Label><Select value={shipmentForm.status} onValueChange={v=>setShipmentForm({...shipmentForm,status:v})}><SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue/></SelectTrigger><SelectContent className="bg-white border-gray-200 rounded-xl"><SelectItem value="processing">Processing</SelectItem><SelectItem value="shipped">Shipped</SelectItem><SelectItem value="delivered">Delivered</SelectItem></SelectContent></Select></div>
          <div><Label className="text-sm font-semibold text-gray-700">Notes</Label><Textarea value={shipmentForm.notes} onChange={e=>setShipmentForm({...shipmentForm,notes:e.target.value})} className="mt-1.5 border-gray-200 rounded-xl text-gray-900 bg-white" rows={2} placeholder="Internal notes…"/></div>
        </div>
        <DialogFooter className="gap-2 mt-2"><Button variant="outline" onClick={()=>setShipmentModal({open:false,order:null})} className="rounded-xl border-gray-200">Cancel</Button><Button onClick={()=>updateShipment(shipmentModal.order?.id,shipmentForm)} disabled={loading} className="rounded-xl bg-gray-900 hover:bg-gray-800 text-white">{loading&&<Loader2 className="w-4 h-4 animate-spin mr-2"/>}Update</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const CustomerModal = () => {
    const c = customerModal.customer; if (!c) return null
    return (
      <Dialog open={customerModal.open} onOpenChange={o=>!o&&setCustomerModal({open:false,customer:null})}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader><DialogTitle className="text-gray-900 text-lg">Customer Profile</DialogTitle><DialogDescription className="text-gray-400">Session #{c.session_id?.slice(0,16)}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"><div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xl shrink-0">{c.session_id?.charAt(0)?.toUpperCase()||'?'}</div><div><p className="font-bold text-gray-900">Session #{c.session_id?.slice(0,8)}</p><p className="text-sm text-gray-400">{c.interactions||0} total interactions</p><span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block ${c.risk_level==='high'?'bg-red-50 text-red-600 border border-red-200':'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>{c.risk_level||'low'} risk</span></div></div>
            <div className="grid grid-cols-2 gap-3">{[{l:'Trust Score',v:`${c.trust_score||80}/100`,c:'text-emerald-600'},{l:'Risk Level',v:(c.risk_level||'low').toUpperCase(),c:'text-gray-700'},{l:'Total Spent',v:`$${(c.total_spent||0).toFixed(2)}`,c:'text-gray-900'},{l:'Orders',v:c.total_orders||0,c:'text-gray-900'}].map(m=><div key={m.l} className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center"><p className="text-xs text-gray-400">{m.l}</p><p className={`text-xl font-bold mt-1 ${m.c}`}>{m.v}</p></div>)}</div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100"><div className="flex justify-between mb-2"><span className="text-sm font-semibold text-gray-700">Trust Score</span><span className="text-sm font-bold text-emerald-600">{c.trust_score||80}/100</span></div><div className="h-2.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${c.trust_score||80}%`}}/></div></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ─── RENDER ─────────────────────────────────────────────────

  const renderContent = () => {
    switch (activeSection) {
      case 'home': return renderHome()
      case 'orders': return renderOrders()
      case 'catalog': return renderCatalog()
      case 'customers': return renderCustomers()
      case 'reviews': return renderReviews()
      case 'campaigns': return renderCampaigns()
      case 'shipments': return renderShipments()
      case 'store-design': return renderStoreDesign()
      case 'conversations': return renderConversations()
      case 'missions': return renderMissions()
      case 'approvals': return renderApprovals()
      default: return <div className="text-gray-400 text-sm">Section not found</div>
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center"><div className="w-10 h-10 border-[3px] border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-sm text-gray-400">Loading…</p></div>
      </div>
    )
  }
  if (!isAuthenticated) return null

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const pendingReviews = reviews.filter(r => r.status === 'pending').length

  const DOCK_ITEMS = [
    { key: 'home', icon: LayoutDashboard },
    { key: 'orders', icon: ShoppingBag },
    { key: 'catalog', icon: Package },
    { key: 'conversations', icon: MessageSquare },
    { key: 'missions', icon: Target },
    { key: 'customers', icon: Users },
    { key: 'store-design', icon: Settings },
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      colorScheme: 'light',
      color: '#111827',
      '--background': '#FAF6F1',
      '--foreground': '#09090b',
      '--card': '#ffffff',
      '--card-foreground': '#09090b',
      '--popover': '#ffffff',
      '--popover-foreground': '#09090b',
      '--primary': '#09090b',
      '--primary-foreground': '#fafafa',
      '--secondary': '#f3f4f6',
      '--secondary-foreground': '#111827',
      '--muted': '#f9fafb',
      '--muted-foreground': '#6b7280',
      '--accent': '#f3f4f6',
      '--accent-foreground': '#111827',
      '--border': '#e5e7eb',
      '--input': '#e5e7eb',
      '--ring': '#9ca3af',
    }}>

      {/* ── TOP HEADER ──────────────────────────────────────── */}
      <header className="h-[58px] shrink-0 flex items-center px-5 gap-4 relative z-30" style={{ background: '#F5F3EF', borderBottom: '1px solid #E8E4DE' }}>
        {/* Logo — click goes home */}
        <button onClick={() => setActiveSection('home')} className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
            <svg width="13" height="13" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="white" />
            </svg>
          </div>
          <span className="text-sm font-extrabold tracking-tight" style={{ color: '#1C0A04' }}>Convos</span>
        </button>

        {/* Global Search */}
        <div className="flex-1 max-w-lg mx-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#B5AFA8' }} />
          <input
            value={headerSearch}
            onChange={e => { setHeaderSearch(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Search orders, products, customers…"
            className="w-full h-9 pl-10 pr-4 rounded-xl text-sm outline-none transition-all"
            style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', color: '#1C0A04' }}
            onFocus={e => { e.target.style.borderColor = '#C4B5A8'; setSearchOpen(true) }}
          />

          {/* Search results dropdown */}
          {searchOpen && headerSearch.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              {searchResults.length === 0 ? (
                <div className="px-4 py-5 text-center">
                  <p className="text-sm text-gray-400">No results for "<span className="font-medium text-gray-600">{headerSearch}</span>"</p>
                </div>
              ) : (
                <div className="py-1.5">
                  {['order', 'product', 'customer'].map(type => {
                    const group = searchResults.filter(r => r.type === type)
                    if (!group.length) return null
                    const icons = { order: ShoppingBag, product: Package, customer: Users }
                    const labels = { order: 'Orders', product: 'Products', customer: 'Customers' }
                    const Icon = icons[type]
                    return (
                      <div key={type}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-1.5">{labels[type]}</p>
                        {group.map((r, i) => (
                          <button key={i} onMouseDown={() => { setActiveSection(r.section); setHeaderSearch(''); setSearchOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{r.label}</p>
                              <p className="text-xs text-gray-400 truncate">{r.sub}</p>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Store info + actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Store name pill — click to go Store Design */}
          <button onClick={() => setActiveSection('store-design')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
            style={{ background: '#FFFFFF', border: '1px solid #E8E4DE' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#C4B5A8'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E8E4DE'}>
            <span className="text-sm font-semibold" style={{ color: '#1C0A04' }}>{storeConfig?.name || 'Your Store'}</span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </button>

          {/* Storefront — opens buyer store */}
          <a href="/store" target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', color: '#7A6F66' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4B5A8'; e.currentTarget.style.color = '#1C0A04' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E4DE'; e.currentTarget.style.color = '#7A6F66' }}>
              <ExternalLink className="w-3.5 h-3.5" /> Storefront
            </button>
          </a>

          {/* Refresh — with spin animation */}
          <button onClick={handleRefresh} title="Refresh data"
            className="h-9 w-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', color: '#B5AFA8' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4B5A8'; e.currentTarget.style.color = '#1C0A04' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E4DE'; e.currentTarget.style.color = '#B5AFA8' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Avatar — with dropdown */}
          <div className="relative">
            <button onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all"
              style={{ background: '#1C0A04', color: '#F5EBE0' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              M
            </button>

            {avatarMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAvatarMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  <div className="px-4 py-3.5 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">Merchant</p>
                    <p className="text-xs text-gray-400 mt-0.5">merchant@demo.com</p>
                  </div>
                  <div className="py-1.5">
                    <button onClick={() => { setActiveSection('store-design'); setAvatarMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Paintbrush className="w-4 h-4 text-gray-400" /> Store Settings
                    </button>
                    <button onClick={() => { setActiveSection('home'); setAvatarMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-gray-400" /> Dashboard
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/merchant/login' }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Light sidebar */}
        <aside className="w-[200px] flex flex-col shrink-0 overflow-y-auto" style={{ background: '#F5F3EF', borderRight: '1px solid #E8E4DE' }}>
          <nav className="flex-1 py-4 px-3 space-y-5">
            {NAV_SECTIONS.map(section => (
              <div key={section.label}>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] px-3 mb-1.5" style={{ color: '#B5AFA8' }}>{section.label}</p>
                <div className="space-y-0.5">
                  {section.items.map(item => {
                    const badge = item.badge === 'orders' ? pendingOrders : item.badge === 'reviews' ? pendingReviews : 0
                    const isActive = activeSection === item.key
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveSection(item.key)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all group"
                        style={isActive ? { background: '#FFFFFF', color: '#1C0A04', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#7A6F66' }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#EAE6E0' }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                      >
                        <item.icon className="w-4 h-4 shrink-0" style={{ color: isActive ? '#1C0A04' : '#9B8F86' }} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {badge > 0 && (
                          <span className="text-[9px] font-black min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 bg-gray-900 text-white">
                            {badge > 9 ? '9+' : badge}
                          </span>
                        )}
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="px-3 py-3 space-y-0.5" style={{ borderTop: '1px solid #E8E4DE' }}>
            <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/merchant/login' }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ color: '#9B8F86' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F5DDD8'; e.currentTarget.style.color = '#C0392B' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9B8F86' }}>
              <LogOut className="w-4 h-4 shrink-0" style={{ color: '#B5AFA8' }} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-24" style={{ background: '#F5F4F1' }}>
          <div className="p-7 max-w-[1400px]">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* ── FLOATING BOTTOM DOCK ─────────────────────────────── */}
      <div className="fixed bottom-5 z-50 flex items-center gap-1 px-2.5 py-2 rounded-2xl shadow-xl" style={{ left: 'calc(200px + (100% - 200px) / 2)', transform: 'translateX(-50%)', background: '#0D0D0D', border: '1px solid #2A2A2A' }}>
        {DOCK_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={activeSection === item.key
              ? { background: '#FFFFFF', color: '#0D0D0D' }
              : { color: '#555' }
            }
            onMouseEnter={e => { if (activeSection !== item.key) e.currentTarget.style.background = '#1A1A1A' }}
            onMouseLeave={e => { if (activeSection !== item.key) e.currentTarget.style.background = 'transparent' }}
            title={item.key}
          >
            <item.icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* ── MODALS ───────────────────────────────────────────── */}
      <ProductModal />
      <OrderModal />
      <CampaignModal />
      <ReviewModal />
      <ShipmentModal />
      <CustomerModal />
      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: '', id: '', name: '' })}
        onConfirm={handleDelete}
        title={`Delete ${deleteConfirm.type}?`}
        description={`This will permanently delete "${deleteConfirm.name}". This action cannot be undone.`}
        loading={loading}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
