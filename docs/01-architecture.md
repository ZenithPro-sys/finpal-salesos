# FINPAL™ SalesOS — Full Software Architecture

## System Overview

FINPAL™ SalesOS is a multi-tenant, AI-powered SaaS platform built for horizontal scalability at 100,000+ concurrent users. The architecture follows a microservices-adjacent monorepo approach with clear service boundaries, enabling independent scaling of compute-heavy workloads (AI, social posting, email queues) from the core CRM API.

---

## Architecture Diagram (Text Representation)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Web App      │  │ Embed Widget │  │ Mobile (PWA)             │  │
│  │ app.finpal   │  │ widget.js    │  │ Responsive React         │  │
│  │ Next.js 14   │  │ Vanilla JS   │  │                          │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘  │
└─────────┼────────────────┼──────────────────────────┼───────────────┘
          │                │                          │
          ▼                ▼                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     API GATEWAY / EDGE LAYER                         │
│         Cloudflare (DDoS, CDN, DNS, SSL termination)                 │
│         Rate Limiting: 1000 req/min per tenant                       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  REST API        │  │  WebSocket       │  │  Webhook         │
│  api.finpal      │  │  Server          │  │  Receiver        │
│  Node/Express    │  │  (Socket.io)     │  │  (Stripe, Meta,  │
│  Prisma ORM      │  │  Real-time chat  │  │   Twilio, etc.)  │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                      │
         └─────────────────────┴──────────────────────┘
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                 ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Core Services  │  │  AI Services    │  │  Queue Workers  │
│                 │  │                 │  │                 │
│  • CRM          │  │  • SalesPal™    │  │  • Email Queue  │
│  • Pipeline     │  │  • SupportPal™  │  │  • SMS Queue    │
│  • Auth/Users   │  │  • MarketingPal │  │  • Social Queue │
│  • Payments     │  │  • OpsPal™      │  │  • AI Tasks     │
│  • Proposals    │  │  Claude Sonnet  │  │  BullMQ+Redis   │
│  • Social       │  │  GPT-4o         │  │                 │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                     │
         └────────────────────┴─────────────────────┘
                              │
         ┌────────────────────┼─────────────────────┐
         ▼                    ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  PostgreSQL     │  │  Redis          │  │  S3/Storage     │
│  (Primary DB)   │  │  (Cache+Queue)  │  │  (Files, PDFs,  │
│  RDS Multi-AZ   │  │  ElastiCache    │  │   Images, Docs) │
│  Read replicas  │  │                 │  │  CloudFront CDN │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Pinecone       │
│  Vector DB      │
│  (RAG + AI      │
│   knowledge)    │
└─────────────────┘
```

---

## Multi-Tenancy Model

Every database table includes a `tenant_id` foreign key. Row-Level Security (RLS) enforced at PostgreSQL level. Tenant isolation guaranteed — no cross-tenant data leakage possible.

```
Tenant (workspace) → Users → All data scoped by tenant_id
```

**Tenant isolation strategy:**
- Shared database, separate schemas per tenant (schema-per-tenant approach)
- Each tenant gets: `tenant_{uuid}` Postgres schema
- Public schema: shared auth, billing, platform config
- Connection pooling: PgBouncer (transaction mode) for 100k+ connections

---

## Scaling Strategy

| Component | Strategy | Trigger |
|-----------|----------|---------|
| API servers | Horizontal (ECS auto-scaling) | CPU > 70% |
| WebSocket | Sticky sessions + Redis pub/sub | Connection count |
| Queue workers | Separate ECS task per queue type | Queue depth |
| AI services | Rate-limited, async via queue | Always async |
| Database reads | Read replicas + Redis cache | Read load |
| Database writes | Connection pooling | Write throughput |
| File storage | S3 + CloudFront CDN | Always CDN |

---

## Security Architecture

- JWT + Refresh Token rotation (15min access / 7d refresh)
- 2FA via TOTP (Google Authenticator compatible)
- SSO: SAML 2.0 + OAuth 2.0 (Google, Microsoft)
- Encryption at rest: AES-256 (RDS + S3)
- Encryption in transit: TLS 1.3
- API keys: hashed with bcrypt, stored as prefix+hash
- GDPR: Right-to-erasure, data export, audit logs
- WAF: Cloudflare rules, SQL injection, XSS protection

---

## Infrastructure (AWS)

```
Region: af-south-1 (Cape Town) primary + us-east-1 failover

VPC:
  ├── Public subnet: Load balancers, NAT Gateway
  ├── Private subnet: App servers, DB, Redis, Workers
  └── Database subnet: RDS, isolated

Services:
  ├── ECS Fargate: API, Workers, WebSocket
  ├── RDS PostgreSQL: Multi-AZ, automated backups
  ├── ElastiCache Redis: Cluster mode
  ├── S3: File storage, static assets
  ├── CloudFront: CDN, widget delivery
  ├── SES: Email fallback
  ├── Route53: DNS
  └── ACM: SSL certificates
```

---

## Deployment Targets

| Subdomain | Purpose | Hosting |
|-----------|---------|---------|
| app.finpal.online | Main SaaS dashboard | Vercel + Next.js |
| api.finpal.online | REST API | AWS ECS Fargate |
| widget.finpal.online | Embed widget CDN | CloudFront + S3 |
| admin.finpal.online | Internal admin | Vercel (restricted IP) |
| ws.finpal.online | WebSocket server | AWS ECS (sticky) |
