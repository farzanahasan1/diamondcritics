"use client";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SITE = "https://diamondcritics.com";

// Pinterest pin title = image filename with hyphens removed (auto-generated)
function pinTitle(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Pinterest uses PNG — AVIF may not be supported by their image crawler
function buildPinUrl(src: string, pageHref: string, alt: string) {
  const imgUrl = SITE + "/images/" + src.replace(/\.avif$/, ".png").replace(/\.jpg$/, ".jpg");
  return (
    "https://pinterest.com/pin/create/button/" +
    "?url=" + encodeURIComponent(SITE + pageHref) +
    "&media=" + encodeURIComponent(imgUrl) +
    "&description=" + encodeURIComponent(alt)
  );
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Img = {
  src: string;   // filename in /public/images/  (AVIF)
  alt: string;   // ← EDIT THIS — alt text = Pinterest pin description
  href: string;  // page this image links to
  label: string; // text shown below the image
};
type Section = { heading: string; links: { label: string; href: string }[] };
type NavItem = {
  label: string;
  href?: string;
  mega?: { featured: Img[]; sections: Section[]; viewAll?: { label: string; href: string } };
};

// ─── NAV DATA ─────────────────────────────────────────────────────────────────
// HOW TO EDIT:
//   alt   → change any alt text below; it becomes the Pinterest pin description
//   href  → change where the image links to
//   src   → change the image filename (must exist in /public/images/)
//   label → change the caption below the image
// Pinterest pin TITLE is auto-generated from the filename (hyphens → spaces).
// ─────────────────────────────────────────────────────────────────────────────
const nav: NavItem[] = [
  {
    label: "Guides",
    mega: {
      featured: [
        {
          src: "infographic-for-diamond-4c-clarity.avif",
          alt: "Complete infographic explaining diamond 4Cs — cut, color, clarity, and carat weight",
          href: "/diamond-4cs",
          label: "Diamond 4Cs Explained",
        },
        {
          src: "lab-grown-vs-natural-diamond-price-2026-resale-value.avif",
          alt: "Lab-grown vs natural diamond price comparison and 2026 resale value analysis",
          href: "/lab-grown-vs-natural-diamond-price",
          label: "Lab vs Natural",
        },
        {
          src: "round-brilliant-diamond-benchmark.avif",
          alt: "Round brilliant diamond benchmark — what a perfectly cut stone actually looks like",
          href: "/diamond-prices",
          label: "Diamond Prices 2026",
        },
      ],
      sections: [
        {
          heading: "Buying Guides",
          links: [
            { label: "Diamond 4Cs", href: "/diamond-4cs" },
            { label: "Clarity Chart", href: "/diamond-clarity-chart" },
            { label: "Color Scale", href: "/diamond-color-scale" },
            { label: "Diamond Shapes", href: "/diamond-shapes-guide" },
            { label: "Cut Guide", href: "/diamond-cut-guide" },
            { label: "Size Chart", href: "/diamond-size-chart" },
          ],
        },
        {
          heading: "Price & Value",
          links: [
            { label: "Diamond Prices", href: "/diamond-prices" },
            { label: "Lab vs Natural", href: "/lab-grown-vs-natural-diamond-price" },
            { label: "Price Calculator", href: "/diamond-price-calculator" },
            { label: "Resale Calculator", href: "/diamond-resale-value-calculator" },
          ],
        },
      ],
      viewAll: { label: "All Guides", href: "/category/diamond-buying-guides" },
    },
  },
  {
    label: "Clarity",
    mega: {
      featured: [
        {
          src: "vvs1-diamond-inclusions-pinpoints-needles-vs-si1-crystals.avif",
          alt: "VVS1 diamond inclusions — pinpoints and needles vs SI1 crystals under magnification",
          href: "/vvs1-diamond-clarity",
          label: "VVS1 Clarity",
        },
        {
          src: "vs1-diamond-inclusions-glossary.avif",
          alt: "VS1 diamond inclusions glossary — types and visual examples for buyers",
          href: "/vs1-clarity-diamonds",
          label: "VS1 Clarity",
        },
        {
          src: "si-clarity-diamond-definition.avif",
          alt: "SI clarity diamond definition with eye-clean test results and complete buying guide",
          href: "/si-clarity-diamond",
          label: "SI Clarity",
        },
      ],
      sections: [
        {
          heading: "High Clarity",
          links: [
            { label: "IF & FL Clarity", href: "/if-and-fl-diamond-clarity" },
            { label: "VVS1 Clarity", href: "/vvs1-diamond-clarity" },
            { label: "VVS2 Clarity", href: "/vvs2-diamond-clarity" },
          ],
        },
        {
          heading: "Eye-Clean Grades",
          links: [
            { label: "VS1 Clarity", href: "/vs1-clarity-diamonds" },
            { label: "VS2 Clarity", href: "/vs2-clarity-diamond" },
            { label: "SI Clarity", href: "/si-clarity-diamond" },
          ],
        },
      ],
      viewAll: { label: "Clarity Chart", href: "/diamond-clarity-chart" },
    },
  },
  {
    label: "Color",
    mega: {
      featured: [
        {
          src: "round-brilliant-diamond-color-clarity-guide-what-grade-you-actually-need.avif",
          alt: "Round brilliant diamond color and clarity guide — what grade you actually need for your budget",
          href: "/diamond-color-scale",
          label: "Color Scale Guide",
        },
        {
          src: "f-color-diamond-colorless-premium-g-grade-solution.avif",
          alt: "F color diamond — colorless premium vs G grade value comparison for smart buyers",
          href: "/f-color-diamond",
          label: "F Color Diamond",
        },
        {
          src: "g-color-diamond-price-crash-2026-market-floor-solution.avif",
          alt: "G color diamond 2026 price crash — market floor analysis and smart buying strategy",
          href: "/g-color-diamond",
          label: "G Color Diamond",
        },
      ],
      sections: [
        {
          heading: "Colorless D–F",
          links: [
            { label: "D Color Diamond", href: "/d-color-diamond" },
            { label: "E Color Diamond", href: "/e-color-diamond" },
            { label: "F Color Diamond", href: "/f-color-diamond" },
          ],
        },
        {
          heading: "Near-Colorless G–J",
          links: [
            { label: "G Color Diamond", href: "/g-color-diamond" },
            { label: "H Color Diamond", href: "/h-color-diamond" },
          ],
        },
      ],
      viewAll: { label: "Color Scale", href: "/diamond-color-scale" },
    },
  },
  {
    label: "Shapes",
    mega: {
      featured: [
        {
          src: "what-is-a-round-brilliant-cut-diamond-editorial-guide.avif",
          alt: "What is a round brilliant cut diamond — editorial guide to the world's most popular shape",
          href: "/round-cut-diamond",
          label: "Round Brilliant",
        },
        {
          src: "oval-cut-diamond-guide-feature-image.avif",
          alt: "Oval cut diamond guide — ideal proportions, the bow-tie effect, and 2026 price trends",
          href: "/oval-cut-diamond",
          label: "Oval Cut",
        },
        {
          src: "what-is-an-emerald-cut-diamond-editorial-infographic.avif",
          alt: "What is an emerald cut diamond — step-cut facets and hall of mirrors effect explained",
          href: "/emerald-cut-diamond",
          label: "Emerald Cut",
        },
      ],
      sections: [
        {
          heading: "Brilliant Cuts",
          links: [
            { label: "Round Cut", href: "/round-cut-diamond" },
            { label: "Princess Cut", href: "/princess-cut-diamond" },
            { label: "Cushion Cut", href: "/cushion-cut-diamond" },
            { label: "Oval Cut", href: "/oval-cut-diamond" },
          ],
        },
        {
          heading: "Round Diamond Deep Dive",
          links: [
            { label: "1ct Price Audit", href: "/1-carat-round-diamond-price" },
            { label: "Round vs Oval", href: "/round-diamond-vs-oval-diamond" },
            { label: "Hearts & Arrows", href: "/hearts-and-arrows-diamond" },
            { label: "Ring Settings Guide", href: "/round-diamond-engagement-ring-settings" },
            { label: "Lab Grown Round", href: "/lab-grown-round-diamond" },
          ],
        },
      ],
      viewAll: { label: "All Round Cut Guides", href: "/category/round-cut-diamond" },
    },
  },
  {
    label: "Reviews",
    mega: {
      featured: [
        {
          src: "Blue-Nile-Review-2026-Why-Most-Buyers-Overpay-And-How-to-Save-Thousands.avif",
          alt: "Blue Nile Review 2026 — why most buyers overpay and how to save thousands on diamonds",
          href: "/blue-nile-review",
          label: "Blue Nile Review",
        },
        {
          src: "Blue-Nile-Bracelets-Review-The-5-Point-Checklist-Before-You-Checkout.avif",
          alt: "Blue Nile bracelets review — Farzana's 5-point checklist before you checkout",
          href: "/blue-nile-bracelets-review",
          label: "Bracelets Review",
        },
        {
          src: "Blue-Nile-Lab-Grown-Diamond-Rings-Review-I-Audited-40-Stones-So-You-Dont-Waste-2930–21540.avif",
          alt: "Blue Nile lab-grown diamond rings review — I audited 40 stones so you don't waste money",
          href: "/blue-nile-lab-grown-diamond-rings-review",
          label: "Lab-Grown Rings",
        },
      ],
      sections: [
        {
          heading: "Blue Nile",
          links: [
            { label: "Blue Nile Review", href: "/blue-nile-review" },
            { label: "Bracelets", href: "/blue-nile-bracelets-review" },
            { label: "Earrings", href: "/blue-nile-earrings-review" },
            { label: "Men's Rings", href: "/blue-nile-mens-rings-review" },
          ],
        },
        {
          heading: "More Reviews",
          links: [
            { label: "Lab-Grown Rings", href: "/blue-nile-lab-grown-diamond-rings-review" },
            { label: "Men's Chains", href: "/blue-nile-mens-chains-review" },
          ],
        },
      ],
      viewAll: { label: "All Reviews", href: "/category/diamond-retailer-reviews" },
    },
  },
  { label: "Calculators", href: "/diamond-price-calculator" },
  { label: "About", href: "/about-farzana" },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const ChevronDown = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.45, flexShrink: 0 }}>
    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 180);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const closeAll = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(null);
  }, []);

  const activeMega = openDropdown
    ? (nav.find((item) => item.label === openDropdown)?.mega ?? null)
    : null;

  return (
    <header style={{
      background: "#fff",
      borderBottom: "1px solid #ebebeb",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* ── Header bar ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, textDecoration: "none" }} onClick={closeAll}>
            <picture style={{ display: "block" }} className="header-logo-full">
              <source srcSet="/images/diamond-critics-main-logo-small.avif" type="image/avif" />
              <img src="/images/diamond-critics-main-logo-small.png" alt="Diamond Critics"
                style={{ height: "38px", width: "auto", display: "block" }}
                fetchPriority="high" decoding="async" />
            </picture>
            <picture style={{ display: "none" }} className="header-logo-icon">
              <source srcSet="/images/diamond-critics-icon-logo-small.avif" type="image/avif" />
              <img src="/images/diamond-critics-icon-logo-small.png" alt="Diamond Critics"
                style={{ height: "38px", width: "auto", display: "block" }}
                fetchPriority="high" decoding="async" />
            </picture>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2px" }} className="header-nav">
            {nav.map((item) =>
              item.mega ? (
                <div
                  key={item.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => openMenu(item.label)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "8px 12px",
                      fontFamily: "var(--body)", fontSize: "0.82rem",
                      fontWeight: openDropdown === item.label ? 600 : 500,
                      color: openDropdown === item.label ? "#141414" : "#555",
                      background: "none", border: "none", cursor: "pointer",
                      transition: "color 0.15s",
                    }}
                  >
                    {item.label}
                    <ChevronDown />
                  </button>
                  {/* Gold underline when active */}
                  {openDropdown === item.label && (
                    <div style={{
                      position: "absolute", bottom: 0, left: "12px", right: "12px",
                      height: "2px", background: "var(--gold)",
                    }} />
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  style={{
                    padding: "8px 12px",
                    fontFamily: "var(--body)", fontSize: "0.82rem", fontWeight: 500,
                    color: "#555", textDecoration: "none",
                  }}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a
              href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
              target="_blank" rel="noopener noreferrer"
              className="header-cta"
              style={{
                background: "#141414", color: "#fff",
                fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600,
                padding: "9px 18px", textDecoration: "none",
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}
            >
              Shop Blue Nile →
            </a>
            <button
              className="header-hamburger"
              onClick={() => { setMobileOpen(!mobileOpen); closeAll(); }}
              aria-label="Menu"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }}
            >
              <div style={{ width: "22px", height: "1.5px", background: "#111", marginBottom: "5px" }} />
              <div style={{ width: "22px", height: "1.5px", background: "#111", marginBottom: "5px" }} />
              <div style={{ width: "22px", height: "1.5px", background: "#111" }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mega menu panel ── */}
      {openDropdown && activeMega && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            borderTop: "2px solid var(--gold)",
            borderBottom: "1px solid #ebebeb",
            boxShadow: "0 24px 56px rgba(0,0,0,0.10)",
            zIndex: 200,
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 2rem 2.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1px 1fr", gap: "0 2.5rem" }}>

              {/* Left — 3 featured image cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                {activeMega.featured.map((img) => (
                  <div key={img.href}>
                    {/* Image wrapper — hover zooms image, shows Pinterest button */}
                    <div className="mega-img-wrap">
                      <Link href={img.href} style={{ display: "block" }} onClick={closeAll}>
                        <img
                          src={`/images/${img.src}`}
                          alt={img.alt}
                          style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover" }}
                          loading="lazy"
                          decoding="async"
                        />
                      </Link>
                      {/* Pinterest pin button (appears on image hover) */}
                      <a
                        href={buildPinUrl(img.src, img.href, img.alt)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mega-pin-btn"
                        title={`Save to Pinterest: ${pinTitle(img.src)}`}
                        aria-label={`Save "${pinTitle(img.src)}" to Pinterest`}
                      >
                        <PinIcon />
                      </a>
                    </div>

                    {/* Card label */}
                    <Link href={img.href} style={{ textDecoration: "none" }} onClick={closeAll}>
                      <p style={{
                        fontFamily: "var(--body)", fontSize: "0.85rem", fontWeight: 600,
                        color: "#111", marginTop: "0.6rem", lineHeight: 1.3,
                      }}>
                        {img.label}
                      </p>
                    </Link>

                    {/* Alt text preview — this is what Pinterest uses as pin description */}
                    <p style={{
                      fontSize: "0.71rem", color: "#aaa", marginTop: "4px", lineHeight: 1.45,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {img.alt}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ background: "#f0f0f0", alignSelf: "stretch" }} />

              {/* Right — link sections + View All */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", flex: 1 }}>
                  {activeMega.sections.map((section) => (
                    <div key={section.heading}>
                      <p style={{
                        fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em",
                        textTransform: "uppercase", color: "#ccc", marginBottom: "0.85rem",
                      }}>
                        {section.heading}
                      </p>
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="mega-nav-link"
                          onClick={closeAll}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                {activeMega.viewAll && (
                  <div style={{
                    marginTop: "2rem", paddingTop: "1.25rem",
                    borderTop: "1px solid #f0f0f0",
                  }}>
                    <Link
                      href={activeMega.viewAll.href}
                      style={{
                        fontFamily: "var(--body)", fontSize: "0.7rem", fontWeight: 700,
                        letterSpacing: "0.16em", textTransform: "uppercase",
                        color: "var(--gold)", textDecoration: "none",
                      }}
                      onClick={closeAll}
                    >
                      {activeMega.viewAll.label} →
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div style={{ borderTop: "1px solid #ebebeb", background: "#fff", maxHeight: "80vh", overflowY: "auto" }}>
          {nav.map((item) => (
            <div key={item.label} style={{ borderBottom: "1px solid #f5f5f5" }}>
              {item.mega ? (
                <>
                  <div style={{
                    padding: "10px 24px",
                    fontFamily: "var(--body)", fontSize: "0.65rem", fontWeight: 600,
                    letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa",
                  }}>
                    {item.label}
                  </div>
                  {item.mega.sections.flatMap((s) => s.links).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      style={{
                        display: "block", padding: "9px 32px",
                        fontFamily: "var(--body)", fontSize: "0.85rem",
                        color: "#555", textDecoration: "none",
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={item.href!}
                  style={{
                    display: "block", padding: "12px 24px",
                    fontFamily: "var(--body)", fontSize: "0.85rem", fontWeight: 500,
                    color: "#444", textDecoration: "none",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div style={{ padding: "16px 24px" }}>
            <a
              href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "block", width: "100%", textAlign: "center",
                background: "#141414", color: "#fff",
                fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600,
                padding: "12px", textDecoration: "none",
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}
            >
              Shop Blue Nile →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
