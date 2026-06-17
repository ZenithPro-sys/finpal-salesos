-- ============================================================
-- FINPAL™ SalesOS — PostgreSQL Database Schema v1.0
-- Multi-tenant, schema-per-tenant architecture
-- ============================================================

-- ============================================================
-- PUBLIC SCHEMA: Platform-wide (auth, billing, tenants)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TENANTS (Workspaces)
CREATE TABLE public.tenants (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug            VARCHAR(63) UNIQUE NOT NULL,
    name            VARCHAR(255) NOT NULL,
    domain          VARCHAR(255),                          -- custom domain
    logo_url        TEXT,
    brand_color     VARCHAR(7) DEFAULT '#00D9FF',
    plan            VARCHAR(50) DEFAULT 'starter',         -- starter|professional|agency|enterprise
    plan_status     VARCHAR(20) DEFAULT 'trial',           -- trial|active|suspended|cancelled
    trial_ends_at   TIMESTAMP WITH TIME ZONE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    payfast_subscription_id VARCHAR(255),
    widget_id       UUID UNIQUE DEFAULT uuid_generate_v4(), -- for embed widget
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE              -- soft delete
);

CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_widget_id ON public.tenants(widget_id);

-- USERS (Platform-wide, linked to tenants)
CREATE TABLE public.users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    email           VARCHAR(255) NOT NULL,
    email_verified  BOOLEAN DEFAULT FALSE,
    password_hash   TEXT,
    full_name       VARCHAR(255),
    avatar_url      TEXT,
    role            VARCHAR(50) DEFAULT 'sales_rep',       -- owner|manager|sales_rep|support|read_only
    phone           VARCHAR(50),
    timezone        VARCHAR(100) DEFAULT 'Africa/Johannesburg',
    language        VARCHAR(10) DEFAULT 'en',
    two_fa_enabled  BOOLEAN DEFAULT FALSE,
    two_fa_secret   TEXT,
    last_login_at   TIMESTAMP WITH TIME ZONE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant_id ON public.users(tenant_id);
CREATE INDEX idx_users_email ON public.users(email);

-- SESSIONS
CREATE TABLE public.sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    refresh_token   TEXT NOT NULL,
    expires_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON public.sessions(refresh_token);

-- API KEYS
CREATE TABLE public.api_keys (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES public.users(id),
    name            VARCHAR(255) NOT NULL,
    key_prefix      VARCHAR(12) NOT NULL,                  -- "fp_live_xxxx"
    key_hash        TEXT NOT NULL,                         -- bcrypt hashed full key
    permissions     JSONB DEFAULT '["read"]',
    last_used_at    TIMESTAMP WITH TIME ZONE,
    expires_at      TIMESTAMP WITH TIME ZONE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE public.audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    user_id         UUID,
    action          VARCHAR(255) NOT NULL,                 -- "contact.created", "deal.stage_changed"
    resource_type   VARCHAR(100),
    resource_id     UUID,
    old_data        JSONB,
    new_data        JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant_id ON public.audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- SUBSCRIPTION PLANS
CREATE TABLE public.subscription_plans (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(50) UNIQUE NOT NULL,           -- starter|professional|agency|enterprise
    display_name    VARCHAR(100) NOT NULL,
    price_monthly   DECIMAL(10,2),
    price_annual    DECIMAL(10,2),
    currency        VARCHAR(3) DEFAULT 'USD',
    max_users       INTEGER,
    max_contacts    INTEGER,
    max_deals       INTEGER,
    max_social_accounts INTEGER,
    max_automations INTEGER,
    features        JSONB DEFAULT '[]',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TENANT SCHEMA TEMPLATE (created per tenant as tenant_{uuid})
-- All tables below prefixed with schema context
-- ============================================================

-- For readability, shown without schema prefix.
-- In production: CREATE SCHEMA tenant_{uuid}; SET search_path = tenant_{uuid};

-- CONTACTS
CREATE TABLE contacts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(50),
    company_id      UUID,
    source          VARCHAR(100),                          -- organic|referral|social|paid|chat|import
    stage           VARCHAR(50) DEFAULT 'lead',            -- lead|active|retained|churned
    lifecycle_stage VARCHAR(50) DEFAULT 'new_lead',        -- new_lead|contacted|qualified|customer|churned
    lead_score      INTEGER DEFAULT 0,                     -- 0-100
    tags            TEXT[] DEFAULT '{}',
    assigned_to     UUID,                                  -- user_id
    avatar_url      TEXT,
    linkedin_url    TEXT,
    twitter_url     TEXT,
    website         TEXT,
    address         JSONB,                                 -- {street, city, province, country, postal}
    custom_fields   JSONB DEFAULT '{}',
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    do_not_contact  BOOLEAN DEFAULT FALSE,
    gdpr_consent    BOOLEAN DEFAULT FALSE,
    gdpr_consent_at TIMESTAMP WITH TIME ZONE,
    created_by      UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contacts_tenant_id ON contacts(tenant_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_stage ON contacts(stage);
CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX idx_contacts_lead_score ON contacts(lead_score DESC);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- COMPANIES
CREATE TABLE companies (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    name            VARCHAR(255) NOT NULL,
    industry        VARCHAR(100),
    size            VARCHAR(50),                           -- 1-10|11-50|51-200|201-1000|1000+
    website         VARCHAR(255),
    email           VARCHAR(255),
    phone           VARCHAR(50),
    linkedin_url    TEXT,
    address         JSONB,
    annual_revenue  DECIMAL(15,2),
    description     TEXT,
    tags            TEXT[] DEFAULT '{}',
    assigned_to     UUID,
    custom_fields   JSONB DEFAULT '{}',
    created_by      UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_companies_tenant_id ON companies(tenant_id);
CREATE INDEX idx_companies_name ON companies(name);

-- DEALS
CREATE TABLE deals (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    title           VARCHAR(255) NOT NULL,
    value           DECIMAL(15,2) DEFAULT 0,
    currency        VARCHAR(3) DEFAULT 'ZAR',
    stage           VARCHAR(50) DEFAULT 'new_lead',
    -- stages: new_lead|contacted|qualified|discovery|proposal_sent|negotiation|won|lost
    probability     INTEGER DEFAULT 20,                    -- 0-100%
    close_date      DATE,
    contact_id      UUID REFERENCES contacts(id),
    company_id      UUID REFERENCES companies(id),
    pipeline_id     UUID,
    assigned_to     UUID,
    source          VARCHAR(100),
    lost_reason     TEXT,
    won_reason      TEXT,
    description     TEXT,
    custom_fields   JSONB DEFAULT '{}',
    last_activity_at TIMESTAMP WITH TIME ZONE,
    created_by      UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_deals_tenant_id ON deals(tenant_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_contact_id ON deals(contact_id);
CREATE INDEX idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX idx_deals_close_date ON deals(close_date);
CREATE INDEX idx_deals_value ON deals(value DESC);

-- PIPELINES (Custom pipeline configurations)
CREATE TABLE pipelines (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    name            VARCHAR(255) NOT NULL,
    is_default      BOOLEAN DEFAULT FALSE,
    stages          JSONB NOT NULL,                        -- [{name, order, probability, color}]
    created_by      UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ACTIVITIES
CREATE TABLE activities (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    type            VARCHAR(50) NOT NULL,
    -- types: email|call|meeting|note|task|sms|chat|proposal|payment|stage_change|ai_interaction
    subject         VARCHAR(255),
    note            TEXT,
    contact_id      UUID REFERENCES contacts(id),
    deal_id         UUID REFERENCES deals(id),
    company_id      UUID REFERENCES companies(id),
    created_by      UUID,                                  -- user_id or 'ai_agent'
    due_at          TIMESTAMP WITH TIME ZONE,
    completed_at    TIMESTAMP WITH TIME ZONE,
    outcome         VARCHAR(100),
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activities_tenant_id ON activities(tenant_id);
CREATE INDEX idx_activities_contact_id ON activities(contact_id);
CREATE INDEX idx_activities_deal_id ON activities(deal_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);

-- TASKS
CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    status          VARCHAR(50) DEFAULT 'pending',         -- pending|in_progress|completed|cancelled
    priority        VARCHAR(20) DEFAULT 'medium',          -- low|medium|high|urgent
    assigned_to     UUID,
    contact_id      UUID REFERENCES contacts(id),
    deal_id         UUID REFERENCES deals(id),
    due_at          TIMESTAMP WITH TIME ZONE,
    completed_at    TIMESTAMP WITH TIME ZONE,
    created_by      UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_at ON tasks(due_at);

-- ============================================================
-- AI / CHAT MODULE
-- ============================================================

-- AI AGENT CONFIGURATIONS
CREATE TABLE ai_agents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    type            VARCHAR(50) NOT NULL,                  -- salespal|supportpal|marketingpal|opspal
    name            VARCHAR(100) NOT NULL,
    personality     TEXT,
    system_prompt   TEXT,
    model           VARCHAR(100) DEFAULT 'claude-sonnet-4-6',
    temperature     DECIMAL(3,2) DEFAULT 0.7,
    is_active       BOOLEAN DEFAULT TRUE,
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KNOWLEDGE BASE
CREATE TABLE knowledge_base (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    title           VARCHAR(255) NOT NULL,
    content_type    VARCHAR(50),                           -- pdf|text|faq|url|docx
    file_url        TEXT,
    content         TEXT,
    chunk_count     INTEGER DEFAULT 0,
    vector_namespace VARCHAR(255),                         -- Pinecone namespace
    is_processed    BOOLEAN DEFAULT FALSE,
    created_by      UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHAT CONVERSATIONS
CREATE TABLE chat_conversations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    contact_id      UUID REFERENCES contacts(id),
    channel         VARCHAR(50) DEFAULT 'website',         -- website|email|sms|whatsapp
    status          VARCHAR(50) DEFAULT 'open',            -- open|qualified|escalated|closed
    agent_type      VARCHAR(50) DEFAULT 'salespal',
    lead_score      INTEGER DEFAULT 0,
    bant_budget     VARCHAR(100),
    bant_authority  VARCHAR(100),
    bant_need       TEXT,
    bant_timeline   VARCHAR(100),
    assigned_to     UUID,                                  -- human agent if escalated
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_conversations_tenant_id ON chat_conversations(tenant_id);
CREATE INDEX idx_chat_conversations_contact_id ON chat_conversations(contact_id);
CREATE INDEX idx_chat_conversations_status ON chat_conversations(status);

-- CHAT MESSAGES
CREATE TABLE chat_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    tenant_id       UUID NOT NULL,
    role            VARCHAR(20) NOT NULL,                  -- user|assistant|system
    content         TEXT NOT NULL,
    tokens_used     INTEGER DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- ============================================================
-- PROPOSALS MODULE
-- ============================================================

CREATE TABLE proposals (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    title           VARCHAR(255) NOT NULL,
    contact_id      UUID REFERENCES contacts(id),
    deal_id         UUID REFERENCES deals(id),
    type            VARCHAR(50) DEFAULT 'proposal',        -- proposal|sow|agreement|retainer
    status          VARCHAR(50) DEFAULT 'draft',           -- draft|sent|viewed|accepted|rejected|expired
    content         JSONB NOT NULL,                        -- structured sections
    total_value     DECIMAL(15,2),
    currency        VARCHAR(3) DEFAULT 'ZAR',
    valid_until     DATE,
    pdf_url         TEXT,
    docx_url        TEXT,
    tracking_token  UUID UNIQUE DEFAULT uuid_generate_v4(),
    viewed_at       TIMESTAMP WITH TIME ZONE,
    view_count      INTEGER DEFAULT 0,
    accepted_at     TIMESTAMP WITH TIME ZONE,
    signature_data  JSONB,
    created_by      UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_proposals_tenant_id ON proposals(tenant_id);
CREATE INDEX idx_proposals_tracking_token ON proposals(tracking_token);
CREATE INDEX idx_proposals_status ON proposals(status);

-- ============================================================
-- PAYMENTS MODULE
-- ============================================================

CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    invoice_number  VARCHAR(50) NOT NULL,
    contact_id      UUID REFERENCES contacts(id),
    deal_id         UUID REFERENCES deals(id),
    status          VARCHAR(50) DEFAULT 'draft',           -- draft|sent|viewed|partial|paid|overdue|cancelled
    line_items      JSONB NOT NULL DEFAULT '[]',
    subtotal        DECIMAL(15,2) DEFAULT 0,
    tax_rate        DECIMAL(5,2) DEFAULT 15,               -- VAT 15% default (ZA)
    tax_amount      DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount    DECIMAL(15,2) DEFAULT 0,
    amount_paid     DECIMAL(15,2) DEFAULT 0,
    currency        VARCHAR(3) DEFAULT 'ZAR',
    due_date        DATE,
    paid_at         TIMESTAMP WITH TIME ZONE,
    notes           TEXT,
    pdf_url         TEXT,
    created_by      UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_tenant_id ON invoices(tenant_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    invoice_id      UUID REFERENCES invoices(id),
    contact_id      UUID REFERENCES contacts(id),
    amount          DECIMAL(15,2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'ZAR',
    payment_method  VARCHAR(50),                           -- stripe|paypal|payfast|bank_transfer
    status          VARCHAR(50) DEFAULT 'pending',         -- pending|processing|completed|failed|refunded
    provider_id     VARCHAR(255),                          -- stripe charge id, etc.
    provider_data   JSONB DEFAULT '{}',
    processed_at    TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE subscriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    contact_id      UUID REFERENCES contacts(id),
    plan_name       VARCHAR(100) NOT NULL,
    amount          DECIMAL(15,2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'ZAR',
    interval        VARCHAR(20) NOT NULL,                  -- weekly|monthly|annual
    status          VARCHAR(50) DEFAULT 'active',          -- active|paused|cancelled|expired
    provider        VARCHAR(50),                           -- stripe|payfast|paypal
    provider_id     VARCHAR(255),
    current_period_start DATE,
    current_period_end DATE,
    cancelled_at    TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- AUTOMATION ENGINE
-- ============================================================

CREATE TABLE automation_workflows (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    trigger_type    VARCHAR(100) NOT NULL,
    trigger_config  JSONB NOT NULL DEFAULT '{}',
    actions         JSONB NOT NULL DEFAULT '[]',
    conditions      JSONB DEFAULT '[]',
    run_count       INTEGER DEFAULT 0,
    last_run_at     TIMESTAMP WITH TIME ZONE,
    created_by      UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_automation_workflows_tenant_id ON automation_workflows(tenant_id);
CREATE INDEX idx_automation_workflows_trigger_type ON automation_workflows(trigger_type);

CREATE TABLE automation_runs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id     UUID NOT NULL REFERENCES automation_workflows(id),
    tenant_id       UUID NOT NULL,
    trigger_data    JSONB,
    status          VARCHAR(50) DEFAULT 'running',         -- running|completed|failed|skipped
    actions_run     JSONB DEFAULT '[]',
    error           TEXT,
    started_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at    TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_automation_runs_workflow_id ON automation_runs(workflow_id);
CREATE INDEX idx_automation_runs_tenant_id ON automation_runs(tenant_id);

CREATE TABLE email_sequences (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    name            VARCHAR(255) NOT NULL,
    steps           JSONB NOT NULL DEFAULT '[]',           -- [{delay_days, subject, body_template}]
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE email_sequence_enrolments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sequence_id     UUID NOT NULL REFERENCES email_sequences(id),
    tenant_id       UUID NOT NULL,
    contact_id      UUID NOT NULL REFERENCES contacts(id),
    current_step    INTEGER DEFAULT 0,
    status          VARCHAR(50) DEFAULT 'active',          -- active|paused|completed|unsubscribed
    next_send_at    TIMESTAMP WITH TIME ZONE,
    enrolled_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at    TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_email_sequence_enrolments_next_send_at ON email_sequence_enrolments(next_send_at);

-- ============================================================
-- SOCIAL MEDIA MODULE
-- ============================================================

CREATE TABLE social_accounts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    platform        VARCHAR(50) NOT NULL,                  -- facebook|instagram|linkedin|twitter|tiktok
    account_type    VARCHAR(50),                           -- personal|page|business|company
    platform_user_id VARCHAR(255) NOT NULL,
    platform_username VARCHAR(255),
    display_name    VARCHAR(255),
    profile_picture TEXT,
    access_token    TEXT,                                  -- encrypted
    refresh_token   TEXT,                                  -- encrypted
    token_expires_at TIMESTAMP WITH TIME ZONE,
    page_id         VARCHAR(255),                          -- for FB pages
    follower_count  INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    last_sync_at    TIMESTAMP WITH TIME ZONE,
    connected_by    UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, platform, platform_user_id)
);

CREATE INDEX idx_social_accounts_tenant_id ON social_accounts(tenant_id);

CREATE TABLE social_posts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    title           VARCHAR(255),
    content         TEXT NOT NULL,
    platforms       TEXT[] NOT NULL,                       -- ['facebook', 'instagram', 'linkedin']
    media_urls      TEXT[] DEFAULT '{}',
    media_type      VARCHAR(50),                           -- image|video|carousel|story|reel
    hashtags        TEXT[] DEFAULT '{}',
    status          VARCHAR(50) DEFAULT 'draft',           -- draft|pending_approval|approved|scheduled|published|failed|paused
    scheduled_at    TIMESTAMP WITH TIME ZONE,
    published_at    TIMESTAMP WITH TIME ZONE,
    auto_post       BOOLEAN DEFAULT FALSE,
    approved_by     UUID,
    approved_at     TIMESTAMP WITH TIME ZONE,
    rejection_note  TEXT,
    platform_post_ids JSONB DEFAULT '{}',                  -- {facebook: "123", instagram: "456"}
    created_by      VARCHAR(100),                          -- user_id or 'marketingpal'
    workflow_id     UUID,                                  -- if triggered by automation
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_social_posts_tenant_id ON social_posts(tenant_id);
CREATE INDEX idx_social_posts_status ON social_posts(status);
CREATE INDEX idx_social_posts_scheduled_at ON social_posts(scheduled_at);

CREATE TABLE social_post_analytics (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id         UUID NOT NULL REFERENCES social_posts(id),
    tenant_id       UUID NOT NULL,
    platform        VARCHAR(50) NOT NULL,
    reach           INTEGER DEFAULT 0,
    impressions     INTEGER DEFAULT 0,
    clicks          INTEGER DEFAULT 0,
    likes           INTEGER DEFAULT 0,
    comments        INTEGER DEFAULT 0,
    shares          INTEGER DEFAULT 0,
    saves           INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    synced_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_social_post_analytics_post_id ON social_post_analytics(post_id);
CREATE INDEX idx_social_post_analytics_tenant_id ON social_post_analytics(tenant_id);

-- ============================================================
-- ANALYTICS / REPORTING
-- ============================================================

CREATE TABLE analytics_snapshots (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,
    snapshot_date   DATE NOT NULL,
    metric_type     VARCHAR(100) NOT NULL,
    -- metric_types: revenue_daily|pipeline_value|new_leads|deals_won|deals_lost|
    --               conversion_rate|ai_conversations|social_reach
    value           DECIMAL(20,4),
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, snapshot_date, metric_type)
);

CREATE INDEX idx_analytics_snapshots_tenant_date ON analytics_snapshots(tenant_id, snapshot_date DESC);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_chat_conversations_updated_at BEFORE UPDATE ON chat_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_social_posts_updated_at BEFORE UPDATE ON social_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_automation_workflows_updated_at BEFORE UPDATE ON automation_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at();
