-- ScentFlow authentication profiles and Row Level Security
-- Mirrors the migration already applied to the production Supabase project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.orders enable row level security;
alter table public.orders_items enable row level security;
alter table public.transactions enable row level security;
alter table public.products enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_admin_read" on public.profiles;
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_admin_write" on public.products;
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "orders_admin_read" on public.orders;
drop policy if exists "orders_items_select_own" on public.orders_items;
drop policy if exists "orders_items_insert_own" on public.orders_items;
drop policy if exists "orders_items_admin_read" on public.orders_items;
drop policy if exists "transactions_select_own" on public.transactions;
drop policy if exists "transactions_admin_read" on public.transactions;
drop policy if exists "Allow public insert to orders" on public.orders;
drop policy if exists "Allow public insert to orders_items" on public.orders_items;
drop policy if exists "Allow public select on products" on public.products;
drop policy if exists "Enable read access for all users" on public.products;

create policy "profiles_select_own" on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "profiles_admin_read" on public.profiles
for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "products_public_read" on public.products
for select to anon, authenticated
using (true);

create policy "products_admin_write" on public.products
for all to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "orders_select_own" on public.orders
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "orders_insert_own" on public.orders
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "orders_admin_read" on public.orders
for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "orders_items_select_own" on public.orders_items
for select to authenticated
using (exists (
  select 1 from public.orders o
  where o.id = orders_items.order_id
    and o.user_id = (select auth.uid())
));

create policy "orders_items_insert_own" on public.orders_items
for insert to authenticated
with check (exists (
  select 1 from public.orders o
  where o.id = orders_items.order_id
    and o.user_id = (select auth.uid())
));

create policy "orders_items_admin_read" on public.orders_items
for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "transactions_select_own" on public.transactions
for select to authenticated
using (exists (
  select 1 from public.orders o
  where o.id = transactions.order_id
    and o.user_id = (select auth.uid())
));

create policy "transactions_admin_read" on public.transactions
for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
