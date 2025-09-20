create table if not exists public.transactions (
  id bigserial primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_ip text,
  direction text not null check (direction in ('user','assistant','system','backend')),
  model text,
  prompt text,
  completion text,
  token_in integer not null default 0 check (token_in >= 0),
  token_out integer not null default 0 check (token_out >= 0),
  raw jsonb,
  created_at timestamptz not null default now()
);
