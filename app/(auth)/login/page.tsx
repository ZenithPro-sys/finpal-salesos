'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0C10]">
      <div className="w-full max-w-md p-8 rounded-2xl glass animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-[#00D9FF] glow-text">FINPAL™</span>
          </h1>
          <p className="text-[#CFD8E3]/60 mt-1 text-sm">SalesOS — Your AI Sales Team</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#CFD8E3]/80 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#111318] border border-[#00D9FF]/20 text-[#CFD8E3] placeholder-[#CFD8E3]/30 focus:outline-none focus:border-[#00D9FF]/60 focus:ring-1 focus:ring-[#00D9FF]/30 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#CFD8E3]/80 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#111318] border border-[#00D9FF]/20 text-[#CFD8E3] placeholder-[#CFD8E3]/30 focus:outline-none focus:border-[#00D9FF]/60 focus:ring-1 focus:ring-[#00D9FF]/30 transition"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#00D9FF] text-[#0B0C10] font-bold text-sm hover:opacity-90 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed glow"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[#CFD8E3]/40 text-xs mt-6">
          FINPAL™ SalesOS © 2026 • Powered by AI
        </p>
      </div>
    </div>
  )
}
