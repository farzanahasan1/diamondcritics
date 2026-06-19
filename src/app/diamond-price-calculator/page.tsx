import type { Metadata } from "next";
import DiamondCalculator from "@/components/DiamondCalculator";

export const metadata: Metadata = {
  title: "Diamond Price Calculator 2026 — Instant Market Value Estimate",
  description: "Calculate the fair market value of any diamond by shape, carat, cut, color, and clarity. GIA-backed methodology by Farzana Hasan, Diamond Critics.",
  alternates: { canonical: "https://diamondcritics.com/diamond-price-calculator" },
  openGraph: {
    title: "Diamond Price Calculator 2026",
    description: "Get an instant fair market estimate for any diamond. Free tool by Farzana Hasan, GIA Expert.",
    url: "https://diamondcritics.com/diamond-price-calculator",
    type: "website",
  },
};

export default function DiamondPriceCalculatorPage() {
  return (
    <>
      {/* Dark hero */}
      <div style={{ background: "#141414", padding: "4rem 0 3.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>
            Professional Diamond Analytics
          </p>
          <h1 style={{ fontFamily: "var(--heading)", fontWeight: 300, color: "#fff", fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "700px", marginBottom: "1.25rem" }}>
            Diamond Price Calculator
          </h1>
          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: "560px", marginBottom: "2rem" }}>
            Enter your diamond specifications to get an instant fair market value estimate. Built on GIA-certified pricing data by Farzana Hasan.
          </p>
          <div style={{ borderTop: "1px solid #333", paddingTop: "1.5rem", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--body)", fontSize: "0.8rem", fontWeight: 600, color: "#fff", flexShrink: 0 }}>F</div>
            <div>
              <p style={{ fontFamily: "var(--heading)", fontSize: "0.9rem", fontWeight: 300, color: "#fff" }}>Farzana Hasan</p>
              <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>GIA-Certified Diamond Expert · DiamondCritics.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div style={{ background: "#fff" }}>
        <DiamondCalculator />
      </div>
    </>
  );
}
