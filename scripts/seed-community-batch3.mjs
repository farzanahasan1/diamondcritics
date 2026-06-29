import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const URL  = "https://jfknkkemecwvohxaeqpl.supabase.co";
const KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impma25ra2VtZWN3dm9oeGFlcXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM1NjM2MCwiZXhwIjoyMDk3OTMyMzYwfQ.sUUeQOnOwejSFKF-6hfVZOOtdS_yrHAfztwjkDB0FZI";
const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

const { data: comm } = await supabase
  .from("communities").select("id").eq("slug", "diamonds").single();
if (!comm) throw new Error("Community 'diamonds' not found");
const commId = comm.id;

const { data: profiles } = await supabase
  .from("profiles").select("id, username")
  .in("username", ["Jessica_Miller_PDX","Sophie_Laurent","EmmaWatts_UK","Marcus_Webb",
                   "Jake_Anderson_DC","Sarah_Collins_NYC","Oliver_Hughes","Ryan_Mitchell_LA","Daniel_Foster"]);

const u = {};
for (const p of profiles) u[p.username] = p.id;

const ago = (days, hours=0) => new Date(Date.now() - (days*86400 + hours*3600)*1000).toISOString();

const posts = [
  {
    id: randomUUID(), community_id: commId, author_id: u["Jessica_Miller_PDX"],
    title: "Lab vs natural diamond — I spent 3 weeks researching before deciding. Here is everything I learned.",
    body: `I was completely torn for months. My budget was $6,000 and I kept going back and forth. Here is the honest breakdown after doing real homework.

**What a lab diamond actually is:**
Lab diamonds are chemically, physically and optically identical to natural diamonds. Same carbon crystal structure, same hardness (10 on Mohs), same light dispersion. A gemologist cannot tell the difference without specialized equipment.

**Price difference:**
For my budget of $6,000:
- Natural: 1.00ct G-VS1 GIA Excellent round
- Lab: 2.20ct G-VS1 IGI Excellent round

That is more than twice the size for the same price. The size difference is not subtle — it is enormous.

**The resale argument:**
Natural diamonds hold value better. True. But "hold value" is not the same as "investment." A 1ct natural G-VS1 bought for $5,500 today resells for around $1,500–2,500 on the secondary market. You lose 55–70% either way. Neither is an investment.

**What I decided:**
I bought the lab diamond. My fiancée has a 2.20ct that looks extraordinary. Nobody at our engagement party asked "is that natural or lab?" They asked "oh my god, can I see your ring?"

The only honest reason to buy natural is if it matters to YOU symbolically. That is a real reason. Just don't tell yourself it's a financial decision — it isn't.

**What I wish someone had told me earlier:** The diamond does not know where it came from. Your fiancée probably won't either unless you tell her.`,
    flair: "lab", type: "text", score: 412, upvotes: 441, downvotes: 29,
    comment_count: 4, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(3, 2), updated_at: ago(3, 2),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Marcus_Webb"],
    title: "Cut quality matters more than anything else. I have held 50+ diamonds and this is what I learned.",
    body: `I spent four months visiting jewelers and handling diamonds before proposing last year. The single most important thing I learned:

**Cut is everything.**

I held two diamonds side by side:
- Diamond A: 1.20ct, F color, VVS2 clarity, GIA Very Good cut — $7,200
- Diamond B: 1.05ct, H color, SI1 clarity, GIA Excellent cut — $5,800

Diamond B was blindingly beautiful. Diamond A looked dull in comparison. Anyone looking at both stones for 10 seconds would pick Diamond B.

The difference: light performance. An Excellent cut diamond is engineered to return maximum light back to the viewer's eye. A Very Good cut loses more light through the bottom.

**The hierarchy of what matters:**
1. Cut — non-negotiable, always Excellent
2. Cut — still the most important
3. Cut — I cannot stress this enough
4. Then color (G or H is fine for white metal)
5. Then clarity (VS2 or even SI1 eye-clean is fine)
6. Then carat — buy as large as your budget allows AFTER getting cut right

**Tools I used:**
- GIA Report Check to verify every certificate
- Blue Nile's advanced search filters
- James Allen's 360° video on every stone

Spend 20 minutes with the GIA cut grade explainer. It will save you thousands and get you a better ring.`,
    flair: "natural", type: "text", score: 389, upvotes: 408, downvotes: 19,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(5, 7), updated_at: ago(5, 7),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Sarah_Collins_NYC"],
    title: "GIA vs IGI — which certification should I trust for my diamond? Honest breakdown from a first-time buyer.",
    body: `I was completely confused by this when I started shopping. Here is what I figured out after a lot of research.

**GIA (Gemological Institute of America)**
- Founded 1931, the original and most trusted grading lab
- Grading is strict and consistent — a GIA G-VS1 is reliably a G-VS1
- Preferred for natural diamonds
- Adds approximately 10–15% to the diamond's price premium
- Diamond dealers and resellers universally accept GIA at face value

**IGI (International Gemological Institute)**
- Widely used, especially for lab-grown diamonds
- Grading is slightly more lenient than GIA on natural stones (a GIA H might be an IGI G)
- For lab-grown diamonds: IGI has become the industry standard and grading is reliable
- Significantly cheaper certification, so diamonds cost less

**My practical recommendation:**
- Natural diamond: always GIA. The premium is worth it for accuracy.
- Lab-grown diamond: IGI is fine and widely accepted. You're not losing anything meaningful.

**What to avoid:**
EGL (European Gemological Laboratory) — their grading is notoriously inconsistent. I would not buy an EGL-certified stone. Neither would most serious dealers.

I bought a GIA-certified natural 1ct and am very happy. But if I'd gone lab, I would have been completely comfortable with IGI.

Anyone else have experience comparing the two in person?`,
    flair: "gia-igi", type: "text", score: 276, upvotes: 291, downvotes: 15,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(7, 3), updated_at: ago(7, 3),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Oliver_Hughes"],
    title: "SI1 vs VS2 clarity — is the price difference worth it? I had both examined by a gemologist.",
    body: `This question comes up constantly and I finally got a definitive answer for my situation.

Context: I was choosing between two otherwise identical stones:
- VS2 G Excellent 1.10ct: $6,100
- SI1 G Excellent 1.10ct: $5,200

The $900 difference on the same size and cut.

**What I did:**
I paid $75 for a gemologist consultation at a local independent store. I brought the GIA reports for both.

The gemologist's finding on the SI1:
- Two small feathers (fractures) in opposite corners of the stone
- Not visible at 10x loupe
- Definitely not visible to the naked eye from any normal viewing angle
- "Eye-clean" in gemologist terminology

The VS2:
- One tiny pinpoint inclusion near the girdle
- Not visible at 10x without knowing exactly where to look

**Practical conclusion:**
Both were eye-clean. The VS2 was "cleaner" technically but you would never know looking at either ring normally.

I bought the SI1.

**The important caveat:**
Not all SI1 stones are eye-clean. The inclusion type and location matter enormously. A feather near the center-top is much more visible than one near the girdle. Always view the actual diamond (or high-res video) and check the clarity plot on the GIA report before buying.

The GIA report tells you WHERE the inclusions are. Learn to read it before you buy.`,
    flair: "price-check", type: "text", score: 334, upvotes: 352, downvotes: 18,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(11, 5), updated_at: ago(11, 5),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Ryan_Mitchell_LA"],
    title: "Blue Nile vs James Allen vs local jeweler — I bought from all three. Real honest comparison.",
    body: `I know this gets asked a lot so I figured I'd give a truly firsthand answer. I've now purchased from all three for different pieces.

**Blue Nile**
Bought: 0.91ct H-VS2 GIA Excellent round for $3,800
Experience: Smooth checkout, arrived in 5 days, GIA cert arrived separately. Diamond looks great. Zero issues. Customer service was responsive when I had a question about the prong type. Best price I found for this exact stone. The 360° videos are lower quality than James Allen.

**James Allen**
Bought: 1.05ct G-SI1 GIA Excellent round for $4,900
Experience: Their True Hearts (Hearts & Arrows) stones are genuinely beautiful and well documented. The 3D spin viewer on every stone is excellent — you can really assess the stone before buying. Slightly higher prices than Blue Nile on comparable stones but often worth it for the video quality alone. Lifetime warranty on settings is a plus.

**Local independent jeweler**
Bought: custom eternity band
Experience: You pay more — typically 20–40% above online. But: you see the stone in person, you can negotiate, you build a relationship for future repairs/resizing, and they can do custom work that online retailers can't. For the main stone, I'd still go online. For custom settings or if you need to see before you buy, local is worth the premium.

**My recommendation:**
Use James Allen to research stones visually (their videos are best). Then check Blue Nile for the same certificate number — often cheaper. Buy wherever is lower after you find a stone you like on both sites.`,
    flair: "need-advice", type: "text", score: 298, upvotes: 316, downvotes: 18,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(14, 8), updated_at: ago(14, 8),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["EmmaWatts_UK"],
    title: "Moissanite vs diamond — I wore both for 6 months. My completely honest update.",
    body: `I know this is a sensitive topic in some diamond communities. I'm going to give you the honest version.

Background: I got engaged with a 2ct moissanite (Charles & Colvard Forever One) in rose gold. I wore it for 6 months. My sister-in-law then gifted me a 1ct natural GIA diamond to compare with directly.

**What moissanite actually looks like:**
Absolutely gorgeous. More fiery than diamond — the rainbow sparkle is more intense, which some people love and some find "disco ball" in bright light. In most everyday lighting, it is stunning.

In direct sunlight or strong LED spotlights, the fire difference is noticeable if you know what to look for. If you don't know, you won't care.

**Hardness:**
Moissanite is 9.25 on Mohs. Diamond is 10. In practice, moissanite holds up extremely well. After 6 months of daily wear including gym, cooking, gardening — no chips, scratches or dulling.

**Price:**
My 2ct moissanite: $600. A 2ct natural diamond equivalent: $18,000–25,000. A 2ct lab diamond: $3,000.

**The honest truth:**
If your fiancée knows and is happy with moissanite: amazing choice, beautiful stone, save tens of thousands.

If she specifically wants a diamond and you give her moissanite without saying: she will eventually find out and that will hurt far more than the money.

Have the conversation first. The ring should match what she actually wants.`,
    flair: "comparison", type: "text", score: 445, upvotes: 478, downvotes: 33,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(18, 6), updated_at: ago(18, 6),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Daniel_Foster"],
    title: "Princess cut settings — what nobody tells you before you buy. 18 months of wearing one.",
    body: `My wife has worn a princess cut solitaire for 18 months now. Things I wish we'd known:

**The corners problem:**
Princess cuts have four sharp corners. These are the most vulnerable points. We've had one corner chip (minor, repaired for $180) after it caught on a kitchen cabinet door. The prongs protecting the corners need to be V-shaped, not standard round prongs — make sure your setting uses corner V-prongs specifically designed for princess cuts.

**It snags everything:**
The sharp corners catch on fabrics constantly. Knitwear, silk blouses, bedsheets. This was the biggest adjustment. She now removes it for bed (which diamond experts recommend anyway) but the first month was rough.

**The flattering part:**
Princess cuts look larger face-up than round brilliants of the same carat weight because of the square shape. Her 0.90ct princess looks comparable to a 1.00ct round on her finger. Real advantage.

**The sparkle difference:**
Princess cut sparkle is different from round — it's more blocky and geometric, less "crushed ice." Some people prefer it. It's not worse, just different. Make sure your partner has seen a princess cut in person and prefers it to rounds before committing.

**Setting recommendation:**
4-prong solitaire with V-prong corners in platinum or 14K white gold. Bezel settings protect corners but hide more of the stone. Cathedral settings look elegant but raise the stone higher (more snagging risk).

Happy to answer specific questions about everyday wear.`,
    flair: "discussion", type: "text", score: 267, upvotes: 283, downvotes: 16,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(22, 4), updated_at: ago(22, 4),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Jake_Anderson_DC"],
    title: "Diamond resale value — the numbers nobody wants to hear. I sold three diamonds.",
    body: `I've sold three diamonds over the last eight years — two natural, one lab. Here are the exact numbers.

**Natural diamond #1: 2016**
Bought: 0.72ct F-VS1 GIA Excellent, paid $2,900 at a local jeweler
Sold: 2019 via Ido/Estate buyers at $980
Loss: 66%

**Natural diamond #2: 2020**
Bought: 1.05ct G-VS2 GIA Excellent on Blue Nile, paid $5,200
Sold: 2023 via Worthy.com (online auction), received $2,100
Loss: 60%

**Lab diamond: 2022**
Bought: 1.80ct H-VS1 IGI Excellent, paid $1,800
Sold: 2024 via local estate buyer, received $200
Loss: 89%

**The reality:**
Natural diamonds lose 55–70% of retail value when resold through secondary channels. Lab diamonds lose 80–90%+. Neither is an investment.

The resale market for natural diamonds exists (Worthy, I Do Now I Don't, estate buyers). The resale market for lab diamonds is essentially non-existent because new lab diamonds keep getting cheaper every year.

**What this means practically:**
- Don't buy a diamond thinking you'll break even if things don't work out
- The "natural holds value better" argument is true but both lose money
- Buy the diamond you WANT, not the diamond you think you can sell

If someone tells you to buy a natural diamond "as an investment," they're either misinformed or selling you something.`,
    flair: "discussion", type: "text", score: 356, upvotes: 381, downvotes: 25,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(26, 9), updated_at: ago(26, 9),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Sophie_Laurent"],
    title: "Ethical sourcing and diamonds — what the Kimberley Process actually covers (and what it doesn't).",
    body: `I asked my jeweler about ethical sourcing and they said "all our diamonds are Kimberley Process certified." I looked it up. Here is what that actually means — and what it doesn't.

**The Kimberley Process (KP):**
Established 2003 to prevent "conflict diamonds" (diamonds funding rebel military groups in civil wars). It requires participating countries to certify diamonds as "conflict-free."

**What the KP covers:**
Diamonds that directly fund rebel groups overthrowing recognized governments. A narrow definition that was relevant in the Sierra Leone/Angola conflicts of the 1990s.

**What the KP does NOT cover:**
- Human rights abuses by recognized governments mining diamonds
- Child labor in small artisanal mining operations
- Environmental destruction from mining
- Unsafe labor conditions
- Exploitation of workers who aren't in "rebel" contexts

So "Kimberley Process certified" means the diamond didn't fund a rebel army. It says nothing about labor conditions, environmental impact, or government-sanctioned abuses.

**Alternatives for genuinely ethical sourcing:**
1. **Lab-grown diamonds** — no mining, no conflict, lower environmental impact than natural mining
2. **Canadian diamonds** — strong environmental regulations, documented chain of custody
3. **Vintage/estate diamonds** — no new mining impact
4. **Responsible Jewellery Council certified** — higher standard than KP, audits supply chains

I ended up buying a lab diamond specifically for this reason. Not because natural diamonds are evil, but because I couldn't verify enough about the chain.`,
    flair: "discussion", type: "text", score: 289, upvotes: 308, downvotes: 19,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(30, 2), updated_at: ago(30, 2),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Jessica_Miller_PDX"],
    title: "Fancy shape diamonds 2025 — which shapes are trending and which are undervalued right now?",
    body: `I've been researching fancy shapes for the past month because I wanted something different from round. Here's what I found.

**Currently trending (= higher prices):**
- **Elongated cushions** — very popular on social media, bridal influencers love them
- **Oval** — still strong demand, gives the "finger-lengthening" effect
- **Pear** — having a major moment, driven by celebrity rings (Lady Gaga, Ariana Grande effect)
- **Radiant** — held steady, popular for colored stones

**Undervalued right now:**
- **Asscher** — Art Deco geometric look, not currently trendy = better pricing
- **Marquise** — elongated shape, significant price discount vs oval for similar face-up size
- **Princess** — slightly less fashionable than 5 years ago = opportunity for buyers

**Shape-specific tips I learned:**
- **Oval**: watch the "bow-tie effect" (dark shadow across center). Not all ovals have it. View in 360° video.
- **Pear**: orientation matters — wear point up or point down based on hand shape
- **Marquise**: very long face-up appearance, great value per carat, polarizing shape
- **Emerald**: "hall of mirrors" pattern, shows inclusions more than other shapes — buy VS1 or better

**Price per carat vs round (same quality):**
- Oval: -10 to -15%
- Pear: -10 to -20%
- Marquise: -20 to -30%
- Asscher: -25 to -35%
- Radiant: -15 to -25%

Worth considering if you want more size for your budget.`,
    flair: "discussion", type: "text", score: 312, upvotes: 333, downvotes: 21,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(35, 6), updated_at: ago(35, 6),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Marcus_Webb"],
    title: "How to check if a diamond is eye-clean — the exact process I use at jewelers and online.",
    body: `"Eye-clean" is one of the most used and least explained terms in diamond buying. Here is exactly how I evaluate it.

**Definition:**
Eye-clean means no inclusions are visible to the naked eye from a normal viewing distance (approximately 10–12 inches / 25–30cm) in face-up position under typical lighting.

**In-person at a jeweler:**
1. Hold the diamond face-up at arm's length (about 10 inches from your eye)
2. Look at it in the lighting conditions of the store (not just the intense spotlights — also try near a window)
3. Look for dark spots, white clouds, or scratches visible without a loupe
4. If you can't see anything without effort, it's eye-clean
5. Then ask for a loupe to see what's there — this is the GIA report made visible

**Online buying (James Allen / Blue Nile):**
1. Use their 360° video viewer and zoom in to maximum
2. Switch between face-up and edge views
3. Look for inclusions visible at maximum digital zoom
4. Read the GIA clarity plot to see WHERE inclusions are located
5. Center-top is most visible; near girdle or pavilion are least

**Clarity grades that are usually eye-clean:**
- FL, IF, VVS1, VVS2: always eye-clean (you're paying for lab cleanliness you can't see)
- VS1, VS2: almost always eye-clean
- SI1: often eye-clean, but varies — MUST verify
- SI2: sometimes eye-clean, needs careful evaluation
- I1 and below: usually visible to naked eye

The sweet spot for value: SI1 or VS2 that you've verified as eye-clean. You skip the premium for invisible perfection.`,
    flair: "need-advice", type: "text", score: 401, upvotes: 423, downvotes: 22,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(40, 3), updated_at: ago(40, 3),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Ryan_Mitchell_LA"],
    title: "Custom engagement ring vs pre-made — I went custom. Timeline, cost, and what I'd do differently.",
    body: `I decided to go custom after not finding exactly what I wanted from online retailers. Here is the full experience.

**Why I went custom:**
I wanted a specific combination: cathedral solitaire with a hidden halo on the underside of the head, in platinum, with milgrain detailing. No online retailer had this exact combination in my fiancée's ring size (4.5).

**The process:**
- Week 1: In-person consultation with jeweler, described the vision, they sketched concepts
- Week 2: CAD renderings sent over email (3 different angles, realistic rendering)
- Week 3: Approved the CAD, selected the diamond (0.95ct G-VS1 GIA Excellent) from their supplier stock
- Week 4–7: Wax casting, platinum casting, stone setting, polishing
- Week 8: Final inspection and pickup

**Cost breakdown:**
- Diamond: $4,800 (same stone I could have bought on Blue Nile for $4,600, so minimal markup)
- Setting labor and platinum: $1,400
- Total: $6,200

**Comparable pre-made ring from James Allen:** ~$5,400 for a similar (not identical) style

**What I'd do differently:**
1. Budget more time. I started with 4 weeks and panicked at week 3. Custom takes 6–10 weeks minimum.
2. Get everything in writing — design details, metal weight, stone specs, warranty terms.
3. Ask to see photos at each stage (wax, cast, pre-polish).

The result was exactly what I envisioned. Worth it for the unique design. If you can find what you want pre-made, pre-made is faster and sometimes cheaper.`,
    flair: "show-tell", type: "text", score: 243, upvotes: 258, downvotes: 15,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(45, 7), updated_at: ago(45, 7),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Sarah_Collins_NYC"],
    title: "Proposing on a tight budget — what $2,000 actually gets you and how to make it special.",
    body: `Not everyone has $5,000–10,000 for an engagement ring. I want to talk honestly about what $2,000 gets you and how to make it work beautifully.

**What $2,000 buys in natural diamonds:**
Around 0.50–0.60ct, G-H color, SI1-VS2, GIA Excellent cut, solitaire in 14K gold. This looks beautiful in person. Nobody looks at a ring and thinks "that's only 0.5ct." They think "what a lovely ring."

**What $2,000 buys in lab diamonds:**
Around 1.50–1.80ct, G-H color, VS2-SI1, IGI Excellent cut. This is a genuinely large, impressive stone that will get compliments constantly.

**What $2,000 buys in moissanite:**
Around 2.00–3.00ct equivalent, beautiful fire and brilliance, conflict-free, nearly identical to diamond visually.

**My recommendation for a $2,000 budget:**
Lab diamond. You get a ring that looks like it costs $8,000+ at actual retail for natural. Your partner wears it every day for the rest of her life — make it something that makes her proud to show off.

**The important thing nobody says:**
The love behind the proposal matters infinitely more than the stone size. My sister got proposed to with a family heirloom ring that was worth $400. She's been married 12 years and it's her most precious possession.

But if you're buying new: lab diamond at $2,000 gives you the most beautiful ring for the money. Full stop.`,
    flair: "need-advice", type: "text", score: 521, upvotes: 558, downvotes: 37,
    comment_count: 4, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(50, 5), updated_at: ago(50, 5),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Oliver_Hughes"],
    title: "Diamond ring maintenance — what to do every month, every year, and what NOT to do.",
    body: `My wife has worn her ring daily for four years. Here is the maintenance routine we've figured out.

**Daily:**
- Remove before bed (prongs catch on sheets, wear them down faster)
- Remove before swimming (chlorine weakens gold alloys over time, resizes finger in cold water)
- Remove before gardening/gym/heavy lifting

**Weekly:**
- Quick soak in warm water with a drop of dish soap, 5 minutes
- Soft toothbrush (children's size) around the prongs and under the setting
- Rinse under warm water
- Pat dry with a lint-free cloth
- Check that all prongs feel secure (press gently with a fingernail)

**Every 6 months:**
- Professional ultrasonic cleaning at a jeweler (usually free where you bought the ring)
- Professional prong inspection — this is critical
- Rhodium plating if you have white gold (white gold yellows over time, rhodium restores the white finish)

**Every 1–2 years:**
- Professional re-tip any prongs showing wear
- Full inspection of the setting, check for loose stone

**What NOT to do:**
- No toothpaste (too abrasive, scratches gold)
- No bleach or harsh chemicals
- No ultrasonic cleaner at home if your diamond has fractures (SI1 with feathers especially)
- No leaving in sunlight for hours (thermal expansion can stress settings)

The single most important thing: keep up with prong inspections. Lost stones happen when prong wear is ignored. Insurance covers it but it's traumatic.`,
    flair: "discussion", type: "text", score: 378, upvotes: 396, downvotes: 18,
    comment_count: 3, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(55, 3), updated_at: ago(55, 3),
  },
  {
    id: randomUUID(), community_id: commId, author_id: u["Daniel_Foster"],
    title: "Carat weight guide — what different sizes actually LOOK LIKE on a hand. With measurements.",
    body: `Before I bought, I desperately wanted someone to tell me what these weights actually look like in real life. Here it is.

**Round brilliant face-up diameters (approximate):**
| Carat | Diameter |
|-------|----------|
| 0.50ct | 5.2mm |
| 0.75ct | 5.9mm |
| 1.00ct | 6.5mm |
| 1.25ct | 6.9mm |
| 1.50ct | 7.4mm |
| 2.00ct | 8.2mm |
| 2.50ct | 9.0mm |
| 3.00ct | 9.4mm |

**To visualize this:**
A US dime is 17.9mm across. A 1ct round is 6.5mm — about 36% of a dime's width. A 2ct is about 46% of a dime's width. Print a dime-size circle and draw these diameters inside it.

**The ring size factor:**
These sizes look different on different hands. On a size 5 finger (slender), a 1ct looks substantial. On a size 8 finger (larger hand), a 1ct looks modest. Always consider your partner's hand size when targeting carat weight.

**What looks "impressive" at different sizes:**
- Size 5–6 finger: 0.75ct–1.00ct looks great
- Size 6–7 finger: 1.00ct–1.25ct is the sweet spot
- Size 7–8 finger: 1.25ct–1.50ct balances well

**The "bigger is always better" trap:**
A too-large stone on a slender finger looks top-heavy and can actually look less beautiful than a proportional stone. This is why ring sizing matters for stone selection too.

I brought printed circles to the jeweler and it helped enormously.`,
    flair: "need-advice", type: "text", score: 467, upvotes: 492, downvotes: 25,
    comment_count: 4, is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(60, 8), updated_at: ago(60, 8),
  },
];

// ── Insert posts ──────────────────────────────────────────────────────────────

const { error: postError } = await supabase.from("posts").insert(posts);
if (postError) {
  console.error("❌ Post insert failed:", postError.message);
  process.exit(1);
}
console.log(`✅ Inserted ${posts.length} posts`);

// ── Insert comments (3 per post) ──────────────────────────────────────────────

const commentAuthors = ["Jessica_Miller_PDX","Sophie_Laurent","EmmaWatts_UK","Marcus_Webb",
                        "Jake_Anderson_DC","Sarah_Collins_NYC","Oliver_Hughes","Ryan_Mitchell_LA","Daniel_Foster"];

const commentTemplates = [
  [
    ["Marcus_Webb", "This mirrors my experience exactly. The lab vs natural debate online can get tribal but the honest financial math is impossible to argue with."],
    ["Sarah_Collins_NYC", "We went lab and got a 2.10ct that makes everyone's jaw drop. Zero regrets after 8 months of wearing it."],
    ["Oliver_Hughes", "The resale point is crucial. People treat diamonds like investments when they clearly aren't for most buyers."],
    ["Ryan_Mitchell_LA", "Great writeup. The only thing I'd add: disclose to your partner before buying. Some people feel strongly about natural for personal reasons."],
  ],
  [
    ["Jessica_Miller_PDX", "Cut first, always. I tell everyone this. A well-cut H will outshine a poorly-cut D every single time."],
    ["EmmaWatts_UK", "The James Allen 360° viewer was game-changing for me. Could actually see the light performance before buying."],
    ["Daniel_Foster", "I held a GIA Excellent next to a Very Good of the same grade and the difference in person was stunning. Night and day."],
  ],
  [
    ["Jake_Anderson_DC", "GIA for natural, IGI for lab. Simple rule that's served me well across four purchases."],
    ["Oliver_Hughes", "Avoid EGL — this cannot be overstated. I almost bought an EGL stone thinking it was a deal. It was graded 2 grades more favorably than GIA would have graded it."],
    ["Ryan_Mitchell_LA", "Asked my local jeweler about other labs. He specifically warned me off EGL too. The industry knows."],
  ],
  [
    ["Sophie_Laurent", "Eye-clean SI1 is the move for round brilliants on any budget. You cannot see the difference but you'll definitely feel the savings."],
    ["Marcus_Webb", "The feather location point is so important. My SI1 has inclusions near the girdle — completely invisible, grade doesn't capture that nuance."],
    ["Sarah_Collins_NYC", "Paid for the gemologist consultation too. $75 well spent. She showed me exactly what 'eye-clean' means in practice."],
  ],
  [
    ["Jessica_Miller_PDX", "I cross-checked Blue Nile and James Allen on the same GIA cert number and Blue Nile was $320 cheaper. Same stone."],
    ["EmmaWatts_UK", "Local jeweler for the setting, online for the stone. Best of both worlds and I got to see the setting before deciding."],
    ["Daniel_Foster", "The True Hearts from James Allen are legitimately special for light performance. Worth the premium if cut quality is your priority."],
  ],
  [
    ["Marcus_Webb", "The bow-tie shadow discussion is crucial for ovals and pears. Some people love it, some hate it. See your stone in video first."],
    ["Jake_Anderson_DC", "Wore my wife's moissanite for a day while it was being resized. The fire really is extraordinary. Different to diamond but absolutely beautiful."],
    ["Sarah_Collins_NYC", "The disclosure thing is so important. A friend gave her partner moissanite and it became a real issue when she found out. Have the conversation."],
  ],
  [
    ["Sophie_Laurent", "The corner snag issue is real. My sister's princess cut caught on a merino sweater and pulled threads everywhere. She loves the ring but wishes she'd known."],
    ["Ryan_Mitchell_LA", "V-prongs are essential for princess cuts, agreed. I'd also add: check the prongs every 6 months. Princess corner prongs wear faster."],
    ["EmmaWatts_UK", "The face-up size advantage over round is a real bonus. 0.90ct princess really does look like a 1ct round."],
  ],
  [
    ["Jessica_Miller_PDX", "The Worthy auction platform has been the best for natural stone resale in my experience. Better than local estate buyers by quite a bit."],
    ["Oliver_Hughes", "The lab diamond resale situation is genuinely bad. $200 for a $1,800 stone. Keep that in mind when doing the math."],
    ["Marcus_Webb", "This should be mandatory reading before any diamond purchase. Everyone thinks it's an asset class. It isn't."],
  ],
  [
    ["Ryan_Mitchell_LA", "Canadian diamonds have a noticeable price premium too but the chain of custody documentation is genuinely rigorous."],
    ["Daniel_Foster", "The vintage/estate option is fascinating for ethical sourcing. No new mining, and you can find incredible stones in estate jewelry."],
    ["Jake_Anderson_DC", "Went lab specifically for the ethical reasons too. Whatever the symbolism argument, the supply chain transparency is much simpler."],
  ],
  [
    ["EmmaWatts_UK", "Oval is still my favorite shape after a year of wearing mine. The elongating effect on the finger is genuinely flattering."],
    ["Sarah_Collins_NYC", "The bow-tie in ovals varies so much. Spent hours watching 360° videos comparing bow-tie severity across different stones. Worth the time."],
    ["Sophie_Laurent", "Marquise is criminally undervalued right now. Such a dramatic, beautiful shape and the price discount is real."],
  ],
  [
    ["Jessica_Miller_PDX", "The SI1 center-top inclusion point is crucial. I had two SI1 stones — one was eye-clean, one wasn't. The GIA plot showed exactly why."],
    ["Jake_Anderson_DC", "FL and IF grades are paying for lab perfection. 99% of buyers can't see the difference from VS2. Keep the money."],
    ["Ryan_Mitchell_LA", "James Allen's digital zoom was how I screened 40+ stones before picking one. Far more useful than text descriptions."],
  ],
  [
    ["Marcus_Webb", "The 6-10 week timeline warning is so important. I started custom with 5 weeks to spare and it was genuinely stressful."],
    ["EmmaWatts_UK", "Ask for stage photos — this is great advice. My jeweler sent wax photos and I caught a small dimension error before it was cast."],
    ["Oliver_Hughes", "The diamond markup at local jewelers for pre-made rings is typically higher. Custom where you supply the stone specification is actually comparable."],
  ],
  [
    ["Daniel_Foster", "Lab diamond at $2k is genuinely impressive. My cousin's 1.70ct lab on a silver-toned band looks like a $10k ring."],
    ["Jessica_Miller_PDX", "The family heirloom point really hit. The ring is a symbol. The size is incidental to the meaning."],
    ["Sophie_Laurent", "Moissanite is also worth considering at $2k. Charles & Colvard Forever One in a lovely setting is genuinely beautiful."],
    ["Jake_Anderson_DC", "Whatever the budget, prioritize cut over size. A well-cut 0.70ct is more beautiful than a poorly-cut 1ct."],
  ],
  [
    ["Ryan_Mitchell_LA", "The prong inspection point is the one people skip. Lost a stone my wife's friend had because prongs were never checked. Insure the ring too."],
    ["Sarah_Collins_NYC", "Rhodium replating for white gold — so many people don't know this is necessary. White gold yellows noticeably without it every 1-2 years."],
    ["Marcus_Webb", "Removed before bed since day one. The prong wear argument sold me. Also: ring dishes by the sink so you always know where it is."],
  ],
  [
    ["Sophie_Laurent", "Printing the diameter circles was brilliant. I did the same thing with a printed scale ruler before my appointment. Really helps calibrate expectations."],
    ["EmmaWatts_UK", "The ring size factor is underappreciated. A 1ct on my size 5 hand looks substantial. A 1ct on my friend's size 8 hand looks petite."],
    ["Jessica_Miller_PDX", "The carat weight table deserves to be pinned. Bookmarked this post for when friends ask me where to start."],
    ["Daniel_Foster", "The proportionality point is the one jewelers don't always say — they want to sell you more carats. Match the stone to the hand."],
  ],
];

const comments = [];
posts.forEach((post, postIdx) => {
  const templateSet = commentTemplates[postIdx] ?? commentTemplates[0];
  templateSet.forEach((tpl, cIdx) => {
    const [authorName, body] = tpl;
    const authorId = u[authorName];
    if (!authorId) return;
    comments.push({
      id: randomUUID(),
      post_id: post.id,
      author_id: authorId,
      parent_id: null,
      body,
      score: Math.floor(Math.random() * 80) + 15,
      is_deleted: false,
      created_at: ago(parseInt(post.created_at.split("T")[0].slice(-2)) || 1, cIdx + 1),
    });
  });
});

const { error: commentError } = await supabase.from("comments").insert(comments);
if (commentError) {
  console.error("❌ Comment insert failed:", commentError.message);
  process.exit(1);
}
console.log(`✅ Inserted ${comments.length} comments`);
console.log("🎉 Batch 3 seeding complete!");
