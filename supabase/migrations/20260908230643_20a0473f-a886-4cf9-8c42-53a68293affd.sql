create extension if not exists pgcrypto;

-- Reusable updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1) profiles ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null default '',
  display_name text not null default '',
  photo_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

drop policy if exists "profiles_owner_read" on public.profiles;
drop policy if exists "profiles_owner_write" on public.profiles;
create policy "profiles_owner_read" on public.profiles
  for select to authenticated
  using (auth.uid() = user_id);
create policy "profiles_owner_write" on public.profiles
  for insert to authenticated
  with check (auth.uid() = user_id);
create policy "profiles_owner_update" on public.profiles
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 2) saved_services ------------------------------------------------------
create table if not exists public.saved_services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_id text not null,
  service_title text not null default '',
  department text not null default '',
  saved_at timestamptz not null default now(),
  unique (user_id, service_id)
);

grant select, insert, update, delete on public.saved_services to authenticated;
grant all on public.saved_services to service_role;

alter table public.saved_services enable row level security;

drop policy if exists "saved_services_owner_all" on public.saved_services;
create policy "saved_services_owner_all" on public.saved_services
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter publication supabase_realtime add table public.saved_services;

-- 3) service_feedback ----------------------------------------------------
create table if not exists public.service_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_name text not null default 'Anonymous',
  service_id text not null default 'portal-general',
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

-- Public can submit feedback; only the system reads it back.
grant insert on public.service_feedback to anon, authenticated;
grant select, insert, update, delete on public.service_feedback to service_role;

alter table public.service_feedback enable row level security;

drop policy if exists "service_feedback_insert_anon" on public.service_feedback;
drop policy if exists "service_feedback_insert_auth" on public.service_feedback;
create policy "service_feedback_insert_anon" on public.service_feedback
  for insert to anon
  with check (true);
create policy "service_feedback_insert_auth" on public.service_feedback
  for insert to authenticated
  with check (true);
