import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import { getAllPosts } from "@/lib/content";
import Script from "next/script";

const ivyPresto = localFont({
  src: "./fonts/ivy-presto-headline-light.woff2",
  variable: "--font-ivy",
  weight: "300",
  style: "normal",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Diamond Critics — Expert Diamond Buying Advice by Farzana Hasan",
    template: "%s | Diamond Critics",
  },
  description:
    "GIA-backed diamond buying guides covering clarity, color, cut, and carat. Data-driven advice from Farzana Hasan, GIA Expert.",
  metadataBase: new URL("https://diamondcritics.com"),
  openGraph: {
    siteName: "Diamond Critics",
    type: "website",
    images: [{ url: "/images/diamondcritics-og.png", width: 1200, height: 630, alt: "Diamond Critics — Expert Diamond Buying Advice" }],
  },
  twitter: { card: "summary_large_image" },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Diamond Critics",
  "url": "https://diamondcritics.com",
  "logo": "https://diamondcritics.com/images/diamondcritics-og.png",
  "sameAs": [
    "https://x.com/diamondcritics",
    "https://www.pinterest.com/diamondcritics/",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Diamond Critics",
  "url": "https://diamondcritics.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://diamondcritics.com/?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchPosts = getAllPosts().map(p => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    category: p.category,
  }));

  return (
    <html lang="en" className={`${ivyPresto.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://jfknkkemecwvohxaeqpl.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.bluenile.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className="bg-white text-gray-900 antialiased min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <SearchModal posts={searchPosts} />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-76MCD0Y7G9"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-76MCD0Y7G9');`}
        </Script>
      </body>
    </html>
  );
}
