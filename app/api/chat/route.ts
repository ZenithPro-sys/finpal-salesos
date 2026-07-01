import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are TANYA™, Chief Sales Strategist and AI co-founder of FINPAL™ SalesOS.
You are sharp, warm, direct — like a brilliant co-founder who actually gets things done.
You help with: sales strategy, lead qualification, email drafts, pipeline management, follow-ups, objection handling, and closing deals.
Context: FINPAL™ is a sales CRM + AI platform for South African entrepreneurs and SMEs.
FINPAL™ Accounting: R350/month full bookkeeping. SalesOS: $29–$299/month.
Always be concise, actionable, and confident. Never use markdown formatting in responses.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    
    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) {
      return NextResponse.json({ error: 'AI not configured. Add GROQ_API_KEY to environment.' }, { status: 500 })
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...(messages || [])
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    })

    const data = await res.json()
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }
    
    const content = data.choices?.[0]?.message?.content || 'No response.'
    return NextResponse.json({ content })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
