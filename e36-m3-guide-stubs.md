# BMW E36 M3 (S52) — catalog research & guide stubs

Research pass, Sep 17 2026. Nothing here is a finished guide; it's the map of what exists, what the community actually does to these cars, which GTI guides can be used as a template, and what is new to the app. Part numbers marked *(confirm)* were seen in one source only.

---

## 1. Proposed data model

**Brand:** BMW → live
**Model:** M3
**Generations (gens):**
- E30 (1988–1991) — not live
- **E36 (1995–1999) — live**
- E46 (2001–2006) — not live
- E9x (2008–2013) — not live
- F80 (2015–2018) — not live
- G80 (2021+) — not live

**Powertrains under E36:**

| id | name | code | note | live |
|---|---|---|---|---|
| `s52` | 3.2 S52 | S52B32US | 1996–1999 · OBD2 · 5-speed ZF manual or 5-speed auto · coupe, sedan (97–98), convertible (98–99) | **yes** |
| `s50us` | 3.0 S50 | S50B30US | 1995 only · OBD1 · incl. Lightweight | no (later) |

Year nuances to carry into guides:
- All S52 cars are OBD2; the 1995 S50 is OBD1 with a different DME, HFM and wiring. Every engine-management/tuning guide is S52-only.
- 1997+ cars have door-mounted side airbags → door panel and window regulator guides need a disconnect-battery step and a "don't drill here" warning.
- Sedan (97–98) has different exhaust rear section, sunroof panel, rear window trim; convertible (98–99) has different rear shock mounts access and no rear headliner.
- Trunk-mounted battery on all E36.
- Automatic cars (ZF 5HP18): clutch/shifter/manual-fluid guides don't apply; a separate ATF service guide is a candidate.

Illustration prefix: `e36-`

---

## 2. Categories & guide stubs

Legend — **Template:** which existing guide's shape to reuse. **New:** no GTI counterpart; written fresh. Priority: ★★★ do first (community-critical or cheap-and-common), ★★ core catalog, ★ nice to have.

### Engine

| id | Title | Kind | Pre-question | OE / aftermarket landscape | Template | Pri |
|---|---|---|---|---|---|---|
| `e36-oil-change` | Oil & filter change (S52) | repair | none | Canister filter (Mann/Mahle), ~6.5 L *(confirm)*, drain plug crush washer; oil spec debate (BMW 10W-60 came later; S52 era 15W-50/10W-40). Aftermarket: magnetic drain plug, Fumoto valve | New (the GTI catalog never had an oil change; worth adding for both) | ★★ |
| `e36-air-filter` | Engine air filter (stock airbox) | repair | none | Mann C 25 114 *(confirm)*; K&N drop-in exists, community says stay paper | `air-filter-oe` | ★★ |
| `e36-intake` | Aftermarket intake | upgrade | brand: Turner/Conforti CAI · aFe Magnum Force · Dinan · other cone kit | On a stock HFM the gain is sound; the real intake path is HFM + software (see tuning guide). Note: oiled filters vs the HFM hot-film sensor | `intake-aftermarket` | ★★ |
| `e36-plugs-coils` | Spark plugs & ignition coils | repair | none (maybe: "stock or supercharged" for heat range) | NGK BKR6EQUP 4-prong (OE Bosch equiv), 6 coil-on-plug coils (Bremi/Bosch), coil boots. Colder plug for FI cars | `plugs` | ★★★ |
| `e36-vanos` | VANOS seals & rattle repair (single VANOS) | repair | seals only · seals + rattle kit | Beisan Systems BS011 seals, BS012 rattle kit, modified 18 mm socket, soft vise jaws; Dr. Vanos rebuilt unit as the "send it out" alternative. Symptoms: low-end torque loss, 3k stumble, marbles rattle | New — the #1 S52-specific job | ★★★ |
| `e36-cooling-overhaul` | Cooling system overhaul | repair | factory refresh · upgrade — then chapters: Water pump & thermostat · Radiator & hoses · Expansion tank & bleeding · Fan clutch / electric fan | OE: Behr radiator 17111469179, water pump 11517527799 (composite impeller), 88 °C thermostat 11537511580, hoses 11531708499/11531726344, expansion tank 17111723520, cap 17111742231, bleeder screw. Upgrades: Stewart/EMP metal-impeller pump, aluminum t-stat housing (Turner, ECS), aluminum expansion tank (Turner), Mishimoto/CSF/Koyo aluminum radiator, 71 °C or 68 °C thermostat (contested), aluminum water-pump pulley, electric fan conversion (Turner, SPAL) | New — chaptered like the turbo-kit guide | ★★★ |
| `e36-belts` | Drive belts & tensioners | repair | none | Main belt + A/C belt, hydraulic tensioner, idler pulleys; do with cooling overhaul (fan and shroud already off) | New (short) | ★★ |
| `e36-valve-cover-gasket` | Valve cover gasket & coil boots | repair | none | OE Elring/Victor Reinz gasket set, 15 grommet washers, coil boots. Oil in plug wells kills coils | New | ★★★ |
| `e36-ofh-gasket` | Oil filter housing gasket | repair | none | Cheap gasket, big leak; housing bolts torque; alternator belt off | New (short) | ★★ |
| `e36-oil-pan-gasket` | Oil pan gasket | repair | none | Requires lowering front subframe (or engine lift) — heavy job, difficulty 4 | New | ★ |
| `e36-intake-boot-icv` | Intake boot, ICV & vacuum leaks | repair | none | Cracked HFM-to-throttle boot, ICV cleaning, CCV hose; codes P0171/P0174, rough idle | New (short) | ★★ |
| `e36-fuel-filter` | Fuel filter | repair | none | Under the car, driver side, two clamps; Mahle/Mann; pressure relief step | `fuel-filter` (Mk5) | ★★ |
| `e36-fuel-pump` | In-tank fuel pump | repair | none | Under rear seat; VDO OE, Walbro 255 for FI builds (supercharger kits ship their own) | New | ★ |
| `e36-injectors` | Fuel injectors | repair/upgrade | stock replacement · "24 lb" injectors for tuning stage 2+ | Pelican has a full article; ties directly to the HFM/software path | New | ★ |
| `e36-o2-sensors` | Oxygen sensors (×4, OBD2) | repair | none | Pre- and post-cat, Bosch OE; P0420/P0430 diagnosis | New (short) | ★ |
| `e36-crank-cam-sensors` | Crankshaft & camshaft position sensors | repair | none | No-start / stall-when-hot classic; Bosch OE | New (short) | ★ |
| `e36-tuning-path` | Software, HFM & bolt-on power (Stage 1–4) | upgrade | chapters by stage: Stage 1 software · Stage 2 HFM + injectors · Stage 3 Schrick cams · Stage 3+ M50 manifold · Stage 4 headers | Turner/Conforti Shark Injector (plugs into the under-hood diagnostic port; needs a 10 A battery charger, 91+ octane, raises limiter to 7,000), Porsche 3.5" HFM (Bosch 0 280 217 809) + "24 lb" injectors, Schrick 264/256 cams, M50 non-VANOS intake manifold swap (torque trade-off), Euro/Supersprint headers. Dinan software as the other path. **What-you-get step + measured-gains chart** (Turner: +15 hp / +9 lb-ft on Stage 1) | New — chaptered | ★★ |
| `e36-headers` | Headers | upgrade | brand: Supersprint · OE Euro S50 headers · Active Autowerke · other | Requires Stage 4 software or a tune to not run lean; Euro headers are the "OEM+" answer | `headers-r32` | ★★ |
| `e36-section1` | Section 1 (cats & resonator) upgrade | upgrade | high-flow cats · resonated test pipe (track) | US section 1 = 2 cats + resonator. Supersprint, Active Autowerke, Euro OE section 1 + Euro cats, CPI. Same legal framing as the GTI downpipe guide | `downpipe` (the E36 analog) | ★★ |
| `e36-catback` | Cat-back exhaust (Section 2) | upgrade | body: coupe/convertible · sedan (different rear section) | Borla, Supersprint, Active Autowerke Gen 3, Eisenmann, UUC, Corsa, Magnaflow. Pelican: preload rear hangers 15 mm; two people | `catback` | ★★ |
| `e36-underdrive-pulleys` | Underdrive pulleys | upgrade | none | UUC/Turner; small gain, contested; often bundled with belt job | New (short) | ★ |

### Forced induction

| id | Title | Kind | Pre-question | Landscape | Template | Pri |
|---|---|---|---|---|---|---|
| `e36-supercharger-kit` | Supercharger kit (complete systems) | upgrade | brand/level: Active Autowerke Rotrex C38 Level 1 (~360 hp) · Level 2 (FMIC, fuel pump, injectors, 400+ hp) · Level 3 · VF Engineering Vortech V3 Si (VFK19-01, +110 hp, 6 psi, non-intercooled) | Both currently shipping (Turner lists AA L1 at ~$8,074). ESS, Dinan, Downing Atlanta kits are discontinued — mention as "if your car came with one". Power chart hero: stock 240 vs AA L1 vs AA L2 vs VF. Belt/pulley alignment, fuel pump, software flash, break-in | `turbo-kit` (FSI) chaptered shape | ★★ |
| `e36-turbo-kit` | Turbo kit (complete systems) | upgrade | brand: CES Motorsport GT35R stage system (complete, incl. head studs / compression drop / tune) · other | Complete engineered E36 M3 turbo kits are nearly gone (HPF, AA turbo discontinued). SPA/Garagistic and eBay T3/T4 kits are hardware-only (no fueling, no tune) → out of scope per the complete-kits rule; say so in the guide. Consider folding turbo into the supercharger guide as a "why most owners supercharge" chapter | `turbo-kit` | ★ |

No intercooler, downpipe or diverter valve guides — nothing to attach them to on an NA car.

### Suspension

| id | Title | Kind | Pre-question | Landscape | Template | Pri |
|---|---|---|---|---|---|---|
| `e36-sway-front` | Front sway bar upgrade | upgrade | brand/adjustability | H&R 27 mm, Eibach, Hotchkis, UUC, Turner/Rogue. **Big difference from the GTI:** no subframe drop; the bar hangs on two brackets under the front subframe and links to the control arms. 1–2 hr job, difficulty 2 | `sway-front` for shape only — full rewrite | ★★ |
| `e36-sway-rear` | Rear sway bar upgrade | upgrade | brand | Same brands; rear bar mounts to subframe tabs that crack (see chassis reinforcement). Adjustable links common | `sway-rear` | ★★ |
| `e36-endlinks` | Sway bar end links | repair/upgrade | front · rear | Lemförder OE, adjustable (Turner, Rogue, Condor) | `endlinks` | ★★ |
| `e36-coilovers` | Coilovers, springs & dampers | upgrade | route: coilovers · springs + dampers — then (coilovers) kit brings camber plates or reuses strut mounts | Coilovers: Ground Control (Koni, with camber plates), TC Kline (Koni/D/A), Bilstein B14/PSS9, KW V1/V2/V3, H&R, Fortune Auto 500, BC Racing BR, Öhlins R&T. Springs + dampers: Bilstein B6/B8 or Koni Sport + H&R/Eibach/Dinan springs. Rear spring is separate from the shock (like the GTI). Strut mounts, RSMs, spring pads replaced at the same time | `coilovers-mk7` | ★★★ |
| `e36-camber-plates` | Camber plates | upgrade | brand: Vorshlag · Ground Control · TC Kline | Standard alongside coilovers; E36 strut tower geometry | `camber-plates-mk7` | ★★ |
| `e36-rsm` | Rear shock mounts & reinforcement | repair/upgrade | OE rubber · Z3 heavy-duty mounts · Rogue Engineering/Ground Control + reinforcement plates | The E36 clunk. Access differs coupe vs convertible vs sedan | New | ★★★ |
| `e36-rear-camber-toe` | Rear camber & toe correction | upgrade | RTAB shims · adjustable trailing arm/camber arms (Turner, IE) | Needed once lowered; ties to RTAB guide | `rear-camber-toe-arms-mk7` | ★ |
| `e36-strut-brace` | Front strut brace / X-brace | upgrade | none | Bolt-on; Euro/M3 strut bar, Turner, UUC; front subframe X-brace | New (short) | ★ |

### Steering

| id | Title | Kind | Pre-question | Landscape | Template | Pri |
|---|---|---|---|---|---|---|
| `e36-tie-rods` | Tie rods (inner & outer) | repair | none | E36 M3 uses complete tie rod assemblies (Lemförder/TRW); alignment after | `tie-rods-mk7` | ★★ |
| `e36-control-arms` | Front control arms & ball joints | repair | none | Ball joints aren't serviceable on the M3's aluminum arms → replace arms (Lemförder $$, Meyle HD). Pair with FCAB job; pickle fork / ball joint separator | `ball-joints-mk7` | ★★★ |
| `e36-front-wheel-bearing` | Front wheel bearing | repair | none | Pressed hub/bearing; FAG/SKF; hub puller | `front-wheel-bearing-mk7` | ★ |
| `e36-rear-wheel-bearing` | Rear wheel bearing | repair | none | Pressed into trailing arm; needs puller/press; often done with RTAB | `rear-wheel-bearing-mk7` | ★ |
| `e36-steering-rack` | Steering rack (Z3 quick-ratio swap or replacement) | repair/upgrade | replace like-for-like · Z3 2.8/3.0 rack swap (3.0 turns) | Rebuilt racks; new tie rods, rack bushings, steering guibo/U-joint, PS fluid flush, alignment. M3 Pink blog part III documents it | New | ★★ |
| `e36-ps-leaks` | Power steering hoses, reservoir & fluid | repair | none | Reservoir hose leaks, return hose, ATF vs CHF; low priority | New (short) | ★ |

### Bushings & mounts

| id | Title | Kind | Pre-question | Landscape | Template | Pri |
|---|---|---|---|---|---|---|
| `e36-fcab` | Front control arm bushings (FCAB) | repair/upgrade | factory offset rubber (Genuine 31129064875, adds caster) · poly (Powerflex, Garagistic 80A/95A, Turner) · Delrin/monoball (Ground Control) | Press-in; pre-pressed bracket kits save time. E36 M3 already has offset bushings from the factory | `front-lca-bushings-mk7` | ★★★ |
| `e36-rtab` | Rear trailing arm bushings (RTAB) & limiters | repair/upgrade | OE rubber · OE + limiters (Turner, AKG) · poly (Powerflex) · spherical | The other E36 signature job; special tool or the no-tool method (bimmerdiy has both); re-align after | New | ★★★ |
| `e36-subframe-bushings` | Rear subframe & differential bushings | repair/upgrade | rubber · poly · aluminum/solid | Subframe drop; do with chassis reinforcement, RTAB, diff mount | New — heavy (difficulty 4–5) | ★ |
| `e36-engine-trans-mounts` | Engine & transmission mounts | repair/upgrade | factory · upgrade (Turner/Rogue 80A poly, Condor, Group N) | Same chaptered shape as the Mk5 mounts guide; note front subframe engine-mount reinforcement (big washers on late cars) | `engine-mounts` (Mk5) | ★★ |
| `e36-chassis-reinforcement` | Chassis reinforcement (what the M3 already has, what it needs) | upgrade | none — informational + bolt-on route | **M3s (96–99) already have the rear subframe plates** (41002256495/6, 41112256497/8) — the non-M kit is not needed unless already cracked. What owners add: RTAB pocket plates (weld), rear sway bar tab plates (weld), rear shock tower reinforcement (bolt-on Z3 mounts or Rogue/Garagistic plates), front subframe engine-mount plates or washers. Welding is out of DIY scope: this guide explains, inspects, and does the bolt-on part; welding jobs get a "what to ask a shop for" chapter | New | ★★ |

### Brakes

| id | Title | Kind | Pre-question | Landscape | Template | Pri |
|---|---|---|---|---|---|---|
| `e36-brake-pads` | Brake pads | repair | front (315 mm) · rear (312 mm) | OE Textar/ATE/Jurid, wear sensors; Hawk HPS/HP+, Ferodo DS2500, EBC, PFC | `brake-pads` | ★★★ |
| `e36-brake-rotors` | Brake rotors (and pads) | repair | front · rear | Zimmermann coated, ATE, Brembo blanks; StopTech slotted; set screw | `brake-rotors` | ★★★ |
| `e36-brake-flush` | Brake fluid flush & bleed | repair | manual (clutch slave shares reservoir) · auto | Bleed order per Bentley *(confirm — ABS unit differs from the VW order)*; pressure bleeder cap fits BMW | `brake-flush` | ★★ |
| `e36-brake-lines-ss` | Stainless brake lines | upgrade | none | StopTech, Goodridge; also stainless clutch line | `brake-lines-ss` | ★★ |
| `e36-bbk` | Big brake upgrade | upgrade | kit type: E46 M3 CSL rotor bracket kit (keeps calipers; Turner) · StopTech ST-40 · Brembo GT · Wilwood · Porsche 996 Brembo conversion (Rally Road brackets) · Paragon/Alcon | Wheel clearance (17" vs 18"), brake bias, pad choice; Pelican has the Brembo install | New | ★★ |
| `e36-parking-brake` | Parking brake shoes & adjustment | repair | none | Drum-in-hat shoes inside the rear rotor; adjuster star wheel; handbrake cable adjustment. Rear rotor job unlocks it | New | ★★ |

### Drivetrain

| id | Title | Kind | Pre-question | Landscape | Template | Pri |
|---|---|---|---|---|---|---|
| `e36-clutch` | Clutch & flywheel | repair/upgrade | OE (Sachs/LuK, dual-mass) · lightweight flywheel + performance clutch (JB Racing aluminum, UUC, Clutchmasters, Spec) — S52-only vs M5 clutch upsizing (bimmerdiy) | Rear main seal, pilot bearing, slave (21526775924), guibo and CSB while it's out; transmission out from below (easier than the GTI) | `clutch` | ★★ |
| `e36-short-shifter` | Short shifter & shifter rebuild | upgrade | brand: UUC EVO3 · Turner adjustable · Z3 lever swap · B&M — plus "rebuild bushings first" | Shifter carrier bushings, selector rod bushings, ZHP/Turner weighted knob; DSSR as also-replace | `short-shifter` | ★★★ |
| `e36-dssr` | Dual-shear selector rod (DSSR) | upgrade | none | Turner/Rennline, UUC; 30-minute job from inside the car on Turner's design | New (short) | ★ |
| `e36-guibo-csb` | Driveshaft flex disc (guibo) & center support bearing | repair | none | Exhaust off; SGF guibo, FAG CSB; Red Eye Garage write-up; billet CSB option (Parts Shop Max) | New | ★★★ |
| `e36-trans-fluid` | Manual transmission fluid (ZF S5D 320Z) | repair | none | MTF-LT-2 / Redline D4 ATF / MTL debate; 17 mm plugs; ~1.4 L | New (the DSG-service analog) | ★★ |
| `e36-diff-fluid` | Differential fluid (LSD) | repair | none | 3.23 clutch-type LSD; 75W-140 with friction modifier (Redline 75W140) | New | ★★ |
| `e36-diff-swap` | Differential swap / LSD upgrade & final drive | upgrade | ratio: keep 3.23 · 3.38 / 3.46 · 3.64 — and LSD: rebuilt clutch-type (Diffsonline) · Wavetrac · MFactory helical | Diff hangs on three bolts + halfshafts; output shaft seals; billet diff cover (Turner) | New | ★ |
| `e36-clutch-hydraulics` | Clutch master, slave & stainless line | repair | none | Slave 21526775924; clutch stop; bleed with brakes | New (short) | ★ |
| `e36-atf-service` | Automatic transmission fluid (ZF 5HP18) | repair | none | For automatic cars only; "lifetime" fluid myth | New | ★ |

### Electrical

| id | Title | Kind | Pre-question | Landscape | Template | Pri |
|---|---|---|---|---|---|---|
| `e36-battery` | Battery replacement (trunk) | repair | none | Trunk-mounted; group size *(confirm — 49/H8 vs 48/H6)*; vent tube; no coding | `battery` | ★★ |
| `e36-headlight-bulbs` | Headlight bulbs | repair | US housings (9006 low / 9005 high) · Euro glass ellipsoids (H1 low / H7 high) | Osram/Philips; LED drop-ins in reflectors not legal (same stance as GTI) | `headlights` | ★★ |
| `e36-window-regulator` | Window regulator & motor | repair | coupe/convertible · sedan (different regulators) | The E36 job; rivets to drill, door panel off, side-airbag caution (97+) | New | ★★★ |
| `e36-cluster-pixels` | Instrument cluster / OBC pixel & bulb repair | repair | none | Ribbon cable replacement, bulbs; cluster removal | New | ★ |
| `e36-blower-resistor` | Blower motor resistor & blower | repair | none | Under the cowl; Red Eye Garage has the blower write-up | New | ★ |
| `e36-alternator` | Alternator & voltage regulator | repair | none | Bosch/Valeo 140 A; regulator brushes as the cheap fix | New | ★ |

### Exterior

| id | Title | Kind | Pre-question | Landscape | Template | Pri |
|---|---|---|---|---|---|---|
| `e36-headlight-housings` | Headlight housings: US → Euro glass ellipsoid conversion, lens restoration | repair/upgrade | restore US · replace with ZKW/Hella Euro (needs 9006/9005 → H1/H7 adapters) · Depo/DJ replica | ZKW glass ellipsoids are the community's default upgrade; adjuster repair; foggy lens | `headlight-housings` | ★★ |
| `e36-hood-trunk-struts` | Hood & trunk gas struts | repair | coupe/convertible · sedan (different hood struts) | Cheap Stabilus; 10 minutes | New (short) | ★ |
| `e36-fog-lights` | Fog lights (glass conversion) & bulbs | repair/upgrade | none | Glass Euro fogs vs cracked plastic US | New (short) | ★ |
| `e36-sunroof` | Sunroof panel tabs, cassette & seals | repair | none | Race German ASA panels; Pelican sunroof article | New | ★ |
| `e36-clear-corners` | Clear corners & side markers | upgrade | none | Cosmetic; Euro clear/smoked | New (short) | ★ |

### Interior

| id | Title | Kind | Pre-question | Landscape | Template | Pri |
|---|---|---|---|---|---|---|
| `e36-door-panels` | Door panel removal, warp repair & clips | repair | none | Warped upper panels, broken clips, side-airbag caution (97+); shared prerequisite for regulator, speakers | New | ★★ |
| `e36-seat-twist` | Sport seat twist fix | repair | none | The Vader-seat twist: rail/gear repair, aftermarket brackets | New | ★★ |
| `e36-headliner` | Headliner replacement | repair | coupe · sedan · convertible (no rear headliner) | Pelican article; adhesive choice; sunroof panel | New | ★ |
| `e36-cabin-filter` | Cabin microfilter | repair | none | Under the cowl cover, driver side | New (short) | ★ |
| `e36-steering-wheel` | Steering wheel swap (E46 M3 wheel) | upgrade | none | Airbag disconnect procedure; popular OEM+ swap | New | ★ |
| `e36-glovebox-console` | Glovebox sag & center console fixes | repair | none | Small bimmerdiy-class fixes | New (short) | ★ |

---

## 3. What changes versus the GTI template

- **Cooling is a category-defining topic here.** On the GTI it was one water-pump guide; on the E36 it's the first thing every owner does. Chaptered guide, refresh vs upgrade fork.
- **VANOS, RTAB, RSM, guibo/CSB, window regulator, seat twist** have no VW analog and are the signature E36 jobs. They should anchor the first batches.
- **Front sway bar is easy on this car.** The Mk5 guide's subframe-drop drama does not apply; do not copy its steps.
- **Downpipe → Section 1.** Same legal/tune framing, different hardware (two cats + resonator in one section, four O2 sensors).
- **Forced induction is supercharger-first.** Two real, currently shipping bolt-on supercharger systems (Active Autowerke Rotrex, VF Engineering Vortech); complete turbo kits are effectively one shop (CES). Piecemeal turbo kits stay out of scope per the standing rule.
- **Tuning path is a staged software story** (Shark Injector / Dinan) rather than a Stage 1/2 tune-plus-downpipe story. Stage numbers mean different things; the guide should define them.
- **Chassis reinforcement is the one topic where "DIY" ends** — most of it is welding. Guide explains what the M3 already has, what to inspect, does the bolt-on RSM part, and tells the reader what to ask a fabricator for.
- **Three body styles** (coupe/sedan/convertible) fork exhaust rear sections, RSM access, headliner, window regulators and hood struts.
- **Oil change** exists nowhere in the app yet; the E36 is a good place to start it and back-fill the GTI.

## 4. Sources to aggregate per guide (found this pass)

Pelican Parts E36 tech articles (rear suspension overhaul, muffler, PSS9 install, Brembo BBK, headliner, sunroof, injectors, O2 sensors, headlights); FCP Euro (E36 M3 common issues, control arms & bushings, cooling); Turner Motorsport (Shark Injector stage descriptions, DSSR, cooling overhaul kits, CSL brake kit, BBK category); Beisan Systems (single VANOS seals, rattle, fan & shroud procedure); Garagistic (chassis reinforcement install guide, FCAB offset vs centered); bimmerdiy.com/dir/e36 (RTAB with and without tools, RSM retrofit, guibo/CSB, diff fluid, clutch, sunroof, window regulator, seat rail bushings); Red Eye Garage (guibo & CSB, window motor & regulator, blower); M3 Pink blog (front suspension overhaul I–III incl. Z3 rack); Active Autowerke and VF Engineering product pages; Bimmerfest "E36 Cooling System 101" (part numbers); Grassroots Motorsports cooling overhaul notes and E36 M3 buyer thread; mforum.net (chassis reinforcement, headers, modern brake kits); NAM3Forum (996 Brembo conversion); Bentley E36 manual for torque values (to be sourced per guide).

## 5. Suggested batching

1. **Batch 1 — Engine maintenance (the "just bought it" set):** oil change, air filter, plugs & coils, valve cover gasket, oil filter housing gasket, fuel filter, belts.
2. **Batch 2 — Cooling & VANOS:** cooling overhaul (chaptered), VANOS seals & rattle, intake boot/ICV.
3. **Batch 3 — Suspension:** coilovers/springs & dampers, camber plates, front & rear sway bars, end links, RSM & reinforcement.
4. **Batch 4 — Steering + Bushings & mounts:** control arms, tie rods, FCAB, RTAB & limiters, engine & trans mounts, chassis reinforcement (informational + bolt-on), Z3 rack swap.
5. **Batch 5 — Brakes:** pads, rotors, flush, stainless lines, parking brake shoes, big brake upgrade.
6. **Batch 6 — Drivetrain:** guibo & CSB, trans fluid, diff fluid, short shifter & rebuild, DSSR, clutch & flywheel.
7. **Batch 7 — Engine upgrades & Forced induction:** intake, tuning path (Stage 1–4), headers, section 1, cat-back, supercharger kit, turbo kit.
8. **Batch 8 — Electrical, Exterior, Interior:** battery, headlight bulbs & housings, window regulator, door panels, seat twist, hood struts, cluster pixels, headliner.

Star-marked ★ items can be deferred or folded into neighbours (e.g. DSSR into the shifter guide, underdrive pulleys into belts, clutch hydraulics into clutch).
