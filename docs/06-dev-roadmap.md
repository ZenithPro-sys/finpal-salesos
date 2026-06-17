# FINPAL™ SalesOS — Development Roadmap

## Overview

| Phase | Duration | Theme | Status |
|-------|----------|-------|--------|
| 1 | Weeks 1-3 | Foundation | 🔵 First Sprint |
| 2 | Weeks 4-6 | AI Core | ⬜ Upcoming |
| 3 | Weeks 7-9 | Revenue | ⬜ Upcoming |
| 4 | Weeks 10-12 | Social OS | ⬜ Upcoming |
| 5 | Weeks 13-14 | Polish + Launch | ⬜ Upcoming |

---

## PHASE 1: FOUNDATION (Weeks 1-3)

### Week 1: Infrastructure + Auth
**Team:** Lead Dev + DevOps

| Task | Hours | Priority |
|------|-------|----------|
| AWS environment setup (VPC, RDS, ECS, S3) | 8h | P0 |
| Domain config (finpal.online, subdomains, SSL) | 3h | P0 |
| Cloudflare DNS + WAF setup | 3h | P0 |
| PostgreSQL multi-tenant schema design | 6h | P0 |
| Auth system: register, login, JWT, refresh | 12h | P0 |
| Email verification + password reset | 4h | P0 |
| 2FA implementation (TOTP) | 4h | P1 |
| Next.js 14 project scaffold + TailwindCSS | 4h | P0 |
| Design system: colors, components, dark theme | 8h | P0 |
| Navigation shell + layout | 4h | P0 |

**Week 1 deliverable:** Working login/register with dark theme UI shell

### Week 2: CRM Core
| Task | Hours | Priority |
|------|-------|----------|
| Contacts CRUD (API + UI) | 16h | P0 |
| Companies CRUD (API + UI) | 8h | P0 |
| Activities log (API + UI) | 6h | P0 |
| Tags system | 3h | P1 |
| Contact search + filters | 6h | P0 |
| Contact profile page (full) | 8h | P0 |
| CSV import (contacts) | 6h | P1 |
| Assigned-to / user management basic | 4h | P1 |

**Week 2 deliverable:** Full working CRM (no deals yet)

### Week 3: Pipeline + Dashboard
| Task | Hours | Priority |
|------|-------|----------|
| Deals CRUD (API + UI) | 10h | P0 |
| Kanban pipeline board (drag-and-drop) | 14h | P0 |
| Deal card design (value, urgency colors) | 4h | P0 |
| Stage change logging | 3h | P0 |
| Dashboard skeleton (4 KPI cards) | 6h | P0 |
| Revenue chart (Recharts) | 5h | P0 |
| Pipeline funnel chart | 4h | P0 |
| Tasks module | 6h | P1 |
| User roles + permissions | 6h | P0 |

**Week 3 deliverable:** Full CRM + Pipeline + Dashboard (Phase 1 MVP) ✅

---

## PHASE 2: AI CORE (Weeks 4-6)

### Week 4: SalesPal™ Chat Engine
| Task | Hours | Priority |
|------|-------|----------|
| Anthropic API integration | 4h | P0 |
| Conversation state management | 8h | P0 |
| BANT qualification flow | 6h | P0 |
| Lead scoring algorithm | 4h | P0 |
| Escalation trigger (score 80+) | 4h | P0 |
| WebSocket chat server | 8h | P0 |
| Chat widget (embeddable JS) | 12h | P0 |
| Widget CDN deployment (CloudFront) | 3h | P0 |
| Conversation logs → CRM | 4h | P0 |

### Week 5: RAG + Knowledge Base
| Task | Hours | Priority |
|------|-------|----------|
| Pinecone vector DB setup | 4h | P0 |
| Document upload UI | 4h | P0 |
| PDF/DOCX text extraction + chunking | 8h | P0 |
| Vector embedding (OpenAI embeddings) | 4h | P0 |
| RAG retrieval in chat context | 6h | P0 |
| FAQ document processor | 4h | P1 |
| Agent configuration panel (UI) | 6h | P1 |

### Week 6: Email Automation + Proposals
| Task | Hours | Priority |
|------|-------|----------|
| Resend email integration | 4h | P0 |
| Email template system | 6h | P0 |
| 3 pre-built automation templates | 8h | P0 |
| Sequence enrolment engine | 8h | P0 |
| Proposal generator (AI) | 12h | P0 |
| PDF generation (Puppeteer/WeasyPrint) | 6h | P0 |
| Proposal tracking (open pixel) | 4h | P1 |
| E-signature basic implementation | 8h | P1 |

**Phase 2 deliverable:** SalesPal™ live, RAG working, proposals generating ✅

---

## PHASE 3: REVENUE (Weeks 7-9)

### Week 7: Payments Core
| Task | Hours | Priority |
|------|-------|----------|
| Stripe SDK integration | 8h | P0 |
| PayFast API integration (ZAR) | 8h | P0 |
| Invoice CRUD (API + UI) | 10h | P0 |
| Invoice PDF generation | 4h | P0 |
| Payment webhooks (Stripe + PayFast) | 6h | P0 |
| Payment recording (manual) | 3h | P1 |

### Week 8: Subscriptions + Billing
| Task | Hours | Priority |
|------|-------|----------|
| Stripe Subscriptions | 8h | P0 |
| PayFast recurring | 6h | P1 |
| PayPal integration | 6h | P1 |
| Multi-currency support | 4h | P1 |
| Overdue invoice reminders (auto) | 4h | P0 |
| Revenue reconciliation dashboard | 6h | P0 |
| Subscription management UI | 6h | P0 |

### Week 9: Analytics (Live Data)
| Task | Hours | Priority |
|------|-------|----------|
| Revenue metrics (MTD, YTD, all-time) | 6h | P0 |
| Pipeline analytics + forecast | 8h | P0 |
| Lead source analysis | 4h | P0 |
| AI agent performance metrics | 4h | P0 |
| Date range filters | 3h | P0 |
| Export reports (PDF, CSV) | 6h | P1 |
| Real-time WebSocket dashboard updates | 6h | P1 |

**Phase 3 deliverable:** Full payment system, live analytics ✅

---

## PHASE 4: SOCIAL OS (Weeks 10-12)

### Week 10: Social Connections
| Task | Hours | Priority |
|------|-------|----------|
| Meta Graph API (Facebook + Instagram) | 10h | P0 |
| LinkedIn API integration | 8h | P0 |
| Twitter/X API v2 | 8h | P0 |
| TikTok Content Posting API | 6h | P1 |
| OAuth flow + token storage (encrypted) | 6h | P0 |
| Connected accounts management UI | 4h | P0 |
| Token refresh automation | 4h | P0 |

### Week 11: Content Calendar + Generator
| Task | Hours | Priority |
|------|-------|----------|
| Content calendar UI (monthly view) | 12h | P0 |
| Post CRUD (draft, schedule, publish) | 8h | P0 |
| MarketingPal™ AI content generator | 10h | P0 |
| Platform-specific formatting | 6h | P0 |
| AI image generation (DALL-E) | 4h | P1 |
| Content repurposing (1 → 5 platforms) | 6h | P1 |
| Media upload (images, video) | 6h | P0 |

### Week 12: Publishing + Analytics
| Task | Hours | Priority |
|------|-------|----------|
| Approval workflow (draft→approve→publish) | 8h | P0 |
| BullMQ scheduler for post publishing | 8h | P0 |
| Platform API publishing (each platform) | 12h | P0 |
| Pause all posts emergency stop | 2h | P0 |
| Post analytics sync (reach, engagement) | 8h | P0 |
| Social analytics dashboard | 6h | P0 |
| Automation trigger → social post | 6h | P0 |

**Phase 4 deliverable:** Full social media auto-posting engine live ✅

---

## PHASE 5: POLISH + LAUNCH (Weeks 13-14)

### Week 13: QA + Performance
| Task | Hours | Priority |
|------|-------|----------|
| Mobile responsive QA (all screens) | 12h | P0 |
| Performance audit (Lighthouse 90+) | 8h | P0 |
| Load testing (100k concurrent sim) | 6h | P0 |
| Security audit (OWASP Top 10) | 8h | P0 |
| GDPR compliance review | 4h | P0 |
| Error handling + user-facing messages | 6h | P0 |
| White-label settings (domain, logo, colors) | 8h | P1 |
| Admin panel (internal) | 8h | P0 |

### Week 14: Launch Prep
| Task | Hours | Priority |
|------|-------|----------|
| Onboarding flow (wizard, first-time UX) | 10h | P0 |
| Help documentation | 8h | P1 |
| Pricing page + Stripe checkout (public) | 6h | P0 |
| Email sequences: trial → conversion | 6h | P0 |
| CI/CD pipeline (GitHub Actions) | 4h | P0 |
| Monitoring + alerting (Datadog/Sentry) | 4h | P0 |
| Production deployment + smoke tests | 6h | P0 |
| Soft launch (beta users: 50) | - | P0 |

---

## Technology Decisions Log

| Decision | Choice | Reason |
|----------|--------|--------|
| AI primary | Claude Sonnet 4 | Best conversational quality, tool use |
| AI fallback | GPT-4o | Image gen, broad capability |
| Email | Resend | Modern API, developer-friendly, ZA delivery |
| SMS | Twilio | Global coverage, best ZA rates |
| Payments | Stripe + PayFast | International + ZAR local payments |
| PDF | Puppeteer | Browser-rendered, pixel-perfect branded PDFs |
| Queue | BullMQ + Redis | Reliable, type-safe, great DX |
| Social scheduling | BullMQ | Avoid Buffer dependency, more control |
| Vector DB | Pinecone | Managed, scalable, serverless |

---

## Resource Requirements

| Role | Phase 1-2 | Phase 3-4 | Phase 5 |
|------|-----------|-----------|---------|
| Lead Full-Stack Dev | 1 | 1 | 1 |
| Backend Dev | 0 | 1 | 1 |
| Frontend Dev | 1 | 1 | 1 |
| DevOps | 0.5 | 0.5 | 0.5 |
| UI/UX Designer | 0.5 | 0.5 | 0 |
| QA | 0 | 0.5 | 1 |

**Budget estimate:**
- Infrastructure (AWS + Vercel): ~$400-800/month during dev
- AI API costs (dev): ~$200-500/month
- Third-party APIs (Twilio, Resend, Pinecone): ~$200-400/month
- Total monthly dev burn: ~$800-1,700
