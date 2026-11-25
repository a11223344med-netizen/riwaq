-- رِواق — Migration 0002: إشعارات الخلفية (Push)
-- شغّله مرة واحدة من Supabase: SQL Editor ← New query ← الصق ← Run
create table if not exists public.push_subscriptions (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  device_id  text,
  created_at timestamptz not null default now()
);
create index if not exists push_subs_user_idx on public.push_subscriptions (user_id);

create table if not exists public.push_jobs (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  send_at    timestamptz not null,
  title      text not null,
  body       text,
  tag        text,
  data       jsonb not null default '{}'::jsonb,
  sent       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists push_jobs_due_idx  on public.push_jobs (send_at) where sent = false;
create index if not exists push_jobs_user_idx on public.push_jobs (user_id);

alter table public.push_subscriptions enable row level security;
alter table public.push_jobs          enable row level security;
revoke all on public.push_subscriptions, public.push_jobs from anon;
grant select, insert, update, delete on public.push_subscriptions, public.push_jobs to authenticated;

drop policy if exists subs_select on public.push_subscriptions; drop policy if exists subs_insert on public.push_subscriptions;
drop policy if exists subs_update on public.push_subscriptions; drop policy if exists subs_delete on public.push_subscriptions;
create policy subs_select on public.push_subscriptions for select to authenticated using (auth.uid() = user_id);
create policy subs_insert on public.push_subscriptions for insert to authenticated with check (auth.uid() = user_id);
create policy subs_update on public.push_subscriptions for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy subs_delete on public.push_subscriptions for delete to authenticated using (auth.uid() = user_id);

drop policy if exists jobs_select on public.push_jobs; drop policy if exists jobs_insert on public.push_jobs;
drop policy if exists jobs_update on public.push_jobs; drop policy if exists jobs_delete on public.push_jobs;
create policy jobs_select on public.push_jobs for select to authenticated using (auth.uid() = user_id);
create policy jobs_insert on public.push_jobs for insert to authenticated with check (auth.uid() = user_id);
create policy jobs_update on public.push_jobs for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy jobs_delete on public.push_jobs for delete to authenticated using (auth.uid() = user_id);
