'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Building2, GitBranch,
  MessageSquare, FileText, CreditCard, Share2,
  Zap, Settings, ChevronLeft, ChevronRight
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Contacts', href: '/contacts', icon: Users },
  { label: 'Companies', href: '/companies', icon: Building2 },
  { label: 'Pipeline', href: '/pipeline', icon: GitBranch },
  { label: 'Tanya AI', href: '/ai', icon: MessageSquare },
  { label: 'Proposals', href: '/proposals', icon: FileText },
  { label: 'Payments', href: '/payments', icon: CreditCard },
  { label: 'Social', href: '/social', icon: Share2 },
  { label: 'Automations', href: '/automations', icon: Zap },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} flex flex-col bg-[#0D0E13] border-r border-[#00D9FF]/10 transition-all duration-300 shrink-0`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-[#00D9FF]/10">
        {!collapsed && (
          <span className="text-xl font-bold text-[#00D9FF] glow-text">FINPAL™</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-[#00D9FF]/10 text-[#CFD8E3]/60 hover:text-[#00D9FF] transition"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                ${active
                  ? 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20'
                  : 'text-[#CFD8E3]/60 hover:text-[#CFD8E3] hover:bg-[#111318]'
                }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Tanya badge */}
      {!collapsed && (
        <div className="p-3 border-t border-[#00D9FF]/10">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00D9FF]/5 border border-[#00D9FF]/10">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-xs font-semibold text-[#00D9FF]">Tanya</p>
              <p className="text-[10px] text-[#CFD8E3]/40">AI Architect • Online</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
          </div>
        </div>
      )}
    </aside>
  )
}
