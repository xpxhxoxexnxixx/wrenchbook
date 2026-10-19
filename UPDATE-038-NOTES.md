# Update-038 — Mk7/Mk7.5 GTI catalog roll-up (SQL 039)

**Apply: Supabase SQL + Storage uploads + git push (App.jsx only).**

1. Supabase SQL editor: run `supabase/039_mk7_catalog.sql`. Safe to re-run.
2. Supabase Storage → `illustrations` bucket: upload all 31 files in `illustrations/`.
3. git: copy `src/App.jsx` over the repo's, then commit and push (personal account active).
4. Fully quit and reopen the app.

## 19 guides, powertrain `cxca`
Brakes: brakes-mk7, brake-fluid-mk7
Drivetrain: dsg-service-mk7, clutch-mk7, shifter-mk7
Electrical: battery-mk7, headlight-bulbs-mk7
Exterior: front-bumper-mk7, headlight-unit-mk7, mirror-glass-mk7
Interior: cabin-filter-mk7, door-panel-mk7
Forced induction: turbo-mk7, intercooler-mk7, downpipe-mk7
Engine: ecu-tune-mk7, catch-can-mk7, catback-mk7, carbon-clean-mk7

## App.jsx change (only change)
New `amVisible(g, choice)` helper. The "Aftermarket options (N)" count, its list,
and the shopping-list aftermarket rows all use it, so rows scoped with `only`
are filtered everywhere and an empty section no longer shows.

## Known, not fixed here
This App.jsx has no question-level `only` (dependent pre-questions). The Mk5
dogbone / engine-mount guides that rely on it will ask "Which upgrade?" even
after "Factory replacement". None of the 19 new guides depend on it.
