# TDC update-036 — BMW M3 (E36 · S52): VANOS seals & rattle

**Apply — Supabase-only. No git push, no App.jsx or data.js change.**

1. **Supabase SQL:** run `supabase/037_e36_vanos.sql` top to bottom, one go. One transaction; safe to re-run.
2. **Storage:** upload the 5 files in `illustrations/` to the `illustrations` bucket, filenames unchanged.

SVGs first, then SQL, then fully quit and reopen the app.

## What's in it

One new Engine guide under BMW → M3 → E36 → 3.2 S52: **VANOS seals & rattle**
(`e36-vanos`, group "timing", 6–8 hr, difficulty 4).

- One pre-question: **Seals only** vs **Seals + rattle fix**. The rattle route adds one bench step
  (bearing ring swap in a vise) plus the Beisan tools in the parts list.
- Six chapters: Access · Lock the timing · VANOS off · On the bench · Back on & unlock · Close up.
  18 steps on the rattle route, 17 on seals-only.
- Procedure, fastener sizes and torques are Beisan Systems' published seals and rattle procedures;
  Bentley cross-checked where it has the same fastener. The two left-hand threads (fan nut, T30 bearing
  bolt) each get a warning block. The install step (first spline pair, shaft fully retracted, exhaust
  sprocket fully clockwise) is the flagged critical step.
- Embed: Beisan "Finding the smart teeth" (8HKRaEZOhPc).

## Illustrations (5, `e36-vanos-` prefixed, clearance-checked)

| id | shows |
|---|---|
| e36-vanos-hero | fastener map on the face of the unit |
| e36-vanos-timing | cam lock blocks + bracket; crank lock pin |
| e36-vanos-piston | seal groove cross-section, new vs failed |
| e36-vanos-install | splined shaft into intake sprocket, exhaust sprocket clockwise |
| e36-vanos-bearing | exploded bearing stack for the rattle fix |

## Notes
- Next SQL number is 038.
- Engine tail still open: O2 / crank / cam sensors, in-tank fuel pump, oil-pan gasket.
