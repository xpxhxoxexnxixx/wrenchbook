# Update 028 — Mk7 GTI Steering (batch 3), new "Steering" category

Complete set. Includes everything from 022–027. This notes file stays out of the repo.

## What's in the folder
- `supabase/030_mk7_steering.sql` — four new Mk7 GTI guides + their task rows, all under a new "Steering" category.
- `illustrations/mk7-*.svg` — four new drawings (ball joint, tie rod, front hub, rear hub).
- `src/App.jsx` — adds "Steering" to the categories list and a steering-wheel CatArt mark to match the eight existing categories.

## Apply, in this order
1. Supabase → SQL Editor → paste the whole of `030_mk7_steering.sql` → Run. (No schema change; just tasks + guide content.)
2. Supabase → Storage → `illustrations` bucket → Upload files → the four `mk7-*.svg` files.
3. Copy the four `.svg` files into the repo's `illustrations/` folder too (so the originals are versioned).
4. Replace `src/App.jsx` with the one here.
5. Commit and push (one-line message):

    git add src/App.jsx illustrations/mk7-balljoint.svg illustrations/mk7-tierod.svg illustrations/mk7-hub-front.svg illustrations/mk7-hub-rear.svg supabase/030_mk7_steering.sql
    git commit -m "Mk7 GTI steering batch (SQL 030, four SVGs); adds Steering category with front ball joints, tie rods, front & rear wheel bearings"
    git push

## The four guides
- **Front ball joints** — variant fork: OE replacement, or 034 camber-adding (RCO). Same install, same time; RCO adds a washer step and hides the aftermarket-options list once the brand is chosen.
- **Tie rods (inner & outer)** — variant fork: outer only (5 steps) or inner and outer (10 steps). Inner adds the rack boot, an inner tie rod tool, and a steering-rack thread.
- **Front wheel bearing** — bolt-in Gen 3 hub, single-use hex-head axle bolt (200 Nm + 180°). The 12-point ribbed variant (70 Nm + 90°) is flagged in the disagreements section.
- **Rear wheel bearing** — three hub bolts, no axle to fight. Electric parking brake service routine (VCDS / OBDeleven) is a required first step.

## New category
"Steering" now sits between Suspension and Brakes in the category order. CatArt: a steering wheel with a three-spoke pattern in the same palette as the eight existing marks. Rendered clean at both the 44 px browse-list size and 52 px in the category header.

## What's next
Batch 4 (Bushings & mounts) and Batch 5 (Suspension additions: camber plates, rear toe/camber arms) are queued.
