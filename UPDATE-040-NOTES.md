# TDC update-040 — BMW M3 (E46 · S54): full catalog roll-up

**Apply — Supabase SQL + Storage uploads + git push (code change: new Track & safety category).**

1. **Storage:** upload all 43 files in `illustrations/` to the `illustrations` bucket, names unchanged.
2. **Supabase SQL:** run `supabase/041_e46_m3_rollup.sql` top to bottom, in one go. One transaction, safe to re-run.
3. **Git:** copy `src/App.jsx` and `src/lib/data.js` into the repo, commit and push. They add the "Track & safety" category and its category mark. Built from the App.jsx and data.js uploaded in this chat.
4. Fully quit and reopen the app.

## What's in it (54 guides, powertrain `s54`)
- **Brakes** (6): Big brake upgrade, Brake fluid flush & bleed, Stainless brake lines, Brake pads, Brake rotors (and pads), Parking brake shoes & adjustment
- **Bushings & mounts** (5): Differential & rear subframe bushings, Engine & transmission mounts, Front control arm bushings (FCAB), Rear trailing arm bushings (RTAB), Rear subframe / RACP reinforcement
- **Drivetrain** (8): Clutch & flywheel (6MT), Differential fluid, rebuild & 'M clunk', Guibo & centre support bearing, Short shifter & shifter rebuild (6MT), SMG to manual conversion (SMG), SMG fluid change & bleed (SMG), SMG hydraulic pump & motor (SMG), Transmission fluid (Getrag 420G)
- **Electrical** (3): Battery (trunk), Headlight bulbs (halogen or xenon), Window regulator & motor
- **Engine** (17): Engine air filter, CSL-style airbox, Drive belts, tensioners & idler, Cooling system overhaul, Aftermarket exhaust: section 1, section 2 & mufflers, Fuel filter & pressure regulator, Headers & catalytic converters, Oxygen sensors, Oil filter housing gasket, Oil & filter change, Spark plugs & ignition coils, Crank & cam position sensors, Rod bearing service, Throttle actuator, linkage & position sensors, Engine software: street, race & Alpha-N, Valve adjustment & valve cover gasket, VANOS overhaul: pump disc, seals & solenoid
- **Exterior** (3): CSL-style bootlid & spoilers (coupe), Front bumper: OE, CSL-style or carbon, Rear diffuser
- **Forced induction** (1): Supercharger kit (complete systems)
- **Interior** (1): Door panel removal & clips
- **Steering** (3): Front control arms & ball joints, Steering rack: replacement or quicker ratio, Tie rods (inner & outer)
- **Suspension** (4): Coilovers, springs & dampers, Sway bar end links, Rear shock mounts & shock tower reinforcement, Sway bars (front & rear)
- **Track & safety** (3): Roll bar & roll cage, Fixed-back seats, brackets & harnesses, Track day prep

## Notes
- E46 generation flipped live (2001–2006); powertrain `s54` added.
- Not included: a turbo kit (no complete bolt-on S54 kit verified), and deferred ★ items.

- Exhaust brand pass: the exhaust guide now covers 18 muffler/cat-back brands in three sound tiers, 7 section 1/2 options, and 13 sound clips filtered by your answers.
