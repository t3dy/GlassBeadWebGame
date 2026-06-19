-- Glass Bead Game — initial schema for accounts + per-user cloud persistence.
-- Run in the Supabase SQL editor (or `supabase db push`). Idempotent-ish: uses
-- IF NOT EXISTS where practical. See docs/DEPLOYMENT.md.
--
-- Identity model: username + password, email OPTIONAL. The client maps a username
-- to a synthetic auth email (`<slug>@gbg.local`); the real email (if given) lives
-- in profiles for future recovery. Disable "Confirm email" in Auth settings so
-- synthetic-email signups work (Auth → Providers → Email → Confirm email = off).

create extension if not exists citext;

-- ── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    citext unique not null,
  email       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── user_library ── one row per user: created/edited cards, glyphs, packs ──────
create table if not exists public.user_library (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ── games ── many saved board states per user ─────────────────────────────────
create table if not exists public.games (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null references auth.users (id) on delete cascade,
  name        text not null default 'Untitled',
  state       jsonb not null,
  is_current  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists games_owner_idx on public.games (owner, updated_at desc);

-- ── Row-Level Security: owner-only on every table ─────────────────────────────
alter table public.profiles     enable row level security;
alter table public.user_library enable row level security;
alter table public.games        enable row level security;

drop policy if exists profiles_owner on public.profiles;
create policy profiles_owner on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists library_owner on public.user_library;
create policy library_owner on public.user_library
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists games_owner on public.games;
create policy games_owner on public.games
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

-- Username availability check usable before sign-up (no auth required).
-- Security-definer so it can read profiles under RLS; returns only a boolean.
create or replace function public.username_available(check_name citext)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (select 1 from public.profiles where username = check_name);
$$;
grant execute on function public.username_available(citext) to anon, authenticated;
