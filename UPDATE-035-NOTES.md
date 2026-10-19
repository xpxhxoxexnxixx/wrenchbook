# TDC update-035 — BMW M3 (E36 · S52): Cooling system overhaul

**Apply — Supabase-only. No git push, no App.jsx or data.js change.**

1. **Supabase SQL:** open the SQL editor and run `supabase/036_e36_cooling_overhaul.sql`
   top to bottom, one go. One transaction: if anything fails it rolls back. Safe to re-run.
2. **Storage:** upload the 7 files in `illustrations/` to the `illustrations` bucket,
   filenames kept exactly (they are the IDs the guide looks up).

Upload the SVGs first if you want to avoid a broken-image flash, then run the SQL.
Then fully quit and reopen the app — it loads the task list once at startup.

## What's in it

One new Engine guide under BMW → M3 → E36 → 3.2 S52: **Cooling system overhaul**
(`e36-cooling-overhaul`, group "cooling", 2–6 hr, difficulty 3).

- Two pre-questions: **refresh vs full overhaul**, then **plastic vs aluminium housing**.
- Four chapters: Drain & strip · Pump & thermostat · Radiator, tank & hoses (full only) · Fill & bleed.
  Refresh route shows 8 steps, full route shows 12.
- The housing step exists twice (plastic / aluminium), each scoped to the answer — step blocks
  can't be scoped individually without a code change, so the whole step is.
- Parts scoped to route: M3 radiator 17111469179, expansion tank, cap, brass bleeder, hoses,
  fan clutch and sensors only appear on "Full overhaul".
- Torques are Bentley values (10 / 10 / 10 / 22 / 25 / 40 Nm) with confidence markers.
- Embed: FCP Euro E36 M3 cooling overhaul (VW_uEfgvNaY).

## Illustrations (7, all `e36-cool-` prefixed, #F9F9F5, clearance-checked)

| id | shows |
|---|---|
| e36-cool-hero | plan view: radiator, tank, shroud, fan/clutch, pump, housing |
| e36-cool-drains | radiator drain screw + 19 mm block plug behind the front O2 sensor |
| e36-cool-fanclutch | 32 mm wrench + holder, left-hand thread: loosen clockwise |
| e36-cool-pump | pump face: 4 studs, 2 jacking holes, O-ring bore in section |
| e36-cool-thermostat | exploded stack: thermostat (vent at 12), gasket, housing, lift bracket |
| e36-cool-hoses | the four rubber connections on the front, numbered |
| e36-cool-bleed | nose-up, cap off, bleeder open, heater hot |

## Notes
- Next SQL number is 037.
- Redline mode: confirmed with Anthony that toggling it on with no redline-flagged tasks empties
  the categories, which is the intended behaviour. No change made.
- Next up: VANOS seals & rattle, then the Engine tail (O2/crank/cam sensors, fuel pump, oil-pan gasket).
