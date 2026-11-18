-- Consolidator dynamic fault classifications
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.fault_classifications (
  code text primary key,
  message text not null default '',
  recovery_code text,
  recovery_message text not null default '',
  categories text[] not null default '{}',
  is_deleted boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
alter table public.admin_users enable row level security;
alter table public.fault_classifications enable row level security;
drop policy if exists admins_read_own_membership on public.admin_users;
create policy admins_read_own_membership on public.admin_users for select to authenticated using (user_id=auth.uid());
drop policy if exists public_read_classifications on public.fault_classifications;
create policy public_read_classifications on public.fault_classifications for select to anon,authenticated using (true);
drop policy if exists admins_insert_classifications on public.fault_classifications;
create policy admins_insert_classifications on public.fault_classifications for insert to authenticated with check (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
drop policy if exists admins_update_classifications on public.fault_classifications;
create policy admins_update_classifications on public.fault_classifications for update to authenticated using (exists(select 1 from public.admin_users a where a.user_id=auth.uid())) with check (exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
-- After creating an admin in Supabase Authentication, add their UUID:
-- insert into public.admin_users(user_id) values ('YOUR_AUTH_USER_UUID');
