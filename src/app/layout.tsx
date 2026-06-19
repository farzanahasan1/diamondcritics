import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  openGraph: { siteName: "Diamond Critics", type: "website" },
  icons: {
    icon: [{ url: "/images/dc-icon.png", type: "image/png" }],
    apple: "/images/dc-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ivyPresto.variable} ${dmSans.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://www.bluenile.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-white text-gray-900 antialiased min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
