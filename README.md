# FINPAL™ SalesOS

> AI-powered CRM & Sales Automation Platform for South African businesses.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack: Next.js 14](https://img.shields.io/badge/Stack-Next.js%2014-black)](https://nextjs.org)
[![DB: PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-blue)](https://neon.tech)

## 🚀 What is FINPAL™ SalesOS?

FINPAL™ SalesOS is a full-stack AI sales operating system built for entrepreneurs, sales teams, and agencies. It combines a CRM, Kanban pipeline, AI chat agents, social media automation, proposal generation, and payment tracking — all in one platform.

## 💰 Pricing

| Plan | Price | Users | Contacts |
|------|-------|-------|----------|
| Starter | $29/mo | 2 | 500 |
| Professional | $79/mo | 10 | 5,000 |
| Agency | $299/mo | Unlimited | Unlimited |

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TailwindCSS, shadcn/ui
- **Backend:** Next.js API Routes + Deno Edge Functions
- **Database:** Neon PostgreSQL (multi-tenant, schema-per-tenant)
- **AI/RAG:** Claude Sonnet + Pinecone vector DB
- **Cache:** Upstash Redis
- **Auth:** NextAuth.js v5
- **Deployment:** Vercel (zero-cost free tier)
- **Email:** Resend
- **Payments:** Stripe + PayFast (ZAR)

## 📁 Project Structure

```
finpal-salesos/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/             # Login, signup, reset
│   ├── (dashboard)/        # Main CRM dashboard
│   ├── api/                # API routes
│   └── widget/             # Embeddable widget
├── components/             # Shared UI components
├── lib/                    # Utilities, DB, AI clients
├── docs/                   # Architecture & planning docs
├── schemas/                # PostgreSQL schema
└── tests/                  # Unit & integration tests
```

## 📖 Documentation

- [Architecture Overview](docs/01-architecture.md)
- [Database Schema](docs/02-database-schema.sql)
- [API Design](docs/03-api-design.md)
- [User Journeys](docs/04-user-journeys.md)
- [MVP Spec](docs/07-mvp-spec.md)
- [Dev Roadmap](docs/06-dev-roadmap.md)
- [Deployment Plan](docs/08-deployment-plan.md)
- [Monetization Strategy](docs/09-monetization-strategy.md)

## 🎨 Brand

- **Primary:** `#00D9FF` (Neon Blue)
- **Background:** `#0B0C10` (Obsidian Black)
- **Text:** `#CFD8E3` (Silver Chrome)

## 🤖 AI Architect

This project is co-built with **Tanya** — FINPAL™'s AI Architect & Co-founder.

---
_Built by Zenith Intel • FINPAL™ © 2026_
