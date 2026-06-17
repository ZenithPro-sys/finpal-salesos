# FINPAL™ SalesOS — User Journey Maps

---

## Journey 1: New Entrepreneur Onboarding

**Persona:** Thabo, 34, runs a B2B consulting firm. First time using a CRM.

**Goal:** Set up FINPAL™ and get his first AI-qualified lead within 24 hours.

```
STEP 1 — DISCOVERY
└─ Sees LinkedIn ad / Google search
└─ Lands on finpal.online marketing site
└─ Clicks "Start Free Trial"

STEP 2 — SIGN UP (2 minutes)
└─ Enters: Business name, Email, Password, Phone
└─ Picks plan: Starter ($29/mo)
└─ Email verification (magic link)
└─ ✅ Account created

STEP 3 — ONBOARDING WIZARD (5 minutes)
└─ "Tell us about your business"
   └─ Industry, team size, main product/service
└─ Upload knowledge base (pricing PDF, FAQs)
   └─ AI processes document → Pinecone indexed
└─ Customize SalesPal™
   └─ Set greeting message, brand colors
└─ Connect calendar (Google Calendar OAuth)
└─ Embed widget snippet shown → Copy to website

STEP 4 — FIRST LEAD ARRIVES (same day)
└─ Website visitor starts chat → SalesPal™ responds in 5s
└─ BANT qualification happens automatically
└─ Lead score: 82 → HOT LEAD notification to Thabo
└─ SalesPal™ books discovery call into his calendar
└─ Contact auto-created in CRM → Deal auto-created

STEP 5 — DEAL PROGRESSION
└─ Thabo reviews lead profile in dashboard
└─ Sees full conversation transcript
└─ Moves deal: New Lead → Qualified (one click)
└─ AI auto-generates proposal draft based on conversation
└─ Thabo edits + sends proposal → trackable link

STEP 6 — CLOSE
└─ Email: "Your proposal was viewed 3 minutes ago" 🔥
└─ Thabo calls client → Deal marked WON
└─ Automation fires: Thank you email + Invoice sent + Social post drafted
└─ 🎉 R35,000 deal closed within 48 hours of sign-up
```

**Time to value:** 24-48 hours
**Key emotion:** Confidence, excitement, relief

---

## Journey 2: Daily Sales Rep Workflow

**Persona:** Lerato, Sales Rep at an agency using FINPAL™ Professional.

**Goal:** Work her leads efficiently and hit monthly target.

```
07:00 — MORNING BRIEFING (OpsPal™)
└─ Push notification: "Good morning Lerato! Here's your day:"
   └─ 3 tasks due today
   └─ 2 proposals awaiting reply (48h+ old) → follow up
   └─ 1 hot lead: scored 88 last night — SalesPal™ qualified
   └─ Pipeline value: R420,000 this month

08:30 — REVIEW HOT LEAD
└─ Opens notification → Contact profile loads
└─ Reads full AI conversation transcript
└─ Sees BANT: Budget ✅ Authority ✅ Need ✅ Timeline: "this month" ✅
└─ Calls contact → Logs call activity in CRM (voice note auto-transcribed)
└─ Moves deal: Qualified → Discovery

10:00 — PROPOSAL GENERATION
└─ Opens deal → "Generate Proposal" button
└─ AI draft ready in 15 seconds
└─ Lerato reviews, adjusts pricing table
└─ Sends via FINPAL™ link (tracked)

12:00 — "Proposal viewed" notification fires
└─ Lerato sends WhatsApp follow-up (manual)
└─ Adds note to CRM: "Client viewed — interested, awaiting board sign-off"

14:00 — PIPELINE REVIEW
└─ Kanban view: drags 2 deals to new stages
└─ Updates close dates on 3 deals
└─ Bulk emails 5 "contacted" leads → AI-written template

17:00 — DAY END
└─ OpsPal™ summary: 8 activities logged, 2 meetings booked
└─ Pipeline moved: +R85,000 weighted value
└─ 1 deal marked Won → Invoice auto-generated
```

---

## Journey 3: Social Media Auto-Posting Workflow

**Persona:** Nomsa, Marketing Manager. Needs consistent content across 5 platforms without manual work.

**Goal:** Publish 15 posts per week across all platforms on autopilot.

```
STEP 1 — CONNECT ACCOUNTS
└─ Settings → Social Media → Connect
└─ Links: Facebook Page, Instagram Business, LinkedIn Company, Twitter/X
└─ FINPAL™ stores encrypted tokens

STEP 2 — SET UP CONTENT CALENDAR
└─ Opens Content Calendar (monthly view)
└─ Drags in a new post slot: Tuesday 9am, Thursday 12pm, Saturday 10am

STEP 3 — AI CONTENT GENERATION
└─ Clicks "Generate Content" → MarketingPal™ modal opens
└─ Inputs:
   └─ Topic: "Client success story — R500k deal closed"
   └─ Tone: Celebratory but professional
   └─ Goal: Social proof
   └─ Platforms: LinkedIn, Facebook, Instagram
└─ AI returns 3 variations per platform (9 total, 45 seconds)
└─ Nomsa picks best per platform → edits Instagram caption slightly
└─ AI generates image prompt → DALL-E creates visual

STEP 4 — APPROVAL WORKFLOW
└─ Posts go to "Pending Approval" status
└─ Owner (Thabo) gets email: "3 posts ready for review"
└─ Thabo approves all → status: Scheduled

STEP 5 — AUTO-PUBLISHING
└─ Posts publish at optimal times per platform
└─ Confirmations sent: "Your LinkedIn post is live ✅"

STEP 6 — ANALYTICS (next day)
└─ Dashboard shows: LinkedIn 1,240 impressions, 87 likes, 12 comments
└─ Instagram 890 reach, 4.2% engagement
└─ Weekly digest email to Nomsa: "Your best post this week reached 3,400 people"

STEP 7 — AUTOMATION TRIGGERED POSTING
└─ Deal closes → Automation fires → Draft celebration post created
└─ Nomsa sees it in calendar as "Pending Approval"
└─ One-click approve → Published in 2 minutes
```

---

## Journey 4: Client Payment & Invoice Flow

**Persona:** Small business owner receiving first payment through FINPAL™.

```
STEP 1 — DEAL WON
└─ Deal marked Won in pipeline
└─ Automation: Invoice auto-generated with deal value + line items

STEP 2 — INVOICE SENT
└─ Owner reviews auto-generated invoice (branded PDF)
└─ Clicks "Send to Client"
└─ Client receives email with:
   └─ Branded invoice PDF attached
   └─ "Pay Now" button → Stripe/PayFast checkout
   └─ Bank transfer details (if selected)

STEP 3 — CLIENT PAYS
└─ Client clicks "Pay Now"
└─ Stripe checkout (card) OR PayFast (EFT/card ZAR)
└─ Payment processed → Webhook fires back to FINPAL™

STEP 4 — CONFIRMATION
└─ Owner notification: "Payment received! R35,000 from Client XYZ 🎉"
└─ Invoice status → Paid
└─ Contact record updated: stage → Active Client
└─ Automation: Onboarding email sequence started
└─ Revenue dashboard updated in real-time

STEP 5 — RECURRING (if subscription)
└─ Monthly auto-charge via Stripe
└─ Renewal invoice auto-generated and emailed
└─ Failure → Auto-reminder sequence → Escalate after 3 failures
```

---

## Journey 5: Human Escalation (Hot Handoff)

**Persona:** High-value enterprise prospect on website chat.

```
STEP 1 — CHAT STARTS
└─ Prospect types: "We have 200 sales reps and need a full platform"
└─ SalesPal™ engages → qualifies in 3 questions
└─ Lead score hits 91 (enterprise signals detected)

STEP 2 — ESCALATION TRIGGER
└─ Score > 80 triggers: "Connecting you with a senior specialist"
└─ OR Prospect types "speak to a human" → immediate escalation

STEP 3 — OWNER NOTIFIED
└─ Push notification to owner's phone: "🔥 HOT LEAD — Enterprise prospect in chat"
└─ Email: Conversation summary, BANT breakdown, lead score
└─ Dashboard: Conversation highlighted in red "Needs Human"

STEP 4 — SEAMLESS HANDOFF
└─ Owner opens conversation → full history visible
└─ Owner joins as "Senior Specialist"
└─ Prospect sees smooth transition — no repeated questions

STEP 5 — BOOKING
└─ Owner books demo call in-chat (calendar integration)
└─ Both parties get calendar invite
└─ CRM deal created: "Enterprise — 200 seats" → R2.4M potential

STEP 6 — FOLLOW UP
└─ Post-chat: AI generates summary + recommended next steps
└─ Automation starts: enterprise onboarding sequence
└─ Deal moves to Discovery stage
```
