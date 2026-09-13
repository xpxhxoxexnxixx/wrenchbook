-- 019: R32 becomes its own VW model; the 3.2 VR6 moves from GTI Mk5 to R32 Mk5
insert into models (id,brand_id,name,live,sort) values ('r32','vw','R32',true,1) on conflict (id) do update set name=excluded.name, live=excluded.live, sort=excluded.sort;
update models set sort = sort + 1 where brand_id = 'vw' and id <> 'r32' and sort >= 1;
insert into generations (id,model_id,name,year_from,year_to,live,sort) values ('r32-mk4','r32','Mk4',2004,2004,false,0) on conflict (id) do update set name=excluded.name, year_from=excluded.year_from, year_to=excluded.year_to, live=excluded.live, sort=excluded.sort;
insert into generations (id,model_id,name,year_from,year_to,live,sort) values ('r32-mk5','r32','Mk5',2008,2008,true,1) on conflict (id) do update set name=excluded.name, year_from=excluded.year_from, year_to=excluded.year_to, live=excluded.live, sort=excluded.sort;
-- powertrains has a composite key (id, model_id, year): insert the R32 row, then remove the GTI row
insert into powertrains (id,model_id,year,name,code,note,live,generation_id) values ('bub','r32',2008,'3.2 VR6','BUB','2008 R32 · DSG · 4Motion all-wheel drive',true,'r32-mk5') on conflict (id,model_id,year) do update set name=excluded.name, code=excluded.code, note=excluded.note, live=excluded.live, generation_id=excluded.generation_id;
delete from powertrains where id = 'bub' and model_id = 'gti';
update guides set content = jsonb_set(content, '{fits}', to_jsonb('2006–2009 VW GTI (FSI & TSI) · 2008 VW R32'::text)) where id = 'sway-rear';
update guides set content = jsonb_set(content, '{fits}', to_jsonb('2006–2009 VW GTI (FSI & TSI) · 2008 VW R32'::text)) where id = 'sway-front';
update guides set content = jsonb_set(content, '{fits}', to_jsonb('2006–2009 VW GTI (FSI & TSI) · 2008 VW R32'::text)) where id = 'endlinks';
update guides set content = jsonb_set(content, '{fits}', to_jsonb('2006–2009 VW GTI (FSI & TSI) · 2008 VW R32'::text)) where id = 'brake-flush';
update guides set content = jsonb_set(content, '{fits}', to_jsonb('2006–2009 VW GTI (FSI & TSI) · 2008 VW R32'::text)) where id = 'brake-lines-ss';
update guides set content = jsonb_set(content, '{fits}', to_jsonb('2006–2009 VW GTI (FSI & TSI) · 2008 VW R32 · 6-speed DSG (02E / DQ250)'::text)) where id = 'dsg';
update guides set content = jsonb_set(content, '{fits}', to_jsonb('2006–2009 VW GTI (FSI & TSI) · 2008 VW R32'::text)) where id = 'coilovers';
update guides set content = jsonb_set(content, '{fits}', to_jsonb('2006–2009 VW GTI (FSI & TSI) · 2008 VW R32'::text)) where id = 'battery';
update guides set content = jsonb_set(content, '{fits}', to_jsonb('2006–2009 VW GTI (FSI & TSI) · 2008 VW R32'::text)) where id = 'headlights';
