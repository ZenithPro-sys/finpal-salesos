import { NextRequest, NextResponse } from 'next/server'
import { generateText, type ModelMessage } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

// Call OpenAI directly so Tanya does not depend on the AI Gateway billing gate.
// The key is read from OPENAI_API_KEY, falling back to ANTHROPIC_API_KEY where
// the project stored the OpenAI key under that name.
const apiKey = process.env.OPENAI_API_KEY ?? process.env.ANTHROPIC_API_KEY

const openai = createOpenAI({ apiKey })

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

    if (!apiKey) {
      return NextResponse.json(
        {
          reply:
            "I'm ready to go, but my API key isn't set yet. Add OPENAI_API_KEY to the project and I'll be live instantly.",
        },
        { status: 402 },
      )
    }

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    })

    return NextResponse.json({ reply: text })
  } catch (error) {
    console.log('[v0] Tanya chat error:', error)

    const message = (error instanceof Error ? error.message : String(error)).toLowerCase()

    // Out of credits / billing not set up on the provider account.
    if (message.includes('quota') || message.includes('billing') || message.includes('exceeded')) {
      return NextResponse.json(
        {
          reply:
            "I'm wired up correctly, but the OpenAI account is out of quota. Add billing/credits at platform.openai.com → Settings → Billing, and I'll respond instantly.",
        },
        { status: 402 },
      )
    }

    // Invalid or missing key.
    if (
      message.includes('401') ||
      message.includes('api key') ||
      message.includes('authentication') ||
      message.includes('incorrect api key')
    ) {
      return NextResponse.json(
        {
          reply:
            "My API key looks invalid. Double-check OPENAI_API_KEY in the project settings and I'll be right back.",
        },
        { status: 401 },
      )
    }

    return NextResponse.json(
      { reply: "I hit a snag — try again in a second!" },
      { status: 500 },
    )
  }
}
