// ── UPDATE DEALS HERE whenever Blue Nile offers change ───────────────────────
const DEALS = [
  {
    badge: "Summer Sale",
    headline: "Tides Of Summer Capsule",
    offer: "Up To 30% Off",
    url: "https://www.bluenile.com/jewelry/todays-jewelry-deals?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=Blue_nile_deal_notice",
    cta: "Shop The Sale →",
  },
  {
    badge: "Vault Clearance",
    headline: "Clear The Vault",
    offer: "Up To 70% Off",
    url: "https://www.bluenile.com/clear-the-vault?a_aid=69d7c31a91b8d&a_cid=55e51e63&chan=Blue_nile_deal_notice",
    cta: "Shop Vault Deals →",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function BluenileDealsCTA() {
  return (
    <div className="bn-cta-wrap">
      <div className="bn-cta-header">
        <span className="bn-cta-live-dot" />
        <span>Live Deals · Blue Nile</span>
      </div>

      <div className="bn-cta-grid">
        {DEALS.map((deal) => (
          <a
            key={deal.url}
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bn-cta-card"
          >
            <span className="bn-cta-badge">{deal.badge}</span>
            <p className="bn-cta-headline">{deal.headline}</p>
            <p className="bn-cta-offer">{deal.offer}</p>
            <span className="bn-cta-btn">{deal.cta}</span>
          </a>
        ))}
      </div>

      <p className="bn-cta-disc">Affiliate link — no extra cost to you</p>
    </div>
  );
}
