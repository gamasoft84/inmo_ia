-- InmoIA Fase 1 base schema (idempotent)
-- Source of truth: InmoIA_Design_System.md (Section 12)
-- Run in Supabase SQL Editor

begin;

create extension if not exists pgcrypto;
create extension if not exists vector;

-- 1) agencies
create table if not exists public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  brand_emoji text default '🏡',
  brand_color text default 'amber',
  dark_mode boolean default false,
  plan text default 'trial',
  status text default 'trial',
  trial_ends_at timestamptz,
  whatsapp_number text,
  bot_name text default 'Sofia',
  bot_greeting_es text,
  bot_greeting_en text,
  bot_active_24h boolean default true,
  bot_context text,
  languages text[] default array['es']::text[],
  timezone text default 'America/Mexico_City',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) users
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  agency_id uuid references public.agencies(id) on delete cascade,
  role text default 'agent',
  name text not null,
  email text unique not null,
  phone text,
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3) properties
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  agent_id uuid references public.users(id),
  slug text unique not null,
  type text not null,
  operation text not null,
  status text default 'draft',
  title_es text not null,
  title_en text,
  desc_es text,
  desc_en text,
  desc_whatsapp_es text,
  desc_whatsapp_en text,
  desc_instagram_es text,
  price_mxn numeric,
  price_usd numeric,
  area_total numeric,
  area_built numeric,
  bedrooms integer default 0,
  bathrooms numeric default 0,
  parking integer default 0,
  floors integer default 1,
  age_years integer default 0,
  amenities text[] default array[]::text[],
  credits text[] default array[]::text[],
  address text,
  neighborhood text,
  city text,
  state text,
  zip_code text,
  lat numeric,
  lng numeric,
  privacy_level text default 'approximate',
  photos text[] default array[]::text[],
  ai_score integer default 0,
  ai_analysis jsonb,
  embedding vector(1536),
  is_featured boolean default false,
  publish_portals boolean default true,
  views_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4) leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  agent_id uuid references public.users(id),
  name text,
  phone text not null,
  email text,
  city text,
  status text default 'new',
  temperature text default 'cold',
  ai_score integer default 0,
  source text default 'whatsapp',
  language text default 'es',
  budget_max numeric,
  preferred_type text,
  preferred_zones text[],
  min_bedrooms integer,
  credit_type text,
  urgency text,
  property_id uuid references public.properties(id),
  notes text,
  ai_summary text,
  last_contact_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5) conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  role text not null,
  content text not null,
  language text default 'es',
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 6) visits
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  lead_id uuid references public.leads(id),
  property_id uuid references public.properties(id),
  agent_id uuid references public.users(id),
  status text default 'pending',
  scheduled_at timestamptz not null,
  duration_min integer default 60,
  notes text,
  cancelled_by text,
  created_at timestamptz default now()
);

-- RLS baseline
alter table if exists public.agencies enable row level security;
alter table if exists public.users enable row level security;
alter table if exists public.properties enable row level security;
alter table if exists public.leads enable row level security;
alter table if exists public.conversations enable row level security;
alter table if exists public.visits enable row level security;

-- Base policy: agency isolation
-- Apply to all data tables. Uses mapping in public.users by auth.uid().
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'properties' and policyname = 'agency_isolation'
  ) then
    create policy "agency_isolation"
      on public.properties
      using (agency_id = (select agency_id from public.users where id = auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'leads' and policyname = 'agency_isolation'
  ) then
    create policy "agency_isolation"
      on public.leads
      using (agency_id = (select agency_id from public.users where id = auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'conversations' and policyname = 'agency_isolation'
  ) then
    create policy "agency_isolation"
      on public.conversations
      using (agency_id = (select agency_id from public.users where id = auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'visits' and policyname = 'agency_isolation'
  ) then
    create policy "agency_isolation"
      on public.visits
      using (agency_id = (select agency_id from public.users where id = auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'agency_isolation'
  ) then
    create policy "agency_isolation"
      on public.users
      using (agency_id = (select agency_id from public.users where id = auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'agencies' and policyname = 'agency_isolation'
  ) then
    create policy "agency_isolation"
      on public.agencies
      using (id = (select agency_id from public.users where id = auth.uid()));
  end if;
end$$;

-- Super admin bypass for agencies
-- Note: requires role column in public.users.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'agencies' and policyname = 'super_admin_bypass'
  ) then
    create policy "super_admin_bypass"
      on public.agencies
      using ((select role from public.users where id = auth.uid()) = 'super_admin');
  end if;
end$$;

-- Helpful indexes
create index if not exists idx_users_agency on public.users(agency_id);
create index if not exists idx_properties_agency_status on public.properties(agency_id, status);
create index if not exists idx_leads_agency_phone on public.leads(agency_id, phone);
create index if not exists idx_conversations_agency_lead_created on public.conversations(agency_id, lead_id, created_at desc);
create index if not exists idx_visits_agency_scheduled on public.visits(agency_id, scheduled_at);

commit;
