import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Farzana Hasan — GIA-Certified Diamond Expert",
  description:
    "Farzana Hasan is a GIA Expert and jewelry specialist with over a decade of experience in diamond grading, light performance analysis, and consumer advocacy.",
  openGraph: {
    title: "About Farzana Hasan — GIA-Certified Diamond Expert",
    description:
      "The diamond industry's independent critic. Farzana Hasan provides rigorous, data-backed audits so you can buy with total confidence.",
    images: [{ url: "/images/farzana-hasan-headshot-imagee.avif" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Farzana Hasan",
  "url": "https://diamondcritics.com/about-farzana",
  "mainEntity": {
    "@type": "Person",
    "name": "Farzana Hasan",
    "jobTitle": "GIA-Certified Diamond Expert",
    "url": "https://diamondcritics.com/about-farzana",
    "image": "https://diamondcritics.com/images/farzana-hasan-headshot-imagee.avif",
    "description":
      "Farzana Hasan is a GIA Expert and jewelry specialist with over a decade of experience in diamond grading and consumer advocacy.",
    "knowsAbout": [
      "Diamond Grading",
      "Jewelry Appraisal",
      "Light Performance",
      "Consumer Advocacy",
      "Lab-Grown Diamonds",
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Diamond Critics",
      "url": "https://diamondcritics.com",
    },
    "sameAs": ["https://diamondcritics.com"],
  },
};

const publications = [
  "Forbes", "Vogue", "The New York Times", "Harper's Bazaar",
  "ELLE", "People", "Page Six", "Vanity Fair",
];

export default function AboutFarzana() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main
        itemScope
        itemType="https://schema.org/Person"
        style={{ fontFamily: "var(--body)", color: "#111", background: "#fff", textAlign: "center" }}
      >
        <meta itemProp="name" content="Farzana Hasan" />
        <meta itemProp="jobTitle" content="GIA-Certified Diamond Expert" />
        <meta itemProp="url" content="https://diamondcritics.com/about-farzana" />
        <meta itemProp="image" content="https://diamondcritics.com/images/farzana-hasan-headshot-imagee.avif" />

        {/* ── Hero ── */}
        <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 2rem 20px" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: "#888", marginBottom: "1.25rem" }}>
            Founder &amp; Lead Critic
          </p>

          <h1 style={{
            fontFamily: "var(--body)",
            fontWeight: 400,
            fontSize: "clamp(2.2rem, 6vw, 4.25rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "2rem",
          }}>
            The critic behind{" "}
            <br />
            <em style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", color: "#575757" }}>
              the brilliance.
            </em>
          </h1>

          <picture>
            <source srcSet="/images/farzana-hasan-headshot-imagee.avif" type="image/avif" />
            <img
              src="/images/farzana-hasan-headshot-imagee.jpg"
              alt="Farzana Hasan — GIA Expert and Diamond Critic"
              itemProp="image"
              width={450}
              height={563}
              fetchPriority="high"
              style={{
                width: "100%",
                maxWidth: "420px",
                aspectRatio: "4/5",
                objectFit: "cover",
                margin: "0 auto 3rem",
                display: "block",
                border: "1px solid #eee",
                padding: "10px",
                background: "#fff",
              }}
            />
          </picture>

          <p itemProp="description" style={{ fontFamily: "var(--body)", fontSize: "1.05rem", color: "#333", maxWidth: "780px", margin: "0 auto 2rem", lineHeight: 1.8 }}>
            For over a decade, Farzana Hasan has been the diamond industry&apos;s quiet disruptor.
            Combining technical gemology with an unwavering commitment to consumer advocacy,
            she founded Diamond Critics to dismantle the smoke and mirrors of high-end jewelry retail.
          </p>
        </section>

        {/* ── Ticker ── */}
        <div style={{ width: "100%", overflow: "hidden", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", padding: "20px 0", margin: "2rem 0" }}>
          <div className="about-ticker-track">
            {[...publications, ...publications].map((name, i) => (
              <span key={i} style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(1rem, 3vw, 1.35rem)",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#000",
                padding: "0 3rem",
              }}>
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* ── Legacy ── */}
        <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" }}>
          <div style={{ borderTop: "1px solid #000", width: "60px", margin: "0 auto 2rem" }} />
          <h2 style={{ fontFamily: "var(--body)", fontWeight: 400, fontSize: "clamp(1.75rem, 4vw, 2.25rem)", marginBottom: "1.5rem" }}>
            A legacy of{" "}
            <em style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic" }}>light.</em>
          </h2>
          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "#333", maxWidth: "780px", margin: "0 auto 1.5rem", lineHeight: 1.8 }}>
            Farzana&apos;s obsession with diamonds isn&apos;t just a career — it&apos;s in her blood.
            Growing up under the meticulous guidance of her father, a respected GIA Specialist,
            she learned to evaluate stones through a jeweler&apos;s loupe before she could drive.
          </p>
          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "#333", maxWidth: "780px", margin: "0 auto", lineHeight: 1.8 }}>
            That early education in precision and honesty became the foundation for everything
            Diamond Critics stands for: no sponsorships, no retailer bias, only the truth about
            what a stone is actually worth.
          </p>
        </section>

        {/* ── Black quote box ── */}
        <div style={{ background: "#111", color: "#fff", padding: "clamp(4rem, 10vw, 7.5rem) 2rem", margin: "2rem 0" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: "#555", marginBottom: "2.5rem" }}>
            The Critic&apos;s Perspective
          </p>
          <blockquote style={{
            fontFamily: "var(--heading)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
            lineHeight: 1.3,
            color: "#fff",
            maxWidth: "920px",
            margin: "0 auto 2.5rem",
          }}>
            &ldquo;You aren&apos;t just buying a stone; you&apos;re investing in a moment.&rdquo;
          </blockquote>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.88rem", color: "#777", maxWidth: "680px", margin: "0 auto 2.5rem", lineHeight: 1.75 }}>
            Farzana Hasan leverages over a decade of industry expertise to dismantle the
            &lsquo;smoke and mirrors&rsquo; of the jewelry trade.
          </p>
          <Link href="/contact"
            style={{
              display: "inline-block",
              padding: "18px 45px",
              background: "#fff",
              color: "#000",
              textDecoration: "none",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "0.7rem",
              fontFamily: "var(--body)",
            }}>
            Connect with Farzana
          </Link>
        </div>

        {/* ── Buyer's advocate ── */}
        <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>
          <div style={{ borderTop: "1px solid #000", width: "60px", margin: "0 auto 2rem" }} />
          <h2 style={{ fontFamily: "var(--body)", fontWeight: 400, fontSize: "clamp(1.75rem, 4vw, 2.25rem)", marginBottom: "1.5rem" }}>
            The buyer&apos;s{" "}
            <em style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic" }}>advocate.</em>
          </h2>
          <p style={{ fontFamily: "var(--body)", fontSize: "1rem", color: "#333", maxWidth: "780px", margin: "0 auto 2rem", lineHeight: 1.8 }}>
            Today, Farzana provides the rigorous, independent audits that the jewelry industry
            desperately needs. She works for the buyer, analyzing light performance and pricing
            models so you can buy with total confidence.
          </p>
          <Link href="/category/diamond-retailer-reviews"
            style={{
              display: "inline-block",
              padding: "18px 45px",
              border: "1px solid #111",
              color: "#111",
              textDecoration: "none",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "0.7rem",
              fontFamily: "var(--body)",
            }}>
            Read Farzana&apos;s Reviews
          </Link>
        </section>
      </main>
    </>
  );
}
