# Update 020 — intercooler guide, diverter valve options, search, UI

Run **after** update 019.

## Files
- `App.jsx` → replace `src/App.jsx`
- `supabase/020_intercooler_dv_headlights.sql` → into `supabase/`, run in the SQL editor
- `illustrations/*.svg` (7) → into `illustrations/` in the repo AND upload to the `illustrations` Storage bucket
- `docs/*.md` → source ledger

## What changed in App.jsx
- Guides can ask a sequence of questions; `only` rules accept combinations like "stock+pipes"
- Search parses a sentence: year / make / model narrow the car, filler words ignored; new placeholder text
- Selection banner text left-aligned, "change" pinned right
- (everything from 019 is included too)

## Order
1. Copy files. 2. Run the SQL. 3. Upload the 7 SVGs to Storage. 4. `gh auth switch --user xpxhxoxexnxixx`, `git add .`, `git commit -m "Intercooler and diverter valve guides, sentence search, headlights to Exterior"`, `git push`.
