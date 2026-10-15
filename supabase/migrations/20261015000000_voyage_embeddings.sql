-- Voyage models use 1024 dimensions. Keep the existing 1536-dimensional column
-- intact; old source chunks can be reprocessed without deleting legacy vectors.
alter table public.source_chunks
  add column embedding_voyage extensions.vector(1024);

create index source_chunks_embedding_voyage_idx
  on public.source_chunks using hnsw (embedding_voyage extensions.vector_cosine_ops);

create function public.match_source_chunks_voyage(
  query_embedding extensions.vector(1024),
  match_study_set_id uuid,
  match_count int default 8
)
returns table (id uuid, content text, similarity float)
language sql stable
set search_path = ''
as $$
  select sc.id, sc.content,
    1 - (sc.embedding_voyage operator(extensions.<=>) query_embedding) as similarity
  from public.source_chunks sc
  join public.sources s on s.id = sc.source_id
  where s.study_set_id = match_study_set_id
    and s.status = 'ready'
    and sc.embedding_voyage is not null
  order by sc.embedding_voyage operator(extensions.<=>) query_embedding
  limit match_count;
$$;

revoke execute on function public.match_source_chunks_voyage(extensions.vector, uuid, int)
  from public, anon, authenticated;
grant execute on function public.match_source_chunks_voyage(extensions.vector, uuid, int)
  to service_role;
