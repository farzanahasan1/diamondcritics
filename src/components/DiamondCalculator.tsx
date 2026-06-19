"use client";
import { useState } from "react";

const DATA = {
  shapes: { round: 1.0, princess: 0.75, cushion: 0.78, oval: 0.85, emerald: 0.82, pear: 0.83, asscher: 0.80, heart: 0.70, radiant: 0.72, marquise: 0.81 },
  cuts: { excellent: 1.0, vgood: 0.88, good: 0.74 },
  colors: { D: 1.0, E: 0.93, F: 0.86, G: 0.78, H: 0.71, I: 0.64, J: 0.55 },
  clarities: { IF: 1.0, VVS1: 0.91, VVS2: 0.83, VS1: 0.75, VS2: 0.67, SI1: 0.56 },
  base: 14800,
};

const CUT_LABELS: Record<string, string> = { excellent: "Ideal", vgood: "Very+Good", good: "Good" };

interface ShapeDef { key: string; label: string }

const SHAPES: ShapeDef[] = [
  { key: "round", label: "Round" },
  { key: "princess", label: "Princess" },
  { key: "cushion", label: "Cushion" },
  { key: "oval", label: "Oval" },
  { key: "emerald", label: "Emerald" },
  { key: "pear", label: "Pear" },
  { key: "asscher", label: "Asscher" },
  { key: "heart", label: "Heart" },
  { key: "radiant", label: "Radiant" },
  { key: "marquise", label: "Marquise" },
];

function ShapeIcon({ shape, active }: { shape: string; active: boolean }) {
  const c = active ? "#111" : "#999";
  const w = "0.6";
  switch (shape) {
    case "round": return <svg viewBox="0 0 21 20" fill="none" width="32" height="32"><circle cx="10.5" cy="10" r="7.5" stroke={c} strokeWidth={w}/></svg>;
    case "princess": return <svg viewBox="0 0 21 20" fill="none" width="32" height="32"><rect x="3" y="2.5" width="15" height="15" stroke={c} strokeWidth={w}/></svg>;
    case "cushion": return <svg viewBox="0 0 21 20" fill="none" width="32" height="32"><rect x="3" y="2.5" width="15" height="15" rx="4" stroke={c} strokeWidth={w}/></svg>;
    case "oval": return <svg viewBox="0 0 21 20" fill="none" width="32" height="32"><ellipse cx="10.5" cy="10" rx="5.5" ry="8" stroke={c} strokeWidth={w}/></svg>;
    case "emerald": return <svg viewBox="0 0 21 20" fill="none" width="32" height="32"><path d="M6.5 2.5h8l2.5 2.5v10l-2.5 2.5h-8L4 15V5l2.5-2.5Z" stroke={c} strokeWidth={w}/></svg>;
    case "pear": return <svg viewBox="0 0 21 20" fill="none" width="32" height="32"><path d="M10.5 18c-3 0-5-2.5-5-5.5 0-2.5 1.5-5 3-7l2-3.5 2 3.5c1.5 2 3 4.5 3 7 0 3-2 5.5-5 5.5Z" stroke={c} strokeWidth={w}/></svg>;
    case "asscher": return <svg viewBox="0 0 21 20" fill="none" width="32" height="32"><path d="M7 2.5h7l3 3v9l-3 3H7l-3-3v-9l3-3Z" stroke={c} strokeWidth={w}/></svg>;
    case "heart": return <svg viewBox="0 0 21 20" fill="none" width="32" height="32"><path d="M10.5 16.5S3 11 3 6.5a4 4 0 0 1 7.5-1.9A4 4 0 0 1 18 6.5C18 11 10.5 16.5 10.5 16.5Z" stroke={c} strokeWidth={w}/></svg>;
    case "radiant": return <svg viewBox="0 0 21 20" fill="none" width="32" height="32"><path d="M7 2.5h7l2.5 2.5v10L14 17.5H7L4.5 15V5L7 2.5Z" stroke={c} strokeWidth={w}/></svg>;
    case "marquise": return <svg viewBox="0 0 21 20" fill="none" width="32" height="32"><path d="M10.5 2 C7 5 3 7.5 3 10 3 12.5 7 15 10.5 18 14 15 18 12.5 18 10 18 7.5 14 5 10.5 2Z" stroke={c} strokeWidth={w}/></svg>;
    default: return null;
  }
}

interface Result {
  price: number;
  advice: string;
  link: string;
}

export default function DiamondCalculator() {
  const [origin, setOrigin] = useState<"natural" | "lab">("natural");
  const [shape, setShape] = useState("round");
  const [carat, setCarat] = useState(1.0);
  const [cut, setCut] = useState("excellent");
  const [color, setColor] = useState("G");
  const [clarity, setClarity] = useState("VS1");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    let total = DATA.base * Math.pow(carat, 1.63);
    total *= DATA.shapes[shape as keyof typeof DATA.shapes];
    total *= DATA.cuts[cut as keyof typeof DATA.cuts];
    total *= DATA.colors[color as keyof typeof DATA.colors];
    total *= DATA.clarities[clarity as keyof typeof DATA.clarities];
    if (origin === "lab") total *= 0.12;

    const advice = cut !== "excellent"
      ? "Expert Tip: Cut is the engine of sparkle. We recommend Excellent/Ideal for maximum fire and resale value."
      : "Technical Position: Market Balanced. These specs represent excellent value for eye-clean light performance.";

    const base = origin === "lab"
      ? "https://www.bluenile.com/diamond-search/lab-grown-diamond-search"
      : "https://www.bluenile.com/diamond-search";
    const minCarat = Math.max(0.3, carat - 0.05).toFixed(2);
    const maxCarat = (carat + 0.05).toFixed(2);
    const link = `${base}?CaratFrom=${minCarat}&CaratTo=${maxCarat}&Color=${color}&Cut=${CUT_LABELS[cut]}&Shape=${shape}-cut&Clarity=${clarity}&a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational`;

    setResult({ price: Math.round(total), advice, link });
    setTimeout(() => document.getElementById("calc-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  }

  const sLabel: React.CSSProperties = { display: "block", fontFamily: "var(--body)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#888", marginTop: "2.5rem", marginBottom: "1rem" };
  const btnOn: React.CSSProperties = { background: "#141414", color: "#fff", border: "1px solid #141414" };
  const btnOff: React.CSSProperties = { background: "#fff", color: "#444", border: "1px solid #e0e0e0" };
  const btn: React.CSSProperties = { cursor: "pointer", fontFamily: "var(--body)", fontSize: "0.82rem", fontWeight: 500, padding: "10px 22px", transition: "all 0.2s" };

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", padding: "3rem 1.5rem 5rem", fontFamily: "var(--body)", textAlign: "center" }}>

      <span style={sLabel}>1. Diamond Origin</span>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {(["natural", "lab"] as const).map((o) => (
          <button key={o} onClick={() => setOrigin(o)} style={{ ...btn, ...(origin === o ? btnOn : btnOff) }}>
            {o === "natural" ? "Natural Diamond" : "Lab Grown Diamond"}
          </button>
        ))}
      </div>

      <span style={sLabel}>2. Shape: <span style={{ color: "#111", textTransform: "capitalize" }}>{shape}</span></span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", maxWidth: "520px", margin: "0 auto" }}>
        {SHAPES.map((s) => (
          <button key={s.key} onClick={() => setShape(s.key)} style={{
            border: shape === s.key ? "1.5px solid #141414" : "1px solid #e0e0e0",
            background: shape === s.key ? "#f8f8f8" : "#fff",
            padding: "12px 8px 8px", cursor: "pointer", transition: "all 0.2s",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          }}>
            <ShapeIcon shape={s.key} active={shape === s.key} />
            <span style={{ fontFamily: "var(--body)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: shape === s.key ? "#111" : "#aaa" }}>{s.label}</span>
          </button>
        ))}
      </div>

      <span style={sLabel}>3. Carat Weight</span>
      <div style={{ maxWidth: "520px", margin: "0 auto", background: "#fafafa", padding: "2rem", border: "1px solid #ebebeb" }}>
        <input type="range" min="0.3" max="5.0" step="0.01" value={carat}
          onChange={(e) => setCarat(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: "#141414", cursor: "pointer" }} />
        <span style={{ fontFamily: "var(--heading)", fontSize: "2.5rem", fontWeight: 300, display: "block", marginTop: "1rem", color: "#111" }}>
          {carat.toFixed(2)} ct
        </span>
      </div>

      <span style={sLabel}>4. Cut Quality</span>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
        {[["excellent", "Excellent / Ideal"], ["vgood", "Very Good"], ["good", "Good"]].map(([val, label]) => (
          <button key={val} onClick={() => setCut(val)} style={{ ...btn, ...(cut === val ? btnOn : btnOff) }}>{label}</button>
        ))}
      </div>

      <span style={sLabel}>5. Color Grade</span>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
        {["D", "E", "F", "G", "H", "I", "J"].map((c) => (
          <button key={c} onClick={() => setColor(c)} style={{ ...btn, padding: "10px 18px", fontWeight: 600, ...(color === c ? btnOn : btnOff) }}>{c}</button>
        ))}
      </div>

      <span style={sLabel}>6. Clarity Grade</span>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
        {["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1"].map((c) => (
          <button key={c} onClick={() => setClarity(c)} style={{ ...btn, padding: "10px 18px", fontWeight: 600, ...(clarity === c ? btnOn : btnOff) }}>{c}</button>
        ))}
      </div>

      <button onClick={calculate} style={{ display: "block", width: "100%", maxWidth: "400px", margin: "3rem auto 0", background: "#141414", color: "#fff", fontFamily: "var(--heading)", fontWeight: 300, fontSize: "1.2rem", letterSpacing: "0.05em", padding: "22px", border: "none", cursor: "pointer" }}>
        Calculate Market Value
      </button>

      {result && (
        <div id="calc-result" style={{ marginTop: "4rem", padding: "3.5rem 2.5rem", border: "1px solid #141414", background: "#fff", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "0.75rem" }}>Fair Market Estimate</p>
          <p style={{ fontFamily: "var(--heading)", fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 300, color: "#111", lineHeight: 1, marginBottom: "2rem" }}>
            ${result.price.toLocaleString()}
          </p>
          <div style={{ background: "#141414", padding: "2rem 2.5rem", textAlign: "left", marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>● Farzana&apos;s Insight</p>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: 0 }}>{result.advice}</p>
          </div>
          <a href={result.link} target="_blank" rel="noopener noreferrer"
            style={{ display: "block", padding: "18px", background: "#141414", color: "#fff", fontFamily: "var(--body)", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>
            Search Matching Diamonds on Blue Nile →
          </a>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.7rem", color: "#bbb", marginTop: "10px" }}>Affiliate link — no extra cost to you</p>
        </div>
      )}
    </div>
  );
}
