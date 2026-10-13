-- Pin search_path on the updated_at trigger function (advisor 0011)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- handle_new_user is a signup trigger only; it must not be callable via RPC (advisors 0028/0029)
revoke execute on function public.handle_new_user() from anon, authenticated;

-- Covering indexes for foreign keys flagged by advisor 0001
create index if not exists conversations_study_set_idx
  on public.conversations (study_set_id);
create index if not exists flashcard_decks_user_idx
  on public.flashcard_decks (user_id);
create index if not exists summaries_user_idx
  on public.summaries (user_id);