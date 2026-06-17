# FINPAL™ SalesOS — MVP Specification (Phase 1 + 2)

## MVP Goal
Deliver a working, deployable product in 6 weeks that allows a solo entrepreneur or small sales team to:
1. Manage contacts, companies, and deals in a CRM
2. Visualise their pipeline as a drag-and-drop Kanban board
3. Deploy an AI chat agent (SalesPal™) on their website
4. Auto-generate and send branded proposals
5. Automate 3 core email sequences

---

## In Scope (MVP)

### Auth + Users
- [x] Register (business name, email, password)
- [x] Login / Logout
- [x] Email verification
- [x] Password reset
- [x] 2FA (TOTP) — optional setup
- [x] 2 roles: Owner, Sales Rep
- [x] Session management (JWT)

### CRM
- [x] Create / Edit / Delete contacts
- [x] Contact list view (table) with search + filter
- [x] Contact profile page (full details, timeline)
- [x] Activity log per contact (notes, calls, emails)
- [x] Tags on contacts
- [x] Lead score (AI-calculated from chat)
- [x] CSV import (basic: name, email, phone, company)
- [x] Assign contacts to users
- [x] Companies (basic: name, industry, website)
- [x] Contact ↔ Company link

### Pipeline
- [x] 8 fixed pipeline stages
- [x] Drag-and-drop Kanban board (react-beautiful-dnd or dnd-kit)
- [x] Deal cards (title, value, contact, urgency color)
- [x] Deal CRUD
- [x] Stage change auto-logs activity
- [x] Deal ↔ Contact link
- [x] Basic pipeline stats: total value, count per stage

### Dashboard
- [x] 4 KPI cards: Revenue MTD, Pipeline value, Hot leads, AI conversations
- [x] Revenue bar chart (last 6 months)
- [x] Pipeline funnel chart
- [x] Lead source donut chart
- [x] Recent activity feed
- [x] Tasks due today

### AI — SalesPal™
- [x] Chat widget (embeddable JS snippet)
- [x] Website chat (WebSocket, real-time)
- [x] BANT qualification (3 questions max)
- [x] Lead scoring (0-100)
- [x] Hot lead notification (score ≥ 80) → email to owner
- [x] "Speak to human" → email escalation
- [x] Auto-create contact + deal in CRM from conversation
- [x] Conversation transcript stored in CRM
- [x] Calendar booking via Calendly link (embedded in chat)
- [x] Configurable greeting, personality (via UI)

### Knowledge Base (RAG)
- [x] Upload PDF documents
- [x] Text extraction + chunking
- [x] Pinecone vector indexing
- [x] RAG-powered answers in SalesPal™
- [x] FAQ upload (plain text)

### Email Automation
- [x] Resend API integration
- [x] Branded email templates (3 pre-built)
- [x] Pre-built automation 1: New lead → Welcome email → SalesPal™ qualifies → Book meeting
- [x] Pre-built automation 2: Proposal sent → 24h follow-up → 72h follow-up
- [x] Pre-built automation 3: Deal won → Thank you + Onboarding intro

### Proposals
- [x] AI-generate proposal (all 7 sections)
- [x] Manual edit sections (rich text)
- [x] Pricing table (line items, VAT, totals)
- [x] PDF generation (branded)
- [x] Send via tracked link (email)
- [x] View notification (owner alert when client opens)
- [x] Proposal status tracking

---

## Out of Scope (MVP) — Phase 3+

| Feature | Phase |
|---------|-------|
| Stripe / PayFast payments | 3 |
| Invoice generation | 3 |
| Social media posting | 4 |
| Full analytics (forecasting) | 3 |
| All 4 AI Pals | 2+ |
| SupportPal™, MarketingPal™, OpsPal™ | 2-3 |
| White-label settings | 5 |
| API key management | 5 |
| Audit logs | 5 |
| SSO | 5 |
| Zapier/webhook integration | 3 |
| E-signature | 2+ |
| TikTok, Twitter/X social | 4 |

---

## MVP Tech Stack (Simplified)

### Frontend
```
Next.js 14 (App Router)
TailwindCSS + shadcn/ui (dark theme configured)
dnd-kit (drag and drop)
Recharts (charts)
Framer Motion (transitions)
Socket.io-client (chat)
React Hook Form + Zod (forms + validation)
SWR (data fetching + cache)
```

### Backend
```
Next.js API routes (same repo — monolith for MVP speed)
Prisma ORM + PostgreSQL (Neon.tech for serverless simplicity)
JWT (jose library)
Resend (email)
Anthropic SDK (Claude Sonnet 4)
OpenAI SDK (embeddings)
Pinecone SDK (vector search)
Puppeteer (PDF generation)
Socket.io (WebSocket)
BullMQ + Redis (Upstash for managed Redis)
```

### Infrastructure (MVP — simplified)
```
Vercel (Next.js hosting — frontend + API routes)
Neon.tech (PostgreSQL — serverless, scales to zero)
Upstash (Redis — serverless)
Pinecone (vector DB — free tier for MVP)
Cloudflare (DNS + CDN for widget)
AWS S3 (file storage — PDFs, uploads)
```

**MVP monthly infra cost: ~$50-150** (vs full AWS at scale)

---

## MVP API Routes (Minimum Viable)

```
/api/auth/*          — all auth endpoints
/api/contacts/*      — CRUD + search
/api/companies/*     — CRUD
/api/deals/*         — CRUD + pipeline
/api/activities/*    — log + list
/api/tasks/*         — CRUD
/api/ai/chat         — SalesPal™ chat
/api/ai/config       — agent settings
/api/knowledge-base/* — upload + list
/api/proposals/*     — generate + CRUD + send
/api/automations/*   — templates + runs
/api/dashboard       — metrics endpoint
/api/users/*         — profile + team
/api/widget/*        — public widget API
```

---

## MVP Database Schema (Simplified)

For MVP, single shared PostgreSQL with tenant_id on every table (no schema-per-tenant yet — defer for scale).

```sql
-- 12 core tables for MVP:
tenants, users, sessions,
contacts, companies, deals, activities, tasks,
chat_conversations, chat_messages,
knowledge_base, proposals
```

---

## Widget Embed (MVP)

```html
<!-- One-line embed. User gets this from their dashboard -->
<script 
  src="https://widget.finpal.online/v1/widget.js" 
  data-id="fp_widget_abc123"
  data-position="bottom-right"
  data-color="#00D9FF"
  async>
</script>
```

Widget JS (~15KB gzipped):
- Vanilla JS (no React, no dependencies)
- WebSocket connection to api.finpal.online
- Renders bubble + chat window in Shadow DOM (no style conflicts)
- Mobile responsive
- Stores session in localStorage

---

## MVP Definition of Done

- [ ] User can register, verify email, login, set up 2FA
- [ ] User can create contacts, companies, deals
- [ ] Kanban pipeline renders and drag-and-drop works
- [ ] Dashboard shows real data from DB
- [ ] SalesPal™ responds in chat with BANT questions
- [ ] Hot lead notification fires to owner (email)
- [ ] Knowledge base RAG answers questions from uploaded PDF
- [ ] Proposal generates all 7 sections with AI
- [ ] Proposal PDF downloads correctly (branded)
- [ ] Tracked proposal link shows "viewed" notification
- [ ] 3 automation templates send emails correctly
- [ ] Widget embeds on external HTML page and chats
- [ ] Responsive on mobile (iPhone 12 min)
- [ ] Page load < 2 seconds (LCP)
- [ ] No critical security vulnerabilities (OWASP)
- [ ] Deployed to production URLs

---

## MVP Acceptance Criteria (User Story Format)

**US-01:** As a new user, I can sign up in < 3 minutes and see my empty dashboard.

**US-02:** As a sales rep, I can add a new contact and see their profile with a blank activity timeline.

**US-03:** As an owner, I can see all my deals as cards on a Kanban board and drag them between stages.

**US-04:** As a website visitor, I can chat with SalesPal™ and book a meeting without leaving the page.

**US-05:** As an owner, I receive an email within 10 seconds when a hot lead (score 80+) is identified.

**US-06:** As a sales rep, I can generate an AI proposal in < 30 seconds and send it via tracked link.

**US-07:** As an owner, I get notified when a client opens my proposal.

**US-08:** As a new lead from a form, I automatically receive a welcome email within 5 minutes.

**US-09:** As an owner, I can upload a pricing PDF and SalesPal™ answers questions from it correctly.

**US-10:** As any user, all data is scoped to my workspace — I cannot see other tenants' data.
