-- 1. Create the Cases table
create table public."Cases" (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text not null,
  parties_involved text[] not null default '{}',
  case_type text[] not null default '{}',
  sector text[] not null default '{}',
  authority text not null,
  status text not null,
  outcome_type text[] not null default '{}',
  fine_amount_eur numeric(20, 2), -- Nullable
  date_opened date not null,
  date_decided date, -- Nullable
  source_urls jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public."Cases" enable row level security;

-- 3. Policies for Cases
create policy "Authenticated users can select Cases"
  on public."Cases" for select
  using ( auth.role() = 'authenticated' );

-- Admins full access (já agora)
create policy "Admins have full access to Cases"
  on public."Cases" for all
  using (
    exists (
      select 1 from public."Users"
      where "Users".id = auth.uid() and "Users".role = 'Admin'
    )
  );

-- 4. Inserir Mock Data
INSERT INTO public."Cases" (
  title, summary, parties_involved, case_type, sector, authority, status, outcome_type, fine_amount_eur, date_opened, date_decided, source_urls
) VALUES 
(
  'Investigação Abuso Posição Dominante - BigTech Inc.',
  'Resumo do caso sobre o possível abuso de posição dominante no mercado de serviços digitais. A autoridade europeia avalia as práticas de agrupamento (tying) e impacto concorrencial.',
  ARRAY['BigTech Inc.', 'SearchCorp'],
  ARRAY['Abuso de Posição Dominante'],
  ARRAY['Tecnologia/Digital'],
  'Comissão Europeia',
  'Em Investigação',
  ARRAY[]::text[],
  NULL,
  '2024-02-12',
  NULL,
  '[{"name": "Nota Imprensa", "url": "#"}]'::jsonb
),
(
  'Cartel de Empresas no Setor da Energia',
  'A Autoridade da Concorrência sancionou quatro empresas por práticas concertadas de fixação de preços e repartição de mercado em concursos públicos ao longo da última década.',
  ARRAY['EnergeticGlobal', 'IberianPower', 'LuzMundo'],
  ARRAY['Cartel'],
  ARRAY['Energia'],
  'AdC',
  'Decidido',
  ARRAY['Coima Aplicada', 'Remédios/Compromissos'],
  15000000.00,
  '2021-05-10',
  '2024-01-05',
  '[{"name": "Decisão AdC", "url": "#"}, {"name": "Notícia Observador", "url": "#"}]'::jsonb
),
(
  'Aquisição da PharmaCare pela HealthCorp',
  'Controlo de concentrações sobre a fusão de duas das maiores farmacêuticas. A operação foi aprovada com remédios comportamentais e alienação de ativos no mercado de genéricos.',
  ARRAY['HealthCorp', 'PharmaCare'],
  ARRAY['Controlo de Concentrações'],
  ARRAY['Saúde/Farma'],
  'DOJ',
  'Decidido',
  ARRAY['Remédios/Compromissos', 'Aprovado'],
  NULL,
  '2023-08-22',
  '2023-11-30',
  '[{"name": "Department of Justice Release", "url": "#"}]'::jsonb
),
(
  'Acordo de partilha de infraestruturas 5G',
  'Investigação sobre potenciais efeitos restritivos da concorrência decorrentes de acordos de partilha de rede entre operadores móveis.',
  ARRAY['TelcoA', 'TelcoB'],
  ARRAY['Acordos Restritivos'],
  ARRAY['Telecomunicações'],
  'AdC',
  'Em Recurso',
  ARRAY['Coima Aplicada'],
  8500000.00,
  '2022-02-15',
  '2023-12-10',
  '[{"name": "Portal AdC", "url": "#"}]'::jsonb
);
