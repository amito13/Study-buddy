-- EXECUTE is granted to PUBLIC by default; revoke it so the signup trigger
-- function is not reachable via the PostgREST RPC endpoint (advisors 0028/0029)
revoke execute on function public.handle_new_user() from public;