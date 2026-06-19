import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Farzana Hasan — GIA Expert Diamond Audits",
  description:
    "Get an independent diamond audit from GIA expert Farzana Hasan. Technical guidance on eye-clean diamonds, GIA report analysis, and light performance.",
  alternates: { canonical: "https://diamondcritics.com/contact" },
  openGraph: {
    title: "Contact Farzana Hasan — GIA Expert Diamond Audits",
    description: "Independent, GIA-backed analysis before you spend. Purchase reviews, GIA report audits, lab vs natural comparisons.",
    url: "https://diamondcritics.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
