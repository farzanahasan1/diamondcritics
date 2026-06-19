import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-2 mb-6">
              <span
                style={{
                  fontFamily: "var(--heading)",
                  fontStyle: "italic",
                  fontSize: "2rem",
                  fontWeight: 300,
                  color: "var(--gold)",
                  lineHeight: 1,
                }}
              >
                D◆
              </span>
            </div>
            <p
              className="text-lg font-normal mb-3"
              style={{ fontFamily: "var(--heading)", fontWeight: 300 }}
            >
              Diamond <em className="italic" style={{ color: "var(--gold)" }}>Critics</em>
            </p>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              Independent, technical critiques of the world's leading diamond retailers. We analyze light performance and value so you can buy with total confidence.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-6">Explore</p>
            <div className="space-y-3">
              {[
                { label: "Retailer Reviews", href: "/category/diamond-retailer-reviews" },
                { label: "Diamond Guides", href: "/category/diamond-buying-guides" },
                { label: "Lab vs Natural", href: "/lab-grown-vs-natural-diamond-price" },
                { label: "Diamond Prices", href: "/diamond-prices" },
                { label: "Clarity Chart", href: "/diamond-clarity-chart" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-6">Company</p>
            <div className="space-y-3">
              {[
                { label: "About Farzana", href: "/about-farzana" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Diamond Critics · Unbiased Brilliance
          </p>
          <p className="text-xs text-gray-700">
            Affiliate Disclosure: Diamond Critics is an independent review site. We may receive compensation from the companies whose products we review.
          </p>
        </div>
      </div>
    </footer>
  );
}
