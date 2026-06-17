# FINPAL™ SalesOS — UI Wireframes & Design Specifications

## Design System

**Colors:**
- Background: #0B0C10 (Obsidian)
- Primary accent: #00D9FF (Neon Blue)
- Secondary: #CFD8E3 (Silver Chrome)
- Success: #00C48C
- Warning: #FFB800
- Danger: #FF4D4D
- Card surface: #13151A
- Border: #1E2028

**Typography:**
- Display: Inter 700 (headings)
- Body: Inter 400/500
- Mono: JetBrains Mono (code/numbers)

**Component Library:** shadcn/ui + custom dark theme
**Animations:** Framer Motion (page transitions, card drags, counter animations)

---

## SCREEN 1: MAIN DASHBOARD

```
┌─────────────────────────────────────────────────────────────────┐
│ [FP] FINPAL™ SalesOS          [🔔 3] [OpsPal™ Briefing] [Avatar]│
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                       │
│ NAV      │  Good morning, Thabo ☀️  |  Sunday, 14 Jun 2026      │
│ ────     │                                                       │
│ 📊 Dash  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────────┐│
│ 👥 CRM   │  │REVENUE  │ │PIPELINE │ │HOT LEADS│ │AI CONVOS   ││
│ 🏗 Pipeline│ │ R145K   │ │ R2.4M   │ │   12 🔥 │ │  47 today  ││
│ 🤖 AI    │  │ MTD ↑18%│ │weighted │ │score 80+│ │ 8 bookings ││
│ 📝 Proposals│ └─────────┘ └─────────┘ └─────────┘ └────────────┘│
│ 💳 Payments│                                                      │
│ ⚡ Auto  │  Revenue Chart (last 30 days — line chart, neon blue) │
│ 📱 Social │  ┌──────────────────────────────────────────────────┐│
│ ⚙ Settings│  │████████████████████████████████████░░░░░░░░      ││
│          │  └──────────────────────────────────────────────────┘│
│ [SalesPal™]│                                                     │
│ [SupportPal│  Pipeline Funnel        Lead Sources (donut chart)  │
│ [MarketingP│  ┌─────────────────┐   ┌───────────────────────┐  │
│ [OpsPal™] │  │ New Lead   24 ●──┤   │ ● Organic  34%        │  │
│          │  │ Contacted  18 ●──┤   │ ● Social   28%        │  │
│          │  │ Qualified  12 ●──┤   │ ● Referral 22%        │  │
│          │  │ Proposal    8 ●──┤   │ ● Paid     12%        │  │
│          │  │ Negotiation 4 ●──┤   │ ● Chat      4%        │  │
│          │  │ Won ✅      3    │   └───────────────────────┘  │
│          │  └─────────────────┘                               │
│          │                                                       │
│          │  Recent Activity Feed        Tasks Due Today         │
│          │  ┌──────────────────────┐   ┌─────────────────────┐ │
│          │  │🔵 Deal won: R35K     │   │☐ Follow up: John D  │ │
│          │  │🟡 Proposal viewed    │   │☐ Send proposal: ABC │ │
│          │  │🟢 New lead: SalesPal │   │☑ Call: Nomsa P ✅   │ │
│          │  │🔵 Payment: R8,500    │   └─────────────────────┘ │
│          │  └──────────────────────┘                           │
└──────────┴─────────────────────────────────────────────────────┘
```

---

## SCREEN 2: KANBAN PIPELINE

```
┌─────────────────────────────────────────────────────────────────┐
│ Pipeline  [+ Add Deal] [Filter ▾] [Group: All Users ▾] [Search] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ R2.4M total  |  R840K weighted  |  87 deals  |  23.5% conv rate │
│                                                                   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│ │NEW LEAD  │ │CONTACTED │ │QUALIFIED │ │DISCOVERY │ │PROPOSAL││
│ │  24 deals│ │  18 deals│ │  12 deals│ │   8 deals│ │  6 dls ││
│ │  R485K   │ │  R360K   │ │  R240K   │ │  R160K   │ │  R120K ││
│ │──────────│ │──────────│ │──────────│ │──────────│ │────────││
│ │          │ │          │ │          │ │          │ │        ││
│ │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │ │┌─────┐││
│ │ │John D│ │ │ │ ABC  │ │ │ │ XYZ  │ │ │ │Nomsa │ │ ││ Big ││││
│ │ │R35K  │ │ │ │Ent   │ │ │ │Corp  │ │ │ │P. R  │ │ ││Corp ││││
│ │ │🟢 Hot│ │ │ │R120K │ │ │ │R85K  │ │ │ │75K   │ │ ││R95K ││││
│ │ │3 days│ │ │ │🟡 Med│ │ │ │🔴 7d │ │ │ │✅ Cal│ │ ││🟢   ││││
│ │ │[J.L] │ │ │ │5 days│ │ │ │overdue│ │ │ │booked│ │ ││     ││││
│ │ └──────┘ │ │ └──────┘ │ │ └──────┘ │ │ └──────┘ │ │└─────┘││
│ │          │ │          │ │          │ │          │ │        ││
│ │[+ Deal]  │ │[+ Deal]  │ │[+ Deal]  │ │[+ Deal]  │ │[+Deal] ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘│
│                                                                   │
│  Color code: 🟢 Green=on track  🟡 Amber=due soon  🔴 Red=overdue │
└─────────────────────────────────────────────────────────────────┘
```

---

## SCREEN 3: CONTACT PROFILE

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Contacts  /  John Dlamini                    [Edit] [⋮ More]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ ┌─────────────────────────┐  ┌───────────────────────────────┐  │
│ │ [JD]  John Dlamini      │  │ DEALS (2)              R75K   │  │
│ │ CEO, Acme Solutions      │  │ ┌─────────────────────────┐  │  │
│ │ john@acme.co.za          │  │ │ERP Upgrade    R35K  Qual │  │  │
│ │ +27 82 123 4567          │  │ │Support Retainer R40K Won │  │  │
│ │ 🌐 acme.co.za            │  │ └─────────────────────────┘  │  │
│ │                          │  └───────────────────────────────┘  │
│ │ Stage: ●Qualified        │                                      │
│ │ Score: 82 🔥 HOT         │  TASKS                              │
│ │ Source: Website Chat     │  ☐ Follow up (due today)           │
│ │ Assigned: Lerato M.      │  ☐ Send revised proposal (Fri)     │
│ │ Created: 12 Jun 2026     │                                      │
│ │                          │                                      │
│ │ Tags: [warm] [enterprise]│                                      │
│ │       [+ Add Tag]        │                                      │
│ └─────────────────────────┘                                      │
│                                                                   │
│ ACTIVITY TIMELINE                              [+ Log Activity]  │
│ ─────────────────────────────────────────────────────────────    │
│ Today                                                             │
│ 🤖 14:23 SalesPal™ — Conversation (BANT: 4/4) — Score: 82       │
│          "Qualified for ERP upgrade. Budget R35K. Needs Q3."     │
│          [View transcript]                                        │
│                                                                   │
│ 📞 11:05 Call logged by Lerato M.                               │
│          "Interested in proposal. Follows up next week."         │
│                                                                   │
│ Yesterday                                                         │
│ 📧 09:30 Welcome email sent (automated)                          │
│ 🌐 09:28 Website chat started — visited /pricing                 │
│                                                                   │
│ [AI Chat History] [Proposals] [Invoices] [Files]                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## SCREEN 4: SOCIAL MEDIA CALENDAR

```
┌─────────────────────────────────────────────────────────────────┐
│ Social Media                    [Generate Post] [Connect Account]│
│ ← June 2026 →   [Month] [Week] [List]          [Pause All 🛑]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ Connected: [f] Facebook ✅  [ig] Instagram ✅  [in] LinkedIn ✅  │
│            [𝕏] Twitter ✅   [tik] TikTok ✅                     │
│                                                                   │
│ MON 8    TUE 9    WED 10   THU 11   FRI 12   SAT 13   SUN 14   │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│ │[in]  │ │      │ │[f]   │ │[in]  │ │[ig]  │ │      │         │
│ │Client│ │      │ │Tips  │ │Case  │ │Behind│ │      │         │
│ │Win 🟢│ │      │ │post🟡│ │Study │ │scenes│ │      │         │
│ │09:00 │ │      │ │12:00 │ │✅pub  │ │📸    │ │      │         │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │
│                                                                   │
│ MON 15   TUE 16   WED 17   THU 18   FRI 19   SAT 20   SUN 21  │
│ ┌──────┐ ┌──────┐          ┌──────┐                             │
│ │[𝕏]  │ │[in]  │          │[f][ig│                             │
│ │Thread│ │Poll  │          │] Sale│                             │
│ │🔵Sch │ │🟡 Pnd│          │s tip │                             │
│ │09:00 │ │12:00 │          │Aprov?│                             │
│ └──────┘ └──────┘          └──────┘                             │
│                    [+ Add Post]                                  │
│                                                                   │
│ Status:  🟢 Published  🔵 Scheduled  🟡 Pending Approval  ○ Draft│
│                                                                   │
│ PENDING APPROVAL (2)                                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │[in] LinkedIn — Tue 16 Jun 12:00                             │ │
│ │"We're thrilled to share that one of our clients..."        │ │
│ │Generated by: MarketingPal™          [Approve ✅] [Reject ❌]│ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## SCREEN 5: SALESPAL™ CHAT WIDGET (Website Embed)

```
                              ┌──────────────────────────┐
                              │ [FP] SalesPal™       [✕] │
                              │ Your AI Sales Assistant   │
                              │ 🟢 Online now             │
                              ├──────────────────────────┤
                              │                           │
                              │ ┌────────────────────┐   │
                              │ │ Hi there! 👋 I'm   │   │
                              │ │ SalesPal™. I help  │   │
                              │ │ businesses like    │   │
                              │ │ yours grow faster. │   │
                              │ │ What brings you    │   │
                              │ │ here today?        │   │
                              │ └────────────────────┘   │
                              │                           │
                              │           ┌─────────────┐│
                              │           │ Looking for  ││
                              │           │ pricing info ││
                              │           └─────────────┘│
                              │                           │
                              │ ┌────────────────────┐   │
                              │ │ Great choice! We   │   │
                              │ │ have 3 plans from  │   │
                              │ │ R499/mo. Quick     │   │
                              │ │ question — how     │   │
                              │ │ many sales reps    │   │
                              │ │ on your team?      │   │
                              │ └────────────────────┘   │
                              │                           │
                              │ Lead score: 45 ●●●○○      │
                              ├──────────────────────────┤
                              │ [Type a message...]   [▶] │
                              │ [📅 Book a call]          │
                              └──────────────────────────┘
                    ○ ← floating bubble (collapsed state)
                   [FP]
```

---

## SCREEN 6: PROPOSAL GENERATOR

```
┌─────────────────────────────────────────────────────────────────┐
│ Generate Proposal        [AI Generate] [Preview PDF] [Send]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ For: John Dlamini @ Acme Solutions    Deal: ERP Upgrade R35K    │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 1. EXECUTIVE SUMMARY                               [AI ✨]  │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │ "Acme Solutions has a clear opportunity to streamline its   │ │
│ │  operations through an integrated ERP solution. This         │ │
│ │  proposal outlines how [Your Company] will deliver a        │ │
│ │  tailored implementation that reduces manual work by 60%..." │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 4. INVESTMENT                                      [AI ✨]  │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │ Item                    Qty    Rate      Total               │ │
│ │ ERP Implementation       1    R25,000   R25,000             │ │
│ │ Training & Onboarding    5    R1,000    R5,000              │ │
│ │ Monthly Support          1    R3,500/mo R3,500              │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │ Subtotal                                R33,500             │ │
│ │ VAT (15%)                               R5,025              │ │
│ │ TOTAL                                   R38,525             │ │
│ │ [+ Add line item]                                           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Sections: [1.Summary] [2.Problem] [3.Solution] [4.Pricing]      │
│           [5.Timeline] [6.Terms] [7.CTA]                        │
│                                                                   │
│ Valid until: 14 Jul 2026      E-Signature: ✅ Enabled            │
│                                                                   │
│ [💾 Save Draft]  [📄 Preview PDF]  [📤 Send to Client]          │
└─────────────────────────────────────────────────────────────────┘
```

---

## SCREEN 7: ANALYTICS DASHBOARD (Dark Mode)

```
┌─────────────────────────────────────────────────────────────────┐
│ Analytics    [MTD ▾] [Jun 1–14, 2026]    [Export PDF] [CSV]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  R145,000        R2.4M          23.5%         R28,750           │
│  Revenue MTD     Pipeline       Conv. Rate    Avg Deal Size     │
│  ↑18% vs last    Total value    ↑3.2% ↑       ↓4% ↓            │
│                                                                   │
│  Revenue Over Time (Bar + Line)                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │    │                                                ___    │ │
│  │    │                               ___          ___/       │ │
│  │    │              ___          ___/            /           │ │
│  │    │  ___     ___/   \___  ___/                            │ │
│  │    │ /                   \/                                │ │
│  │────┼───────────────────────────────────────────────────   │ │
│  │    Jan  Feb  Mar  Apr  May  Jun                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Pipeline Stage Conversion          Forecast                     │
│  ┌──────────────────────┐          ┌──────────────────────────┐ │
│  │ New Lead  →  Won      │          │ Next 30 days:  R 285K    │ │
│  │ 100 → 80 → 60 → 45   │          │ Next 60 days:  R 520K    │ │
│  │ → 30 → 20 → 12 → 8   │          │ Next 90 days:  R 840K    │ │
│  │ Conv: 8%              │          │ (weighted probability)   │ │
│  └──────────────────────┘          └──────────────────────────┘ │
│                                                                   │
│  AI Agent Performance              Social Media Summary          │
│  ┌──────────────────────┐          ┌──────────────────────────┐ │
│  │ 📊 340 conversations  │          │ 📊 28,500 total reach     │ │
│  │ 🤖 47 bookings made   │          │ 💙 4.2% avg engagement   │ │
│  │ 💰 12 deals created   │          │ 📈 +340 followers        │ │
│  │ ⚡ Avg resp: 4.2s     │          │ 🏆 Best: LinkedIn post   │ │
│  └──────────────────────┘          └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```
