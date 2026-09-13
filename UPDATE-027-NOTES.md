# Update 027 — Mk7 GTI Suspension (batch 2) + code repairs

Complete set. Includes everything from 022–026. This notes file stays out of the repo.

## What's in the folder
- `supabase/029_mk7_suspension.sql` — four new Mk7 GTI guides + their task rows (Suspension category).
- `illustrations/mk7-*.svg` — four new drawings.
- `src/App.jsx` — code repairs (below).

## Apply, in this order
1. Supabase → SQL Editor → paste the whole of `029_mk7_suspension.sql` → Run.
2. Supabase → Storage → `illustrations` bucket → Upload files → the four `mk7-*.svg` files.
3. Copy the four `.svg` files into the repo's `illustrations/` folder too (so the originals are versioned).
4. Replace `src/App.jsx` with the one here.
5. Commit and push:

    git add src/App.jsx illustrations/mk7-rsb-hero.svg illustrations/mk7-fsb-drop.svg illustrations/mk7-endlink.svg illustrations/mk7-coilover-hero.svg supabase/029_mk7_suspension.sql
    git commit -m "Mk7 GTI suspension batch; restore multi-question guides and chapters" -m "- Rear sway bar, front sway bar, end links, coilovers & lowering springs for the Mk7 (SQL 029, four SVGs)" -m "- Guides can ask several questions again (fixes the intercooler guide) and group steps into chapters (turbo kit)" -m "- Every video embed renders; before-you-start items follow the variant" -m "- Single-engine generations skip the engine picker; category guide lists name the car above the title"
    git push

## The code repairs
The App.jsx in the repo was rebuilt from a preview that predated Update 020, so several 020 features were lost
(the category marks were the visible one). This restores the rest:
- Multi-question pre-questions (`variants.questions`) with `a+b` scoping. Without this, opening the
  intercooler guide (two questions, live in your database since 020) fails on the live site.
- Chapters: long guides group steps under tabs (the R32 turbo kit was written this way).
- All video embeds render, not just the first. "Before you start" items can be variant-scoped.
- Generations with one engine (R32, Mk7) skip the engine picker; the back label adjusts.
- The category guide list shows the car above the title ("GTI Mk7 / Mk7.5 · TSI Gen 3").
