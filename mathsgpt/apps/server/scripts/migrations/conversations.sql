create extension if not exists "pgcrypto";

-- Conversations: one row per chat, messages in OpenAI format
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_ip text not null,
  title text not null default 'New Chat',
  messages jsonb not null default '[]'::jsonb,  
  status text not null default 'ready',         
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create or replace function public.trg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end
$$;
