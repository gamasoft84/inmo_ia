-- InmoIA Fase 5 DB migration (idempotent)
-- Run in Supabase SQL Editor
-- Safe to run multiple times

begin;

-- 1) Extensions
create extension if not exists pgcrypto;
create extension if not exists vector;

-- 2) Agencies: bot config columns used by API/UI
alter table if exists public.agencies
  add column if not exists bot_name text default 'Sofia',
  add column if not exists bot_greeting_es text,
  add column if not exists bot_greeting_en text,
  add column if not exists bot_active_24h boolean default true,
  add column if not exists bot_context text,
  add column if not exists whatsapp_number text,
  add column if not exists updated_at timestamptz default now();

-- 3) Fallback table used when agencies does not include bot columns
create table if not exists public.chatbot_configs (
  agency_id uuid primary key references public.agencies(id) on delete cascade,
  config jsonb not null,
  updated_at timestamptz default now()
);

-- 4) Leads table (minimum fields used by webhook/chat endpoints)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  name text,
  phone text not null,
  status text default 'new',
  temperature text default 'cold',
  ai_score integer default 0,
  source text default 'whatsapp',
  language text default 'es',
  last_contact_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.leads
  add column if not exists agency_id uuid references public.agencies(id) on delete cascade,
  add column if not exists name text,
  add column if not exists phone text,
  add column if not exists status text default 'new',
  add column if not exists temperature text default 'cold',
  add column if not exists ai_score integer default 0,
  add column if not exists source text default 'whatsapp',
  add column if not exists language text default 'es',
  add column if not exists last_contact_at timestamptz,
  add column if not exists updated_at timestamptz default now();

-- 5) Conversations table (minimum fields used by webhook/chat endpoints)
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

alter table if exists public.conversations
  add column if not exists agency_id uuid references public.agencies(id) on delete cascade,
  add column if not exists lead_id uuid references public.leads(id) on delete cascade,
  add column if not exists role text,
  add column if not exists content text,
  add column if not exists language text default 'es',
  add column if not exists is_read boolean default false,
  add column if not exists created_at timestamptz default now();

-- 6) Properties: pgvector embedding column (Fase 5 item 28)
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  title_es text,
  city text,
  features text,
  status text default 'draft',
  embedding vector(1536),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.properties
  add column if not exists embedding vector(1536);

-- 6.1) Semantic property match RPC using pgvector cosine distance
create or replace function public.match_properties(
  p_agency_id uuid,
  p_query_embedding vector(1536),
  p_match_count int default 3,
  p_status text default null
)
returns table (
  id uuid,
  title_es text,
  city text,
  features text,
  status text,
  similarity double precision
)
language sql
stable
as $$
  select
    p.id,
    p.title_es,
    p.city,
    p.features,
    p.status,
    1 - (p.embedding <=> p_query_embedding) as similarity
  from public.properties p
  where p.agency_id = p_agency_id
    and p.embedding is not null
    and (p_status is null or p.status = p_status)
  order by p.embedding <=> p_query_embedding
  limit greatest(p_match_count, 1);
$$;

-- 7) Helpful indexes
create index if not exists idx_leads_agency_phone on public.leads(agency_id, phone);
create index if not exists idx_conversations_agency_lead_created on public.conversations(agency_id, lead_id, created_at desc);
create index if not exists idx_conversations_lead_created on public.conversations(lead_id, created_at asc);

-- NOTE: ivfflat index requires enough rows for best results; keep commented until dataset grows.
-- create index if not exists idx_properties_embedding_ivfflat
--   on public.properties using ivfflat (embedding vector_cosine_ops)
--   with (lists = 100);

-- 8) Realtime publication for conversations (if publication exists)
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      execute 'alter publication supabase_realtime add table public.conversations';
    exception when duplicate_object then
      null;
    end;
  end if;
end$$;

-- 9) Enable RLS (minimal, aligned with design docs)
alter table if exists public.agencies enable row level security;
alter table if exists public.leads enable row level security;
alter table if exists public.conversations enable row level security;
alter table if exists public.properties enable row level security;
alter table if exists public.chatbot_configs enable row level security;

commit;
