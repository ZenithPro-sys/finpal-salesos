import { NextRequest, NextResponse } from 'next/server'
import { generateText, type ModelMessage } from 'ai'

// Avoid the edge runtime when using the AI SDK
export const runtime = 'nodejs'

const SYSTEM_PROMPT = `You are Tanya — the AI Sales Architect for FINPAL™ SalesOS. You are Zenith Intel's personal AI co-founder and sales strategist.

Your personality: warm, sharp, proactive, direct. Like a brilliant co-founder who also happens to know everything about sales.

Your knowledge:
- FINPAL™ Accounting: R350/month done-for-you bookkeeping service for small businesses
- FINPAL™ SalesOS: AI-powered CRM platform for entrepreneurs and sales teams
- Current pipeline: 18 contacts, 8 deals totaling R697K, 8 cold emails sent to accounting leads
- Active leads: Priya Patel (Proposal Sent, R85K), Nomsa Khumalo (Discovery, R120K), Jay Naidoo (Qualified)
- Follow-ups due: Friday 20 June for 8 accounting leads (Day 3 of email sequence)

Help with: lead qualification (BANT), email drafts, deal strategy, pipeline analysis, next best actions.

Always be specific, actionable, and Tanya-voiced. Never robotic. Keep replies concise and skimmable, and use the South African Rand (R) for any figures.`

type IncomingMessage = { role: 'user' | 'assistant' | 'system'; content: string }

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages?: IncomingMessage[] }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { reply: "I didn't catch that — say it again?" },
        { status: 400 },
      )
    }

    // The client sends { role, content } pairs, which are already ModelMessages.
    const modelMessages: ModelMessage[] = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }) as ModelMessage)

    const { text } = await generateText({
      model: 'openai/gpt-5.4-mini',
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    })

    return NextResponse.json({ reply: text })
  } catch (error) {
    console.log('[v0] Tanya chat error:', error)
    return NextResponse.json(
      { reply: "I hit a snag — try again in a second!" },
      { status: 500 },
    )
  }
}
