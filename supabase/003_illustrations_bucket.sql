-- 003: public bucket for illustration SVGs. Upload the .svg files to it from the Storage page.
insert into storage.buckets (id, name, public) values ('illustrations', 'illustrations', true)
on conflict (id) do update set public = true;

drop policy if exists "public read illustrations" on storage.objects;
create policy "public read illustrations" on storage.objects
  for select to public using (bucket_id = 'illustrations');
