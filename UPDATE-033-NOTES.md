# Update 033 — Mk5 dogbone + engine/transmission mount guides (Bushings & mounts)

**Apply: git + Supabase + Storage.** All three halves this time.

## What's in it
- `src/App.jsx` — complete file. One behaviour change: a pre-question can now carry `only` like a step does, so it is asked
  only after a matching earlier answer ("Which upgrade?" appears only if the first answer was "Upgrade"). Existing guides
  are unaffected (all 130 reachable answer combinations render clean). Includes 031's layout fix.
- `supabase/034_mk5_mounts.sql` — four task rows (`bpy` and `ccta` share each guide) and two guides:
  `dogbone-mount` and `engine-trans-mounts` (chaptered: Engine mount · Transmission mount · Finish).
- `illustrations/` — five SVGs plus `draw_mounts.py` (source; checker passes with 0 problems).

## Before you apply: is "Bushings & mounts" in data.js?
The category was added for the Mk7 in update-029. If that patch was never applied, these two guides will be invisible on the
Mk5 the same way Steering was. Check:

   grep -c "Bushings" src/lib/data.js

Expected output: `1`. If it prints `0`, run this first (from the repo folder), then continue:

   sed -i '' 's/"Steering", "Brakes"/"Steering", "Bushings \& mounts", "Brakes"/' src/lib/data.js

## Apply, in order
1. Replace `src/App.jsx`; copy the five `.svg` (and `draw_mounts.py`) into `illustrations/`.
2. Supabase → SQL Editor → run `034_mk5_mounts.sql`. Expected: "Success. No rows returned."
3. Supabase → Storage → `illustrations` → upload the five `.svg` files.
4. Commit and push:

   git add src/App.jsx illustrations
   git commit -m "Mk5 dogbone and engine/transmission mount guides in Bushings & mounts (SQL 034, five SVGs); pre-questions can depend on an earlier answer"
   git push

5. After Vercel redeploys, fully quit and reopen the app. Mk5 GTI → FSI → Bushings & mounts should list both guides; open either
   and you should be asked "New factory mount, or an upgrade?" first.

## Content notes
- Dogbone: factory swap vs insert vs full aftermarket arm. Inserts split early (built to mid-2008 — every FSI) / late (2009+):
  034 has two part numbers, BFI asks for model year. VF Engineering's lower mount is FSI-only per the seller's fitment note.
  Torques from ECS's Mk5/Mk6 mount PDF (M14 100 Nm + 90°, M10 40 Nm + 90°); 034's own-hardware values recorded as alternates.
- Engine & transmission mounts: procedure and every torque from the ECS PDF (factory table), Pelican's ≥10 mm engine-to-rail
  alignment check, VF owners' values for VF hardware, BFI's bolt part numbers for its trans insert. Brand choice (034 Density,
  BFI, VF, ECS) shows only that kit's hardware notes and hides the aftermarket list; "Another brand" keeps it.
