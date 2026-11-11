"use client";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SITE = "https://diamondcritics.com";

function pinTitle(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildPinUrl(src: string, pageHref: string, alt: string) {
  const imgUrl = SITE + "/images/" + src;
  return (
    "https://pinterest.com/pin/create/button/" +
    "?url=" + encodeURIComponent(SITE + pageHref) +
    "&media=" + encodeURIComponent(imgUrl) +
    "&description=" + encodeURIComponent(alt)
  );
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Img = {
  src: string;
  alt: string;
  href: string;
  label: string;
};
type Section = { heading: string; links: { label: string; href: string }[] };
type NavItem = {
  label: string;
  href?: string;
  mega?: { featured: Img[]; sections: Section[]; viewAll?: { label: string; href: string } };
};

// ─── NAV DATA ─────────────────────────────────────────────────────────────────
const nav: NavItem[] = [
  {
    label: "Guides",
    mega: {
      featured: [
        {
          src: "infographic-for-diamond-4c-clarity.jpg",
          alt: "Complete infographic explaining diamond 4Cs — cut, color, clarity, and carat weight",
          href: "/diamond-4cs",
          label: "Diamond 4Cs Explained",
        },
        {
          src: "lab-grown-vs-natural-diamond-price-2026-resale-value.jpg",
          alt: "Lab-grown vs natural diamond price comparison and 2026 resale value analysis",
          href: "/lab-grown-vs-natural-diamond-price",
          label: "Lab vs Natural",
        },
        {
          src: "round-brilliant-diamond-benchmark.jpg",
          alt: "Round brilliant diamond benchmark — what a perfectly cut stone actually looks like",
          href: "/diamond-prices",
          label: "Diamond Prices",
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
      viewAll: { label: "All Guides & Articles", href: "/blog" },
    },
  },
  {
    label: "Shapes",
    mega: {
      featured: [
        {
          src: "what-is-a-round-brilliant-cut-diamond-editorial-guide.jpg",
          alt: "What is a round brilliant cut diamond — editorial guide to the world's most popular shape",
          href: "/round-cut-diamond",
          label: "Round Brilliant",
        },
        {
          src: "oval-cut-diamond-guide-feature-image.jpg",
          alt: "Oval cut diamond guide — ideal proportions, the bow-tie effect, and 2026 price trends",
          href: "/oval-cut-diamond",
          label: "Oval Cut",
        },
        {
          src: "what-is-an-emerald-cut-diamond-editorial-infographic.jpg",
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
            { label: "Oval Cut", href: "/oval-cut-diamond" },
            { label: "Cushion Cut", href: "/cushion-cut-diamond" },
            { label: "Marquise Cut", href: "/marquise-cut-diamond" },
            { label: "Pear Cut", href: "/pear-cut-diamond" },
            { label: "Princess Cut", href: "/princess-cut-diamond" },
          ],
        },
        {
          heading: "Step & Mixed Cuts",
          links: [
            { label: "Emerald Cut", href: "/emerald-cut-diamond" },
            { label: "Asscher Cut", href: "/asscher-cut-diamond" },
            { label: "Radiant Cut", href: "/radiant-cut-diamond" },
          ],
        },
        {
          heading: "Round Diamond Deep Dive",
          links: [
            { label: "1ct Price Audit", href: "/1-carat-round-diamond-price" },
            { label: "Round vs Oval", href: "/round-diamond-vs-oval-diamond" },
            { label: "Hearts & Arrows", href: "/hearts-and-arrows-diamond" },
            { label: "Ring Settings", href: "/round-diamond-engagement-ring-settings" },
            { label: "Lab Grown Round", href: "/lab-grown-round-diamond" },
            { label: "All Round Guides", href: "/category/round-cut-diamond" },
          ],
        },
        {
          heading: "Oval Diamond Deep Dive",
          links: [
            { label: "1ct Price Audit", href: "/1-carat-oval-diamond-price" },
            { label: "2ct Price Guide", href: "/2-carat-oval-diamond-price" },
            { label: "Oval vs Round", href: "/round-diamond-vs-oval-diamond" },
            { label: "Oval vs Pear", href: "/oval-vs-pear-diamond" },
            { label: "All Oval Guides", href: "/category/oval-cut-diamond" },
          ],
        },
        {
          heading: "Emerald Cut Deep Dive",
          links: [
            { label: "Emerald Cut Guide", href: "/emerald-cut-diamond" },
            { label: "Emerald vs Cushion", href: "/cushion-cut-vs-emerald-cut-diamond" },
            { label: "Emerald vs Pear", href: "/pear-cut-vs-emerald-cut-diamond" },
            { label: "Emerald vs Marquise", href: "/marquise-cut-vs-emerald-cut-diamond" },
            { label: "All Emerald Guides", href: "/category/emerald-cut-diamond" },
          ],
        },
        {
          heading: "Cushion Cut Deep Dive",
          links: [
            { label: "Cushion Cut Guide", href: "/cushion-cut-diamond" },
            { label: "Cushion vs Emerald", href: "/cushion-cut-vs-emerald-cut-diamond" },
            { label: "Cushion vs Radiant", href: "/cushion-cut-vs-radiant-cut-diamond" },
            { label: "All Cushion Guides", href: "/category/cushion-cut-diamond" },
          ],
        },
        {
          heading: "Marquise Deep Dive",
          links: [
            { label: "Marquise Cut Guide", href: "/marquise-cut-diamond" },
            { label: "Marquise vs Emerald", href: "/marquise-cut-vs-emerald-cut-diamond" },
            { label: "All Marquise Guides", href: "/category/marquise-cut-diamond" },
          ],
        },
        {
          heading: "Princess & Radiant",
          links: [
            { label: "Princess Cut Guide", href: "/princess-cut-diamond" },
            { label: "1ct Princess Price", href: "/1-carat-princess-cut-diamond-price" },
            { label: "Princess vs Round", href: "/round-diamond-vs-princess-cut" },
            { label: "All Princess Guides", href: "/category/princess-cut-diamond" },
            { label: "Radiant Cut Guide", href: "/radiant-cut-diamond" },
            { label: "All Radiant Guides", href: "/category/radiant-cut-diamond" },
          ],
        },
      ],
      viewAll: { label: "All Shape Guides", href: "/diamond-shapes-guide" },
    },
  },
  {
    label: "Men's Rings",
    mega: {
      featured: [
        {
          src: "mens-diamond-signet-ring-featured.jpg",
          alt: "Men's diamond signet ring guide — 3 classic settings from $756, marquise, initial letter, pavé cluster",
          href: "/mens-diamond-signet-ring",
          label: "Men's Signet Ring",
        },
        {
          src: "mens-diamond-eternity-band-featured.jpg",
          alt: "Men's diamond eternity band — 4 prong issues that fail at year 5 and how to avoid them",
          href: "/mens-diamond-eternity-band",
          label: "Men's Eternity Band",
        },
        {
          src: "mens-lab-grown-diamond-ring-featured.jpg",
          alt: "Men's lab grown diamond ring guide — 5 IGI grades under $2,000 with certified stone data",
          href: "/mens-lab-grown-diamond-ring",
          label: "Lab Diamond Rings",
        },
      ],
      sections: [
        {
          heading: "Men's Ring Styles",
          links: [
            { label: "Men's Diamond Engagement Ring", href: "/mens-diamond-engagement-ring" },
            { label: "Men's Diamond Wedding Band", href: "/mens-diamond-wedding-band" },
            { label: "Men's Diamond Eternity Band", href: "/mens-diamond-eternity-band" },
            { label: "Men's Diamond Signet Ring", href: "/mens-diamond-signet-ring" },
            { label: "Men's Lab Grown Diamond Ring", href: "/mens-lab-grown-diamond-ring" },
          ],
        },
        {
          heading: "Men's Rings by Shape",
          links: [
            { label: "Men's Round Diamond Ring", href: "/mens-round-diamond-ring" },
            { label: "Men's Emerald Cut Ring", href: "/mens-emerald-cut-ring" },
            { label: "Men's Cushion Cut Ring", href: "/mens-cushion-cut-ring" },
            { label: "Men's Princess Cut Ring", href: "/mens-princess-cut-ring" },
            { label: "Men's Asscher Cut Ring", href: "/mens-asscher-cut-ring" },
          ],
        },
      ],
      viewAll: { label: "All Men's Diamond Rings", href: "/category/mens-diamond-rings" },
    },
  },
  {
    label: "Clarity",
    mega: {
      featured: [
        {
          src: "vvs1-diamond-inclusions-pinpoints-needles-vs-si1-crystals.jpg",
          alt: "VVS1 diamond inclusions — pinpoints and needles vs SI1 crystals under magnification",
          href: "/vvs1-diamond-clarity",
          label: "VVS1 Clarity",
        },
        {
          src: "vs1-diamond-inclusions-glossary.jpg",
          alt: "VS1 diamond inclusions glossary — types and visual examples for buyers",
          href: "/vs1-clarity-diamonds",
          label: "VS1 Clarity",
        },
        {
          src: "si-clarity-diamond-definition.jpg",
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
          src: "round-brilliant-diamond-color-clarity-guide-what-grade-you-actually-need.jpg",
          alt: "Round brilliant diamond color and clarity guide — what grade you actually need for your budget",
          href: "/diamond-color-scale",
          label: "Color Scale Guide",
        },
        {
          src: "f-color-diamond-colorless-premium-g-grade-solution.jpg",
          alt: "F color diamond — colorless premium vs G grade value comparison for smart buyers",
          href: "/f-color-diamond",
          label: "F Color Diamond",
        },
        {
          src: "g-color-diamond-price-crash-2026-market-floor-solution.jpg",
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
    label: "Reviews",
    mega: {
      featured: [
        {
          src: "Blue-Nile-Review-2026-Why-Most-Buyers-Overpay-And-How-to-Save-Thousands.jpg",
          alt: "Blue Nile Review 2026 — why most buyers overpay and how to save thousands on diamonds",
          href: "/blue-nile-review",
          label: "Blue Nile Review",
        },
        {
          src: "Blue-Nile-Bracelets-Review-The-5-Point-Checklist-Before-You-Checkout.jpg",
          alt: "Blue Nile bracelets review — Farzana's 5-point checklist before you checkout",
          href: "/blue-nile-bracelets-review",
          label: "Bracelets Review",
        },
        {
          src: "Blue-Nile-Lab-Grown-Diamond-Rings-Review-I-Audited-40-Stones-So-You-Dont-Waste-2930–21540.jpg",
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
            { label: "Near Me — Locations", href: "/blue-nile-near-me" },
            { label: "Promo Code", href: "/blue-nile-promo-code" },
            { label: "Is Blue Nile Legit?", href: "/is-blue-nile-legit" },
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
  { label: "Blog", href: "/blog" },
  { label: "Calculators", href: "/diamond-price-calculator" },
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

const ChevronRight = ({ open }: { open: boolean }) => (
  <svg
    width="10" height="6" viewBox="0 0 10 6" fill="none"
    style={{ opacity: 0.4, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
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

  const toggleMobileSection = useCallback((label: string) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
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
              <img src="/images/diamond-critics-main-logo-small.png" alt="Diamond Critics"
                style={{ height: "38px", width: "auto", display: "block" }}
                fetchPriority="high" decoding="async" />
            </picture>
            <picture style={{ display: "none" }} className="header-logo-icon">
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
              href="/community"
              className="header-cta"
              style={{
                background: "#C6973E", color: "#fff",
                fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600,
                padding: "9px 18px", textDecoration: "none",
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}
            >
              Community →
            </a>
            <button
              className="header-hamburger"
              onClick={() => { setMobileOpen(!mobileOpen); closeAll(); }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }}
            >
              {mobileOpen ? (
                /* X icon when open */
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M2 2l18 18M20 2L2 20" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                /* Hamburger icon */
                <>
                  <div style={{ width: "22px", height: "1.5px", background: "#111", marginBottom: "5px" }} />
                  <div style={{ width: "22px", height: "1.5px", background: "#111", marginBottom: "5px" }} />
                  <div style={{ width: "22px", height: "1.5px", background: "#111" }} />
                </>
              )}
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
                    <Link href={img.href} style={{ textDecoration: "none" }} onClick={closeAll}>
                      <p style={{
                        fontFamily: "var(--body)", fontSize: "0.85rem", fontWeight: 600,
                        color: "#111", marginTop: "0.6rem", lineHeight: 1.3,
                      }}>
                        {img.label}
                      </p>
                    </Link>
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
                <div style={{
                  display: "grid",
                  gridTemplateColumns: activeMega.sections.length > 4 ? "1fr 1fr" : "1fr 1fr",
                  gap: "1.25rem 1.5rem",
                  flex: 1,
                  overflowY: activeMega.sections.length > 6 ? "auto" : "visible",
                  maxHeight: activeMega.sections.length > 6 ? "380px" : "none",
                }}>
                  {activeMega.sections.map((section) => (
                    <div key={section.heading}>
                      <p style={{
                        fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em",
                        textTransform: "uppercase", color: "#ccc", marginBottom: "0.75rem",
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
                    marginTop: "1.5rem", paddingTop: "1.25rem",
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

      {/* ── Mobile menu — accordion style ── */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          style={{
            borderTop: "1px solid #ebebeb",
            background: "#fff",
            maxHeight: "calc(100vh - 64px)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {nav.map((item) => (
            <div key={item.label} style={{ borderBottom: "1px solid #f2f2f2" }}>
              {item.mega ? (
                <>
                  {/* Accordion trigger */}
                  <button
                    onClick={() => toggleMobileSection(item.label)}
                    aria-expanded={mobileExpanded === item.label}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 20px",
                      fontFamily: "var(--body)", fontSize: "0.9rem", fontWeight: 600,
                      color: mobileExpanded === item.label ? "#C6973E" : "#222",
                      background: "none", border: "none", cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {item.label}
                    <ChevronRight open={mobileExpanded === item.label} />
                  </button>

                  {/* Accordion content */}
                  {mobileExpanded === item.label && (
                    <div style={{ background: "#fafafa", paddingBottom: "8px" }}>
                      {item.mega.sections.map((section) => (
                        <div key={section.heading}>
                          <p style={{
                            padding: "10px 20px 4px 32px",
                            fontSize: "0.58rem", fontWeight: 700,
                            letterSpacing: "0.16em", textTransform: "uppercase",
                            color: "#bbb",
                          }}>
                            {section.heading}
                          </p>
                          {section.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              style={{
                                display: "block", padding: "8px 20px 8px 32px",
                                fontFamily: "var(--body)", fontSize: "0.85rem",
                                color: "#444", textDecoration: "none",
                              }}
                              onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                      {item.mega.viewAll && (
                        <Link
                          href={item.mega.viewAll.href}
                          style={{
                            display: "block", padding: "10px 20px 10px 32px",
                            fontFamily: "var(--body)", fontSize: "0.75rem", fontWeight: 700,
                            color: "#C6973E", textDecoration: "none",
                            letterSpacing: "0.1em", textTransform: "uppercase",
                          }}
                          onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                        >
                          {item.mega.viewAll.label} →
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  style={{
                    display: "flex", alignItems: "center",
                    padding: "14px 20px",
                    fontFamily: "var(--body)", fontSize: "0.9rem", fontWeight: 500,
                    color: "#222", textDecoration: "none",
                  }}
                  onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile footer — CTA + quick links */}
          <div style={{ padding: "16px 20px 24px", background: "#fafafa" }}>
            <a
              href="/community"
              style={{
                display: "block", textAlign: "center",
                background: "#C6973E", color: "#fff",
                fontFamily: "var(--body)", fontSize: "0.75rem", fontWeight: 700,
                padding: "13px", textDecoration: "none",
                letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: "14px",
              }}
              onClick={() => setMobileOpen(false)}
            >
              Community →
            </a>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
              <Link href="/blog" style={{ fontSize: "0.78rem", color: "#777", textDecoration: "none" }} onClick={() => setMobileOpen(false)}>All Articles</Link>
              <Link href="/diamond-price-calculator" style={{ fontSize: "0.78rem", color: "#777", textDecoration: "none" }} onClick={() => setMobileOpen(false)}>Calculator</Link>
              <Link href="/about-farzana" style={{ fontSize: "0.78rem", color: "#777", textDecoration: "none" }} onClick={() => setMobileOpen(false)}>About</Link>
              <Link href="/contact" style={{ fontSize: "0.78rem", color: "#777", textDecoration: "none" }} onClick={() => setMobileOpen(false)}>Contact</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
