import type { Metadata } from "next";
import Link from "next/link";
import DiamondCalculator from "@/components/DiamondCalculator";

const TITLE = "Diamond Price Calculator — Get Your True Market Value in Seconds";
const DESC =
  "Calculate the fair market value of any diamond by shape, carat, cut, color, and clarity. Free tool built on GIA wholesale benchmarks by Farzana Hasan, Diamond Critics.";
const URL = "https://diamondcritics.com/diamond-price-calculator";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: URL },
  openGraph: {
    title: `${TITLE} | Diamond Critics`,
    description: DESC,
    url: URL,
    type: "website",
    siteName: "Diamond Critics",
    images: [
      {
        url: "https://diamondcritics.com/images/diamond-price-calculator-tool.jpg",
        width: 1200,
        height: 630,
        alt: "Diamond price calculator tool — fair market value estimator by Diamond Critics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["https://diamondcritics.com/images/diamond-price-calculator-tool.jpg"],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${URL}#tool`,
      "name": "Diamond Price Calculator",
      "url": URL,
      "description":
        "Free diamond price calculator that estimates fair market value for any natural or lab-grown diamond by shape, carat weight, cut, color, and clarity.",
      "applicationCategory": "FinanceApplication",
      "browserRequirements": "Requires JavaScript",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "featureList": [
        "Natural diamond pricing",
        "Lab-grown diamond pricing",
        "10 diamond shapes",
        "4Cs calibration (cut, color, clarity, carat)",
        "GIA wholesale benchmark methodology",
        "Blue Nile inventory match",
      ],
      "author": {
        "@type": "Person",
        "name": "Farzana Hasan",
        "url": "https://diamondcritics.com/about-farzana",
        "jobTitle": "GIA-Certified Diamond Expert",
      },
      "datePublished": "2024-06-01",
      "dateModified": "2026-11-12",
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How accurate is this diamond price calculator?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Our diamond price calculator uses a wholesale benchmark algorithm calibrated against GIA-certified inventory and global market data. It provides an estimate within 5–7% of current institutional rates. Factors like Hearts & Arrows symmetry or specific GIA Triple Excellent sub-metrics can influence the final price beyond the calculator's output.",
          },
        },
        {
          "@type": "Question",
          "name": "Why does the diamond price per carat jump at 1.00ct?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Diamond pricing follows an exponential scarcity curve. A 1.00ct diamond is significantly more desirable than a 0.99ct stone in the wholesale market, creating a price cliff where the rate-per-carat increases sharply. This psychological threshold exists at 0.50ct, 1.00ct, 1.50ct, and 2.00ct. Diamonds weighing 0.90–0.96ct often trade at a 20–30% discount for nearly identical visual size.",
          },
        },
        {
          "@type": "Question",
          "name": "Does the calculator include retail markups?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. The Diamond Critics calculator reveals fair market value based on wholesale benchmarks. Standard luxury retailers add a 30–100% markup on top of this figure. The gap between calculator price and retail price represents the retailer's overhead, branding, and margin.",
          },
        },
        {
          "@type": "Question",
          "name": "Why are lab-grown diamond prices so much lower than natural?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Lab-grown diamonds are priced on the cost of energy and CVD/HPHT manufacturing technology. As production scales up globally, the manufacturing benchmark continues to adjust downward. Natural diamonds carry a geological scarcity premium that manufactured stones cannot replicate. The price gap between natural and lab-grown diamonds is at an all-time high, with lab-grown trading at 85–92% below equivalent natural grades.",
          },
        },
        {
          "@type": "Question",
          "name": "Why are Round Brilliant diamonds more expensive than Cushion or Oval?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Round Brilliants require the most rough diamond to be sacrificed during cutting — nearly 60% of the original crystal is lost to achieve the 58-facet ideal. Fancy shapes like Cushion or Oval preserve more rough material, allowing a lower rate-per-carat. Oval diamonds in particular offer excellent visual size-per-dollar because they appear 10–15% larger than a Round of equal carat weight.",
          },
        },
        {
          "@type": "Question",
          "name": "Does the calculator account for fluorescence?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "The primary calculator focuses on the 4Cs. However, fluorescence is a real price modifier: Strong Blue fluorescence in D–F color diamonds typically causes a 10–15% price discount due to potential haziness. In I–J color stones, Medium Blue fluorescence can increase apparent whiteness and actually be an advantage.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I use this for insurance appraisal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "The calculator provides a replacement value benchmark for research purposes. An official insurance appraisal requires physical inspection by a certified gemologist who verifies the specific stone's light performance, integrity, and proportions. Use our tool to verify your appraiser's replacement value is reasonable.",
          },
        },
        {
          "@type": "Question",
          "name": "How often are the diamond prices updated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "The Diamond Critics algorithm is updated monthly to reflect shifts in the Rapaport Price List and global rough diamond auction results. Lab-grown pricing is monitored more frequently due to rapid production-cost changes.",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "@id": `${URL}#howto`,
      "name": "How to Calculate Diamond Price Using the Diamond Critics Tool",
      "description":
        "Step-by-step guide to getting an accurate fair market value estimate for any diamond.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Select Origin: Natural or Lab-Grown",
          "text": "Choose Natural for a mined geological diamond or Lab-Grown for a CVD/HPHT manufactured diamond. This is the single biggest price driver — natural diamonds carry a scarcity premium that lab-grown cannot match.",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Choose Diamond Shape",
          "text": "Select from 10 shapes: Round, Princess, Cushion, Oval, Emerald, Pear, Asscher, Heart, Radiant, or Marquise. Round Brilliant commands the highest rate-per-carat; fancy shapes offer better value-per-millimeter.",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Set Carat Weight",
          "text": "Use the slider to set exact carat weight. Watch for exponential price jumps at magic numbers: 0.50ct, 1.00ct, 1.50ct, and 2.00ct. Buying at 0.90ct instead of 1.00ct saves 20–30% for nearly identical visual size.",
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Calibrate the 4Cs",
          "text": "Enter the exact grades from your GIA certificate: Cut (Excellent/Very Good/Good), Color (D through J), Clarity (IF through SI1). Use the calculator to find the value sweet spot where beauty and price intersect for your budget.",
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://diamondcritics.com",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Diamond Price Calculator",
          "item": URL,
        },
      ],
    },
  ],
};

// ─── Shared style tokens ───────────────────────────────────────────────────────
const prose = { maxWidth: "860px", margin: "0 auto", padding: "0 2rem" };
const h2Style: React.CSSProperties = {
  fontFamily: "var(--body)",
  fontSize: "clamp(1.35rem, 2.5vw, 1.65rem)",
  fontWeight: 700,
  color: "#111",
  letterSpacing: "-0.02em",
  marginBottom: "1rem",
  marginTop: "2.5rem",
};
const h3Style: React.CSSProperties = {
  fontFamily: "var(--body)",
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "#111",
  marginBottom: "0.6rem",
  marginTop: "1.75rem",
};
const pStyle: React.CSSProperties = {
  fontFamily: "var(--body)",
  fontSize: "1rem",
  color: "#333",
  lineHeight: 1.8,
  marginBottom: "1rem",
};
const quoteStyle: React.CSSProperties = {
  borderLeft: "3px solid var(--gold)",
  padding: "1rem 1.5rem",
  margin: "2rem 0",
  background: "#fafaf8",
};

export default function DiamondPriceCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Hero ── */}
      <div style={{ background: "#141414", padding: "4rem 0 3.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>
            Free Diamond Analytics Tool
          </p>
          <h1 style={{ fontFamily: "var(--heading)", fontWeight: 300, color: "#fff", fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "700px", marginBottom: "1.25rem" }}>
            Diamond Price Calculator
          </h1>
          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: "560px", marginBottom: "2rem" }}>
            Enter any combination of shape, carat, cut, color, and clarity to get a GIA-backed wholesale benchmark price — instantly. No retailer markup. Just the real number.
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

      {/* ── Calculator ── */}
      <div style={{ background: "#fff" }}>
        <DiamondCalculator />
      </div>

      {/* ── Content ── */}
      <div style={{ background: "#fff", padding: "3.5rem 0 5rem" }}>
        <div style={prose}>

          {/* TL;DR */}
          <div style={{ background: "#fafaf8", border: "1px solid #e8e4dc", borderTop: "3px solid var(--gold)", padding: "1.5rem 1.75rem", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
              60-Second Summary
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "1rem", fontWeight: 700, color: "#111", marginBottom: "0.75rem" }}>
              What this calculator tells you — and what to do next
            </p>
            <ul style={{ fontFamily: "var(--body)", fontSize: "0.95rem", color: "#333", lineHeight: 1.75, paddingLeft: "1.25rem" }}>
              <li>Your result is the <strong>wholesale benchmark</strong> — what a retailer pays for the stone. Add 30–100% for typical retail markup.</li>
              <li>The single biggest lever: <strong>Natural vs Lab-Grown</strong>. Lab diamonds trade at 85–92% below equivalent natural grades right now.</li>
              <li>Stay just under magic numbers (0.90ct instead of 1.00ct) to save 20–30% for the same visual size.</li>
              <li><strong>G color + VS2 clarity + Excellent cut</strong> is the value sweet spot for most buyers — eye-clean with maximum light return.</li>
              <li>After you calculate, search <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>certified inventory</a> to see which stones are priced at or below your benchmark.</li>
            </ul>
          </div>

          {/* How to Use */}
          <h2 style={h2Style}>How to Use the Diamond Price Calculator</h2>
          <p style={pStyle}>
            Getting a reliable price estimate takes under 60 seconds. The key is using the exact grades from a <strong>GIA or AGS grading report</strong> — not the retailer&apos;s verbal description. Here is the professional workflow.
          </p>

          <h3 style={h3Style}>Step 1 — Set Origin: Natural or Lab-Grown</h3>
          <p style={pStyle}>
            This is the single most important variable. Natural diamonds carry a geological scarcity premium that no manufactured stone can replicate. As of the current market cycle, natural diamonds are priced as finite geological assets. Lab-grown diamonds are priced on energy and CVD/HPHT technology costs. The price gap between the two is at a historic high. For a full financial breakdown, read our guide on <Link href="/lab-grown-vs-natural-diamond-price" style={{ color: "var(--gold)" }}>lab-grown vs natural diamond prices</Link>.
          </p>

          <h3 style={h3Style}>Step 2 — Choose Your Shape</h3>
          <p style={pStyle}>
            Shape affects both the visual spread and the rate-per-carat. <Link href="/round-cut-diamond" style={{ color: "var(--gold)" }}>Round Brilliant</Link> is the most expensive per carat because cutting it wastes the most rough diamond. <Link href="/oval-cut-diamond" style={{ color: "var(--gold)" }}>Oval</Link> and <Link href="/marquise-cut-diamond" style={{ color: "var(--gold)" }}>Marquise</Link> cut diamonds appear 10–20% larger than a Round of the same carat weight, giving excellent visual impact for the price.
          </p>
          <p style={pStyle}>
            Step cuts like <Link href="/emerald-cut-diamond" style={{ color: "var(--gold)" }}>Emerald</Link> and <Link href="/asscher-cut-diamond" style={{ color: "var(--gold)" }}>Asscher</Link> demand higher clarity grades (VS1 or above) because their open facets act like windows — inclusions are far more visible than in a <Link href="/cushion-cut-diamond" style={{ color: "var(--gold)" }}>Cushion</Link> or <Link href="/radiant-cut-diamond" style={{ color: "var(--gold)" }}>Radiant</Link> that hides clarity with crushed-ice scintillation.
          </p>

          <h3 style={h3Style}>Step 3 — Dial in Carat Weight</h3>
          <p style={pStyle}>
            Move the slider and watch how price changes at the magic numbers. The <strong>Scarcity Power Principle</strong> governs carat pricing: as diamonds grow larger, gem-quality rough becomes exponentially rarer. Our calculator uses a 1.63x scarcity multiplier. Moving from 1.00ct to 2.00ct doesn&apos;t double the price — it triples or quadruples it. See our <Link href="/diamond-size-chart" style={{ color: "var(--gold)" }}>diamond size chart</Link> to understand how carat weight translates to millimeter spread across different shapes.
          </p>

          <h3 style={h3Style}>Step 4 — Calibrate the 4Cs</h3>
          <p style={pStyle}>
            Enter the exact grades from your GIA certificate. Our engine rewards the value sweet spots — combinations where visual beauty exceeds the certificate price. For a deep education on how each grade affects both beauty and market value, our <Link href="/diamond-4cs" style={{ color: "var(--gold)" }}>Diamond 4Cs guide</Link> covers every variable with current data. The <Link href="/diamond-cut-guide" style={{ color: "var(--gold)" }}>cut guide</Link> is especially important: a D-IF diamond looks flat if the cut is poor.
          </p>

          <blockquote style={quoteStyle}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.95rem", color: "#333", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              &ldquo;The secret to a professional audit is understanding the Paper vs Eye gap. A diamond price calculator gives you the market truth on paper, but my goal is to help you find the stone that out-performs its price tag in person — the ones where the light performance makes the number feel irrelevant.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600 }}>
              Farzana Hasan, Lead Diamond Critic
            </p>
          </blockquote>

          {/* 4Cs Price Impact Table */}
          <h2 style={h2Style}>The 4Cs Price Impact: What Each Variable Costs You</h2>
          <p style={pStyle}>
            Not all grading variables carry equal financial weight. Here is exactly how much each factor moves the needle on a 1.00ct natural round diamond, plus the smart buyer&apos;s verdict on each.
          </p>

          <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--body)", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#111", color: "#fff" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>4C Variable</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Price Range Impact</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Top Grade Premium</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>What This Means for You</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Cut (Excellent → Good)", "~26% price drop", "Excellent = 100% baseline", "Never compromise on cut. A poorly cut D-IF looks dull. Buy Excellent always."],
                  ["Color (D → J)", "~45% price range", "D = 100%, J = 55%", "G–H is the sweet spot. Looks colorless in white gold, saves 22–29% vs D."],
                  ["Clarity (IF → SI1)", "~44% price range", "IF = 100%, SI1 = 56%", "VS2 is eye-clean. No need to pay the IF museum-grade premium for a wearable ring."],
                  ["Carat Weight (0.5 → 2.0ct)", "400%+ price range", "Exponential at magic numbers", "Stay under magic numbers: 0.90ct instead of 1.00ct saves 20–30% for the same visual spread."],
                ].map(([v, r, t, w], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fafaf8" : "#fff", borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111" }}>{v}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{r}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{t}</td>
                    <td style={{ padding: "10px 14px", color: "#333" }}>{w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Carat Magic Numbers */}
          <h2 style={h2Style}>The Magic Number Strategy: How to Save 20–30% on Carat Weight</h2>
          <p style={pStyle}>
            Professional diamond buyers hunt for what we call <strong>Under-Sizes</strong>. Because 1.00ct is a massive psychological threshold in the market, diamonds weighing 0.90–0.96ct often trade at a 20–30% discount. The physical size difference between a 0.95ct and a 1.00ct Round Brilliant is less than 0.1mm in diameter — invisible to the naked eye when set in a ring.
          </p>
          <p style={pStyle}>
            The same principle applies at every magic number. Use the calculator to compare a 0.90ct vs 1.00ct with identical 4Cs — the gap will show you exactly how many dollars you save by staying under the cliff. The savings are real and they are significant.
          </p>

          <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--body)", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#111", color: "#fff" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Magic Number</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Under-Size Sweet Spot</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Typical Savings</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>What This Means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0.50ct", "0.44–0.49ct", "10–15%", "Ideal for smaller solitaires and stackable bands."],
                  ["1.00ct", "0.90–0.96ct", "20–30%", "Best value tier. Near-identical visual size for a fraction of the price."],
                  ["1.50ct", "1.40–1.47ct", "15–22%", "Sweet spot for buyers who want the 1.5ct look."],
                  ["2.00ct", "1.88–1.95ct", "18–25%", "Major savings at the 2ct cliff. Visual difference is under 0.2mm."],
                ].map(([m, u, s, w], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fafaf8" : "#fff", borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111" }}>{m}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{u}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{s}</td>
                    <td style={{ padding: "10px 14px", color: "#333" }}>{w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shape Premium Hierarchy */}
          <h2 style={h2Style}>Shape Price Hierarchy: Which Diamond Shapes Give the Best Value</h2>
          <p style={pStyle}>
            Every diamond shape has a different <strong>yield from the rough</strong> — the percentage of original crystal preserved after cutting. Shapes with lower yield require more raw material, driving up the price-per-carat. This is the core reason Round Brilliants are always the most expensive shape. Refer to our <Link href="/diamond-shapes-guide" style={{ color: "var(--gold)" }}>complete diamond shapes guide</Link> for detailed proportions and style comparisons.
          </p>

          <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--body)", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#111", color: "#fff" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Shape</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Price vs Round</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Visual Size Bonus</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>What This Means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Round Brilliant", "Baseline (highest)", "—", "Max brilliance. Highest resale liquidity. Most expensive per carat."],
                  ["Princess", "~25% less", "Similar spread", "Best for square settings. Modern geometric look at real savings."],
                  ["Cushion", "~22% less", "Slightly larger face-up", "Romantic, vintage appeal. Great value. See our cushion vs round guide."],
                  ["Oval", "~15% less", "+10–15% larger face-up", "Best elongation value. Makes fingers look slender. Very popular right now."],
                  ["Emerald", "~18% less", "Longer face-up", "Step-cut glamour. Demands VS1+ clarity due to open facets."],
                  ["Pear", "~17% less", "+15% elongation", "Unique hybrid. Slimming on the finger. Excellent value tier."],
                  ["Marquise", "~19% less", "+20% larger face-up", "Maximum elongation per dollar. Dramatic silhouette."],
                  ["Radiant", "~28% less", "Compact spread", "Crushed-ice brilliance. Hides inclusions well — allows SI1 at this shape."],
                  ["Asscher", "~20% less", "Smaller face-up", "Art Deco step cut. Hall-of-mirrors effect. Needs high clarity."],
                  ["Heart", "~30% less", "Varies by ratio", "Novelty shape. Lower resale liquidity. Best as a sentimental gift."],
                ].map(([s, p, v, w], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fafaf8" : "#fff", borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111" }}>{s}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{p}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{v}</td>
                    <td style={{ padding: "10px 14px", color: "#333" }}>{w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Natural vs Lab */}
          <h2 style={h2Style}>Natural vs Lab-Grown: The 2-Category Price Reality</h2>
          <p style={pStyle}>
            Our calculator treats natural and lab-grown as two entirely separate economic categories. They are not competing products — they serve different financial purposes.
          </p>

          <h3 style={h3Style}>Natural Diamonds: The Finite Store of Value</h3>
          <p style={pStyle}>
            Natural diamonds are billions of years old and exist in a fixed quantity. As major mines deplete, the cost of extraction rises and the supply of gem-quality rough contracts. When you calculate the price of a natural stone, you are looking at an asset tied to genuine geological scarcity. High-quality naturals — specifically those with Triple Excellent GIA scores — show strong price resilience. For natural stone pricing by cut grade, see our <Link href="/diamond-cut-guide" style={{ color: "var(--gold)" }}>diamond cut guide</Link>.
          </p>

          <h3 style={h3Style}>Lab-Grown Diamonds: The Utility Purchase</h3>
          <p style={pStyle}>
            Lab-grown diamonds are physically and chemically identical to natural stones. The difference is economic origin. Because they are manufactured, their diamond price follows the technology curve — downward as production efficiency improves. We classify lab-grown as <em>Utility Assets</em>: they give maximum visual size for minimum spend, but they carry no long-term store-of-value characteristic. Use the calculator to verify you are paying the current manufactured benchmark, not an inflated retail markup.
          </p>
          <p style={pStyle}>
            For a full comparison including resale projections, check our <Link href="/diamond-resale-value-calculator" style={{ color: "var(--gold)" }}>Diamond Resale Value Calculator</Link> — it models the 5-year and 10-year ROI difference between natural and lab-grown specifically.
          </p>

          <blockquote style={quoteStyle}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.95rem", color: "#333", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              &ldquo;Buying a lab-grown diamond at a 2× markup over its manufacturing benchmark is the most common financial mistake I see. The calculator catches this every time. Run the numbers before you sign anything.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600 }}>
              Farzana Hasan, Lead Diamond Critic
            </p>
          </blockquote>

          {/* Cut Deep Dive */}
          <h2 style={h2Style}>Cut Quality: The Variable That Overrides Everything Else</h2>
          <p style={pStyle}>
            Cut is the only 4C where human craftsmanship affects the diamond&apos;s visual performance. A D-Flawless diamond looks like a dull piece of glass with a poor cut. A well-cut G-VS2 beats it every time in real life. This is why the calculator penalizes cut quality more aggressively than any other variable.
          </p>
          <p style={pStyle}>
            When you drop from Excellent to Good cut in the calculator, you save roughly 26% on price — but you lose 40–50% of the diamond&apos;s light return. The economics do not favor it. For a detailed breakdown of proportion targets like table %, depth %, and crown angles, our <Link href="/diamond-cut-guide" style={{ color: "var(--gold)" }}>cut grade guide</Link> explains exactly what numbers to insist on from your seller.
          </p>

          {/* Color Deep Dive */}
          <h2 style={h2Style}>Color Grading: Where Your Money Is Going</h2>
          <p style={pStyle}>
            The <Link href="/diamond-color-scale" style={{ color: "var(--gold)" }}>diamond color scale</Link> runs from D (colorless) to Z (light yellow). D is the mathematical perfection baseline, but it is rare and expensive. The practical truth: G and H color diamonds appear colorless to the naked eye when set in white gold or platinum. The difference between a D and a G in terms of appearance is invisible without a comparison loupe.
          </p>
          <p style={pStyle}>
            For specific color grades: our guide on <Link href="/d-color-diamond" style={{ color: "var(--gold)" }}>D color diamonds</Link>, <Link href="/e-color-diamond" style={{ color: "var(--gold)" }}>E color diamonds</Link>, and <Link href="/f-color-diamond" style={{ color: "var(--gold)" }}>F color diamonds</Link> covers the colorless tier. For value buyers, our <Link href="/g-color-diamond" style={{ color: "var(--gold)" }}>G color</Link> and <Link href="/h-color-diamond" style={{ color: "var(--gold)" }}>H color</Link> guides show exactly what you get for giving up the top tier.
          </p>

          {/* Clarity Deep Dive */}
          <h2 style={h2Style}>Clarity: Don't Pay for What You Can't See</h2>
          <p style={pStyle}>
            The Diamond Critics philosophy on clarity is simple: <em>never pay for a clarity grade your eye cannot verify.</em> An Internally Flawless (IF) diamond is a museum-grade asset. A VS1 or VS2 diamond is <strong>eye-clean</strong> — no inclusions visible to the naked eye at standard viewing distance. Our <Link href="/diamond-clarity-chart" style={{ color: "var(--gold)" }}>diamond clarity chart</Link> maps out exactly where the eye-clean threshold falls for each shape.
          </p>
          <p style={pStyle}>
            Step-cut shapes (Emerald, Asscher) are the exception. Their large, open facets act like windows into the stone — inclusions visible under 10× magnification often become visible to the naked eye in these shapes. For step cuts, target VS1 at minimum.
          </p>

          {/* Fluorescence */}
          <h2 style={h2Style}>Fluorescence: The Price Modifier Most Buyers Miss</h2>
          <p style={pStyle}>
            Fluorescence is not graded in the 4Cs but it moves the price meaningfully. In D–F color diamonds, Strong Blue fluorescence typically causes a 10–15% price discount because it can create a hazy or milky appearance in direct sunlight. In I–J color stones, Medium Blue fluorescence can actually improve appearance — making the stone appear whiter — which allows you to buy a lower color grade for less money with no visual penalty.
          </p>
          <p style={pStyle}>
            If you find a stone priced 15–20% below the calculator benchmark with strong fluorescence, it may be a legitimate value buy. Request ASET or Idealscope imagery to verify there is no haziness before committing.
          </p>

          {/* Where to Buy */}
          <h2 style={h2Style}>Where to Buy at or Below the Calculator Benchmark</h2>
          <p style={pStyle}>
            Once you have your target price from the calculator, the next step is finding certified stones at that number in live market inventory. The largest certifiedinventory with real-time pricing is searchable by all 4Cs filters.
          </p>

          <div style={{ background: "#fafaf8", border: "1px solid #e8e4dc", padding: "1.5rem 1.75rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.9rem", fontWeight: 700, color: "#111", marginBottom: "0.75rem" }}>
              Search Live Diamond Inventory by Shape →
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {[
                ["Round", "RD"], ["Oval", "OV"], ["Cushion", "CU"], ["Emerald", "EC"],
                ["Pear", "PE"], ["Marquise", "MQ"], ["Princess", "PR"], ["Radiant", "RA"],
              ].map(([label, shape]) => (
                <a
                  key={shape}
                  href={`https://www.bluenile.com/diamond-search?shape=${shape}&PriceFrom=500&a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    background: "#111",
                    color: "#fff",
                    fontFamily: "var(--body)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                  }}
                >
                  {label} →
                </a>
              ))}
            </div>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "#777", marginTop: "0.75rem" }}>
              All stones GIA/AGS certified. Filter by cut, color, clarity, and carat weight to find stones at your benchmark.
            </p>
          </div>

          <p style={pStyle}>
            For a full review of where Diamond Critics recommends purchasing — including which retailers consistently price closest to wholesale benchmarks — see our <Link href="/category/diamond-retailer-reviews" style={{ color: "var(--gold)" }}>diamond retailer reviews</Link>.
          </p>

          <blockquote style={quoteStyle}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.95rem", color: "#333", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              &ldquo;After running the calculator, always search at least 50 stones in your target range. The market is real-time — there are always stones priced 8–12% below benchmark if you look at enough inventory. That gap is free money.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600 }}>
              Farzana Hasan, Lead Diamond Critic
            </p>
          </blockquote>

          {/* Methodology */}
          <h2 style={h2Style}>Calculator Methodology: How We Build the Price Estimate</h2>
          <p style={pStyle}>
            Our pricing model starts from a natural round brilliant baseline calibrated against the Rapaport Price List and global wholesale inventory data. Each 4C variable is applied as a multiplier based on institutional market weighting.
          </p>
          <p style={pStyle}>
            The shape multipliers reflect the yield-from-rough economics described above. The carat weight scarcity curve uses a 1.63 power law multiplier — matching the exponential rarity distribution observed in rough diamond production. Origin (natural vs lab-grown) is applied as the baseline split, reflecting the current structural price divergence in certified market inventory.
          </p>
          <p style={pStyle}>
            The model is updated monthly in alignment with Rapaport price shifts. Lab-grown pricing is reviewed more frequently due to rapid production-cost changes. The result is accurate within 5–7% of current institutional rates for standard GIA-graded stones.
          </p>

          {/* FAQ */}
          <h2 style={h2Style}>Frequently Asked Questions</h2>

          {[
            {
              q: "How accurate is this diamond price calculator?",
              a: "Our calculator uses a wholesale benchmark algorithm calibrated against GIA-certified inventory and global market data. It provides an estimate within 5–7% of current institutional rates. Factors like Hearts & Arrows symmetry or specific GIA Triple Excellent sub-metrics can influence the final price beyond the calculator's output.",
            },
            {
              q: "Why does the diamond price per carat jump at 1.00ct?",
              a: "Diamond pricing follows an exponential scarcity curve. A 1.00ct diamond is significantly more desirable than a 0.99ct stone in the wholesale market, creating a price cliff. The same price cliff occurs at 0.50ct, 1.50ct, and 2.00ct. Diamonds weighing 0.90–0.96ct often trade at a 20–30% discount for nearly identical visual size.",
            },
            {
              q: "Does the calculator include retail markups?",
              a: "No. The result is the fair market wholesale benchmark — what a retailer pays for the stone. Standard luxury retailers add a 30–100% markup. The gap between your calculator result and the retail asking price represents the retailer's overhead, branding, and margin.",
            },
            {
              q: "Why are lab-grown diamond prices so much lower than natural?",
              a: "Lab-grown diamonds are priced on the cost of energy and CVD/HPHT manufacturing technology. As production scales globally, the manufacturing benchmark adjusts downward. Natural diamonds carry a geological scarcity premium that manufactured stones cannot replicate. The price gap is currently at a historic high — lab-grown diamonds trade 85–92% below equivalent natural grades.",
            },
            {
              q: "Why are Round Brilliant diamonds more expensive than other shapes?",
              a: "Round Brilliants require the most rough diamond to be sacrificed during cutting — nearly 60% of the original crystal is lost to achieve the 58-facet ideal. Fancy shapes like Cushion or Oval preserve more rough material, allowing a lower rate-per-carat. Ovals appear 10–15% larger than a Round of equal carat weight.",
            },
            {
              q: "Does the calculator account for fluorescence?",
              a: "The primary calculator focuses on the 4Cs. However, fluorescence is a real price modifier: Strong Blue fluorescence in D–F color diamonds typically causes a 10–15% price discount due to potential haziness. In I–J color stones, Medium Blue fluorescence can increase apparent whiteness and be a value advantage.",
            },
            {
              q: "Can I use this for insurance appraisal?",
              a: "The calculator provides a replacement value benchmark for research purposes. An official insurance appraisal requires physical inspection by a certified gemologist who verifies the stone's specific light performance, integrity, and proportions. Use our tool to verify your appraiser's replacement value is reasonable.",
            },
            {
              q: "What is the best 4Cs combination for value?",
              a: "For most buyers: Excellent cut (non-negotiable), G or H color (colorless appearance in white metal), VS2 or VS1 clarity (eye-clean for brilliant cuts), and 0.90–0.96ct instead of 1.00ct. This combination delivers maximum visual performance at a 25–35% discount versus D-IF-Excellent at 1.00ct.",
            },
          ].map(({ q, a }, i) => (
            <div key={i} style={{ marginBottom: "1.25rem", borderBottom: "1px solid #eee", paddingBottom: "1.25rem" }}>
              <h3 style={{ ...h3Style, marginTop: 0 }}>{q}</h3>
              <p style={{ ...pStyle, marginBottom: 0 }}>{a}</p>
            </div>
          ))}

          {/* See Also */}
          <h2 style={h2Style}>See Also</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1.5rem", fontFamily: "var(--body)", fontSize: "0.9rem" }}>
            {[
              ["/diamond-resale-value-calculator", "Diamond Resale Value Calculator"],
              ["/diamond-4cs", "The Diamond 4Cs Explained"],
              ["/diamond-prices", "Current Diamond Prices"],
              ["/diamond-cut-guide", "Diamond Cut Grade Guide"],
              ["/diamond-color-scale", "Diamond Color Scale"],
              ["/diamond-clarity-chart", "Diamond Clarity Chart"],
              ["/diamond-size-chart", "Diamond Size Chart"],
              ["/diamond-shapes-guide", "All Diamond Shapes Guide"],
              ["/lab-grown-vs-natural-diamond-price", "Lab-Grown vs Natural Price"],
              ["/round-cut-diamond", "Round Cut Diamond Guide"],
              ["/oval-cut-diamond", "Oval Cut Diamond Guide"],
              ["/emerald-cut-diamond", "Emerald Cut Diamond Guide"],
              ["/cushion-cut-diamond", "Cushion Cut Diamond Guide"],
              ["/d-color-diamond", "D Color Diamond"],
              ["/f-color-diamond", "F Color Diamond"],
              ["/category/diamond-retailer-reviews", "Diamond Retailer Reviews"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                style={{ color: "var(--gold)", textDecoration: "none", lineHeight: 1.6 }}
              >
                → {label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
