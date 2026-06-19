import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Diamond Critics — Expert Diamond Buying Advice by Farzana Hasan",
    template: "%s | Diamond Critics",
  },
  description:
    "GIA-backed diamond buying guides covering clarity, color, cut, and carat. Data-driven advice from Farzana Hasan, GIA Expert.",
  metadataBase: new URL("https://diamondcritics.com"),
  openGraph: { siteName: "Diamond Critics", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-gray-900 antialiased min-h-full flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
