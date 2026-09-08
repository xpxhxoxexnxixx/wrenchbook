# Wrenchbook

DIY car repair guides, cross-checked across every source we can find. Proof of concept: 2006 VW GTI 2.0T.

## First-time setup (about 10 minutes)

### 1. Database
In the Supabase dashboard for this project, open **SQL Editor → New query**, paste the whole contents of
`supabase/001_schema_and_seed.sql`, and click **Run**. This creates the tables, makes them publicly readable
(read-only), and loads the vehicle tree plus both guides. Re-running it is safe; it updates in place.

### 2. Local development
```bash
npm install
cp .env.example .env.local      # then paste your anon key into .env.local
npm run dev
```
Open the URL Vite prints. The app loads its content from Supabase, so the SQL step must be done first.

### 3. Push to GitHub
```bash
git init
git add .
git commit -m "Wrenchbook v0.1: two guides, Supabase-backed"
git branch -M main
git remote add origin git@github.com:xpxhxoxexnxixx/wrenchbook.git
git push -u origin main
```
(If you use HTTPS instead of SSH: `https://github.com/xpxhxoxexnxixx/wrenchbook.git`.)

### 4. Vercel
In the Vercel project → **Settings → Environment Variables**, add:
- `VITE_SUPABASE_URL` = `https://gtyvgbdftmfzdpgpdcla.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = your anon public key

Vercel auto-detects Vite. If a deploy ran before the variables existed, trigger a redeploy
(**Deployments → ⋯ → Redeploy**). From then on every `git push` deploys.

### 5. On your phone
Open the Vercel URL in Safari or Chrome → Share → **Add to Home Screen**. It installs as a standalone app.

## Adding a guide
Guides are JSON in the `guides` table (see `schema.md` in the design docs for the shape). New guides arrive as a
SQL file you run the same way as step 1. Illustrations live in `src/App.jsx` under `ART`, keyed by id.

## Layout
```
src/App.jsx           screens, guide renderer, illustrations
src/lib/supabase.js   client (reads env vars)
src/lib/data.js       loads and reshapes all content
supabase/*.sql        schema + seed, run in the SQL editor
public/               PWA manifest and icons
```
