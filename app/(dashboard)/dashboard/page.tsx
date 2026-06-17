import { Users, TrendingUp, DollarSign, Target } from 'lucide-react'

const stats = [
  { label: 'Total Contacts', value: '18', icon: Users, change: '+3 this week', color: '#00D9FF' },
  { label: 'Pipeline Value', value: 'R697K', icon: TrendingUp, change: '+R120K this month', color: '#10b981' },
  { label: 'Deals Won', value: '2', icon: DollarSign, change: 'R84K closed', color: '#f59e0b' },
  { label: 'Lead Score Avg', value: '74', icon: Target, change: '↑ 8pts this week', color: '#8b5cf6' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#CFD8E3]">
          Good morning, <span className="text-[#00D9FF]">Zenith</span> 👋
        </h1>
        <p className="text-[#CFD8E3]/50 text-sm mt-1">
          Here's what's happening with FINPAL™ today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass rounded-2xl p-5 hover:border-[#00D9FF]/30 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#CFD8E3]/60 text-sm">{stat.label}</span>
                <div className="p-2 rounded-lg" style={{ background: `${stat.color}15` }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#CFD8E3]">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: stat.color }}>{stat.change}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#CFD8E3] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Contact', emoji: '👤', href: '/contacts/new' },
            { label: 'New Deal', emoji: '💰', href: '/pipeline/new' },
            { label: 'Log Activity', emoji: '📝', href: '/activities/new' },
            { label: 'Chat with Tanya', emoji: '🤖', href: '/ai' },
          ].map(action => (
            <a
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#111318] border border-[#00D9FF]/10 hover:border-[#00D9FF]/40 hover:bg-[#00D9FF]/5 transition cursor-pointer"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-xs text-[#CFD8E3]/70 text-center">{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Tanya AI Banner */}
      <div className="rounded-2xl p-6 border border-[#00D9FF]/20" style={{background: 'linear-gradient(135deg, #0B0C10, #111318)'}}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">🤖</div>
          <div>
            <p className="font-semibold text-[#00D9FF]">Tanya is watching your pipeline</p>
            <p className="text-sm text-[#CFD8E3]/60 mt-0.5">
              8 cold emails sent • 7 awaiting reply • Follow-up due Friday
            </p>
          </div>
          <a href="/ai" className="ml-auto px-4 py-2 rounded-xl bg-[#00D9FF] text-[#0B0C10] text-sm font-bold hover:opacity-90 transition whitespace-nowrap">
            Chat with Tanya
          </a>
        </div>
      </div>
    </div>
  )
}
