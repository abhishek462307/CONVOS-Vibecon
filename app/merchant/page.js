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
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LineChart, Line
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
  Globe, Tag, ChevronLeft, Sparkles, SlidersHorizontal,
  CircleDot, Flame, Award, Coffee, Boxes
} from 'lucide-react'

const BASE_URL = '/api'

const SIDEBAR_ITEMS = [
  {
    section: 'Overview',
    items: [
      { key: 'home', label: 'Dashboard', icon: LayoutDashboard },
      { key: 'conversations', label: 'Intent Stream', icon: Activity },
    ]
  },
  {
    section: 'Commerce',
    items: [
      { key: 'orders', label: 'Orders', icon: ShoppingBag, badge: 'orders' },
      { key: 'catalog', label: 'Products', icon: Package },
      { key: 'customers', label: 'Customers', icon: Users },
      { key: 'shipments', label: 'Shipments', icon: Truck },
      { key: 'reviews', label: 'Reviews', icon: Star, badge: 'reviews' },
    ]
  },
  {
    section: 'AI Intelligence',
    items: [
      { key: 'missions', label: 'Missions', icon: Target },
      { key: 'approvals', label: 'Approvals', icon: Shield, badge: 'approvals' },
    ]
  },
  {
    section: 'Growth',
    items: [
      { key: 'campaigns', label: 'Campaigns', icon: Megaphone },
    ]
  },
  {
    section: 'Store',
    items: [
      { key: 'store-design', label: 'Store Design', icon: Paintbrush },
    ]
  }
]

const PRODUCT_CATEGORIES = ['Single Origin', 'Blends', 'Espresso', 'Decaf', 'Equipment', 'Accessories']

const STATUS_ORDER = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  processing: { label: 'Processing', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
}

const STATUS_REVIEW = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  published: { label: 'Published', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
}

const STATUS_CAMPAIGN = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  active: { label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  scheduled: { label: 'Scheduled', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  paused: { label: 'Paused', color: 'bg-amber-50 text-amber-700 border-amber-200' },
}

const TYPE_APPROVAL = {
  price_override: { label: 'Price Override', icon: Tag, color: 'bg-purple-50 text-purple-700 border-purple-200', iconColor: 'text-purple-600', bg: 'bg-purple-50' },
  large_order: { label: 'Large Order', icon: ShoppingBag, color: 'bg-red-50 text-red-700 border-red-200', iconColor: 'text-red-600', bg: 'bg-red-50' },
  bundle_deal: { label: 'Bundle Deal', icon: Package2, color: 'bg-blue-50 text-blue-700 border-blue-200', iconColor: 'text-blue-600', bg: 'bg-blue-50' },
  refund: { label: 'Refund', icon: DollarSign, color: 'bg-amber-50 text-amber-700 border-amber-200', iconColor: 'text-amber-600', bg: 'bg-amber-50' },
}

const INTENT_CONFIG = {
  search: { color: 'bg-blue-100 text-blue-700', icon: Search },
  add_to_cart: { color: 'bg-emerald-100 text-emerald-700', icon: ShoppingCart },
  negotiate: { color: 'bg-purple-100 text-purple-700', icon: DollarSign },
  checkout: { color: 'bg-amber-100 text-amber-700', icon: CheckCircle },
  message: { color: 'bg-gray-100 text-gray-600', icon: MessageSquare },
  mission_create: { color: 'bg-pink-100 text-pink-700', icon: Target },
}

// ─── UTILITY COMPONENTS ────────────────────────────────────────

function StatusBadge({ status, map = STATUS_ORDER }) {
  const cfg = map[status] || { label: status, color: 'bg-gray-100 text-gray-600 border-gray-200' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
      {cfg.dot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
      {cfg.label || status}
    </span>
  )
}

function StatCard({ title, value, change, changeUp = true, icon: Icon, iconBg = 'bg-violet-50', iconColor = 'text-violet-600', subtitle, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-100 rounded-full w-24 animate-pulse" />
            <div className="h-8 bg-gray-100 rounded-full w-16 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded-full w-20 animate-pulse" />
          </div>
          <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse" />
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900 tabular-nums leading-none">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>}
          {change && (
            <div className={`flex items-center gap-1 mt-2.5 text-xs font-semibold ${changeUp ? 'text-emerald-600' : 'text-red-500'}`}>
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${changeUp ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {changeUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
              </span>
              {change}
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, title, description, action, small = false }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${small ? 'py-10' : 'py-20'}`}>
      <div className={`${small ? 'w-12 h-12' : 'w-16 h-16'} rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4`}>
        <Icon className={`${small ? 'w-5 h-5' : 'w-7 h-7'} text-gray-300`} />
      </div>
      <h3 className={`font-semibold text-gray-700 mb-1 ${small ? 'text-sm' : 'text-base'}`}>{title}</h3>
      <p className={`text-gray-400 mb-5 max-w-xs ${small ? 'text-xs' : 'text-sm'}`}>{description}</p>
      {action}
    </div>
  )
}

function ConfirmDialog({ open, onClose, onConfirm, title, description, loading, confirmLabel = 'Delete', variant = 'destructive' }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-lg">{title}</DialogTitle>
          <DialogDescription className="text-gray-500">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={loading} className="border-gray-200 text-gray-700 rounded-xl">Cancel</Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl ${variant !== 'destructive' ? 'bg-violet-600 hover:bg-violet-700 text-white' : ''}`}
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
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium transition-all max-w-sm border ${type === 'success' ? 'bg-white text-emerald-700 border-emerald-200 shadow-emerald-100' : type === 'error' ? 'bg-white text-red-600 border-red-200 shadow-red-100' : 'bg-white text-gray-800 border-gray-200'}`}>
      {type === 'success'
        ? <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /></div>
        : type === 'error'
          ? <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0"><XCircle className="w-3.5 h-3.5 text-red-600" /></div>
          : null}
      <span>{message}</span>
    </div>
  )
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  )
}

function TableCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

function Th({ children, right = false, center = false }) {
  return (
    <th className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 bg-gray-50/70 ${right ? 'text-right' : center ? 'text-center' : 'text-left'} first:rounded-tl-2xl last:rounded-tr-2xl`}>
      {children}
    </th>
  )
}

function Td({ children, right = false, center = false, className = '' }) {
  return (
    <td className={`px-5 py-4 ${right ? 'text-right' : center ? 'text-center' : ''} ${className}`}>
      {children}
    </td>
  )
}

function Avatar({ name = '?', size = 'sm', color = 'violet' }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'md' ? 'w-10 h-10 text-sm' : 'w-14 h-14 text-lg'
  const colors = {
    violet: 'from-violet-400 to-purple-600',
    blue: 'from-blue-400 to-indigo-600',
    emerald: 'from-emerald-400 to-teal-600',
    pink: 'from-pink-400 to-rose-600',
  }
  const initial = typeof name === 'string' ? name.charAt(0).toUpperCase() : '?'
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${colors[color] || colors.violet} flex items-center justify-center text-white font-bold shrink-0`}>
      {initial}
    </div>
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

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-xl text-xs">
        <p className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wide">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <p style={{ color: entry.color }} className="font-semibold">
              {entry.name}: {entry.name === 'Revenue' ? `$${Number(entry.value).toFixed(0)}` : entry.value}
            </p>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function FilterPills({ options, value, onChange, colorActive = 'bg-violet-600 text-white shadow-sm' }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${value === opt.value
            ? colorActive
            : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'}`}
        >
          {opt.label}
          {opt.count > 0 && <span className={`ml-1.5 text-[10px] ${value === opt.value ? 'opacity-70' : 'text-gray-400'}`}>({opt.count})</span>}
        </button>
      ))}
    </div>
  )
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────
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
  const [catalogView, setCatalogView] = useState('grid')
  const [dataLoading, setDataLoading] = useState(true)
  const [headerSearch, setHeaderSearch] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  const [productModal, setProductModal] = useState({ open: false, mode: 'create', data: null })
  const [orderDetailModal, setOrderDetailModal] = useState({ open: false, order: null })
  const [campaignModal, setCampaignModal] = useState({ open: false, mode: 'create', data: null })
  const [reviewModal, setReviewModal] = useState({ open: false, review: null })
  const [shipmentModal, setShipmentModal] = useState({ open: false, order: null })
  const [customerModal, setCustomerModal] = useState({ open: false, customer: null })
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: '', name: '' })

  const [orderFilter, setOrderFilter] = useState('all')
  const [orderSearch, setOrderSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState('all')
  const [reviewFilter, setReviewFilter] = useState('all')
  const [intentFilter, setIntentFilter] = useState('all')
  const [missionFilter, setMissionFilter] = useState('all')

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

  // Top products by category count
  const topProductStats = useMemo(() => {
    const catCounts = {}
    products.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1 })
    return Object.entries(catCounts).map(([cat, count]) => ({ name: cat, value: count })).sort((a, b) => b.value - a.value).slice(0, 5)
  }, [products])

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
    finally { setDataLoading(false) }
  }, [isAuthenticated])

  useEffect(() => {
    fetchData()
    if (!isAnyModalOpen) {
      const interval = setInterval(fetchData, 12000)
      return () => clearInterval(interval)
    }
  }, [fetchData, isAnyModalOpen])

  // ─── CRUD ──────────────────────────────────────────────────

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
      if (res.ok) { showToast(isEdit ? 'Product updated successfully' : 'Product created successfully'); setProductModal({ open: false, mode: 'create', data: null }); fetchData() }
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
    if (res.ok) { showToast(`Order status updated to ${status}`); fetchData() }
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
        showToast(status === 'approved' ? 'Action approved' : 'Action rejected', status === 'approved' ? 'success' : 'error')
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

  // ─── SECTION RENDERERS ─────────────────────────────────────

  const renderHome = () => {
    const pendingApprovals = approvals.filter(a => a.status === 'pending')
    const todayRevenue = orders
      .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
      .reduce((s, o) => s + parseFloat(o.total || 0), 0)
    const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length

    return (
      <div>
        {/* Pending approval alert banner */}
        {pendingApprovals.length > 0 && (
          <div
            className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 cursor-pointer hover:bg-amber-100 transition-colors"
            onClick={() => setActiveSection('approvals')}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900">
                {pendingApprovals.length} AI action{pendingApprovals.length > 1 ? 's' : ''} awaiting approval
              </p>
              <p className="text-xs text-amber-600 mt-0.5">Review and approve before they execute</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">Review now</span>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        )}

        <SectionHeader
          title="Dashboard"
          subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · ${storeConfig?.name || 'Your Store'}`}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchData} className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl h-9">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
              </Button>
              <a href="/store" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-9 shadow-sm shadow-violet-200">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View Store
                </Button>
              </a>
            </div>
          }
        />

        {/* Today's quick stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-4 text-white">
            <p className="text-violet-200 text-xs font-semibold uppercase tracking-wider mb-1">Today's Revenue</p>
            <p className="text-3xl font-bold">${todayRevenue.toFixed(2)}</p>
            <p className="text-violet-300 text-xs mt-1">{todayOrders} order{todayOrders !== 1 ? 's' : ''} today</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 text-white">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">AI Activity</p>
            <p className="text-3xl font-bold">{intents.length}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-gray-400 text-xs">{missions.filter(m => m.status === 'active').length} active missions</p>
            </div>
          </div>
        </div>

        {/* Primary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard loading={dataLoading} title="Total Revenue" value={`$${(stats?.totalRevenue || 0).toFixed(0)}`} change="+12.5% vs last month" changeUp icon={DollarSign} iconBg="bg-violet-50" iconColor="text-violet-600" />
          <StatCard loading={dataLoading} title="Total Orders" value={stats?.totalOrders || 0} subtitle={`${stats?.pendingOrders || 0} pending`} change="+8.2% vs last month" changeUp icon={ShoppingCart} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard loading={dataLoading} title="Products" value={stats?.totalProducts || 0} subtitle={`${products.filter(p => (p.stock || 0) < 20).length} low stock`} icon={Package} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
          <StatCard loading={dataLoading} title="Customers" value={stats?.totalBuyers || 0} change="+15.3% this week" changeUp icon={Users} iconBg="bg-pink-50" iconColor="text-pink-600" />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard loading={dataLoading} title="Avg Rating" value={`${stats?.avgRating || '0.0'}★`} subtitle={`${stats?.totalReviews || 0} reviews`} icon={Star} iconBg="bg-amber-50" iconColor="text-amber-500" />
          <StatCard loading={dataLoading} title="AI Sessions" value={stats?.totalConversations || 0} subtitle="conversations" icon={MessageSquare} iconBg="bg-cyan-50" iconColor="text-cyan-600" />
          <StatCard loading={dataLoading} title="Active Missions" value={stats?.activeMissions || 0} subtitle="buyer agents running" icon={Target} iconBg="bg-purple-50" iconColor="text-purple-600" />
          <StatCard loading={dataLoading} title="Avg Trust Score" value={`${stats?.avgTrustScore || 80}/100`} subtitle="across buyers" icon={Shield} iconBg="bg-teal-50" iconColor="text-teal-600" />
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-400 mt-0.5">Orders & revenue trend</p>
            </div>
            <div className="flex bg-gray-50 border border-gray-200 rounded-xl p-1 gap-0.5">
              {[{ v: '7d', l: '7D' }, { v: '30d', l: '30D' }, { v: '90d', l: '90D' }].map(r => (
                <button key={r.v} onClick={() => setChartRange(r.v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${chartRange === r.v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                  {r.l}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
                interval={chartRange === '7d' ? 0 : chartRange === '30d' ? 4 : 9} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Revenue" stroke="#7c3aed" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#7c3aed' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
              <button onClick={() => setActiveSection('orders')} className="text-xs text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {orders.slice(0, 6).map(o => (
                <div
                  key={o.id}
                  className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setOrderDetailModal({ open: true, order: o })}
                >
                  <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{o.order_number}</p>
                    <p className="text-xs text-gray-400">{o.shipping_address?.name || 'N/A'} · {new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <p className="text-sm font-bold text-gray-900">${parseFloat(o.total || 0).toFixed(2)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
              {orders.length === 0 && <EmptyState small icon={ShoppingBag} title="No orders yet" description="Orders will appear here when customers purchase." />}
            </div>
          </div>

          {/* Live activity + catalog stats */}
          <div className="space-y-4">
            {/* Live feed */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">Live Feed</h3>
                  <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-600 font-bold">LIVE</span>
                  </span>
                </div>
                <button onClick={() => setActiveSection('conversations')} className="text-xs text-violet-600 hover:text-violet-700 font-semibold">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {intents.slice(0, 5).map((intent, i) => {
                  const cfg = INTENT_CONFIG[intent.type] || { color: 'bg-gray-100 text-gray-600', icon: Activity }
                  return (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide shrink-0 ${cfg.color}`}>
                        {intent.type?.replace('_', ' ')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 leading-snug line-clamp-1">{intent.description}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(intent.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  )
                })}
                {intents.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No activity yet</p>}
              </div>
            </div>

            {/* Catalog breakdown */}
            {topProductStats.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Products by Category</h3>
                <div className="space-y-3">
                  {topProductStats.map((cat, i) => {
                    const max = topProductStats[0]?.value || 1
                    const colors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500']
                    return (
                      <div key={cat.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 font-medium">{cat.name}</span>
                          <span className="text-xs font-bold text-gray-900">{cat.value}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colors[i % colors.length]}`} style={{ width: `${(cat.value / max) * 100}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
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
          subtitle={`${orders.length} total orders · ${statusCounts.pending} pending`}
          action={
            <Button variant="outline" size="sm" onClick={() => handleExport('orders')} className="border-gray-200 text-gray-600 rounded-xl h-9">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </Button>
          }
        />

        {/* Order status summary cards */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { key: 'pending', label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
            { key: 'processing', label: 'Processing', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
            { key: 'shipped', label: 'Shipped', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
            { key: 'delivered', label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
            { key: 'cancelled', label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-50 border-red-100' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setOrderFilter(s.key)}
              className={`rounded-2xl p-3 border text-center transition-all ${orderFilter === s.key ? s.bg + ' ring-2 ring-offset-1 ring-violet-500/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}
            >
              <p className={`text-2xl font-bold ${orderFilter === s.key ? s.color : 'text-gray-800'}`}>{statusCounts[s.key]}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by order # or customer…"
              className="pl-10 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl h-10"
              value={orderSearch}
              onChange={e => setOrderSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOrderFilter('all')}
            className={`rounded-xl h-10 ${orderFilter === 'all' ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-200 text-gray-600'}`}
          >
            All Orders
          </Button>
        </div>

        <TableCard>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Items</Th>
                <Th right>Total</Th>
                <Th center>Payment</Th>
                <Th center>Status</Th>
                <Th center>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <Td>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{order.order_number}</div>
                      <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={order.shipping_address?.name || '?'} size="sm" />
                      <span className="text-sm font-medium text-gray-700">{order.shipping_address?.name || 'N/A'}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-sm text-gray-600">
                      {(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}
                    </span>
                  </Td>
                  <Td right>
                    <span className="font-bold text-gray-900 text-sm">${parseFloat(order.total || 0).toFixed(2)}</span>
                  </Td>
                  <Td center>
                    <StatusBadge status={order.payment_status || 'unknown'} map={{
                      paid: { label: 'Paid', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
                      pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
                      failed: { label: 'Failed', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
                      unknown: { label: 'Unknown', color: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' }
                    }} />
                  </Td>
                  <Td center>
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    >
                      {Object.entries(STATUS_ORDER).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                    </select>
                  </Td>
                  <Td center>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => setOrderDetailModal({ open: true, order })}
                    >
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
          subtitle={`${products.length} products · ${lowStock.length} low on stock`}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('products')} className="border-gray-200 text-gray-600 rounded-xl h-9">
                <Download className="w-3.5 h-3.5 mr-1.5" /> Export
              </Button>
              <Button size="sm" onClick={openProductCreate} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-9 shadow-sm shadow-violet-200">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Product
              </Button>
            </div>
          }
        />

        {lowStock.length > 0 && (
          <div className="mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>{lowStock.length} product{lowStock.length > 1 ? 's' : ''}</strong> running low on stock — under 20 units remaining
            </p>
            <span className="ml-auto text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">{lowStock.map(p => p.name).slice(0, 2).join(', ')}{lowStock.length > 2 ? ` +${lowStock.length - 2}` : ''}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search products…" className="pl-10 border-gray-200 bg-white text-gray-900 rounded-xl h-10" value={productSearch} onChange={e => setProductSearch(e.target.value)} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['all', ...PRODUCT_CATEGORIES].map(c => (
              <button key={c} onClick={() => setProductCategoryFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all h-10 ${productCategoryFilter === c ? 'bg-violet-600 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'}`}>
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
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group">
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button onClick={() => openProductEdit(p)} className="w-9 h-9 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-violet-600 transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm({ open: true, type: 'product', id: p.id, name: p.name })} className="w-9 h-9 rounded-xl bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {(p.stock || 0) < 20 && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm">Low Stock</div>
                  )}
                  {p.bargain_enabled && (
                    <div className="absolute top-2 left-2 bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" /> AI
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-violet-500 mb-0.5">{p.category}</p>
                  <p className="text-sm font-bold text-gray-900 truncate leading-tight">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900 text-sm">${p.price}</span>
                    <span className={`text-xs font-semibold ${(p.stock || 0) < 20 ? 'text-amber-600' : 'text-gray-400'}`}>{p.stock || 0} left</span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full">
                <EmptyState icon={Package} title="No products found" description="Add your first product to the catalog." action={<Button size="sm" onClick={openProductCreate} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Product</Button>} />
              </div>
            )}
          </div>
        ) : (
          <TableCard>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <Th>Product</Th>
                  <Th right>Price</Th>
                  <Th center>Stock</Th>
                  <Th>Category</Th>
                  <Th center>AI Bargain</Th>
                  <Th center>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <Td>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover border border-gray-100" />
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{p.name}</div>
                          <div className="text-xs text-gray-400 max-w-[200px] truncate">{p.description?.substring(0, 55)}{p.description?.length > 55 ? '…' : ''}</div>
                        </div>
                      </div>
                    </Td>
                    <Td right>
                      <div className="font-bold text-gray-900">${p.price}</div>
                      {p.compare_at_price > p.price && <div className="text-xs text-gray-400 line-through">${p.compare_at_price}</div>}
                    </Td>
                    <Td center>
                      <div className={`inline-flex flex-col items-center ${(p.stock || 0) < 20 ? 'text-amber-600' : 'text-gray-700'}`}>
                        <span className="text-sm font-bold">{p.stock || 0}</span>
                        {(p.stock || 0) < 20 && <span className="text-[9px] font-bold text-amber-500">LOW</span>}
                      </div>
                    </Td>
                    <Td>
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">{p.category}</span>
                    </Td>
                    <Td center>
                      {p.bargain_enabled
                        ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100"><Zap className="w-3 h-3" /> ${p.bargain_min_price}</span>
                        : <span className="text-xs text-gray-300 font-medium">Off</span>}
                    </Td>
                    <Td center>
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => openProductEdit(p)} className="p-2 rounded-xl hover:bg-violet-50 text-gray-300 hover:text-violet-600 transition-all"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteConfirm({ open: true, type: 'product', id: p.id, name: p.name })} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <EmptyState icon={Package} title="No products found" description="Add your first product to the catalog." action={<Button size="sm" onClick={openProductCreate} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Product</Button>} />}
          </TableCard>
        )}
      </div>
    )
  }

  const renderCustomers = () => {
    const avgTrust = customers.length ? Math.round(customers.reduce((s, c) => s + (c.trust_score || 80), 0) / customers.length) : 0
    const highRisk = customers.filter(c => c.risk_level === 'high').length
    const totalSpent = customers.reduce((s, c) => s + (c.total_spent || 0), 0)

    return (
      <div>
        <SectionHeader
          title="Customer Intelligence"
          subtitle={`${customers.length} consumer profiles tracked by AI`}
          action={
            <Button variant="outline" size="sm" onClick={() => handleExport('customers')} className="border-gray-200 text-gray-600 rounded-xl h-9">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export
            </Button>
          }
        />

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Avg Trust Score', value: `${avgTrust}/100`, icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Spent', value: `$${totalSpent.toFixed(0)}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'High Risk', value: highRisk, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{m.label}</p>
                <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        {customers.length === 0 ? (
          <EmptyState icon={Users} title="No customers yet" description="Customer profiles are created automatically when buyers interact with your AI store." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map(c => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => setCustomerModal({ open: true, customer: c })}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={c.session_id || '?'} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">Session #{c.session_id?.slice(0, 8)}</p>
                    <p className="text-xs text-gray-400">{c.interactions || 0} interactions</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${c.risk_level === 'high' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    {c.risk_level || 'low'} risk
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500 font-medium">Trust Score</span>
                    <span className="text-xs font-bold text-emerald-600">{c.trust_score || 80}/100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all"
                      style={{ width: `${c.trust_score || 80}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-gray-400 mb-0.5">Spent</p>
                    <p className="font-bold text-gray-900 text-sm">${(c.total_spent || 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-gray-400 mb-0.5">Orders</p>
                    <p className="font-bold text-gray-900 text-sm">{c.total_orders || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderReviews = () => {
    const filtered = reviews.filter(r => reviewFilter === 'all' || r.status === reviewFilter)
    const pendingCount = reviews.filter(r => r.status === 'pending').length
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : '0.0'

    return (
      <div>
        <SectionHeader
          title="Reviews"
          subtitle={`${reviews.length} total · ★ ${avgRating} average · ${pendingCount} pending moderation`}
        />

        {/* Rating breakdown */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-5xl font-black text-gray-900">{avgRating}</p>
                <div className="flex items-center gap-0.5 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(parseFloat(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
              </div>
              <Separator orientation="vertical" className="h-16 bg-gray-100" />
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-3">{star}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-1.5 mb-5">
          {[
            { value: 'all', label: 'All Reviews' },
            { value: 'pending', label: 'Pending', count: pendingCount },
            { value: 'published', label: 'Published' },
            { value: 'rejected', label: 'Rejected' },
          ].map(s => (
            <button
              key={s.value}
              onClick={() => setReviewFilter(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative flex items-center gap-1.5 ${reviewFilter === s.value ? 'bg-violet-600 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}
            >
              {s.label}
              {s.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${reviewFilter === s.value ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                  {s.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Star} title="No reviews" description="Customer reviews will appear here." />
        ) : (
          <div className="space-y-3">
            {filtered.map(review => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {review.product?.image && (
                      <img src={review.product.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900 text-sm">{review.product?.name || 'Product'}</span>
                        <span className="text-xs text-gray-400">by {review.author_name}</span>
                        <StatusBadge status={review.status} map={STATUS_REVIEW} />
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                        ))}
                        {review.title && <span className="ml-2 text-sm font-semibold text-gray-700">"{review.title}"</span>}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                      {review.merchant_reply && (
                        <div className="mt-3 pl-4 border-l-2 border-violet-300 bg-violet-50 rounded-r-xl p-3">
                          <p className="text-xs font-bold text-violet-700 mb-0.5 flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" /> Your Reply
                          </p>
                          <p className="text-xs text-gray-600">{review.merchant_reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {review.status === 'pending' && (
                      <>
                        <button onClick={() => updateReview(review.id, { status: 'published' })} className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-100" title="Approve">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => updateReview(review.id, { status: 'rejected' })} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100" title="Reject">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button onClick={() => openReviewReply(review)} className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors border border-gray-100" title="Reply">
                      <Reply className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteConfirm({ open: true, type: 'review', id: review.id, name: review.title || 'this review' })} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors border border-gray-100" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
        <SectionHeader title="Shipments" subtitle={`${shipments.length} active shipment records`} />

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Processing', value: processingCount, color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
            { label: 'In Transit', value: shippedCount, color: 'text-purple-600', bg: 'bg-purple-50', icon: Truck },
            { label: 'Delivered', value: deliveredCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{m.label}</p>
                <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        {shipments.length === 0 ? (
          <EmptyState icon={Truck} title="No shipments" description="Orders in processing or shipped status appear here." />
        ) : (
          <TableCard>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Carrier</Th>
                  <Th>Tracking #</Th>
                  <Th center>Status</Th>
                  <Th center>Edit</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {shipments.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <Td>
                      <div className="font-bold text-gray-900 text-sm">{s.order_number}</div>
                      <div className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString()}</div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Avatar name={s.shipping_address?.name || '?'} size="sm" color="blue" />
                        <span className="text-sm text-gray-700">{s.shipping_address?.name || 'N/A'}</span>
                      </div>
                    </Td>
                    <Td>
                      {s.carrier
                        ? <span className="text-sm font-semibold text-gray-900">{s.carrier}</span>
                        : <span className="text-xs text-gray-300 italic">Not assigned</span>}
                    </Td>
                    <Td>
                      {s.tracking_number
                        ? <code className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-mono">{s.tracking_number}</code>
                        : <span className="text-xs text-gray-300 italic">No tracking</span>}
                    </Td>
                    <Td center><StatusBadge status={s.status} /></Td>
                    <Td center>
                      <button onClick={() => openShipmentEdit(s)} className="p-2 rounded-xl hover:bg-violet-50 text-gray-300 hover:text-violet-600 transition-all">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
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
          <Button size="sm" onClick={openCampaignCreate} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-9 shadow-sm shadow-violet-200">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Campaign
          </Button>
        }
      />

      {campaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Create email, SMS, or push campaigns to reach your customers."
          action={
            <Button size="sm" onClick={openCampaignCreate} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Campaign
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="font-bold text-gray-900 text-base">{c.name}</h3>
                    <StatusBadge status={c.status} map={STATUS_CAMPAIGN} />
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs font-bold uppercase">{c.type}</span>
                  </div>
                  <p className="text-sm text-gray-500">{c.description}</p>
                </div>
                <div className="flex gap-1.5 ml-4 shrink-0">
                  <button onClick={() => openCampaignEdit(c)} className="p-2 rounded-xl hover:bg-violet-50 text-gray-300 hover:text-violet-600 transition-all">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirm({ open: true, type: 'campaign', id: c.id, name: c.name })} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-50">
                {[
                  { label: 'Audience', value: c.audience_count || 0 },
                  { label: 'Sent', value: c.sent_count || 0 },
                  { label: 'Open Rate', value: `${c.open_rate || 0}%` },
                  { label: 'Click Rate', value: `${c.click_rate || 0}%` },
                ].map(m => (
                  <div key={m.label}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{m.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{m.value}</p>
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
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
              </span>
              <Button variant="outline" size="sm" onClick={fetchData} className="border-gray-200 text-gray-600 rounded-xl h-9">
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          }
        />

        <div className="flex gap-1.5 mb-5 flex-wrap">
          {types.map(t => {
            const cfg = INTENT_CONFIG[t] || {}
            const count = t === 'all' ? intents.length : intents.filter(i => i.type === t).length
            return (
              <button key={t} onClick={() => setIntentFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${intentFilter === t ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}>
                {t === 'all' ? 'All' : t.replace('_', ' ')}
                {count > 0 && <span className="ml-1.5 opacity-60">{count}</span>}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" description="Customer interactions will stream here in real-time." />
        ) : (
          <div className="space-y-2">
            {filtered.map((intent, i) => {
              const cfg = INTENT_CONFIG[intent.type] || { color: 'bg-gray-100 text-gray-600', icon: Activity }
              const Icon = cfg.icon
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{intent.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{new Date(intent.timestamp).toLocaleString()}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400 font-mono">#{intent.session_id?.slice(0, 8)}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide shrink-0 ${cfg.color}`}>
                    {intent.type?.replace('_', ' ')}
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
          subtitle="AI buyer agents working on shopping goals"
          action={
            <span className="flex items-center gap-1.5 text-xs font-bold bg-violet-50 border border-violet-200 text-violet-700 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              {activeMissions.length} running
            </span>
          }
        />

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Active', value: activeMissions.length, color: 'text-violet-600', bg: 'bg-violet-50', icon: CircleDot },
            { label: 'Completed', value: completedMissions.length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
            { label: 'Total', value: missions.length, color: 'text-gray-700', bg: 'bg-gray-50', icon: Target },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{m.label}</p>
                <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-1.5 mb-5">
          {['all', 'active', 'completed', 'failed'].map(s => (
            <button key={s} onClick={() => setMissionFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${missionFilter === s ? 'bg-violet-600 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}>
              {s === 'all' ? 'All Missions' : s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Target} title="No missions" description="Buyer AI missions appear here when customers set shopping goals." />
        ) : (
          <div className="space-y-3">
            {filtered.map(m => (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${m.status === 'active' ? 'bg-violet-50' : m.status === 'completed' ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                    <Bot className={`w-5 h-5 ${m.status === 'active' ? 'text-violet-600' : m.status === 'completed' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h3 className="font-bold text-gray-900 text-sm">{m.goal}</h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wide ${m.status === 'active' ? 'bg-violet-50 text-violet-700 border border-violet-200' : m.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                        {m.status}
                      </span>
                      {m.status === 'active' && <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      <span className="font-mono bg-gray-50 px-2 py-0.5 rounded-md">#{m.session_id?.slice(0, 12)}</span>
                      {m.budget_max && <span className="bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-md">Budget: ${m.budget_max}</span>}
                      <span>{new Date(m.created_at).toLocaleString()}</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500 font-medium">Progress</span>
                        <span className="text-xs font-bold text-gray-700">{m.progress || 0}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${m.status === 'active' ? 'bg-gradient-to-r from-violet-500 to-purple-500' : m.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                          style={{ width: `${m.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    {m.steps && m.steps.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {m.steps.slice(-3).map((step, si) => (
                          <div key={si} className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
                            <span>{step.description}</span>
                            <span className="ml-auto">{new Date(step.timestamp).toLocaleTimeString()}</span>
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
            pending.length > 0 ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5" />
                {pending.length} awaiting
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-600">
                <CheckCircle className="w-3.5 h-3.5" />
                All clear
              </span>
            )
          }
        />

        {pending.length === 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="font-bold text-emerald-800 text-base">You're all caught up!</p>
            <p className="text-sm text-emerald-600 mt-1">No pending AI actions require your approval right now.</p>
          </div>
        )}

        {pending.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-amber-500 rounded-full" />
              <p className="text-sm font-bold text-gray-900">Pending Actions ({pending.length})</p>
            </div>
            <div className="space-y-3">
              {pending.map(a => {
                const typeCfg = TYPE_APPROVAL[a.type] || { label: a.type, color: 'bg-gray-100 text-gray-600 border-gray-200', iconColor: 'text-gray-600', bg: 'bg-gray-50' }
                const TypeIcon = typeCfg.icon || Shield
                return (
                  <div key={a.id} className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden">
                    <div className="bg-amber-50 px-5 py-3 flex items-center gap-3 border-b border-amber-200">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${typeCfg.color}`}>{typeCfg.label}</span>
                      <span className="text-xs text-amber-700 font-mono">Session: {a.session_id?.slice(0, 12)}…</span>
                      <span className="text-xs text-amber-600 ml-auto">{new Date(a.created_at).toLocaleString()}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl ${typeCfg.bg} flex items-center justify-center shrink-0 border border-${typeCfg.bg}`}>
                          <TypeIcon className={`w-5 h-5 ${typeCfg.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 font-medium leading-relaxed mb-4">{a.description}</p>
                          {(a.original_price || a.requested_price) && (
                            <div className="flex items-center gap-3 mb-4">
                              {a.original_price && (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                                  <p className="text-xs text-gray-400 mb-0.5">Original Price</p>
                                  <p className="font-bold text-gray-700 text-lg">${a.original_price}</p>
                                </div>
                              )}
                              <ChevronRight className="w-4 h-4 text-gray-300" />
                              {a.requested_price && (
                                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-2.5">
                                  <p className="text-xs text-amber-600 mb-0.5">AI Requested</p>
                                  <p className="font-bold text-amber-700 text-lg">${a.requested_price}</p>
                                </div>
                              )}
                              {a.original_price && a.requested_price && (
                                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                                  <p className="text-xs text-red-500 mb-0.5">Discount</p>
                                  <p className="font-bold text-red-600 text-lg">-{(((a.original_price - a.requested_price) / a.original_price) * 100).toFixed(1)}%</p>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproval(a.id, 'approved')}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors shadow-sm shadow-emerald-200"
                            >
                              <Check className="w-4 h-4" /> Approve
                            </button>
                            <button
                              onClick={() => handleApproval(a.id, 'rejected')}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 text-sm font-bold transition-colors"
                            >
                              <X className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {resolved.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-gray-300 rounded-full" />
              <p className="text-sm font-bold text-gray-500">Resolved Actions ({resolved.length})</p>
            </div>
            <div className="space-y-2">
              {resolved.map(a => (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${a.status === 'approved' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    {a.status === 'approved' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{a.description}</p>
                    <p className="text-xs text-gray-400">{a.status === 'approved' ? 'Approved' : 'Rejected'} · {new Date(a.resolved_at || a.updated_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
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
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 rounded-xl h-9">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Preview Store
              </Button>
            </a>
            <Button size="sm" onClick={() => updateStoreConfig(storeConfig)} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-9 shadow-sm shadow-violet-200">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Check className="w-3.5 h-3.5 mr-1.5" />}
              Save Changes
            </Button>
          </div>
        }
      />

      {storeConfig ? (
        <Tabs defaultValue="general" className="space-y-5">
          <TabsList className="bg-gray-100 border border-gray-200 p-1 rounded-xl">
            <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500 text-sm">General</TabsTrigger>
            <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500 text-sm">AI Assistant</TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500 text-sm">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              {[
                { label: 'Store Name', key: 'name', placeholder: 'e.g. Artisan Coffee Roasters' },
                { label: 'Tagline', key: 'tagline', placeholder: 'e.g. Best coffee in town' },
                { label: 'Banner Text', key: 'banner', placeholder: 'e.g. FREE SHIPPING OVER $50' },
              ].map(f => (
                <div key={f.key}>
                  <Label className="text-sm font-semibold text-gray-700">{f.label}</Label>
                  <Input value={storeConfig[f.key] || ''} onChange={e => setStoreConfig({ ...storeConfig, [f.key]: e.target.value })} className="mt-2 border-gray-200 bg-white text-gray-900 rounded-xl h-10" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Description</Label>
                <Textarea value={storeConfig.description || ''} onChange={e => setStoreConfig({ ...storeConfig, description: e.target.value })} className="mt-2 border-gray-200 bg-white text-gray-900 rounded-xl" rows={3} placeholder="Describe your store…" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Store Status</Label>
                <Select value={storeConfig.status || 'live'} onValueChange={v => setStoreConfig({ ...storeConfig, status: v })}>
                  <SelectTrigger className="mt-2 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 rounded-xl">
                    <SelectItem value="live">🟢 Live</SelectItem>
                    <SelectItem value="maintenance">🟡 Maintenance Mode</SelectItem>
                    <SelectItem value="closed">🔴 Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-violet-900">AI Assistant Configuration</p>
                  <p className="text-xs text-violet-600 mt-0.5">These settings control how your AI shopping assistant behaves and introduces itself</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">AI Assistant Name</Label>
                <Input value={storeConfig.ai_name || ''} onChange={e => setStoreConfig({ ...storeConfig, ai_name: e.target.value })} className="mt-2 border-gray-200 bg-white text-gray-900 rounded-xl h-10" placeholder="e.g. Aria, Mark, Sage" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Welcome / Greeting Message</Label>
                <Textarea value={storeConfig.ai_greeting || ''} onChange={e => setStoreConfig({ ...storeConfig, ai_greeting: e.target.value })} className="mt-2 border-gray-200 bg-white text-gray-900 rounded-xl" rows={3} placeholder="Hey! What are you shopping for today?" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div>
                <Label className="text-sm font-semibold text-gray-700">Hero Image URL</Label>
                <Input value={storeConfig.hero_image || ''} onChange={e => setStoreConfig({ ...storeConfig, hero_image: e.target.value })} className="mt-2 border-gray-200 bg-white text-gray-900 rounded-xl h-10" placeholder="https://…" />
                {storeConfig.hero_image && (
                  <img src={storeConfig.hero_image} alt="Hero preview" className="mt-3 w-full h-36 object-cover rounded-xl border border-gray-200" onError={e => e.target.style.display = 'none'} />
                )}
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Logo URL</Label>
                <Input value={storeConfig.logo_url || ''} onChange={e => setStoreConfig({ ...storeConfig, logo_url: e.target.value })} className="mt-2 border-gray-200 bg-white text-gray-900 rounded-xl h-10" placeholder="https://…" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-200 mx-auto" />
        </div>
      )}
    </div>
  )

  // ─── MODALS ──────────────────────────────────────────────────

  const ProductModal = () => (
    <Dialog open={productModal.open} onOpenChange={open => !open && setProductModal({ open: false, mode: 'create', data: null })}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-lg">{productModal.mode === 'edit' ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription className="text-gray-400">Fill in the product details below</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {productForm.image && (
            <div className="relative h-40 bg-gray-100 rounded-2xl overflow-hidden">
              <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-semibold bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">Preview</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-sm font-semibold text-gray-700">Product Name *</Label>
              <Input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="e.g. Ethiopian Yirgacheffe" />
            </div>
            <div className="col-span-2">
              <Label className="text-sm font-semibold text-gray-700">Description</Label>
              <Textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl" rows={2} />
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Price *</Label>
              <Input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="0.00" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Compare at Price</Label>
              <Input type="number" step="0.01" value={productForm.compare_at_price} onChange={e => setProductForm({ ...productForm, compare_at_price: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="0.00" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Category</Label>
              <Select value={productForm.category || 'Single Origin'} onValueChange={v => setProductForm({ ...productForm, category: v })}>
                <SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-gray-200 rounded-xl">
                  {PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Stock</Label>
              <Input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="0" />
            </div>
            <div className="col-span-2">
              <Label className="text-sm font-semibold text-gray-700">Image URL</Label>
              <Input value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="https://…" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Weight</Label>
              <Input value={productForm.weight} onChange={e => setProductForm({ ...productForm, weight: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="e.g. 340g" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Min Bargain Price</Label>
              <Input type="number" step="0.01" value={productForm.bargain_min_price} onChange={e => setProductForm({ ...productForm, bargain_min_price: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="0.00" />
            </div>
            <div className="col-span-2 flex items-center gap-4 bg-violet-50 rounded-xl p-4 border border-violet-100">
              <Switch checked={productForm.bargain_enabled ?? true} onCheckedChange={v => setProductForm({ ...productForm, bargain_enabled: v })} />
              <div>
                <Label className="text-gray-800 font-semibold text-sm">Enable AI Price Negotiation</Label>
                <p className="text-xs text-gray-500 mt-0.5">Allow the AI agent to negotiate price with buyers</p>
              </div>
              <Zap className="w-4 h-4 text-violet-500 ml-auto" />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={() => setProductModal({ open: false, mode: 'create', data: null })} className="border-gray-200 text-gray-700 rounded-xl">Cancel</Button>
          <Button onClick={() => saveProduct(productForm)} disabled={loading || !productForm.name || !productForm.price} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
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
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-lg">{o.order_number}</DialogTitle>
            <DialogDescription className="text-gray-400">{new Date(o.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 font-medium mb-1.5">Order Status</p>
                <StatusBadge status={o.status} />
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 font-medium mb-1.5">Payment</p>
                <StatusBadge status={o.payment_status || 'unknown'} map={{
                  paid: { label: 'Paid', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
                  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
                  failed: { label: 'Failed', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
                  unknown: { label: 'Unknown', color: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' }
                }} />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2.5">Items Ordered</h4>
              <div className="space-y-2">
                {(o.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />}
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${(o.subtotal || 0).toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Shipping</span><span>${(o.shipping || 0).toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax</span><span>${(o.tax || 0).toFixed(2)}</span></div>
              <Separator className="my-1 bg-gray-200" />
              <div className="flex justify-between font-bold text-base text-gray-900"><span>Total</span><span>${parseFloat(o.total || 0).toFixed(2)}</span></div>
            </div>

            {o.shipping_address && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> Shipping Address</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-800">{o.shipping_address.name}</p>
                  <p>{o.shipping_address.street}</p>
                  <p>{o.shipping_address.city}, {o.shipping_address.state} {o.shipping_address.zip}</p>
                  <p>{o.shipping_address.country}</p>
                </div>
              </div>
            )}

            {(o.tracking_number || o.carrier) && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Tracking Info</h4>
                {o.carrier && <p className="text-sm text-blue-700">Carrier: <strong>{o.carrier}</strong></p>}
                {o.tracking_number && <p className="text-sm text-blue-700 mt-0.5">Tracking: <code className="bg-blue-100 px-1.5 py-0.5 rounded-md text-xs font-mono">{o.tracking_number}</code></p>}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const CampaignModal = () => (
    <Dialog open={campaignModal.open} onOpenChange={open => !open && setCampaignModal({ open: false, mode: 'create', data: null })}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-lg">{campaignModal.mode === 'edit' ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
          <DialogDescription className="text-gray-400">{campaignModal.mode === 'edit' ? 'Update campaign details' : 'Set up a new marketing campaign'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-sm font-semibold text-gray-700">Campaign Name *</Label>
            <Input value={campaignForm.name} onChange={e => setCampaignForm({ ...campaignForm, name: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="e.g. Summer Sale" />
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">Description</Label>
            <Textarea value={campaignForm.description} onChange={e => setCampaignForm({ ...campaignForm, description: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Type</Label>
              <Select value={campaignForm.type} onValueChange={v => setCampaignForm({ ...campaignForm, type: v })}>
                <SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-gray-200 rounded-xl">
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Status</Label>
              <Select value={campaignForm.status} onValueChange={v => setCampaignForm({ ...campaignForm, status: v })}>
                <SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-gray-200 rounded-xl">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">Audience Size</Label>
            <Input type="number" value={campaignForm.audience_count} onChange={e => setCampaignForm({ ...campaignForm, audience_count: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="0" />
          </div>
          <Separator className="bg-gray-100" />
          <h4 className="font-bold text-gray-900 text-sm">Campaign Content</h4>
          <div>
            <Label className="text-sm font-semibold text-gray-700">Subject Line</Label>
            <Input value={campaignForm.content?.subject || ''} onChange={e => setCampaignForm({ ...campaignForm, content: { ...(campaignForm.content || {}), subject: e.target.value } })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="Email subject…" />
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">Body</Label>
            <Textarea value={campaignForm.content?.body || ''} onChange={e => setCampaignForm({ ...campaignForm, content: { ...(campaignForm.content || {}), body: e.target.value } })} className="mt-1.5 border-gray-200 rounded-xl" rows={3} placeholder="Campaign content…" />
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">CTA Button Text</Label>
            <Input value={campaignForm.content?.cta || ''} onChange={e => setCampaignForm({ ...campaignForm, content: { ...(campaignForm.content || {}), cta: e.target.value } })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="e.g. Shop Now" />
          </div>
        </div>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={() => setCampaignModal({ open: false, mode: 'create', data: null })} className="border-gray-200 text-gray-700 rounded-xl">Cancel</Button>
          <Button onClick={() => saveCampaign(campaignForm)} disabled={loading || !campaignForm.name} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {campaignModal.mode === 'edit' ? 'Update' : 'Create Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const ReviewReplyModal = () => (
    <Dialog open={reviewModal.open} onOpenChange={open => !open && setReviewModal({ open: false, review: null })}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-lg">Reply to Review</DialogTitle>
          <DialogDescription className="text-gray-400">Responding to {reviewModal.review?.author_name}'s review</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= (reviewModal.review?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{reviewModal.review?.content}</p>
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">Your Reply</Label>
            <Textarea value={reviewReplyText} onChange={e => setReviewReplyText(e.target.value)} className="mt-1.5 border-gray-200 rounded-xl" rows={3} placeholder="Thank you for your feedback…" />
          </div>
          <div>
            <Label className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Review Status</Label>
            <div className="flex gap-2 mt-2">
              <button onClick={() => updateReview(reviewModal.review?.id, { status: 'published', merchant_reply: reviewReplyText })} className={`flex-1 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${reviewModal.review?.status === 'published' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>
                <Check className="w-3 h-3" /> Publish
              </button>
              <button onClick={() => updateReview(reviewModal.review?.id, { status: 'rejected', merchant_reply: reviewReplyText })} className={`flex-1 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${reviewModal.review?.status === 'rejected' ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}>
                <X className="w-3 h-3" /> Reject
              </button>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={() => setReviewModal({ open: false, review: null })} className="border-gray-200 text-gray-700 rounded-xl">Cancel</Button>
          <Button onClick={() => updateReview(reviewModal.review?.id, { merchant_reply: reviewReplyText })} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-3.5 h-3.5 mr-2" />}
            Save Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const ShipmentEditModal = () => (
    <Dialog open={shipmentModal.open} onOpenChange={open => !open && setShipmentModal({ open: false, order: null })}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-lg">Update Shipment</DialogTitle>
          <DialogDescription className="text-gray-400">{shipmentModal.order?.order_number} — {shipmentModal.order?.shipping_address?.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-sm font-semibold text-gray-700">Carrier</Label>
            <Select value={shipmentForm.carrier || 'none'} onValueChange={v => setShipmentForm({ ...shipmentForm, carrier: v === 'none' ? '' : v })}>
              <SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue placeholder="Select carrier" /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-xl">
                <SelectItem value="none">Select carrier</SelectItem>
                {['UPS', 'USPS', 'FedEx', 'DHL', 'Other'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">Tracking Number</Label>
            <Input value={shipmentForm.tracking_number} onChange={e => setShipmentForm({ ...shipmentForm, tracking_number: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl h-10" placeholder="Enter tracking number" />
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">Status</Label>
            <Select value={shipmentForm.status} onValueChange={v => setShipmentForm({ ...shipmentForm, status: v })}>
              <SelectTrigger className="mt-1.5 border-gray-200 bg-white text-gray-900 rounded-xl h-10"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-xl">
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700">Notes</Label>
            <Textarea value={shipmentForm.notes} onChange={e => setShipmentForm({ ...shipmentForm, notes: e.target.value })} className="mt-1.5 border-gray-200 rounded-xl" rows={2} placeholder="Internal notes…" />
          </div>
        </div>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={() => setShipmentModal({ open: false, order: null })} className="border-gray-200 text-gray-700 rounded-xl">Cancel</Button>
          <Button onClick={() => updateShipment(shipmentModal.order?.id, shipmentForm)} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
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
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-lg">Customer Profile</DialogTitle>
            <DialogDescription className="text-gray-400">Session #{c.session_id?.slice(0, 16)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Avatar name={c.session_id || '?'} size="lg" />
              <div>
                <p className="font-bold text-gray-900 text-base">Session #{c.session_id?.slice(0, 8)}</p>
                <p className="text-sm text-gray-400">{c.interactions || 0} total interactions</p>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block ${c.risk_level === 'high' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                  {c.risk_level || 'low'} risk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Trust Score', value: `${c.trust_score || 80}/100`, color: 'text-emerald-600' },
                { label: 'Risk Level', value: (c.risk_level || 'low').toUpperCase(), color: 'text-gray-700' },
                { label: 'Total Spent', value: `$${(c.total_spent || 0).toFixed(2)}`, color: 'text-gray-900' },
                { label: 'Total Orders', value: c.total_orders || 0, color: 'text-gray-900' },
              ].map(m => (
                <div key={m.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                  <p className="text-xs text-gray-400 font-medium">{m.label}</p>
                  <p className={`text-xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-400">First Seen</span>
                <span className="font-semibold text-gray-900">{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Last Active</span>
                <span className="font-semibold text-gray-900">{c.updated_at ? new Date(c.updated_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Trust Score</span>
                <span className="text-sm font-bold text-emerald-600">{c.trust_score || 80}/100</span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: `${c.trust_score || 80}%` }} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ─── MAIN RENDER ──────────────────────────────────────────────

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
      default: return <div className="text-gray-400">Section not found</div>
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400 font-medium">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const pendingApprovals = approvals.filter(a => a.status === 'pending').length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const pendingReviews = reviews.filter(r => r.status === 'pending').length

  // Determine section title for header
  const sectionMeta = SIDEBAR_ITEMS.flatMap(s => s.items).find(i => i.key === activeSection)

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F8FA', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>

      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside className="w-[240px] bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-sm">

        {/* Logo area */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-sm shadow-violet-200">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="white" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900 leading-none tracking-tight">Convos</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5 font-medium tracking-wider uppercase">Merchant Hub</p>
            </div>
          </div>
        </div>

        {/* Store status pill */}
        <div className="px-4 py-2.5 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-gray-600 flex-1 truncate">{storeConfig?.name || 'Your Store'}</span>
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">{storeConfig?.status || 'LIVE'}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {SIDEBAR_ITEMS.map(section => (
            <div key={section.section}>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.15em] px-3 mb-1.5">{section.section}</p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const badgeCount = item.badge === 'orders' ? pendingOrders : item.badge === 'reviews' ? pendingReviews : item.badge === 'approvals' ? pendingApprovals : 0
                  const isActive = activeSection === item.key
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${isActive
                        ? 'bg-violet-50 text-violet-700'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {badgeCount > 0 && (
                        <span className={`text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 ${isActive ? 'bg-violet-600 text-white' : item.badge === 'approvals' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
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
        <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
          <a href="/store" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all group">
            <Globe className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            <span className="flex-1">View Storefront</span>
            <ExternalLink className="w-3 h-3 text-gray-300" />
          </a>
          <button
            onClick={() => { localStorage.removeItem('user'); window.location.href = '/merchant/login' }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ──────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header bar */}
        <header className="bg-white border-b border-gray-100 h-[60px] flex items-center px-6 gap-4 shrink-0 sticky top-0 z-10 shadow-sm">
          {/* Breadcrumb / page title */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900 truncate">
              {sectionMeta?.label || 'Dashboard'}
            </h2>
            {activeSection === 'home' && stats && (
              <span className="hidden md:flex items-center gap-1 text-xs text-gray-400">
                <span className="text-gray-200">·</span>
                <span>${(stats?.totalRevenue || 0).toFixed(0)} lifetime revenue</span>
              </span>
            )}
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notification bell */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovals > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={fetchData}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 mx-1" />

            {/* User avatar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-gray-900 leading-none">Merchant</p>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">merchant@demo.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Notification dropdown */}
        {notifOpen && (
          <div className="absolute top-[60px] right-4 z-20 w-72 bg-white rounded-2xl border border-gray-100 shadow-xl">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900">Notifications</p>
            </div>
            <div className="p-2">
              {pendingApprovals > 0 && (
                <button
                  onClick={() => { setActiveSection('approvals'); setNotifOpen(false) }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{pendingApprovals} pending approval{pendingApprovals > 1 ? 's' : ''}</p>
                    <p className="text-xs text-gray-400 mt-0.5">AI actions need your review</p>
                  </div>
                </button>
              )}
              {pendingOrders > 0 && (
                <button
                  onClick={() => { setActiveSection('orders'); setOrderFilter('pending'); setNotifOpen(false) }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{pendingOrders} pending order{pendingOrders > 1 ? 's' : ''}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Awaiting processing</p>
                  </div>
                </button>
              )}
              {pendingApprovals === 0 && pendingOrders === 0 && (
                <div className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">All caught up!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overlay to close notification */}
        {notifOpen && <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-7">
          {renderContent()}
        </main>
      </div>

      {/* ── MODALS ────────────────────────────────────── */}
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

      {/* ── TOAST ─────────────────────────────────────── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
