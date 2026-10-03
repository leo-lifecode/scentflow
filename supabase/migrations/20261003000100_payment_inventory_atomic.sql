-- ScentFlow: payment settlement must be atomic and idempotent.
-- The application currently uses `orders_items`; keep this name consistent with the backend.

alter table public.transactions
  add column if not exists order_id uuid references public.orders(id);

create unique index if not exists transactions_order_id_unique
  on public.transactions(order_id)
  where order_id is not null;

create or replace function public.process_paid_order(p_order_id uuid)
returns table(total_income numeric, already_processed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_total numeric := 0;
  v_item record;
  v_new_stock integer;
begin
  select status
    into v_status
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order tidak ditemukan: %', p_order_id using errcode = 'P0002';
  end if;

  if v_status = 'SUCCESS' then
    return query select coalesce((select amount from public.transactions where order_id = p_order_id limit 1), 0), true;
    return;
  end if;

  for v_item in
    select product_id, price, quantity
    from public.orders_items
    where order_id = p_order_id
    for update
  loop
    update public.products
      set stock = stock - v_item.quantity
    where id = v_item.product_id
      and stock >= v_item.quantity
    returning stock into v_new_stock;

    if not found then
      raise exception 'Stok tidak mencukupi untuk produk %', v_item.product_id using errcode = 'P0001';
    end if;

    v_total := v_total + (v_item.price * v_item.quantity);
  end loop;

  update public.orders
    set status = 'SUCCESS'
  where id = p_order_id;

  insert into public.transactions (order_id, amount, type, category, description)
  values (
    p_order_id,
    v_total,
    'income',
    'sales',
    'Penjualan Parfum untuk Order ID: ' || p_order_id
  );

  return query select v_total, false;
exception
  when unique_violation then
    return query select coalesce((select amount from public.transactions where order_id = p_order_id limit 1), 0), true;
end;
$$;
