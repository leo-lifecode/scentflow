alter function public.process_successful_order(uuid) set search_path = public;
revoke all on function public.process_successful_order(uuid) from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
