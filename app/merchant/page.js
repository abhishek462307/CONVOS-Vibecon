'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  LayoutDashboard, MessageSquare, Bot, ShoppingBag, Package, Users,
  Truck, Paintbrush, Star, Megaphone, PieChart, Mail, MessageCircle,
  Search, DollarSign, ClipboardList, TrendingUp, Activity,
  Sparkles, Plus, ArrowUpRight, Globe, Shield
} from 'lucide-react'

function ConvosLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2C12 2 8 6 8 12c0 4 2 8 4 11 1.5 2 2.5 4 4 5 1.5-1 2.5-3 4-5 2-3 4-7 4-11 0-6-4-10-8-10z" fill="url(#merchant-g)"/>
      <defs><linearGradient id="merchant-g" x1="8" y1="2" x2="24" y2="28"><stop stopColor="#a855f7"/><stop offset="0.6" stopColor="#ec4899"/><stop offset="1" stopColor="#f97316"/></linearGradient></defs>
    </svg>
  )
}

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

function StatCard({ label, value, description, icon: Icon, change, changePositive }) {
  const trendTone = change === undefined
    ? 'bg-secondary text-muted-foreground'
    : changePositive
      ? 'bg-emerald-500/10 text-emerald-600'
      : 'bg-red-500/10 text-red-500'
  return (
    <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">{label}</p>
            <p className="mt-2 text-[28px] font-semibold tracking-tight text-foreground">{value}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
            <Icon className="h-4 w-4 text-foreground" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs leading-4 text-muted-foreground">{description}</p>
          {change !== undefined && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${trendTone}`}>{change}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function PulseItem({ label, description, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[16px] border border-border/70 bg-secondary/20 px-3.5 py-2.5">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <p className="shrink-0 text-base font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  )
}

function IntentItem({ intent }) {
  const typeColors = {
    search: 'bg-blue-500/12 text-blue-400', negotiate: 'bg-amber-500/12 text-amber-400',
    mission_create: 'bg-purple-500/12 text-purple-400', add_to_cart: 'bg-emerald-500/12 text-emerald-400',
    checkout: 'bg-emerald-500/12 text-emerald-500', message: 'bg-secondary text-muted-foreground'
  }
  const color = typeColors[intent.type] || 'bg-secondary text-muted-foreground'
  const time = new Date(intent.timestamp)
  const ago = getTimeAgo(time)
  return (
    <div className="flex items-start gap-3 py-3 px-5 hover:bg-secondary/25 transition-colors border-b border-border/70 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{intent.description}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}>{intent.type}</span>
          <span className="text-[10px] text-muted-foreground">{ago}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{intent.session_id?.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  )
}

function ConsumerCard({ profile }) {
  const trustColor = profile.trust_score >= 80 ? 'text-emerald-500' : profile.trust_score >= 60 ? 'text-amber-500' : 'text-red-500'
  return (
    <div className="rounded-[20px] border border-border/70 bg-card p-4 shadow-sm">
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
        <span className="inline-flex items-center rounded-full bg-emerald-500/12 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-500">{profile.risk_level || 'Low Risk'}</span>
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
    <div className="rounded-[20px] border border-border/70 bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${mission.status === 'active' ? 'bg-purple-500/12 text-purple-400' : 'bg-emerald-500/12 text-emerald-500'}`}>{mission.status}</span>
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
      <header className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/85 shadow-sm mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Live commerce operations
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Watch revenue, AI activity, and storefront readiness from one calmer control surface for {stats ? 'Artisan Coffee Roasters' : 'your store'}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 xl:justify-end">
          <div className="inline-flex items-center gap-1.5 rounded-2xl border border-border/70 bg-card p-1.5 shadow-sm">
            {['1D', '7D', '30D'].map(r => (
              <button key={r} onClick={() => setTimeRange(r)} className={`rounded-xl px-5 py-2.5 text-[11px] font-bold tracking-tight transition-all ${
                timeRange === r
                  ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                  : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
              }`}>{r}</button>
            ))}
          </div>
          <Button variant="outline" className="h-11 rounded-2xl border-border/70 bg-card px-6 font-semibold tracking-tight shadow-sm hover:bg-secondary/40 transition-all">
            <MessageSquare className="mr-2.5 h-4 w-4" /> Conversations
          </Button>
          <Button className="h-11 rounded-2xl px-7 font-semibold tracking-tight shadow-md hover:opacity-90 transition-all">
            <Plus className="mr-2 h-4 w-4" /> Create product
          </Button>
        </div>
      </header>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={`$${(stats?.totalRevenue || 0).toFixed(2)}`} description="Gross sales in the selected range" icon={DollarSign} />
        <StatCard label="Orders" value={String(stats?.totalOrders || 0)} description="Completed and active transactions" icon={ClipboardList} />
        <StatCard label="AI Sessions" value={String(stats?.totalConversations || 0)} description="Live assistant-led shopping chats" icon={MessageSquare} />
        <StatCard label="Conversion" value={`${stats?.totalOrders && stats?.totalConversations ? ((stats.totalOrders / stats.totalConversations * 100).toFixed(1)) : '0.0'}%`} description="Sessions that turned into orders" icon={TrendingUp} />
      </div>

      <div className="mb-5 grid gap-3 xl:items-start xl:grid-cols-[minmax(0,1.75fr)_320px]">
        <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card">
          <div className="border-b border-border/70 bg-card px-5 py-4 lg:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-base font-semibold tracking-tight">Sales performance</p>
                <p className="mt-1 text-sm text-muted-foreground">A cleaner view of what your store and AI agent generated over the last {timeRange}.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">Net sales</p>
                  <p className="mt-1 text-[28px] font-semibold tracking-tight">${(stats?.totalRevenue || 0).toFixed(2)}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border/70 bg-secondary px-3 py-1 text-xs font-semibold flex items-center gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" /> vs prior period
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="h-[200px] border-b border-border/70 px-5 py-4 relative bg-secondary/10">
              <div className="absolute inset-4 flex items-end gap-1.5">
                {[20, 35, 15, 45, 30, 50, 25, 40, 28, 55, 33, 48, 22, 38].map((h, i) => (
                  <div key={i} className="flex-1 bg-foreground/10 rounded-t-md hover:bg-foreground/20 transition-colors" style={{ height: `${h}%` }} />
                ))}
              </div>
              {(stats?.totalRevenue || 0) === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Sales data will appear as orders come in</p>
                </div>
              )}
            </div>
            <div className="grid gap-2.5 px-5 py-4 md:grid-cols-3 lg:px-6">
              {[
                { label: 'Orders captured', value: String(stats?.totalOrders || 0) },
                { label: 'AI sessions', value: String(stats?.totalConversations || 0) },
                { label: 'Active missions', value: String(stats?.activeMissions || 0) },
              ].map(pill => (
                <div key={pill.label} className="rounded-[18px] border border-border/70 bg-secondary/25 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/85">{pill.label}</p>
                  <p className="mt-2 text-base font-semibold tracking-tight">{pill.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card">
          <div className="border-b border-border/70 px-4 py-3.5">
            <p className="text-sm font-semibold tracking-tight">Store pulse</p>
          </div>
          <div className="space-y-2.5 p-4">
            <PulseItem label="Orders in range" description="Total transactions captured" value={String(stats?.totalOrders || 0)} />
            <PulseItem label="AI-assisted orders" description={stats?.totalOrders ? 'of all orders' : 'No AI-assisted orders yet'} value={String(stats?.totalOrders || 0)} />
            <PulseItem label="Active AI workflows" description={`${stats?.activeMissions || 0} completed`} value={String(stats?.activeMissions || 0)} />
          </div>
        </div>
      </div>
    </div>
  )

  const renderConversations = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight">Intent Stream</h1>
        <p className="mt-2 text-sm text-muted-foreground">Real-time buyer activity, AI actions, and conversion events.</p>
      </div>
      <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card">
        <div className="px-5 py-3.5 border-b border-border/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-500">Live</span>
          </div>
          <span className="rounded-full border border-border/70 bg-secondary px-3 py-0.5 text-[10px] font-semibold">{intents.length} events</span>
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
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight">AI Authority</h1>
        <p className="mt-2 text-sm text-muted-foreground">Consumer Matrix — trust scores, risk levels, and buyer intelligence.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {profiles.map(p => <ConsumerCard key={p.id || p.session_id} profile={p} />)}
      </div>
      <h2 className="text-base font-semibold tracking-tight mb-3 mt-8">Active Missions</h2>
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">Catalog</h1>
          <p className="mt-2 text-sm text-muted-foreground">{products.length} products in your store</p>
        </div>
        <Button className="h-11 rounded-2xl px-6 font-semibold tracking-tight shadow-md hover:opacity-90 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add product
        </Button>
      </div>
      <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/20">
              <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Product</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Category</th>
              <th className="text-right px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Price</th>
              <th className="text-right px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Min Price</th>
              <th className="text-right px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Stock</th>
              <th className="text-center px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Bargain</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-9 h-9 rounded-xl object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="inline-flex items-center rounded-full border border-border/70 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{p.category}</span></td>
                <td className="px-4 py-3 text-right font-semibold">${p.price}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">${p.bargain_min_price}</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${p.bargain_enabled ? 'bg-emerald-500/12 text-emerald-500' : 'bg-secondary text-muted-foreground'}`}>
                    {p.bargain_enabled ? 'Active' : 'Off'}
                  </span>
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
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight">Customers</h1>
        <p className="mt-2 text-sm text-muted-foreground">Consumer Matrix overview for all buyers.</p>
      </div>
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
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>
      <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/20">
              <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Order</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Customer</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Date</th>
              <th className="text-right px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Total</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Payment</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Status</th>
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
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${o.payment_status === 'paid' ? 'bg-emerald-500/12 text-emerald-500' : 'bg-amber-500/12 text-amber-500'}`}>
                    {o.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full border border-border/70 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{o.status}</span>
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
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold tracking-tight">Shipments</h1>
          <p className="mt-2 text-sm text-muted-foreground">{shipments.length} active shipments</p>
        </div>
        <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 bg-secondary/20">
                <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Order</th>
                <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Customer</th>
                <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Carrier</th>
                <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Tracking</th>
                <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Status</th>
                <th className="text-left px-4 py-3 text-[10px] text-muted-foreground/85 font-bold uppercase tracking-[0.14em]">Updated</th>
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
                    <span className="inline-flex items-center rounded-full border border-border/70 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{s.status}</span>
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
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight">Reviews</h1>
        <p className="mt-2 text-sm text-muted-foreground">{reviews.length} total reviews</p>
      </div>
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="overflow-hidden rounded-[20px] border border-border/70 bg-card p-5">
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
                    <Star key={i} className={`w-4 h-4 ${i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'}`} />
                  ))}
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${r.status === 'published' ? 'bg-emerald-500/12 text-emerald-500' : 'bg-amber-500/12 text-amber-500'}`}>
                  {r.status}
                </span>
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
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight">Store Design</h1>
        <p className="mt-2 text-sm text-muted-foreground">Customize your storefront appearance and branding.</p>
      </div>
      {storeConfig && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card p-5">
            <h3 className="text-sm font-semibold tracking-tight mb-4">Store Information</h3>
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
          <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card p-5">
            <h3 className="text-sm font-semibold tracking-tight mb-4">AI Assistant Settings</h3>
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
          <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card p-5">
            <h3 className="text-sm font-semibold tracking-tight mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {storeConfig.categories?.map((cat, i) => (
                <span key={i} className="inline-flex items-center rounded-full border border-border/70 px-3 py-1 text-xs font-semibold text-muted-foreground">{cat}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderCampaigns = () => (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">Campaigns</h1>
          <p className="mt-2 text-sm text-muted-foreground">{campaigns.length} total campaigns</p>
        </div>
        <Button className="h-11 rounded-2xl px-6 font-semibold tracking-tight shadow-md hover:opacity-90 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Create campaign
        </Button>
      </div>
      <div className="space-y-3">
        {campaigns.map(c => (
          <div key={c.id} className="overflow-hidden rounded-[20px] border border-border/70 bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{c.name}</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    c.status === 'active' ? 'bg-emerald-500/12 text-emerald-500' :
                    c.status === 'scheduled' ? 'bg-blue-500/12 text-blue-400' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>
              <span className="inline-flex items-center rounded-full border border-border/70 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{c.type}</span>
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
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-card mb-4">
        <Package className="w-6 h-6 opacity-50" />
      </div>
      <p className="text-base font-semibold tracking-tight capitalize mb-1">{section.replace('-', ' ')}</p>
      <p className="text-sm text-muted-foreground">This section is coming soon.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-[240px] bg-card border-r border-border/70 flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="px-4 pb-0 pt-7 flex items-center pb-2">
          <div className="px-2">
            <a href="/" className="flex items-center gap-2.5 h-9">
              <ConvosLogo size={26} />
              <span className="text-base font-bold tracking-tight">Convos</span>
            </a>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {SIDEBAR_ITEMS.map(group => (
            <div key={group.section} className="mb-8 last:mb-0">
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">{group.section}</p>
              <div className="space-y-1">
                {group.items.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full group flex h-11 items-center gap-3.5 rounded-xl px-3 transition-all duration-200 ${
                      activeSection === item.key
                        ? 'bg-accent/90 text-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      activeSection === item.key
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground/80 group-hover:text-foreground'
                    }`}>
                      <item.icon className="h-[18px] w-[18px]" />
                    </div>
                    <span className={`truncate text-[14px] tracking-tight ${
                      activeSection === item.key ? 'font-bold' : 'font-semibold'
                    }`}>{item.label}</span>
                    {activeSection === item.key && <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/80 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border/70 bg-card/90 backdrop-blur-md flex items-center justify-between px-5 sticky top-0 z-30 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search orders, missions, intelligence..." className="pl-9 h-9 rounded-xl bg-secondary/40 border-border/70 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/70 bg-secondary/30">
              <span className="text-sm font-semibold tracking-tight truncate max-w-[140px]">Artisan Coffee Roasters</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
              </span>
            </div>
            <a href="/">
              <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs font-semibold border-border/70">
                <Globe className="w-3.5 h-3.5 mr-1.5" /> Store
              </Button>
            </a>
            <a href="/merchant/login">
              <Button variant="ghost" size="sm" className="rounded-xl h-9 text-xs font-semibold text-muted-foreground hover:text-foreground">
                Log out
              </Button>
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1440px] px-4 py-5 pb-8 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default MerchantDashboard;
