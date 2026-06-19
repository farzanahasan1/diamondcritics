import Link from "next/link";

const socials = [
  {
    label: "X / Twitter",
    href: "https://x.com/diamondcritics",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/diamondcritics/",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/channel/UCP4kx9XpVpeMqkMcD-9fslg/",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/diamondcritics/",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
];

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
                padding: "9px 18px", textDecoration: "none", marginBottom: "1.75rem",
              }}
            >
              Shop Blue Nile →
            </a>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "12px" }}>
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label} className="footer-social"
                >
                  {s.svg}
                </a>
              ))}
            </div>
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
