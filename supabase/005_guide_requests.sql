-- 005: user requests for new guides. Public can insert (submit a request); only you can read them in the dashboard.
create table if not exists guide_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  year text,
  make text,
  model text,
  description text not null,
  user_agent text
);
alter table guide_requests enable row level security;
drop policy if exists "public insert requests" on guide_requests;
create policy "public insert requests" on guide_requests for insert to anon, authenticated with check (true);
-- no select policy on purpose: submissions are private to the project owner
