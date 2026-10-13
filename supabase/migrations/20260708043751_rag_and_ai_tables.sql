-- Chunked + embedded source text for semantic retrieval
create table public.source_chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources (id) on delete cascade,
  chunk_index int not null,
  content text not null,
  embedding extensions.vector(1536),
  token_count int,
  created_at timestamptz not null default now()
);

create index source_chunks_source_idx
  on public.source_chunks (source_id, chunk_index);

create index source_chunks_embedding_idx
  on public.source_chunks using hnsw (embedding extensions.vector_cosine_ops);

-- AI-generated summaries (multiple allowed; UI shows latest)
create table public.summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  study_set_id uuid not null references public.study_sets (id) on delete cascade,
  content text not null,
  model text,
  prompt_version text,
  created_at timestamptz not null default now()
);

create index summaries_study_set_created_idx
  on public.summaries (study_set_id, created_at desc);

-- Flashcard decks + cards
create table public.flashcard_decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  study_set_id uuid not null references public.study_sets (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create index flashcard_decks_study_set_idx
  on public.flashcard_decks (study_set_id, created_at desc);

create table public.flashcards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.flashcard_decks (id) on delete cascade,
  front text not null,
  back text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index flashcards_deck_sort_idx
  on public.flashcards (deck_id, sort_order);
-- Chat conversations scoped to a study set + their messages
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  study_set_id uuid not null references public.study_sets (id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index conversations_user_set_updated_idx
  on public.conversations (user_id, study_set_id, updated_at desc);

create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role public.message_role not null,
  content text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index messages_conversation_created_idx
  on public.messages (conversation_id, created_at asc);