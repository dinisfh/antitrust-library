-- 1. Create the Users table matching the auth.users
create table public."Users" (
  id uuid references auth.users not null primary key,
  email text not null,
  role text not null check (role in ('Admin', 'Reader')),
  status text not null check (status in ('Active', 'Inactive')) default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public."Users" enable row level security;

-- 3. Create Basic Policies
-- Permite que um utilizador leia os seus próprios dados de perfil
create policy "Users can view own profile."
  on public."Users" for select
  using ( auth.uid() = id );



-- Opcional (se for para ter triggers de Sync Auto com Auth.Users):
-- Apenas criar o profile automaticamente se precisares ou caso os Users sejam importados manualmente pelo Admin via CSV.
