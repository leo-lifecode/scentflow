-- Additional customer delivery details and shipment tracking.
alter table public.orders
  add column if not exists customer_phone text,
  add column if not exists shipping_address text,
  add column if not exists shipping_status text not null default 'UNPAID',
  add column if not exists shipping_courier text,
  add column if not exists tracking_number text;

-- Product images are public for storefront display. Uploads are performed by the
-- authenticated admin backend using the Supabase server key, never from the browser.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png'];

-- Keep a queryable customer email in the public profile table for the admin customer list.
create or replace function public.sync_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_app_meta_data->>'role', 'customer'),
    now(),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    role = coalesce(new.raw_app_meta_data->>'role', public.profiles.role),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists sync_profile_from_auth on auth.users;
create trigger sync_profile_from_auth
after insert or update of email, raw_user_meta_data, raw_app_meta_data on auth.users
for each row execute function public.sync_profile_from_auth();

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is distinct from u.email;
\nrevoke all on function public.sync_profile_from_auth() from public, anon, authenticated;\n