# Data model (v0.1)

Everything the app renders comes from three tables. The content pipeline produces `Guide` records; the app never invents content.

## Vehicle hierarchy
```
Brand { id, name, logo, live: bool }
  Model { id, brandId, name, live }
    Generation { id, modelId, name ("Mk5"), years: [2006..2009] }
      Powertrain { id, generationId, name ("2.0T FSI"), engineCode ("BPY"), notes }
```
Guides attach to a Powertrain plus a `fitment` list of other powertrains they're known to cover (the cam follower guide fits MK5 GTI, Jetta 2.0T, B6 Passat, A3 8P, Mk6 Golf R). Year-specific forks live *inside* the guide as `fork` blocks, not as separate guides.

## Guide
```
Guide {
  id, slug, title, aliases[]          // aliases drive search ("HPFP follower", "06D109309C")
  powertrainId, fitment[]
  category: engine|suspension|brakes|drivetrain|electrical|exterior|interior
  summary
  glance: { timeFirst, timeRepeat, difficulty (1–5), partsCost, whyItMatters, riskLevel, note }
  hero: Illustration
  shouldYouDoThis: { yesIf[], symptoms[], codes[], notes[] }
  parts[]: { name, partNumber, supersededBy?, notes }
  tools[]: { name, required: bool, note?, onlyIf? }
  beforeYouStart[]: string
  steps[]: Step
  inspection: { illustration, rows[]: { see, means, doThis }, confidence }
  aftercare[]: string
  disagreements[]: { topic, positions[], ourCall }
  sources[]: Source
  embeds[]: { platform, id, note }
  confidence: Confidence      // overall
}
```

## Step
```
Step {
  n, title
  caution: bool               // triggers the hazard-stripe treatment; max ~1–2 per guide
  timeSink: bool              // "this is where first-timers lose an hour"
  blocks[]: Block
}
Block =
  | { type: "text", body }
  | { type: "note", body }                      // grey aside
  | { type: "warn", body }                      // inline hazard aside (lighter than a caution step)
  | { type: "torque", label, nm, altNm?[], confidence, note? }   // renders the spec plate
  | { type: "fork", question, variants[]: { label, when, blocks[] } }   // model-year / configuration branches
  | { type: "illustration", spec, alt }         // placeholder now; SVG later
  | { type: "embed", platform, id, note }
```

## Confidence
```
Confidence {
  level: "high" | "medium" | "community" | "single" | "varies"
  sources: number             // how many independent sources agree
  note: string                // one line, user-facing
}
```
Rendered as three signal dots: high ●●●, medium/community ●●○, single/varies ●○○ plus the note. Every torque block carries its own confidence; the guide carries an overall one.

## Source
```
Source { id, kind: vendor|forum|video|blog|factory, title, url, date, vehicle, reliability: string }
```
Sources are shown to users as a list; the full conflict-resolution ledger stays internal.

## Rules the pipeline must follow
1. A numeric spec with one source is `single`. Two agreeing = `medium`. Three+ = `high`. Disagreeing values = `varies`, and the block carries all values.
2. Nothing from a factory manual is reproduced verbatim; values only, in our words.
3. No third-party photos. Illustrations are ours; video via embed only.
4. `caution: true` is reserved for steps where a mistake damages the car or the person. Not for "be careful, it's fiddly."
