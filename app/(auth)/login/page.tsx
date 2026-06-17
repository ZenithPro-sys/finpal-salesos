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
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0C10] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl" style={{background:'rgba(17,19,24,0.9)', border:'1px solid rgba(0,217,255,0.15)'}}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00D9FF]">FINPAL™</h1>
          <p className="text-[#CFD8E3]/60 mt-1 text-sm">SalesOS — Your AI Sales Team</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#CFD8E3]/80 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#0B0C10] border border-[#00D9FF]/20 text-[#CFD8E3] placeholder-[#CFD8E3]/30 focus:outline-none focus:border-[#00D9FF]/60 transition"
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
              className="w-full px-4 py-3 rounded-xl bg-[#0B0C10] border border-[#00D9FF]/20 text-[#CFD8E3] placeholder-[#CFD8E3]/30 focus:outline-none focus:border-[#00D9FF]/60 transition"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-3 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
            style={{background:'#00D9FF', color:'#0B0C10'}}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-[#CFD8E3]/30 text-xs mt-6">
          FINPAL™ SalesOS © 2026 • Powered by AI
        </p>
      </div>
    </div>
  )
}
