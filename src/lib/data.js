import { supabase } from "./supabase";

// Loads everything the app needs in one round trip and reshapes it into
// the structures the screens expect. Small enough to load up front for now;
// paginate guides once there are hundreds.
export async function loadAll() {
  const [brands, models, years, powertrains, tasks, guides] = await Promise.all([
    supabase.from("brands").select("*").order("sort"),
    supabase.from("models").select("*").order("sort"),
    supabase.from("model_years").select("*").order("year"),
    supabase.from("powertrains").select("*"),
    supabase.from("tasks").select("*"),
    supabase.from("guides").select("id, content"),
  ]);
  for (const r of [brands, models, years, powertrains, tasks, guides]) if (r.error) throw r.error;

  const groupBy = (rows, key) => rows.reduce((acc, r) => ((acc[r[key]] ||= []).push(r), acc), {});

  return {
    brands: brands.data,
    models: groupBy(models.data, "brand_id"),
    years: Object.fromEntries(Object.entries(groupBy(years.data, "model_id")).map(([k, v]) => [k, v.map(y => ({ year: y.year, gen: y.generation, live: y.live }))])),
    powertrains: groupBy(powertrains.data.map(p => ({ ...p, key: `${p.model_id}-${p.year}` })), "key"),
    categories: ["Engine", "Suspension", "Brakes", "Drivetrain", "Electrical", "Exterior", "Interior"],
    tasks: tasks.data.map(t => ({ id: t.id, title: t.title, cat: t.category, group: t.group_name, aliases: t.aliases || [], live: t.live, time: t.time_label, diff: Number(t.difficulty) })),
    guides: Object.fromEntries(guides.data.map(g => [g.id, g.content])),
  };
}
