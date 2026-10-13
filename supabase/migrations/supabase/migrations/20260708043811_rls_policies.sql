-- Enable RLS everywhere
alter table public.profiles enable row level security;
alter table public.study_sets enable row level security;
alter table public.sources enable row level security;
alter table public.source_chunks enable row level security;
alter table public.summaries enable row level security;
alter table public.flashcard_decks enable row level security;
alter table public.flashcards enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- profiles
create policy "Users can view own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "Users can insert own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- study_sets
create policy "Users manage own study sets"
  on public.study_sets for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- sources
create policy "Users manage own sources"
  on public.sources for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- summaries
create policy "Users manage own summaries"
  on public.summaries for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- flashcard_decks
create policy "Users manage own flashcard decks"
  on public.flashcard_decks for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- conversations
create policy "Users manage own conversations"
  on public.conversations for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- source_chunks (via parent source)
create policy "Users manage own source chunks"
  on public.source_chunks for all to authenticated
  using (exists (
    select 1 from public.sources s
    where s.id = source_id and s.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.sources s
    where s.id = source_id and s.user_id = (select auth.uid())
  ));

-- flashcards (via parent deck)
create policy "Users manage own flashcards"
  on public.flashcards for all to authenticated
  using (exists (
    select 1 from public.flashcard_decks d
    where d.id = deck_id and d.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.flashcard_decks d
    where d.id = deck_id and d.user_id = (select auth.uid())
  ));

-- messages (via parent conversation)
create policy "Users manage own messages"
  on public.messages for all to authenticated
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = (select auth.uid())
  ));