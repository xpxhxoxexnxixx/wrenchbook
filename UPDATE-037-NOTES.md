# TDC update-037 — BMW M3 (E36 · S52): Engine tail

**Apply — Supabase-only. No git push, no App.jsx or data.js change.**

1. **Supabase SQL:** run `supabase/038_e36_engine_tail.sql` top to bottom, one go. One transaction; safe to re-run.
2. **Storage:** upload the 3 files in `illustrations/` to the `illustrations` bucket, names unchanged.

SVGs first, then SQL, then fully quit and reopen the app.

## What's in it — three guides, all under BMW → M3 → E36 → 3.2 S52 → Engine

| id | title | group | time | diff | pre-question |
|---|---|---|---|---|---|
| e36-o2-sensors | Oxygen (O2) sensors | emissions | 1–1.5 hr | 2 | pre-cat / post-cat / all four |
| e36-position-sensors | Crank & cam position sensors | sensors | 30–60 min | 2 | crank / cam |
| e36-oil-pan-gasket | Oil pan gasket | lubrication | 5–7 hr | 4 | none (chapterless, 8 steps) |

- **O2 sensors:** four on the M3 dual exhaust, same part 11781427884 all round, 22 mm slotted socket; pre-cat vs post-cat vs all-four scopes the steps and the "also replace" list. ~45 Nm.
- **Position sensors:** crank (front of block, ~550 Ω, no-start symptom, recall history noted) vs cam (front on early cars, rear-by-starter on late cars — do it with the oil filter housing off). Both M6 · 10 Nm.
- **Oil pan gasket:** the subframe-drop job. Engine support brace from above, subframe down a few inches, pan out; gasket 11131437237 fitted whole (never cut), M6 · 10 Nm / M8 · 22 Nm, alignment after. Flags the oil filter housing gasket + front mounts as same-session work.

## Illustrations (3, clearance-checked)
e36-o2-hero (four-sensor layout) · e36-pos-hero (crank + cam locations, early/late) · e36-pan-hero (support brace + subframe drop).

## Notes
- This closes the E36 Engine category (maintenance side). Engine upgrades / Forced induction come later per the sequence.
- Next SQL number is 039. Next batch: E36 **Suspension** (batch 3).
