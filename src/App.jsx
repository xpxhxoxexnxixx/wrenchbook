import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { loadCatalog, loadTasks, loadGuide, illustrationUrl, submitRequest } from "./lib/data";
import { Search, ChevronRight, ChevronLeft, Clock, Wrench, Gauge, ShieldAlert, Play, Quote, ExternalLink, ShoppingCart, ChevronDown, Star, Repeat, Zap, X, Maximize2, Check, ThumbsUp, Hourglass, FileClock, MessageSquarePlus, Send, PlusCircle, Lightbulb, CalendarCheck } from "lucide-react";

/* ------------------------------------------------------------------ */
/* DATA — this is the shape the content pipeline produces (see schema) */
/* ------------------------------------------------------------------ */

// Confidence note reused by the cam-follower guide's interval section
const C = { interval: { level: "community", n: 4, note: "No factory interval exists. Derived from forum practice." } };

/* ------------------------------------------------------------------ */
/* DESIGN TOKENS                                                       */
/* ------------------------------------------------------------------ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.wb { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color:#1B1F24; background:#FDFDFC; -webkit-font-smoothing:antialiased; }
.wb * { box-sizing:border-box; }
.wb .wide { letter-spacing: -0.02em; }
.wb .narrow { letter-spacing: 0; }
.teal { color:#0E494D; }
.wb h1, .wb h2, .wb h3 { color:#0F2230; }
.metric { color:#0A3655; }
.active-fill { background:#0B4664 !important; color:#fff !important; }
.wb:not(.dark) .card { background-color:#F9F9F5; }
.sheet-in { animation: sheetin .32s cubic-bezier(.2,.8,.2,1) both; }
.sheet-out { animation: sheetout .28s cubic-bezier(.4,0,1,1) both; }
@keyframes sheetin { from { opacity:0; transform: translateY(28px) } to { opacity:1; transform: translateY(0) } }
@keyframes sheetout { from { opacity:1; transform: translateY(0) } to { opacity:0; transform: translateY(40px) } }
@media (prefers-reduced-motion: reduce) { .sheet-in, .sheet-out { animation-duration: .01s } }
/* Splash */
.splash { position:fixed; inset:0; z-index:60; background:#030B14; display:flex; align-items:center; justify-content:center; overflow:hidden; animation: splashout .5s ease-in 2.3s forwards; }
.splash svg { width:min(96vw, 900px); overflow:visible; }
.sp-word { fill:#F4F5F7; fill-opacity:0; stroke:#F4F5F7; stroke-width:1.6; stroke-dasharray:3000; stroke-dashoffset:3000;
  animation: spdraw 1.3s cubic-bezier(.5,0,.3,1) .15s forwards, spfill .6s ease .8s forwards; }
.sp-ghost { fill:none; stroke:#0B4664; stroke-width:2; opacity:0; animation: spfade .7s ease .05s forwards; }
.sp-con { opacity:0; animation: spfade .5s ease forwards; }
.sp-c1 { animation-delay:.5s } .sp-c2 { animation-delay:.7s } .sp-c3 { animation-delay:.9s } .sp-c4 { animation-delay:1.1s } .sp-c5 { animation-delay:1.3s }
@keyframes spdraw { to { stroke-dashoffset:0 } }
@keyframes spfill { to { fill-opacity:1 } }
@keyframes spfade { to { opacity:1 } }
@keyframes splashout { to { opacity:0; transform:scale(1.04) translateY(-10px); visibility:hidden } }
@media (prefers-reduced-motion: reduce) {
  .splash { animation: splashout .3s ease-in .6s forwards }
  .sp-word { animation:none; stroke-dashoffset:0; fill-opacity:1 } .sp-ghost, .sp-con { animation:none; opacity:1 }
}
.wb.dark { background: linear-gradient(180deg, #0C2438 0%, #071A2C 45%, #030B14 100%); color:#F3F3EF; }
.wb.dark h1, .wb.dark h2, .wb.dark h3, .wb.dark .text-white { color:#F3F3EF !important; }
.wb.dark .bg-white { background-color:#F3F3EF !important; }
.wb.dark .bg-white, .wb.dark .bg-white * { color:#1B1F24; }
.wb.dark .bg-white .text-gray-500 { color:#6B7280; } .wb.dark .bg-white .text-gray-600 { color:#4B5563; } .wb.dark .bg-white .text-gray-400 { color:#9CA3AF; }
.wb.dark .bg-white .teal { color:#0E494D; }
.wb.dark .muted { color:#B5B9C0; }

.lat, .lat-sweep { position:absolute; inset:0; pointer-events:none; background-repeat:repeat; background-size:32px 55.43px; }
.lat { background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2255.43%22%20viewBox%3D%220%200%2032%2055.43%22%3E%3Cpath%20d%3D%22M0%200H32M0%2027.71H32M0%200L32%2055.43M32%200L0%2055.43%22%20fill%3D%22none%22%20stroke%3D%22%2317565A%22%20stroke-width%3D%220.7%22%2F%3E%3C%2Fsvg%3E"); opacity:.4; }
.lat-sweep { background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2255.43%22%20viewBox%3D%220%200%2032%2055.43%22%3E%3Cpath%20d%3D%22M0%200H32M0%2027.71H32M0%200L32%2055.43M32%200L0%2055.43%22%20fill%3D%22none%22%20stroke%3D%22%230B4664%22%20stroke-width%3D%220.7%22%2F%3E%3C%2Fsvg%3E"); opacity:.8;
  -webkit-mask-image: linear-gradient(135deg, transparent 0%, transparent 35%, #000 50%, transparent 65%, transparent 100%);
  mask-image: linear-gradient(135deg, transparent 0%, transparent 35%, #000 50%, transparent 65%, transparent 100%);
  -webkit-mask-size: 300% 300%; mask-size: 300% 300%;
  animation: latsweep 7s ease-in-out infinite alternate; }
@keyframes latsweep { from { -webkit-mask-position: 0% 0%; mask-position: 0% 0%; } to { -webkit-mask-position: 100% 100%; mask-position: 100% 100%; } }
@media (prefers-reduced-motion: reduce) { .lat-sweep { animation:none; opacity:0 } }
.hazard { background: repeating-linear-gradient(135deg, #F2B600 0 8px, #AE8700 8px 16px); }
.plate { background:#20313C; color:#F4F5F7; }
.plate .rivet { width:6px; height:6px; border-radius:50%; background:#8A8F98; box-shadow: inset 0 1px 1px rgba(0,0,0,.6); position:absolute; }
.wb button:focus-visible, .wb input:focus-visible, .wb a:focus-visible { outline: 3px solid #1F4FD6; outline-offset: 2px; }
.flip { transition: transform .35s; transform-style: preserve-3d; }
@media (prefers-reduced-motion: reduce) { .flip { transition:none; } }
`;

/* ------------------------------------------------------------------ */
/* SMALL PARTS                                                         */
/* ------------------------------------------------------------------ */

/* Variant visibility: any item may carry `only: ["optionId", ...]`. Items without `only` show for everyone. */
const vis = (item, choice) => !item || !item.only || !choice || item.only.includes(choice);
const txt = item => (typeof item === "string" ? item : item.text);

const VariantModal = ({ v, onPick }) => (
  <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="variant-q">
    <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />
    <div className="relative m-3 w-full max-w-[480px] rounded-md p-5 shadow-2xl" style={{ background: "#FDFDFC" }}>
      <div className="text-xs text-gray-500">Before you start</div>
      <h2 id="variant-q" className="wide font-black text-2xl leading-tight mt-1">{v.question}</h2>
      {v.hint ? <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">{v.hint}</p> : null}
      <div className="mt-4 grid gap-2">
        {v.options.map(o => (
          <button key={o.id} onClick={() => onPick(o.id)} className="rounded-sm border-2 border-gray-200 px-4 py-3 text-left hover:border-[#0B4664] focus-visible:border-[#0B4664]" style={{ background: "#F9F9F5" }}>
            <div className="font-bold text-[17px]">{o.label}</div>
            {o.when ? <div className="text-sm text-gray-600 mt-0.5">{o.when}</div> : null}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500">You can change this any time from the top of the guide.</p>
    </div>
  </div>
);

const TIER = { oe: "OE · VW box", oem: "OEM · same part, maker's box", aftermarket: "Aftermarket" };


/* "When to expect it": typical mileage/age range, earliest reported, what shortens it. Variant-aware via `only`. */
const Lifespan = ({ l, choice }) => {
  if (!l) return null;
  const pick = arr => (Array.isArray(arr) ? arr.filter(x => vis(x, choice)).map(txt) : [arr]).filter(Boolean);
  const heads = pick(l.headline), inspects = pick(l.inspect || []);
  const C = "#936700";
  return (
    <section className="mt-4 rounded-sm bg-yellow-300/40 p-4" style={{ color: C }} aria-labelledby="lifespan-title">
      <div className="flex items-center gap-3">
        <Hourglass size={30} strokeWidth={1.75} className="shrink-0" aria-hidden />
        <div id="lifespan-title" className="text-xs font-bold uppercase tracking-wide opacity-80">{l.title || "When to expect it"}</div>
      </div>
      <div className="mt-3">
        {heads.map((h, i) => <div key={i} className="wide font-black text-xl leading-tight" style={{ color: "#1B1300" }}>{h}</div>)}
        {l.earliest ? <div className="mt-1 text-sm font-semibold" style={{ color: "#1B1300" }}>{l.earliest}</div> : null}
        {l.detail ? <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "#1B1300" }}>{l.detail}</p> : null}
      </div>
      {l.factors && l.factors.length ? (
        <div className="mt-3">
          <div className="text-xs font-bold opacity-80">Gets there sooner with</div>
          <div className="mt-1 flex flex-wrap gap-1.5">{l.factors.map((f, i) => <span key={i} className="rounded-sm px-2 py-0.5 text-xs font-semibold" style={{ background: "rgba(147,103,0,0.14)", color: "#1B1300" }}>{f}</span>)}</div>
        </div>
      ) : null}
      {inspects.length ? <div className="mt-3 flex items-center gap-2 text-[15px] font-bold" style={{ color: "#1B1300" }}><Clock size={16} aria-hidden />{inspects.join(" · ")}</div> : null}
      {l.confidence ? <div className="mt-3 border-t pt-3" style={{ borderColor: "rgba(147,103,0,0.25)" }}><Dots c={l.confidence} tone={C} /></div> : null}
    </section>
  );
};

const Dots = ({ c, dark, tone, text }) => {
  const filled = c.level === "high" ? 3 : (c.level === "medium" || c.level === "community") ? 2 : 1;
  const label = { high: "High confidence", medium: "Medium confidence", community: "Community method", single: "Single source", varies: "Sources vary" }[c.level];
  return (
    <div className={`flex items-start gap-2 text-sm ${tone || text ? "" : dark ? "text-gray-300" : "text-gray-700"}`} style={tone ? { color: tone } : text ? { color: text } : undefined}>
      <div className="flex gap-0.5 mt-0.5 shrink-0" aria-label={label}>
        {[0,1,2].map(i => <ThumbsUp key={i} size={15} strokeWidth={2} fill={i < filled ? (tone || "#3481A2") : "none"} style={{ color: i < filled ? (tone || "#3481A2") : (tone ? "rgba(147,103,0,0.35)" : dark ? "#6B7078" : "#B5B9C0") }} aria-hidden />)}
      </div>
      <div><span className="font-semibold">{label}</span>{c.n ? <span className={tone || text ? "opacity-70" : "text-gray-500"}> · {c.n} source{c.n>1?"s":""}</span> : null}<span className={`block leading-snug ${tone || text ? "opacity-90" : "text-gray-600"}`}>{c.note}</span></div>
    </div>
  );
};

const Torque = ({ b }) => {
  const [unit, setUnit] = useState("nm");
  const lb = v => (v * 0.7376).toFixed(1);
  const vals = [b.nm, ...(b.alt || [])];
  const show = v => unit === "nm" ? `${v}` : lb(v);
  const range = vals.length > 1 ? `${show(Math.min(...vals))}–${show(Math.max(...vals))}` : show(b.nm);
  return (
    <div className="plate relative rounded-sm my-4 p-4 pl-5">
      <span className="rivet" style={{top:8,left:8}} /><span className="rivet" style={{top:8,right:8}} /><span className="rivet" style={{bottom:8,left:8}} /><span className="rivet" style={{bottom:8,right:8}} />
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs narrow" style={{ color: "#F1FAFF" }}>Torque · {b.label}</div>
          <button onClick={() => setUnit(u => u === "nm" ? "lb" : "nm")} className="text-left mt-1 flex items-baseline gap-2" aria-label="Toggle units">
            <span className="wide font-black text-5xl leading-none tabular-nums" style={{ letterSpacing: "-0.02em" }}>{range}</span>
            <span className="text-lg font-semibold" style={{ color: "#F1FAFF" }}>{unit === "nm" ? "Nm" : "lb-ft"}{b.note ? <span className="ml-2 text-yellow-300">{b.note}</span> : null}</span>
          </button>
          <div className="text-xs mt-1" style={{ color: "#F1FAFF" }}>
            {unit === "nm"
              ? `${vals.length > 1 ? lb(Math.min(...vals)) + "–" + lb(Math.max(...vals)) : lb(b.nm)} lb-ft`
              : `${vals.length > 1 ? Math.min(...vals) + "–" + Math.max(...vals) : b.nm} Nm`} · tap to switch
          </div>
        </div>
        <Wrench className="shrink-0 text-gray-500" size={40} strokeWidth={1.5} />
      </div>
      {b.alt ? (
        <div className="mt-3 rounded-sm bg-black/25 px-3 py-2 text-sm" style={{ color: "#F1FAFF" }}>
          <span className="font-semibold">Two values in the wild:</span> {vals.map(v => `${v} Nm`).join(" and ")}. No factory number found.
        </div>
      ) : null}
      <div className="mt-3 border-t border-white/15 pt-3"><Dots c={b.c} dark text="#F1FAFF" /></div>
    </div>
  );
};

/* Illustrations are SVG files in Supabase Storage (bucket: illustrations). Adding one = uploading a file, no redeploy. */
const Lightbox = ({ src, cap, onClose }) => {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#2A2E34" }} role="dialog" aria-modal="true" aria-label={cap || "Illustration"} onClick={onClose}>
      <div className="flex flex-1 items-center justify-center p-3 min-h-0">
        <img src={src} alt={cap || ""} className="max-h-full max-w-full rounded-sm shadow-2xl" style={{ objectFit: "contain" }} onClick={e => e.stopPropagation()} />
      </div>
      <div className="shrink-0 px-6 pb-8 pt-2 text-center" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
        {cap ? <p className="mx-auto mb-4 max-w-[560px] text-sm leading-relaxed" style={{ color: "#B5B9C0" }}>{cap}</p> : null}
        <button onClick={onClose} aria-label="Close" className="mx-auto flex h-14 w-14 items-center justify-center rounded-full shadow-lg" style={{ background: "#5A5F68", color: "#FDFDFC" }}>
          <X size={26} />
        </button>
        <p className="mt-2 text-xs" style={{ color: "#8A8F98" }}>Rotate your phone for a bigger view</p>
      </div>
    </div>
  );
};

const Art = ({ id, cap }) => {
  const [open, setOpen] = useState(false);
  const src = illustrationUrl(id);
  return (
    <figure className="my-4 overflow-hidden rounded-sm shadow-sm bg-[#F9F9F5]">
      <button onClick={() => setOpen(true)} className="relative block w-full text-left" aria-label={`Open illustration full screen${cap ? ": " + cap : ""}`}>
        <img src={src} alt={cap || ""} className="block w-full" loading="lazy" />
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-sm bg-white/80 text-gray-700"><Maximize2 size={14} /></span>
      </button>
      {cap ? <figcaption className="card bg-white px-3 py-2 text-sm text-gray-600">{cap}</figcaption> : null}
      {open ? <Lightbox src={src} cap={cap} onClose={() => setOpen(false)} /> : null}
    </figure>
  );
};

const Video = ({ id, note, title }) => {
  const [on, setOn] = useState(false);
  return (
    <div className="card my-4 overflow-hidden rounded-sm bg-white shadow-sm">
      {on ? (
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title || "Video"} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
      ) : (
        <button onClick={() => setOn(true)} className="flex w-full items-center gap-3 p-3 text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm active-fill"><Play size={22} fill="currentColor" /></span>
          <span className="text-sm"><span className="block font-semibold">{title || "Watch it done"}</span><span className="text-gray-600">{note}</span></span>
        </button>
      )}
    </div>
  );
};

const Fork = ({ b, choice }) => {
  const [i, setI] = useState(0);
  return (
    <div className="my-4">
      <div className="font-semibold mb-2">{b.q}</div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {b.v.map((v, k) => (
          <button key={k} onClick={() => setI(k)} className={`rounded-sm px-3 py-2 text-left border border-gray-200 ${i===k ? "active-fill border-transparent" : "bg-white text-gray-800"}`}>
            <div className="font-semibold text-sm">{v.label}</div><div className={`text-xs ${i===k?"text-white/75":"text-gray-500"}`}>{v.when}</div>
          </button>
        ))}
      </div>
      {b.v[i].blocks.filter(x => vis(x, choice)).map((bb, k) => <Block key={k} b={bb} choice={choice} />)}
    </div>
  );
};

const Block = ({ b, choice }) => {
  if (!vis(b, choice)) return null;
  switch (b.t) {
    case "text": return <p className="my-3 leading-relaxed text-[17px]">{b.b}</p>;
    case "note": return <p className="my-3 rounded-sm bg-white/70 px-3 py-2 text-[15px] text-gray-700 leading-relaxed">{b.b}</p>;
    case "warn": return <div className="my-3 flex gap-3 rounded-sm bg-yellow-300/40 px-3 py-2 text-[15px] leading-relaxed"><ShieldAlert size={20} className="shrink-0 mt-1" />{b.b}</div>;
    case "torque": return <Torque b={b} />;
    case "ill": return <Art id={b.id} cap={b.cap} />;
    case "embed": return <Video id={b.id} note={b.note} title={b.title} />;
    case "fork": return <Fork b={b} choice={choice} />;
    case "conf": return <div className="my-3"><Dots c={b.c} /></div>;
    default: return null;
  }
};

const Step = ({ s, choice }) => (
  <section id={`step-${s.n}`} className={`relative my-7 ${s.caution ? "card rounded-sm bg-white shadow-md" : ""}`}>
    {s.caution ? <div className="hazard absolute left-0 top-0 bottom-0 w-1.5 rounded-l-sm" aria-hidden /> : null}
    <div className={s.caution ? "py-4 pl-4 pr-3" : ""}>
      {s.caution ? <div className="inline-block mb-2 rounded-sm bg-yellow-300 px-2 py-0.5 text-xs font-bold">Take your time here</div> : null}
      {s.timeSink ? <div className="inline-block mb-2 rounded-sm bg-gray-800 px-2 py-0.5 text-xs font-bold text-white">Where the hour goes</div> : null}
      <div className="flex items-center gap-3">
        <span className="wide font-black text-4xl leading-none tabular-nums shrink-0" style={{ color: "#B7B7B4" }}>{s.n}</span>
        <h3 className="font-bold text-xl leading-tight" style={{ color: "#0B4664" }}>{s.title}</h3>
      </div>
      <div className="mt-1">{s.blocks.map((b, k) => <Block key={k} b={b} choice={choice} />)}</div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* SCREENS                                                             */
/* ------------------------------------------------------------------ */

/* Landing-page backdrop: an original technical drawing (piston, con-rod, crank throw) that plots itself in. */
/* Landing-page backdrop: triangular lattice in dark teal with a lighter band that sweeps top-left to bottom-right and back. */
const Lattice = () => (<><div className="lat" aria-hidden /><div className="lat-sweep" aria-hidden /></>);


/* Loading screen: "Top Dead Center" plotted in like a blueprint, with construction lines, then fades to the landing page. */
const Splash = ({ onDone }) => {
  useEffect(() => {
    const quick = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    const t = setTimeout(() => { document.body.style.overflow = prev; window.scrollTo(0, 0); onDone(); }, quick ? 950 : 2850);
    return () => { clearTimeout(t); document.body.style.overflow = prev; };
  }, [onDone]);
  const X0 = 60, W = 680, N = 15, step = W / N, base = 200, cap = 138;
  const B = "#3481A2", B2 = "#4F9AA1";
  return (
    <div className="splash" role="status" aria-label="Loading Top Dead Center">
      <svg viewBox="0 0 800 330" fontFamily="Plus Jakarta Sans, system-ui, sans-serif">
        <text className="sp-ghost" x="400" y="300" textAnchor="middle" fontSize="215" fontWeight="800" textLength="1750" lengthAdjust="spacing">Top Dead Center</text>
        {/* extension lines at letter boundaries */}
        <g className="sp-con sp-c1" stroke={B} strokeWidth=".8" strokeDasharray="5 5" opacity="0">
          {Array.from({ length: N + 1 }, (_, i) => <line key={i} x1={X0 + i * step} y1={cap - 60} x2={X0 + i * step} y2={base + 60} />)}
        </g>
        {/* dimension chain under the word */}
        <g className="sp-con sp-c2" stroke={B} strokeWidth=".9" fill={B} opacity="0">
          <line x1={X0} y1={base + 42} x2={X0 + W} y2={base + 42} />
          <line x1={X0} y1={base + 34} x2={X0} y2={base + 50} /><line x1={X0 + W} y1={base + 34} x2={X0 + W} y2={base + 50} />
          <path d={`M${X0} ${base + 42} l9 -3 v6 z M${X0 + W} ${base + 42} l-9 -3 v6 z`} stroke="none" />
          <text x={X0 + W / 2} y={base + 62} textAnchor="middle" fontSize="11" stroke="none">680.00</text>
          {Array.from({ length: N }, (_, i) => <text key={i} x={X0 + i * step + step / 2} y={base + 30} textAnchor="middle" fontSize="8" stroke="none" opacity=".8">{step.toFixed(0)}</text>)}
        </g>
        {/* height dimension */}
        <g className="sp-con sp-c3" stroke={B} strokeWidth=".9" fill={B} opacity="0">
          <line x1={X0 - 28} y1={cap} x2={X0 - 28} y2={base} />
          <line x1={X0 - 36} y1={cap} x2={X0 - 8} y2={cap} /><line x1={X0 - 36} y1={base} x2={X0 - 8} y2={base} />
          <path d={`M${X0 - 28} ${cap} l-3 9 h6 z M${X0 - 28} ${base} l-3 -9 h6 z`} stroke="none" />
          <text x={X0 - 34} y={(cap + base) / 2} textAnchor="middle" fontSize="11" stroke="none" transform={`rotate(-90 ${X0 - 34} ${(cap + base) / 2})`}>62.00</text>
          <line x1={X0 - 8} y1={cap + 22} x2={X0 + W + 20} y2={cap + 22} strokeDasharray="12 4 3 4" strokeWidth=".6" opacity=".7" />
        </g>
        {/* circles on the o's, angle arcs */}
        <g className="sp-con sp-c4" stroke={B2} strokeWidth=".9" fill="none" opacity="0">
          {[1.5, 11.5].map((k, i) => { const cx = X0 + k * step, cy = base - 24; return (
            <g key={i}><circle cx={cx} cy={cy} r="28" /><circle cx={cx} cy={cy} r="19" strokeDasharray="3 4" />
              <line x1={cx - 38} y1={cy} x2={cx + 38} y2={cy} strokeWidth=".6" /><line x1={cx} y1={cy - 38} x2={cx} y2={cy + 38} strokeWidth=".6" />
              <circle cx={cx} cy={cy} r="1.8" fill={B2} stroke="none" /></g>); })}
          <path d={`M${X0 + 8} ${base} A 40 40 0 0 1 ${X0 + 46} ${base - 14}`} strokeDasharray="3 3" />
          <text x={X0 + 54} y={base - 18} fontSize="9" fill={B2} stroke="none">72°</text>
          <path d={`M${X0 + 9.4 * step} ${base} A 34 34 0 0 0 ${X0 + 9.4 * step - 30} ${base - 16}`} strokeDasharray="3 3" />
          <text x={X0 + 9.4 * step - 58} y={base - 22} fontSize="9" fill={B2} stroke="none">64°</text>
        </g>
        {/* title block */}
        <g className="sp-con sp-c5" fill={B} opacity="0" fontSize="9">
          <text x={X0} y="318">TOP DEAD CENTER · SHEET 1 OF 1</text>
          <text x={X0 + W} y="318" textAnchor="end">DRAWN FROM EVERY SOURCE WE COULD FIND</text>
        </g>
        <text className="sp-word" x="400" y={base} textAnchor="middle" fontSize="80" fontWeight="800" textLength={W} lengthAdjust="spacing">Top Dead Center</text>
      </svg>
    </div>
  );
};

const Frame = ({ children, onHome, crumbs, onBack, onClose, dark, anim }) => (
  <div className={`wb relative min-h-screen ${dark ? "dark" : ""}`}>
    <style>{CSS}</style>
    {dark ? <Lattice /> : null}
    <div className={`relative mx-auto max-w-[520px] min-h-screen ${dark ? "" : "bg-[#FDFDFC]"} ${anim || ""}`}>
      <header className={`sticky top-0 z-20 flex items-center gap-2 px-4 py-3 ${dark ? "" : "bg-[#FDFDFC]/95 backdrop-blur"}`} style={dark ? { background: "#051824", color: "#E6F8F8" } : undefined}>
        {onBack ? <button onClick={onBack} className="rounded-sm p-1 -ml-1" aria-label="Back"><ChevronLeft /></button> : null}
        <button onClick={onHome} className="wide font-black text-lg tracking-tight">Top Dead Center</button>
        {crumbs ? <div className="ml-auto truncate text-xs text-gray-500">{crumbs}</div> : null}
        {onClose ? <button onClick={onClose} aria-label="Close" className="ml-auto -mr-1 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-gray-700 shadow-sm"><X size={20} /></button> : null}
      </header>
      <main className="relative px-4 pb-24">{children}</main>
    </div>
  </div>
);

const TaskCard = ({ t, onOpen, vehicle, compact, tag }) => (
  <button onClick={() => t.live && onOpen(t)} disabled={!t.live} className={`card w-full rounded-sm bg-white p-4 text-left shadow-sm ${t.live ? "" : "opacity-60"}`}>
    <div className="flex items-start justify-between gap-3">
      <div>
        {vehicle ? <div className="mb-1 inline-block rounded-sm px-2 py-0.5 text-xs font-semibold teal" style={{ background: "rgba(14,73,77,0.08)" }}>{vehicle}</div> : null}
        <div className="text-xs text-gray-500">{t.cat}{tag ? <span className="ml-2 rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: "#E5FE52", color: "#343D01" }}>{tag}</span> : null}</div>
        <div className="font-bold text-lg leading-tight">{t.title}</div>
      </div>
      {t.live ? <ChevronRight className="shrink-0 text-blue-700" /> : <span className="shrink-0 rounded-sm bg-gray-200 px-2 py-0.5 text-xs">Coming soon</span>}
    </div>
    {compact ? null : (
      <div className="mt-2 flex gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1"><Clock size={14} />{t.time}</span>
        <span className="flex items-center gap-1"><Gauge size={14} />{t.diff}/5</span>
      </div>
    )}
  </button>
);

/** Human label for the car(s) a task fits, derived from the catalog: "2006 Volkswagen GTI · 2.0T FSI". */
const vehicleLabel = (db, powertrainId, engineOverride) => {
  const rows = Object.entries(db.powertrains).flatMap(([genId, list]) => list.filter(p => p.id === powertrainId).map(p => ({ ...p, genId })));
  if (!rows.length) return null;
  const allGens = Object.entries(db.gens).flatMap(([mid, gs]) => gs.map(g => ({ ...g, model_id: mid })));
  const modelName = mid => Object.values(db.models).flat().find(m => m.id === mid)?.name || mid;
  const brandOf = mid => db.brands.find(b => (db.models[b.id] || []).some(m => m.id === mid));
  const cars = [...new Set(rows.map(r => {
    const g = allGens.find(x => x.id === r.genId);
    if (!g) return null;
    return [`${g.from}–${g.to || "present"}`, brandOf(g.model_id)?.name, modelName(g.model_id)].filter(Boolean).join(" ");
  }).filter(Boolean))];
  if (!cars.length) return rows[0].name || null;
  const engine = engineOverride ? engineOverride.replace(/ only$/, "") : allEngines(db, powertrainId);
  return `${cars[0]}${cars.length > 1 ? ` +${cars.length - 1} more` : ""} · ${engine}`;
};

/** Engine name(s) a guide applies to within its generation, e.g. "FSI" · "TSI" · null when it covers every engine listed. */
const engineTag = (db, task) => {
  const siblings = db.tasks.filter(t => (t.guideId || t.id) === (task.guideId || task.id));
  const allPts = Object.values(db.powertrains).flat();
  const gen = allPts.find(p => p.id === task.powertrainId)?.generation_id;
  const genPts = allPts.filter(p => p.generation_id === gen);
  const covered = new Set(siblings.map(t => t.powertrainId));
  if (genPts.length <= 1 || genPts.every(p => covered.has(p.id))) return null;
  return genPts.filter(p => covered.has(p.id)).map(shortEngine).join(" / ") + " only";
};
/** "2.0T FSI" → "FSI", "3.2 VR6 (R32)" → "R32" */
const shortEngine = p => { const m = p.name.match(/\(([^)]+)\)/); return m ? m[1] : p.name.replace(/^[\d.]+T?\s*/, ""); };
const allEngines = (db, powertrainId) => {
  const allPts = Object.values(db.powertrains).flat();
  const gen = allPts.find(p => p.id === powertrainId)?.generation_id;
  const names = allPts.filter(p => p.generation_id === gen).map(shortEngine);
  return names.length > 1 ? names.slice(0, -1).join(", ") + " & " + names[names.length - 1] : names[0] || "";
};
const dedupeByGuide = tasks => { const seen = new Set(); return tasks.filter(t => { const g = t.guideId || t.id; if (seen.has(g)) return false; seen.add(g); return true; }); };

function HomeScreen({ go, db }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return null;
    return dedupeByGuide(db.tasks.filter(t => t.title.toLowerCase().includes(s) || t.aliases.some(a => a.includes(s)) || (t.group && t.group.includes(s))));
  }, [q]);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const RECENT_DAYS = 14, RECENT_MAX = 5;
  const cutoff = Date.now() - RECENT_DAYS * 86400000;
  const recent = dedupeByGuide(db.tasks.filter(t => t.live && t.createdAt && new Date(t.createdAt).getTime() >= cutoff))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const groups = results ? [...new Set(results.map(r => r.group).filter(Boolean))] : [];
  const isDisambig = results && groups.length === 1 && results.every(r => r.group === groups[0]) && results.length > 1;

  return (
    <>
      <div className="pt-6 pb-4">
        <p className="text-[17px] leading-snug" style={{ color: "#75D3D8" }}>Step-by-step guides built from every source we could find, checked against each other.</p>
        <h1 className="wide font-black text-[34px] leading-[1.02] tracking-tight mt-3">What are you fixing today?</h1>
      </div>
      <label className="flex items-center gap-2 rounded-sm bg-white px-3 py-3 shadow-sm">
        <Search size={20} className="text-gray-500" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Try “sway bar”, “air filter” or “end links”" className="w-full bg-transparent text-[17px] outline-none" />
      </label>
      <div className="mt-1 text-xs muted">Searching every guide. Browse by make to narrow to your car.</div>

      {results ? (
        <div className="mt-5 space-y-3">
          {isDisambig ? <div className="muted">Which <span className="font-semibold text-white">{groups[0]}</span> do you mean?</div>
            : <div className="muted">{results.length ? `${results.length} guide${results.length>1?"s":""}` : "Nothing yet for that. Try the part's common name or number."}</div>}
          {results.map(t => <TaskCard key={t.id} t={t} tag={engineTag(db, t)} onOpen={() => go({ screen: "guide", gid: t.guideId || t.id })} />)}
        </div>
      ) : (
        <>
          <h2 className="mt-8 mb-3 font-bold text-lg">Browse by make</h2>
          <div className="grid grid-cols-2 gap-2">
            {db.brands.map(b => (
              <button key={b.id} disabled={!b.live} onClick={() => go({ screen: "browse", brand: b })} className="flex items-center justify-between rounded-sm bg-white px-4 py-4 text-left shadow-sm">
                <span className={`font-bold text-[17px] ${b.live ? "" : "text-gray-400"}`}>{b.name}</span>{b.live ? <ChevronRight size={18} className="text-blue-700" /> : <span className="text-xs text-gray-400">Soon</span>}
              </button>
            ))}
          </div>
          <h2 className="mt-8 mb-3 flex items-center gap-2 font-bold text-lg"><FileClock size={20} style={{ color: "#4F9AA1" }} aria-hidden />Recently added</h2><div className="space-y-2">
          {recent.length === 0 ? (
            <div className="card rounded-sm bg-white px-5 py-8 text-center shadow-sm">
              <svg viewBox="0 0 120 90" className="mx-auto h-20 w-28" aria-hidden>
                <rect x="18" y="16" width="84" height="64" rx="8" fill="#E6E8EB" stroke="#0E494D" strokeWidth="2" />
                <rect x="18" y="16" width="84" height="16" rx="8" fill="#0E494D" />
                <rect x="34" y="8" width="8" height="16" rx="3" fill="#0E494D" /><rect x="78" y="8" width="8" height="16" rx="3" fill="#0E494D" />
                {[42,56,70].map((x, i) => [46, 62].map((y, j) => <rect key={`${i}${j}`} x={x - 5} y={y - 5} width="10" height="10" rx="2" fill={i + j === 3 ? "#E5FE52" : "#B5B9C0"} />))}
                <circle cx="96" cy="70" r="14" fill="#4F9AA1" /><path d="M89 70 l5 5 l9 -10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-3 font-bold text-[17px]">No new guides in the last two weeks</div>
              <div className="mt-1 text-sm text-gray-600">Everything we have is in the catalog above. Want something specific? Request it below.</div>
            </div>
          ) : null}
          {(showAllRecent ? recent : recent.slice(0, RECENT_MAX)).map(t => <TaskCard key={t.id} t={t} vehicle={vehicleLabel(db, t.powertrainId, engineTag(db, t))} compact onOpen={() => go({ screen: "guide", gid: t.guideId || t.id })} />)}
          {recent.length > RECENT_MAX && !showAllRecent ? (
            <button onClick={() => setShowAllRecent(true)} className="flex w-full items-center justify-center gap-1 rounded-sm bg-white px-4 py-3 text-sm font-semibold teal shadow-sm">View all {recent.length}<ChevronDown size={16} /></button>
          ) : null}</div>
          <section className="mt-12 mb-4 rounded-sm px-4 py-5 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="font-bold text-[17px]">Don't see what you need?</div>
            <div className="mt-1 text-sm muted">Peer contribution is how we thrive.</div>
            <button onClick={() => go({ screen: "request" })} className="mt-4 inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold" style={{ background: "#4F9AA1", color: "#071A2C" }}>
              <MessageSquarePlus size={18} />Request a guide
            </button>
          </section>
        </>
      )}
    </>
  );
}

function Browse({ nav, go, back, db }) {
  const { brand, model, gen, pt, cat } = nav;
  const range = g => `${g.from}–${g.to || "present"}`;
  const Row = ({ title, sub, subAbove, live, onClick }) => (
    <button disabled={!live} onClick={onClick} className={`card flex w-full items-center justify-between rounded-sm bg-white px-4 py-4 text-left shadow-sm ${live ? "" : "opacity-50"}`}>
      <div>{sub && subAbove ? <div className="text-xs font-bold uppercase tracking-wide teal">{sub}</div> : null}<div className="font-bold text-[17px]">{title}</div>{sub && !subAbove ? <div className="text-sm text-gray-500">{sub}</div> : null}</div>
      {live ? <ChevronRight size={18} className="text-blue-700" /> : <span className="rounded-sm bg-gray-200 px-2 py-0.5 text-xs">Soon</span>}
    </button>
  );
  let title, list;
  if (!model) { title = brand.name; list = db.models[brand.id].map(m => <Row key={m.id} title={m.name} live={m.live} onClick={() => go({ ...nav, model: m })} />); }
  else if (!gen) { title = `${brand.name} ${model.name}`; list = (db.gens[model.id] || []).map(g => <Row key={g.id} title={range(g)} sub={g.name} subAbove live={g.live} onClick={() => go({ ...nav, gen: g })} />); }
  else if (!pt) { title = `${model.name} ${gen.name} · ${range(gen)}`; list = (db.powertrains[gen.id] || []).map(p => <Row key={p.id} title={`${p.name} · ${p.code}`} sub={p.note} live={p.live} onClick={() => go({ ...nav, pt: p })} />); }
  else if (!cat) { title = `${model.name} ${gen.name} ${pt.name}`; const mine = db.tasks.filter(t => t.powertrainId === pt.id); list = db.categories.map(c => { const n = mine.filter(t => t.cat === c).length; return <Row key={c} title={c} sub={n ? `${n} guide${n>1?"s":""}` : "Nothing yet"} live={n > 0} onClick={() => go({ ...nav, cat: c })} />; }); }
  else { title = cat; list = db.tasks.filter(t => t.cat === cat && t.powertrainId === pt.id).map(t => <TaskCard key={t.id} t={t} onOpen={() => go({ screen: "guide", gid: t.guideId || t.id })} />); }
  const crumbs = [brand?.name, model?.name, gen?.name, pt?.name, cat].filter(Boolean).join(" / ");
  return (
    <Frame onHome={() => go({ screen: "home" })} onBack={back} crumbs={crumbs}>
      <h1 className="wide font-black text-3xl tracking-tight pt-4 pb-4">{title}</h1>
      <div className="space-y-2">{list}</div>
    </Frame>
  );
}

function GuideScreen({ go, back, gid, db, choice: initialChoice, onChoice }) {
  const [g, setG] = useState(null);
  const [loadErr, setLoadErr] = useState(null);
  useEffect(() => { let on = true; loadGuide(gid).then(x => on && setG(x)).catch(e => on && setLoadErr(e.message || String(e))); return () => { on = false; }; }, [gid]);
  if (loadErr) return <Frame onHome={() => go({ screen: "home" })} onBack={back}><p className="pt-10 text-gray-700">Couldn't load this guide. {loadErr}</p></Frame>;
  if (!g) return <Frame onHome={() => go({ screen: "home" })} onBack={back}><p className="pt-10 text-gray-500">Loading guide…</p></Frame>;
  return <GuideBody go={go} back={back} g={g} initialChoice={initialChoice} onChoice={onChoice} />;
}

function GuideBody({ go, back, g, initialChoice, onChoice }) {
  const gid = g.id;
  const v = g.variants;
  const [choice, setChoice] = useState(initialChoice || null);
  const [asking, setAsking] = useState(!!v && !initialChoice);
  const [showAM, setShowAM] = useState(false);
  const chosen = v && choice ? v.options.find(o => o.id === choice) : null;
  const [active, setActive] = useState("glance");
  const nav = [["glance","At a glance"],["should","Should you?"],["need","Parts & tools"],["steps","Steps"],...(g.alsoReplace && g.alsoReplace.length ? [["also","While you're in there"]] : []),["read", g.check.tab],["after","After"],["sources","Sources"]];
  const tabRefs = useRef({});

  // Scrollspy: the active tab is the last section whose top has passed the sticky bars.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const line = 120;
        let cur = nav[0][0];
        for (const [id] of nav) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) cur = id;
        }
        const atBottom = window.scrollY > 0 && Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2;
        if (atBottom) cur = nav[nav.length - 1][0];
        setActive(cur);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => { tabRefs.current[active]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); }, [active]);

  const jump = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const diffBar = Array.from({ length: 5 }, (_, i) => <span key={i} className={`h-2 w-5 rounded-sm ${i + 1 <= Math.floor(g.glance.difficulty) ? "bg-blue-700" : i < g.glance.difficulty ? "bg-blue-400" : "bg-gray-300"}`} />);
  const H2 = ({ id, children }) => <h2 id={id} className="wide font-black text-2xl tracking-tight pt-10 pb-3 scroll-mt-24">{children}</h2>;
  const openKit = () => go({ screen: "kit", guide: g, choice });
  const Glance = ({ label, icon, children, onClick }) => {
    const inner = <>{onClick ? <ChevronRight size={16} className="absolute right-2 top-2 metric" /> : null}<div className="flex items-center gap-1 text-xs text-gray-500">{icon}{label}</div>{children}</>;
    return onClick
      ? <button onClick={onClick} className="card relative rounded-sm bg-white p-3 text-left shadow-sm">{inner}</button>
      : <div className="card relative rounded-sm bg-white p-3 shadow-sm">{inner}</div>;
  };

  return (
    <Frame onHome={() => go({ screen: "home" })} onBack={back} crumbs={g.fits}>
      <div className="pt-4">
        <div className="text-sm text-gray-500">{g.category} · {g.fits}</div>
        <h1 className="wide font-black text-[32px] leading-[1.02] tracking-tight mt-1">{g.title}</h1>
        {chosen ? (
          <button onClick={() => setAsking(true)} className="mt-3 inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "#0F2230" }}>
            <span>{chosen.label}</span><Repeat size={14} className="text-gray-300" /><span className="text-gray-300 font-normal">change</span>
          </button>
        ) : null}
      </div>
      {asking && v ? <VariantModal v={v} onPick={id => { setChoice(id); setAsking(false); onChoice && onChoice(id); }} /> : null}

      <figure className="relative mt-5 mb-1 px-6">
        <Quote size={64} strokeWidth={0} fill="#9AD4D7" className="absolute left-0 -top-3 -scale-x-100 pointer-events-none" style={{ zIndex: 0 }} aria-hidden />
        <blockquote className="relative wide font-bold text-[21px] leading-snug" style={{ color: "#0E494D", zIndex: 1 }}>{g.glance.why}</blockquote>
        <Quote size={64} strokeWidth={0} fill="#9AD4D7" className="absolute right-0 -bottom-4 pointer-events-none" style={{ zIndex: 0 }} aria-hidden />
      </figure>

      <nav className="sticky top-[52px] z-10 -mx-4 mt-5 flex gap-1 overflow-x-auto bg-[#FDFDFC]/95 px-4 py-2 backdrop-blur" aria-label="Contents" style={{ scrollbarWidth: "none" }}>
        {nav.map(([id, l]) => <button key={id} ref={el => (tabRefs.current[id] = el)} onClick={() => jump(id)} aria-current={active===id ? "true" : undefined} className={`shrink-0 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors ${active===id ? "active-fill" : "bg-white text-gray-700"}`}>{l}</button>)}
      </nav>

      <div id="glance" className="scroll-mt-28"><Lifespan l={g.lifespan} choice={choice} /></div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Glance label="Time" icon={<Clock size={12} />}><div className="wide font-black text-2xl mt-1 metric">{g.glance.timeFirst}</div><div className="text-xs text-gray-500">{g.glance.timeRepeat} once you've done it</div></Glance>
        <Glance label="Difficulty" icon={<Gauge size={12} />}><div className="wide font-black text-2xl mt-1 metric">{g.glance.difficulty}<span className="text-base text-gray-400">/5</span></div><div className="mt-1 flex gap-1">{diffBar}</div></Glance>
        <Glance label="Parts" icon={<ShoppingCart size={12} />} onClick={openKit}><div className="wide font-black text-2xl mt-1 metric">{g.glance.cost}</div><div className="text-xs teal font-semibold">Parts, tools & where to buy</div></Glance>
        <Glance label="Watch out for"><div className="font-semibold mt-1 leading-snug">{g.glance.risk}</div></Glance>
      </div>
      <p className="mt-2 text-sm text-gray-600">{txt(g.glance.note)}</p>
      <Art id={g.heroId || (g.kind === "upgrade" ? "rsbhero" : "hero")} cap={g.heroCap} />
      {g.embeds && g.embeds.length && g.embeds[0].id ? <Video id={g.embeds[0].id} title="Watch the whole job" note={g.embeds[0].note} /> : null}

      <H2 id="should">Should you do this?</H2>
      <div className="font-semibold">Yes, if any of these are true</div>
      <ul className="mt-2 space-y-1">{g.should.yesIf.filter(x => vis(x, choice)).map((s, i) => <li key={i} className="flex gap-2"><Check size={18} strokeWidth={3} className="mt-1 shrink-0" style={{ color: "#FF5A28" }} aria-hidden />{txt(s)}</li>)}</ul>
      {g.should.codes.length ? <div className="mt-3 flex flex-wrap gap-1">{g.should.codes.map(c => <span key={c} className="rounded-sm bg-gray-900 px-2 py-0.5 text-sm font-mono text-white">{c}</span>)}</div> : null}
      {g.should.notes.filter(x => vis(x, choice)).map((n, i) => <p key={i} className="mt-3 rounded-sm bg-white/70 px-3 py-2 text-[15px] leading-relaxed">{txt(n)}</p>)}
      <div className="mt-3"><Dots c={g.should.confidence} /></div>

      <H2 id="need">What you need</H2>
      <div className="card rounded-sm bg-white shadow-sm divide-y divide-gray-200">
        {g.parts.filter(x => vis(x, choice)).map((p, i) => <div key={i} className="flex justify-between gap-3 p-3"><div>{p.tier ? <div className="text-[11px] font-bold teal">{TIER[p.tier] || p.tier}</div> : null}<div className="font-semibold">{p.name}</div><div className="text-sm text-gray-600">{p.note}</div></div><div className="shrink-0 text-right text-sm text-gray-700">{p.pn !== p.price ? <div className="font-mono">{p.pn}</div> : null}<div className="text-gray-500">{p.price}</div></div></div>)}
      </div>
      <button onClick={openKit} className="mt-3 flex w-full items-center justify-between rounded-sm px-4 py-3 text-left font-semibold text-white" style={{ background: "#0E494D" }}><span className="flex items-center gap-2"><ShoppingCart size={18} />Full shopping list & where to buy</span><ChevronRight size={18} /></button>
      {g.aftermarket && g.aftermarket.length ? (
        <div className="mt-2 rounded-sm shadow-sm border-2" style={{ borderColor: "#E5FE52", background: "#F3FAE7" }}>
          <button onClick={() => setShowAM(x => !x)} aria-expanded={showAM} className="flex w-full items-center justify-between px-3 py-3 text-left">
            <span className="flex items-center gap-2 font-semibold" style={{ color: "#212700" }}><span className="flex h-7 w-7 items-center justify-center rounded-sm" style={{ background: "#E5FE52" }}><Zap size={16} fill="#212700" style={{ color: "#212700" }} /></span>Aftermarket options <span className="font-normal opacity-60">({g.aftermarket.length})</span></span>
            <ChevronDown size={18} className={`text-gray-500 transition-transform ${showAM ? "rotate-180" : ""}`} />
          </button>
          {showAM ? (
            <div className="divide-y divide-gray-200 border-t border-gray-200">
              {g.aftermarket.filter(x => vis(x, choice)).map((a, i) => (
                <div key={i} className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div><div className="font-semibold">{a.name}</div><div className="text-sm text-gray-600">{a.note}</div></div>
                    <div className="shrink-0 text-sm text-gray-700">{a.price}</div>
                  </div>
                  {a.signal ? <div className="mt-1 inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold" style={{ background: "#E5FE52", color: "#343D01" }}><Star size={12} />{a.signal}</div> : null}
                  {a.links && a.links.length ? <div className="mt-2 flex flex-wrap gap-2">{a.links.map((l, k) => <a key={k} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-sm bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white">{l.store}<ExternalLink size={13} /></a>)}</div> : null}
                </div>
              ))}
              <p className="p-3 text-xs text-gray-500">Ratings from retail and forum sources will appear here once the review pipeline is live.</p>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="card mt-3 rounded-sm bg-white shadow-sm divide-y divide-gray-200">
        {g.tools.filter(x => vis(x, choice)).map((t, i) => <div key={i} className="flex gap-3 p-3"><Wrench size={18} className="mt-0.5 shrink-0 text-gray-500" /><div className="flex-1"><div className="font-semibold">{t.name}</div>{t.note ? <div className="text-sm text-gray-600">{t.note}</div> : null}</div><div className="shrink-0 text-sm text-gray-500">{t.price}</div></div>)}
      </div>
      {gid === "cam-follower" ? <Art id="bits" cap={'Both fit a ¼" drive. The forums are full of people who bought the wrong one.'} /> : null}
      <h3 className="mt-6 font-bold text-lg">Before you start</h3>
      <ul className="mt-2 space-y-2">{g.before.map((s, i) => <li key={i} className="flex gap-2"><span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />{s}</li>)}</ul>

      <H2 id="steps">Steps</H2>
      {g.steps.filter(x => vis(x, choice)).map((s, i) => <Step key={i} s={{ ...s, n: i + 1 }} choice={choice} />)}

      {g.alsoReplace && g.alsoReplace.length ? (<>
        <H2 id="also"><span className="inline-flex items-center gap-2"><Lightbulb size={24} className="shrink-0" style={{ color: "#936700" }} aria-hidden />While you're in there</span></H2>
        <p className="text-gray-600 -mt-1 mb-3">Parts worth doing now, because the hard part of reaching them is already done.</p>
        <div className="space-y-2">
          {g.alsoReplace.filter(x => vis(x, choice)).map((r, i) => (
            <div key={i} className="card rounded-sm bg-white p-3 shadow-sm flex gap-3">
              <PlusCircle size={20} className="mt-0.5 shrink-0" style={{ color: "#0E494D" }} aria-hidden />
              <div><div className="font-bold">{r.name}</div><div className="mt-0.5 text-[15px] text-gray-700 leading-relaxed">{r.why}</div></div>
            </div>
          ))}
        </div>
      </>) : null}

      <H2 id="read">{g.check.title}</H2>
      <Art id={g.check.illId} cap={g.check.illCap} />
      <div className="space-y-2">
        {g.check.rows.map((r, i) => (
          <div key={i} className="card rounded-sm bg-white p-3 shadow-sm">
            <div className="flex items-baseline gap-2"><span className="wide font-black text-2xl text-gray-400">{"ABC"[i]}</span><div className="font-bold">{r.see}</div></div>
            <div className="mt-1 text-[15px] text-gray-700">{r.means}</div>
            <div className="mt-2 rounded-sm bg-blue-50 px-3 py-2 text-[15px]"><span className="font-semibold">Do this: </span>{r.do}</div>
          </div>
        ))}
      </div>
      <div className="mt-3"><Dots c={g.check.c} /></div>

      <H2 id="after">Afterwards</H2>
      <ul className="space-y-2">{g.aftercare.filter(x => vis(x, choice)).map((s, i) => <li key={i} className="flex gap-2"><span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />{txt(s)}</li>)}</ul>
      {gid === "cam-follower" ? <div className="mt-3"><Dots c={C.interval} /></div> : null}

      <H2 id="sources">Where sources disagree</H2>
      <div className="space-y-2">
        {g.disagreements.map((d, i) => (
          <div key={i} className="card rounded-sm bg-white p-3 shadow-sm">
            <div className="font-bold">{d.topic}</div>
            <div className="mt-1 text-[15px] text-gray-600">{d.pos}</div>
            <div className="mt-1 text-[15px]"><span className="font-semibold teal">Our call: </span>{d.call}</div>
          </div>
        ))}
      </div>
      <h3 className="mt-6 font-bold text-lg">Sources</h3>
      <ul className="mt-2 space-y-1 text-[15px] text-gray-700">{g.sources.map((s, i) => <li key={i}>{s}</li>)}</ul>
      <div className="mt-6 text-sm text-gray-500">{g.alsoFits}</div>
    </Frame>
  );
}

function KitScreen({ go, back, guide: g, choice }) {
  const [have, setHave] = useState({});
  const toggle = k => setHave(h => ({ ...h, [k]: !h[k] }));
  const Row = ({ k, name, note, pn, price, links }) => (
    <div className={`p-3 ${have[k] ? "opacity-50" : ""}`}>
      <div className="flex items-start gap-3">
        <button onClick={() => toggle(k)} aria-pressed={!!have[k]} aria-label={have[k] ? "Mark as needed" : "Mark as already have"} className={`mt-0.5 h-6 w-6 shrink-0 rounded-sm border-2 ${have[k] ? "active-fill border-transparent" : "border-gray-400 bg-white"}`}>{have[k] ? <span className="block text-center text-white text-sm leading-5">✓</span> : null}</button>
        <div className="flex-1 min-w-0">
          <div className="font-semibold leading-tight">{name}</div>
          {note ? <div className="text-sm text-gray-600">{note}</div> : null}
          {pn ? <div className="text-xs font-mono text-gray-500 mt-0.5">{pn}</div> : null}
          {links && links.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {links.map((l, i) => <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-sm bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white">{l.store}<ExternalLink size={13} /></a>)}
            </div>
          ) : null}
        </div>
        <div className="shrink-0 text-sm font-semibold text-gray-700">{price}</div>
      </div>
    </div>
  );
  return (
    <Frame onHome={() => go({ screen: "home" })} onBack={back} crumbs={g.fits}>
      <div className="pt-4">
        <div className="text-sm text-gray-500">{g.title}</div>
        <h1 className="wide font-black text-3xl tracking-tight mt-1">Shopping list</h1>
        <p className="mt-2 text-gray-600">Tick off what you already own. Prices are typical, not quotes.</p>
      </div>
      <h2 className="mt-6 mb-2 font-bold text-lg">Parts</h2>
      <div className="card rounded-sm bg-white shadow-sm divide-y divide-gray-200">
        {g.parts.filter(x => vis(x, choice)).map((p, i) => <Row key={i} k={`p${i}`} name={p.name} note={(p.tier ? (TIER[p.tier] || p.tier) + " · " : "") + (p.note || "")} pn={p.pn} price={p.price} links={p.links} />)}
      </div>
      {g.aftermarket && g.aftermarket.length ? (<>
        <h2 className="mt-6 mb-2 font-bold text-lg">Aftermarket options</h2>
        <div className="card rounded-sm bg-white shadow-sm divide-y divide-gray-200">
          {g.aftermarket.map((a, i) => <Row key={i} k={`a${i}`} name={a.name} note={(a.signal ? a.signal + " · " : "") + (a.note || "")} price={a.price} links={a.links} />)}
        </div>
      </>) : null}
      <h2 className="mt-6 mb-2 font-bold text-lg">Tools</h2>
      <div className="card rounded-sm bg-white shadow-sm divide-y divide-gray-200">
        {g.tools.filter(x => vis(x, choice)).map((t, i) => <Row key={i} k={`t${i}`} name={t.name} note={t.note} price={t.price} />)}
      </div>
      <p className="mt-3 text-sm text-gray-500">Tool links arrive once we've picked retail partners. Part links go to the retailers whose guides we drew from.</p>
    </Frame>
  );
}


/* "Don't see what you need?" — request form. Saves to Supabase, forwards by email when configured. */
function RequestScreen({ go, back }) {
  const [closing, setClosing] = useState(false);
  const close = () => { if (closing) return; setClosing(true); setTimeout(back, 280); };
  const anim = closing ? "sheet-out" : "sheet-in";
  const [f, setF] = useState({ name: "", email: "", year: "", make: "", model: "", description: "" });
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [errMsg, setErrMsg] = useState("");
  const set = k => e => setF(x => ({ ...x, [k]: e.target.value }));
  const valid = f.name.trim() && /\S+@\S+\.\S+/.test(f.email) && f.description.trim().length > 5;
  const send = async () => {
    if (!valid) return;
    setState("sending");
    try { await submitRequest(f); setState("done"); }
    catch (e) { setErrMsg(e.message || String(e)); setState("error"); }
  };
  const Field = ({ k, label, placeholder, type = "text", area }) => (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-700">{label}</span>
      {area
        ? <textarea value={f[k]} onChange={set(k)} placeholder={placeholder} rows={4} className="mt-1 w-full rounded-sm bg-white px-3 py-2.5 text-[17px] shadow-sm outline-none focus:ring-2 focus:ring-[#0B4664]" />
        : <input value={f[k]} onChange={set(k)} placeholder={placeholder} type={type} className="mt-1 w-full rounded-sm bg-white px-3 py-2.5 text-[17px] shadow-sm outline-none focus:ring-2 focus:ring-[#0B4664]" />}
    </label>
  );
  if (state === "done") return (
    <Frame onHome={() => go({ screen: "home" })} onClose={close} anim={anim}>
      <div className="pt-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full active-fill"><Check size={26} /></div>
        <h1 className="wide font-black text-3xl tracking-tight mt-4">Got it. Thank you.</h1>
        <p className="mt-2 text-gray-600 leading-relaxed">Your request is in the queue. If we build it, you'll hear from us at {f.email}.</p>
        <button onClick={() => go({ screen: "home" })} className="mt-6 rounded-sm px-4 py-3 font-semibold text-white" style={{ background: "#0E494D" }}>Back to home</button>
      </div>
    </Frame>
  );
  return (
    <Frame onHome={() => go({ screen: "home" })} onClose={close} anim={anim}>
      <div className="pt-4">
        <div className="text-sm text-gray-500">Request a guide</div>
        <h1 className="wide font-black text-3xl tracking-tight mt-1">What should we write next?</h1>
        <p className="mt-2 text-gray-600 leading-relaxed">Tell us the car and the job. Peer contribution is how this thing grows.</p>
      </div>
      <div className="mt-6 space-y-4">
        <Field k="name" label="Your name" placeholder="Anthony" />
        <Field k="email" label="Email" placeholder="you@example.com" type="email" />
        <div className="grid grid-cols-3 gap-3">
          <Field k="year" label="Year" placeholder="2006" />
          <Field k="make" label="Make" placeholder="Volkswagen" />
          <Field k="model" label="Model" placeholder="GTI" />
        </div>
        <Field k="description" label="The guide you need" placeholder="How to replace the PCV valve on a 2.0T FSI" area />
      </div>
      {state === "error" ? <p className="mt-4 rounded-sm bg-yellow-300/40 px-3 py-2 text-sm">Couldn't send that. {errMsg}</p> : null}
      <button onClick={send} disabled={!valid || state === "sending"} className={`mt-6 flex w-full items-center justify-center gap-2 rounded-sm px-4 py-3 font-semibold text-white ${valid ? "" : "opacity-50"}`} style={{ background: "#0E494D" }}>
        <Send size={18} />{state === "sending" ? "Sending…" : "Send request"}
      </button>
      <p className="mt-3 text-xs text-gray-500">We use your email only to follow up about this request.</p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
export default function App() {
  const [db, setDb] = useState(null);
  const [err, setErr] = useState(null);
  const [splash, setSplash] = useState(true);
  const endSplash = useCallback(() => setSplash(false), []);
  const [stack, setStack] = useState([{ screen: "home" }]);
  const nav = stack[stack.length - 1];
  const go = n => setStack(s => [...s, n]);
  const back = () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s));
  const patch = p => setStack(s => [...s.slice(0, -1), { ...s[s.length - 1], ...p }]);
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [nav.screen, nav.gid]);
  // Loads the vehicle catalog plus the task list for the current vehicle. Guides load one at a time when opened.
  useEffect(() => {
    Promise.all([loadCatalog(), loadTasks()])
      .then(([cat, tasks]) => setDb({ ...cat, tasks }))
      .catch(e => setErr(e.message || String(e)));
  }, []);

  if (err) return (
    <Frame onHome={() => {}}>
      <div className="pt-10">
        <h1 className="wide font-black text-2xl">Couldn't load the guides</h1>
        <p className="mt-2 text-gray-600">Check the Supabase URL and key in your environment variables, and that the SQL setup has been run.</p>
        <pre className="mt-4 whitespace-pre-wrap rounded-sm bg-white p-3 text-xs text-gray-700">{err}</pre>
      </div>
    </Frame>
  );
  if (!db) return (
    <Frame onHome={() => {}} dark>
      {splash ? <Splash onDone={endSplash} /> : null}
      <div className="pt-10 text-gray-500">Loading guides…</div>
    </Frame>
  );

  if (nav.screen === "guide") return <GuideScreen go={go} back={back} gid={nav.gid} db={db} choice={nav.choice} onChoice={id => patch({ choice: id })} />;
  if (nav.screen === "kit") return <KitScreen go={go} back={back} guide={nav.guide} choice={nav.choice} />;
  if (nav.screen === "browse") return <Browse nav={nav} go={go} back={back} db={db} />;
  if (nav.screen === "request") return <RequestScreen go={go} back={back} />;
  return (
    <>
      {splash ? <Splash onDone={endSplash} /> : null}
      <Frame onHome={() => setStack([{ screen: "home" }])} dark>
        <HomeScreen go={go} db={db} />
      </Frame>
    </>
  );
}
