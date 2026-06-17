# FINPAL™ SalesOS — REST API Design v1.0

## Base URL: https://api.finpal.online/v1

---

## Authentication

All requests (except public widget + auth endpoints) require:
```
Authorization: Bearer {jwt_access_token}
X-Tenant-ID: {tenant_id}
Content-Type: application/json
```

API Key authentication (for integrations):
```
X-API-Key: fp_live_{key}
```

---

## Rate Limiting

| Plan | Rate Limit | AI Endpoints |
|------|-----------|-------------|
| Starter | 500 req/min | 20 req/min |
| Professional | 2000 req/min | 100 req/min |
| Agency | 5000 req/min | 300 req/min |
| Enterprise | Custom | Custom |

Headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Standard Response Format

```json
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 150 }
}

// Error
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Contact not found",
    "details": {}
  }
}
```

---

## MODULE 1: AUTH ENDPOINTS

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new tenant + owner |
| POST | /auth/login | Login, returns JWT pair |
| POST | /auth/logout | Invalidate session |
| POST | /auth/refresh | Refresh access token |
| POST | /auth/forgot-password | Send reset email |
| POST | /auth/reset-password | Reset with token |
| POST | /auth/verify-email | Verify email token |
| POST | /auth/2fa/setup | Generate 2FA secret + QR |
| POST | /auth/2fa/verify | Verify TOTP code |
| POST | /auth/2fa/disable | Disable 2FA |
| POST | /auth/sso/google | Google OAuth callback |
| POST | /auth/sso/microsoft | Microsoft OAuth callback |

**POST /auth/register**
```json
// Request
{
  "business_name": "Acme Sales Co",
  "email": "owner@acme.co.za",
  "password": "SecurePass123!",
  "full_name": "Jane Smith",
  "phone": "+27821234567",
  "plan": "starter"
}

// Response 201
{
  "success": true,
  "data": {
    "tenant_id": "uuid",
    "user_id": "uuid",
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900
  }
}
```

---

## MODULE 2: CONTACTS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /contacts | List contacts (paginated, filtered) |
| POST | /contacts | Create contact |
| GET | /contacts/:id | Get contact details |
| PUT | /contacts/:id | Update contact |
| DELETE | /contacts/:id | Soft delete contact |
| GET | /contacts/:id/activities | Contact activity timeline |
| GET | /contacts/:id/deals | Contact's deals |
| POST | /contacts/import | Bulk import (CSV) |
| POST | /contacts/export | Export contacts (CSV/XLSX) |
| POST | /contacts/:id/tags | Add tags |
| DELETE | /contacts/:id/tags/:tag | Remove tag |
| PUT | /contacts/:id/assign | Assign to user |
| GET | /contacts/search | Full-text search |

**GET /contacts**
```
Query params:
  page=1&limit=20
  stage=lead|active|retained|churned
  source=organic|referral|social|paid|chat
  assigned_to={user_id}
  tags[]=tag1&tags[]=tag2
  lead_score_min=0&lead_score_max=100
  created_after=2026-01-01
  created_before=2026-12-31
  search=john smith
  sort=created_at|-created_at|name|lead_score
```

**POST /contacts**
```json
{
  "name": "John Dlamini",
  "email": "john@company.co.za",
  "phone": "+27831234567",
  "company_id": "uuid",
  "source": "organic",
  "stage": "lead",
  "tags": ["warm", "enterprise"],
  "assigned_to": "user_uuid",
  "custom_fields": { "budget": "R50000" }
}
```

---

## MODULE 3: COMPANIES

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /companies | List companies |
| POST | /companies | Create company |
| GET | /companies/:id | Get company |
| PUT | /companies/:id | Update company |
| DELETE | /companies/:id | Soft delete |
| GET | /companies/:id/contacts | Company contacts |
| GET | /companies/:id/deals | Company deals |

---

## MODULE 4: DEALS / PIPELINE

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /deals | List deals (supports kanban view) |
| POST | /deals | Create deal |
| GET | /deals/:id | Get deal details |
| PUT | /deals/:id | Update deal |
| DELETE | /deals/:id | Soft delete |
| PUT | /deals/:id/stage | Move to stage (logs activity) |
| GET | /deals/pipeline | Pipeline view with stage counts + values |
| GET | /deals/forecast | Revenue forecast (30/60/90 days) |
| GET | /deals/analytics | Win/loss, velocity, conversion rates |
| PUT | /deals/:id/assign | Assign to user |

**GET /deals/pipeline**
```json
{
  "success": true,
  "data": {
    "stages": [
      {
        "name": "new_lead",
        "display": "New Lead",
        "count": 24,
        "total_value": 485000,
        "weighted_value": 97000,
        "deals": [{ ... }]
      }
    ],
    "total_pipeline_value": 2400000,
    "weighted_pipeline_value": 840000,
    "deals_count": 87
  }
}
```

---

## MODULE 5: ACTIVITIES & TASKS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /activities | List activities |
| POST | /activities | Log activity |
| GET | /tasks | List tasks |
| POST | /tasks | Create task |
| PUT | /tasks/:id | Update task |
| PUT | /tasks/:id/complete | Mark complete |
| DELETE | /tasks/:id | Delete task |

---

## MODULE 6: AI AGENTS / SALESPAL™

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /ai/agents | List agent configurations |
| PUT | /ai/agents/:type | Update agent config |
| POST | /ai/chat | Send message to agent |
| GET | /ai/conversations | List conversations |
| GET | /ai/conversations/:id | Get conversation + messages |
| PUT | /ai/conversations/:id/escalate | Escalate to human |
| PUT | /ai/conversations/:id/close | Close conversation |
| GET | /ai/conversations/stats | AI performance stats |

**POST /ai/chat**
```json
// Request
{
  "conversation_id": "uuid|null",   // null = new conversation
  "message": "Hi, I'm interested in your services",
  "channel": "website",
  "contact_id": "uuid|null",
  "page_url": "https://example.com/pricing",
  "metadata": {}
}

// Response
{
  "success": true,
  "data": {
    "conversation_id": "uuid",
    "message": {
      "id": "uuid",
      "role": "assistant",
      "content": "Hi there! I'm SalesPal™ — great to meet you...",
      "created_at": "2026-06-14T18:00:00Z"
    },
    "lead_score": 45,
    "suggested_action": "book_meeting|send_proposal|qualify_further"
  }
}
```

---

## MODULE 7: KNOWLEDGE BASE

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /knowledge-base | List documents |
| POST | /knowledge-base | Upload document |
| DELETE | /knowledge-base/:id | Remove document |
| GET | /knowledge-base/:id/status | Processing status |

---

## MODULE 8: PROPOSALS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /proposals | List proposals |
| POST | /proposals/generate | AI-generate proposal |
| POST | /proposals | Create manually |
| GET | /proposals/:id | Get proposal |
| PUT | /proposals/:id | Update |
| POST | /proposals/:id/send | Send to contact (email) |
| POST | /proposals/:id/pdf | Generate PDF |
| GET | /proposals/:id/track | Get view/open analytics |
| POST | /proposals/track/:token | Record view (public, no auth) |
| POST | /proposals/:id/sign | Submit e-signature |

**POST /proposals/generate**
```json
// Request
{
  "contact_id": "uuid",
  "deal_id": "uuid",
  "type": "proposal",
  "context": {
    "problem": "Struggling to convert website visitors",
    "solution_focus": "AI sales automation",
    "budget_range": "R5000-R10000/month",
    "timeline": "Start within 2 weeks"
  }
}

// Response — AI generates all sections
{
  "success": true,
  "data": {
    "proposal_id": "uuid",
    "content": {
      "executive_summary": "...",
      "problem_statement": "...",
      "proposed_solution": "...",
      "deliverables": [...],
      "pricing": { "items": [...], "total": 8500 },
      "terms": "...",
      "next_steps": "..."
    }
  }
}
```

---

## MODULE 9: PAYMENTS & INVOICES

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /invoices | List invoices |
| POST | /invoices | Create invoice |
| GET | /invoices/:id | Get invoice |
| PUT | /invoices/:id | Update invoice |
| POST | /invoices/:id/send | Email to client |
| POST | /invoices/:id/pdf | Generate PDF |
| POST | /invoices/:id/payment/stripe | Create Stripe payment intent |
| POST | /invoices/:id/payment/payfast | Create PayFast payment |
| POST | /invoices/:id/payment/record | Record manual payment |
| GET | /payments | List payments |
| GET | /subscriptions | List subscriptions |
| POST | /subscriptions | Create subscription |
| DELETE | /subscriptions/:id | Cancel subscription |

---

## MODULE 10: AUTOMATION ENGINE

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /automations | List workflows |
| POST | /automations | Create workflow |
| GET | /automations/:id | Get workflow |
| PUT | /automations/:id | Update workflow |
| DELETE | /automations/:id | Delete workflow |
| PUT | /automations/:id/toggle | Activate/deactivate |
| GET | /automations/:id/runs | Execution history |
| POST | /automations/trigger | Manual trigger (testing) |
| GET | /automations/templates | Pre-built templates |

---

## MODULE 11: SOCIAL MEDIA

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /social/accounts | List connected accounts |
| POST | /social/accounts/connect/:platform | OAuth connect |
| DELETE | /social/accounts/:id | Disconnect account |
| GET | /social/posts | List posts |
| POST | /social/posts | Create post |
| PUT | /social/posts/:id | Update post |
| DELETE | /social/posts/:id | Delete post |
| POST | /social/posts/:id/approve | Approve for publishing |
| POST | /social/posts/:id/reject | Reject with note |
| POST | /social/posts/:id/publish | Publish immediately |
| GET | /social/posts/:id/analytics | Post performance |
| GET | /social/calendar | Calendar view (monthly) |
| POST | /social/generate | AI-generate post (MarketingPal™) |
| POST | /social/repurpose | Repurpose for all platforms |
| GET | /social/analytics | Aggregate social analytics |
| POST | /social/pause-all | Emergency stop all scheduled posts |

**POST /social/generate**
```json
// Request
{
  "topic": "We just closed a R500,000 client deal",
  "tone": "celebratory",
  "goal": "social proof",
  "platforms": ["linkedin", "facebook", "instagram"],
  "include_hashtags": true,
  "include_cta": true,
  "variations": 3
}

// Response
{
  "success": true,
  "data": {
    "variations": [
      {
        "platform": "linkedin",
        "caption": "Thrilled to announce...",
        "hashtags": ["#SalesWin", "#Growth"],
        "cta": "What big wins have you had lately?",
        "character_count": 287,
        "image_prompt": "Professional celebration in modern office..."
      }
    ]
  }
}
```

---

## MODULE 12: ANALYTICS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /analytics/dashboard | Main dashboard metrics |
| GET | /analytics/revenue | Revenue breakdown |
| GET | /analytics/pipeline | Pipeline metrics |
| GET | /analytics/leads | Lead source analysis |
| GET | /analytics/social | Social performance |
| GET | /analytics/ai | AI agent performance |
| GET | /analytics/forecast | Revenue forecast |
| POST | /analytics/export | Export report (PDF/CSV) |

**GET /analytics/dashboard**
```
Query: date_range=mtd|ytd|all|custom&start=2026-01-01&end=2026-06-14
```
```json
{
  "success": true,
  "data": {
    "revenue": { "mtd": 145000, "ytd": 890000, "all_time": 2300000, "currency": "ZAR" },
    "pipeline": { "total_value": 2400000, "weighted_value": 840000, "deal_count": 87 },
    "conversion_rate": 23.5,
    "avg_deal_size": 28750,
    "sales_velocity_days": 18.3,
    "new_leads_this_month": 124,
    "ai_conversations_this_month": 340,
    "ai_bookings_this_month": 47,
    "social_reach_this_month": 28500
  }
}
```

---

## WEBHOOKS

### Incoming webhooks (Zapier, external apps):
`POST /webhooks/inbound/{tenant_id}/{webhook_token}`

### Outgoing webhooks (subscribe to events):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /webhooks | List webhook subscriptions |
| POST | /webhooks | Create subscription |
| DELETE | /webhooks/:id | Remove subscription |

Events: `contact.created`, `deal.won`, `deal.lost`, `deal.stage_changed`, `payment.received`, `proposal.viewed`, `proposal.accepted`, `chat.escalated`

---

## PUBLIC WIDGET API (No auth, CDN-served)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /widget/:widget_id/config | Widget settings + branding |
| POST | /widget/:widget_id/chat | Send chat message |
| POST | /widget/:widget_id/lead | Submit lead form |
| POST | /widget/:widget_id/book | Book appointment |

---

## ADMIN API (admin.finpal.online/api)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/tenants | List all tenants |
| GET | /admin/tenants/:id | Tenant details |
| PUT | /admin/tenants/:id/plan | Change plan |
| PUT | /admin/tenants/:id/suspend | Suspend tenant |
| GET | /admin/metrics | Platform-wide metrics |
| GET | /admin/users | All users |
