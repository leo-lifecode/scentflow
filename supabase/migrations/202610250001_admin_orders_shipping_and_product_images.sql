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