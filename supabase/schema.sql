-- Rode no SQL Editor do Supabase (Dashboard → SQL → New query)

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  empresa text not null,
  whatsapp text not null,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Anon e autenticados podem inserir leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);
