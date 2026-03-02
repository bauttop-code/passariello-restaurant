create table if not exists voice_catalog_snapshot (
  id text primary key default 'current',
  synced_at timestamptz not null default now(),
  source text not null default 'website',
  version text not null,
  payload jsonb not null
);

create table if not exists voice_orders (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending',
  source text not null default 'voice-agent',
  external_ref text,
  customer jsonb,
  notes text,
  items jsonb not null
);

create index if not exists idx_voice_orders_status on voice_orders(status);
create index if not exists idx_voice_orders_created_at on voice_orders(created_at desc);
