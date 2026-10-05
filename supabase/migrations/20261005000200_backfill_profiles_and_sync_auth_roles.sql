-- Backfill profiles created before the profile trigger existed.
insert into public.profiles (id, full_name)
select id, raw_user_meta_data ->> 'full_name'
from auth.users
on conflict (id) do nothing;

-- Keep the authorization claim in auth.users synchronized with the application profile role.
create or replace function public.sync_profile_role_to_auth()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  update auth.users
  set raw_app_meta_data = jsonb_set(
    coalesce(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(new.role),
    true
  )
  where id = new.id;
  return new;
end;
$$;

revoke execute on function public.sync_profile_role_to_auth() from public, anon, authenticated;

drop trigger if exists sync_profile_role_to_auth on public.profiles;
create trigger sync_profile_role_to_auth
after insert or update of role on public.profiles
for each row execute function public.sync_profile_role_to_auth();

update auth.users u
set raw_app_meta_data = jsonb_set(
  coalesce(u.raw_app_meta_data, '{}'::jsonb),
  '{role}',
  to_jsonb(p.role),
  true
)
from public.profiles p
where p.id = u.id;
