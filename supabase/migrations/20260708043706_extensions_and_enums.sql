-- Ensure pgvector is available for RAG embeddings (already installed in `extensions` schema)
create extension if not exists vector with schema extensions;

-- Enum types used as discriminators across the schema
create type public.source_type as enum ('pdf', 'note', 'web');
create type public.processing_status as enum ('pending', 'processing', 'ready', 'failed');
create type public.message_role as enum ('user', 'assistant', 'system');