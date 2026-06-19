import Link from 'next/link';

const navLinks = [
  { label: 'Diamond 4Cs', href: '/diamond-4cs' },
  { label: 'Clarity', href: '/diamond-clarity-chart' },
  { label: 'Color', href: '/diamond-color-scale' },
  { label: 'Cut', href: '/diamond-cut-guide' },
  { label: 'Shapes', href: '/diamond-shapes-guide' },
  { label: 'Prices', href: '/diamond-prices' },
  { label: 'Reviews', href: '/blue-nile-review' },
  { label: 'About', href: '/about-farzana' },
];

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Diamond<span className="text-blue-700">Critics</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu placeholder */}
          <div className="lg:hidden">
            <Link href="/" className="text-sm text-gray-600">Menu</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
