'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  LayoutDashboard, MessageSquare, Bot, ShoppingBag, Package, Users,
  Truck, Paintbrush, Star, Megaphone, PieChart, Mail, MessageCircle,
  Search, ChevronRight, DollarSign, ClipboardList, TrendingUp, Activity,
  Sparkles, Plus, ArrowUpRight, Coffee, Globe, Target, Shield
} from 'lucide-react'

const SIDEBAR_ITEMS = [
  { section: 'OVERVIEW', items: [
    { key: 'home', label: 'Home', icon: LayoutDashboard },
    { key: 'conversations', label: 'Conversations', icon: MessageSquare },
    { key: 'ai-authority', label: 'AI Authority', icon: Bot },
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
    { key: 'segments', label: 'Segments', icon: PieChart },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  ]}
]

function StatCard({ label, value, description, icon: Icon, change, changeColor = 'text-red-500' }) {
  return (
    <div className="bg-card rounded-xl p-5 store-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          {change !== undefined && (
            <span className={`text-xs font-medium ${changeColor}`}>{change}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function PulseItem({ label, description, value }) {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="text-lg font-bold text-foreground">{value}</span>
    </div>
  )
}

function IntentItem({ intent }) {
  const typeColors = {
    search: 'bg-blue-100 text-blue-700', negotiate: 'bg-amber-100 text-amber-700',
    mission_create: 'bg-purple-100 text-purple-700', add_to_cart: 'bg-emerald-100 text-emerald-700',
    checkout: 'bg-green-100 text-green-700', message: 'bg-gray-100 text-gray-700'
  }
  const color = typeColors[intent.type] || 'bg-gray-100 text-gray-700'
  const time = new Date(intent.timestamp)
  const ago = getTimeAgo(time)
  return (
    <div className="flex items-start gap-3 py-2.5 px-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{intent.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={`text-[10px] border-0 font-medium ${color}`}>{intent.type}</Badge>
          <span className="text-[10px] text-muted-foreground">{ago}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{intent.session_id?.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  )
}

function ConsumerCard({ profile }) {
  const trustColor = profile.trust_score >= 80 ? 'text-emerald-600' : profile.trust_score >= 60 ? 'text-amber-600' : 'text-red-600'
  return (
    <div className="bg-card rounded-xl p-4 store-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium font-mono">{profile.session_id?.slice(0, 12)}...</p>
            <p className="text-[10px] text-muted-foreground">{profile.interactions || 0} interactions</p>
          </div>
        </div>
        <Badge className="text-[10px] bg-emerald-50 text-emerald-700 border-0">{profile.risk_level || 'Low Risk'}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground">Trust</p>
          <p className={`text-lg font-bold ${trustColor}`}>{profile.trust_score || 80}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Spent</p>
          <p className="text-lg font-bold">${(profile.total_spent || 0).toFixed(0)}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Orders</p>
          <p className="text-lg font-bold">{profile.total_orders || 0}</p>
        </div>
      </div>
    </div>
  )
}

function MissionItem({ mission }) {
  return (
    <div className="bg-card rounded-xl p-4 store-shadow">
      <div className="flex items-start justify-between mb-2">
        <Badge className={`text-[10px] border-0 ${mission.status === 'active' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'}`}>{mission.status}</Badge>
        <span className="text-[10px] text-muted-foreground font-mono">{mission.session_id?.slice(0, 8)}</span>
      </div>
      <p className="text-sm font-medium">{mission.goal}</p>
      <div className="flex items-center gap-2 mt-2">
        <Progress value={mission.progress || 0} className="h-1.5 flex-1" />
        <span className="text-xs text-muted-foreground">{mission.progress || 0}%</span>
      </div>
    </div>
  )
}

function getTimeAgo(date) {
  const s = Math.floor((new Date() - date) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function MerchantDashboard() {
  const [activeSection, setActiveSection] = useState('home')
  const [stats, setStats] = useState(null)
  const [intents, setIntents] = useState([])
  const [profiles, setProfiles] = useState([])
  const [missions, setMissions] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [storeConfig, setStoreConfig] = useState(null)
  const [timeRange, setTimeRange] = useState('7D')

  const fetchData = useCallback(async () => {
    try {
      const [s, i, p, m, pr, o, r, c, sc] = await Promise.all([
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/intents?limit=50').then(r => r.json()),
        fetch('/api/consumer-matrix').then(r => r.json()),
        fetch('/api/missions').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/reviews').then(r => r.json()),
        fetch('/api/campaigns').then(r => r.json()),
        fetch('/api/store-config').then(r => r.json())
      ])
      if (s && !s.error) setStats(s)
      if (Array.isArray(i)) setIntents(i)
      if (Array.isArray(p)) setProfiles(p)
      if (Array.isArray(m)) setMissions(m)
      if (Array.isArray(pr)) setProducts(pr)
      if (Array.isArray(o)) setOrders(o)
      if (Array.isArray(r)) setReviews(r)
      if (Array.isArray(c)) setCampaigns(c)
      if (sc && !sc.error) setStoreConfig(sc)
    } catch (e) { console.error(e) }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 4000)
    return () => clearInterval(interval)
  }, [fetchData])

  const renderContent = () => {
    switch (activeSection) {
      case 'home': return renderOverview()
      case 'conversations': return renderConversations()
      case 'ai-authority': return renderAIAuthority()
      case 'catalog': return renderCatalog()
      case 'customers': return renderCustomers()
      case 'orders': return renderOrders()
      case 'shipments': return renderShipments()
      case 'store-design': return renderStoreDesign()
      case 'reviews': return renderReviews()
      case 'campaigns': return renderCampaigns()
      default: return renderPlaceholder(activeSection)
    }
  }

  const renderOverview = () => (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" /> LIVE COMMERCE OPERATIONS
        </div>
        <div className="flex items-center gap-2">
          {['1D', '7D', '30D'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
              timeRange === r ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}>{r}</button>
          ))}
          <Button variant="outline" size="sm" className="text-xs rounded-full h-8 ml-2">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Conversations
          </Button>
          <Button size="sm" className="text-xs rounded-full h-8 bg-foreground text-background hover:bg-foreground/90">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create product
          </Button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-1">Overview</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Watch revenue, AI activity, and storefront readiness from one calmer control surface for {stats ? 'Artisan Coffee Roasters' : 'your store'}.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Revenue" value={`$${(stats?.totalRevenue || 0).toFixed(2)}`} description="Gross sales in the selected range" icon={DollarSign} change="+0.0%" changeColor="text-muted-foreground" />
        <StatCard label="Orders" value={stats?.totalOrders || 0} description="Completed and active transactions" icon={ClipboardList} change="+0" changeColor="text-muted-foreground" />
        <StatCard label="AI Sessions" value={stats?.totalConversations || 0} description="Live assistant-led shopping chats" icon={MessageSquare} />
        <StatCard label="Conversion" value={`${stats?.totalOrders && stats?.totalConversations ? ((stats.totalOrders / stats.totalConversations * 100).toFixed(1)) : '0.0'}%`} description="Sessions that turned into orders" icon={TrendingUp} />
      </div>

      {/* Sales Performance + Store Pulse */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-card rounded-xl p-5 store-shadow">
          <h3 className="font-semibold mb-1">Sales performance</h3>
          <p className="text-xs text-muted-foreground mb-4">A cleaner view of what your store and AI agent generated over the last 7 days.</p>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Net Sales</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${(stats?.totalRevenue || 0).toFixed(2)}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> vs prior period</span>
              </div>
            </div>
          </div>
          {/* Simple chart placeholder */}
          <div className="h-32 relative">
            <div className="absolute inset-0 flex items-end gap-1">
              {[20, 35, 15, 45, 30, 50, 25].map((h, i) => (
                <div key={i} className="flex-1 bg-muted rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              {(stats?.totalRevenue || 0) === 0 && <p className="text-xs text-muted-foreground">Sales data will appear as orders come in</p>}
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 store-shadow">
          <h3 className="font-semibold mb-4">Store pulse</h3>
          <div className="divide-y divide-border">
            <PulseItem label="Orders in range" description="Total transactions captured" value={stats?.totalOrders || 0} />
            <PulseItem label="AI-assisted orders" description={stats?.totalOrders ? `${stats.totalOrders} AI-assisted orders` : 'No AI-assisted orders yet'} value={stats?.totalOrders || 0} />
            <PulseItem label="Active AI workflows" description={`${stats?.activeMissions || 0} active workflows`} value={stats?.activeMissions || 0} />
          </div>
        </div>
      </div>
    </div>
  )

  const renderConversations = () => (
    <div>
      <h1 className="text-2xl font-bold mb-1">Intent Stream</h1>
      <p className="text-sm text-muted-foreground mb-6">Real-time buyer activity, AI actions, and conversion events.</p>
      <div className="bg-card rounded-xl store-shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-600">Live</span>
          </div>
          <Badge variant="outline" className="text-[10px]">{intents.length} events</Badge>
        </div>
        <ScrollArea className="h-[500px]">
          {intents.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Activity className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No events yet. Activity will appear here as buyers interact.</p>
            </div>
          ) : intents.map(i => <IntentItem key={i.id} intent={i} />)}
        </ScrollArea>
      </div>
    </div>
  )

  const renderAIAuthority = () => (
    <div>
      <h1 className="text-2xl font-bold mb-1">AI Authority</h1>
      <p className="text-sm text-muted-foreground mb-6">Consumer Matrix - trust scores, risk levels, and buyer intelligence.</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {profiles.map(p => <ConsumerCard key={p.id || p.session_id} profile={p} />)}
      </div>
      <h2 className="text-lg font-semibold mb-3 mt-8">Active Missions</h2>
      <div className="grid grid-cols-2 gap-4">
        {missions.map(m => <MissionItem key={m.id} mission={m} />)}
      </div>
      {profiles.length === 0 && missions.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Shield className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No consumer intelligence yet. Profiles appear as buyers interact.</p>
        </div>
      )}
    </div>
  )

  const renderCatalog = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Catalog</h1>
          <p className="text-sm text-muted-foreground">{products.length} products in your store</p>
        </div>
        <Button size="sm" className="rounded-full h-8 text-xs bg-foreground text-background">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add product
        </Button>
      </div>
      <div className="bg-card rounded-xl store-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Product</th>
              <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Category</th>
              <th className="text-right px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Price</th>
              <th className="text-right px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Min Price</th>
              <th className="text-right px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Stock</th>
              <th className="text-center px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Bargain</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-9 h-9 rounded-md object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{p.category}</Badge></td>
                <td className="px-4 py-3 text-right font-semibold">${p.price}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">${p.bargain_min_price}</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3 text-center">
                  <Badge className={`text-[10px] border-0 ${p.bargain_enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.bargain_enabled ? 'Active' : 'Off'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderCustomers = () => (
    <div>
      <h1 className="text-2xl font-bold mb-1">Customers</h1>
      <p className="text-sm text-muted-foreground mb-6">Consumer Matrix overview for all buyers.</p>
      <div className="grid grid-cols-2 gap-4">
        {profiles.map(p => <ConsumerCard key={p.id || p.session_id} profile={p} />)}
      </div>
      {profiles.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No customers yet.</p>
        </div>
      )}
    </div>
  )

  const renderOrders = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
      </div>
      <div className="bg-card rounded-xl store-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Order</th>
              <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Date</th>
              <th className="text-right px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Total</th>
              <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Payment</th>
              <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{o.order_number}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.shipping_address?.name || 'N/A'}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right font-semibold">${parseFloat(o.total).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Badge className={`text-[10px] border-0 ${o.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {o.payment_status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px]">{o.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <ShoppingBag className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderShipments = () => {
    const shipments = orders.filter(o => ['processing', 'shipped', 'delivered'].includes(o.status))
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Shipments</h1>
            <p className="text-sm text-muted-foreground">{shipments.length} active shipments</p>
          </div>
        </div>
        <div className="bg-card rounded-xl store-shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Carrier</th>
                <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Tracking</th>
                <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.order_number}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.shipping_address?.name || 'N/A'}</td>
                  <td className="px-4 py-3">{s.carrier || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.tracking_number || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px]">{s.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{getTimeAgo(new Date(s.updated_at))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {shipments.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Truck className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No active shipments.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderReviews = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Reviews</h1>
          <p className="text-sm text-muted-foreground">{reviews.length} total reviews</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-card rounded-xl p-5 store-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {r.product?.image && (
                  <img src={r.product.image} alt={r.product.name} className="w-12 h-12 rounded-md object-cover" />
                )}
                <div>
                  <p className="font-semibold text-sm">{r.product?.name || 'Product'}</p>
                  <p className="text-xs text-muted-foreground">{r.author_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <Badge className={`text-[10px] border-0 ${r.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {r.status}
                </Badge>
              </div>
            </div>
            {r.title && <p className="font-medium text-sm mb-1">{r.title}</p>}
            <p className="text-sm text-muted-foreground">{r.content}</p>
            <p className="text-xs text-muted-foreground mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      {reviews.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Star className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No reviews yet.</p>
        </div>
      )}
    </div>
  )

  const renderStoreDesign = () => (
    <div>
      <h1 className="text-2xl font-bold mb-1">Store Design</h1>
      <p className="text-sm text-muted-foreground mb-6">Customize your storefront appearance and branding.</p>
      {storeConfig && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl p-5 store-shadow">
            <h3 className="font-semibold mb-3">Store Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Store Name</label>
                <p className="text-sm font-medium mt-1">{storeConfig.name}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Tagline</label>
                <p className="text-sm font-medium mt-1">{storeConfig.tagline}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Description</label>
                <p className="text-sm text-muted-foreground mt-1">{storeConfig.description}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 store-shadow">
            <h3 className="font-semibold mb-3">AI Assistant Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">AI Name</label>
                <p className="text-sm font-medium mt-1">{storeConfig.ai_name}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">AI Greeting</label>
                <p className="text-sm text-muted-foreground mt-1">{storeConfig.ai_greeting}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 store-shadow">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {storeConfig.categories?.map((cat, i) => (
                <Badge key={i} variant="outline">{cat}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderCampaigns = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Campaigns</h1>
          <p className="text-sm text-muted-foreground">{campaigns.length} total campaigns</p>
        </div>
        <Button size="sm" className="rounded-full h-8 text-xs bg-foreground text-background">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Create campaign
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="bg-card rounded-xl p-5 store-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{c.name}</h3>
                  <Badge className={`text-[10px] border-0 ${
                    c.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                    c.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {c.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>
              <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Audience</p>
                <p className="text-lg font-bold mt-1">{c.audience_count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Sent</p>
                <p className="text-lg font-bold mt-1">{c.sent_count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Open Rate</p>
                <p className="text-lg font-bold mt-1">{c.open_rate}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {campaigns.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Megaphone className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No campaigns yet.</p>
        </div>
      )}
    </div>
  )

  const renderPlaceholder = (section) => (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Package className="w-10 h-10 mb-3 opacity-30" />
      <p className="text-lg font-semibold capitalize mb-1">{section.replace('-', ' ')}</p>
      <p className="text-sm">This section is coming soon.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-[220px] bg-sidebar-background border-r border-sidebar-border flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-4 pb-6">
          <a href="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="url(#g)"/><defs><linearGradient id="g" x1="8" y1="2" x2="24" y2="28"><stop stopColor="#9333ea"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs></svg>
            <span className="text-lg font-bold tracking-tight">Convos</span>
          </a>
        </div>

        <ScrollArea className="flex-1 px-3">
          {SIDEBAR_ITEMS.map(group => (
            <div key={group.section} className="mb-5">
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground px-3 mb-1.5">{group.section}</p>
              {group.items.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeSection === item.key
                      ? 'bg-sidebar-accent text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {activeSection === item.key && <div className="w-1.5 h-1.5 rounded-full bg-foreground ml-auto" />}
                </button>
              ))}
            </div>
          ))}
        </ScrollArea>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search orders, missions, or intelligence..." className="pl-9 h-9 rounded-full bg-muted border-0 text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border">
              <span className="text-sm font-medium">Artisan Coffee Roasters</span>
              <Badge className="text-[10px] bg-emerald-50 text-emerald-700 border-0">Live</Badge>
            </div>
            <a href="/">
              <Button variant="outline" size="sm" className="rounded-full h-8 text-xs">
                <Globe className="w-3.5 h-3.5 mr-1.5" /> Storefront
              </Button>
            </a>
            <Button size="sm" className="rounded-full h-8 text-xs bg-foreground text-background hover:bg-foreground/90">
              <Coffee className="w-3.5 h-3.5 mr-1.5" /> Convos AI
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 max-w-[1200px] w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default MerchantDashboard;
