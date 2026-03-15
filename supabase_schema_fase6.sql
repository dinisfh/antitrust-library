-- supabase_schema_fase6.sql
-- Adiciona novos campos à tabela Cases para a Fase 6

ALTER TABLE public."Cases"
ADD COLUMN IF NOT EXISTS geography text,
ADD COLUMN IF NOT EXISTS start_date text,
ADD COLUMN IF NOT EXISTS citations_count integer DEFAULT 0;
