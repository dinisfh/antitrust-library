-- ==============================================================================
-- FASE 5: SUPABASE SCHEMA (EXPANSÃO DE CASOS + TIMELINES IA)
-- Copia e cola este ficheiro no SQL Editor do Supabase e clica "Run"
-- ==============================================================================

-- 1. Criação/Ajuste da Tabela Principal de Casos (se ainda não existir com este formato)
-- NOTA: Se já rodaste a fase 4 e a tabela "Cases" existe, podes preferir usar ALTER TABLE,
--       mas para garantir que está a 100% alinhada com os nossos outputs da IA,
--       este é o schema ideal.

DROP TABLE IF EXISTS public."CaseTimelineEvents" CASCADE;
DROP TABLE IF EXISTS public."Cases" CASCADE;

CREATE TABLE public."Cases" (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text not null,
  authority text not null,
  status text not null,
  industry text not null,
  tags text[] not null default '{}',
  parties_involved text[] not null default '{}',
  fine_amount text, -- Modificado de numeric para text para suportar formatos complexos vindos da IA (ex: "$3.4M" ou "€2.4 Billion")
  decision_date text, -- Modificado de date para text para suportar "2021-09" caso a IA não encontre dia exato
  links text[] not null default '{}', -- Modificado de jsonb source_urls para um array nativo texto
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Criação da Tabela de Eventos Históricos (Linha de Tempo) 
CREATE TABLE IF NOT EXISTS public."CaseTimelineEvents" (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references public."Cases"(id) on delete cascade not null,
  event_date text not null, -- MUDADO AQUI: text em vez de date para permitir "2021-09" ou "Early 2022" se aplicável
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Habilitar RLS nela
ALTER TABLE public."Cases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CaseTimelineEvents" ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS: Casos

DROP POLICY IF EXISTS "Authenticated users can select Cases" ON public."Cases";
-- Autenticados podem ler TODOS os casos
CREATE POLICY "Authenticated users can select Cases"
  ON public."Cases" FOR SELECT
  USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admins have full access to Cases" ON public."Cases";
-- Admins têm acesso total a criar/apagar casos
CREATE POLICY "Admins have full access to Cases"
  ON public."Cases" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public."Users"
      WHERE "Users".id = auth.uid() AND "Users".role = 'Admin'
    )
  );
  
-- 5. Políticas RLS: Timelines

DROP POLICY IF EXISTS "Authenticated users can read Timelines" ON public."CaseTimelineEvents";
-- Autenticados podem ler todas as timelines
CREATE POLICY "Authenticated users can read Timelines"
  ON public."CaseTimelineEvents" FOR SELECT
  USING ( auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admins have full access to Timelines" ON public."CaseTimelineEvents";
-- Admins gerem timelines 
CREATE POLICY "Admins have full access to Timelines"
  ON public."CaseTimelineEvents" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public."Users"
      WHERE "Users".id = auth.uid() AND "Users".role = 'Admin'
    )
  );

-- OPCIONAL: Indexes para performance quando a DB crescer (+10k rows)
DROP INDEX IF EXISTS idx_cases_authority;
CREATE INDEX idx_cases_authority ON public."Cases"(authority);

DROP INDEX IF EXISTS idx_cases_status;
CREATE INDEX idx_cases_status ON public."Cases"(status);

DROP INDEX IF EXISTS idx_timeline_case_id;
CREATE INDEX idx_timeline_case_id ON public."CaseTimelineEvents"(case_id);
