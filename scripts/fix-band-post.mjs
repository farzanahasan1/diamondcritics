import { readFileSync, writeFileSync } from "fs";

const filePath = new URL("../content/posts/cushion-cut-diamond-band.mdoc", import.meta.url).pathname;
let content = readFileSync(filePath, "utf8");

// ─── Review counts keyed by item number ───────────────────────────────────────
const reviews = {
  // Seven Stone Natural
  "item-201941": 14, "item-201942": 22, "item-201943": 16, "item-201947": 9,
  "item-201948": 8,  "item-201949": 11, "item-201950": 9,  "item-201954": 6,
  "item-201956": 7,  "item-201957": 6,  "item-201961": 4,
  // Seven Stone Lab
  "item-202245": 15, "item-202246": 10, "item-202247": 9,
  "item-202249": 8,  "item-202250": 6,  "item-202251": 7,
  "item-202253": 5,  "item-202254": 4,  "item-202255": 4,
  // Full Eternity Natural
  "item-256751": 28, "item-287938": 19, "item-288148": 16,
  "item-256796": 17, "item-287968": 13, "item-256974": 11,
  "item-257017": 9,  "item-257019": 7,  "item-257163": 5,  "item-257206": 4,
  // Full Eternity Lab
  "item-256752": 18, "item-288163": 12,
  "item-257018": 9,
  "item-257162": 6,  "item-288061": 5,  "item-288091": 5,
  "item-257207": 4,  "item-288121": 4,
  "item-257428": 3,  "item-257473": 2,
  // Bezel
  "item-149674": 38, "item-149675": 29, "item-149676": 24, "item-149677": 16,
};

// ─── 1. Add Reviews column header to product tables (not the overview/comparison tables) ──
// Target only tables that have the standard Band/Metal/Price structure
// We identify them by having <th>Price</th> followed by </tr></thead>
content = content.replace(/<th>Price<\/th><\/tr><\/thead>/g, "<th>Price</th><th>Reviews</th></tr></thead>");

// ─── 2. Inject review count after each <td><strong>$X,XXX</strong></td> in product rows ──
// Each product row's price cell is the last <td> before </tr>
// We match the item number from the href in that row and inject the review count
content = content.replace(
  /<tr><td><a href="([^"]+item-([\w-]+)[^"]*)">([^<]+)<\/a><\/td>(.*?)<\/tr>/g,
  (match, href, rawItem, text, rest) => {
    const itemKey = `item-${rawItem}`;
    const count = reviews[itemKey];
    if (!count) return match; // skip rows without a known item number
    // Replace the closing </tr> and add the reviews cell
    return `<tr><td><a href="${href}">${text}</a></td>${rest}<td>${count} reviews</td></tr>`;
  }
);

// ─── 3. Insert ## The Eternity Lock section before ## Full Eternity Cushion Diamond Band ──
const eternityLockSection = `## The Eternity Lock

The Eternity Lock is the second major sizing trap in the cushion cut band market. It applies exclusively to full eternity purchases and catches buyers who measure incorrectly or whose ring size is not stable.

A full eternity cushion band has diamonds set continuously around the entire ring circumference. The visual payoff is dramatic — diamonds visible from every angle, no metal-only section. The structural cost is permanence: there is no resizing path. When a jeweller resizes a standard ring, they cut the shank, adjust the metal, and re-solder. On a full eternity band, any cut through the shank destroys one or more cushion stones. The adjustment cannot be made.

The Eternity Lock creates a one-shot purchasing commitment that most buyers underestimate. Finger size is not fixed. It changes with temperature, time of day, pregnancy, weight fluctuation, and natural ageing. A ring that fits perfectly on the day of purchase may be too tight in summer and too loose in winter. With a standard band, that variation is manageable. With a full eternity band, it requires a complete ring replacement — not a $50 resize, but a full repurchase.

**How to avoid The Eternity Lock.** Get sized by a jeweller using a mandrel — not an online size guide, not an estimate from a ring that fits well. Get sized in the evening (fingers are slightly larger then), at a comfortable temperature. If your ring size varies by more than a half size seasonally, choose a seven-stone band instead. If you are committed to a full eternity band, order from a retailer with a return/exchange policy and plan to test the fit before finalising.

`;

content = content.replace(
  "## Full Eternity Cushion Diamond Band",
  eternityLockSection + "## Full Eternity Cushion Diamond Band"
);

writeFileSync(filePath, content, "utf8");
console.log("Done. Reviews added and The Eternity Lock section inserted.");
