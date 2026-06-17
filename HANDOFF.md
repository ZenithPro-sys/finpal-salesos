# FINPAL™ SalesOS — Developer Handoff Package
## Version 1.0 | June 2026 | Confidential

---

> **"Your AI Sales Team. Working 24/7."**
> Built by: Zenith Intel + Superagent AI
> Stack managed by: Superagent (Base44 AI)

---

## 🚀 Quick Start for Developers

### What you're building
FINPAL™ SalesOS is a multi-tenant AI-powered Sales CRM + Social Media Automation SaaS.
11 modules. 14-week build. MVP live in 6 weeks.

### Read these docs in order:
1. `docs/01-architecture.md` — System design, AWS infra, scaling
2. `schemas/02-database-schema.sql` — Full PostgreSQL schema (copy-paste ready)
3. `api/03-api-design.md` — All REST endpoints, request/response formats
4. `docs/04-user-journeys.md` — 5 core user flows (read before building UI)
5. `docs/05-ui-wireframes.md` — All screen layouts + design system
6. `docs/06-dev-roadmap.md` — Phased tasks, hours, priorities
7. `docs/07-mvp-spec.md` — MVP scope (Weeks 1-6), acceptance criteria
8. `docs/08-deployment-plan.md` — Hosting, CI/CD, environment variables
9. `docs/09-monetization-strategy.md` — Pricing, growth, unit economics

---

## 🏗 Tech Stack (MVP — FREE TIER FIRST)

### Hosting (Zero Cost to Start)
| Service | What For | Free Tier |
|---------|----------|-----------|
| **Base44** | Agent + automations + DB | ✅ Included |
| **Vercel** | Next.js frontend + API | ✅ Hobby (free) |
| **Neon.tech** | PostgreSQL | ✅ 512MB free |
| **Upstash** | Redis (queues + cache) | ✅ 10k req/day |
| **Pinecone** | Vector DB (RAG) | ✅ 100k vectors |
| **Cloudflare** | DNS + CDN + widget | ✅ Free plan |
| **Resend** | Email (3,000/mo) | ✅ Free |
| **Anthropic** | Claude API (pay-as-you-go) | ~$5-20/mo dev |

> 💡 Total infra cost during development: ~$5-25/month

### When you start charging customers:
- Vercel Pro: $20/mo (custom domains, no bandwidth limits)
- Neon Pro: $19/mo (10GB, no cold starts)
- Upgrade others as usage grows

### Frontend
```
Next.js 14 (App Router)
TailwindCSS + shadcn/ui
dnd-kit (Kanban drag-and-drop)
Recharts (dashboard charts)
Framer Motion (animations)
Socket.io-client (real-time chat)
React Hook Form + Zod
SWR (data fetching)
```

### Backend
```
Next.js API routes (same repo — monolith for MVP)
Prisma ORM (PostgreSQL)
JWT (jose)
Anthropic SDK (Claude Sonnet — AI)
OpenAI SDK (embeddings only)
Pinecone SDK (RAG)
Resend SDK (email)
BullMQ + Upstash Redis (queues)
Puppeteer (PDF generation)
Socket.io (WebSocket)
```

---

## 📁 Recommended Project Structure

```
finpal-salesos/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Sidebar + nav shell
│   │   ├── page.tsx              # Dashboard home
│   │   ├── contacts/
│   │   ├── companies/
│   │   ├── pipeline/
│   │   ├── ai/
│   │   ├── proposals/
│   │   ├── payments/
│   │   ├── automations/
│   │   ├── social/
│   │   └── settings/
│   └── api/                      # API Routes
│       ├── auth/
│       ├── contacts/
│       ├── deals/
│       ├── ai/
│       ├── proposals/
│       ├── social/
│       └── webhooks/
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── crm/                      # CRM-specific components
│   ├── pipeline/                 # Kanban board components
│   ├── chat/                     # SalesPal™ chat UI
│   ├── social/                   # Social calendar components
│   └── analytics/                # Charts and metrics
├── lib/
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # Auth utilities
│   ├── ai.ts                     # Anthropic + OpenAI clients
│   ├── email.ts                  # Resend client
│   ├── redis.ts                  # Upstash client
│   └── storage.ts                # S3 client
├── prisma/
│   ├── schema.prisma             # DB schema
│   └── migrations/
├── public/
│   └── widget/
│       └── widget.js             # Embeddable chat widget
├── types/
│   └── index.ts                  # TypeScript types
├── .env.local                    # Local environment (never commit)
├── .env.example                  # Template (commit this)
└── package.json
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# ── DATABASE ──────────────────────────────────────
DATABASE_URL="postgresql://user:pass@ep-xxxx.neon.tech/finpal?sslmode=require"

# ── AUTH ──────────────────────────────────────────
JWT_SECRET="generate-32-char-random-string"
JWT_REFRESH_SECRET="generate-32-char-random-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-32-char-random-string"

# ── AI ────────────────────────────────────────────
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."          # embeddings only
PINECONE_API_KEY="..."
PINECONE_INDEX_NAME="finpal-rag"

# ── EMAIL ─────────────────────────────────────────
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@finpal.online"

# ── REDIS (Upstash) ───────────────────────────────
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# ── STORAGE ───────────────────────────────────────
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="af-south-1"
AWS_S3_BUCKET="finpal-uploads"

# ── PAYMENTS (Phase 3) ────────────────────────────
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PAYFAST_MERCHANT_ID="..."
PAYFAST_MERCHANT_KEY="..."

# ── COMMS (Phase 2) ───────────────────────────────
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
```

---

## 🗓 Build Sprint Summary

| Phase | Weeks | Focus | Deliverable |
|-------|-------|-------|-------------|
| 1 | 1-3 | Auth + CRM + Pipeline + Dashboard | Working CRM |
| 2 | 4-6 | SalesPal™ AI + RAG + Proposals + Emails | AI live |
| 3 | 7-9 | Payments + Invoices + Analytics | Revenue ready |
| 4 | 10-12 | Social Media Auto-posting | Full platform |
| 5 | 13-14 | QA + Polish + Launch | Ship it 🚀 |

---

## 💰 Monetization Summary

| Plan | Price | Key Upsell |
|------|-------|------------|
| Starter | $29/mo | 500 contacts, 1 AI agent |
| Professional | $99/mo | All 4 Pals, 5 social accounts |
| Agency | $299/mo | White-label, 25 users |
| Enterprise | Custom | Dedicated support, custom AI |

Annual discount: **20% off** (shown at sign-up + day 30)

---

## 📞 Team Contacts

- **Product Owner:** Zenith Intel
- **AI Architect + PM:** Superagent (Base44) — receives daily WhatsApp briefings
- **Repository:** [Set up on GitHub — ask Superagent to create repo structure]
- **Staging URL:** TBD (Vercel preview)
- **Production:** app.finpal.online

---

## ✅ First Week Checklist

```
□ Clone this repo structure
□ Create Neon.tech account → get DATABASE_URL
□ Create Vercel account → connect GitHub repo
□ Create Upstash account → get Redis URL
□ Create Pinecone account → create "finpal-rag" index
□ Create Resend account → verify finpal.online domain
□ Get Anthropic API key
□ Run: npx prisma db push (to apply schema)
□ Run: npm run dev → confirm dashboard loads
□ Deploy to Vercel → confirm https://app.finpal.online works
□ Embed widget on test HTML page → confirm chat fires
```

---

*This document is maintained by Superagent AI. Last updated: June 14, 2026.*
*For questions, changes, or daily updates — check WhatsApp briefings.*
