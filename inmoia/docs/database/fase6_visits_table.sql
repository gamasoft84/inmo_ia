-- Fase 6: Tabla de visitas / calendario
-- Ejecutar en Supabase SQL Editor

create table if not exists public.visits (
  id            uuid primary key default gen_random_uuid(),
  agency_id     uuid not null references public.agencies(id) on delete cascade,
  lead_id       uuid references public.leads(id) on delete set null,
  property_id   uuid references public.properties(id) on delete set null,
  agent_id      uuid references auth.users(id) on delete set null,
  scheduled_at  timestamptz not null,
  duration_min  int not null default 60,
  status        text not null default 'scheduled'
                check (status in ('scheduled','confirmed','done','cancelled','no_show')),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- RLS
alter table public.visits enable row level security;

create policy "Agency members can manage visits"
  on public.visits for all
  using (
    agency_id in (
      select agency_id from public.users where id = auth.uid()
    )
  );

-- Índices
create index if not exists visits_agency_scheduled on public.visits(agency_id, scheduled_at);
create index if not exists visits_lead_id on public.visits(lead_id);
