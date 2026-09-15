# Update 029 — Mk7 GTI Bushings & mounts (batch 4) + Suspension additions (batch 5)

Six new guides across two batches. **New category "Bushings & mounts" requires a fix in `src/lib/data.js` as well as `src/App.jsx`** — see step 4 below. This is the same failure mode as update-028; it's covered by an explicit sed command this time so it can't be missed.

## What's in the folder
- `supabase/031_mk7_bushings_and_suspension.sql` — six new guides + task rows.
- `illustrations/mk7-*.svg` — six new drawings (dogbone, front-lca-bushings, rear-lca-bushings, subframe-collars, camber-plate, rear-arms).
- `src/App.jsx` — adds "Bushings & mounts" to the bundled preview categories list and a CatArt mark.

## Apply, in this order
1. Supabase → SQL Editor → paste the whole of `031_mk7_bushings_and_suspension.sql` → Run.
2. Supabase → Storage → `illustrations` bucket → Upload files → the six `mk7-*.svg` files.
3. Copy the six `.svg` files into your repo's `illustrations/` folder (versioned copy).
4. **Add the new category to `src/lib/data.js`.** In the `wrenchbook` folder, run this one command in the terminal — it inserts "Bushings & mounts" between "Steering" and "Brakes":

    ```
    sed -i '' 's/"Steering", "Brakes"/"Steering", "Bushings \& mounts", "Brakes"/' src/lib/data.js
    ```

    Confirm with:

    ```
    cat src/lib/data.js | grep categories
    ```

    You should see the new list including `"Bushings & mounts"` between Steering and Brakes.

5. Replace `src/App.jsx` with the one here.
6. Commit and push (one-line message):

    ```
    git add src/App.jsx src/lib/data.js illustrations/*.svg supabase/031_mk7_bushings_and_suspension.sql && git commit -m "Mk7 GTI bushings & mounts batch and suspension additions (SQL 031, six SVGs); adds Bushings & mounts category with dogbone, control arm bushings, rear multilink, subframe collars, plus camber plates and rear adjustable arms" && git push
    ```

## The six new guides

### Bushings & mounts (new category)
- **Dogbone (pendulum) mount** — variant fork: insert only (30 min) or full replacement (2 hr). Documents the 034 vs BFI debate. Torque: subframe M14 stretch bolt 130 Nm + 90° (new bolt), transmission bracket bolts 88 Nm.
- **Front control arm bushings** — three-option fork: OE whole-arm, WALK anti-lift (Whiteline KCA499, rear-position bushing only), or full poly (SuperPro alloy arm ALOY0018K or SPF4176K press-in). Ride-height torque on the bushing bolts.
- **Rear multilink bushings** — SuperPro SPF4180K (outer) + SPF4181K (inner). Ramps or lift required (ride-height torque). Bolt torques flagged as best-known from cross-reference (90 Nm + 90°).
- **Subframe locking collars** — Tyrolsport Deadset (TSDSKVW7-1) as reference, 034 and Racingline as alternatives. Same subframe-drop procedure as the front sway bar; the guide cross-refs that one. ARP bolt torque 85 Nm per Tyrolsport's revised spec.

### Suspension (added to existing category)
- **Camber plates / mounts** — variant fork: 034 Dynamic+ (fixed, +1.4°/+1°, quiet) or adjustable (IE, Vorshlag, Ground Control). Strut-out job; same pattern as the coilover install.
- **Rear camber & toe arms (adjustable)** — 034 Density Line toe link (034-407-1000) as reference; SuperPro and Whiteline as alternatives. Toe link is the common first upgrade; camber arms if toe alone runs out of range.

## New category
"Bushings & mounts" sits between Steering and Brakes in the category order. CatArt: a bushing (donut) with a bolt running through it, same palette as the nine existing marks. Rendered clean at both 44 px (browse list) and 52 px (category header).

## What's next
No queued batches. Suggest deciding priority for the remaining categories — Brakes (pads, rotors, calipers), Drivetrain (clutch, axles, transmission service), Electrical (battery, alternator, starter), etc. — before starting another batch.
