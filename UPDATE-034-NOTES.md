# TDC update-034 — BMW M3 (E36 · S52), Engine batch

**Apply — this is a Supabase-only update. No git push, no App.jsx or data.js change.**

1. **Supabase SQL:** open the Supabase SQL editor and run
   `supabase/035_bmw_e36_engine.sql` top to bottom, one go. It's wrapped in a
   single transaction, so if anything doesn't match it rolls back and changes
   nothing — safe to run.
2. **Storage:** upload the 9 files in `illustrations/` to your `illustrations`
   bucket (the same one your VW SVGs are in). Keep the filenames exactly — they
   are the IDs the guides look up at `.../illustrations/<id>.svg`.

Do the SVG uploads first if you want to avoid a broken-image flash, then run the
SQL. After it runs, fully quit and reopen the app (it loads the task list once
at startup) and BMW will be there.

## Why no code change this time
Your `src/lib/data.js` loads the whole vehicle tree (brands, models,
generations, powertrains) from Supabase, and the categories list is hardcoded
but unchanged (E36 reuses your existing categories). So everything here is data:
the SQL adds the catalog rows + the 8 guides, and the bucket gets the artwork.
Nothing in `App.jsx` or `data.js` is touched. (I read your schema straight out
of data.js, so no migration file was needed.)

## What the SQL does
- Turns the existing BMW brand **live**.
- Adds model **M3**, generations **E30–G80** (only **E36** live), and engine
  **S52** (S50 sits not-live). One live engine, so the engine picker is skipped.
- Inserts 8 **tasks**, then 8 **guides** (tasks first, because `guides.id`
  references `tasks.id`).
- Every insert is `on conflict (id) do update`, so it's safe to re-run.

## The 8 Engine guides
oil & filter change (with a "Which oil?" chooser) · air filter · spark plugs &
ignition coils (stock/supercharged fork) · valve cover gasket · oil filter
housing gasket · fuel filter · drive belts & tensioners · intake boot / ICV /
vacuum leaks. Nine `e36-*.svg` illustrations.

## One thing to watch
The `aliases` column is written as a Postgres text[] array. If your `aliases`
column is jsonb instead and the SQL errors on it, tell me — it's a one-line
change and I'll resend. (Everything else — `content` jsonb, the scalar columns —
matches your data.js exactly.)

## Still open (next sessions)
Engine ★-tail: O2 sensors, crank/cam sensors, fuel pump, oil-pan gasket. Then
Engine upgrades: intake, tuning path (Stage 1–4), headers, Section 1, cat-back.
