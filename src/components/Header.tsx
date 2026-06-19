"use client";
import Link from "next/link";
import { useState } from "react";

const nav = [
  {
    label: "Guides",
    children: [
      { label: "Diamond 4Cs", href: "/diamond-4cs" },
      { label: "Clarity Chart", href: "/diamond-clarity-chart" },
      { label: "Color Scale", href: "/diamond-color-scale" },
      { label: "Cut Guide", href: "/diamond-cut-guide" },
      { label: "Size Chart", href: "/diamond-size-chart" },
      { label: "Shapes Guide", href: "/diamond-shapes-guide" },
      { label: "Diamond Prices", href: "/diamond-prices" },
      { label: "Lab vs Natural", href: "/lab-grown-vs-natural-diamond-price" },
    ],
  },
  {
    label: "Clarity",
    children: [
      { label: "IF & FL Clarity", href: "/if-and-fl-diamond-clarity" },
      { label: "VVS1 Clarity", href: "/vvs1-diamond-clarity" },
      { label: "VVS2 Clarity", href: "/vvs2-diamond-clarity" },
      { label: "VS1 Clarity", href: "/vs1-clarity-diamonds" },
      { label: "VS2 Clarity", href: "/vs2-clarity-diamond" },
      { label: "SI Clarity", href: "/si-clarity-diamond" },
    ],
  },
  {
    label: "Color",
    children: [
      { label: "D Color", href: "/d-color-diamond" },
      { label: "E Color", href: "/e-color-diamond" },
      { label: "F Color", href: "/f-color-diamond" },
      { label: "G Color", href: "/g-color-diamond" },
      { label: "H Color", href: "/h-color-diamond" },
    ],
  },
  {
    label: "Shapes",
    children: [
      { label: "Round Cut", href: "/round-cut-diamond" },
      { label: "Princess Cut", href: "/princess-cut-diamond" },
      { label: "Cushion Cut", href: "/cushion-cut-diamond" },
      { label: "Oval Cut", href: "/oval-cut-diamond" },
      { label: "Emerald Cut", href: "/emerald-cut-diamond" },
      { label: "Radiant Cut", href: "/radiant-cut-diamond" },
      { label: "Pear Cut", href: "/pear-cut-diamond" },
    ],
  },
  {
    label: "Reviews",
    children: [
      { label: "Blue Nile Review", href: "/blue-nile-review" },
      { label: "Blue Nile Bracelets", href: "/blue-nile-bracelets-review" },
      { label: "Blue Nile Earrings", href: "/blue-nile-earrings-review" },
      { label: "Blue Nile Men's Rings", href: "/blue-nile-mens-rings-review" },
    ],
  },
  { label: "Calculators", href: "/diamond-price-calculator" },
  { label: "About", href: "/about-farzana" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header style={{
      background: "#fff",
      borderBottom: "1px solid #ebebeb",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, textDecoration: "none" }}>
            {/* Full logo — desktop */}
            <picture style={{ display: "block" }} className="header-logo-full">
              <source srcSet="/images/diamond-critics-main-logo-small.avif" type="image/avif" />
              <img
                src="/images/diamond-critics-main-logo-small.png"
                alt="Diamond Critics"
                style={{ height: "38px", width: "auto", display: "block" }}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            {/* Icon logo — mobile */}
            <picture style={{ display: "none" }} className="header-logo-icon">
              <source srcSet="/images/diamond-critics-icon-logo-small.avif" type="image/avif" />
              <img
                src="/images/diamond-critics-icon-logo-small.png"
                alt="Diamond Critics"
                style={{ height: "38px", width: "auto", display: "block" }}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2px" }} className="header-nav">
            {nav.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "8px 12px",
                    fontFamily: "var(--body)", fontSize: "0.82rem", fontWeight: 500,
                    color: "#555", background: "none", border: "none", cursor: "pointer",
                  }}>
                    {item.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4 }}>
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0,
                      background: "#fff", border: "1px solid #ebebeb",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                      minWidth: "180px", zIndex: 100, padding: "6px 0",
                    }}>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          style={{
                            display: "block", padding: "9px 20px",
                            fontFamily: "var(--body)", fontSize: "0.82rem",
                            color: "#555", textDecoration: "none",
                          }}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
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

          {/* CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a
              href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#141414", color: "#fff",
                fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 600,
                padding: "9px 18px", textDecoration: "none",
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}
              className="header-cta"
            >
              Shop Blue Nile →
            </a>

            {/* Hamburger — mobile only */}
            <button
              style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }}
              className="header-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <div style={{ width: "22px", height: "1.5px", background: "#111", marginBottom: "5px" }} />
              <div style={{ width: "22px", height: "1.5px", background: "#111", marginBottom: "5px" }} />
              <div style={{ width: "22px", height: "1.5px", background: "#111" }} />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          borderTop: "1px solid #ebebeb", background: "#fff",
          maxHeight: "80vh", overflowY: "auto",
        }} className="header-mobile-menu">
          {nav.map((item) => (
            <div key={item.label} style={{ borderBottom: "1px solid #f5f5f5" }}>
              {item.children ? (
                <>
                  <div style={{
                    padding: "10px 24px",
                    fontFamily: "var(--body)", fontSize: "0.65rem", fontWeight: 600,
                    letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa",
                  }}>
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      style={{
                        display: "block", padding: "9px 32px",
                        fontFamily: "var(--body)", fontSize: "0.85rem", color: "#555",
                        textDecoration: "none",
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
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
              target="_blank"
              rel="noopener noreferrer"
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
