import { Users, TrendingUp, DollarSign, Target, ArrowUpRight } from 'lucide-react'

const stats = [
  { label: 'Total Contacts', value: '18', icon: Users, change: '+3 this week', color: '#00D9FF' },
  { label: 'Pipeline Value', value: 'R697K', icon: TrendingUp, change: '+R120K this month', color: '#10b981' },
  { label: 'Revenue Won', value: 'R84K', icon: DollarSign, change: '2 deals closed', color: '#f59e0b' },
  { label: 'Avg Lead Score', value: '74', icon: Target, change: '↑ 8pts this week', color: '#8b5cf6' },
]

const recentDeals = [
  { name: 'Zenith Corp Retainer', contact: 'Priya Patel', value: 'R85,000', stage: 'Proposal Sent', days: 3 },
  { name: 'FINPAL™ Accounting Setup', contact: 'Jay Naidoo', value: 'R4,200', stage: 'Qualified', days: 5 },
  { name: 'SalesOS Enterprise', contact: 'Nomsa Khumalo', value: 'R120,000', stage: 'Discovery', days: 1 },
  { name: 'Bookkeeping Annual', contact: 'Tania Fitzgerald', value: 'R42,000', stage: 'Negotiation', days: 7 },
]

const stageColors: Record<string, string> = {
  'New Lead': '#6b7280',
  'Contacted': '#3b82f6',
  'Qualified': '#8b5cf6',
  'Discovery': '#f59e0b',
  'Proposal Sent': '#00D9FF',
  'Negotiation': '#f97316',
  'Won': '#10b981',
  'Lost': '#ef4444',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#CFD8E3]">
            Good morning, <span className="text-[#00D9FF]">Zenith</span> 👋
          </h1>
          <p className="text-[#CFD8E3]/50 text-sm mt-0.5">Wednesday, 18 June 2026 • FINPAL™ SalesOS</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl p-4" style={{background:'#111318', border:'1px solid rgba(0,217,255,0.1)'}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#CFD8E3]/50 text-xs">{stat.label}</span>
                <div className="p-1.5 rounded-lg" style={{ background: `${stat.color}18` }}>
                  <Icon size={14} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-xl font-bold text-[#CFD8E3]">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: stat.color }}>{stat.change}</p>
            </div>
          )
        })}
      </div>

      {/* Tanya AI Banner */}
      <div className="rounded-2xl p-4 flex items-center gap-4" style={{background:'linear-gradient(135deg, #111318, #0d1117)', border:'1px solid rgba(0,217,255,0.2)'}}>
        <span className="text-3xl">🤖</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#00D9FF] text-sm">Tanya is watching your pipeline</p>
          <p className="text-xs text-[#CFD8E3]/50 mt-0.5 truncate">8 emails sent • Follow-up due Friday • 0 replies yet</p>
        </div>
        <a href="/ai" className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold" style={{background:'#00D9FF', color:'#0B0C10'}}>
          Chat
        </a>
      </div>

      {/* Recent Deals */}
      <div className="rounded-2xl p-5" style={{background:'#111318', border:'1px solid rgba(0,217,255,0.1)'}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#CFD8E3]">Active Deals</h2>
          <a href="/pipeline" className="text-xs text-[#00D9FF] flex items-center gap-1">
            View all <ArrowUpRight size={12} />
          </a>
        </div>
        <div className="space-y-3">
          {recentDeals.map((deal) => (
            <div key={deal.name} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'rgba(0,217,255,0.03)', border:'1px solid rgba(0,217,255,0.06)'}}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#CFD8E3] truncate">{deal.name}</p>
                <p className="text-xs text-[#CFD8E3]/40 mt-0.5">{deal.contact} • {deal.days}d ago</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-[#00D9FF]">{deal.value}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background: `${stageColors[deal.stage]}20`, color: stageColors[deal.stage]}}>
                  {deal.stage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Contacts', emoji: '👥', href: '/contacts' },
          { label: 'Pipeline', emoji: '📊', href: '/pipeline' },
          { label: 'Tanya AI', emoji: '🤖', href: '/ai' },
          { label: 'Tasks', emoji: '✅', href: '/tasks' },
        ].map(action => (
          <a key={action.label} href={action.href}
            className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition"
            style={{background:'#111318', border:'1px solid rgba(0,217,255,0.1)'}}>
            <span className="text-xl">{action.emoji}</span>
            <span className="text-[10px] text-[#CFD8E3]/60">{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
