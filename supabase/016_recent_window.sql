-- 016: guides get a created_at so "Recently added" can be a real 14-day window
alter table guides add column if not exists created_at timestamptz default now();
update guides set created_at = coalesce(created_at, updated_at, now());
