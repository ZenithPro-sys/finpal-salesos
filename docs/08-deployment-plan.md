# FINPAL™ SalesOS — Production Deployment Plan

## Deployment Philosophy
Progressive rollout: Vercel (MVP) → Full AWS (Scale). Start simple, migrate when revenue justifies it.

---

## STAGE 1: MVP DEPLOYMENT (Week 6 — Day 1)

### Stack (Serverless-first)
```
Frontend + API:   Vercel (Next.js)
Database:         Neon.tech (Serverless PostgreSQL)
Redis:            Upstash (Serverless Redis)
File Storage:     AWS S3 + CloudFront
Widget CDN:       Cloudflare Pages
DNS:              Cloudflare
SSL:              Automatic (Vercel + Cloudflare)
Email:            Resend
AI:               Anthropic API + OpenAI API
Vector DB:        Pinecone
```

### Environment Variables (Vercel)
```bash
# Database
DATABASE_URL="postgresql://user:pass@ep-xxxx.neon.tech/finpal?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxxx.neon.tech/finpal?sslmode=require"

# Auth
JWT_SECRET="[32-char random]"
JWT_REFRESH_SECRET="[32-char random]"
NEXTAUTH_URL="https://app.finpal.online"
NEXTAUTH_SECRET="[32-char random]"

# AI
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="..."
PINECONE_INDEX_NAME="finpal-rag"

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@finpal.online"

# Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Storage
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="af-south-1"
AWS_S3_BUCKET="finpal-uploads"
CDN_BASE_URL="https://cdn.finpal.online"

# Payments (Phase 3)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PAYFAST_MERCHANT_ID="..."
PAYFAST_MERCHANT_KEY="..."

# Comms (Phase 2)
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_FROM_NUMBER="+27..."
```

### DNS Configuration (Cloudflare)
```
app.finpal.online       → CNAME → cname.vercel-dns.com (Proxied)
api.finpal.online       → CNAME → cname.vercel-dns.com (Proxied)
widget.finpal.online    → CNAME → finpal-widget.pages.dev (Proxied)
admin.finpal.online     → CNAME → cname.vercel-dns.com (Proxied, IP restricted)
cdn.finpal.online       → CNAME → [CloudFront distribution] (Proxied)
```

### Vercel Project Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link --project finpal-salesos

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL production
# ... (all vars above)

# Custom domain
vercel domains add app.finpal.online
```

---

## STAGE 2: FULL AWS DEPLOYMENT (Month 3+ — Post Revenue)

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION AWS                           │
│  Region: af-south-1 (Cape Town) — Primary                       │
│  Region: us-east-1 — Failover / DR                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Route53 → Cloudflare → ALB (Application Load Balancer)         │
│                            │                                      │
│                ┌───────────┼──────────────┐                      │
│                │           │              │                      │
│           ┌────▼───┐ ┌─────▼────┐ ┌──────▼───┐                │
│           │ ECS    │ │ ECS      │ │ ECS      │                │
│           │ API    │ │ WebSocket│ │ Workers  │                │
│           │ Tasks  │ │ Server   │ │ BullMQ   │                │
│           │ Fargate│ │ Fargate  │ │ Fargate  │                │
│           └────┬───┘ └─────┬────┘ └──────┬───┘                │
│                │           │              │                      │
│           ┌────▼───────────▼──────────────▼───┐                │
│           │           ElastiCache Redis        │                │
│           │           (cluster mode, 3 nodes)  │                │
│           └────────────────────────────────────┘                │
│                │                                                 │
│           ┌────▼────────────────────────────────┐              │
│           │  RDS PostgreSQL Multi-AZ             │              │
│           │  Primary (write) + Read Replica      │              │
│           │  PgBouncer connection pooling         │              │
│           └──────────────────────────────────────┘              │
│                                                                   │
│  S3 (uploads) → CloudFront CDN (assets, widget, PDFs)           │
│  ECR (Docker image registry)                                      │
│  Secrets Manager (all env vars)                                  │
│  CloudWatch (logs, alarms, dashboards)                           │
│  Parameter Store (config)                                        │
└─────────────────────────────────────────────────────────────────┘
```

### ECS Task Definitions

#### API Service
```json
{
  "family": "finpal-api",
  "cpu": "1024",
  "memory": "2048",
  "networkMode": "awsvpc",
  "containerDefinitions": [{
    "name": "api",
    "image": "ECR_URI/finpal-api:latest",
    "portMappings": [{"containerPort": 3000}],
    "environment": [
      {"name": "NODE_ENV", "value": "production"}
    ],
    "secrets": [
      {"name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:..."}
    ],
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
      "interval": 30,
      "timeout": 5,
      "retries": 3
    },
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/finpal-api",
        "awslogs-region": "af-south-1"
      }
    }
  }]
}
```

### Auto Scaling Policy
```json
{
  "MinCapacity": 2,
  "MaxCapacity": 50,
  "ScalableTargetAction": {
    "MinCapacity": 2,
    "MaxCapacity": 50
  },
  "ScalingPolicies": [
    {
      "PolicyName": "cpu-scaling",
      "TargetValue": 70.0,
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    {
      "PolicyName": "memory-scaling", 
      "TargetValue": 75.0,
      "PredefinedMetricType": "ECSServiceAverageMemoryUtilization"
    }
  ]
}
```

---

## CI/CD Pipeline (GitHub Actions)

### `.github/workflows/deploy.yml`
```yaml
name: Deploy FINPAL™ SalesOS

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t finpal-api .
      - name: Push to ECR
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws ecr get-login-password --region af-south-1 | \
          docker login --username AWS --password-stdin $ECR_URI
          docker tag finpal-api:latest $ECR_URI/finpal-api:latest
          docker tag finpal-api:latest $ECR_URI/finpal-api:${{ github.sha }}
          docker push $ECR_URI/finpal-api:latest
          docker push $ECR_URI/finpal-api:${{ github.sha }}

  deploy-staging:
    needs: build
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging (Vercel preview)
        run: vercel deploy --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production (ECS)
        run: |
          aws ecs update-service \
            --cluster finpal-prod \
            --service finpal-api \
            --force-new-deployment \
            --region af-south-1
      - name: Deploy frontend (Vercel)
        run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Run smoke tests
        run: npm run test:smoke
      - name: Notify Slack
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
          -H 'Content-type: application/json' \
          -d '{"text":"✅ FINPAL™ deployed to production successfully"}'
```

---

## Database Migrations (Prisma)

```bash
# Development
npx prisma migrate dev --name "add_social_accounts"

# Production (CI/CD)
npx prisma migrate deploy

# Seed (initial data)
npx prisma db seed
```

**Migration strategy:**
- All schema changes via Prisma migrations (version controlled)
- Zero-downtime migrations: additive only (no DROP in same deploy)
- Breaking changes: 3-step process (add new → migrate data → remove old)
- Backups: RDS automated daily + pre-migration manual snapshot

---

## Monitoring + Alerting

### CloudWatch Alarms
```
CPU > 80% for 5 min → Scale up + notify
Memory > 85% for 5 min → Scale up + notify
API 5xx rate > 1% → PagerDuty alert (critical)
API p99 latency > 2s → Slack alert (warning)
Queue depth > 1000 → Scale workers
DB connections > 80% pool → Alert
```

### Logging
```
Application: Winston → CloudWatch Logs
Access logs: ALB → CloudWatch Logs + S3
AI interactions: Custom table + CloudWatch
Error tracking: Sentry (with source maps)
Performance: Datadog APM
Uptime: Better Uptime (public status page: status.finpal.online)
```

---

## Backup Strategy

| Data | Frequency | Retention | Method |
|------|-----------|-----------|--------|
| PostgreSQL | Daily automated | 30 days | RDS snapshots |
| PostgreSQL | Before migrations | 90 days | Manual RDS snapshot |
| S3 files | Continuous | 90 days | S3 versioning |
| Redis | Daily | 7 days | ElastiCache backup |
| Pinecone | Weekly export | 30 days | Pinecone backup API |

---

## Launch Checklist

```
PRE-LAUNCH
□ All environment variables set in production
□ Database migrations applied
□ Seed data (plans, default templates) loaded
□ SSL certificates valid on all domains
□ Cloudflare proxying correctly
□ Widget JS accessible at widget.finpal.online
□ CORS configured correctly
□ Rate limiting active
□ Health check endpoint returns 200
□ Sentry error tracking receiving events
□ Resend domain verified (SPF, DKIM, DMARC)
□ Stripe webhook endpoint registered
□ PayFast IPN URL registered

LAUNCH DAY
□ Deploy to production
□ Smoke test all critical paths (auth, chat, proposals)
□ Monitor error rate (Sentry) — must be < 0.1%
□ Monitor response times (< 500ms p95)
□ First 10 users onboarded manually
□ Slack #production channel alerts active

POST-LAUNCH (Week 1)
□ Daily review of error logs
□ Review AI conversation quality
□ Review email deliverability (Resend dashboard)
□ Collect user feedback (in-app widget)
□ Fix critical bugs within 24h
□ Weekly: review infrastructure costs
```
