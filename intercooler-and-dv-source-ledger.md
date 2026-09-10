# Source Ledger — Mk5 GTI 2.0T (FSI & TSI) · Intercooler upgrade · Diverter valve options

## Intercooler — sources consulted

| # | Source | Type | Notes |
|---|--------|------|-------|
| S1 | Integrated Engineering, IETPCB1 Mk5/Mk6 2.0T FDS Intercooler install guide (PDF) | Vendor install manual | The OE-location procedure used step for step: grille and bumper (T25 counts), radiator support to service position on two long M10 bolts, hoses off, coolant drained at the lower hose, fan shroud 4× T30, radiator 4× T30, intercooler 2× T30 top, tilt core + condenser, 5 condenser screws, core out the bottom on its brackets; refit with M6×18 + spacers (condenser), M6×14 or M6×16 + 1/8" spacers (radiator, ozone-sensor cars), billet adapter takes the factory hose o-ring, L hose left / S hose right, undertray insert removed where it fouls the hose. Tools list. No torque figures given. |
| S2 | APR Intercooler System PQ35 1.8T/2.0T product page | Vendor spec + test | Core 2.25 × 16.25 × 22 in, 40 % larger than stock; bar-and-plate louvered fins; billet adapter; T-bolt clamps. Five-pull dyno test: stock car pulled boost and timing on runs 3–5; APR core ≈40 °F cooler by run 5 (3 °F hotter ambient). Core-style trade-off table. |
| S3 | ECS Tuning Mk5 GTI/Jetta FMIC kits: 007812LA01-01KT (for OEM charge pipes) and -02/-03KT (with ECS charge pipes) | Vendor spec + test | Core 23⅝ × 6½ × 3 in (460 in³), cast tanks with flow divider, bolt-on brackets (no drilling), 4-ply couplers, T-bolt clamps. Dyno on a K04 Mk6 GTI: +9 whp @ 5,525, +10 wtq @ 5,220, 9 % better cooling efficiency, 66 °F lower outlet temp; vendor notes a slight pressure drop from reduced total core volume. Throttle body pipe not compatible with the noise pipe; plug ES#263635. Factory core described as sandwiched between condenser and radiator. |
| S4 | ECS News, Mk5 GTI front-mount intercoolers roundup | Vendor | Direct-fit cores from APR, IE, Neuspeed, Forge, CTS listed for the Mk5. |
| S5 | golfmk6 "Front mount vs upgraded stock location" thread | Owner | Forge Twintercooler is a second core in series with the factory one; owners: clear heat-soak improvement, no lag, reversible; little measured difference vs a good OE-location core. |
| S6 | Black Forest Industries APR Mk5/Mk6 intercooler listing | Vendor | Fitment across FSI/TSI Mk5/Mk6, install directions included, lifetime warranty. |

### Excluded
- MQB (Mk7) APR pages that ranked alongside: different platform.
- 1.8T Mk4 FMIC install sheets: different chassis.

### Calls
1. **Procedure**: IE's sheet is the OE-location spine; ECS's product documentation plus standard practice is the front-mount spine (mount to beam, bypass factory core, route two hoses). Front-mount kit sheets themselves were not fetchable; the guide points the reader to the kit sheet for bracket specifics.
2. **Torque**: none published by either vendor. The M6 tank bolts and T30 turbo-outlet bolts are shown as `single` "snug" values; T-bolt clamps ~5 Nm from general practice.
3. **Chart**: five-run outlet temperature is drawn as shapes anchored to APR's ≈40 °F claim and ECS's 66 °F claim; labelled as such on the drawing and in the caption.
4. **Two-question gate**: style (OE-location vs front-mount) then charge pipes (yes/no). Items scoped with "a+b" combinations where a part exists only for one pairing (e.g. FSI turbo outlet pipe only for OE-location + pipes; the FMIC "with pipes" kit only for front-mount + pipes).

## Diverter valve options — sources consulted

| # | Source | Type | Notes |
|---|--------|------|-------|
| D1 | Forge Motorsport 2.0T FSI replacement bypass valve kit instructions (ECS-hosted PDF) | Vendor install sheet | Mount valve on the turbo with the OEM bolts (5 mm hex), solenoid on the kit bracket under one valve bolt or elsewhere within harness reach, vacuum lines kept clear of the passenger axle. |
| D2 | USP / UroTuning Forge FMFSITVR listings | Vendor | Pressure/vacuum piston valve retaining OEM ECU control, intake-manifold tap included with two spare ports, no fault codes; remote-mount cars use a different reference. |
| D3 | UroTuning GFB DV+ T9351 listing | Vendor | Replaces the valve mechanism only, keeps the VW solenoid coil; billet body, brass piston; no vacuum runs, no ballast resistor; assembly onto the factory solenoid. |
| D4 | Audizine "new DV/BOV options" and "Ultimate diverter valve information" threads | Owner | Turbosmart Kompact EM plumb-back as a direct rev-D upgrade; DV+ long-term experience; factory piston valve leaks by design and can hang open after a high-boost shift; BOVs upset fuel trim on MAF cars; electronic actuation is faster than pneumatic. |

### Calls
- Three options as a second question after "Which engine?": factory piston valve; drop-in electronic (DV+, Kompact EM); Forge mechanical. Steps differ only in one extra step per aftermarket route (DV+ assembly; Forge vacuum tap and bracket). The 8 Nm bolt figure stays `single`.
- Blow-off valves listed under aftermarket as "sound only", not recommended on the FSI.
