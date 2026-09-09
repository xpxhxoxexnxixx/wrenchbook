-- 007: each guide names its own hero illustration
update guides set content = content || $j${"heroId": "hero"}$j$::jsonb, updated_at = now() where id = 'cam-follower';
update guides set content = content || $j${"heroId": "rsbhero"}$j$::jsonb, updated_at = now() where id = 'sway-rear';
