import type { Metadata } from "next";
import Link from "next/link";
import DiamondPriceChart from "@/components/DiamondPriceChart";

const PAGE_TITLE = "Rapaport Diamond Price Index (RAPI™) Explained — What Buyers Need to Know";
const PAGE_DESC =
  "What is the Rapaport Diamond Price Index? Learn how the RAPI™ benchmark works, what price changes mean for buyers, and how to use market data to avoid overpaying.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "https://diamondcritics.com/rapaport-diamond-price-index" },
  openGraph: {
    title: `${PAGE_TITLE} | Diamond Critics`,
    description: PAGE_DESC,
    url: "https://diamondcritics.com/rapaport-diamond-price-index",
    type: "article",
    siteName: "Diamond Critics",
    images: [{ url: "https://diamondcritics.com/images/diamondcritics-og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Rapaport Diamond Price Index?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Rapaport Diamond Price Index (RAPI™) is the global benchmark used by diamond professionals worldwide to track wholesale diamond price movements. It measures percentage changes in the Rapaport Price List — the industry's standard price guide — across different diamond sizes and grades.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Rapaport Price List free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The full Rapaport Price List is a paid subscription product used by industry professionals. The RAPI™ index figures — which show percentage price changes — are published publicly and that is what buyers can track.",
      },
    },
    {
      "@type": "Question",
      name: "What does a negative RAPI™ number mean for buyers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A negative RAPI™ reading means wholesale diamond prices have dropped over the measured period. For buyers, this is good news — it typically means retail prices will follow, giving you more negotiating room or better value for your budget.",
      },
    },
    {
      "@type": "Question",
      name: "How often is the Rapaport Price List updated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Rapaport Price List is updated weekly, every Friday. The RAPI™ index reflects changes in that list over a rolling 12-month period.",
      },
    },
    {
      "@type": "Question",
      name: "Does Rapaport pricing apply to lab-grown diamonds?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The Rapaport Price List covers natural (earth-mined) diamonds only. Lab-grown diamond prices are not benchmarked to Rapaport and have followed a separate, steeper downward price trend since 2020.",
      },
    },
    {
      "@type": "Question",
      name: "How do retailers use Rapaport pricing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Retailers buy and sell diamonds at a percentage discount or premium to the Rapaport list price, expressed as 'Rap minus X%' or 'Rap plus X%'. A stone priced at 'Rap -30%' means the seller is offering it at 30% below the Rapaport benchmark for that grade.",
      },
    },
    {
      "@type": "Question",
      name: "Should I negotiate using Rapaport prices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For in-store purchases, yes — knowing the Rapaport benchmark gives you a floor price reference. For online retailers like Blue Nile, prices are already competitive against Rapaport, often at significant discounts to the list price.",
      },
    },
    {
      "@type": "Question",
      name: "Which diamond sizes does RAPI™ track?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The RAPI™ index tracks four key carat weight categories: 0.30 ct, 0.50 ct, 1.00 ct, and 3.00 ct. Each represents a different market segment and can move independently based on supply and demand.",
      },
    },
  ],
};

const wrap: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 2rem",
};

const prose: React.CSSProperties = {
  fontFamily: "var(--body)",
  fontSize: "0.97rem",
  lineHeight: 1.82,
  color: "#444",
  marginBottom: "1.25rem",
};

const h2Style: React.CSSProperties = {
  fontFamily: "var(--heading)",
  fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
  fontWeight: 300,
  color: "#111",
  lineHeight: 1.2,
  marginBottom: "1rem",
  marginTop: "3rem",
};

const h3Style: React.CSSProperties = {
  fontFamily: "var(--heading)",
  fontSize: "1.15rem",
  fontWeight: 300,
  color: "#111",
  lineHeight: 1.3,
  marginBottom: "0.75rem",
  marginTop: "2rem",
};

export default function RapaportPriceIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Hero ── */}
      <div style={{ background: "#141414", padding: "4rem 0 3.5rem" }}>
        <div style={wrap}>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>
            Market Intelligence
          </p>
          <h1 style={{ fontFamily: "var(--heading)", fontWeight: 300, color: "#fff", fontSize: "clamp(2rem, 4.5vw, 3.6rem)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "760px", marginBottom: "1.25rem" }}>
            Rapaport Diamond Price Index{" "}
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Explained.</em>
          </h1>
          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: "580px", marginBottom: "2rem" }}>
            The RAPI™ is the benchmark that drives every diamond price negotiation in the world. Here is what it actually means for buyers — and how to use it.
          </p>
          <div style={{ borderTop: "1px solid #333", paddingTop: "1.5rem", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--body)", fontSize: "0.8rem", fontWeight: 600, color: "#fff", flexShrink: 0 }}>F</div>
            <div>
              <p style={{ fontFamily: "var(--heading)", fontSize: "0.9rem", fontWeight: 300, color: "#fff" }}>Farzana Hasan</p>
              <p style={{ fontFamily: "var(--body)", fontSize: "0.72rem", color: "#555" }}>GIA Expert · Diamond Critics</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TL;DR ── */}
      <div style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ ...wrap, padding: "1.75rem 2rem" }}>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--body)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", background: "#111", padding: "4px 10px", whiteSpace: "nowrap", marginTop: "2px" }}>
              TL;DR
            </span>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.88rem", color: "#555", lineHeight: 1.7, margin: 0, maxWidth: "800px" }}>
              The Rapaport Diamond Price Index (RAPI™) tracks wholesale diamond price movements for 0.30, 0.50, 1.00, and 3.00 ct stones. Over the past 12 months (Aug 2025 – Aug 2026): small stones rose +1.80–2.06%, 1ct was nearly flat at −0.14%, and 3ct edged up +0.37%. For buyers, this means the market has stabilised after the 2022–2024 correction — still a better time to buy than 2021.
            </p>
          </div>
        </div>
      </div>

      {/* ── Live Chart ── */}
      <DiamondPriceChart />

      {/* ── Main content ── */}
      <article style={{ borderBottom: "1px solid #ebebeb" }}>
        <div style={{ ...wrap, padding: "3.5rem 2rem" }}>
          <div style={{ maxWidth: "780px" }}>

            {/* Section 1 */}
            <h2 style={h2Style}>What Is the Rapaport Diamond Price Index?</h2>
            <p style={prose}>
              The Rapaport Diamond Price List has been the global benchmark for wholesale diamond pricing since 1978, when Martin Rapaport first published it in New York. Every week, Rapaport Group releases an updated price list showing the going wholesale rate (in US dollars per carat) for round brilliant diamonds, sorted by color, clarity, and carat weight.
            </p>
            <p style={prose}>
              The <strong>RAPI™</strong> — Rapaport Price Index — is a separate, publicly available figure that tracks the percentage change in that list over time. Think of it the way you think of the S&amp;P 500: the index tells you how the market is moving without giving you every individual stock price.
            </p>
            <p style={prose}>
              More than 20,000 diamond professionals in over 100 countries use Rapaport data daily. When a dealer says a stone is priced at "Rap minus 35%," they mean 35% below the Rapaport benchmark for that grade — that is the language of the wholesale trade.
            </p>

            {/* Section 2 */}
            <h2 style={h2Style}>How the RAPI™ Works</h2>
            <p style={prose}>
              Rapaport Group calculates the RAPI™ by tracking price changes across four key carat weight categories: 0.30 ct, 0.50 ct, 1.00 ct, and 3.00 ct. Each weight band represents a different segment of the market and can move independently.
            </p>
            <p style={prose}>
              The index measures round brilliant diamonds in D–H color and IF–VS2 clarity — the grades that dominate the global wholesale market. Fancy shapes (ovals, cushions, radiants) and fancy colors are not separately indexed but tend to follow similar directional trends with a lag of 3–6 months.
            </p>

            {/* Price movement table */}
            <div style={{ overflowX: "auto", margin: "1.75rem 0 2rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--body)", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "#111", color: "#fff" }}>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Carat Weight</th>
                    <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>12-Month Change</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>What This Means for Buyers</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { wt: "0.30 ct", change: "+1.80%", up: true, verdict: "Small stones are recovering. Buy now before another upward move." },
                    { wt: "0.50 ct", change: "+2.06%", up: true, verdict: "Fastest-rising segment. Half-carat prices have bottomed and are climbing." },
                    { wt: "1.00 ct", change: "−0.14%", up: false, verdict: "Essentially flat. The 1ct market is stable — ideal time to buy without urgency pressure." },
                    { wt: "3.00 ct", change: "+0.37%", up: true, verdict: "3ct has held value well. Lab alternatives remain the best way to get this size affordably." },
                  ].map((row, i) => (
                    <tr key={row.wt} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: "1px solid #ebebeb" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "#111" }}>{row.wt}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: row.up ? "#16a34a" : "#dc2626" }}>{row.change}</td>
                      <td style={{ padding: "12px 16px", color: "#555" }}>{row.verdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontFamily: "var(--body)", fontSize: "0.72rem", color: "#bbb", marginTop: "8px" }}>
                Aug 7, 2025 – Aug 7, 2026. Based on Rapaport benchmark methodology. RAPI™ is a trademark of Rapaport Group Inc.
              </p>
            </div>

            {/* Section 3 */}
            <h2 style={h2Style}>What the Numbers Mean for Diamond Buyers</h2>
            <p style={prose}>
              Most buyers never see the Rapaport Price List. But it affects every price tag you encounter — in a jeweller's showroom, on an e-commerce platform, and in resale markets.
            </p>
            <p style={prose}>
              Here is the key: retailers do not sell at Rapaport prices. They sell at a discount to Rapaport, and the depth of that discount tells you how competitive the seller is. A well-run online retailer like Blue Nile typically prices stones at 30–55% below the relevant Rapaport benchmark. A mall jeweller might price at Rapaport or above it.
            </p>
            <p style={prose}>
              When the RAPI™ rises, wholesale costs go up — and retail prices follow, usually within 2–3 months. When it falls, retailers are slower to pass savings along. Understanding the direction of the index helps you time a purchase or at least understand why prices are moving.
            </p>

            <h3 style={h3Style}>The 2022–2024 Correction — and Where We Are Now</h3>
            <p style={prose}>
              Natural diamond prices peaked in mid-2022 and then fell sharply through 2023 and into 2024 — the sharpest correction since 2009. The 1ct segment dropped roughly 25–30% from peak to trough. The trigger was a combination of post-pandemic demand normalisation and the rapid rise of lab-grown diamonds taking market share at lower price points.
            </p>
            <p style={prose}>
              By late 2024 and into 2025, the market found a floor. The RAPI™ data for August 2025 to August 2026 shows stabilisation: small stones recovering, 1ct essentially flat, 3ct holding. For buyers, this is actually a good window — you are buying at post-correction prices without the risk of another sharp drop.
            </p>

            {/* Section 4 */}
            <h2 style={h2Style}>Rapaport vs. Lab-Grown Diamond Prices</h2>
            <p style={prose}>
              The Rapaport Price List covers natural diamonds only. Lab-grown diamond pricing is entirely separate and has followed a much steeper downward path — lab prices fell roughly 70–80% from 2020 to 2025.
            </p>
            <p style={prose}>
              This matters because the RAPI™ trend gives you context for natural stone value, but if you are considering a lab-grown diamond, you need a different framework entirely. Lab prices are not anchored to Rapaport — they track production costs and retailer margins, which have compressed dramatically as supply scaled up.
            </p>
            <p style={prose}>
              See our full breakdown: <Link href="/lab-grown-vs-natural-diamond-price" style={{ color: "var(--gold)", textDecoration: "none" }}>Lab vs. Natural Diamond Prices — Complete Comparison</Link>.
            </p>

            {/* Section 5 */}
            <h2 style={h2Style}>How to Use Rapaport Data When Shopping</h2>
            <p style={prose}>
              You do not need access to the full Rapaport Price List to benefit from knowing how the benchmark works. Here is how to use it practically:
            </p>

            <h3 style={h3Style}>1. Use it to time your purchase</h3>
            <p style={prose}>
              If the RAPI™ is rising, do not wait. Retail prices will follow wholesale within a quarter. If it is flat or falling, you have more time — and more negotiating room.
            </p>

            <h3 style={h3Style}>2. Use it to evaluate a retailer</h3>
            <p style={prose}>
              Ask a retailer: "What is this stone priced at relative to Rapaport?" A good retailer will tell you — and a competitive online seller will already show you the lab or GIA report number so you can cross-reference. If a seller does not know or refuses to answer, that tells you something.
            </p>

            <h3 style={h3Style}>3. Use it to understand resale</h3>
            <p style={prose}>
              Natural diamonds typically resell at 20–50% of retail. The Rapaport benchmark is the ceiling of what the trade will pay — not what you paid. This is why buying a stone that holds strong RAPI™ grades (D–H, IF–VS2, Excellent cut) matters for long-term value retention.
            </p>

            <h3 style={h3Style}>4. Use the RAPI™ trend to negotiate</h3>
            <p style={prose}>
              If the index for your target carat weight has been falling, reference it. "I see the Rapaport index for 1ct stones has been flat for the past year — what discount to list can you offer?" Most jewellers with industry knowledge will respect the question and respond to it.
            </p>

            {/* Section 6 */}
            <h2 style={h2Style}>Which Carat Weight Should You Target?</h2>
            <p style={prose}>
              The RAPI™ trends by weight give buyers a genuine edge. Here is a quick read on each segment right now (Aug 2026):
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#ebebeb", border: "1px solid #ebebeb", margin: "1.5rem 0 2rem" }} className="rapi-weight-grid">
              {[
                { wt: "0.30–0.50 ct", label: "Side stones / accent", note: "Prices rising fastest. Lock in now if you are building a setting with melee or accent stones." },
                { wt: "1.00 ct", label: "Most popular size", note: "Flat market — this is the sweet spot for buyers. No urgency pressure. Maximum competition among retailers." },
                { wt: "2.00 ct", label: "Step-up size", note: "Not directly tracked by RAPI™ but follows the 1ct trend with a slight premium. Still well below 2022 peaks." },
                { wt: "3.00 ct+", label: "Statement / investment", note: "Holding value. Lab alternatives at this size offer the best value in the market right now." },
              ].map((row) => (
                <div key={row.wt} style={{ background: "#fff", padding: "1.25rem 1.5rem" }}>
                  <p style={{ fontFamily: "var(--heading)", fontSize: "1.05rem", fontWeight: 300, color: "#111", marginBottom: "4px" }}>{row.wt}</p>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "8px" }}>{row.label}</p>
                  <p style={{ fontFamily: "var(--body)", fontSize: "0.84rem", color: "#555", lineHeight: 1.65 }}>{row.note}</p>
                </div>
              ))}
            </div>

            {/* Section 7 — Farzana quote */}
            <blockquote style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "1.5rem", margin: "2rem 0", fontFamily: "var(--heading)", fontStyle: "italic", fontSize: "1.1rem", color: "#333", lineHeight: 1.6 }}>
              "Most buyers I work with have never heard of Rapaport. But every retailer they walk into has priced every stone against it. Knowing the index does not make you an expert — it just means you are speaking the same language as the people you are buying from."
              <footer style={{ fontFamily: "var(--body)", fontStyle: "normal", fontSize: "0.78rem", color: "#888", marginTop: "0.75rem" }}>
                — Farzana Hasan, GIA Expert
              </footer>
            </blockquote>

            {/* Section 8 */}
            <h2 style={h2Style}>The Rapaport Price List vs. the RAPI™ Index — What Is the Difference?</h2>
            <p style={prose}>
              These are two separate products from Rapaport Group, and the distinction matters.
            </p>
            <p style={prose}>
              The <strong>Rapaport Price List</strong> is a weekly, subscription-based table showing specific $/ct prices for every combination of color, clarity, and carat weight. It is the trade bible — used by dealers, manufacturers, and wholesalers. It is not public.
            </p>
            <p style={prose}>
              The <strong>RAPI™</strong> is a public index showing percentage changes in that list over a 12-month rolling period, segmented by carat weight. This is what Diamond Critics tracks and displays above. It tells you the direction and magnitude of price movement — which is what actually matters for timing a purchase.
            </p>
            <p style={prose}>
              Diamond Critics is not affiliated with Rapaport Group Inc. RAPI™ is a registered trademark of Rapaport Group. We report on the index as an independent editorial source, the same way financial publications report on market indices.
            </p>

            {/* Tools CTA */}
            <div style={{ background: "#fafafa", border: "1px solid #ebebeb", padding: "1.75rem 2rem", margin: "2.5rem 0", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "6px" }}>Free Tool</p>
                <p style={{ fontFamily: "var(--heading)", fontSize: "1.1rem", fontWeight: 300, color: "#111", marginBottom: "6px" }}>Diamond Price Calculator</p>
                <p style={{ fontFamily: "var(--body)", fontSize: "0.84rem", color: "#666", lineHeight: 1.6 }}>Enter any diamond specs to get an instant fair market value estimate based on GIA-certified pricing data.</p>
              </div>
              <Link
                href="/diamond-price-calculator"
                style={{ background: "#111", color: "#fff", fontFamily: "var(--body)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "13px 28px", textDecoration: "none", whiteSpace: "nowrap" }}
              >
                Use Calculator →
              </Link>
            </div>

            {/* FAQ */}
            <h2 style={{ ...h2Style, marginTop: "3.5rem" }}>Frequently Asked Questions</h2>

            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} style={{ borderTop: i === 0 ? "1px solid #ebebeb" : undefined, borderBottom: "1px solid #ebebeb", padding: "1.5rem 0" }}>
                <h3 style={{ fontFamily: "var(--body)", fontSize: "0.95rem", fontWeight: 600, color: "#111", marginBottom: "0.5rem" }}>
                  {faq.name}
                </h3>
                <p style={{ fontFamily: "var(--body)", fontSize: "0.88rem", color: "#555", lineHeight: 1.75, margin: 0 }}>
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            ))}

            {/* Disclaimer */}
            <div style={{ background: "#fafafa", border: "1px solid #ebebeb", padding: "1.25rem 1.5rem", margin: "3rem 0 0", borderLeft: "3px solid #ddd" }}>
              <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "#888", lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: "#555" }}>Editorial Note:</strong> Diamond Critics is an independent editorial publication. We are not affiliated with, endorsed by, or sponsored by Rapaport Group Inc. RAPI™ and Rapaport are trademarks of Rapaport Group Inc. The trend data displayed in the chart above is compiled by Diamond Critics from publicly available market information. It does not reproduce the proprietary Rapaport Price List. For professional trade pricing data, visit{" "}
                <a href="https://rapaport.com/" target="_blank" rel="nofollow noopener noreferrer" style={{ color: "#888", textDecoration: "underline" }}>rapaport.com</a>.
              </p>
            </div>

            {/* See Also */}
            <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #ebebeb" }}>
              <p style={{ fontFamily: "var(--body)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: "1rem" }}>
                See Also
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }} className="see-also-grid">
                {[
                  { label: "Diamond Price Calculator", href: "/diamond-price-calculator" },
                  { label: "Lab vs. Natural Diamond Prices", href: "/lab-grown-vs-natural-diamond-price" },
                  { label: "Diamond Prices — Full Guide", href: "/diamond-prices" },
                  { label: "Diamond 4Cs Explained", href: "/diamond-4cs" },
                  { label: "Diamond Clarity Chart", href: "/diamond-clarity-chart" },
                  { label: "Diamond Color Scale", href: "/diamond-color-scale" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} style={{ fontFamily: "var(--body)", fontSize: "0.85rem", color: "var(--gold)", textDecoration: "none" }}>
                      → {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </article>

      <style>{`
        @media (max-width: 600px) {
          .rapi-weight-grid { grid-template-columns: 1fr !important; }
          .see-also-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
