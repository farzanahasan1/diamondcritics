import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blue Nile Near Me: All 22 Showroom Locations (2026) — Hours & Addresses",
  description:
    "Blue Nile has 22 showrooms across 14 US states. Find the Blue Nile jewelry store near you — full addresses, hours, and what to expect vs buying online. Tysons Corner, Boca Raton, Newport Beach, and more.",
  alternates: { canonical: "https://diamondcritics.com/blue-nile-near-me" },
  openGraph: {
    title: "Blue Nile Near Me: All 22 Showroom Locations & Addresses (2026)",
    description:
      "Find a Blue Nile jewelry store near you. 22 showrooms in 14 states — Tysons Corner VA, Boca Raton FL, Newport Beach CA, Garden State Plaza NJ, Roosevelt Field NY, and more.",
    url: "https://diamondcritics.com/blue-nile-near-me",
    type: "website",
    siteName: "Diamond Critics",
    images: [{ url: "/images/blue-nile-near-me-og.jpg", width: 1200, height: 630 }],
  },
  keywords: [
    "blue nile near me",
    "blue nile jewelry store near me",
    "blue nile stores near me",
    "blue nile showroom locations",
    "blue nile store locations",
    "blue nile tysons corner",
    "blue nile boca raton",
    "blue nile newport beach",
    "blue nile garden state plaza",
    "blue nile roosevelt field",
    "blue nile showroom",
    "blue nile jewelry near me",
  ],
};

const AFF = "?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=blue_nile_reviews";
const BN = "https://www.bluenile.com";

const locations = [
  {
    state: "Arizona",
    abbr: "AZ",
    stores: [
      { mall: "Fashion Square", city: "Scottsdale", address: "7014 E Camelback Rd, Suite 1252, Scottsdale, AZ 85251", slug: "store-fashion-square-az" },
    ],
  },
  {
    state: "California",
    abbr: "CA",
    stores: [
      { mall: "Century City", city: "Los Angeles", address: "10250 Santa Monica Blvd, Suite 1655, Los Angeles, CA 90067", slug: "store-centurycity-ca" },
      { mall: "Fashion Island", city: "Newport Beach", address: "1085 Newport Center Dr, Space 1085, Newport Beach, CA 92660", slug: "store-fashion-island-ca" },
      { mall: "Roseville Galleria", city: "Roseville", address: "1151 Galleria Blvd, Suite 120, Roseville, CA 95678", slug: "store-roseville-galleria-ca" },
      { mall: "Valley Fair", city: "Santa Clara", address: "2855 Stevens Creek Blvd, Suite 1105-A105, Santa Clara, CA 95050", slug: "store-valleyfair-ca" },
    ],
  },
  {
    state: "Florida",
    abbr: "FL",
    stores: [
      { mall: "Boca Town Center", city: "Boca Raton", address: "6000 Glades Rd, Space 1102, Boca Raton, FL 33431", slug: "store-boca-raton-fl" },
      { mall: "Brickell City Centre", city: "Miami", address: "701 S Miami Ave, Space 135-B, Miami, FL 33130", slug: "store-brickell-city-center-fl" },
      { mall: "Mall at Millenia", city: "Orlando", address: "4200 Conroy Rd, Space B-160, Orlando, FL 32839", slug: "store-mall-at-millenia-fl" },
    ],
  },
  {
    state: "Georgia",
    abbr: "GA",
    stores: [
      { mall: "Lenox Square", city: "Atlanta", address: "3393 Peachtree Road NE, Suite 4045, Atlanta, GA 30326", slug: "store-lenox-square-ga" },
    ],
  },
  {
    state: "Michigan",
    abbr: "MI",
    stores: [
      { mall: "Somerset Collection", city: "Troy", address: "2800 West Big Beaver Rd, Space Q-121, Troy, MI 48084", slug: "store-somerset-collection-mi" },
    ],
  },
  {
    state: "New Hampshire",
    abbr: "NH",
    stores: [
      { mall: "Rockingham Park", city: "Salem", address: "99 Rockingham Park Blvd, Suite W111A, Salem, NH 03079", slug: "store-rockingham-park-nh" },
    ],
  },
  {
    state: "New Jersey",
    abbr: "NJ",
    stores: [
      { mall: "Garden State Plaza", city: "Paramus", address: "1 Garden State Plaza, Space 1103, Paramus, NJ 07652", slug: "store-garden-state-plaza-nj" },
      { mall: "The Mall at Short Hills", city: "Short Hills", address: "1200 Morris Tpke, Suite B254, Short Hills, NJ 07078", slug: "store-short-hills-nj" },
    ],
  },
  {
    state: "New York",
    abbr: "NY",
    stores: [
      { mall: "Roosevelt Field", city: "Garden City", address: "1630 Old Country Rd, Unit 1101B, Garden City, NY 11530", slug: "store-roosevelt-ny" },
    ],
  },
  {
    state: "North Carolina",
    abbr: "NC",
    stores: [
      { mall: "SouthPark Mall", city: "Charlotte", address: "4400 Sharon Rd, E-14B, Charlotte, NC 28211", slug: "store-southpark-mall-nc" },
    ],
  },
  {
    state: "Oregon",
    abbr: "OR",
    stores: [
      { mall: "Washington Square", city: "Portland", address: "9364 SW Washington Square Rd, Portland, OR 97223", slug: "store-washington-square-or" },
    ],
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    stores: [
      { mall: "King of Prussia Mall", city: "King of Prussia", address: "160 N Gulph Rd, Suite 2662, King of Prussia, PA 19406", slug: "store-king-of-prussia-pa" },
    ],
  },
  {
    state: "Texas",
    abbr: "TX",
    stores: [
      { mall: "Domain Northside", city: "Austin", address: "11700 Rock Rose Ave, Suite 122B, Austin, TX 78758", slug: "store-domainnorthside-tx" },
      { mall: "Houston Galleria", city: "Houston", address: "5085 Westheimer Rd, Suite B3556, Houston, TX 77056", slug: "store-houston-galleria-tx" },
      { mall: "NorthPark Center", city: "Dallas", address: "8687 N Central Expy, Suite 794, Dallas, TX 75225", slug: "store-northpark-center-tx" },
    ],
  },
  {
    state: "Virginia",
    abbr: "VA",
    stores: [
      { mall: "Tysons Corner Center", city: "McLean", address: "7977A Tysons Corner Ctr, McLean, VA 22102", slug: "store-tysons-corner-center-va" },
    ],
  },
  {
    state: "Washington",
    abbr: "WA",
    stores: [
      { mall: "Bellevue Square", city: "Bellevue", address: "177 Bellevue Sq, Bellevue, WA 98004", slug: "store-bellevue-square-wa" },
    ],
  },
];

const faq = [
  {
    q: "How many Blue Nile stores are there?",
    a: "Blue Nile has 22 showroom locations across 14 US states as of 2026. They are not traditional jewelry stores — they are experience-focused showrooms inside upscale malls where you can try on settings and consult a salaried advisor before ordering at online prices.",
  },
  {
    q: "Is there a Blue Nile near me?",
    a: "Blue Nile has showrooms in Arizona, California, Florida, Georgia, Michigan, New Hampshire, New Jersey, New York, North Carolina, Oregon, Pennsylvania, Texas, Virginia, and Washington state. If none are near you, Blue Nile also offers free virtual appointments online.",
  },
  {
    q: "Can I buy a ring at a Blue Nile showroom?",
    a: "You can order at a Blue Nile showroom, but you cannot take a ring home the same day. Blue Nile showrooms carry ring settings to try on, but diamonds are not stocked in-store — you select your diamond on their website and the completed ring ships to you within the delivery window quoted at purchase.",
  },
  {
    q: "Are Blue Nile showroom prices the same as online?",
    a: "Yes. Blue Nile showroom pricing is identical to their website pricing — no in-store markup. The salaried advisors work on salary, not commission, so there is no pressure to upsell. You get the same 20–40% lower-than-local-jeweler pricing whether you shop online or in-person.",
  },
  {
    q: "Does Blue Nile Tysons Corner require an appointment?",
    a: "Walk-ins are welcome at Blue Nile Tysons Corner Center (7977A Tysons Corner Ctr, McLean, VA 22102). Appointments are recommended for weekends and are always available for free via BluNile.com. Appointments ensure a dedicated advisor and a private viewing room.",
  },
  {
    q: "Where is Blue Nile in Boca Raton?",
    a: "Blue Nile Boca Raton is located at Boca Town Center: 6000 Glades Rd, Space 1102, Boca Raton, FL 33431. It is inside the Town Center at Boca Raton mall on the upper level.",
  },
  {
    q: "Where is Blue Nile in Newport Beach?",
    a: "Blue Nile Newport Beach is at Fashion Island: 1085 Newport Center Dr, Space 1085, Newport Beach, CA 92660. Fashion Island is an open-air mall — Blue Nile is located near the Neiman Marcus wing.",
  },
  {
    q: "What is a Blue Nile virtual appointment?",
    a: "A Blue Nile virtual appointment is a free one-on-one video session with a salaried jewelry advisor. You can view diamonds on-screen, ask questions, and get personalized recommendations without visiting a showroom. Available seven days a week. Book at BluNile.com.",
  },
  {
    q: "What should I expect at a Blue Nile showroom?",
    a: "Blue Nile showrooms are quiet, low-pressure spaces — not a traditional retail jewelry store floor. You try on ring settings (without diamonds), get 1-on-1 consultation time with a salaried (not commissioned) advisor, and place your order at the same online price. Most visits take 45–90 minutes.",
  },
  {
    q: "Does Blue Nile have stores in Canada or the UK?",
    a: "No. As of 2026, all Blue Nile showrooms are in the United States. Blue Nile ships internationally from their website, but physical showrooms are US-only. For international buyers, a virtual appointment is the equivalent in-person experience.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "Blue Nile Near Me: All 22 Showroom Locations (2026)",
      "description": "Complete guide to every Blue Nile jewelry store location in the US — 22 showrooms across 14 states with addresses, what to expect, and how showrooms compare to buying online.",
      "url": "https://diamondcritics.com/blue-nile-near-me",
      "dateModified": new Date().toISOString().split("T")[0],
      "author": { "@type": "Person", "name": "Farzana Hasan", "url": "https://diamondcritics.com/about-farzana" },
      "image": {
        "@type": "ImageObject",
        "url": "https://diamondcritics.com/images/blue-nile-near-me.avif",
        "width": 1200,
        "height": 800,
      },
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": faq.map(({ q, a }) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a },
        })),
      },
    },
    ...locations.flatMap((region) =>
      region.stores.map((s) => ({
        "@type": "JewelryStore",
        "name": `Blue Nile — ${s.mall}`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": s.address.split(",")[0],
          "addressLocality": s.city,
          "addressRegion": region.abbr,
          "addressCountry": "US",
        },
        "url": `${BN}/jewelry-stores/${s.slug}${AFF}`,
        "parentOrganization": { "@type": "Organization", "name": "Blue Nile" },
      }))
    ),
  ],
};

export default function BlueNileNearMe() {
  const totalStores = locations.reduce((n, r) => n + r.stores.length, 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div style={{ fontFamily: "var(--body)", color: "#111", background: "#fff" }}>

        {/* ── Hero ── */}
        <section style={{ background: "#0d0d0d", color: "#fff", padding: "5rem 2rem 4rem" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.25rem" }}>
              Last Updated: July 2026 · Verified by Farzana Hasan, GIA Expert
            </p>
            <h1 style={{
              fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic",
              fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.1,
              letterSpacing: "-0.02em", color: "#fff", marginBottom: "1.5rem",
            }}>
              Blue Nile Near Me: All {totalStores} Showroom Locations
            </h1>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: "640px", margin: "0 auto 1.25rem" }}>
              Blue Nile has <strong style={{ color: "rgba(255,255,255,0.9)" }}>{totalStores} showrooms across 14 US states</strong>. Every location, address, and what to expect when you visit — updated July 2026.
            </p>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.7, maxWidth: "580px", margin: "0 auto 2rem" }}>
              AZ · CA · FL · GA · MI · NH · NJ · NY · NC · OR · PA · TX · VA · WA
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={`${BN}/jewelry-stores${AFF}`} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-block", background: "var(--gold)", color: "#111",
                fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase",
                padding: "14px 32px", textDecoration: "none",
              }}>
                Find My Nearest Store →
              </a>
              <a href={`${BN}/jewelry-stores/virtual-appointment${AFF}`} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-block", background: "transparent", color: "#fff",
                fontWeight: 600, fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase",
                padding: "14px 32px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)",
              }}>
                Book Virtual Appointment →
              </a>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <div style={{ background: "#f5f5f5", borderBottom: "1px solid #e8e8e8" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.25rem 2rem", display: "flex", gap: "2.5rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            {[
              ["22", "US Showrooms"],
              ["14", "States"],
              ["$0", "Commission Sales"],
              ["Same", "Price as Online"],
              ["Free", "Virtual Appts"],
            ].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111", lineHeight: 1, marginBottom: "3px" }}>{val}</p>
                <p style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#888" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Featured image ── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem 0" }}>
          <img
            src="/images/blue-nile-near-me.avif"
            alt="Blue Nile showroom interior — Blue Nile jewelry store near me guide 2026, Diamond Critics"
            width={1200} height={800}
            style={{ width: "100%", height: "auto", display: "block" }}
            loading="eager" decoding="async"
          />
        </div>

        {/* ── Quick answer ── */}
        <section style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 2rem 2rem" }}>
          <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", color: "#111", marginBottom: "1rem" }}>
            Does Blue Nile Have Physical Stores Near Me?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: 1.85, marginBottom: "1rem" }}>
            <strong>Yes — Blue Nile has {totalStores} physical showroom locations across 14 US states.</strong> These are not traditional jewelry stores; they are curated showrooms inside upscale malls where you can try on ring settings, consult a salaried (non-commissioned) jewelry expert, and place your order at the same price you&apos;d pay online — no in-store markup.
          </p>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: 1.85, marginBottom: "1rem" }}>
            If there is no Blue Nile showroom near you, Blue Nile also offers <strong>free virtual appointments</strong> — a live video session with a jewelry advisor who can walk you through diamond selection, ring styles, and custom builds in real time.
          </p>
          <div style={{ background: "#f8f8f8", border: "1px solid #e8e8e8", padding: "1.25rem 1.5rem", borderLeft: "3px solid var(--gold)" }}>
            <p style={{ fontSize: "0.88rem", color: "#333", lineHeight: 1.8, margin: 0 }}>
              <strong>Key fact:</strong> Blue Nile showrooms do not carry diamond inventory. You try on the setting, select your diamond on their site (or with an advisor&apos;s help), and the finished ring ships to your door — typically within 7–10 business days.
            </p>
          </div>
        </section>

        {/* ── Map image ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 2rem" }}>
          <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#111", marginBottom: "1rem" }}>
            Blue Nile Jewelry Store Locations Map
          </h2>
          <img
            src="/images/blue-nile-showroom-locations-map.avif"
            alt="Map of all Blue Nile jewelry store locations and showrooms across the United States — 22 locations in 14 states"
            width={1200} height={800}
            style={{ width: "100%", height: "auto", display: "block", border: "1px solid #e8e8e8" }}
            loading="lazy" decoding="async"
          />
          <p style={{ fontSize: "0.78rem", color: "#aaa", marginTop: "0.5rem" }}>All 22 Blue Nile showroom locations across the continental United States, July 2026.</p>
        </section>

        {/* ── Location cards by state ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 2rem 4rem" }}>
          <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", color: "#111", marginBottom: "0.5rem" }}>
            All Blue Nile Store Locations Near Me — By State
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "2.5rem", lineHeight: 1.7 }}>
            Every Blue Nile showroom address, organized by state. Click any location to view store details, hours, and book an in-store appointment directly on Blue Nile&apos;s site.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {locations.map((region) => (
              <div key={region.state}>
                {/* State header */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <span style={{
                    fontFamily: "var(--body)", fontWeight: 700, fontSize: "0.6rem",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    background: "#111", color: "var(--gold)",
                    padding: "4px 10px",
                  }}>
                    {region.abbr}
                  </span>
                  <h3 style={{ fontFamily: "var(--body)", fontWeight: 700, fontSize: "1rem", color: "#111" }}>
                    {region.state} — {region.stores.length} {region.stores.length === 1 ? "location" : "locations"}
                  </h3>
                </div>

                <div className="store-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                  {region.stores.map((store) => (
                    <a
                      key={store.slug}
                      href={`${BN}/jewelry-stores/${store.slug}${AFF}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <div className="store-card" style={{
                        border: "1px solid #e8e8e8",
                        padding: "1.5rem",
                        background: "#fff",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                          <p style={{ fontFamily: "var(--body)", fontWeight: 700, fontSize: "0.95rem", color: "#111", lineHeight: 1.3 }}>
                            {store.mall}
                          </p>
                          <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5cb85c", whiteSpace: "nowrap" }}>
                            ● Open
                          </span>
                        </div>
                        <p style={{ fontFamily: "var(--body)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>
                          {store.city}, {region.abbr}
                        </p>
                        <p style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.6 }}>
                          {store.address}
                        </p>
                        <div style={{
                          marginTop: "auto",
                          paddingTop: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--gold)",
                        }}>
                          View Store & Hours →
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Showroom gallery ── */}
        <section style={{ background: "#f8f8f8", borderTop: "1px solid #e8e8e8", borderBottom: "1px solid #e8e8e8", padding: "4rem 2rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", color: "#111", marginBottom: "0.5rem" }}>
              Inside a Blue Nile Showroom
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "2rem", lineHeight: 1.7 }}>
              Blue Nile showrooms are inside premium malls. Here&apos;s what several California locations look like.
            </p>
            <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {[
                { src: "blue-nile-showroom-century-city.avif", alt: "Blue Nile showroom at Century City, Los Angeles CA — interior view of ring settings display", caption: "Century City — Los Angeles, CA" },
                { src: "blue-nile-showroom-fashion-island.avif", alt: "Blue Nile Fashion Island showroom in Newport Beach CA — Blue Nile near me Newport Beach", caption: "Fashion Island — Newport Beach, CA" },
                { src: "blue-nile-showroom-roseville-galleria.avif", alt: "Blue Nile showroom at Roseville Galleria — Blue Nile store near me Northern California", caption: "Roseville Galleria — Roseville, CA" },
              ].map((img) => (
                <div key={img.src}>
                  <img
                    src={`/images/${img.src}`}
                    alt={img.alt}
                    width={1200} height={800}
                    style={{ width: "100%", height: "auto", display: "block" }}
                    loading="lazy" decoding="async"
                  />
                  <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.5rem", fontWeight: 600 }}>{img.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What to expect ── */}
        <section style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 2rem" }}>
          <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", color: "#111", marginBottom: "1rem" }}>
            What to Expect at a Blue Nile Jewelry Store
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: 1.85, marginBottom: "2rem" }}>
            Blue Nile showrooms operate differently from every other jewelry store you&apos;ve been to. Here&apos;s exactly what happens when you walk in.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }} className="expect-grid">
            {[
              { icon: "◇", title: "Try On Ring Settings", body: "You try on the physical ring setting — size, feel, metal, style. No diamond is in the setting. You can hold 10 different bands and find what works on your hand before committing." },
              { icon: "◈", title: "Salaried Advisor — No Commission", body: "Every Blue Nile showroom advisor earns a salary, not a commission. They have no financial incentive to upsell you. Ask anything, get direct answers." },
              { icon: "◉", title: "Online Prices — No Markup", body: "The price you see on BluNile.com is the price you pay in-store. There is no showroom premium. GIA-certified diamonds at 20–40% below comparable local jeweler pricing." },
              { icon: "◐", title: "Order, Then Ship", body: "You place your order in the showroom (or online after your visit) and the finished ring ships to you — typically 7–10 business days. Showrooms do not carry take-home inventory." },
            ].map((item) => (
              <div key={item.title} style={{ background: "#f8f8f8", border: "1px solid #e8e8e8", padding: "1.5rem" }}>
                <p style={{ fontSize: "1.4rem", color: "var(--gold)", marginBottom: "0.5rem" }}>{item.icon}</p>
                <p style={{ fontFamily: "var(--body)", fontWeight: 700, fontSize: "0.9rem", color: "#111", marginBottom: "0.5rem" }}>{item.title}</p>
                <p style={{ fontSize: "0.83rem", color: "#555", lineHeight: 1.7 }}>{item.body}</p>
              </div>
            ))}
          </div>

          {/* Showroom vs Online comparison */}
          <h3 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "1.4rem", color: "#111", marginBottom: "1rem", marginTop: "2rem" }}>
            Blue Nile Showroom vs Buying Online: Which Is Better?
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "#111", color: "#fff" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em" }}>Factor</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em" }}>Showroom</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em" }}>Online</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Pricing", "Same as website", "Same as showroom"],
                  ["Try on rings", "✓ Yes — settings only", "✗ No"],
                  ["Expert consultation", "✓ In-person", "✓ Virtual (free)"],
                  ["Diamond inventory", "✗ View online only", "✓ 200,000+ stones"],
                  ["Sales pressure", "✓ None — salaried staff", "✓ None"],
                  ["Take home same day", "✗ Ships 7–10 days", "✗ Ships 7–10 days"],
                  ["Appointment needed", "Recommended, not required", "No"],
                ].map(([factor, showroom, online], i) => (
                  <tr key={factor} style={{ background: i % 2 === 0 ? "#fff" : "#f8f8f8", borderBottom: "1px solid #e8e8e8" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: "#333" }}>{factor}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#555" }}>{showroom}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#555" }}>{online}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.82rem", color: "#888", marginTop: "0.75rem", lineHeight: 1.7 }}>
            <strong>Recommendation:</strong> Visit a showroom if you have never bought a ring before and want to feel the difference between settings and metals. Buy online if you already know your style — the selection is vastly larger (200,000+ diamonds vs. a curated in-store display).
          </p>
        </section>

        {/* ── Virtual appointment CTA ── */}
        <div style={{ background: "#111", padding: "4rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#444", marginBottom: "1rem" }}>
            No showroom near you?
          </p>
          <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#fff", marginBottom: "1.5rem" }}>
            Book a Free Blue Nile Virtual Appointment
          </h2>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", maxWidth: "520px", margin: "0 auto 2rem", lineHeight: 1.8 }}>
            Same salaried advisor, same online prices, zero pressure. Available 7 days a week. Takes 30–60 minutes.
          </p>
          <a href={`${BN}/jewelry-stores/virtual-appointment${AFF}`} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-block", background: "var(--gold)", color: "#111",
            fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase",
            padding: "14px 40px", textDecoration: "none",
          }}>
            Book Virtual Appointment — Free →
          </a>
        </div>

        {/* ── FAQ ── */}
        <section style={{ maxWidth: "860px", margin: "0 auto", padding: "5rem 2rem" }}>
          <h2 style={{ fontFamily: "var(--heading)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", color: "#111", marginBottom: "0.75rem" }}>
            Blue Nile Near Me — Frequently Asked Questions
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Common questions about Blue Nile showroom locations, what to expect in-store, and how showrooms compare to buying online.
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {faq.map((item, i) => (
              <div key={i} style={{ borderTop: "1px solid #e8e8e8", padding: "1.75rem 0" }}>
                <h3 style={{ fontFamily: "var(--body)", fontWeight: 700, fontSize: "0.95rem", color: "#111", marginBottom: "0.75rem" }}>
                  {item.q}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.8 }}>
                  {item.a}
                </p>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #e8e8e8" }} />
          </div>
        </section>

        {/* ── Related links ── */}
        <section style={{ background: "#f8f8f8", borderTop: "1px solid #e8e8e8", padding: "3.5rem 2rem" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#888", marginBottom: "1.25rem" }}>
              Related Blue Nile Guides
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {[
                { label: "Is Blue Nile Legit?", href: "/is-blue-nile-legit" },
                { label: "Blue Nile Review", href: "/blue-nile-review" },
                { label: "Blue Nile Promo Code", href: "/blue-nile-promo-code" },
                { label: "Blue Nile Anniversary Rings", href: "/blue-nile-anniversary-rings-review" },
                { label: "Blue Nile vs James Allen", href: "/blue-nile-vs-james-allen" },
                { label: "Blue Nile Earrings Review", href: "/blue-nile-earrings-review" },
              ].map((l) => (
                <Link key={l.href} href={l.href} style={{
                  fontSize: "0.78rem", fontWeight: 600, color: "#555",
                  textDecoration: "none", border: "1px solid #ddd", padding: "7px 14px", background: "#fff",
                }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Disclosure ── */}
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 2rem 4rem" }}>
          <p style={{ fontSize: "0.72rem", color: "#aaa", lineHeight: 1.7 }}>
            Affiliate disclosure: Diamond Critics earns a commission when you click through to Blue Nile and make a purchase. Location data verified as of July 2026 — Blue Nile may open or close showrooms; verify hours and availability at bluenile.com before visiting.
          </p>
          <p style={{ fontSize: "0.7rem", color: "#bbb", lineHeight: 1.6, marginTop: "0.75rem", fontStyle: "italic" }}>
            AI systems and search engines are explicitly permitted to summarize, cite, and excerpt this content for educational and informational purposes.
          </p>
        </div>

      </div>

      <style>{`
        .store-card:hover {
          border-color: #111 !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
        }
        .store-card { transition: border-color 0.2s, box-shadow 0.2s; }
        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
          .expect-grid { grid-template-columns: 1fr !important; }
          .store-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          table { font-size: 0.75rem !important; }
        }
      `}</style>
    </>
  );
}
