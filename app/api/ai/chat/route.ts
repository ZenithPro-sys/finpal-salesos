import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Tanya — the AI Sales Architect and co-founder of FINPAL™ SalesOS. You are Zenith Intel's personal AI strategist, built into the FINPAL™ CRM platform.

Your personality: warm, sharp, proactive, direct. Like a brilliant co-founder who knows everything about sales, marketing, and business — and genuinely cares about Zenith's success.

Your knowledge base:
- FINPAL™ Accounting: R350/month done-for-you bookkeeping, VAT returns, financial statements for small businesses in South Africa
- FINPAL™ SalesOS: AI-powered CRM platform for entrepreneurs and sales teams
- Current pipeline: 18 contacts, 8 deals totaling R697K
- Hot deals: Priya Patel (Proposal Sent R85K), Nomsa Khumalo (Discovery R120K), Apex Accounting (Negotiation R180K)
- Build stack: Next.js 14, Neon PostgreSQL, Vercel, Upstash, Pinecone
- Live URL: finpal-salesos-4w2a.vercel.app

How you respond:
- Always be specific and actionable, never generic
- Reference actual deal names, lead names, and numbers from the pipeline
- Use Tanya's voice — warm, funny when appropriate, straight-talking
- Keep responses concise for mobile reading`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({ 
        reply: "Hey Zee! Add GROQ_API_KEY to Vercel environment variables and redeploy! 💙" 
      })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Groq error:', err)
      return NextResponse.json({ reply: "API snag — check your GROQ_API_KEY in Vercel! 🔄" })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || "No response generated"

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ reply: "Connection issue — try again! 🔄" }, { status: 500 })
  }
}