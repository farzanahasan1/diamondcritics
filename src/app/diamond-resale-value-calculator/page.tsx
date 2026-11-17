import type { Metadata } from "next";
import Link from "next/link";
import ResaleCalculator from "@/components/ResaleCalculator";

const TITLE = "Diamond Resale Value Calculator — Natural vs Lab ROI Over 10 Years";
const DESC =
  "Estimate your diamond's 5-year and 10-year resale value and ROI. Compare natural vs lab-grown retention with GIA-backed projections. Free tool by Farzana Hasan, Diamond Critics.";
const URL = "https://diamondcritics.com/diamond-resale-value-calculator";

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
        url: "https://diamondcritics.com/images/Diamond-Resale-Value-Calculator-ROI-Estimator-2D-Animation-Concept.jpg",
        width: 1200,
        height: 630,
        alt: "Diamond resale value calculator — 5-year and 10-year ROI estimator by Diamond Critics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [
      "https://diamondcritics.com/images/Diamond-Resale-Value-Calculator-ROI-Estimator-2D-Animation-Concept.jpg",
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${URL}#tool`,
      "name": "Diamond Resale Value & ROI Calculator",
      "url": URL,
      "description":
        "Free diamond resale value calculator that projects 5-year and 10-year ROI for natural and lab-grown diamonds by shape, carat weight, cut, color, and clarity.",
      "applicationCategory": "FinanceApplication",
      "browserRequirements": "Requires JavaScript",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "featureList": [
        "5-year resale value projection",
        "10-year ROI estimation",
        "Natural vs lab-grown retention comparison",
        "10 diamond shapes",
        "4Cs quality scoring",
        "GIA wholesale benchmark methodology",
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
          "name": "How accurate is the diamond resale value estimate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Our diamond resale value calculator uses a market benchmark algorithm based on secondary market transactions and global wholesale liquidity trends. It provides an estimate typically within 5–8% of what institutional diamond buyers (wholesale dealers, specialized liquidators) will offer, excluding retail markups and commissions.",
          },
        },
        {
          "@type": "Question",
          "name": "Why do lab-grown diamonds show negative 5-year ROI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Lab-grown diamonds are manufactured products. Their pricing is tied to the decreasing cost of CVD/HPHT technology rather than natural scarcity. As production capacity expands globally, secondary market prices fall rapidly. Lab-grown diamonds typically lose 60–80% of their retail value within the first 5 years because supply outpaces demand on the resale market.",
          },
        },
        {
          "@type": "Question",
          "name": "Can natural diamonds appreciate over 10 years?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes, under the right conditions. If a high-quality natural diamond is purchased near the wholesale benchmark — avoiding high retail margins — historical inflation and the depletion of major global diamond mines often push the asset's raw material value upward, allowing for positive ROI by the 10-year mark. The key is buying at or near fair market value, not at a 100% retail markup.",
          },
        },
        {
          "@type": "Question",
          "name": "Why does cut quality impact resale value so heavily?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Institutional buyers penalize diamonds with Good or Very Good cuts because they lack optimal light performance. These stones often need to be recut to Excellent or Ideal standards to be resold, which loses carat weight and therefore value. Buying an Excellent cut protects both visual quality and resale liquidity.",
          },
        },
        {
          "@type": "Question",
          "name": "Does the grading laboratory affect resale value?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes, significantly. The secondary market treats GIA (Gemological Institute of America) and AGS as the strict gold standards. Diamonds graded by softer laboratories like IGI or EGL are typically discounted by 10–20% by professional buyers who assume the grades may be inflated relative to GIA standards.",
          },
        },
        {
          "@type": "Question",
          "name": "Should I expect to resell a diamond at its retail price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. When you buy a diamond at retail, you pay for the stone plus the store's overhead, branding, and marketing margins — typically 30–100% above wholesale. When you resell, buyers pay only for the raw intrinsic value of the diamond at the wholesale rate. The closer you buy to wholesale, the smaller this gap becomes.",
          },
        },
        {
          "@type": "Question",
          "name": "How do magic number carat weights affect resale ROI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Diamonds exactly at 1.00ct, 1.50ct, or 2.00ct command a premium in both the retail and resale markets due to psychological demand thresholds. If that stone is damaged and must be polished down even slightly past the threshold, it falls off a price cliff and loses significant value. Protecting the physical integrity of a magic-number stone is critical for ROI.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the best diamond to buy for maximum resale value?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "A natural, GIA-certified Round Brilliant with Excellent cut, D–G color, VS1–VS2 clarity, and carat weight at or above a magic number (1.00ct, 1.50ct, 2.00ct) is the most liquid resale asset. Round Brilliants have the highest universal demand on the secondary market. Buy as close to the wholesale benchmark as possible to minimize the initial depreciation gap.",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "@id": `${URL}#howto`,
      "name": "How to Estimate Diamond Resale Value and ROI",
      "description": "Step-by-step guide to projecting your diamond's 5-year and 10-year resale value using the Diamond Critics ROI estimator.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Set Asset Origin: Natural or Lab-Grown",
          "text": "Natural diamonds hold historical value as finite geological assets. Lab-grown diamonds depreciate rapidly because supply is essentially unlimited. This is the single most important variable for ROI — the difference between positive and deeply negative 10-year returns.",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Select Shape",
          "text": "Round Brilliant is the most liquid resale shape because it has the highest universal demand. Fancy shapes (Oval, Emerald, Pear) follow trend cycles that can affect liquidity. Heart and novelty shapes have the lowest resale demand.",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Enter Exact Carat Weight",
          "text": "Use the exact weight from your GIA certificate. Magic number weights (1.00ct, 1.50ct, 2.00ct) command resale premiums. Stones just below magic numbers trade at significant discounts in the secondary market.",
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Calibrate the 4Cs Quality Score",
          "text": "Enter GIA certificate grades exactly. The algorithm evaluates how Cut, Color, and Clarity interact to determine the stone's Investment Grade — the combination that institutional buyers will pay the highest premium for in the secondary market.",
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
          "name": "Diamond Resale Value Calculator",
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

export default function DiamondResaleCalculatorPage() {
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
            Investment-Grade Diamond Analytics
          </p>
          <h1 style={{ fontFamily: "var(--heading)", fontWeight: 300, color: "#fff", fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "700px", marginBottom: "1.25rem" }}>
            Diamond Resale Value &amp; ROI Calculator
          </h1>
          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: "560px", marginBottom: "2rem" }}>
            See your diamond&apos;s projected 5-year and 10-year resale value. Compare natural vs lab-grown retention rates. Know before you buy whether this stone is an asset or a liability.
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
        <ResaleCalculator />
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
              What the ROI numbers actually mean for your purchase
            </p>
            <ul style={{ fontFamily: "var(--body)", fontSize: "0.95rem", color: "#333", lineHeight: 1.75, paddingLeft: "1.25rem" }}>
              <li><strong>Natural diamonds</strong> can recover value over 10 years if bought near wholesale. Lab-grown diamonds typically lose 60–80% in the same period.</li>
              <li>The <strong>drive-off-the-lot moment</strong> costs most buyers 30–50% the second they leave the store. Buying near our benchmark price eliminates most of this loss.</li>
              <li>GIA certification is non-negotiable for resale. IGI/EGL diamonds get discounted 10–20% by professional buyers automatically.</li>
              <li>Round Brilliant is the most liquid resale shape — always. Novelty shapes (Heart, Trillion) have the weakest secondary market.</li>
              <li>Use the <Link href="/diamond-price-calculator" style={{ color: "var(--gold)" }}>Diamond Price Calculator</Link> first to verify you are buying at or near benchmark before checking resale projections.</li>
            </ul>
          </div>

          {/* How to Use */}
          <h2 style={h2Style}>How to Use the Diamond Resale Value Calculator</h2>
          <p style={pStyle}>
            This tool projects your diamond&apos;s likely resale value at the 5-year and 10-year marks based on certified market behavior. Use the exact grades from your <strong>GIA grading report</strong> for the most accurate projection.
          </p>

          <h3 style={h3Style}>Step 1 — Set Asset Origin: Natural or Lab-Grown</h3>
          <p style={pStyle}>
            This is the single most critical variable for ROI. Natural diamonds benefit from geological scarcity — the global supply of gem-quality rough is finite and contracting. Lab-grown diamonds are manufactured products whose secondary market is structurally weak because supply is essentially unlimited. For a full economic comparison, read our <Link href="/lab-grown-vs-natural-diamond-price" style={{ color: "var(--gold)" }}>lab-grown vs natural diamond price analysis</Link>.
          </p>

          <h3 style={h3Style}>Step 2 — Select Shape for Liquidity</h3>
          <p style={pStyle}>
            Shape affects how quickly you can sell and at what premium. <Link href="/round-cut-diamond" style={{ color: "var(--gold)" }}>Round Brilliant</Link> is the most universally demanded shape in the secondary market — it always sells. Fancy shapes like <Link href="/oval-cut-diamond" style={{ color: "var(--gold)" }}>Oval</Link> and <Link href="/emerald-cut-diamond" style={{ color: "var(--gold)" }}>Emerald cut</Link> follow trend cycles. When a shape is in trend, resale demand spikes. When it falls out of fashion, buyers discount aggressively.
          </p>

          <h3 style={h3Style}>Step 3 — Enter Exact Carat Weight</h3>
          <p style={pStyle}>
            Magic number weights (exactly 1.00ct, 1.50ct, 2.00ct) command resale premiums because retail buyers and collectors target these thresholds. Stones just under magic numbers — which are great value buys on the <Link href="/diamond-price-calculator" style={{ color: "var(--gold)" }}>price calculator</Link> — trade at a slight secondary market discount because retail buyers prefer the round number. If resale ROI matters to you, buy at or slightly above a magic number. For how carat weight translates to physical size, see our <Link href="/diamond-size-chart" style={{ color: "var(--gold)" }}>diamond size chart</Link>.
          </p>

          <h3 style={h3Style}>Step 4 — Set the 4Cs Quality Score</h3>
          <p style={pStyle}>
            Enter the exact grades from your GIA certificate. Our algorithm scores the <strong>Investment Grade</strong> — the specific 4Cs combination that institutional buyers in the secondary market will pay the highest premium for. The <Link href="/diamond-4cs" style={{ color: "var(--gold)" }}>Diamond 4Cs guide</Link> explains every grade in full. For cut specifically, the <Link href="/diamond-cut-guide" style={{ color: "var(--gold)" }}>cut grade guide</Link> shows the exact proportion targets institutional buyers require.
          </p>

          <blockquote style={quoteStyle}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.95rem", color: "#333", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              &ldquo;The hardest truth in this industry is the drive-off-the-lot reality. A standard retail diamond loses 30–50% of its value the moment you leave the store. My goal with this ROI estimator is simple: help you buy at the right wholesale benchmark today, so you are not shocked at the pawn shop in year three.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600 }}>
              Farzana Hasan, Lead Diamond Critic
            </p>
          </blockquote>

          {/* Resale Retention Matrix */}
          <h2 style={h2Style}>Resale Retention Matrix: What Each Variable Does to Your ROI</h2>
          <p style={pStyle}>
            Our resale projection engine weights variables differently from the standard price calculator. Here is exactly how each factor affects 10-year liquidity and retention.
          </p>

          <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--body)", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#111", color: "#fff" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Liquidity Variable</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Retention Weight</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Resale Market Trend</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>What This Means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Origin (Natural vs Lab)", "85% of total ROI", "Natural: stable / Lab: rapid depreciation", "The most important buy decision you make. Lab = utility, not investment."],
                  ["Cut Precision", "20% multiplier", "Institutional buyers demand Excellent/Ideal", "Good or Very Good cut stones get recut by buyers. You lose carat weight and value."],
                  ["Color Grade", "15% retention marker", "D–G hold elite premiums. G–H are most liquid.", "D–F are collection assets. G–H are the fastest-selling grades in secondary market."],
                  ["Clarity Grade", "10% purity anchor", "VS1–VS2 is the most traded range globally", "IF is a museum grade. VS2 is the liquidity sweet spot — eye-clean and fast to sell."],
                  ["GIA Certification", "Critical baseline", "GIA/AGS only respected by institutional buyers", "IGI/EGL diamonds get auto-discounted 10–20% by every professional buyer."],
                  ["Shape", "Trend-dependent", "Round = highest liquidity always", "Fancy shapes follow fashion. Round is the safe choice for resale."],
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

          {/* Natural vs Lab ROI */}
          <h2 style={h2Style}>Natural vs Lab-Grown: The Liquidity Reality</h2>
          <p style={pStyle}>
            The most critical aspect of this calculator is the stark divergence between natural and lab-grown ROI curves. These are not competing choices — they serve different financial purposes.
          </p>

          <h3 style={h3Style}>Natural Diamonds: The Finite Store of Value</h3>
          <p style={pStyle}>
            Natural diamonds are billions of years old. As large-scale mines deplete and new deposits become harder to find, genuine scarcity protects the asset. A high-quality natural diamond purchased near wholesale is an investment-grade hold. The key word is <em>near wholesale</em> — a buyer paying 100% retail markup needs far longer for the asset to recover that overpayment.
          </p>
          <p style={pStyle}>
            For color grades that institutional buyers specifically target: <Link href="/d-color-diamond" style={{ color: "var(--gold)" }}>D color</Link> and <Link href="/e-color-diamond" style={{ color: "var(--gold)" }}>E color</Link> stones carry collection-grade premiums. <Link href="/f-color-diamond" style={{ color: "var(--gold)" }}>F color</Link> stones are considered the entry point for investment-grade buying. All three are within the colorless range on the <Link href="/diamond-color-scale" style={{ color: "var(--gold)" }}>diamond color scale</Link>.
          </p>

          <h3 style={h3Style}>Lab-Grown Diamonds: The Utility Depreciation Curve</h3>
          <p style={pStyle}>
            Lab diamonds are physically and chemically identical to natural. The difference is economic. Because they are manufactured products, they follow the technology pricing curve — the same curve that made flat-screen TVs cheaper every year. As global CVD/HPHT production capacity expands, secondary market prices fall rapidly.
          </p>
          <p style={pStyle}>
            Our calculator projects a 60–70% drop in lab-grown resale value over a 5–10 year period. This is not pessimism — it is the current secondary market reality. Lab-grown diamonds are exceptional value for personal enjoyment, engagement rings, and fashion jewelry. Buy them for the immediate savings and beauty, not for resale returns.
          </p>

          {/* ROI Projections Table */}
          <h2 style={h2Style}>5-Year vs 10-Year ROI: What to Expect by Quality Tier</h2>
          <p style={pStyle}>
            These projections assume purchase at or near the wholesale benchmark price — not at a 100% retail markup. Buying at retail doubles or triples the recovery time. For benchmark pricing, run the stone through our <Link href="/diamond-price-calculator" style={{ color: "var(--gold)" }}>Diamond Price Calculator</Link> first.
          </p>

          <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--body)", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#111", color: "#fff" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Diamond Profile</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>5-Year ROI</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>10-Year ROI</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>What This Means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Natural, Round, D–F, VS1+, Excellent, 1ct+", "−5% to +15%", "+20% to +40%", "Best investment-grade tier. Bought near wholesale, strong 10-year outlook."],
                  ["Natural, Round, G–H, VS2, Excellent, 1ct+", "−10% to +5%", "+10% to +25%", "Most liquid resale tier. Easiest to sell quickly. Good ROI from wholesale."],
                  ["Natural, Fancy Shape, G–H, VS1, Excellent", "−15% to +5%", "+5% to +20%", "Shape trend risk. Oval and Pear perform best; Heart and Trillion weakest."],
                  ["Natural, Any, SI1–SI2 or Very Good cut", "−20% to −10%", "−10% to +5%", "Secondary buyers discount SI clarity and cut heavily. Avoid for investment."],
                  ["Lab-Grown, Any, Any grade", "−60% to −40%", "−80% to −60%", "Utility purchase only. Exceptional personal value. Zero investment thesis."],
                ].map(([p, f, t, w], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fafaf8" : "#fff", borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111" }}>{p}</td>
                    <td style={{ padding: "10px 14px", color: i === 4 ? "#c0392b" : "#2d7a2d" }}>{f}</td>
                    <td style={{ padding: "10px 14px", color: i >= 3 ? "#c0392b" : "#2d7a2d" }}>{t}</td>
                    <td style={{ padding: "10px 14px", color: "#333" }}>{w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quality Impact on Liquidity */}
          <h2 style={h2Style}>How the 4Cs Affect Resale Liquidity</h2>

          <h3 style={h3Style}>Cut: The Non-Negotiable for Buyers</h3>
          <p style={pStyle}>
            If you try to resell a Good or Very Good cut diamond, wholesale buyers will severely penalize the price. They typically intend to recut the stone to modern Excellent or Ideal standards — which loses carat weight. A stone that was 1.00ct Good cut may emerge from recutting at 0.90ct, immediately falling off the magic number price cliff.
          </p>
          <p style={pStyle}>
            The cut guide has specific proportion targets that institutional buyers look for. For exact measurements: table %, depth %, crown angle, and girdle thickness all matter to professional buyers. See our <Link href="/diamond-cut-guide" style={{ color: "var(--gold)" }}>diamond cut guide</Link> for the precise numbers.
          </p>

          <h3 style={h3Style}>Color: The Rarity Multiplier</h3>
          <p style={pStyle}>
            When projecting ROI, color acts as a strict rarity multiplier. The <Link href="/diamond-color-scale" style={{ color: "var(--gold)" }}>diamond color scale</Link> dictates that F color and above carry collection-grade status. These high-color stones historically appreciate faster over a 10-year horizon because the global supply of truly colorless rough is contracting as major mines age.
          </p>
          <p style={pStyle}>
            For G–H color stones, the resale market is active and liquid but without the rarity premium. These are the fastest-moving grades in the secondary market because retail buyers find them visually perfect and they are plentiful enough that deals are common.
          </p>

          <h3 style={h3Style}>Clarity: Eye-Clean Is the Marketability Standard</h3>
          <p style={pStyle}>
            While an Internally Flawless (IF) stone is technically perfect, the secondary market is very practical. The most frequently traded clarity range is VS1 to VS2. These stones are <strong>eye-clean</strong> and they sell quickly because retail buyers get premium aesthetics without paying the exponential IF rarity tax. For the full inclusion map by grade, our <Link href="/diamond-clarity-chart" style={{ color: "var(--gold)" }}>diamond clarity chart</Link> shows what is visible at each tier.
          </p>
          <p style={pStyle}>
            Step-cut shapes require higher clarity for resale liquidity. An <Link href="/emerald-cut-diamond" style={{ color: "var(--gold)" }}>Emerald cut</Link> or <Link href="/asscher-cut-diamond" style={{ color: "var(--gold)" }}>Asscher cut</Link> in SI1 clarity will be heavily discounted by buyers because the open facets make inclusions visible. For step cuts, VS1 is the minimum for strong resale.
          </p>

          <blockquote style={quoteStyle}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.95rem", color: "#333", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              &ldquo;I see buyers overpay by 40–60% every week at standard retailers, then come to me confused why the resale offer is so low. The math is not complicated: overpay at purchase, the ROI curve starts below zero. Buy smart, the asset defends itself.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600 }}>
              Farzana Hasan, Lead Diamond Critic
            </p>
          </blockquote>

          {/* 3 Strategies */}
          <h2 style={h2Style}>3 Strategies to Maximize Your Diamond ROI</h2>

          <h3 style={h3Style}>Strategy 1 — Buy Near the Wholesale Benchmark</h3>
          <p style={pStyle}>
            Use our <Link href="/diamond-price-calculator" style={{ color: "var(--gold)" }}>Diamond Price Calculator</Link> to establish your benchmark before you shop. The closer you buy to wholesale, the faster your ROI turns positive. Standard retail adds 30–100% to the stone&apos;s institutional value. That overpayment is the primary reason most diamond resales look like losses — the buyer simply paid too much at the start. Search certified inventory priced close to your calculator benchmark: <a href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>view certified diamond inventory →</a>
          </p>

          <h3 style={h3Style}>Strategy 2 — Insist on GIA or AGS Certification</h3>
          <p style={pStyle}>
            The secondary market has a strict two-tier grading hierarchy: GIA and AGS are trusted. Every other laboratory — IGI, EGL, HRD — is treated as potentially grade-inflated by professional buyers. If you present a diamond with a GIA report, buyers verify grades against the GIA database in seconds. IGI or EGL stones get discounted 10–20% automatically, before any other negotiation begins.
          </p>

          <h3 style={h3Style}>Strategy 3 — Protect the Physical Asset</h3>
          <p style={pStyle}>
            A chipped diamond loses enormous value. A magic-number stone (1.00ct exact) that chips and must be polished to 0.97ct falls off the price cliff permanently. Protect the girdle and culet with a bezel or prong setting designed for security. Keep the original GIA certificate — a stone without paperwork is treated with suspicion by every professional buyer.
          </p>

          {/* When to Sell */}
          <h2 style={h2Style}>When and Where to Sell a Diamond</h2>
          <p style={pStyle}>
            If resale is your goal, timing matters. The secondary market for natural diamonds shows the strongest demand in Q4 (October through December) and around Valentine&apos;s Day in Q1. Selling into peak demand means more buyers competing, which improves your negotiating position.
          </p>
          <p style={pStyle}>
            For where to sell: diamond dealers and estate jewelers who specialize in secondhand stones consistently offer higher prices than pawn shops or online auction platforms. Online peer-to-peer platforms can reach motivated retail buyers who pay closer to retail — but the process takes longer and requires more verification steps.
          </p>
          <p style={pStyle}>
            For advice on current <Link href="/diamond-prices" style={{ color: "var(--gold)" }}>diamond market prices</Link> and which shape categories are seeing the strongest demand, our prices guide is updated monthly.
          </p>

          <blockquote style={quoteStyle}>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.95rem", color: "#333", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              &ldquo;There are only two ways to get a good diamond resale price: buy smart from day one, or wait ten years. The calculator shows you the honest trajectory either way. No surprises.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600 }}>
              Farzana Hasan, Lead Diamond Critic
            </p>
          </blockquote>

          {/* Shape Resale Liquidity */}
          <h2 style={h2Style}>Shape Resale Liquidity Rankings</h2>
          <p style={pStyle}>
            Not all fancy shapes carry equal secondary market demand. Use this reference alongside the calculator projections. For full styling analysis of each shape, our <Link href="/diamond-shapes-guide" style={{ color: "var(--gold)" }}>diamond shapes guide</Link> covers proportions, settings, and market positioning for all 10 major cuts.
          </p>

          <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--body)", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#111", color: "#fff" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Shape</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Resale Liquidity</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Trend Stability</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>What This Means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Round Brilliant", "★★★★★ Highest", "Very stable", "Best resale of any shape. Universal demand. Fastest to sell."],
                  ["Oval", "★★★★ High", "Currently strong", "Second most demanded shape right now. Strong trend momentum."],
                  ["Cushion", "★★★★ High", "Stable trend", "Classic shape. Consistent buyer pool. Good liquidity."],
                  ["Emerald", "★★★ Medium", "Fashion cycle risk", "Requires VS1+ clarity. Strong with right grades. Niche collector appeal."],
                  ["Pear", "★★★ Medium", "Cyclical", "In-trend periods see strong demand. Requires confident buyer."],
                  ["Princess", "★★★ Medium", "Fading trend", "Was dominant a decade ago. Still sells but slower than Round or Oval."],
                  ["Radiant", "★★★ Medium", "Stable niche", "Crushed-ice appeal. Smaller but consistent buyer pool."],
                  ["Marquise", "★★ Lower", "Fashion-sensitive", "Very elongated. Niche appeal. Can take longer to sell."],
                  ["Asscher", "★★ Lower", "Collector niche", "Art Deco lovers. Small but passionate buyer base."],
                  ["Heart", "★ Lowest", "Novelty only", "Weakest secondary market. Avoid if ROI matters to you."],
                ].map(([s, l, t, w], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fafaf8" : "#fff", borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111" }}>{s}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{l}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{t}</td>
                    <td style={{ padding: "10px 14px", color: "#333" }}>{w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAQ */}
          <h2 style={h2Style}>Frequently Asked Questions</h2>

          {[
            {
              q: "How accurate is the diamond resale value estimate?",
              a: "Our calculator uses a market benchmark algorithm based on secondary market transactions and global wholesale liquidity trends. It provides an estimate within 5–8% of what institutional diamond buyers will offer, excluding retail markups and commissions.",
            },
            {
              q: "Why do lab-grown diamonds show negative 5-year ROI?",
              a: "Lab-grown diamonds are manufactured products whose pricing is tied to decreasing CVD/HPHT technology costs rather than natural scarcity. As production capacity expands globally, secondary market prices fall rapidly. Lab-grown diamonds typically lose 60–80% of their retail value within the first 5 years because supply outpaces demand on the resale market.",
            },
            {
              q: "Can natural diamonds appreciate over 10 years?",
              a: "Yes, under the right conditions. If a high-quality natural diamond is purchased near the wholesale benchmark, historical inflation and mine depletion often push asset value upward, allowing positive ROI by the 10-year mark. The key is buying at or near fair market value — not at a 100% retail markup.",
            },
            {
              q: "Why does cut quality impact resale value so heavily?",
              a: "Institutional buyers penalize Good or Very Good cut diamonds because they need recutting to Excellent or Ideal standards. Recutting loses carat weight, and losing even 0.03ct can drop a stone below a magic number threshold. An Excellent cut from day one protects both visual quality and resale value.",
            },
            {
              q: "Does the grading laboratory affect resale value?",
              a: "Yes, significantly. GIA and AGS are the strict gold standards for the secondary market. Diamonds graded by IGI or EGL are typically discounted 10–20% by professional buyers who assume the grades may be inflated relative to GIA standards.",
            },
            {
              q: "Should I expect to resell a diamond at its retail price?",
              a: "No. Retail price includes the store's overhead, branding, and margin — typically 30–100% above wholesale. When you resell, buyers pay only for the raw intrinsic value of the diamond. The closer you bought to wholesale, the smaller this depreciation gap.",
            },
            {
              q: "How do magic number carat weights affect resale ROI?",
              a: "Diamonds at exactly 1.00ct, 1.50ct, or 2.00ct command premiums in both retail and resale markets due to psychological demand thresholds. If that stone is damaged and must be polished down even slightly past the threshold, it falls off a price cliff and loses significant value. Protecting the physical integrity of a magic-number stone is critical for ROI.",
            },
            {
              q: "What is the best diamond to buy for maximum resale value?",
              a: "A natural, GIA-certified Round Brilliant with Excellent cut, D–G color, VS1–VS2 clarity, and carat weight at or above a magic number is the most liquid resale asset. Buy as close to the wholesale benchmark as possible to minimize the initial depreciation gap.",
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
              ["/diamond-price-calculator", "Diamond Price Calculator"],
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
