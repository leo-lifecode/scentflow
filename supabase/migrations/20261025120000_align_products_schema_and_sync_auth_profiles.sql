alter table public.products
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists description text,
  add column if not exists image_url text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  )
  on conflict (id) do update
    set full_name = coalesce(public.profiles.full_name, excluded.full_name);
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
