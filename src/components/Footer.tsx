import Link from "next/link";

const explore = [
  { label: "Retailer Reviews", href: "/category/diamond-retailer-reviews" },
  { label: "Diamond Guides", href: "/category/diamond-buying-guides" },
  { label: "Lab vs Natural", href: "/lab-grown-vs-natural-diamond-price" },
  { label: "Diamond Prices", href: "/diamond-prices" },
  { label: "Clarity Chart", href: "/diamond-clarity-chart" },
  { label: "Color Scale", href: "/diamond-color-scale" },
];

const company = [
  { label: "About Farzana", href: "/about-farzana" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
];

const tools = [
  { label: "Diamond Price Calculator", href: "/diamond-price-calculator" },
  { label: "Resale Value Calculator", href: "/diamond-resale-value-calculator" },
  { label: "4Cs Explained", href: "/diamond-4cs" },
  { label: "Shapes Guide", href: "/diamond-shapes-guide" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#141414", color: "#fff", padding: "5rem 0 2.5rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>

        {/* Top grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "4rem" }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ marginBottom: "1.25rem" }}>
              <picture>
                <source srcSet="/images/diamond-critics-icon-logo-small.avif" type="image/avif" />
                <img
                  src="/images/diamond-critics-icon-logo-small.png"
                  alt="Diamond Critics"
                  style={{ height: "48px", width: "auto", display: "block", filter: "brightness(0) invert(1)" }}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <p style={{ fontFamily: "var(--heading)", fontWeight: 300, fontSize: "1.3rem", color: "#fff", marginBottom: "4px" }}>
              Diamond <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Critics</em>
            </p>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.78rem", color: "#555", lineHeight: 1.7, maxWidth: "240px", marginBottom: "1.75rem" }}>
              Independent, data-backed diamond analysis by Farzana Hasan, GIA Expert. No sponsored content.
            </p>
            <a
              href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "var(--gold)", color: "#111",
                fontFamily: "var(--body)", fontSize: "0.68rem", fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "9px 18px", textDecoration: "none",
              }}
            >
              Shop Blue Nile →
            </a>
          </div>

          {/* Explore */}
          <div>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: "1.25rem" }}>
              Explore
            </p>
            <div>
              {explore.map((l) => (
                <Link key={l.href} href={l.href} style={{ display: "block", fontFamily: "var(--body)", fontSize: "0.85rem", color: "#888", textDecoration: "none", marginBottom: "10px" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: "1.25rem" }}>
              Tools
            </p>
            <div>
              {tools.map((l) => (
                <Link key={l.href} href={l.href} style={{ display: "block", fontFamily: "var(--body)", fontSize: "0.85rem", color: "#888", textDecoration: "none", marginBottom: "10px" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p style={{ fontFamily: "var(--body)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: "1.25rem" }}>
              Company
            </p>
            <div>
              {company.map((l) => (
                <Link key={l.href} href={l.href} style={{ display: "block", fontFamily: "var(--body)", fontSize: "0.85rem", color: "#888", textDecoration: "none", marginBottom: "10px" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid #222", paddingTop: "1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.75rem", color: "#444" }}>
            © {new Date().getFullYear()} Diamond Critics · Unbiased Brilliance
          </p>
          <p style={{ fontFamily: "var(--body)", fontSize: "0.72rem", color: "#3a3a3a", maxWidth: "520px", lineHeight: 1.6 }}>
            Affiliate Disclosure: Diamond Critics earns compensation from retailers we review. Our analysis is always independent.
          </p>
        </div>

      </div>
    </footer>
  );
}
