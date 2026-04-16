'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Zap, Radio, Shield, Target, Package, TrendingUp, Users, MessageSquare,
  ShoppingCart, DollarSign, Activity, Eye, ArrowRight, Search, Tag,
  CreditCard, CheckCircle, Clock, AlertTriangle, BarChart3, Globe
} from 'lucide-react'

const INTENT_ICONS = {
  search: Search, negotiate: Tag, mission_create: Target, add_to_cart: ShoppingCart,
  checkout: CreditCard, message: MessageSquare, approval_needed: AlertTriangle
}
const INTENT_COLORS = {
  search: 'text-blue-400 bg-blue-500/10', negotiate: 'text-amber-400 bg-amber-500/10',
  mission_create: 'text-indigo-400 bg-indigo-500/10', add_to_cart: 'text-emerald-400 bg-emerald-500/10',
  checkout: 'text-green-400 bg-green-500/10', message: 'text-slate-400 bg-slate-500/10',
  approval_needed: 'text-red-400 bg-red-500/10'
}

function IntentItem({ intent }) {
  const Icon = INTENT_ICONS[intent.type] || Activity
  const colorClass = INTENT_COLORS[intent.type] || 'text-slate-400 bg-slate-500/10'
  const time = new Date(intent.timestamp)
  const timeAgo = getTimeAgo(time)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 py-3 px-4 hover:bg-white/[0.02] transition-colors border-b border-border/30"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{intent.description}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
          <Badge variant="outline" className={`text-[10px] border-0 ${colorClass}`}>{intent.type}</Badge>
          <span className="text-[10px] text-muted-foreground font-mono">{intent.session_id?.slice(0, 8)}</span>
        </div>
      </div>
      {intent.type === 'negotiate' && intent.metadata?.final && (
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold text-amber-400">${intent.metadata.final}</p>
          <p className="text-[10px] text-muted-foreground">final price</p>
        </div>
      )}
      {intent.type === 'checkout' && intent.metadata?.total && (
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold text-emerald-400">${intent.metadata.total.toFixed(2)}</p>
          <p className="text-[10px] text-muted-foreground">order value</p>
        </div>
      )}
    </motion.div>
  )
}

function ConsumerCard({ profile }) {
  const trustColor = profile.trust_score >= 80 ? 'text-emerald-400' : profile.trust_score >= 60 ? 'text-amber-400' : 'text-red-400'
  const riskBadge = {
    low: { color: 'bg-emerald-500/10 text-emerald-400', label: 'Low Risk' },
    medium: { color: 'bg-amber-500/10 text-amber-400', label: 'Medium' },
    high: { color: 'bg-red-500/10 text-red-400', label: 'High Risk' }
  }[profile.risk_level] || { color: 'bg-slate-500/10 text-slate-400', label: 'Unknown' }

  return (
    <div className="glass-card rounded-xl p-4 hover:border-indigo-500/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium font-mono">{profile.session_id?.slice(0, 12)}...</p>
            <p className="text-[10px] text-muted-foreground">{profile.interactions || 0} interactions</p>
          </div>
        </div>
        <Badge className={`text-[10px] border-0 ${riskBadge.color}`}>{riskBadge.label}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground">Trust Score</p>
          <p className={`text-lg font-bold ${trustColor}`}>{profile.trust_score || 80}</p>
          <Progress value={profile.trust_score || 80} className="h-1 mt-1" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Total Spent</p>
          <p className="text-lg font-bold text-foreground">${(profile.total_spent || 0).toFixed(0)}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Orders</p>
          <p className="text-lg font-bold text-foreground">{profile.total_orders || 0}</p>
        </div>
      </div>
    </div>
  )
}

function MissionMonitor({ mission }) {
  return (
    <div className="glass-card rounded-xl p-4 hover:border-indigo-500/20 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <Badge variant="outline" className={`text-[10px] ${mission.status === 'active' ? 'border-indigo-500/30 text-indigo-400' : 'border-emerald-500/30 text-emerald-400'}`}>
            {mission.status}
          </Badge>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">{mission.session_id?.slice(0, 8)}</span>
      </div>
      <p className="text-sm font-medium mb-2">{mission.goal}</p>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Progress value={mission.progress || 0} className="h-1.5" />
        </div>
        <span className="text-xs text-muted-foreground">{mission.progress || 0}%</span>
      </div>
      {mission.budget_max && (
        <p className="text-xs text-muted-foreground mt-2"><DollarSign className="w-3 h-3 inline" /> Budget: ${mission.budget_max}</p>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, change, color = 'text-indigo-400' }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        {change && <span className="text-[10px] text-emerald-400">+{change}</span>}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function MerchantDashboard() {
  const [stats, setStats] = useState(null)
  const [intents, setIntents] = useState([])
  const [profiles, setProfiles] = useState([])
  const [missions, setMissions] = useState([])
  const [activeTab, setActiveTab] = useState('intent-stream')
  const [isLive, setIsLive] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, intentsRes, profilesRes, missionsRes] = await Promise.all([
        fetch('/api/stats'), fetch('/api/intents?limit=50'),
        fetch('/api/consumer-matrix'), fetch('/api/missions')
      ])
      const [s, i, p, m] = await Promise.all([statsRes.json(), intentsRes.json(), profilesRes.json(), missionsRes.json()])
      if (s && !s.error) setStats(s)
      if (Array.isArray(i)) setIntents(i)
      if (Array.isArray(p)) setProfiles(p)
      if (Array.isArray(m)) setMissions(m)
    } catch (e) {
      console.error('Fetch error:', e)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 glass-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Convos</span>
            </a>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm text-muted-foreground">Command Center</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-xs text-muted-foreground">{isLive ? 'Live' : 'Paused'}</span>
            </div>
            <a href="/">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                <Globe className="w-3.5 h-3.5 mr-1.5" /> Storefront
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="pt-14 max-w-7xl mx-auto px-4">
        {/* Stats */}
        <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Active Buyers" value={stats?.totalBuyers || 0} color="text-indigo-400" />
          <StatCard icon={Target} label="Active Missions" value={stats?.activeMissions || 0} color="text-amber-400" />
          <StatCard icon={Activity} label="Events (1hr)" value={stats?.recentIntents || 0} change={stats?.recentIntents} color="text-emerald-400" />
          <StatCard icon={Shield} label="Avg Trust Score" value={stats?.avgTrustScore || 80} color="text-cyan-400" />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card border border-border/50 mb-4">
            <TabsTrigger value="intent-stream" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs">
              <Radio className="w-3.5 h-3.5 mr-1.5" /> Intent Stream
            </TabsTrigger>
            <TabsTrigger value="consumer-matrix" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs">
              <Shield className="w-3.5 h-3.5 mr-1.5" /> Consumer Matrix
            </TabsTrigger>
            <TabsTrigger value="missions" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs">
              <Target className="w-3.5 h-3.5 mr-1.5" /> Missions
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs">
              <Package className="w-3.5 h-3.5 mr-1.5" /> Products
            </TabsTrigger>
          </TabsList>

          {/* Intent Stream */}
          <TabsContent value="intent-stream">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold">Live Intent Stream</h3>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">{intents.length} events</Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400">Streaming</span>
                </div>
              </div>
              <ScrollArea className="h-[500px]">
                {intents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Radio className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No events yet. Buyer activity will appear here in real-time.</p>
                    <p className="text-xs mt-1">Open the storefront and start chatting to see events flow.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {intents.map(intent => <IntentItem key={intent.id} intent={intent} />)}
                  </AnimatePresence>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Consumer Matrix */}
          <TabsContent value="consumer-matrix">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold">Consumer Matrix</h3>
              <Badge variant="outline" className="text-[10px]">{profiles.length} profiles</Badge>
            </div>
            {profiles.length === 0 ? (
              <div className="glass-card rounded-xl text-center py-12 text-muted-foreground">
                <Shield className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No consumer profiles yet. They appear as buyers interact with AI.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profiles.map(p => <ConsumerCard key={p.id || p.session_id} profile={p} />)}
              </div>
            )}
          </TabsContent>

          {/* Missions */}
          <TabsContent value="missions">
            <div className="mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold">Active Missions</h3>
              <Badge variant="outline" className="text-[10px]">{missions.length} total</Badge>
            </div>
            {missions.length === 0 ? (
              <div className="glass-card rounded-xl text-center py-12 text-muted-foreground">
                <Target className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No missions yet. Buyers create missions through conversation.</p>
                <p className="text-xs mt-1">Try: "Find me a gift under $50 by Friday"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {missions.map(m => <MissionMonitor key={m.id} mission={m} />)}
              </div>
            )}
          </TabsContent>

          {/* Products */}
          <TabsContent value="products">
            <div className="mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold">Product Catalog</h3>
              <Badge variant="outline" className="text-[10px]">{stats?.totalProducts || 0} products</Badge>
            </div>
            <ProductsTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function ProductsTable() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setProducts(data)
    }).catch(() => {})
  }, [])

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Product</th>
              <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Category</th>
              <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Price</th>
              <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Min Price</th>
              <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Stock</th>
              <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">Bargain</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-border/20 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-md object-cover" />
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{p.category}</Badge></td>
                <td className="px-4 py-3 text-right text-indigo-400 font-semibold">${p.price}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">${p.bargain_min_price}</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3 text-center">
                  {p.bargain_enabled ? (
                    <Badge className="text-[10px] bg-emerald-500/10 text-emerald-400 border-0">Active</Badge>
                  ) : (
                    <Badge className="text-[10px] bg-slate-500/10 text-slate-400 border-0">Off</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MerchantDashboard;
