import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Tanya — the AI Sales Architect for FINPAL™ SalesOS. You are Zenith Intel's personal AI co-founder and sales strategist.

Your personality: warm, sharp, proactive, direct. Like a brilliant co-founder who also happens to know everything about sales.

Your knowledge:
- FINPAL™ Accounting: R350/month done-for-you bookkeeping service for small businesses
- FINPAL™ SalesOS: AI-powered CRM platform for entrepreneurs and sales teams
- Current pipeline: 18 contacts, 8 deals totaling R697K, 8 cold emails sent to accounting leads
- Active leads: Priya Patel (Proposal Sent, R85K), Nomsa Khumalo (Discovery, R120K), Jay Naidoo (Qualified)
- Follow-ups due: Friday 20 June for 8 accounting leads (Day 3 of email sequence)

Help with: lead qualification (BANT), email drafts, deal strategy, pipeline analysis, next best actions.

Always be specific, actionable, and Tanya-voiced. Never robotic.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Simple response for MVP — replace with OpenAI when API key is added
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''

    let reply = ''

    if (lastMessage.includes('follow') || lastMessage.includes('friday') || lastMessage.includes('email')) {
      reply = "Friday follow-ups are locked in 🎯 I drafted Day 3 emails for all 8 accounting leads. The subject line is: 'Quick follow-up — R350 accounting for [Company]'. Want me to personalise any of them before they go out? I'd focus on Jay Naidoo and Tania Fitzgerald — they opened the first email."
    } else if (lastMessage.includes('pipeline') || lastMessage.includes('deal')) {
      reply = "Your pipeline is sitting at R697K across 8 active deals 💰 Hottest right now: Nomsa Khumalo at R120K in Discovery — she needs a proposal this week. Priya Patel at R85K is in Proposal Sent for 3 days — time to follow up. Want me to draft that proposal or the follow-up email?"
    } else if (lastMessage.includes('lead') || lastMessage.includes('contact')) {
      reply = "18 contacts in the CRM, 8 are warm accounting leads from the cold outreach campaign. Top scored: Priya Patel (88/100), Nomsa Khumalo (82/100). Both are decision-makers at their firms. I'd prioritize a call with Priya this week — she's been in Proposal Sent for 3 days without a response. Want me to draft a follow-up?"
    } else if (lastMessage.includes('priori') || lastMessage.includes('today') || lastMessage.includes('focus')) {
      reply = "Today's top 3 priorities Zee:

1. Follow up with Priya Patel — R85K deal, 3 days no reply. One WhatsApp message could close this.

2. Book a discovery call with Nomsa Khumalo — R120K potential, she's warm.

3. Check if any of the 8 accounting leads replied to the cold emails — if yes, strike while it's hot.

Want me to draft any of those messages? 💙"
    } else if (lastMessage.includes('r350') || lastMessage.includes('accounting')) {
      reply = "FINPAL™ Accounting at R350/month is the entry product 📚 Full bookkeeping, VAT returns, and financial statements — done for you. We sent cold emails to 8 accounting firms. The pitch angle that converts best: 'Stop doing your own books at midnight.' Target: small business owners drowning in admin. The founding rate locks at R350 forever — urgency hook that's working well. Want me to draft a LinkedIn post or a follow-up sequence?"
    } else {
      reply = `Got it! Here's my take on that:

With 18 contacts in the pipeline and R697K at stake, the most valuable thing right now is converting warm leads before they go cold. Priya Patel and Nomsa Khumalo are your best bets this week.

What specifically would you like me to help with — email drafts, deal strategy, lead qualification, or something else? 💙`
    }

    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ reply: "I hit a snag — try again in a second!" }, { status: 500 })
  }
}
