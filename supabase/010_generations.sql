-- 010: generations replace per-year rows; powertrains attach to a generation
create table if not exists generations (
  id text primary key,
  model_id text references models(id),
  name text not null,
  year_from int not null,
  year_to int,               -- null = current
  live boolean default false,
  sort int default 0
);
alter table generations enable row level security;
drop policy if exists "public read" on generations;
create policy "public read" on generations for select to anon, authenticated using (true);
insert into generations (id,model_id,name,year_from,year_to,live,sort) values ('gti-mk3','gti','Mk3',1995,1999,false,0) on conflict (id) do update set name=excluded.name, year_from=excluded.year_from, year_to=excluded.year_to, live=excluded.live, sort=excluded.sort;
insert into generations (id,model_id,name,year_from,year_to,live,sort) values ('gti-mk4','gti','Mk4',1999,2005,false,1) on conflict (id) do update set name=excluded.name, year_from=excluded.year_from, year_to=excluded.year_to, live=excluded.live, sort=excluded.sort;
insert into generations (id,model_id,name,year_from,year_to,live,sort) values ('gti-mk5','gti','Mk5',2006,2009,true,2) on conflict (id) do update set name=excluded.name, year_from=excluded.year_from, year_to=excluded.year_to, live=excluded.live, sort=excluded.sort;
insert into generations (id,model_id,name,year_from,year_to,live,sort) values ('gti-mk6','gti','Mk6',2010,2014,false,3) on conflict (id) do update set name=excluded.name, year_from=excluded.year_from, year_to=excluded.year_to, live=excluded.live, sort=excluded.sort;
insert into generations (id,model_id,name,year_from,year_to,live,sort) values ('gti-mk7','gti','Mk7 / Mk7.5',2015,2021,false,4) on conflict (id) do update set name=excluded.name, year_from=excluded.year_from, year_to=excluded.year_to, live=excluded.live, sort=excluded.sort;
insert into generations (id,model_id,name,year_from,year_to,live,sort) values ('gti-mk8','gti','Mk8',2022,null,false,5) on conflict (id) do update set name=excluded.name, year_from=excluded.year_from, year_to=excluded.year_to, live=excluded.live, sort=excluded.sort;

alter table powertrains add column if not exists generation_id text references generations(id);
update powertrains set generation_id = 'gti-mk5' where id = 'bpy' and model_id = 'gti';
update powertrains set note = 'All 2006–2008.5 GTIs · manual or DSG (2009 cars are TSI)' where id = 'bpy' and model_id = 'gti';
-- model_years is no longer read by the app; kept for now, drop later if unused
