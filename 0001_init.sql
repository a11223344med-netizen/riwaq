-- رِواق — Migration 0001: حالة المستخدم السحابية + سجل النسخ الاحتياطية
-- شغّله مرة واحدة من Supabase: SQL Editor ← New query ← الصق ← Run
create table if not exists public.user_state (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  data           jsonb       not null,
  schema_version int         not null default 1,
  revision       bigint      not null default 1,
  device_id      text,
  updated_at     timestamptz not null default now()
);
create table if not exists public.state_backups (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  data       jsonb       not null,
  revision   bigint,
  reason     text,
  created_at timestamptz not null default now()
);
create index if not exists state_backups_user_created_idx on public.state_backups (user_id, created_at desc);

alter table public.user_state    enable row level security;
alter table public.state_backups enable row level security;
revoke all on public.user_state, public.state_backups from anon;
grant select, insert, update, delete on public.user_state    to authenticated;
grant select, insert, delete         on public.state_backups to authenticated;

drop policy if exists user_state_select on public.user_state;
drop policy if exists user_state_insert on public.user_state;
drop policy if exists user_state_update on public.user_state;
drop policy if exists user_state_delete on public.user_state;
create policy user_state_select on public.user_state for select to authenticated using (auth.uid() = user_id);
create policy user_state_insert on public.user_state for insert to authenticated with check (auth.uid() = user_id);
create policy user_state_update on public.user_state for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy user_state_delete on public.user_state for delete to authenticated using (auth.uid() = user_id);

drop policy if exists backups_select on public.state_backups;
drop policy if exists backups_insert on public.state_backups;
drop policy if exists backups_delete on public.state_backups;
create policy backups_select on public.state_backups for select to authenticated using (auth.uid() = user_id);
create policy backups_insert on public.state_backups for insert to authenticated with check (auth.uid() = user_id);
create policy backups_delete on public.state_backups for delete to authenticated using (auth.uid() = user_id);

-- الاحتفاظ بآخر 20 نسخة احتياطية لكل مستخدم
create or replace function public.prune_state_backups() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from public.state_backups
   where user_id = new.user_id
     and id not in (select id from public.state_backups where user_id = new.user_id order by created_at desc limit 20);
  return new;
end $$;
drop trigger if exists trg_prune_state_backups on public.state_backups;
create trigger trg_prune_state_backups after insert on public.state_backups
  for each row execute function public.prune_state_backups();
