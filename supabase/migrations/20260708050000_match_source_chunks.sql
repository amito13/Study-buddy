-- Vector similarity search over a study set's source chunks (RAG retrieval).
-- search_path is pinned to '' (advisor 0011); every object and the pgvector
-- cosine-distance operator are schema-qualified explicitly.
create or replace function public.match_source_chunks(
  query_embedding extensions.vector(1536),
  match_study_set_id uuid,
  match_count int default 8
)
returns table (id uuid, content text, similarity float)
language sql
stable
set search_path = ''
as $$
  select
    sc.id,
    sc.content,
    1 - (sc.embedding operator(extensions.<=>) query_embedding) as similarity
  from public.source_chunks sc
  join public.sources s on s.id = sc.source_id
  where s.study_set_id = match_study_set_id
    and s.status = 'ready'
    and sc.embedding is not null
  order by sc.embedding operator(extensions.<=>) query_embedding
  limit match_count;
$$;

-- New functions are not auto-exposed to Data API roles (see config.toml).
-- The Express backend calls this RPC with the service-role key.
grant execute on function public.match_source_chunks(
  extensions.vector, uuid, int
) to service_role;

