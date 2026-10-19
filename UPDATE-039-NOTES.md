# TDC update-039 — BMW M3 (E36 · S52): remaining catalog roll-up

**Apply — Supabase-only. No git push, no App.jsx or data.js change.**

1. **Storage:** upload all 39 files in `illustrations/` to the `illustrations` bucket, names unchanged.
2. **Supabase SQL:** run `supabase/040_e36_rollup.sql` top to bottom, in one go. It's one transaction and safe to re-run.
3. Fully quit and reopen the app. New rows appear only after a fresh launch.

## What's in it (38 guides)
- **Brakes** (4): Big brake upgrade, Brake fluid flush & stainless lines, Brake pads & rotors, Parking brake shoes
- **Bushings & mounts** (4): Chassis reinforcement: what the M3 has, what to add, Engine & transmission mounts, Front control arm bushings (FCAB), Rear trailing arm bushings (RTAB) & limiters
- **Drivetrain** (5): Clutch & flywheel, Differential: LSD, gearing & reinforcement, Guibo & center support bearing, Shifter rebuild, short shifter & DSSR, Transmission & differential fluid
- **Electrical** (3): Battery replacement (trunk), Headlight bulbs, Window regulator & motor
- **Engine** (5): Cat-back & axle-back exhaust, Headers, Performance air intake, Section 1 (cat section), Tuning path: software, HFM, cams and manifold
- **Exterior** (2): Headlight housings & Euro conversion, Hood & trunk gas struts
- **Forced induction** (1): Supercharger kit
- **Interior** (3): Door panel removal & clips, Seat twist fix & racing seat mounting, Steering wheel swap
- **Steering** (3): Front control arms & ball joints, Steering rack (replace or Z3 swap), Tie rods (inner & outer)
- **Suspension** (8): Front camber plates, Coilovers, springs & dampers, Sway bar end links, Rear camber & toe correction, Rear shock mounts & reinforcement, Front strut brace, Front sway bar upgrade, Rear sway bar upgrade

## Notes
- Every task uses powertrain `s52`.
- No new categories: all ten already exist in data.js.
- Not included: a turbo kit guide (no verifiable complete E36 M3 kit), and the deferred items listed in chat.
