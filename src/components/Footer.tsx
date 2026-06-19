import Link from 'next/link';

const footerLinks = {
  'Diamond Guides': [
    { label: 'Diamond 4Cs', href: '/diamond-4cs' },
    { label: 'Clarity Chart', href: '/diamond-clarity-chart' },
    { label: 'Color Scale', href: '/diamond-color-scale' },
    { label: 'Cut Guide', href: '/diamond-cut-guide' },
    { label: 'Size Chart', href: '/diamond-size-chart' },
    { label: 'Shapes Guide', href: '/diamond-shapes-guide' },
  ],
  'Clarity Grades': [
    { label: 'IF & FL Clarity', href: '/if-and-fl-diamond-clarity' },
    { label: 'VVS1 Clarity', href: '/vvs1-diamond-clarity' },
    { label: 'VVS2 Clarity', href: '/vvs2-diamond-clarity' },
    { label: 'VS1 Clarity', href: '/vs1-clarity-diamonds' },
  ],
  'Tools & Reviews': [
    { label: 'Diamond Prices', href: '/diamond-prices' },
    { label: 'Price Calculator', href: '/diamond-price-calculator' },
    { label: 'Resale Calculator', href: '/diamond-resale-value-calculator' },
    { label: 'Blue Nile Review', href: '/blue-nile-review' },
    { label: 'Lab vs Natural', href: '/lab-grown-vs-natural-diamond-price' },
  ],
  'About': [
    { label: 'About Farzana', href: '/about-farzana' },
    { label: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} DiamondCritics.com — Expert diamond buying advice by Farzana Hasan, GIA Expert
          </p>
          <p className="text-xs text-gray-600">
            Affiliate disclosure: We earn commissions from qualifying purchases.
          </p>
        </div>
      </div>
    </footer>
  );
}
