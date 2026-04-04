-- InmoIA Fase 6 — Columnas faltantes en properties
-- Ejecutar en Supabase SQL Editor
-- Idempotente: seguro de correr múltiples veces

begin;

alter table public.properties
  add column if not exists agent_id         uuid references public.users(id),
  add column if not exists slug             text,
  add column if not exists type             text,
  add column if not exists operation        text,
  add column if not exists title_en         text,
  add column if not exists desc_es          text,
  add column if not exists desc_en          text,
  add column if not exists desc_whatsapp_es text,
  add column if not exists desc_whatsapp_en text,
  add column if not exists desc_instagram_es text,
  add column if not exists price_mxn        numeric,
  add column if not exists price_usd        numeric,
  add column if not exists area_total       numeric,
  add column if not exists area_built       numeric,
  add column if not exists bedrooms         integer default 0,
  add column if not exists bathrooms        numeric default 0,
  add column if not exists parking          integer default 0,
  add column if not exists floors           integer default 1,
  add column if not exists age_years        integer default 0,
  add column if not exists amenities        text[] default array[]::text[],
  add column if not exists credits          text[] default array[]::text[],
  add column if not exists address          text,
  add column if not exists neighborhood     text,
  add column if not exists state            text,
  add column if not exists zip_code         text,
  add column if not exists lat              numeric,
  add column if not exists lng              numeric,
  add column if not exists privacy_level    text default 'approximate',
  add column if not exists photos           text[] default array[]::text[],
  add column if not exists ai_score         integer default 0,
  add column if not exists ai_analysis      jsonb,
  add column if not exists is_featured      boolean default false,
  add column if not exists publish_portals  boolean default true,
  add column if not exists views_count      integer default 0;

-- Unique constraint en slug (solo si no existe aún)
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'properties_slug_key'
  ) then
    alter table public.properties add constraint properties_slug_key unique (slug);
  end if;
end $$;

-- Índice de búsqueda por agencia + status
create index if not exists idx_properties_agency_status on public.properties(agency_id, status);

commit;
