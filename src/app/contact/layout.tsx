import type { Metadata } from "next";

const contactTitle = "Contact Farzana Hasan — GIA Expert Diamond Audits";
const contactDesc = "Get an independent diamond audit from GIA expert Farzana Hasan. Technical guidance on eye-clean diamonds, GIA report analysis, and light performance.";

export const metadata: Metadata = {
  title: contactTitle,
  description: contactDesc,
  alternates: { canonical: "https://diamondcritics.com/contact" },
  openGraph: {
    title: `${contactTitle} | Diamond Critics`,
    description: contactDesc,
    url: "https://diamondcritics.com/contact",
    type: "website",
    siteName: "Diamond Critics",
    images: [{ url: "https://diamondcritics.com/images/diamondcritics-og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: contactTitle, description: contactDesc },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Farzana Hasan",
  "url": "https://diamondcritics.com/contact",
  "description": "Get an independent diamond audit from GIA expert Farzana Hasan.",
  "mainEntity": {
    "@type": "Person",
    "name": "Farzana Hasan",
    "jobTitle": "GIA-Certified Diamond Expert",
    "url": "https://diamondcritics.com/about-farzana",
    "email": "farzana@diamondcritics.com",
    "sameAs": [
      "https://x.com/diamondcritics",
      "https://www.pinterest.com/diamondcritics/",
      "https://youtube.com/channel/UCP4kx9XpVpeMqkMcD-9fslg/",
      "https://www.linkedin.com/company/diamondcritics/",
    ],
    "worksFor": { "@type": "Organization", "name": "Diamond Critics", "url": "https://diamondcritics.com" },
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
