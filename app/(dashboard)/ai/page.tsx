'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hey Zenith! I'm Tanya, your AI Sales Architect 🤖 I've got full visibility on your pipeline, leads, and outreach. Ask me anything — lead qualification, email drafts, deal strategy, or what to prioritize today. What's on your mind?"
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "I'm thinking on that — try again in a moment!" }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection issue — I'll be back in a second! 🔄" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 p-4 rounded-2xl" style={{background:'#111318',border:'1px solid rgba(0,217,255,0.15)'}}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{background:'rgba(0,217,255,0.1)'}}>🤖</div>
        <div>
          <p className="font-bold text-[#00D9FF]">Tanya — SalesPal™ AI</p>
          <p className="text-xs text-[#CFD8E3]/40">AI Sales Architect • Always online</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
              style={m.role === 'user'
                ? {background:'#00D9FF', color:'#0B0C10', borderRadius:'18px 4px 18px 18px'}
                : {background:'#111318', color:'#CFD8E3', border:'1px solid rgba(0,217,255,0.1)', borderRadius:'4px 18px 18px 18px'}
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl text-sm" style={{background:'#111318',border:'1px solid rgba(0,217,255,0.1)'}}>
              <span className="text-[#00D9FF] animate-pulse">Tanya is typing...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask Tanya anything..."
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none text-[#CFD8E3] placeholder-[#CFD8E3]/30"
          style={{background:'#111318', border:'1px solid rgba(0,217,255,0.2)'}}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="w-12 h-12 rounded-xl flex items-center justify-center transition disabled:opacity-40"
          style={{background:'#00D9FF'}}
        >
          <Send size={16} style={{color:'#0B0C10'}} />
        </button>
      </div>
    </div>
  )
}
