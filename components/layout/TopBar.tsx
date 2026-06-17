'use client'

import { Bell, Search, Plus } from 'lucide-react'

export default function TopBar() {
  return (
    <header className="h-14 flex items-center gap-4 px-6 border-b border-[#00D9FF]/10 bg-[#0D0E13] shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md px-3 py-1.5 rounded-xl bg-[#111318] border border-[#00D9FF]/15 text-[#CFD8E3]/50 hover:border-[#00D9FF]/30 transition cursor-text">
        <Search size={14} />
        <span className="text-sm">Search contacts, deals...</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Add button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00D9FF] text-[#0B0C10] text-sm font-semibold hover:opacity-90 transition">
          <Plus size={14} />
          New
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-[#111318] text-[#CFD8E3]/60 hover:text-[#00D9FF] transition">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#00D9FF]/20 border border-[#00D9FF]/30 flex items-center justify-center text-sm font-bold text-[#00D9FF]">
          Z
        </div>
      </div>
    </header>
  )
}
