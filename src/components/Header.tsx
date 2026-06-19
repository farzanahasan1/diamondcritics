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
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span style={{ fontFamily: "var(--font-marcellus)" }} className="text-xl font-normal text-black tracking-wide">
              Diamond<span className="text-gray-400">Critics</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-black transition-colors">
                    {item.label}
                    <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 bg-white border border-gray-100 shadow-xl rounded-sm py-2 min-w-48 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
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
                  className="px-3 py-2 text-sm text-gray-700 hover:text-black transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <a
            href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:block bg-black text-white text-xs font-medium px-4 py-2.5 hover:bg-gray-800 transition-colors tracking-wider uppercase"
          >
            Shop Blue Nile →
          </a>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <div className="w-5 h-0.5 bg-black mb-1" />
            <div className="w-5 h-0.5 bg-black mb-1" />
            <div className="w-5 h-0.5 bg-black" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          {nav.map((item) => (
            <div key={item.label} className="border-b border-gray-50">
              {item.children ? (
                <>
                  <div className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-8 py-2.5 text-sm text-gray-700"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={item.href!}
                  className="block px-6 py-3 text-sm font-medium text-gray-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className="p-4">
            <a
              href="https://www.bluenile.com/diamond-search?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blog-informational"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-black text-white text-xs font-medium px-4 py-3 tracking-wider uppercase"
            >
              Shop Blue Nile →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
