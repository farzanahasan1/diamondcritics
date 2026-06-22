import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Farzana Hasan — GIA-Certified Diamond Expert",
  description:
    "Farzana Hasan is a GIA Expert and independent diamond critic with over a decade of experience in light performance analysis, grading, and consumer advocacy.",
  alternates: { canonical: "https://diamondcritics.com/about-farzana" },
  openGraph: {
    title: "About Farzana Hasan — GIA-Certified Diamond Expert",
    description:
      "The diamond industry's independent critic. Farzana Hasan provides rigorous, data-backed audits so you can buy with total confidence.",
    url: "https://diamondcritics.com/about-farzana",
    type: "profile",
    siteName: "Diamond Critics",
    images: [{ url: "/images/farzana-hasan-headshot-imagee.avif", width: 1200, height: 630 }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "dateCreated": "2024-01-01",
  "dateModified": "2026-06-23",
  "url": "https://diamondcritics.com/about-farzana",
  "name": "About Farzana Hasan — GIA-Certified Diamond Expert",
  "description": "Author profile page for Farzana Hasan, GIA-Certified Diamond Expert and founder of Diamond Critics.",
  "mainEntity": {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Farzana Hasan",
    "givenName": "Farzana",
    "familyName": "Hasan",
    "jobTitle": "GIA-Certified Diamond Expert",
    "description": "Farzana Hasan is a GIA Expert and independent diamond critic with over a decade of experience in diamond grading, light performance analysis, and consumer advocacy.",
    "url": "https://diamondcritics.com/about-farzana",
    "image": {
      "@type": "ImageObject",
      "url": "https://diamondcritics.com/images/farzana-hasan-headshot-imagee.avif",
      "width": 450,
      "height": 563,
    },
    "email": "farzana@diamondcritics.com",
    "knowsAbout": [
      "Diamond Grading",
      "GIA Certification",
      "Light Performance Analysis",
      "Round Brilliant Cut Diamonds",
      "Lab-Grown Diamonds",
      "Jewelry Appraisal",
      "Diamond 4Cs",
      "Consumer Advocacy",
      "Blue Nile Diamond Inventory",
      "IGI Certification",
    ],
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "GIA Graduate Gemologist Expert",
      "credentialCategory": "Professional Certification",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Gemological Institute of America",
        "url": "https://www.gia.edu",
      },
    },
    "alumniOf": {
      "@type": "Organization",
      "name": "Gemological Institute of America",
      "url": "https://www.gia.edu",
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Diamond Critics",
      "url": "https://diamondcritics.com",
    },
    "founder": {
      "@type": "Organization",
      "name": "Diamond Critics",
      "url": "https://diamondcritics.com",
    },
    "sameAs": [
      "https://diamondcritics.com",
      "https://x.com/diamondcritics",
      "https://www.pinterest.com/diamondcritics/",
      "https://youtube.com/channel/UCP4kx9XpVpeMqkMcD-9fslg/",
      "https://www.linkedin.com/in/farzana-hasan-diamondcritics/",
    ],
  },
};

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "76+", label: "Buying Guides" },
  { value: "GIA", label: "Certified Expert" },
  { value: "$2B+", label: "Diamonds Analyzed" },
];

const methodology = [
  {
    number: "01",
    title: "Certificate First",
    body: "Every diamond reviewed starts with the GIA or IGI grading report — not the photo, not the price. Certificate data is the only objective anchor in a market designed to confuse buyers.",
  },
  {
    number: "02",
    title: "Proportions Over Brand",
    body: "Pavilion angle, crown angle, table percentage, girdle thickness — these numbers determine light performance. No marketing designation overrides what the proportions actually say.",
  },
  {
    number: "03",
    title: "Price Verified Against Live Inventory",
    body: "All price references are pulled from live Blue Nile inventory with affiliate-disclosed links. If the price changes, the analysis may change — no manufactured benchmarks.",
  },
  {
    number: "04",
    title: "No Retailer Sponsorships",
    body: "Diamond Critics earns through disclosed affiliate commissions only. No brand pays for editorial placement. Every recommendation must survive independent scrutiny.",
  },
];

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

      <div style={{ fontFamily: "var(--body)", color: "#111", background: "#fff" }}>

        {/* ── Hero ── */}
        <section style={{ background: "#0d0d0d", color: "#fff", padding: "0 0 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", alignItems: "stretch", minHeight: "600px" }} className="about-hero-grid">

            {/* Left: Text */}
            <div style={{ padding: "clamp(3rem, 8vw, 6rem) 2rem clamp(3rem, 8vw, 6rem) 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.5rem" }}>
                Founder &amp; Lead Critic
              </p>
              <h1 style={{
                fontFamily: "var(--heading)",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#fff",
                marginBottom: "1.75rem",
              }}>
                Farzana<br />Hasan
              </h1>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "2rem" }}>
                GIA-Certified Diamond Expert
              </p>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: "480px", marginBottom: "2.5rem" }}>
                For over a decade, Farzana has been the diamond industry&apos;s quiet disruptor — combining technical gemology with an unwavering commitment to the buyer.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/round-cut-diamond" style={{
                  display: "inline-block",
                  padding: "14px 36px",
                  background: "var(--gold)",
                  color: "#000",
                  textDecoration: "none",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  fontSize: "0.65rem",
                }}>
                  Read the Guides
                </Link>
                <Link href="/contact" style={{
                  display: "inline-block",
                  padding: "14px 36px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  fontSize: "0.65rem",
                }}>
                  Contact
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div style={{ position: "relative", overflow: "hidden", minHeight: "500px" }} className="about-hero-image-wrap">
              <img
                src="/images/farzana-hasan-headshot-imagee.avif"
                alt="Farzana Hasan — GIA Expert and Diamond Critic"
                fetchPriority="high"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                  display: "block",
                  filter: "grayscale(20%) brightness(0.92)",
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0d0d0d 0%, #0d0d0d 5%, rgba(13,13,13,0.6) 30%, rgba(13,13,13,0.15) 55%, transparent 75%)" }} />
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <div style={{ background: "#f8f8f8", borderBottom: "1px solid #e8e8e8" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="about-stats-grid">
            {stats.map((s) => (
              <div key={s.value} style={{ padding: "2.25rem 2rem", borderRight: "1px solid #e8e8e8", textAlign: "center" }} className="about-stat-item">
                <p style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "#111", marginBottom: "0.4rem" }}>
                  {s.value}
                </p>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Publication ticker ── */}
        <div style={{ width: "100%", overflow: "hidden", borderBottom: "1px solid #eee", padding: "18px 0" }}>
          <div className="about-ticker-track">
            {[...publications, ...publications].map((name, i) => (
              <span key={i} style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(0.85rem, 2.5vw, 1.15rem)",
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                color: "#999",
                padding: "0 2.5rem",
              }}>
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* ── Origin story ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "6rem 2rem", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "5rem", alignItems: "start" }} className="about-origin-grid">
          <div>
            <div style={{ borderTop: "2px solid #111", paddingTop: "1.5rem" }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#888", marginBottom: "0.75rem" }}>
                Background
              </p>
              <p style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "1.5rem", color: "#111", lineHeight: 1.4 }}>
                A legacy of light.
              </p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "1.05rem", color: "#333", lineHeight: 1.85, marginBottom: "1.5rem" }}>
              Farzana&apos;s obsession with diamonds isn&apos;t a career choice — it&apos;s inheritance. Growing up under the guidance of her father, a respected GIA Specialist, she learned to evaluate stones through a jeweler&apos;s loupe before she could drive. That early education in precision and honesty became the foundation for everything Diamond Critics stands for.
            </p>
            <p style={{ fontSize: "1.05rem", color: "#333", lineHeight: 1.85 }}>
              After completing her own GIA certification and spending years inside the wholesale trade, Farzana recognized a fundamental gap: buyers had no independent voice. Retailers controlled all the information. She founded Diamond Critics to close that gap — no sponsorships, no retailer bias, only the truth about what a stone is actually worth.
            </p>
          </div>
        </section>

        {/* ── Quote ── */}
        <div style={{ background: "#111", color: "#fff", padding: "clamp(4rem, 10vw, 8rem) 2rem" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#444", marginBottom: "2.5rem" }}>
              The Critic&apos;s Perspective
            </p>
            <blockquote style={{
              fontFamily: "var(--heading)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
              lineHeight: 1.35,
              color: "#fff",
              margin: "0 0 2.5rem",
            }}>
              &ldquo;You aren&apos;t just buying a stone — you&apos;re investing in a moment. It deserves the same rigour as any financial decision.&rdquo;
            </blockquote>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#555" }}>
              — Farzana Hasan, GIA Expert
            </p>
          </div>
        </div>

        {/* ── Methodology ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "6rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>
              How the Reviews Work
            </p>
            <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "#111" }}>
              The methodology.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0" }} className="about-method-grid">
            {methodology.map((item, i) => (
              <div key={item.number} style={{
                padding: "2.5rem",
                borderTop: "1px solid #e8e8e8",
                borderRight: i % 2 === 0 ? "1px solid #e8e8e8" : "none",
              }}>
                <p style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "2.5rem", color: "#ddd", marginBottom: "1rem" }}>
                  {item.number}
                </p>
                <h3 style={{ fontFamily: "var(--body)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#111", marginBottom: "0.75rem" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.8 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Credential strip ── */}
        <div style={{ background: "#0d0d0d", padding: "3rem 2rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#444", marginBottom: "0.5rem" }}>
                Certification
              </p>
              <p style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "1.35rem", color: "#fff" }}>
                GIA Graduate Gemologist Expert
              </p>
            </div>
            <div style={{ width: "1px", height: "50px", background: "#222" }} className="about-divider" />
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#444", marginBottom: "0.5rem" }}>
                Specialisation
              </p>
              <p style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "1.35rem", color: "#fff" }}>
                Round Brilliant Light Performance
              </p>
            </div>
            <div style={{ width: "1px", height: "50px", background: "#222" }} className="about-divider" />
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#444", marginBottom: "0.5rem" }}>
                Published Since
              </p>
              <p style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "1.35rem", color: "#fff" }}>
                2024
              </p>
            </div>
            <Link href="/contact" style={{
              display: "inline-block",
              padding: "14px 36px",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: "0.65rem",
              whiteSpace: "nowrap",
            }}>
              Contact Farzana
            </Link>
          </div>
        </div>

        {/* ── Read the guides CTA ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "6rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#888", marginBottom: "1.25rem" }}>
            Start Here
          </p>
          <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "#111", marginBottom: "1.5rem" }}>
            76 guides. Zero compromise.
          </h2>
          <p style={{ fontSize: "1rem", color: "#555", lineHeight: 1.8, maxWidth: "560px", margin: "0 auto 2.5rem" }}>
            Every round diamond guide, price analysis, and shape comparison — written with GIA-certified precision so you never overpay.
          </p>
          <Link href="/category/round-cut-diamond" style={{
            display: "inline-block",
            padding: "16px 48px",
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontSize: "0.7rem",
          }}>
            Browse All Guides
          </Link>
        </section>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .about-hero-image-wrap { min-height: 380px !important; }
          .about-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-stat-item:nth-child(2) { border-right: none !important; }
          .about-origin-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .about-method-grid { grid-template-columns: 1fr !important; }
          .about-method-grid > div { border-right: none !important; }
          .about-divider { display: none !important; }
        }
        @media (max-width: 480px) {
          .about-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        .about-ticker-track {
          display: flex;
          animation: ticker 28s linear infinite;
          white-space: nowrap;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
