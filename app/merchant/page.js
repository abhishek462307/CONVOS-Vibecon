'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
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
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import {
  LayoutDashboard, MessageSquare, ShoppingBag, Package, Users,
  Truck, Paintbrush, Star, Megaphone, Plus, Search, Filter,
  Edit, Trash2, Eye, Send, Check, X, Download, Calendar,
  TrendingUp, DollarSign, ShoppingCart, Activity, AlertCircle,
  MoreVertical, ExternalLink, Mail, Phone, MapPin, Clock,
  Bell, Settings, LogOut, ChevronDown, ChevronRight, RefreshCw,
  ArrowLeft, Copy, MessageCircle, Shield, BarChart3, Hash,
  Loader2, CheckCircle, XCircle, Archive, Reply, Target,
  Zap, AlertTriangle, Bot, ArrowUpRight, ArrowDownRight,
  Package2, TrendingDown, LayoutGrid, List, ChevronUp,
  Globe, Tag, ChevronLeft
} from 'lucide-react'

const BASE_URL = '/api'

const SIDEBAR_ITEMS = [
  {
    section: 'OVERVIEW', items: [
      { key: 'home', label: 'Home', icon: LayoutDashboard },
      { key: 'conversations', label: 'Intent Stream', icon: Activity },
    ]
  },
  {
    section: 'COMMERCE', items: [
      { key: 'orders', label: 'Orders', icon: ShoppingBag, badge: 'orders' },
      { key: 'catalog', label: 'Catalog', icon: Package },
      { key: 'customers', label: 'Customers', icon: Users },
      { key: 'shipments', label: 'Shipments', icon: Truck },
      { key: 'reviews', label: 'Reviews', icon: Star, badge: 'reviews' },
    ]
  },
  {
    section: 'AI INTELLIGENCE', items: [
      { key: 'missions', label: 'Missions', icon: Target },
      { key: 'approvals', label: 'Approvals', icon: Shield, badge: 'approvals' },
    ]
  },
  {
    section: 'MARKETING', items: [
      { key: 'campaigns', label: 'Campaigns', icon: Megaphone },
    ]
  },
  {
    section: 'SETTINGS', items: [
      { key: 'store-design', label: 'Store Design', icon: Paintbrush },
    ]
  }
]

const PRODUCT_CATEGORIES = ['Single Origin', 'Blends', 'Espresso', 'Decaf', 'Equipment', 'Accessories']

// ───────────────────────────────────────────────────────────
// DESIGN TOKENS (Light theme - explicit colors)
// ───────────────────────────────────────────────────────────
const STATUS_ORDER = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  processing: { label: 'Processing', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
}

const STATUS_REVIEW = {
  pending: { color: 'bg-amber-50 text-amber-700 border-amber-200' },
  published: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { color: 'bg-red-50 text-red-700 border-red-200' },
}

const STATUS_CAMPAIGN = {
  draft: { color: 'bg-gray-100 text-gray-600 border-gray-200' },
  active: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  scheduled: { color: 'bg-blue-50 text-blue-700 border-blue-200' },
  paused: { color: 'bg-amber-50 text-amber-700 border-amber-200' },
}

const TYPE_APPROVAL = {
  price_override: { label: 'Price Override', icon: Tag, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  large_order: { label: 'Large Order', icon: ShoppingBag, color: 'bg-red-50 text-red-700 border-red-200' },
  bundle_deal: { label: 'Bundle Deal', icon: Package2, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  refund: { label: 'Refund', icon: DollarSign, color: 'bg-amber-50 text-amber-700 border-amber-200' },
}

const INTENT_COLORS = {
  search: 'bg-blue-100 text-blue-700',
  add_to_cart: 'bg-emerald-100 text-emerald-700',
  negotiate: 'bg-purple-100 text-purple-700',
  checkout: 'bg-amber-100 text-amber-700',
  message: 'bg-gray-100 text-gray-700',
  mission_create: 'bg-pink-100 text-pink-700',
}

// ───────────────────────────────────────────────────────────
// UTILITY COMPONENTS
// ───────────────────────────────────────────────────────────

function StatusBadge({ status, map = STATUS_ORDER }) {
  const cfg = map[status] || { label: status, color: 'bg-gray-100 text-gray-600 border-gray-200' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
      {cfg.label || status}
    </span>
  )
}

function StatCard({ title, value, change, changeUp = true, icon: Icon, iconBg = 'bg-violet-50', iconColor = 'text-violet-600', subtitle }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${changeUp ? 'text-emerald-600' : 'text-red-500'}`}>
              {changeUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {change}
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-5 max-w-sm">{description}</p>
      {action}
    </div>
  )
}

function ConfirmDialog({ open, onClose, onConfirm, title, description, loading, confirmLabel = 'Delete', variant = 'destructive' }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{title}</DialogTitle>
          <DialogDescription className="text-gray-500">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading} className="border-gray-200 text-gray-700">Cancel</Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={loading}
            className={variant !== 'destructive' ? 'bg-violet-600 hover:bg-violet-700 text-white' : ''}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all max-w-sm ${type === 'success' ? 'bg-emerald-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : type === 'error' ? <XCircle className="w-4 h-4 shrink-0" /> : null}
      <span>{message}</span>
    </div>
  )
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  )
}

function TableCard({ children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

function Th({ children, right = false, center = false }) {
  return (
    <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${right ? 'text-right' : center ? 'text-center' : 'text-left'}`}>
      {children}
    </th>
  )
}

function Td({ children, right = false, center = false, className = '' }) {
  return (
    <td className={`px-4 py-3 ${right ? 'text-right' : center ? 'text-center' : ''} ${className}`}>
      {children}
    </td>
  )
}

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
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// Custom recharts tooltip
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.name === 'Revenue' ? `$${entry.value.toFixed(2)}` : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// ───────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ───────────────────────────────────────────────────────────
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
  const [chartRange, setChartRange] = useState('30d')
  const [catalogView, setCatalogView] = useState('table')

  // Modal states
  const [productModal, setProductModal] = useState({ open: false, mode: 'create', data: null })
  const [orderDetailModal, setOrderDetailModal] = useState({ open: false, order: null })
  const [campaignModal, setCampaignModal] = useState({ open: false, mode: 'create', data: null })
  const [reviewModal, setReviewModal] = useState({ open: false, review: null })
  const [shipmentModal, setShipmentModal] = useState({ open: false, order: null })
  const [customerModal, setCustomerModal] = useState({ open: false, customer: null })
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: '', name: '' })

  // Filter states
  const [orderFilter, setOrderFilter] = useState('all')
  const [orderSearch, setOrderSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState('all')
  const [reviewFilter, setReviewFilter] = useState('all')
  const [intentFilter, setIntentFilter] = useState('all')
  const [missionFilter, setMissionFilter] = useState('all')

  // Lifted form states
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', compare_at_price: '',
    category: 'Single Origin',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
    stock: '', bargain_enabled: true, bargain_min_price: '', tags: [], weight: ''
  })
  const [campaignForm, setCampaignForm] = useState({
    name: '', description: '', type: 'email', status: 'draft', audience_count: '',
    content: { subject: '', body: '', cta: '' }
  })
  const [reviewReplyText, setReviewReplyText] = useState('')
  const [shipmentForm, setShipmentForm] = useState({ carrier: '', tracking_number: '', status: 'processing', notes: '' })

  const showToast = (message, type = 'success') => setToast({ message, type })

  const isAnyModalOpen = productModal.open || orderDetailModal.open || campaignModal.open ||
    reviewModal.open || shipmentModal.open || customerModal.open || deleteConfirm.open

  // Revenue chart data
  const revenueChartData = useMemo(() => {
    const days = chartRange === '7d' ? 7 : chartRange === '30d' ? 30 : 90
    const data = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateStr: date.toISOString().split('T')[0],
        Revenue: 0,
        Orders: 0
      }
    })
    orders.forEach(order => {
      const d = new Date(order.created_at).toISOString().split('T')[0]
      const entry = data.find(x => x.dateStr === d)
      if (entry) { entry.Revenue += parseFloat(order.total || 0); entry.Orders += 1 }
    })
    return data
  }, [orders, chartRange])

  // Modal openers
  const openProductCreate = () => {
    setProductForm({ name: '', description: '', price: '', compare_at_price: '', category: 'Single Origin', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', stock: '', bargain_enabled: true, bargain_min_price: '', tags: [], weight: '' })
    setProductModal({ open: true, mode: 'create', data: null })
  }
  const openProductEdit = (p) => { setProductForm({ ...p }); setProductModal({ open: true, mode: 'edit', data: p }) }
  const openCampaignCreate = () => {
    setCampaignForm({ name: '', description: '', type: 'email', status: 'draft', audience_count: '', content: { subject: '', body: '', cta: '' } })
    setCampaignModal({ open: true, mode: 'create', data: null })
  }
  const openCampaignEdit = (c) => { setCampaignForm({ ...c }); setCampaignModal({ open: true, mode: 'edit', data: c }) }
  const openReviewReply = (r) => { setReviewReplyText(r.merchant_reply || ''); setReviewModal({ open: true, review: r }) }
  const openShipmentEdit = (o) => {
    setShipmentForm({ carrier: o.carrier || '', tracking_number: o.tracking_number || '', status: o.status || 'processing', notes: o.notes || '' })
    setShipmentModal({ open: true, order: o })
  }

  // Auth check
  useEffect(() => {
    try {
      const user = localStorage.getItem('user')
      if (user) {
        const u = JSON.parse(user)
        if (u.type === 'merchant') { setIsAuthenticated(true) }
        else { window.location.href = '/merchant/login' }
      } else { window.location.href = '/merchant/login' }
    } catch { window.location.href = '/merchant/login' }
    finally { setAuthLoading(false) }
  }, [])

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const [statsR, ordersR, productsR, customersR, reviewsR, campaignsR, intentsR, configR, missionsR, approvalsR] = await Promise.all([
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
      if (statsR && !statsR.error) setStats(statsR)
      if (Array.isArray(ordersR)) setOrders(ordersR)
      if (Array.isArray(productsR)) setProducts(productsR)
      if (Array.isArray(customersR)) setCustomers(customersR)
      if (Array.isArray(reviewsR)) setReviews(reviewsR)
      if (Array.isArray(campaignsR)) setCampaigns(campaignsR)
      if (Array.isArray(intentsR)) setIntents(intentsR)
      if (configR && !configR.error) setStoreConfig(configR)
      if (Array.isArray(missionsR)) setMissions(missionsR)
      if (Array.isArray(approvalsR)) setApprovals(approvalsR)
    } catch (e) { console.error('Fetch error:', e) }
  }, [isAuthenticated])

  useEffect(() => {
    fetchData()
    if (!isAnyModalOpen) {
      const interval = setInterval(fetchData, 12000)
      return () => clearInterval(interval)
    }
  }, [fetchData, isAnyModalOpen])

  // ─── CRUD ────────────────────────────────────────────────

  const saveProduct = async (data) => {
    try {
      setLoading(true)
      const isEdit = productModal.mode === 'edit'
      const res = await fetch(isEdit ? `${BASE_URL}/products/${data.id}` : `${BASE_URL}/products`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (res.ok) { showToast(isEdit ? 'Product updated' : 'Product created'); setProductModal({ open: false, mode: 'create', data: null }); fetchData() }
      else showToast(result.error || 'Failed to save product', 'error')
    } catch { showToast('Failed to save product', 'error') }
    finally { setLoading(false) }
  }

  const deleteProduct = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' })
      if (res.ok) { showToast('Product deleted'); setDeleteConfirm({ open: false, type: '', id: '', name: '' }); fetchData() }
      else showToast('Failed to delete product', 'error')
    } catch { showToast('Failed to delete', 'error') }
    finally { setLoading(false) }
  }

  const updateOrderStatus = async (id, status) => {
    const res = await fetch(`${BASE_URL}/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    if (res.ok) { showToast(`Order ${status}`); fetchData() }
  }

  const updateShipment = async (orderId, data) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/shipments/${orderId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) { showToast('Shipment updated'); setShipmentModal({ open: false, order: null }); fetchData() }
    } catch { showToast('Failed to update shipment', 'error') }
    finally { setLoading(false) }
  }

  const updateReview = async (id, data) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) { showToast('Review updated'); setReviewModal({ open: false, review: null }); fetchData() }
    } catch { showToast('Failed to update review', 'error') }
    finally { setLoading(false) }
  }

  const deleteReview = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) { showToast('Review deleted'); setDeleteConfirm({ open: false, type: '', id: '', name: '' }); fetchData() }
    } catch { showToast('Failed to delete', 'error') }
    finally { setLoading(false) }
  }

  const saveCampaign = async (data) => {
    try {
      setLoading(true)
      const isEdit = campaignModal.mode === 'edit'
      const res = await fetch(isEdit ? `${BASE_URL}/campaigns/${data.id}` : `${BASE_URL}/campaigns`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) { showToast(isEdit ? 'Campaign updated' : 'Campaign created'); setCampaignModal({ open: false, mode: 'create', data: null }); fetchData() }
    } catch { showToast('Failed to save campaign', 'error') }
    finally { setLoading(false) }
  }

  const deleteCampaign = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/campaigns/${id}`, { method: 'DELETE' })
      if (res.ok) { showToast('Campaign deleted'); setDeleteConfirm({ open: false, type: '', id: '', name: '' }); fetchData() }
    } catch { showToast('Failed to delete', 'error') }
    finally { setLoading(false) }
  }

  const updateStoreConfig = async (updates) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/store-config`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) })
      if (res.ok) { showToast('Store settings saved'); fetchData() }
    } catch { showToast('Failed to save settings', 'error') }
    finally { setLoading(false) }
  }

  const handleApproval = async (id, status) => {
    try {
      const res = await fetch(`${BASE_URL}/approvals/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      if (res.ok) {
        showToast(status === 'approved' ? '✓ Action approved' : 'Action rejected')
        fetchData()
      }
    } catch { showToast('Failed to process approval', 'error') }
  }

  const handleExport = async (type) => {
    const res = await fetch(`${BASE_URL}/export/${type}`)
    const data = await res.json()
    if (Array.isArray(data)) { downloadCSV(data, `${type}-${new Date().toISOString().split('T')[0]}.csv`); showToast('Export ready') }
  }

  const handleDelete = async () => {
    const { type, id } = deleteConfirm
    if (type === 'product') await deleteProduct(id)
    else if (type === 'review') await deleteReview(id)
    else if (type === 'campaign') await deleteCampaign(id)
  }

  // ─── SECTION RENDERERS ──────────────────────────────────

  const renderHome = () => {
    const pendingApprovals = approvals.filter(a => a.status === 'pending')
    return (
      <div>
        {/* Approval alert */}
        {pendingApprovals.length > 0 && (
          <div className="mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => setActiveSection('approvals')}>
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-medium flex-1">
              <span className="font-bold">{pendingApprovals.length} AI action{pendingApprovals.length > 1 ? 's' : ''} pending your approval</span> — Review and approve before they execute.
            </p>
            <ChevronRight className="w-4 h-4 text-amber-500" />
          </div>
        )}

        <SectionHeader
          title="Dashboard"
          subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Store: ${storeConfig?.status || 'live'}`}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchData} className="border-gray-200 text-gray-600 hover:bg-gray-50">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
              </Button>
              <a href="/store" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View Store
                </Button>
              </a>
            </div>
          }
        />

        {/* Primary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard title="Total Revenue" value={`$${(stats?.totalRevenue || 0).toFixed(2)}`} change="+12.5% vs last month" changeUp icon={DollarSign} iconBg="bg-violet-50" iconColor="text-violet-600" />
          <StatCard title="Total Orders" value={stats?.totalOrders || 0} subtitle={`${stats?.pendingOrders || 0} pending`} change="+8.2% vs last month" changeUp icon={ShoppingCart} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard title="Products" value={stats?.totalProducts || 0} subtitle="in catalog" icon={Package} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
          <StatCard title="Customers" value={stats?.totalBuyers || 0} change="+15.3% this week" changeUp icon={Users} iconBg="bg-pink-50" iconColor="text-pink-600" />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Avg Rating" value={`${stats?.avgRating || '0.0'}★`} subtitle={`${stats?.totalReviews || 0} reviews`} icon={Star} iconBg="bg-amber-50" iconColor="text-amber-600" />
          <StatCard title="AI Sessions" value={stats?.totalConversations || 0} subtitle="conversations" icon={MessageSquare} iconBg="bg-cyan-50" iconColor="text-cyan-600" />
          <StatCard title="Active Missions" value={stats?.activeMissions || 0} subtitle="buyer agents" icon={Target} iconBg="bg-purple-50" iconColor="text-purple-600" />
          <StatCard title="Avg Trust Score" value={stats?.avgTrustScore || 80} subtitle="across buyers" icon={Shield} iconBg="bg-teal-50" iconColor="text-teal-600" />
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Orders placed over time</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              {['7d', '30d', '90d'].map(r => (
                <button key={r} onClick={() => setChartRange(r)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${chartRange === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
                interval={chartRange === '7d' ? 0 : chartRange === '30d' ? 4 : 9} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Revenue" stroke="#7c3aed" strokeWidth={2} fill="url(#revenueGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent orders */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
              <button onClick={() => setActiveSection('orders')} className="text-xs text-violet-600 hover:text-violet-700 font-medium">View all →</button>
            </div>
            <div className="space-y-1">
              {orders.slice(0, 6).map(o => (
                <div key={o.id} className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setOrderDetailModal({ open: true, order: o })}>
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{o.order_number}</p>
                    <p className="text-xs text-gray-400">{o.shipping_address?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">${parseFloat(o.total || 0).toFixed(2)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No orders yet</p>}
            </div>
          </div>

          {/* Live activity */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Live Activity</h3>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 font-medium">Live</span>
                </span>
              </div>
              <button onClick={() => setActiveSection('conversations')} className="text-xs text-violet-600 hover:text-violet-700 font-medium">View all →</button>
            </div>
            <div className="space-y-1">
              {intents.slice(0, 7).map((intent, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0">
                  <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide shrink-0 ${INTENT_COLORS[intent.type] || 'bg-gray-100 text-gray-600'}`}>{intent.type}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-snug line-clamp-2">{intent.description}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(intent.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {intents.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No activity yet</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderOrders = () => {
    const filtered = orders.filter(o => {
      if (orderFilter !== 'all' && o.status !== orderFilter) return false
      if (orderSearch) {
        const s = orderSearch.toLowerCase()
        return o.order_number?.toLowerCase().includes(s) || o.shipping_address?.name?.toLowerCase().includes(s)
      }
      return true
    })
    const statusCounts = { all: orders.length, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
    orders.forEach(o => { if (statusCounts[o.status] !== undefined) statusCounts[o.status]++ })

    return (
      <div>
        <SectionHeader
          title="Orders"
          subtitle={`${orders.length} total orders`}
          action={
            <Button variant="outline" size="sm" onClick={() => handleExport('orders')} className="border-gray-200 text-gray-600">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </Button>
          }
        />

        {/* Status tabs */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setOrderFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${orderFilter === s ? 'bg-violet-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {s === 'all' ? 'All' : s} {statusCounts[s] > 0 && <span className={`ml-1 ${orderFilter === s ? 'text-violet-200' : 'text-gray-400'}`}>({statusCounts[s]})</span>}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search by order # or customer…" className="pl-9 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
          </div>
        </div>

        <TableCard>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr><Th>Order</Th><Th>Customer</Th><Th>Items</Th><Th right>Total</Th><Th>Payment</Th><Th>Status</Th><Th center>Actions</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <Td>
                    <div className="font-semibold text-gray-900 text-sm">{order.order_number}</div>
                    <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                        {order.shipping_address?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span className="text-sm text-gray-700">{order.shipping_address?.name || 'N/A'}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-sm text-gray-600">{(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}</span>
                  </Td>
                  <Td right>
                    <span className="font-bold text-gray-900">${parseFloat(order.total || 0).toFixed(2)}</span>
                  </Td>
                  <Td>
                    <StatusBadge status={order.payment_status || 'unknown'} map={{
                      paid: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                      pending: { color: 'bg-amber-50 text-amber-700 border-amber-200' },
                      failed: { color: 'bg-red-50 text-red-700 border-red-200' },
                      unknown: { color: 'bg-gray-100 text-gray-500 border-gray-200' }
                    }} />
                  </Td>
                  <Td>
                    <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-violet-500">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </Td>
                  <Td center>
                    <Button size="sm" variant="ghost" className="text-gray-500 hover:text-violet-600" onClick={() => setOrderDetailModal({ open: true, order })}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState icon={ShoppingBag} title="No orders found" description="Orders appear here when customers complete purchases." />}
        </TableCard>
      </div>
    )
  }

  const renderCatalog = () => {
    const filtered = products.filter(p => {
      const matchSearch = !productSearch || p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.category?.toLowerCase().includes(productSearch.toLowerCase())
      const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter
      return matchSearch && matchCat
    })
    const lowStock = products.filter(p => (p.stock || 0) < 20)

    return (
      <div>
        <SectionHeader
          title="Product Catalog"
          subtitle={`${products.length} products · ${lowStock.length} low stock`}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('products')} className="border-gray-200 text-gray-600">
                <Download className="w-3.5 h-3.5 mr-1.5" /> Export
              </Button>
              <Button size="sm" onClick={openProductCreate} className="bg-violet-600 hover:bg-violet-700 text-white">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Product
              </Button>
            </div>
          }
        />

        {lowStock.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-sm text-amber-700">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span><strong>{lowStock.length} product{lowStock.length > 1 ? 's' : ''}</strong> running low on stock (under 20 units)</span>
          </div>
        )}

        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search products…" className="pl-9 border-gray-200 bg-white text-gray-900" value={productSearch} onChange={e => setProductSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {['all', ...PRODUCT_CATEGORIES].map(c => (
              <button key={c} onClick={() => setProductCategoryFilter(c)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${productCategoryFilter === c ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setCatalogView('table')} className={`px-2.5 py-1.5 ${catalogView === 'table' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}><List className="w-3.5 h-3.5" /></button>
            <button onClick={() => setCatalogView('grid')} className={`px-2.5 py-1.5 ${catalogView === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {catalogView === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative aspect-square bg-gray-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {(p.stock || 0) < 20 && <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">Low Stock</div>}
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 mb-0.5">{p.category}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900">${p.price}</span>
                    <span className="text-xs text-gray-400">{p.stock || 0} left</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => openProductEdit(p)} className="flex-1 h-7 rounded-lg bg-gray-100 hover:bg-violet-50 hover:text-violet-600 text-gray-600 text-xs font-medium flex items-center justify-center gap-1 transition-colors"><Edit className="w-3 h-3" /> Edit</button>
                    <button onClick={() => setDeleteConfirm({ open: true, type: 'product', id: p.id, name: p.name })} className="h-7 w-7 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-400 flex items-center justify-center transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <TableCard>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr><Th>Product</Th><Th right>Price</Th><Th center>Stock</Th><Th>Category</Th><Th>Bargain</Th><Th center>Actions</Th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <Td>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                          <div className="text-xs text-gray-400 max-w-[200px] truncate">{p.description?.substring(0, 55)}…</div>
                        </div>
                      </div>
                    </Td>
                    <Td right>
                      <div className="font-bold text-gray-900">${p.price}</div>
                      {p.compare_at_price > p.price && <div className="text-xs text-gray-400 line-through">${p.compare_at_price}</div>}
                    </Td>
                    <Td center>
                      <span className={`text-sm font-semibold ${(p.stock || 0) < 20 ? 'text-amber-600' : 'text-gray-700'}`}>{p.stock || 0}</span>
                      {(p.stock || 0) < 20 && <div className="text-[9px] text-amber-500 font-medium">Low</div>}
                    </Td>
                    <Td>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">{p.category}</span>
                    </Td>
                    <Td>
                      {p.bargain_enabled
                        ? <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><Zap className="w-3 h-3" /> Min ${p.bargain_min_price}</span>
                        : <span className="text-xs text-gray-400">Off</span>}
                    </Td>
                    <Td center>
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => openProductEdit(p)} className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteConfirm({ open: true, type: 'product', id: p.id, name: p.name })} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <EmptyState icon={Package} title="No products found" description="Add your first product to the catalog." action={<Button size="sm" onClick={openProductCreate} className="bg-violet-600 hover:bg-violet-700 text-white"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Product</Button>} />}
          </TableCard>
        )}
      </div>
    )
  }

  const renderCustomers = () => (
    <div>
      <SectionHeader
        title="Customer Matrix"
        subtitle={`${customers.length} consumer profiles tracked`}
        action={
          <Button variant="outline" size="sm" onClick={() => handleExport('customers')} className="border-gray-200 text-gray-600">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Avg Trust Score</p>
          <p className="text-2xl font-bold text-emerald-600">{customers.length ? Math.round(customers.reduce((s, c) => s + (c.trust_score || 80), 0) / customers.length) : 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">High Risk</p>
          <p className="text-2xl font-bold text-red-500">{customers.filter(c => c.risk_level === 'high').length}</p>
        </div>
      </div>

      {customers.length === 0 ? (
        <EmptyState icon={Users} title="No customers yet" description="Customer profiles are created automatically when buyers interact with your AI store." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCustomerModal({ open: true, customer: c })}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {c.session_id?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Session #{c.session_id?.slice(0, 8)}</p>
                  <p className="text-xs text-gray-400">{c.interactions || 0} interactions</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.risk_level === 'high' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                  {c.risk_level || 'low'} risk
                </span>
              </div>

              {/* Trust score bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Trust Score</span>
                  <span className="text-xs font-bold text-emerald-600">{c.trust_score || 80}/100</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: `${c.trust_score || 80}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Spent</p>
                  <p className="font-bold text-gray-900">${(c.total_spent || 0).toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Orders</p>
                  <p className="font-bold text-gray-900">{c.total_orders || 0}</p>
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
    const pendingCount = reviews.filter(r => r.status === 'pending').length

    return (
      <div>
        <SectionHeader
          title="Reviews"
          subtitle={`${reviews.length} total · ${pendingCount} pending moderation`}
        />

        <div className="flex gap-1 mb-4">
          {['all', 'pending', 'published', 'rejected'].map(s => (
            <button key={s} onClick={() => setReviewFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all relative ${reviewFilter === s ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {s === 'all' ? 'All Reviews' : s}
              {s === 'pending' && pendingCount > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${reviewFilter === s ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Star} title="No reviews" description="Customer reviews will appear here." />
        ) : (
          <div className="space-y-3">
            {filtered.map(review => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {review.product?.image && (
                      <img src={review.product.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">{review.product?.name || 'Product'}</span>
                        <span className="text-xs text-gray-400">by {review.author_name}</span>
                        <StatusBadge status={review.status} map={STATUS_REVIEW} />
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                        ))}
                        {review.title && <span className="ml-2 text-sm font-medium text-gray-700">"{review.title}"</span>}
                      </div>
                      <p className="text-sm text-gray-600">{review.content}</p>
                      {review.merchant_reply && (
                        <div className="mt-3 pl-3 border-l-2 border-violet-300 bg-violet-50 rounded-r-lg p-2.5">
                          <p className="text-xs font-semibold text-violet-700 mb-0.5">Your Reply</p>
                          <p className="text-xs text-gray-600">{review.merchant_reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {review.status === 'pending' && (
                      <>
                        <button onClick={() => updateReview(review.id, { status: 'published' })} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Approve"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => updateReview(review.id, { status: 'rejected' })} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Reject"><X className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                    <button onClick={() => openReviewReply(review)} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors" title="Reply"><Reply className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteConfirm({ open: true, type: 'review', id: review.id, name: review.title || 'this review' })} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
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
    const shippedCount = shipments.filter(o => o.status === 'shipped').length
    const processingCount = shipments.filter(o => o.status === 'processing').length
    const deliveredCount = shipments.filter(o => o.status === 'delivered').length

    return (
      <div>
        <SectionHeader title="Shipments" subtitle={`${shipments.length} active shipments`} />

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Processing</p>
            <p className="text-2xl font-bold text-blue-600">{processingCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">In Transit</p>
            <p className="text-2xl font-bold text-purple-600">{shippedCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Delivered</p>
            <p className="text-2xl font-bold text-emerald-600">{deliveredCount}</p>
          </div>
        </div>

        {shipments.length === 0 ? (
          <EmptyState icon={Truck} title="No shipments" description="Orders in processing or shipped status appear here." />
        ) : (
          <TableCard>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr><Th>Order</Th><Th>Customer</Th><Th>Carrier</Th><Th>Tracking</Th><Th>Status</Th><Th center>Edit</Th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <Td>
                      <div className="font-semibold text-sm text-gray-900">{s.order_number}</div>
                      <div className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString()}</div>
                    </Td>
                    <Td><span className="text-sm text-gray-700">{s.shipping_address?.name || 'N/A'}</span></Td>
                    <Td>
                      {s.carrier
                        ? <span className="text-sm font-medium text-gray-900">{s.carrier}</span>
                        : <span className="text-xs text-gray-400 italic">Not assigned</span>}
                    </Td>
                    <Td>
                      {s.tracking_number
                        ? <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{s.tracking_number}</code>
                        : <span className="text-xs text-gray-400 italic">No tracking</span>}
                    </Td>
                    <Td><StatusBadge status={s.status} /></Td>
                    <Td center>
                      <button onClick={() => openShipmentEdit(s)} className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        )}
      </div>
    )
  }

  const renderCampaigns = () => (
    <div>
      <SectionHeader
        title="Campaigns"
        subtitle={`${campaigns.length} campaigns · ${campaigns.filter(c => c.status === 'active').length} active`}
        action={
          <Button size="sm" onClick={openCampaignCreate} className="bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Campaign
          </Button>
        }
      />

      {campaigns.length === 0 ? (
        <EmptyState icon={Megaphone} title="No campaigns" description="Create email, SMS, or push campaigns to reach your customers." action={<Button size="sm" onClick={openCampaignCreate} className="bg-violet-600 hover:bg-violet-700 text-white"><Plus className="w-3.5 h-3.5 mr-1.5" /> Create Campaign</Button>} />
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{c.name}</h3>
                    <StatusBadge status={c.status} map={STATUS_CAMPAIGN} />
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs font-medium uppercase">{c.type}</span>
                  </div>
                  <p className="text-sm text-gray-500">{c.description}</p>
                </div>
                <div className="flex gap-1 ml-4">
                  <button onClick={() => openCampaignEdit(c)} className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteConfirm({ open: true, type: 'campaign', id: c.id, name: c.name })} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-100">
                {[
                  { label: 'Audience', value: c.audience_count || 0 },
                  { label: 'Sent', value: c.sent_count || 0 },
                  { label: 'Open Rate', value: `${c.open_rate || 0}%` },
                  { label: 'Click Rate', value: `${c.click_rate || 0}%` },
                ].map(m => (
                  <div key={m.label}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{m.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderIntentStream = () => {
    const types = ['all', 'search', 'add_to_cart', 'negotiate', 'checkout', 'message', 'mission_create']
    const filtered = intents.filter(i => intentFilter === 'all' || i.type === intentFilter)

    return (
      <div>
        <SectionHeader
          title="Live Intent Stream"
          subtitle="Real-time buyer activity and AI interactions"
          action={
            <Button variant="outline" size="sm" onClick={fetchData} className="border-gray-200 text-gray-600">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
          }
        />

        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
          </span>
          <div className="flex gap-1 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setIntentFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${intentFilter === t ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {t === 'all' ? 'All' : t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" description="Customer interactions will stream here in real-time." />
        ) : (
          <div className="space-y-2">
            {filtered.map((intent, i) => {
              const IconMap = { search: Search, add_to_cart: ShoppingCart, negotiate: DollarSign, checkout: CheckCircle, mission_create: Target, message: MessageSquare }
              const Icon = IconMap[intent.type] || Activity
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${INTENT_COLORS[intent.type] || 'bg-gray-100 text-gray-600'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{intent.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{new Date(intent.timestamp).toLocaleString()}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400 font-mono">Session: {intent.session_id?.slice(0, 8)}…</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 ${INTENT_COLORS[intent.type] || 'bg-gray-100 text-gray-600'}`}>
                    {intent.type}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderMissions = () => {
    const filtered = missions.filter(m => missionFilter === 'all' || m.status === missionFilter)
    const activeMissions = missions.filter(m => m.status === 'active')
    const completedMissions = missions.filter(m => m.status === 'completed')

    return (
      <div>
        <SectionHeader
          title="Active Missions"
          subtitle="Buyer AI agents working on shopping goals"
          action={
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeMissions.length} running
            </span>
          }
        />

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Active</p>
            <p className="text-2xl font-bold text-violet-600">{activeMissions.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">{completedMissions.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{missions.length}</p>
          </div>
        </div>

        <div className="flex gap-1 mb-4">
          {['all', 'active', 'completed', 'failed'].map(s => (
            <button key={s} onClick={() => setMissionFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${missionFilter === s ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {s === 'all' ? 'All Missions' : s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Target} title="No missions" description="Buyer AI missions appear here when customers set shopping goals." />
        ) : (
          <div className="space-y-3">
            {filtered.map(m => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.status === 'active' ? 'bg-violet-50' : m.status === 'completed' ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                    <Bot className={`w-5 h-5 ${m.status === 'active' ? 'text-violet-600' : m.status === 'completed' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{m.goal}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${m.status === 'active' ? 'bg-violet-50 text-violet-700 border border-violet-200' : m.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                        {m.status}
                      </span>
                      {m.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="font-mono">Session: {m.session_id?.slice(0, 12)}…</span>
                      {m.budget_max && <span>· Budget: ${m.budget_max}</span>}
                      <span>· {new Date(m.created_at).toLocaleString()}</span>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-semibold text-gray-700">{m.progress || 0}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${m.status === 'active' ? 'bg-violet-500' : m.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-300'}`} style={{ width: `${m.progress || 0}%` }} />
                      </div>
                    </div>

                    {/* Steps */}
                    {m.steps && m.steps.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {m.steps.slice(-3).map((step, si) => (
                          <div key={si} className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>{step.description}</span>
                            <span className="text-gray-300">· {new Date(step.timestamp).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderApprovals = () => {
    const pending = approvals.filter(a => a.status === 'pending')
    const resolved = approvals.filter(a => a.status !== 'pending')

    return (
      <div>
        <SectionHeader
          title="AI Approval Queue"
          subtitle="Review and approve sensitive AI agent actions before they execute"
          action={
            pending.length > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5" />
                {pending.length} awaiting review
              </span>
            )
          }
        />

        {pending.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-semibold text-gray-900">Pending Actions ({pending.length})</p>
            </div>
            <div className="space-y-3 mb-6">
              {pending.map(a => {
                const typeCfg = TYPE_APPROVAL[a.type] || { label: a.type, color: 'bg-gray-100 text-gray-600 border-gray-200' }
                const TypeIcon = typeCfg.icon || Shield
                return (
                  <div key={a.id} className="bg-white rounded-xl border-2 border-amber-200 shadow-sm p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                        <TypeIcon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${typeCfg.color}`}>{typeCfg.label}</span>
                          <span className="text-xs text-gray-400 font-mono">Session: {a.session_id?.slice(0, 12)}…</span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{a.description}</p>
                        {(a.original_price || a.requested_price) && (
                          <div className="flex items-center gap-3 mb-3 text-sm">
                            {a.original_price && <div className="bg-gray-50 rounded-lg px-3 py-2"><span className="text-xs text-gray-400 block">Original</span><span className="font-bold text-gray-700">${a.original_price}</span></div>}
                            {a.requested_price && <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-200"><span className="text-xs text-amber-600 block">Requested</span><span className="font-bold text-amber-700">${a.requested_price}</span></div>}
                            {a.original_price && a.requested_price && (
                              <div className="bg-gray-50 rounded-lg px-3 py-2">
                                <span className="text-xs text-gray-400 block">Discount</span>
                                <span className="font-bold text-red-500">-{(((a.original_price - a.requested_price) / a.original_price) * 100).toFixed(1)}%</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => handleApproval(a.id, 'approved')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors">
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => handleApproval(a.id, 'rejected')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 text-sm font-semibold transition-colors">
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {pending.length === 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-emerald-800">All caught up!</p>
            <p className="text-sm text-emerald-600 mt-1">No pending AI actions require your approval.</p>
          </div>
        )}

        {resolved.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-500">Resolved Actions ({resolved.length})</p>
            </div>
            <div className="space-y-2">
              {resolved.map(a => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 opacity-70">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${a.status === 'approved' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    {a.status === 'approved' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 truncate">{a.description}</p>
                    <p className="text-[10px] text-gray-400">{a.status === 'approved' ? 'Approved' : 'Rejected'} · {new Date(a.resolved_at || a.updated_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderStoreDesign = () => (
    <div>
      <SectionHeader
        title="Store Design"
        subtitle="Customize your store appearance and AI assistant"
        action={
          <div className="flex gap-2">
            <a href="/store" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-600">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Preview Store
              </Button>
            </a>
            <Button size="sm" onClick={() => updateStoreConfig(storeConfig)} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Check className="w-3.5 h-3.5 mr-1.5" />}
              Save Changes
            </Button>
          </div>
        }
      />

      {storeConfig ? (
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-gray-100 border border-gray-200">
            <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600">General</TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600">AI Assistant</TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
              {[
                { label: 'Store Name', key: 'name', placeholder: 'e.g. Artisan Coffee Roasters' },
                { label: 'Tagline', key: 'tagline', placeholder: 'e.g. Best coffee in town' },
                { label: 'Banner Text', key: 'banner', placeholder: 'e.g. FREE SHIPPING OVER $50' },
              ].map(f => (
                <div key={f.key}>
                  <Label className="text-gray-700 font-medium">{f.label}</Label>
                  <Input value={storeConfig[f.key] || ''} onChange={e => setStoreConfig({ ...storeConfig, [f.key]: e.target.value })} className="mt-1.5 border-gray-200 bg-white text-gray-900" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <Label className="text-gray-700 font-medium">Description</Label>
                <Textarea value={storeConfig.description || ''} onChange={e => setStoreConfig({ ...storeConfig, description: e.target.value })} className="mt-1.5 border-gray-200 bg-white text-gray-900" rows={3} placeholder="Describe your store..." />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Store Status</Label>
                <Select value={storeConfig.status || 'live'} onValueChange={v => setStoreConfig({ ...storeConfig, status: v })}>
                  <SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="live">🟢 Live</SelectItem>
                    <SelectItem value="maintenance">🟡 Maintenance Mode</SelectItem>
                    <SelectItem value="closed">🔴 Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2 p-3 bg-violet-50 rounded-xl border border-violet-200">
                <Bot className="w-5 h-5 text-violet-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-violet-800">AI Assistant Configuration</p>
                  <p className="text-xs text-violet-600">These settings control how your AI shopping assistant behaves</p>
                </div>
              </div>
              <div>
                <Label className="text-gray-700 font-medium">AI Assistant Name</Label>
                <Input value={storeConfig.ai_name || ''} onChange={e => setStoreConfig({ ...storeConfig, ai_name: e.target.value })} className="mt-1.5 border-gray-200 bg-white text-gray-900" placeholder="e.g. Aria, Mark, Sage" />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Welcome / Greeting Message</Label>
                <Textarea value={storeConfig.ai_greeting || ''} onChange={e => setStoreConfig({ ...storeConfig, ai_greeting: e.target.value })} className="mt-1.5 border-gray-200 bg-white text-gray-900" rows={3} placeholder="Hey! What are you shopping for today?" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
              <div>
                <Label className="text-gray-700 font-medium">Hero Image URL</Label>
                <Input value={storeConfig.hero_image || ''} onChange={e => setStoreConfig({ ...storeConfig, hero_image: e.target.value })} className="mt-1.5 border-gray-200 bg-white text-gray-900" placeholder="https://..." />
                {storeConfig.hero_image && (
                  <img src={storeConfig.hero_image} alt="Hero preview" className="mt-2 w-full h-32 object-cover rounded-xl border border-gray-200" onError={e => e.target.style.display = 'none'} />
                )}
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Logo URL</Label>
                <Input value={storeConfig.logo_url || ''} onChange={e => setStoreConfig({ ...storeConfig, logo_url: e.target.value })} className="mt-1.5 border-gray-200 bg-white text-gray-900" placeholder="https://..." />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-300 mx-auto" />
        </div>
      )}
    </div>
  )

  // ─── MODALS ──────────────────────────────────────────────

  const ProductModal = () => (
    <Dialog open={productModal.open} onOpenChange={open => !open && setProductModal({ open: false, mode: 'create', data: null })}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{productModal.mode === 'edit' ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription className="text-gray-500">Fill in the product details below</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Image preview */}
          {productForm.image && (
            <div className="relative h-36 bg-gray-100 rounded-xl overflow-hidden">
              <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/40 px-2 py-0.5 rounded">Image Preview</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-gray-700">Product Name *</Label>
              <Input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="mt-1 border-gray-200" placeholder="e.g. Ethiopian Yirgacheffe" />
            </div>
            <div className="col-span-2">
              <Label className="text-gray-700">Description</Label>
              <Textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="mt-1 border-gray-200" rows={2} />
            </div>
            <div>
              <Label className="text-gray-700">Price *</Label>
              <Input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="mt-1 border-gray-200" placeholder="0.00" />
            </div>
            <div>
              <Label className="text-gray-700">Compare at Price</Label>
              <Input type="number" step="0.01" value={productForm.compare_at_price} onChange={e => setProductForm({ ...productForm, compare_at_price: e.target.value })} className="mt-1 border-gray-200" placeholder="0.00" />
            </div>
            <div>
              <Label className="text-gray-700">Category</Label>
              <Select value={productForm.category || 'Single Origin'} onValueChange={v => setProductForm({ ...productForm, category: v })}>
                <SelectTrigger className="mt-1 border-gray-200 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700">Stock</Label>
              <Input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="mt-1 border-gray-200" placeholder="0" />
            </div>
            <div className="col-span-2">
              <Label className="text-gray-700">Image URL</Label>
              <Input value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} className="mt-1 border-gray-200" placeholder="https://..." />
            </div>
            <div>
              <Label className="text-gray-700">Weight</Label>
              <Input value={productForm.weight} onChange={e => setProductForm({ ...productForm, weight: e.target.value })} className="mt-1 border-gray-200" placeholder="e.g. 340g" />
            </div>
            <div>
              <Label className="text-gray-700">Min Bargain Price</Label>
              <Input type="number" step="0.01" value={productForm.bargain_min_price} onChange={e => setProductForm({ ...productForm, bargain_min_price: e.target.value })} className="mt-1 border-gray-200" placeholder="0.00" />
            </div>
            <div className="col-span-2 flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
              <Switch checked={productForm.bargain_enabled ?? true} onCheckedChange={v => setProductForm({ ...productForm, bargain_enabled: v })} />
              <div>
                <Label className="text-gray-700 font-medium">Enable AI Price Negotiation</Label>
                <p className="text-xs text-gray-400">Allow AI to negotiate price with buyers</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setProductModal({ open: false, mode: 'create', data: null })} className="border-gray-200 text-gray-700">Cancel</Button>
          <Button onClick={() => saveProduct(productForm)} disabled={loading || !productForm.name || !productForm.price} className="bg-violet-600 hover:bg-violet-700 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {productModal.mode === 'edit' ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const OrderDetailModal = () => {
    const o = orderDetailModal.order
    if (!o) return null
    return (
      <Dialog open={orderDetailModal.open} onOpenChange={open => !open && setOrderDetailModal({ open: false, order: null })}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Order {o.order_number}</DialogTitle>
            <DialogDescription className="text-gray-500">{new Date(o.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Order Status</p>
                <StatusBadge status={o.status} />
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Payment</p>
                <StatusBadge status={o.payment_status || 'unknown'} map={{ paid: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }, pending: { color: 'bg-amber-50 text-amber-700 border-amber-200' }, failed: { color: 'bg-red-50 text-red-700 border-red-200' }, unknown: { color: 'bg-gray-100 text-gray-500 border-gray-200' } }} />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Items Ordered</h4>
              <div className="space-y-2">
                {(o.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${(o.subtotal || 0).toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>${(o.shipping || 0).toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>${(o.tax || 0).toFixed(2)}</span></div>
              <Separator className="my-2 bg-gray-200" />
              <div className="flex justify-between font-bold text-base text-gray-900"><span>Total</span><span>${parseFloat(o.total || 0).toFixed(2)}</span></div>
            </div>

            {o.shipping_address && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> Shipping Address</h4>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p className="font-medium text-gray-800">{o.shipping_address.name}</p>
                  <p>{o.shipping_address.street}</p>
                  <p>{o.shipping_address.city}, {o.shipping_address.state} {o.shipping_address.zip}</p>
                  <p>{o.shipping_address.country}</p>
                </div>
              </div>
            )}

            {(o.tracking_number || o.carrier) && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Tracking Info</h4>
                {o.carrier && <p className="text-sm text-blue-700">Carrier: <strong>{o.carrier}</strong></p>}
                {o.tracking_number && <p className="text-sm text-blue-700 mt-0.5">Tracking: <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">{o.tracking_number}</code></p>}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const CampaignModal = () => (
    <Dialog open={campaignModal.open} onOpenChange={open => !open && setCampaignModal({ open: false, mode: 'create', data: null })}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{campaignModal.mode === 'edit' ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
          <DialogDescription className="text-gray-500">{campaignModal.mode === 'edit' ? 'Update campaign details' : 'Set up a new marketing campaign'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-gray-700">Campaign Name *</Label>
            <Input value={campaignForm.name} onChange={e => setCampaignForm({ ...campaignForm, name: e.target.value })} className="mt-1 border-gray-200" placeholder="e.g. Summer Sale" />
          </div>
          <div>
            <Label className="text-gray-700">Description</Label>
            <Textarea value={campaignForm.description} onChange={e => setCampaignForm({ ...campaignForm, description: e.target.value })} className="mt-1 border-gray-200" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700">Type</Label>
              <Select value={campaignForm.type} onValueChange={v => setCampaignForm({ ...campaignForm, type: v })}>
                <SelectTrigger className="mt-1 border-gray-200 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700">Status</Label>
              <Select value={campaignForm.status} onValueChange={v => setCampaignForm({ ...campaignForm, status: v })}>
                <SelectTrigger className="mt-1 border-gray-200 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-gray-700">Audience Count</Label>
            <Input type="number" value={campaignForm.audience_count} onChange={e => setCampaignForm({ ...campaignForm, audience_count: e.target.value })} className="mt-1 border-gray-200" placeholder="0" />
          </div>
          <Separator className="bg-gray-200" />
          <h4 className="font-semibold text-gray-900 text-sm">Campaign Content</h4>
          <div>
            <Label className="text-gray-700">Subject Line</Label>
            <Input value={campaignForm.content?.subject || ''} onChange={e => setCampaignForm({ ...campaignForm, content: { ...(campaignForm.content || {}), subject: e.target.value } })} className="mt-1 border-gray-200" placeholder="Email subject…" />
          </div>
          <div>
            <Label className="text-gray-700">Body</Label>
            <Textarea value={campaignForm.content?.body || ''} onChange={e => setCampaignForm({ ...campaignForm, content: { ...(campaignForm.content || {}), body: e.target.value } })} className="mt-1 border-gray-200" rows={3} placeholder="Campaign content…" />
          </div>
          <div>
            <Label className="text-gray-700">CTA Button Text</Label>
            <Input value={campaignForm.content?.cta || ''} onChange={e => setCampaignForm({ ...campaignForm, content: { ...(campaignForm.content || {}), cta: e.target.value } })} className="mt-1 border-gray-200" placeholder="e.g. Shop Now" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setCampaignModal({ open: false, mode: 'create', data: null })} className="border-gray-200 text-gray-700">Cancel</Button>
          <Button onClick={() => saveCampaign(campaignForm)} disabled={loading || !campaignForm.name} className="bg-violet-600 hover:bg-violet-700 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {campaignModal.mode === 'edit' ? 'Update' : 'Create Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const ReviewReplyModal = () => (
    <Dialog open={reviewModal.open} onOpenChange={open => !open && setReviewModal({ open: false, review: null })}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Reply to Review</DialogTitle>
          <DialogDescription className="text-gray-500">Respond to {reviewModal.review?.author_name}'s review</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= (reviewModal.review?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
            </div>
            <p className="text-sm text-gray-700">{reviewModal.review?.content}</p>
          </div>
          <div>
            <Label className="text-gray-700">Your Reply</Label>
            <Textarea value={reviewReplyText} onChange={e => setReviewReplyText(e.target.value)} className="mt-1 border-gray-200" rows={3} placeholder="Thank you for your feedback…" />
          </div>
          <div>
            <Label className="text-xs text-gray-500 uppercase tracking-wide">Review Status</Label>
            <div className="flex gap-2 mt-1">
              <button onClick={() => updateReview(reviewModal.review?.id, { status: 'published', merchant_reply: reviewReplyText })} className={`flex-1 h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${reviewModal.review?.status === 'published' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'}`}>
                <Check className="w-3 h-3" /> Publish
              </button>
              <button onClick={() => updateReview(reviewModal.review?.id, { status: 'rejected', merchant_reply: reviewReplyText })} className={`flex-1 h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${reviewModal.review?.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'}`}>
                <X className="w-3 h-3" /> Reject
              </button>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setReviewModal({ open: false, review: null })} className="border-gray-200 text-gray-700">Cancel</Button>
          <Button onClick={() => updateReview(reviewModal.review?.id, { merchant_reply: reviewReplyText })} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-3.5 h-3.5 mr-2" />}
            Save Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const ShipmentEditModal = () => (
    <Dialog open={shipmentModal.open} onOpenChange={open => !open && setShipmentModal({ open: false, order: null })}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Update Shipment</DialogTitle>
          <DialogDescription className="text-gray-500">{shipmentModal.order?.order_number} — {shipmentModal.order?.shipping_address?.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-gray-700">Carrier</Label>
            <Select value={shipmentForm.carrier || 'none'} onValueChange={v => setShipmentForm({ ...shipmentForm, carrier: v === 'none' ? '' : v })}>
              <SelectTrigger className="mt-1 border-gray-200 bg-white text-gray-900"><SelectValue placeholder="Select carrier" /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="none">Select carrier</SelectItem>
                {['UPS', 'USPS', 'FedEx', 'DHL', 'Other'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-700">Tracking Number</Label>
            <Input value={shipmentForm.tracking_number} onChange={e => setShipmentForm({ ...shipmentForm, tracking_number: e.target.value })} className="mt-1 border-gray-200" placeholder="Enter tracking number" />
          </div>
          <div>
            <Label className="text-gray-700">Status</Label>
            <Select value={shipmentForm.status} onValueChange={v => setShipmentForm({ ...shipmentForm, status: v })}>
              <SelectTrigger className="mt-1 border-gray-200 bg-white text-gray-900"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-700">Notes</Label>
            <Textarea value={shipmentForm.notes} onChange={e => setShipmentForm({ ...shipmentForm, notes: e.target.value })} className="mt-1 border-gray-200" rows={2} placeholder="Internal notes…" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setShipmentModal({ open: false, order: null })} className="border-gray-200 text-gray-700">Cancel</Button>
          <Button onClick={() => updateShipment(shipmentModal.order?.id, shipmentForm)} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Update Shipment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const CustomerDetailModal = () => {
    const c = customerModal.customer
    if (!c) return null
    return (
      <Dialog open={customerModal.open} onOpenChange={open => !open && setCustomerModal({ open: false, customer: null })}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Customer Profile</DialogTitle>
            <DialogDescription className="text-gray-500">Session #{c.session_id?.slice(0, 16)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                {c.session_id?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-bold text-gray-900">Session #{c.session_id?.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">{c.interactions || 0} total interactions</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${c.risk_level === 'high' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{c.risk_level || 'low'} risk</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Trust Score', value: c.trust_score || 80, color: 'text-emerald-600' },
                { label: 'Risk Level', value: (c.risk_level || 'low').toUpperCase(), color: 'text-gray-900' },
                { label: 'Total Spent', value: `$${(c.total_spent || 0).toFixed(2)}`, color: 'text-gray-900' },
                { label: 'Total Orders', value: c.total_orders || 0, color: 'text-gray-900' },
              ].map(m => (
                <div key={m.label} className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
                  <p className="text-xs text-gray-500">{m.label}</p>
                  <p className={`text-xl font-bold mt-0.5 ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">First Seen</span><span className="font-medium text-gray-900">{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}</span></div>
              <div className="flex justify-between py-1.5"><span className="text-gray-500">Last Active</span><span className="font-medium text-gray-900">{c.updated_at ? new Date(c.updated_at).toLocaleDateString() : 'N/A'}</span></div>
            </div>

            {/* Trust bar */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Trust Score</span>
                <span className="text-sm font-bold text-emerald-600">{c.trust_score || 80}/100</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: `${c.trust_score || 80}%` }} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ─── MAIN RENDER ────────────────────────────────────────

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
      case 'conversations': return renderIntentStream()
      case 'missions': return renderMissions()
      case 'approvals': return renderApprovals()
      default: return <div className="text-gray-500">Section not found</div>
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const pendingApprovals = approvals.filter(a => a.status === 'pending').length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const pendingReviews = reviews.filter(r => r.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>

      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside className="w-[220px] bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">Convos</p>
              <p className="text-[9px] text-gray-400 leading-none mt-0.5 uppercase tracking-wide">Merchant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {SIDEBAR_ITEMS.map(section => (
            <div key={section.section}>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.12em] px-3 mb-1">{section.section}</p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const badgeCount = item.badge === 'orders' ? pendingOrders : item.badge === 'reviews' ? pendingReviews : item.badge === 'approvals' ? pendingApprovals : 0
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeSection === item.key
                        ? 'bg-violet-50 text-violet-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                      <item.icon className={`w-3.5 h-3.5 shrink-0 ${activeSection === item.key ? 'text-violet-600' : 'text-gray-400'}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {badgeCount > 0 && (
                        <span className={`text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${activeSection === item.key ? 'bg-violet-600 text-white' : item.badge === 'approvals' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
                          {badgeCount > 9 ? '9+' : badgeCount}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-2 py-3 border-t border-gray-100 space-y-1">
          <a href="/store" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span>View Store</span>
            <ExternalLink className="w-3 h-3 ml-auto text-gray-300" />
          </a>
          <button
            onClick={() => { localStorage.removeItem('user'); window.location.href = '/merchant/login' }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-3.5 h-3.5 text-gray-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl">
          {renderContent()}
        </div>
      </main>

      {/* ── MODALS ───────────────────────────────────── */}
      <ProductModal />
      <OrderDetailModal />
      <CampaignModal />
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

      {/* ── TOAST ────────────────────────────────────── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
