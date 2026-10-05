alter table public.orders
  add column if not exists user_id uuid references auth.users(id);

create index if not exists orders_user_id_idx
  on public.orders(user_id);
