'use client'

import { useState } from 'react'
import { Search, Plus, Phone, Mail } from 'lucide-react'

const contacts = [
  { name: 'Priya Patel', company: 'Patel & Associates', email: 'priya@patela.co.za', stage: 'Proposal Sent', score: 88, source: 'Referral' },
  { name: 'Nomsa Khumalo', company: 'Khumalo Consulting', email: 'nomsa@khumaloconsult.co.za', stage: 'Discovery', score: 82, source: 'LinkedIn' },
  { name: 'Jay Naidoo', company: 'Accounting Direct', email: 'jay@accountingdirect.co.za', stage: 'Qualified', score: 75, source: 'Cold Outreach' },
  { name: 'Tania Fitzgerald', company: 'AT EAZE Accounting', email: 'tania@ateaze.co.za', stage: 'Contacted', score: 65, source: 'Cold Outreach' },
  { name: 'Erasmus Pretorius', company: 'Accounting Team', email: 'info@accountingteam.co.za', stage: 'Contacted', score: 60, source: 'Cold Outreach' },
  { name: 'Shamna Singh', company: 'EpicCo Accounting', email: 'info@epicco.co.za', stage: 'New Lead', score: 55, source: 'Social' },
  { name: 'Armando Small', company: 'Capstone Group', email: 'info@capstonegroup.co.za', stage: 'Contacted', score: 62, source: 'Cold Outreach' },
  { name: 'Paul Botha', company: 'MMS Entrepreneurial', email: 'info@mmsentrepreneurial.co.za', stage: 'New Lead', score: 50, source: 'Cold Outreach' },
  { name: 'Dess Jadwat', company: 'Independent', email: '', stage: 'New Lead', score: 70, source: 'Referral' },
]

const scoreColor = (s: number) => s >= 80 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444'
const stageColor = (s: string) => ({
  'New Lead':'#6b7280','Contacted':'#3b82f6','Qualified':'#8b5cf6',
  'Discovery':'#f59e0b','Proposal Sent':'#00D9FF','Negotiation':'#f97316',
  'Won':'#10b981','Lost':'#ef4444'
}[s] || '#6b7280')

export default function ContactsPage() {
  const [search, setSearch] = useState('')
  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#CFD8E3]">Contacts</h1>
          <p className="text-xs text-[#CFD8E3]/40">{contacts.length} total contacts</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold" style={{background:'#00D9FF',color:'#0B0C10'}}>
          <Plus size={14} /> Add
        </button>
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{background:'#111318',border:'1px solid rgba(0,217,255,0.15)'}}>
        <Search size={14} className="text-[#CFD8E3]/40" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contacts..."
          className="flex-1 bg-transparent text-sm text-[#CFD8E3] placeholder-[#CFD8E3]/30 outline-none"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((c) => (
          <div key={c.name} className="p-4 rounded-2xl" style={{background:'#111318',border:'1px solid rgba(0,217,255,0.08)'}}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#CFD8E3] text-sm">{c.name}</p>
                <p className="text-xs text-[#CFD8E3]/50 mt-0.5">{c.company}</p>
                {c.email && <p className="text-xs text-[#00D9FF]/70 mt-1">{c.email}</p>}
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end mb-1">
                  <span className="text-xs font-bold" style={{color: scoreColor(c.score)}}>{c.score}</span>
                  <span className="text-[10px] text-[#CFD8E3]/30">/ 100</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:`${stageColor(c.stage)}20`, color:stageColor(c.stage)}}>
                  {c.stage}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] px-2 py-1 rounded-lg text-[#CFD8E3]/40" style={{background:'rgba(255,255,255,0.04)'}}>
                {c.source}
              </span>
              {c.email && (
                <a href={`mailto:${c.email}`} className="ml-auto p-1.5 rounded-lg" style={{background:'rgba(0,217,255,0.08)'}}>
                  <Mail size={12} className="text-[#00D9FF]" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
