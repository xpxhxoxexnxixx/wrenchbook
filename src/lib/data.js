import { supabase } from "./supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/** Public URL of an illustration stored in the `illustrations` bucket. */
export const illustrationUrl = id => `${SUPABASE_URL}/storage/v1/object/public/illustrations/${id}.svg`;

const check = r => { if (r.error) throw r.error; return r.data; };
const groupBy = (rows, key) => rows.reduce((acc, r) => ((acc[r[key]] ||= []).push(r), acc), {});

/** Vehicle tree: small, loaded once at startup. */
export async function loadCatalog() {
  const [brands, models, gens, powertrains] = await Promise.all([
    supabase.from("brands").select("*").order("sort"),
    supabase.from("models").select("*").order("sort"),
    supabase.from("generations").select("*").order("sort"),
    supabase.from("powertrains").select("*"),
  ]).then(rs => rs.map(check));
  return {
    brands,
    models: groupBy(models, "brand_id"),
    // generations per model: { gti: [{ id, name, from, to, live }] }
    gens: Object.fromEntries(Object.entries(groupBy(gens, "model_id")).map(([k, v]) => [k, v.map(g => ({ id: g.id, name: g.name, from: g.year_from, to: g.year_to, live: g.live }))])),
    // powertrains keyed by generation id
    powertrains: groupBy(powertrains.filter(p => p.generation_id), "generation_id"),
    categories: ["Engine", "Suspension", "Brakes", "Drivetrain", "Electrical", "Exterior", "Interior"],
  };
}

/** All tasks. Each task belongs to one powertrain and points at a guide (guide_id); several tasks can share one guide. */
export async function loadTasks() {
  const [rows, dates] = await Promise.all([
    supabase.from("tasks").select("*").order("title"),
    supabase.from("guides").select("id, created_at"),
  ]).then(rs => rs.map(check));
  const created = Object.fromEntries(dates.map(g => [g.id, g.created_at]));
  return rows.map(t => ({ id: t.id, guideId: t.guide_id || t.id, powertrainId: t.powertrain_id, title: t.title, cat: t.category, group: t.group_name, aliases: t.aliases || [], live: t.live, time: t.time_label, diff: Number(t.difficulty), createdAt: created[t.guide_id || t.id] || null }));
}

/** One guide, fetched when opened and cached for the session. */
const guideCache = new Map();
export async function loadGuide(id) {
  if (guideCache.has(id)) return guideCache.get(id);
  const row = check(await supabase.from("guides").select("id, content").eq("id", id).single());
  const g = { ...row.content, id: row.id };
  guideCache.set(id, g);
  return g;
}

/**
 * Save a guide request to the database, then (optionally) forward it by email through a form service.
 * Set VITE_REQUEST_FORM_ENDPOINT (e.g. a Formspree endpoint) to enable the email hop.
 */
export async function submitRequest(req) {
  const row = { ...req, user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null };
  check(await supabase.from("guide_requests").insert(row));
  const endpoint = import.meta.env.VITE_REQUEST_FORM_ENDPOINT;
  if (endpoint) {
    try {
      await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({
        _subject: `Guide request: ${req.year} ${req.make} ${req.model}`.trim(),
        name: req.name, email: req.email, year: req.year, make: req.make, model: req.model, request: req.description,
      }) });
    } catch (e) { /* the database has it; email is best-effort */ }
  }
}
