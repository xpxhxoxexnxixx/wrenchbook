import { useState, useMemo, useEffect, useRef } from "react";
import { loadAll } from "./lib/data";
import { Search, ChevronRight, ChevronLeft, Clock, Wrench, Gauge, ShieldAlert, Play, Quote, ExternalLink, ShoppingCart } from "lucide-react";

/* ------------------------------------------------------------------ */
/* DATA — this is the shape the content pipeline produces (see schema) */
/* ------------------------------------------------------------------ */

// Confidence note reused by the cam-follower guide's interval section
const C = { interval: { level: "community", n: 4, note: "No factory interval exists. Derived from forum practice." } };

/* ------------------------------------------------------------------ */
/* DESIGN TOKENS                                                       */
/* ------------------------------------------------------------------ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900&display=swap');
.wb { font-family: 'Archivo', system-ui, sans-serif; color:#1B1F24; background:#E9EBEE; -webkit-font-smoothing:antialiased; }
.wb * { box-sizing:border-box; }
.wb .wide { font-stretch: 112%; }
.wb .narrow { font-stretch: 88%; }
.hazard { background: repeating-linear-gradient(135deg, #F2B600 0 10px, #1B1F24 10px 20px); }
.plate { background:#1B1F24; color:#F4F5F7; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08), 0 1px 0 rgba(0,0,0,.4); }
.plate .rivet { width:6px; height:6px; border-radius:50%; background:#8A8F98; box-shadow: inset 0 1px 1px rgba(0,0,0,.6); position:absolute; }
.wb button:focus-visible, .wb input:focus-visible, .wb a:focus-visible { outline: 3px solid #1F4FD6; outline-offset: 2px; }
.flip { transition: transform .35s; transform-style: preserve-3d; }
@media (prefers-reduced-motion: reduce) { .flip { transition:none; } }
`;

/* ------------------------------------------------------------------ */
/* SMALL PARTS                                                         */
/* ------------------------------------------------------------------ */
const Dots = ({ c, dark }) => {
  const filled = c.level === "high" ? 3 : (c.level === "medium" || c.level === "community") ? 2 : 1;
  const label = { high: "High confidence", medium: "Medium confidence", community: "Community method", single: "Single source", varies: "Sources vary" }[c.level];
  return (
    <div className={`flex items-start gap-2 text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>
      <div className="flex gap-1 mt-1.5 shrink-0" aria-label={label}>
        {[0,1,2].map(i => <span key={i} className={`block w-2 h-2 rounded-full ${i < filled ? (dark ? "bg-blue-400" : "bg-blue-700") : (dark ? "bg-gray-600" : "bg-gray-400")}`} />)}
      </div>
      <div><span className="font-semibold">{label}</span>{c.n ? <span className="text-gray-500"> · {c.n} source{c.n>1?"s":""}</span> : null}<span className="block text-gray-600 leading-snug">{c.note}</span></div>
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
          <div className="text-xs text-gray-400 narrow">Torque · {b.label}</div>
          <button onClick={() => setUnit(u => u === "nm" ? "lb" : "nm")} className="text-left mt-1 flex items-baseline gap-2" aria-label="Toggle units">
            <span className="wide font-black text-5xl leading-none tabular-nums" style={{ letterSpacing: "-0.02em" }}>{range}</span>
            <span className="text-lg text-gray-300 font-semibold">{unit === "nm" ? "Nm" : "lb-ft"}{b.note ? <span className="ml-2 text-yellow-300">{b.note}</span> : null}</span>
          </button>
          <div className="text-xs text-gray-400 mt-1">
            {unit === "nm"
              ? `${vals.length > 1 ? lb(Math.min(...vals)) + "–" + lb(Math.max(...vals)) : lb(b.nm)} lb-ft`
              : `${vals.length > 1 ? Math.min(...vals) + "–" + Math.max(...vals) : b.nm} Nm`} · tap to switch
          </div>
        </div>
        <Wrench className="shrink-0 text-gray-500" size={40} strokeWidth={1.5} />
      </div>
      {b.alt ? (
        <div className="mt-3 rounded-sm bg-gray-800 px-3 py-2 text-sm text-gray-200">
          <span className="font-semibold">Two values in the wild:</span> {vals.map(v => `${v} Nm`).join(" and ")}. No factory number found.
        </div>
      ) : null}
      <div className="mt-3 border-t border-gray-700 pt-3"><Dots c={b.c} dark /></div>
    </div>
  );
};

const INK = "#1B1F24", METAL = "#8A8F98", LIGHT = "#F4F5F7", COBALT = "#1F4FD6", TEAL = "#0E494D", PALE = "#C9ECEE", YEL = "#F2B600", BRASS = "#C89B3C", STEEL = "#B5B9C0";
const Lbl = ({ x, y, children, anchor = "start", fill = INK, size = 12, w = 600 }) => <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} fontWeight={w} fontFamily="Archivo, system-ui, sans-serif">{children}</text>;
const Leader = ({ d }) => <path d={d} fill="none" stroke={TEAL} strokeWidth="1.5" strokeDasharray="3 3" />;
const Egg = ({ cx, cy, r, rot = 0, fill = "#4A4F58" }) => (
  <g transform={`rotate(${rot} ${cx} ${cy})`}>
    <path d={`M${cx} ${cy - r - 14} C ${cx + r * 0.75} ${cy - r - 14}, ${cx + r} ${cy - r * 0.45}, ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} C ${cx - r} ${cy - r * 0.45}, ${cx - r * 0.75} ${cy - r - 14}, ${cx} ${cy - r - 14} Z`} fill={fill} stroke={INK} strokeWidth="2" />
    <circle cx={cx} cy={cy} r={r * 0.2} fill={METAL} stroke={INK} strokeWidth="1.5" />
  </g>
);
const Cup = ({ x, y, w = 70, h = 40 }) => <path d={`M${x} ${y} V${y + h} H${x + w} V${y}`} fill="none" stroke={INK} strokeWidth="6" strokeLinejoin="round" />;
const Spring = ({ x, y, h, n = 5 }) => { const seg = h / n; let d = `M${x} ${y}`; for (let i = 0; i < n; i++) d += ` l10 ${seg / 2} l-20 ${seg / 2} l10 0`; return <path d={d} fill="none" stroke={INK} strokeWidth="2" />; };

const ART = {
  hero: (
    <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="Cutaway showing the fuel pump piston pressing on the cup-shaped follower, which rides on the camshaft lobe">
      <rect width="400" height="260" fill={LIGHT} />
      <rect x="150" y="10" width="100" height="70" rx="6" fill={METAL} stroke={INK} strokeWidth="2" />
      <Lbl x="200" y="52" anchor="middle" fill="#fff" size={14} w={800}>HPFP</Lbl>
      <rect x="190" y="80" width="20" height="62" fill={STEEL} stroke={INK} strokeWidth="2" />
      <Cup x={165} y={118} w={70} h={42} />
      <Egg cx={200} cy={222} r={42} />
      <ellipse cx="200" cy="164" rx="14" ry="4" fill={COBALT} />
      <path d="M255 235 A 60 60 0 0 0 250 195" fill="none" stroke={TEAL} strokeWidth="2" markerEnd="url(#arr)" />
      <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={TEAL} /></marker></defs>
      <Leader d="M212 110 H285" /><Lbl x="290" y="114">Pump piston</Lbl>
      <Leader d="M238 140 H285" /><Lbl x="290" y="137">Cam follower</Lbl><Lbl x="290" y="151" size={11} w={400} fill={TEAL}>the sacrificial cup</Lbl>
      <Leader d="M240 222 H285" /><Lbl x="290" y="226">Intake cam lobe</Lbl>
      <Leader d="M186 164 H120" /><Lbl x="115" y="160" anchor="end" fill={COBALT} w={700}>Wear happens</Lbl><Lbl x="115" y="174" anchor="end" fill={COBALT} w={700}>right here</Lbl>
    </svg>
  ),
  banjo: (
    <svg viewBox="0 0 400 230" className="w-full" role="img" aria-label="Underside of the fuel pump showing the banjo bolt with a stubby triple-square bit and box wrench">
      <rect width="400" height="230" fill={LIGHT} />
      <rect x="120" y="8" width="120" height="70" rx="6" fill={METAL} stroke={INK} strokeWidth="2" />
      <Lbl x="180" y="48" anchor="middle" fill="#fff" size={12} w={800}>HPFP · bottom</Lbl>
      <rect x="240" y="30" width="160" height="10" fill={STEEL} stroke={INK} strokeWidth="1.5" />
      <rect x="244" y="22" width="30" height="26" rx="3" fill={BRASS} stroke={INK} strokeWidth="1.5" />
      <rect x="0" y="100" width="128" height="12" fill={STEEL} stroke={INK} strokeWidth="1.5" />
      <circle cx="150" cy="106" r="20" fill={BRASS} stroke={INK} strokeWidth="2" />
      <rect x="140" y="78" width="20" height="12" fill={BRASS} stroke={INK} strokeWidth="1.5" />
      <circle cx="150" cy="106" r="8" fill={INK} />
      <rect x="143" y="126" width="14" height="36" fill="#4A4F58" stroke={INK} strokeWidth="1.5" />
      <rect x="143" y="132" width="14" height="10" fill={YEL} />
      <rect x="150" y="150" width="150" height="16" rx="3" fill={METAL} stroke={INK} strokeWidth="2" />
      <circle cx="150" cy="158" r="14" fill="none" stroke={INK} strokeWidth="6" />
      <path d="M300 200 A 40 40 0 0 1 330 160" fill="none" stroke={TEAL} strokeWidth="2" markerEnd="url(#arr2)" />
      <defs><marker id="arr2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={TEAL} /></marker></defs>
      <Lbl x="260" y="66" size={11} w={400} fill={TEAL}>17mm collar · step 5</Lbl>
      <Leader d="M100 90 H60" /><Lbl x="55" y="86" anchor="end" size={11}>Low-pressure</Lbl><Lbl x="55" y="98" anchor="end" size={11}>metal line</Lbl>
      <Leader d="M172 106 H215" /><Lbl x="220" y="102" size={11}>Banjo eye</Lbl><Lbl x="220" y="114" size={11} w={400} fill={TEAL}>bolt threads into brass</Lbl>
      <Leader d="M136 137 H70" /><Lbl x="65" y="133" anchor="end" size={11}>Stubby M8</Lbl><Lbl x="65" y="145" anchor="end" size={11}>triple-square</Lbl>
      <Leader d="M136 158 H70" /><Lbl x="65" y="162" anchor="end" size={11} fill={COBALT} w={700}>Tape on the bit</Lbl>
      <Lbl x="225" y="190" anchor="middle" size={11}>13mm box wrench on the bit's shank</Lbl>
      <Lbl x="340" y="215" anchor="middle" size={11} fill={TEAL} w={700}>slow, small turns</Lbl>
    </svg>
  ),
  lobe: (
    <svg viewBox="0 0 400 330" className="w-full" role="img" aria-label="Cam lobe on its flank makes the pump easy to seat; on its nose the spring is fully compressed. Below, tighten the three bolts alternately.">
      <rect width="400" height="330" fill={LIGHT} />
      <line x1="200" y1="14" x2="200" y2="200" stroke={METAL} strokeDasharray="4 4" />
      <Lbl x="100" y="26" anchor="middle" fill={COBALT} size={14} w={800}>Lobe on the flank</Lbl>
      <Lbl x="100" y="42" anchor="middle" fill={COBALT} size={11} w={400}>pump seats easily</Lbl>
      <Spring x={100} y={60} h={50} />
      <rect x="90" y="110" width="20" height="30" fill={STEEL} stroke={INK} strokeWidth="2" />
      <Cup x={65} y={124} w={70} h={36} />
      <Egg cx={100} cy={200} r={34} rot={-90} />
      <Lbl x="300" y="26" anchor="middle" fill={INK} size={14} w={800}>Lobe on the nose</Lbl>
      <rect x="240" y="32" width="120" height="14" fill={YEL} />
      <Lbl x="300" y="43" anchor="middle" fill={INK} size={11} w={700}>spring fully compressed</Lbl>
      <Spring x={300} y={60} h={22} n={5} />
      <rect x="290" y="82" width="20" height="30" fill={STEEL} stroke={INK} strokeWidth="2" />
      <Cup x={265} y={96} w={70} h={36} />
      <Egg cx={300} cy={200} r={34} rot={0} />
      <line x1="20" y1="222" x2="380" y2="222" stroke={METAL} />
      <Lbl x="20" y="248" size={13} w={700}>Three bolts. Alternate, a little at a time.</Lbl>
      <circle cx="90" cy="290" r="26" fill={METAL} stroke={INK} strokeWidth="2" />
      <circle cx="90" cy="290" r="10" fill={INK} />
      <circle cx="90" cy="266" r="6" fill={COBALT} /><Lbl x="90" y="269" anchor="middle" fill="#fff" size={9} w={800}>1</Lbl>
      <circle cx="111" cy="302" r="6" fill={COBALT} /><Lbl x="111" y="305" anchor="middle" fill="#fff" size={9} w={800}>2</Lbl>
      <circle cx="69" cy="302" r="6" fill={COBALT} /><Lbl x="69" y="305" anchor="middle" fill="#fff" size={9} w={800}>3</Lbl>
      <Lbl x="135" y="286" size={12}>Snug 1 → 2 → 3, then go around again</Lbl>
      <Lbl x="135" y="302" size={12}>Final torque: 10 Nm on each</Lbl>
      <Lbl x="135" y="318" size={11} fill={TEAL} w={400}>Never fully tighten one bolt while the others are loose</Lbl>
    </svg>
  ),
  wear: (
    <svg viewBox="0 0 400 190" className="w-full" role="img" aria-label="Three followers face-on: intact coating, coating worn through in the center, and worn through with a hole">
      <rect width="400" height="190" fill={LIGHT} />
      {[[70, "A", "Coating intact"], [200, "B", "Silver in the center"], [330, "C", "Worn through"]].map(([x, l, t]) => (
        <g key={l}>
          <circle cx={x} cy="80" r="46" fill={INK} stroke="#000" strokeWidth="2" />
          <path d={`M${x - 30} 58 A 38 38 0 0 1 ${x + 8} 38`} fill="none" stroke="#3A3F48" strokeWidth="4" strokeLinecap="round" />
          <Lbl x={x} y="150" anchor="middle" size={20} w={900} fill={l === "C" ? COBALT : INK}>{l}</Lbl>
          <Lbl x={x} y="170" anchor="middle" size={11} fill={TEAL}>{t}</Lbl>
        </g>
      ))}
      <ellipse cx="200" cy="80" rx="22" ry="15" fill={STEEL} />
      <ellipse cx="196" cy="77" rx="10" ry="5" fill="#E2E4E8" />
      <ellipse cx="330" cy="82" rx="30" ry="22" fill={STEEL} />
      <ellipse cx="330" cy="84" rx="16" ry="10" fill={LIGHT} stroke="#6B7078" strokeWidth="2" />
      <path d="M312 66 L300 50 M348 70 L362 56 M334 104 L340 118" stroke="#6B7078" strokeWidth="2" />
    </svg>
  ),
  bits: (
    <svg viewBox="0 0 400 130" className="w-full" role="img" aria-label="A six-lobed Torx bit compared with a twelve-point triple-square bit">
      <rect width="400" height="130" fill={LIGHT} />
      <g transform="translate(100 56)">
        <circle r="26" fill={INK} />
        {[0, 60, 120, 180, 240, 300].map(a => <circle key={a} cx={24 * Math.cos(a * Math.PI / 180)} cy={24 * Math.sin(a * Math.PI / 180)} r="11" fill={INK} />)}
        {[30, 90, 150, 210, 270, 330].map(a => <circle key={a} cx={30 * Math.cos(a * Math.PI / 180)} cy={30 * Math.sin(a * Math.PI / 180)} r="8" fill={LIGHT} />)}
      </g>
      <Lbl x="100" y="108" anchor="middle" size={13} w={800}>T30 Torx</Lbl>
      <Lbl x="100" y="122" anchor="middle" size={11} fill={TEAL}>6 rounded lobes · pump bolts</Lbl>
      <g transform="translate(300 56)">
        {[0, 30, 60].map(a => <rect key={a} x="-26" y="-26" width="52" height="52" fill={INK} transform={`rotate(${a})`} />)}
      </g>
      <Lbl x="300" y="108" anchor="middle" size={13} w={800}>M8 triple-square (XZN)</Lbl>
      <Lbl x="300" y="122" anchor="middle" size={11} fill={TEAL}>12 sharp points · banjo bolt</Lbl>
      <Lbl x="200" y="60" anchor="middle" size={12} fill={COBALT} w={700}>not the same</Lbl>
    </svg>
  ),
  rsbhero: (
    <svg viewBox="0 0 400 240" className="w-full" role="img" aria-label="View from under the rear of the car: sway bar clamped to the subframe in two brackets, reaching each trailing arm through a short end link">
      <rect width="400" height="240" fill={LIGHT} />
      <rect x="60" y="40" width="280" height="40" rx="4" fill={METAL} stroke={INK} strokeWidth="2" />
      <Lbl x="200" y="65" anchor="middle" fill="#fff" size={12} w={800}>Rear subframe</Lbl>
      <rect x="30" y="60" width="26" height="120" rx="4" fill="#B5B9C0" stroke={INK} strokeWidth="2" />
      <rect x="344" y="60" width="26" height="120" rx="4" fill="#B5B9C0" stroke={INK} strokeWidth="2" />
      <Lbl x="43" y="200" anchor="middle" size={10}>Trailing arm</Lbl><Lbl x="357" y="200" anchor="middle" size={10}>Trailing arm</Lbl>
      <path d="M70 150 L90 150 Q100 150 105 130 L110 100 L290 100 L295 130 Q300 150 310 150 L330 150" fill="none" stroke={COBALT} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="130" y="84" width="34" height="32" rx="3" fill={INK} /><rect x="236" y="84" width="34" height="32" rx="3" fill={INK} />
      <line x1="66" y1="150" x2="50" y2="110" stroke={INK} strokeWidth="6" strokeLinecap="round" /><line x1="334" y1="150" x2="350" y2="110" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <Leader d="M147 122 V160" /><Lbl x="147" y="176" anchor="middle" size={11}>Bracket + bushing</Lbl><Lbl x="147" y="189" anchor="middle" size={10} fill={TEAL}>2 bolts, 10mm triple-square</Lbl>
      <Leader d="M200 100 V60" /><Lbl x="200" y="30" anchor="middle" size={12} w={800} fill={COBALT}>Sway bar</Lbl>
      <Leader d="M58 130 H100" /><Lbl x="104" y="127" size={11}>End link</Lbl><Lbl x="104" y="139" size={10} fill={TEAL}>16mm nut, 6mm stud</Lbl>
      <Lbl x="200" y="225" anchor="middle" size={11} fill={TEAL}>Exhaust runs between the two brackets, which is why the bar has to rotate out</Lbl>
    </svg>
  ),
  endlink: (
    <svg viewBox="0 0 400 200" className="w-full" role="img" aria-label="End link stud held still with a small triple-square bit while a 16mm wrench turns the nut">
      <rect width="400" height="200" fill={LIGHT} />
      <rect x="150" y="20" width="100" height="26" rx="4" fill={COBALT} />
      <Lbl x="200" y="38" anchor="middle" fill="#fff" size={11} w={800}>bar arm</Lbl>
      <rect x="192" y="46" width="16" height="70" fill={STEEL} stroke={INK} strokeWidth="2" />
      <path d="M180 70 h40 l6 10 l-6 10 h-40 l-6 -10 z" fill={METAL} stroke={INK} strokeWidth="2" />
      <rect x="120" y="72" width="60" height="16" rx="3" fill={METAL} stroke={INK} strokeWidth="2" />
      <Lbl x="150" y="60" anchor="middle" size={11} w={700}>16mm wrench</Lbl>
      <path d="M100 120 A 40 40 0 0 0 130 100" fill="none" stroke={COBALT} strokeWidth="2.5" markerEnd="url(#arr3)" />
      <Lbl x="80" y="140" size={11} fill={COBALT} w={700}>this turns</Lbl>
      <rect x="196" y="116" width="8" height="40" fill="#4A4F58" stroke={INK} strokeWidth="1.5" />
      <rect x="190" y="156" width="20" height="24" rx="3" fill={INK} />
      <Lbl x="200" y="196" anchor="middle" size={10} fill="#fff">6mm</Lbl>
      <Leader d="M212 150 H260" /><Lbl x="264" y="147" size={11} w={700}>6mm triple-square</Lbl><Lbl x="264" y="160" size={11} fill={TEAL}>held still, never turned</Lbl>
      <Leader d="M226 80 H260" /><Lbl x="264" y="84" size={11}>end link stud + nut</Lbl>
      <defs><marker id="arr3" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={COBALT} /></marker></defs>
    </svg>
  ),
  setting: (
    <svg viewBox="0 0 400 190" className="w-full" role="img" aria-label="End of an adjustable sway bar with two holes: the forward hole gives a longer lever and softer rate, the rearward hole a shorter lever and stiffer rate">
      <rect width="400" height="190" fill={LIGHT} />
      <path d="M40 60 H200 L300 60" fill="none" stroke={COBALT} strokeWidth="14" strokeLinecap="round" />
      <rect x="230" y="46" width="130" height="28" rx="6" fill={COBALT} />
      <circle cx="270" cy="60" r="7" fill={LIGHT} stroke={INK} strokeWidth="2" /><circle cx="330" cy="60" r="7" fill={LIGHT} stroke={INK} strokeWidth="2" />
      <line x1="130" y1="60" x2="130" y2="150" stroke={METAL} strokeDasharray="4 4" /><Lbl x="130" y="165" anchor="middle" size={10} fill={TEAL}>pivot (bushing)</Lbl>
      <path d="M130 100 H330" fill="none" stroke={INK} strokeWidth="1.5" /><path d="M330 94 v12 M130 94 v12" stroke={INK} strokeWidth="1.5" />
      <Lbl x="230" y="94" anchor="middle" size={11} w={700}>Forward hole · longer lever · softer</Lbl>
      <Lbl x="230" y="114" anchor="middle" size={10} fill={TEAL}>Neuspeed 25mm: about 2× stock</Lbl>
      <path d="M130 135 H270" fill="none" stroke={INK} strokeWidth="1.5" /><path d="M270 129 v12 M130 129 v12" stroke={INK} strokeWidth="1.5" />
      <Lbl x="200" y="129" anchor="middle" size={11} w={700}>Rearward hole · shorter lever · stiffer</Lbl>
      <Lbl x="200" y="150" anchor="middle" size={10} fill={TEAL}>about 2.5× stock</Lbl>
      <Leader d="M270 67 V80" /><Leader d="M330 67 V80" />
      <Lbl x="270" y="30" anchor="middle" size={11} w={800}>soft</Lbl><Lbl x="330" y="30" anchor="middle" size={11} w={800}>stiff</Lbl>
      <Lbl x="360" y="180" anchor="end" size={10} fill={TEAL}>toward the rear of the car →</Lbl>
    </svg>
  ),
};

const Art = ({ id, cap }) => (
  <figure className="my-4 overflow-hidden rounded-sm shadow-sm">
    {ART[id] || <div className="p-4 text-sm text-gray-500">Illustration coming</div>}
    {cap ? <figcaption className="bg-white px-3 py-2 text-sm text-gray-600">{cap}</figcaption> : null}
  </figure>
);

const Video = ({ id, note, title }) => {
  const [on, setOn] = useState(false);
  return (
    <div className="my-4 overflow-hidden rounded-sm bg-white shadow-sm">
      {on ? (
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title || "Video"} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
      ) : (
        <button onClick={() => setOn(true)} className="flex w-full items-center gap-3 p-3 text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-blue-700 text-white"><Play size={22} fill="currentColor" /></span>
          <span className="text-sm"><span className="block font-semibold">{title || "Watch it done"}</span><span className="text-gray-600">{note}</span></span>
        </button>
      )}
    </div>
  );
};

const Fork = ({ b }) => {
  const [i, setI] = useState(0);
  return (
    <div className="my-4 rounded-sm bg-white p-3 shadow-sm">
      <div className="font-semibold mb-2">{b.q}</div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {b.v.map((v, k) => (
          <button key={k} onClick={() => setI(k)} className={`rounded-sm px-3 py-2 text-left ${i===k ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-800"}`}>
            <div className="font-semibold text-sm">{v.label}</div><div className={`text-xs ${i===k?"text-blue-100":"text-gray-500"}`}>{v.when}</div>
          </button>
        ))}
      </div>
      {b.v[i].blocks.map((bb, k) => <Block key={k} b={bb} />)}
    </div>
  );
};

const Block = ({ b }) => {
  switch (b.t) {
    case "text": return <p className="my-3 leading-relaxed text-[17px]">{b.b}</p>;
    case "note": return <p className="my-3 rounded-sm bg-white/70 px-3 py-2 text-[15px] text-gray-700 leading-relaxed">{b.b}</p>;
    case "warn": return <div className="my-3 flex gap-3 rounded-sm bg-yellow-300/40 px-3 py-2 text-[15px] leading-relaxed"><ShieldAlert size={20} className="shrink-0 mt-1" />{b.b}</div>;
    case "torque": return <Torque b={b} />;
    case "ill": return <Art id={b.id} cap={b.cap} />;
    case "embed": return <Video id={b.id} note={b.note} title={b.title} />;
    case "fork": return <Fork b={b} />;
    case "conf": return <div className="my-3"><Dots c={b.c} /></div>;
    default: return null;
  }
};

const Step = ({ s }) => (
  <section id={`step-${s.n}`} className={`relative my-6 rounded-sm ${s.caution ? "bg-white shadow-md" : ""} ${s.caution ? "pl-6" : ""}`}>
    {s.caution ? <div className="hazard absolute left-0 top-0 bottom-0 w-3 rounded-l-sm" aria-hidden /> : null}
    <div className={s.caution ? "p-4 pl-3" : ""}>
      {s.caution ? <div className="inline-block mb-2 rounded-sm bg-yellow-300 px-2 py-0.5 text-xs font-bold">Take your time here</div> : null}
      {s.timeSink ? <div className="inline-block mb-2 rounded-sm bg-gray-800 px-2 py-0.5 text-xs font-bold text-white">Where the hour goes</div> : null}
      <div className="flex items-baseline gap-3">
        <span className="wide font-black text-4xl leading-none text-gray-400 tabular-nums w-10 shrink-0">{s.n}</span>
        <h3 className="font-bold text-xl leading-tight">{s.title}</h3>
      </div>
      <div className="pl-[52px]">{s.blocks.map((b, k) => <Block key={k} b={b} />)}</div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* SCREENS                                                             */
/* ------------------------------------------------------------------ */
const Frame = ({ children, onHome, crumbs, onBack }) => (
  <div className="wb min-h-screen">
    <style>{CSS}</style>
    <div className="mx-auto max-w-[520px] min-h-screen bg-[#E9EBEE]">
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-[#E9EBEE]/95 px-4 py-3 backdrop-blur">
        {onBack ? <button onClick={onBack} className="rounded-sm p-1 -ml-1" aria-label="Back"><ChevronLeft /></button> : null}
        <button onClick={onHome} className="wide font-black text-lg tracking-tight">Wrenchbook</button>
        {crumbs ? <div className="ml-auto truncate text-xs text-gray-500">{crumbs}</div> : null}
      </header>
      <main className="px-4 pb-24">{children}</main>
    </div>
  </div>
);

const TaskCard = ({ t, onOpen }) => (
  <button onClick={() => t.live && onOpen(t)} disabled={!t.live} className={`w-full rounded-sm bg-white p-4 text-left shadow-sm ${t.live ? "" : "opacity-60"}`}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-xs text-gray-500">{t.cat}</div>
        <div className="font-bold text-lg leading-tight">{t.title}</div>
      </div>
      {t.live ? <ChevronRight className="shrink-0 text-blue-700" /> : <span className="shrink-0 rounded-sm bg-gray-200 px-2 py-0.5 text-xs">Coming soon</span>}
    </div>
    <div className="mt-2 flex gap-4 text-sm text-gray-600">
      <span className="flex items-center gap-1"><Clock size={14} />{t.time}</span>
      <span className="flex items-center gap-1"><Gauge size={14} />{t.diff}/5</span>
    </div>
  </button>
);

function HomeScreen({ go, db }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return null;
    return db.tasks.filter(t => t.title.toLowerCase().includes(s) || t.aliases.some(a => a.includes(s)) || (t.group && t.group.includes(s)));
  }, [q]);
  const groups = results ? [...new Set(results.map(r => r.group).filter(Boolean))] : [];
  const isDisambig = results && groups.length === 1 && results.every(r => r.group === groups[0]) && results.length > 1;

  return (
    <>
      <div className="pt-6 pb-4">
        <h1 className="wide font-black text-[34px] leading-[1.02] tracking-tight">What are you fixing today?</h1>
        <p className="mt-2 text-gray-600">Step-by-step guides built from every source we could find, checked against each other.</p>
      </div>
      <label className="flex items-center gap-2 rounded-sm bg-white px-3 py-3 shadow-sm">
        <Search size={20} className="text-gray-500" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Try “cam follower” or “sway bar”" className="w-full bg-transparent text-[17px] outline-none" />
      </label>
      <div className="mt-1 text-xs text-gray-500">Searching guides for 2006 VW GTI 2.0T. Change car below.</div>

      {results ? (
        <div className="mt-5 space-y-3">
          {isDisambig ? <div className="text-gray-700">Which <span className="font-semibold">{groups[0]}</span> do you mean?</div>
            : <div className="text-gray-700">{results.length ? `${results.length} guide${results.length>1?"s":""}` : "Nothing yet for that. Try the part's common name or number."}</div>}
          {results.map(t => <TaskCard key={t.id} t={t} onOpen={() => go({ screen: "guide", gid: t.id })} />)}
        </div>
      ) : (
        <>
          <h2 className="mt-8 mb-3 font-bold text-lg">Browse by make</h2>
          <div className="grid grid-cols-2 gap-2">
            {db.brands.map(b => (
              <button key={b.id} disabled={!b.live} onClick={() => go({ screen: "browse", brand: b })} className={`flex items-center justify-between rounded-sm bg-white px-4 py-4 text-left shadow-sm ${b.live ? "" : "opacity-50"}`}>
                <span className="font-bold text-[17px]">{b.name}</span>{b.live ? <ChevronRight size={18} className="text-blue-700" /> : null}
              </button>
            ))}
          </div>
          <h2 className="mt-8 mb-3 font-bold text-lg">Live now</h2><div className="space-y-2">
          {db.tasks.filter(t => t.live).map(t => <TaskCard key={t.id} t={t} onOpen={() => go({ screen: "guide", gid: t.id })} />)}</div>
        </>
      )}
    </>
  );
}

function Browse({ nav, go, back, db }) {
  const { brand, model, year, pt, cat } = nav;
  const Row = ({ title, sub, live, onClick }) => (
    <button disabled={!live} onClick={onClick} className={`flex w-full items-center justify-between rounded-sm bg-white px-4 py-4 text-left shadow-sm ${live ? "" : "opacity-50"}`}>
      <div><div className="font-bold text-[17px]">{title}</div>{sub ? <div className="text-sm text-gray-500">{sub}</div> : null}</div>
      {live ? <ChevronRight size={18} className="text-blue-700" /> : <span className="rounded-sm bg-gray-200 px-2 py-0.5 text-xs">Soon</span>}
    </button>
  );
  let title, list;
  if (!model) { title = brand.name; list = db.models[brand.id].map(m => <Row key={m.id} title={m.name} live={m.live} onClick={() => go({ ...nav, model: m })} />); }
  else if (!year) { title = `${brand.name} ${model.name}`; list = db.years[model.id].map(y => <Row key={y.year} title={y.year} sub={y.gen} live={y.live} onClick={() => go({ ...nav, year: y })} />); }
  else if (!pt) { title = `${year.year} ${model.name}`; list = db.powertrains[`${model.id}-${year.year}`].map(p => <Row key={p.id} title={`${p.name} · ${p.code}`} sub={p.note} live={p.live} onClick={() => go({ ...nav, pt: p })} />); }
  else if (!cat) { title = `${year.year} ${model.name} ${pt.name}`; list = db.categories.map(c => { const n = db.tasks.filter(t => t.cat === c).length; return <Row key={c} title={c} sub={n ? `${n} guide${n>1?"s":""}` : "Nothing yet"} live={n > 0} onClick={() => go({ ...nav, cat: c })} />; }); }
  else { title = cat; list = db.tasks.filter(t => t.cat === cat).map(t => <TaskCard key={t.id} t={t} onOpen={() => go({ screen: "guide", gid: t.id })} />); }
  const crumbs = [brand?.name, model?.name, year?.year, pt?.name, cat].filter(Boolean).join(" / ");
  return (
    <Frame onHome={() => go({ screen: "home" })} onBack={back} crumbs={crumbs}>
      <h1 className="wide font-black text-3xl tracking-tight pt-4 pb-4">{title}</h1>
      <div className="space-y-2">{list}</div>
    </Frame>
  );
}

function GuideScreen({ go, back, gid, db }) {
  const g = db.guides[gid];
  const [active, setActive] = useState("glance");
  const nav = [["glance","At a glance"],["should","Should you?"],["need","Parts & tools"],["steps","Steps"],["read", g.check.tab],["after","After"],["sources","Sources"]];
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
  const openKit = () => go({ screen: "kit", gid });
  const Glance = ({ label, icon, children, onClick }) => {
    const inner = <>{onClick ? <ChevronRight size={16} className="absolute right-2 top-2 text-blue-700" /> : null}<div className="flex items-center gap-1 text-xs text-gray-500">{icon}{label}</div>{children}</>;
    return onClick
      ? <button onClick={onClick} className="relative rounded-sm bg-white p-3 text-left shadow-sm">{inner}</button>
      : <div className="relative rounded-sm bg-white p-3 shadow-sm">{inner}</div>;
  };

  return (
    <Frame onHome={() => go({ screen: "home" })} onBack={back} crumbs={g.fits}>
      <div className="pt-4">
        <div className="text-sm text-gray-500">{g.category} · {g.fits}</div>
        <h1 className="wide font-black text-[32px] leading-[1.02] tracking-tight mt-1">{g.title}</h1>
      </div>

      <figure className="relative mt-5 mb-1 px-6">
        <Quote size={64} strokeWidth={0} fill="#C9ECEE" className="absolute left-0 -top-3 -scale-x-100 pointer-events-none" style={{ zIndex: 0 }} aria-hidden />
        <blockquote className="relative wide font-bold text-[21px] leading-snug" style={{ color: "#0E494D", zIndex: 1 }}>{g.glance.why}</blockquote>
        <Quote size={64} strokeWidth={0} fill="#C9ECEE" className="absolute right-0 -bottom-4 pointer-events-none" style={{ zIndex: 0 }} aria-hidden />
      </figure>

      <nav className="sticky top-[52px] z-10 -mx-4 mt-5 flex gap-1 overflow-x-auto bg-[#E9EBEE]/95 px-4 py-2 backdrop-blur" aria-label="Contents" style={{ scrollbarWidth: "none" }}>
        {nav.map(([id, l]) => <button key={id} ref={el => (tabRefs.current[id] = el)} onClick={() => jump(id)} aria-current={active===id ? "true" : undefined} className={`shrink-0 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors ${active===id ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}>{l}</button>)}
      </nav>

      <div id="glance" className="scroll-mt-28 mt-4 grid grid-cols-2 gap-2">
        <Glance label="Time" icon={<Clock size={12} />}><div className="wide font-black text-2xl mt-1">{g.glance.timeFirst}</div><div className="text-xs text-gray-500">{g.glance.timeRepeat} once you've done it</div></Glance>
        <Glance label="Difficulty" icon={<Gauge size={12} />}><div className="wide font-black text-2xl mt-1">{g.glance.difficulty}<span className="text-base text-gray-400">/5</span></div><div className="mt-1 flex gap-1">{diffBar}</div></Glance>
        <Glance label="Parts" icon={<ShoppingCart size={12} />} onClick={openKit}><div className="wide font-black text-2xl mt-1">{g.glance.cost}</div><div className="text-xs text-blue-700 font-semibold">Parts, tools & where to buy</div></Glance>
        <Glance label="Watch out for"><div className="font-semibold mt-1 leading-snug">{g.glance.risk}</div></Glance>
      </div>
      <p className="mt-2 text-sm text-gray-600">{g.glance.note}</p>
      <Art id={g.kind === "upgrade" ? "rsbhero" : "hero"} cap={g.heroCap} />
      <Video id={g.embeds[0].id} title="Watch the whole job" note={g.embeds[0].note} />

      <H2 id="should">Should you do this?</H2>
      <div className="font-semibold">Yes, if any of these are true</div>
      <ul className="mt-2 space-y-1">{g.should.yesIf.map((s, i) => <li key={i} className="flex gap-2"><span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />{s}</li>)}</ul>
      {g.should.codes.length ? <div className="mt-3 flex flex-wrap gap-1">{g.should.codes.map(c => <span key={c} className="rounded-sm bg-gray-900 px-2 py-0.5 text-sm font-mono text-white">{c}</span>)}</div> : null}
      {g.should.notes.map((n, i) => <p key={i} className="mt-3 rounded-sm bg-white/70 px-3 py-2 text-[15px] leading-relaxed">{n}</p>)}
      <div className="mt-3"><Dots c={g.should.confidence} /></div>

      <H2 id="need">What you need</H2>
      <div className="rounded-sm bg-white shadow-sm divide-y divide-gray-200">
        {g.parts.map((p, i) => <div key={i} className="flex justify-between gap-3 p-3"><div><div className="font-semibold">{p.name}</div><div className="text-sm text-gray-600">{p.note}</div></div><div className="shrink-0 text-right text-sm text-gray-700"><div className="font-mono">{p.pn}</div><div className="text-gray-500">{p.price}</div></div></div>)}
      </div>
      <div className="mt-3 rounded-sm bg-white shadow-sm divide-y divide-gray-200">
        {g.tools.map((t, i) => <div key={i} className="flex gap-3 p-3"><Wrench size={18} className="mt-0.5 shrink-0 text-gray-500" /><div className="flex-1"><div className="font-semibold">{t.name}</div>{t.note ? <div className="text-sm text-gray-600">{t.note}</div> : null}</div><div className="shrink-0 text-sm text-gray-500">{t.price}</div></div>)}
      </div>
      {gid === "cam-follower" ? <Art id="bits" cap={'Both fit a ¼" drive. The forums are full of people who bought the wrong one.'} /> : null}
      <button onClick={openKit} className="mt-3 flex w-full items-center justify-between rounded-sm bg-blue-700 px-4 py-3 text-left font-semibold text-white"><span className="flex items-center gap-2"><ShoppingCart size={18} />Full shopping list & where to buy</span><ChevronRight size={18} /></button>
      <h3 className="mt-6 font-bold text-lg">Before you start</h3>
      <ul className="mt-2 space-y-2">{g.before.map((s, i) => <li key={i} className="flex gap-2"><span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />{s}</li>)}</ul>

      <H2 id="steps">Steps</H2>
      {g.steps.map(s => <Step key={s.n} s={s} />)}

      <H2 id="read">{g.check.title}</H2>
      <Art id={g.check.illId} cap={g.check.illCap} />
      <div className="space-y-2">
        {g.check.rows.map((r, i) => (
          <div key={i} className="rounded-sm bg-white p-3 shadow-sm">
            <div className="flex items-baseline gap-2"><span className="wide font-black text-2xl text-gray-400">{"ABC"[i]}</span><div className="font-bold">{r.see}</div></div>
            <div className="mt-1 text-[15px] text-gray-700">{r.means}</div>
            <div className="mt-2 rounded-sm bg-blue-50 px-3 py-2 text-[15px]"><span className="font-semibold">Do this: </span>{r.do}</div>
          </div>
        ))}
      </div>
      <div className="mt-3"><Dots c={g.check.c} /></div>

      <H2 id="after">Afterwards</H2>
      <ul className="space-y-2">{g.aftercare.map((s, i) => <li key={i} className="flex gap-2"><span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />{s}</li>)}</ul>
      {gid === "cam-follower" ? <div className="mt-3"><Dots c={C.interval} /></div> : null}

      <H2 id="sources">Where sources disagree</H2>
      <div className="space-y-2">
        {g.disagreements.map((d, i) => (
          <div key={i} className="rounded-sm bg-white p-3 shadow-sm">
            <div className="font-bold">{d.topic}</div>
            <div className="mt-1 text-[15px] text-gray-600">{d.pos}</div>
            <div className="mt-1 text-[15px]"><span className="font-semibold text-blue-700">Our call: </span>{d.call}</div>
          </div>
        ))}
      </div>
      <h3 className="mt-6 font-bold text-lg">Sources</h3>
      <ul className="mt-2 space-y-1 text-[15px] text-gray-700">{g.sources.map((s, i) => <li key={i}>{s}</li>)}</ul>
      <div className="mt-6 text-sm text-gray-500">{g.alsoFits}</div>
    </Frame>
  );
}

function KitScreen({ go, back, gid, db }) {
  const g = db.guides[gid];
  const [have, setHave] = useState({});
  const toggle = k => setHave(h => ({ ...h, [k]: !h[k] }));
  const Row = ({ k, name, note, pn, price, links }) => (
    <div className={`p-3 ${have[k] ? "opacity-50" : ""}`}>
      <div className="flex items-start gap-3">
        <button onClick={() => toggle(k)} aria-pressed={!!have[k]} aria-label={have[k] ? "Mark as needed" : "Mark as already have"} className={`mt-0.5 h-6 w-6 shrink-0 rounded-sm border-2 ${have[k] ? "border-blue-700 bg-blue-700" : "border-gray-400 bg-white"}`}>{have[k] ? <span className="block text-center text-white text-sm leading-5">✓</span> : null}</button>
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
      <div className="rounded-sm bg-white shadow-sm divide-y divide-gray-200">
        {g.parts.map((p, i) => <Row key={i} k={`p${i}`} name={p.name} note={p.note} pn={p.pn} price={p.price} links={p.links} />)}
      </div>
      <h2 className="mt-6 mb-2 font-bold text-lg">Tools</h2>
      <div className="rounded-sm bg-white shadow-sm divide-y divide-gray-200">
        {g.tools.map((t, i) => <Row key={i} k={`t${i}`} name={t.name} note={t.note} price={t.price} />)}
      </div>
      <p className="mt-3 text-sm text-gray-500">Tool links arrive once we've picked retail partners. Part links go to the retailers whose guides we drew from.</p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
export default function App() {
  const [db, setDb] = useState(null);
  const [err, setErr] = useState(null);
  const [stack, setStack] = useState([{ screen: "home" }]);
  const nav = stack[stack.length - 1];
  const go = n => setStack(s => [...s, n]);
  const back = () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s));
  useEffect(() => { window.scrollTo(0, 0); }, [nav]);
  useEffect(() => { loadAll().then(setDb).catch(e => setErr(e.message || String(e))); }, []);

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
    <Frame onHome={() => {}}>
      <div className="pt-10 text-gray-500">Loading guides…</div>
    </Frame>
  );

  if (nav.screen === "guide") return <GuideScreen go={go} back={back} gid={nav.gid} db={db} />;
  if (nav.screen === "kit") return <KitScreen go={go} back={back} gid={nav.gid} db={db} />;
  if (nav.screen === "browse") return <Browse nav={nav} go={go} back={back} db={db} />;
  return (
    <Frame onHome={() => setStack([{ screen: "home" }])}>
      <HomeScreen go={go} db={db} />
    </Frame>
  );
}
