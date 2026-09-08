import { supabase } from "./supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/** Public URL of an illustration stored in the `illustrations` bucket. */
export const illustrationUrl = id => `${SUPABASE_URL}/storage/v1/object/public/illustrations/${id}.svg`;

const check = r => { if (r.error) throw r.error; return r.data; };
const groupBy = (rows, key) => rows.reduce((acc, r) => ((acc[r[key]] ||= []).push(r), acc), {});

/** Vehicle tree: small, loaded once at startup. */
export async function loadCatalog() {
  const [brands, models, years, powertrains] = await Promise.all([
    supabase.from("brands").select("*").order("sort"),
    supabase.from("models").select("*").order("sort"),
    supabase.from("model_years").select("*").order("year"),
    supabase.from("powertrains").select("*"),
  ]).then(rs => rs.map(check));
  return {
    brands,
    models: groupBy(models, "brand_id"),
    years: Object.fromEntries(Object.entries(groupBy(years, "model_id")).map(([k, v]) => [k, v.map(y => ({ year: y.year, gen: y.generation, live: y.live }))])),
    powertrains: groupBy(powertrains.map(p => ({ ...p, key: `${p.model_id}-${p.year}` })), "key"),
    categories: ["Engine", "Suspension", "Brakes", "Drivetrain", "Electrical", "Exterior", "Interior"],
  };
}

/** Tasks for one powertrain. A BPY task shows for every car with a BPY row in `powertrains` (GTI, Jetta, A3…). */
export async function loadTasks(powertrainId) {
  const rows = check(await supabase.from("tasks").select("*").eq("powertrain_id", powertrainId).order("title"));
  return rows.map(t => ({ id: t.id, powertrainId: t.powertrain_id, title: t.title, cat: t.category, group: t.group_name, aliases: t.aliases || [], live: t.live, time: t.time_label, diff: Number(t.difficulty) }));
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
