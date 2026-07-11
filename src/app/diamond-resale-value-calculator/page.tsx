import type { Metadata } from "next";
import ResaleCalculator from "@/components/ResaleCalculator";

const resaleTitle = "Diamond Resale Value Calculator — ROI & Resale Projections";
const resaleDesc = "Estimate your diamond's 5-year and 10-year resale value and ROI. Compare natural vs lab-grown resale retention. Free tool by Farzana Hasan, GIA Expert.";

export const metadata: Metadata = {
  title: resaleTitle,
  description: resaleDesc,
  alternates: { canonical: "https://diamondcritics.com/diamond-resale-value-calculator" },
  openGraph: {
    title: `${resaleTitle} | Diamond Critics`,
    description: resaleDesc,
    url: "https://diamondcritics.com/diamond-resale-value-calculator",
    type: "website",
    siteName: "Diamond Critics",
    images: [{ url: "https://diamondcritics.com/images/diamondcritics-og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: resaleTitle, description: resaleDesc },
};

export default function DiamondResaleCalculatorPage() {
  return (
    <>
      {/* Dark hero */}
      <div style={{ background: "#141414", padding: "4rem 0 3.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>
            Investment-Grade Diamond Analytics
          </p>
          <h1 style={{ fontFamily: "var(--heading)", fontWeight: 300, color: "#fff", fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "700px", marginBottom: "1.25rem" }}>
            Diamond Resale Value &amp; ROI Calculator
          </h1>
          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: "560px", marginBottom: "2rem" }}>
            See your diamond&apos;s projected 5-year and 10-year resale value. Compare natural vs lab-grown retention rates with GIA-backed projections by Farzana Hasan.
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
        <ResaleCalculator />
      </div>
    </>
  );
}
