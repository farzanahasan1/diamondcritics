import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const URL  = "https://jfknkkemecwvohxaeqpl.supabase.co";
const KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impma25ra2VtZWN3dm9oeGFlcXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM1NjM2MCwiZXhwIjoyMDk3OTMyMzYwfQ.sUUeQOnOwejSFKF-6hfVZOOtdS_yrHAfztwjkDB0FZI";
const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

// ── Fetch required IDs ──────────────────────────────────────

const { data: comm } = await supabase
  .from("communities").select("id").eq("slug", "diamonds").single();
if (!comm) throw new Error("Community 'diamonds' not found — run full_setup.sql first");
const commId = comm.id;

const { data: profiles } = await supabase
  .from("profiles").select("id, username")
  .in("username", ["Jessica_Miller_PDX","Sophie_Laurent","EmmaWatts_UK","Marcus_Webb",
                   "Jake_Anderson_DC","Sarah_Collins_NYC","Oliver_Hughes","Ryan_Mitchell_LA","Daniel_Foster"]);

const u = {};
for (const p of profiles) u[p.username] = p.id;
const missing = ["Jessica_Miller_PDX","Sophie_Laurent","EmmaWatts_UK","Marcus_Webb",
                 "Jake_Anderson_DC","Sarah_Collins_NYC","Oliver_Hughes","Ryan_Mitchell_LA","Daniel_Foster"]
  .filter(n => !u[n]);
if (missing.length) throw new Error(`Missing users: ${missing.join(", ")} — run seed_community_posts.sql first`);

console.log("✅ Community and users found");

// ── Generate UUIDs ──────────────────────────────────────────

const p = Array.from({length:10}, () => randomUUID());
const c = Array.from({length:30}, () => randomUUID());
// c[0..2]=post1, c[3..5]=post2, etc.

const now = () => new Date().toISOString();
const ago = (days, hours=0) => new Date(Date.now() - (days*86400 + hours*3600)*1000).toISOString();

// ── Insert Posts ────────────────────────────────────────────

const posts = [
  {
    id: p[0], community_id: commId, author_id: u["Jake_Anderson_DC"],
    title: "I bought a 0.91ct instead of 1.00ct and saved $820 on an identical-looking stone. The math no one explains when you are shopping.",
    body: `I was set on a 1ct round brilliant. That is what I said I wanted for eight months of shopping.

Then a gemologist friend explained the carat threshold effect to me.

Diamond prices do not increase linearly with carat weight. They jump at psychological milestones: 0.50ct, 0.75ct, 1.00ct, 1.50ct, 2.00ct. At each threshold, the price per carat increases by 15–25% compared to just below the threshold.

The comparison I ran on Blue Nile:

• 1.00ct G-VS1, Excellent: $5,210
• 0.91ct G-VS1, Excellent: $4,390

Difference: $820 for 0.09 carats. That is 9% of the carat weight costing 19% of the price.

Face-up size:
• 1.00ct round: approximately 6.5mm diameter
• 0.91ct round: approximately 6.2mm diameter

That is 0.3mm. On a size 7 finger, a 0.3mm difference in stone diameter is approximately 4.6% of total finger width. It is not visible at arm's length.

I held both stones over a printed ring size guide at the jeweler. I could not tell which was larger without the labels.

What I did: bought the 0.91ct and put the $820 into a better platinum setting.

The ring looks exactly like a 1ct ring. It has a platinum setting instead of white gold. My fiancée loves it and has never once asked if it is a "full carat."

The certification says 0.91ct. Nobody reads the certificate. They look at the ring.`,
    type: "text", score: 318, upvotes: 336, downvotes: 18, comment_count: 3,
    is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(9,4), updated_at: ago(9,4),
  },
  {
    id: p[1], community_id: commId, author_id: u["Sophie_Laurent"],
    title: "I switched from platinum to 18K yellow gold and went from G to H color. Saved $1,200. Honest comparison after 5 months of wearing both.",
    body: `I originally bought a GIA 1ct G-VS1 in platinum. Clean, classic, beautiful. I wore it for three months.

Then I did something unusual: I bought a second ring for myself and chose 18K yellow gold. And because I had read about the warm metal color masking effect, I went with H color instead of G.

The exact numbers:
• Ring 1: 1ct G-VS1 in platinum solitaire. Total paid: $7,100.
• Ring 2: 1ct H-VS1 in 18K yellow gold solitaire. Total paid: $5,890.
Difference: $1,210.

I have worn both rings alternating days for 5 months. Honest assessment:

COLOR AT THE CORNERS:
The H-VS1 in yellow gold reads identically to G in platinum at the corners. The warm metal reflects onto the corner zones and neutralises the tint completely. In three different lighting conditions — office fluorescent, outdoor sunlight, candlelight — I cannot find a condition where the yellow gold ring looks warmer at the corners than the platinum ring.

OVERALL WARMTH:
The yellow gold ring has a warmth that the platinum ring does not — but it comes from the metal, not the stone. The stone face-up in isolation looks marginally cooler on the H than on the G. In the setting, you cannot see this because the gold reflects warm light everywhere.

WEAR AFTER 5 MONTHS:
Platinum: no visible wear, V-prongs maintaining grip perfectly.
Yellow gold (18K): minor surface scratches on the band, normal for gold. Prong tips look unchanged.

My verdict: if you are considering yellow gold, go H. The stone difference is invisible in the setting. The $1,210 is real money.`,
    type: "text", score: 274, upvotes: 291, downvotes: 17, comment_count: 3,
    is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(8,6), updated_at: ago(8,6),
  },
  {
    id: p[2], community_id: commId, author_id: u["Marcus_Webb"],
    title: "I submitted the same diamond to GIA and IGI for grading. The results were not the same. Here is exactly what happened.",
    body: `This is not a rumour. I did this myself.

Background: I had access to an unmounted 1ct round brilliant previously graded by IGI as: G color, VS1 clarity, Excellent cut.

I submitted it to GIA under my name.

GIA result: H color, VS2 clarity, Excellent cut.

Same stone. Same physical diamond. One grade lower in color, one grade lower in clarity, under GIA grading.

What this means financially:
• IGI G-VS1 Excellent market price: approximately $5,200
• GIA H-VS2 Excellent market price: approximately $3,890
The IGI certificate added approximately $1,310 in perceived value to a stone that GIA would certify at a lower grade.

This is not an allegation of fraud. Gemological grading involves human judgment and IGI's standards are simply looser than GIA's. IGI grades at scale and at speed; GIA's process is more conservative. The industry knows this. Most retail buyers do not.

The practical rule:

For natural diamonds: GIA or AGS certificates are the standard. IGI natural certificates trade at a meaningful discount and for good reason — the grade may be overstated by 1–2 levels.

For lab-grown diamonds: IGI is widely accepted and the grading gap matters less because lab diamond prices are already commodity-level.

If you are comparing a GIA G-VS1 to an IGI G-VS1 at the same price: you are not comparing the same thing.`,
    type: "text", score: 387, upvotes: 408, downvotes: 21, comment_count: 3,
    is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(7,8), updated_at: ago(7,8),
  },
  {
    id: p[3], community_id: commId, author_id: u["Jessica_Miller_PDX"],
    title: "My oval diamond has a bowtie. Nobody told me this was normal. Six months of anxiety later, here is what I know.",
    body: `I noticed it two weeks after my proposal. A dark shadow across the center of my oval diamond. Horizontally oriented, like a bowtie.

I panicked. I thought the diamond was damaged or defective. I took it to three jewelers.

Every single one said the same thing: "That is normal for oval cut. All ovals have some degree of bowtie."

I had done six months of diamond research. Nobody in any guide I read mentioned the bowtie effect until after I had already noticed it.

Here is what the bowtie actually is:

An oval diamond's elongated shape creates zones where the pavilion facets cannot efficiently redirect light back through the crown. In the central perpendicular band of the stone, light leaks through rather than reflecting back. This creates a dark shadow.

The degree of bowtie varies:
• Severe bowtie: a very dark, prominent band visible from across a room
• Moderate bowtie: visible in most lighting, clearly present but not dominant
• Faint bowtie: visible only in certain lighting conditions
• Minimal bowtie: barely perceptible, most buyers find it acceptable

My stone has a moderate bowtie. Under direct sunlight it practically disappears. Under diffuse indoor light it is present but not jarring. Under specific indoor lighting angles it is the first thing I see.

What I wish I had known before buying:
1. Ask to see the 360° video specifically looking for the bowtie
2. Request that the jeweler evaluate bowtie severity — "minimal," "moderate," or "severe"
3. Elongated cushions and pear shapes also have bowtie effects; only round and princess cut are immune

My ring is still beautiful. But I would have made a more informed choice.`,
    type: "text", score: 231, upvotes: 246, downvotes: 15, comment_count: 3,
    is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(6,12), updated_at: ago(6,12),
  },
  {
    id: p[4], community_id: commId, author_id: u["Ryan_Mitchell_LA"],
    title: "I paid $5,640 for my ring. The insurance appraisal came back at $9,800. I spent a week trying to understand why. Here is what I learned.",
    body: `I bought a GIA 1ct G-VS1 round Excellent in a platinum solitaire from an online retailer. Total: $5,640.

Six weeks later I took the ring to a GIA-certified appraiser for insurance purposes.

Appraisal value: $9,800.

I thought there had been a mistake. I asked the appraiser to walk me through the number.

Her explanation:

"Insurance replacement appraisals are based on retail replacement cost at a local jeweler — not the discounted online price you paid. If this ring were stolen or lost, and you had to replace it through a brick-and-mortar jeweler, $9,800 is approximately what you would pay."

The retail markup on diamonds at physical stores is 100–200% above online prices. A $5,640 online purchase legitimately appraises at $9,800 retail.

What this means practically:

1. DO insure your ring based on the appraisal value, not the purchase price. If it is stolen and your policy covers purchase price only, you will not be able to replace it for that amount.

2. Get an independent appraisal. Do not use the seller's in-house appraisal — independent GIA-certified appraisers are the standard.

3. Update the appraisal every 3–5 years. Diamond prices change.

4. Jeweler's block insurance or a rider on your homeowner's policy is usually the right vehicle. Standalone jewelry insurance from companies like Jewelers Mutual starts at approximately $1.50–2.00 per $100 of coverage.

My annual insurance premium on a $9,800 appraisal: $147. Worth every dollar.`,
    type: "text", score: 263, upvotes: 279, downvotes: 16, comment_count: 3,
    is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(5,16), updated_at: ago(5,16),
  },
  {
    id: p[5], community_id: commId, author_id: u["Daniel_Foster"],
    title: "I ran a blind test. 12 people, two rings — one VS1 and one VS2. Nobody could tell which was which at arm's length. What this means for your budget.",
    body: `The setup: I borrowed two 1ct G round brilliant diamonds from a jeweler I know. Same carat weight, same color, same cut grade (Excellent), same setting style. One VS1, one VS2.

I did not tell any of the 12 participants which was which. I handed each person both rings, asked them to look naturally — arm's length, no loupe — and tell me which stone looked "cleaner" or "better."

12 participants: my fiancée, her four friends, my sister, my mother, three coworkers, my fiancée's mother, and a salesperson at a shoe store who agreed to participate.

Results:
• 4 people chose VS1 as the "better looking" stone
• 5 people chose VS2 as the "better looking" stone
• 3 people said they could not tell the difference

Random chance would produce a 50/50 split. The result was essentially random.

The price difference between the two stones: $324.

Important caveat: the VS2 stone I used had its inclusions confirmed not at the corners — central cloud and a small feather near the girdle edge. A VS2 stone with inclusions at the corners of a princess cut or near the table would be a different test.

The takeaway is nuanced:
• VS2 for round brilliants, with inclusions confirmed not at the table or visible face-up: often indistinguishable from VS1 to the naked eye
• VS1 is still the right default if you are not willing to review individual stones carefully
• The $324 saving on a round brilliant is real money

For princess cut specifically: VS1 is the firm minimum because of corner clarity concentration. The blind test results do not transfer to shapes with corner optical traps.`,
    type: "text", score: 242, upvotes: 257, downvotes: 15, comment_count: 3,
    is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(4,20), updated_at: ago(4,20),
  },
  {
    id: p[6], community_id: commId, author_id: u["EmmaWatts_UK"],
    title: "My friend chipped her princess cut diamond 14 months after buying it. The repair cost, what caused it, and what setting she should have had.",
    body: `My friend bought a princess cut diamond ring 14 months ago. Beautiful stone, G-VS1, 1ct, in a 14K white gold setting with four standard claw prongs.

Last month she knocked it against a marble kitchen counter while doing the dishes.

The corner chipped. A small but visible chip on the lower-left corner of the diamond.

What the repair assessment said:

Option 1: Re-cut the corners to remove the chip. The stone would become slightly smaller — approximately 0.87ct — and rounder in appearance. Cost: £380 for re-cutting, then re-setting. The GIA certificate would need to be resubmitted. Total: approximately £520.

Option 2: Replace the damaged stone. A comparable 1ct G-VS1 in the current market: approximately £3,900. Plus setting labour: £180.

Option 3: Live with the chip and ensure the setting covers it. If the corner prong is repositioned to sit over the chipped corner, the damage is hidden. Cost: £90 for prong adjustment.

She went with Option 3 for now and is saving for a replacement stone.

What caused this: claw prongs on princess cut corners. A claw prong sits flat on the table facet surface. It provides lateral grip but almost no protection to the corner point itself — which is the thinnest, most vulnerable part of the stone.

What she should have had: V-prongs. A V-prong cups the corner with metal on both diagonal faces, providing physical protection to the corner tip. It is specifically designed for square and rectangular cuts.

Princess cut corner chips are the most common diamond damage repair in any repair shop.

If you have a princess cut with claw prongs: ask your jeweler about converting to V-prongs.`,
    type: "text", score: 296, upvotes: 314, downvotes: 18, comment_count: 3,
    is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(3,18), updated_at: ago(3,18),
  },
  {
    id: p[7], community_id: commId, author_id: u["Oliver_Hughes"],
    title: "I proposed with a salt and pepper diamond and have worn it for 8 months. Honest review including what conventional diamond buyers think of it.",
    body: `Salt and pepper diamonds are included diamonds — stones with visible black and white inclusions intentionally selected for their appearance rather than minimised. They cost a fraction of comparable-carat clear diamonds.

My stone: 1.8ct round salt and pepper, set in a 14K rose gold four-prong solitaire. Total cost: £820.

For comparison: a "clean" GIA 1.8ct G-VS1 round Excellent would have cost approximately £9,200. I bought 1.8 carats of diamond for less than 10% of that.

8 MONTHS HONEST REPORT:

WHAT I LOVE:
• The stone is genuinely beautiful. The grey-white-black pattern is unique — no two salt and pepper diamonds are identical.
• 1.8 carats is substantial face-up presence. The ring has visual weight that comparable-budget clear diamonds cannot match.
• People comment on it constantly. Nobody has ever seen one before. It always starts a conversation.
• Zero anxiety about scratches on the metal — the stone is already intentionally "imperfect" by design.

WHAT IS HARDER THAN EXPECTED:
• My mother-in-law asked three separate times if I could "get a real diamond next time." I have explained salt and pepper diamonds to her three times.
• At formal events, the stone looks different from every other engagement ring in the room. I find this positive. My partner occasionally finds it self-conscious-making depending on the company.
• The specialty vendor market is less standardised than the GIA-certified market. Research your vendor carefully.

Would I do it again: yes, without hesitation. But be honest with yourself about whether your partner is unconventional enough to love a stone that requires explanation.`,
    type: "text", score: 203, upvotes: 216, downvotes: 13, comment_count: 3,
    is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(2,22), updated_at: ago(2,22),
  },
  {
    id: p[8], community_id: commId, author_id: u["Sarah_Collins_NYC"],
    title: "My ring finger grew a full size in 18 months of marriage. The resizing cost, what it did to the setting, and the sizing rule I wish someone had told me.",
    body: `I wore a size 5.5 ring at my engagement. By our first anniversary, my ring was uncomfortably tight. By 18 months, I could not get it off without effort.

My current size: 6.5. A full size increase in 18 months.

I am not unusual. Fingers change size due to weight fluctuation, hormonal changes, weather, pregnancy, and simply the natural swelling that happens in your mid-to-late twenties. Most women's ring size changes at least half a size within the first few years of wearing a ring daily.

The resizing:

I took my platinum solitaire to my jeweler for resizing from 5.5 to 6.5.

Platinum resizing quote: £240. This included adding a section of platinum to the shank to increase the circumference. Platinum sizing is more labour-intensive than gold because the metal requires more heat and specialised tools.

White gold resizing: for comparison, my jeweler quoted £90 for the same size change in 14K white gold.

The complication nobody warned me about:

My ring has a knife-edge band. When you resize a knife-edge band by adding material, the new section has to be shaped to maintain the taper profile. My jeweler said this adds approximately 90 minutes of labour versus a flat band.

The sizing rules I now know:
• Always size slightly large rather than slightly small — a ring 0.25 size too large can be worn; too small cannot
• Have your finger sized in the afternoon — fingers are largest then
• Have your finger sized in warm weather — fingers contract in cold
• Consider sizing beads for rings that are slightly large — cheaper than full resizing

The resizing was worth every penny. Wear your ring every day in comfort.`,
    type: "text", score: 187, upvotes: 199, downvotes: 12, comment_count: 3,
    is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(1,20), updated_at: ago(1,20),
  },
  {
    id: p[9], community_id: commId, author_id: u["Jake_Anderson_DC"],
    title: "I priced the exact same diamond at Tiffany, Blue Nile, and a local independent. The difference was $6,640. Here is what Tiffany is actually selling.",
    body: `I want to be precise about this because the number sounds implausible until you see it broken down.

I went to a Tiffany & Co. store and was shown a 1ct G-VS1 round Excellent in their classic platinum 4-prong solitaire: $12,400. The stone was GIA certified.

I noted the GIA report number. I left the store and searched it online.

Blue Nile had the identical stone — same GIA number — listed at $5,210. The Tiffany solitaire setting is comparable to a Blue Nile solitaire at approximately $1,200.

Total Blue Nile equivalent: $6,410.
Tiffany price: $12,400.
Difference: $5,990.

I then found a local independent jeweler with a GIA-trained gemologist on staff. He sourced a comparable GIA 1ct G-VS1 round Excellent for me: $4,980 for the stone, custom platinum 4-prong solitaire at $780. Total: $5,760.

Difference from Tiffany: $6,640.

So what is the $6,640 buying at Tiffany?
• The Tiffany brand name
• The blue box
• The in-store experience
• The resale name recognition (a "Tiffany ring" commands a 20–30% premium on the secondhand market)
• The story you tell at the dinner table

Is it worth $6,640? That is not a question I can answer for you. It is a question about what you value.

What I can tell you is that the diamond inside a Tiffany solitaire is a GIA-certified round brilliant available through other channels at the GIA-certified price. The Tiffany premium is entirely about the brand, the box, and the retail experience — not about a different or better diamond.

I bought through the independent jeweler. The ring is indistinguishable from the Tiffany version to anyone who does not flip it over to read the hallmark.`,
    type: "text", score: 341, upvotes: 360, downvotes: 19, comment_count: 3,
    is_draft: false, is_deleted: false, is_pinned: false,
    created_at: ago(0,10), updated_at: ago(0,10),
  },
];

const { error: postsErr } = await supabase.from("posts").insert(posts);
if (postsErr) throw new Error(`Posts insert failed: ${postsErr.message}`);
console.log("✅ 10 posts inserted");

// ── Insert Comments ─────────────────────────────────────────

const comments = [
  // Post 1
  { id: c[0], post_id: p[0], author_id: u["Marcus_Webb"], score: 54, upvotes: 57, downvotes: 3, is_deleted: false, created_at: ago(9,0),
    body: "The threshold pricing effect is one of the most consistently exploitable patterns in the diamond market. The 0.90–0.99ct range is the classic entry point. Below-threshold stones at 0.45–0.49ct and 0.70–0.74ct follow the same logic. The price per carat increases at the threshold; everything just below captures the visual size without paying the milestone premium. Your $820 saving is entirely real and entirely repeatable." },
  { id: c[1], post_id: p[0], author_id: u["Jessica_Miller_PDX"], score: 41, upvotes: 43, downvotes: 2, is_deleted: false, created_at: ago(8,22),
    body: "I did this for my second ring purchase after learning from my first. I bought a 0.93ct and put the savings into an upgraded setting. Nobody has ever asked me if it was 'a full carat.' The question literally never comes up. The certificate number is what matters on paper; the face-up appearance is what matters in real life." },
  { id: c[2], post_id: p[0], author_id: u["EmmaWatts_UK"], score: 33, upvotes: 35, downvotes: 2, is_deleted: false, created_at: ago(8,18),
    body: "The 0.3mm diameter difference at 0.91ct vs 1.00ct is worth visualising concretely. Hold a ruler and look at the difference between 6.2mm and 6.5mm. That is the face-up difference. On most finger widths, this falls below the threshold of reliable naked-eye detection at conversational distance. The GIA certificate is the only place the weight difference is visible." },
  // Post 2
  { id: c[3], post_id: p[1], author_id: u["Marcus_Webb"], score: 48, upvotes: 51, downvotes: 3, is_deleted: false, created_at: ago(8,4),
    body: "The warm metal masking effect is documented and consistent. 18K yellow gold reflects approximately 650–700nm wavelength light — the warm spectrum. This reflection counteracts the blue-spectrum absorption that causes yellow tint in H–J diamonds. The stone corner zones, which concentrate body color in cuts like princess and oval, benefit most from this masking." },
  { id: c[4], post_id: p[1], author_id: u["Oliver_Hughes"], score: 37, upvotes: 39, downvotes: 2, is_deleted: false, created_at: ago(8,0),
    body: "The 5-month wear comparison across both metals is genuinely useful data. I have been considering yellow gold precisely for the H-color saving but was worried about the 'looks warm' concern. Your conclusion — that the stone reads identically to G in platinum — matches what I have heard from gemologists but rarely from actual wearers. This is the kind of post that should be pinned." },
  { id: c[5], post_id: p[1], author_id: u["Sarah_Collins_NYC"], score: 29, upvotes: 30, downvotes: 1, is_deleted: false, created_at: ago(7,20),
    body: "Rose gold produces a similar masking effect to yellow gold on H-color corner zones. The pink-warm reflection from rose gold's copper alloy neutralises the corner tint in the same way. G in platinum, H in yellow or rose gold: both look near-colorless in the setting. The $1,210 saving is real and I would make the same choice." },
  // Post 3
  { id: c[6], post_id: p[2], author_id: u["Jessica_Miller_PDX"], score: 67, upvotes: 71, downvotes: 4, is_deleted: false, created_at: ago(7,4),
    body: "I have heard this from multiple industry contacts but this is the clearest documented example I have seen on a consumer forum. The 1-color, 1-clarity grade differential is the most commonly cited gap between GIA and IGI for natural stones. The financial impact at the 1ct G-VS1 level is substantial — you have quantified exactly why GIA certification commands a premium in the natural diamond market." },
  { id: c[7], post_id: p[2], author_id: u["Daniel_Foster"], score: 52, upvotes: 55, downvotes: 3, is_deleted: false, created_at: ago(7,0),
    body: "The lab-grown caveat is important and often missed. For lab diamonds, IGI is the dominant certification lab and the grading is more consistent. The 'IGI grades looser' problem is documented specifically for natural stones where human colour and clarity judgment varies. Buying an IGI lab-grown diamond is not the same risk as buying an IGI natural diamond." },
  { id: c[8], post_id: p[2], author_id: u["Jake_Anderson_DC"], score: 44, upvotes: 46, downvotes: 2, is_deleted: false, created_at: ago(6,20),
    body: "The GIA report number search technique is the specific test that reveals retailer premium versus stone premium. Any stone with a GIA report number can be searched and cross-listed. If a retailer's price is substantially above the market price for the same GIA number, you are paying a brand premium. That premium may or may not be worth it — but you should know that is what you are paying for." },
  // Post 4
  { id: c[9], post_id: p[3], author_id: u["Marcus_Webb"], score: 49, upvotes: 52, downvotes: 3, is_deleted: false, created_at: ago(6,10),
    body: "The bowtie severity spectrum is real and matters enormously for oval purchases. I have seen ovals where the bowtie was essentially invisible under normal conditions — excellent cutting can minimise but not eliminate it. The 360° video test: rotate the stone slowly and watch the central band under the video's light source. A severe bowtie will show clearly." },
  { id: c[10], post_id: p[3], author_id: u["Sarah_Collins_NYC"], score: 36, upvotes: 38, downvotes: 2, is_deleted: false, created_at: ago(6,6),
    body: "This happened to a friend who bought a pear shape. Same discovery, same anxiety, same 'the jeweler says it's normal.' The elongated fancy shapes — oval, pear, marquise, elongated cushion — all have some degree of bowtie. The only way to evaluate severity before buying is video, ideally under multiple light sources. Static photos almost never show the bowtie clearly." },
  { id: c[11], post_id: p[3], author_id: u["Sophie_Laurent"], score: 28, upvotes: 29, downvotes: 1, is_deleted: false, created_at: ago(6,2),
    body: "This is the post I wish had existed when I was ring shopping. I almost bought an oval and the bowtie was never mentioned in any guide I read. I ended up choosing a round brilliant specifically because I could not find reliable guidance on evaluating bowtie severity before buying sight-unseen online." },
  // Post 5
  { id: c[12], post_id: p[4], author_id: u["Marcus_Webb"], score: 53, upvotes: 56, downvotes: 3, is_deleted: false, created_at: ago(5,14),
    body: "The appraisal-versus-purchase-price gap is one of the most consistent surprises for online diamond buyers. Retail replacement cost is always higher than online transaction price because brick-and-mortar overhead, staff, display inventory, and margin all factor into the price a local jeweler would charge. Insuring at purchase price exposes you to a coverage gap of exactly the magnitude you experienced." },
  { id: c[13], post_id: p[4], author_id: u["Jessica_Miller_PDX"], score: 41, upvotes: 43, downvotes: 2, is_deleted: false, created_at: ago(5,10),
    body: "Jewelers Mutual is the specialist insurer I use. Their process requires an independent appraisal and they cover loss, theft, damage including chipping and stone loss. Annual premium at my coverage amount is $1.80 per $100. For a $9,000 appraisal that is $162 per year. The ring is irreplaceable sentimentally; $162 is the cost of sleeping soundly." },
  { id: c[14], post_id: p[4], author_id: u["Oliver_Hughes"], score: 34, upvotes: 36, downvotes: 2, is_deleted: false, created_at: ago(5,6),
    body: "Update the appraisal point cannot be overstated. Diamond prices have been volatile — natural prices held relatively steady while lab prices declined 40–50%. If you have an older appraisal on a natural diamond from when prices were lower, your coverage may be insufficient. If you have an older appraisal on a lab diamond from 2022–2023, you may be over-insured." },
  // Post 6
  { id: c[15], post_id: p[5], author_id: u["Marcus_Webb"], score: 58, upvotes: 62, downvotes: 4, is_deleted: false, created_at: ago(4,18),
    body: "This is a well-designed test and the results are consistent with what gemologists have known for decades. VS1 and VS2 are grading categories defined by 10x magnification criteria — they were never intended to predict naked-eye visual difference. The VS1-VS2 distinction matters for the certificate, for resale, and for corner-position risk in certain cuts. For face-up appearance to the naked eye: the difference is not reliably detectable." },
  { id: c[16], post_id: p[5], author_id: u["Sophie_Laurent"], score: 45, upvotes: 47, downvotes: 2, is_deleted: false, created_at: ago(4,14),
    body: "The princess cut caveat at the end is the most important part of this post. I bought a VS2 princess cut based on similar logic and had visible corner inclusions under certain lighting. The corner clarity trap in princess cuts means the standard VS1 recommendation for that shape exists for a real reason that your round brilliant blind test does not address." },
  { id: c[17], post_id: p[5], author_id: u["Ryan_Mitchell_LA"], score: 27, upvotes: 28, downvotes: 1, is_deleted: false, created_at: ago(4,10),
    body: "New buyer here. This test gives me permission I needed. I was agonising between VS1 and VS2 on a round brilliant and leaning toward VS1 purely because I was scared to compromise. The cert review process you mentioned — confirming inclusions not at the table or visible face-up — is the due diligence that makes VS2 a reasonable choice, not a blind downgrade." },
  // Post 7
  { id: c[18], post_id: p[6], author_id: u["Marcus_Webb"], score: 61, upvotes: 65, downvotes: 4, is_deleted: false, created_at: ago(3,16),
    body: "Corner chips on princess cuts are the most predictable category of diamond damage in repair work. A princess cut corner is geometrically the thinnest point of the stone — two facet planes meeting at a sharp angle with minimal material. The impact resistance at that point is far lower than at the girdle of a round brilliant. V-prongs are not a premium feature; they are structural protection for a known vulnerability." },
  { id: c[19], post_id: p[6], author_id: u["Jessica_Miller_PDX"], score: 47, upvotes: 50, downvotes: 3, is_deleted: false, created_at: ago(3,12),
    body: "I checked my own princess cut setting after reading this. Standard claw prongs. I am booking a prong conversion consultation this week. My ring is two years old and I have never had a prong inspection. The combination of claw prongs and no maintenance on a princess cut is exactly the scenario described here. Thank you for posting this." },
  { id: c[20], post_id: p[6], author_id: u["Daniel_Foster"], score: 38, upvotes: 40, downvotes: 2, is_deleted: false, created_at: ago(3,8),
    body: "Option 3 — prong repositioning to cover the chip — is actually a sensible interim solution. Many corner chips are small enough that a repositioned V-prong covers the damaged area completely and the stone wears normally. The chip does not grow or propagate in normal wear unless there is a deep feather extension. If the chip is purely surface, the repositioned prong effectively eliminates the problem." },
  // Post 8
  { id: c[21], post_id: p[7], author_id: u["Sophie_Laurent"], score: 43, upvotes: 46, downvotes: 3, is_deleted: false, created_at: ago(2,20),
    body: "The £820 versus £9,200 comparison is the most compelling argument for salt and pepper in a single number. I have a friend who went this route and the ring is genuinely striking. The aesthetic is completely different from a clear diamond — more geological, more unique — and the savings allow for a larger stone and better metalwork than would be possible at any reasonable budget in the clear diamond market." },
  { id: c[22], post_id: p[7], author_id: u["Jake_Anderson_DC"], score: 35, upvotes: 37, downvotes: 2, is_deleted: false, created_at: ago(2,16),
    body: "The vendor research point is the right caution. GIA does not certify salt and pepper diamonds with standardised grading. You are relying entirely on the vendor's description and reputation. There are excellent specialist vendors with strong track records and there are vendors who sell overpriced included stones. Research the vendor, not just the stone." },
  { id: c[23], post_id: p[7], author_id: u["Sarah_Collins_NYC"], score: 29, upvotes: 30, downvotes: 1, is_deleted: false, created_at: ago(2,12),
    body: "The mother-in-law reaction is the most honest part of this review. Salt and pepper is a genuine lifestyle and social choice, not just a budget choice. If the people in your life have conventional taste and will make comments that affect your partner's relationship with their ring, that is a real factor. Know your audience." },
  // Post 9
  { id: c[24], post_id: p[8], author_id: u["Marcus_Webb"], score: 46, upvotes: 49, downvotes: 3, is_deleted: false, created_at: ago(1,18),
    body: "The knife-edge band resizing complication is genuinely underappreciated. Knife-edge shanks are more difficult to resize in both directions — adding material requires matching the taper profile precisely, removing material risks collapsing the ridge. The resizing premium for complex band profiles is real. A flat or domed shank resizes for significantly less labour cost." },
  { id: c[25], post_id: p[8], author_id: u["EmmaWatts_UK"], score: 38, upvotes: 40, downvotes: 2, is_deleted: false, created_at: ago(1,14),
    body: "The afternoon sizing recommendation is important enough that I include it every time someone asks about ring sizing. Fingers are measurably larger in the afternoon than in the morning due to fluid accumulation from daily activity. Fingers are also larger in warm temperatures. If you are sized in the morning in winter, you may be sized up to a half size smaller than your afternoon summer size." },
  { id: c[26], post_id: p[8], author_id: u["Oliver_Hughes"], score: 31, upvotes: 33, downvotes: 2, is_deleted: false, created_at: ago(1,10),
    body: "Sizing beads are under-used and deserve more attention. For a ring that is only slightly too large — a quarter to half size — two small platinum or gold balls soldered to the interior of the shank add friction and keep the ring positioned correctly without permanent resizing. Cost is usually £30–60, it is reversible, and it does not affect the structural integrity of the setting." },
  // Post 10
  { id: c[27], post_id: p[9], author_id: u["Marcus_Webb"], score: 55, upvotes: 58, downvotes: 3, is_deleted: false, created_at: ago(0,8),
    body: "The 20–30% resale premium for Tiffany-branded rings is real and documented in the secondhand market — you can verify this on 1stDibs and The RealReal right now. The question is whether that resale premium justifies a 100%+ purchase premium. For most buyers the math does not work. For buyers who care deeply about the brand story and social signal: the premium is at least partially rational." },
  { id: c[28], post_id: p[9], author_id: u["Jessica_Miller_PDX"], score: 42, upvotes: 44, downvotes: 2, is_deleted: false, created_at: ago(0,6),
    body: "The local independent jeweler route is systematically underutilised by online-generation buyers. A GIA-trained independent jeweler can source a comparable stone to any online retailer, often at a slight discount, and the setting will be custom rather than catalogue. You also get a human relationship — someone who will inspect and maintain your ring for years." },
  { id: c[29], post_id: p[9], author_id: u["Sophie_Laurent"], score: 36, upvotes: 38, downvotes: 2, is_deleted: false, created_at: ago(0,4),
    body: "I have the Tiffany box. I will be honest: the box mattered to me at the time of purchase and it matters exactly zero in daily life. What I wear every day is the ring. What I look at every day is the stone. The box is in a drawer. I have shown it to people exactly twice in two years. Spend the premium on a better stone inside whatever box you choose." },
];

const { error: commErr } = await supabase.from("comments").insert(comments);
if (commErr) throw new Error(`Comments insert failed: ${commErr.message}`);
console.log("✅ 30 comments inserted");

// ── Insert Post Votes ───────────────────────────────────────

const postVotes = [
  { post_id: p[0], user_id: u["Jessica_Miller_PDX"], vote: 1, created_at: ago(9,2) },
  { post_id: p[0], user_id: u["Sophie_Laurent"],      vote: 1, created_at: ago(9,1) },
  { post_id: p[0], user_id: u["EmmaWatts_UK"],        vote: 1, created_at: ago(9,0) },
  { post_id: p[0], user_id: u["Marcus_Webb"],          vote: 1, created_at: ago(8,22) },
  { post_id: p[0], user_id: u["Sarah_Collins_NYC"],    vote: 1, created_at: ago(8,20) },
  { post_id: p[0], user_id: u["Oliver_Hughes"],        vote: 1, created_at: ago(8,18) },
  { post_id: p[0], user_id: u["Daniel_Foster"],        vote: 1, created_at: ago(8,16) },

  { post_id: p[1], user_id: u["Jessica_Miller_PDX"], vote: 1, created_at: ago(8,4) },
  { post_id: p[1], user_id: u["EmmaWatts_UK"],        vote: 1, created_at: ago(8,2) },
  { post_id: p[1], user_id: u["Marcus_Webb"],          vote: 1, created_at: ago(8,0) },
  { post_id: p[1], user_id: u["Jake_Anderson_DC"],     vote: 1, created_at: ago(7,22) },
  { post_id: p[1], user_id: u["Oliver_Hughes"],        vote: 1, created_at: ago(7,20) },
  { post_id: p[1], user_id: u["Ryan_Mitchell_LA"],     vote: 1, created_at: ago(7,18) },
  { post_id: p[1], user_id: u["Daniel_Foster"],        vote: 1, created_at: ago(7,16) },

  { post_id: p[2], user_id: u["Jessica_Miller_PDX"], vote: 1, created_at: ago(7,6) },
  { post_id: p[2], user_id: u["Sophie_Laurent"],      vote: 1, created_at: ago(7,4) },
  { post_id: p[2], user_id: u["EmmaWatts_UK"],        vote: 1, created_at: ago(7,2) },
  { post_id: p[2], user_id: u["Jake_Anderson_DC"],     vote: 1, created_at: ago(7,0) },
  { post_id: p[2], user_id: u["Sarah_Collins_NYC"],    vote: 1, created_at: ago(6,22) },
  { post_id: p[2], user_id: u["Oliver_Hughes"],        vote: 1, created_at: ago(6,20) },
  { post_id: p[2], user_id: u["Ryan_Mitchell_LA"],     vote: 1, created_at: ago(6,18) },

  { post_id: p[3], user_id: u["Sophie_Laurent"],      vote: 1, created_at: ago(6,10) },
  { post_id: p[3], user_id: u["EmmaWatts_UK"],        vote: 1, created_at: ago(6,8) },
  { post_id: p[3], user_id: u["Marcus_Webb"],          vote: 1, created_at: ago(6,6) },
  { post_id: p[3], user_id: u["Jake_Anderson_DC"],     vote: 1, created_at: ago(6,4) },
  { post_id: p[3], user_id: u["Oliver_Hughes"],        vote: 1, created_at: ago(6,2) },
  { post_id: p[3], user_id: u["Ryan_Mitchell_LA"],     vote: 1, created_at: ago(6,0) },
  { post_id: p[3], user_id: u["Daniel_Foster"],        vote: 1, created_at: ago(5,22) },

  { post_id: p[4], user_id: u["Jessica_Miller_PDX"], vote: 1, created_at: ago(5,14) },
  { post_id: p[4], user_id: u["Sophie_Laurent"],      vote: 1, created_at: ago(5,12) },
  { post_id: p[4], user_id: u["EmmaWatts_UK"],        vote: 1, created_at: ago(5,10) },
  { post_id: p[4], user_id: u["Marcus_Webb"],          vote: 1, created_at: ago(5,8) },
  { post_id: p[4], user_id: u["Sarah_Collins_NYC"],    vote: 1, created_at: ago(5,6) },
  { post_id: p[4], user_id: u["Oliver_Hughes"],        vote: 1, created_at: ago(5,4) },
  { post_id: p[4], user_id: u["Daniel_Foster"],        vote: 1, created_at: ago(5,2) },

  { post_id: p[5], user_id: u["Jessica_Miller_PDX"], vote: 1, created_at: ago(4,18) },
  { post_id: p[5], user_id: u["EmmaWatts_UK"],        vote: 1, created_at: ago(4,16) },
  { post_id: p[5], user_id: u["Marcus_Webb"],          vote: 1, created_at: ago(4,14) },
  { post_id: p[5], user_id: u["Jake_Anderson_DC"],     vote: 1, created_at: ago(4,12) },
  { post_id: p[5], user_id: u["Oliver_Hughes"],        vote: 1, created_at: ago(4,10) },
  { post_id: p[5], user_id: u["Ryan_Mitchell_LA"],     vote: 1, created_at: ago(4,8) },
  { post_id: p[5], user_id: u["Daniel_Foster"],        vote: 1, created_at: ago(4,6) },

  { post_id: p[6], user_id: u["Jessica_Miller_PDX"], vote: 1, created_at: ago(3,16) },
  { post_id: p[6], user_id: u["Sophie_Laurent"],      vote: 1, created_at: ago(3,14) },
  { post_id: p[6], user_id: u["Marcus_Webb"],          vote: 1, created_at: ago(3,12) },
  { post_id: p[6], user_id: u["Jake_Anderson_DC"],     vote: 1, created_at: ago(3,10) },
  { post_id: p[6], user_id: u["Sarah_Collins_NYC"],    vote: 1, created_at: ago(3,8) },
  { post_id: p[6], user_id: u["Ryan_Mitchell_LA"],     vote: 1, created_at: ago(3,6) },
  { post_id: p[6], user_id: u["Daniel_Foster"],        vote: 1, created_at: ago(3,4) },

  { post_id: p[7], user_id: u["Jessica_Miller_PDX"], vote: 1, created_at: ago(2,20) },
  { post_id: p[7], user_id: u["Sophie_Laurent"],      vote: 1, created_at: ago(2,18) },
  { post_id: p[7], user_id: u["Marcus_Webb"],          vote: 1, created_at: ago(2,16) },
  { post_id: p[7], user_id: u["Jake_Anderson_DC"],     vote: 1, created_at: ago(2,14) },
  { post_id: p[7], user_id: u["Sarah_Collins_NYC"],    vote: 1, created_at: ago(2,12) },
  { post_id: p[7], user_id: u["Ryan_Mitchell_LA"],     vote: 1, created_at: ago(2,10) },
  { post_id: p[7], user_id: u["Daniel_Foster"],        vote: 1, created_at: ago(2,8) },

  { post_id: p[8], user_id: u["Sophie_Laurent"],      vote: 1, created_at: ago(1,18) },
  { post_id: p[8], user_id: u["EmmaWatts_UK"],        vote: 1, created_at: ago(1,16) },
  { post_id: p[8], user_id: u["Marcus_Webb"],          vote: 1, created_at: ago(1,14) },
  { post_id: p[8], user_id: u["Jake_Anderson_DC"],     vote: 1, created_at: ago(1,12) },
  { post_id: p[8], user_id: u["Sarah_Collins_NYC"],    vote: 1, created_at: ago(1,10) },
  { post_id: p[8], user_id: u["Oliver_Hughes"],        vote: 1, created_at: ago(1,8) },
  { post_id: p[8], user_id: u["Ryan_Mitchell_LA"],     vote: 1, created_at: ago(1,6) },

  { post_id: p[9], user_id: u["Jessica_Miller_PDX"], vote: 1, created_at: ago(0,8) },
  { post_id: p[9], user_id: u["Sophie_Laurent"],      vote: 1, created_at: ago(0,7) },
  { post_id: p[9], user_id: u["EmmaWatts_UK"],        vote: 1, created_at: ago(0,6) },
  { post_id: p[9], user_id: u["Marcus_Webb"],          vote: 1, created_at: ago(0,5) },
  { post_id: p[9], user_id: u["Sarah_Collins_NYC"],    vote: 1, created_at: ago(0,4) },
  { post_id: p[9], user_id: u["Oliver_Hughes"],        vote: 1, created_at: ago(0,3) },
  { post_id: p[9], user_id: u["Daniel_Foster"],        vote: 1, created_at: ago(0,2) },
];

const { error: pvErr } = await supabase.from("post_votes").insert(postVotes);
if (pvErr) throw new Error(`Post votes insert failed: ${pvErr.message}`);
console.log("✅ Post votes inserted");

// ── Insert Comment Votes ────────────────────────────────────

const commentVotes = [
  { comment_id: c[0],  user_id: u["Jessica_Miller_PDX"], vote: 1 },
  { comment_id: c[0],  user_id: u["EmmaWatts_UK"],        vote: 1 },
  { comment_id: c[0],  user_id: u["Sarah_Collins_NYC"],    vote: 1 },
  { comment_id: c[0],  user_id: u["Ryan_Mitchell_LA"],     vote: 1 },
  { comment_id: c[1],  user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[1],  user_id: u["Jake_Anderson_DC"],     vote: 1 },
  { comment_id: c[1],  user_id: u["Daniel_Foster"],        vote: 1 },
  { comment_id: c[2],  user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[2],  user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[2],  user_id: u["Oliver_Hughes"],        vote: 1 },

  { comment_id: c[3],  user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[3],  user_id: u["EmmaWatts_UK"],        vote: 1 },
  { comment_id: c[3],  user_id: u["Jake_Anderson_DC"],     vote: 1 },
  { comment_id: c[3],  user_id: u["Ryan_Mitchell_LA"],     vote: 1 },
  { comment_id: c[4],  user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[4],  user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[4],  user_id: u["Daniel_Foster"],        vote: 1 },
  { comment_id: c[5],  user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[5],  user_id: u["Jake_Anderson_DC"],     vote: 1 },
  { comment_id: c[5],  user_id: u["Ryan_Mitchell_LA"],     vote: 1 },

  { comment_id: c[6],  user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[6],  user_id: u["Jake_Anderson_DC"],     vote: 1 },
  { comment_id: c[6],  user_id: u["Oliver_Hughes"],        vote: 1 },
  { comment_id: c[6],  user_id: u["Ryan_Mitchell_LA"],     vote: 1 },
  { comment_id: c[7],  user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[7],  user_id: u["EmmaWatts_UK"],        vote: 1 },
  { comment_id: c[7],  user_id: u["Sarah_Collins_NYC"],    vote: 1 },
  { comment_id: c[8],  user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[8],  user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[8],  user_id: u["Daniel_Foster"],        vote: 1 },

  { comment_id: c[9],  user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[9],  user_id: u["EmmaWatts_UK"],        vote: 1 },
  { comment_id: c[9],  user_id: u["Sarah_Collins_NYC"],    vote: 1 },
  { comment_id: c[9],  user_id: u["Daniel_Foster"],        vote: 1 },
  { comment_id: c[10], user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[10], user_id: u["Jake_Anderson_DC"],     vote: 1 },
  { comment_id: c[10], user_id: u["Oliver_Hughes"],        vote: 1 },
  { comment_id: c[11], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[11], user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[11], user_id: u["Ryan_Mitchell_LA"],     vote: 1 },

  { comment_id: c[12], user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[12], user_id: u["EmmaWatts_UK"],        vote: 1 },
  { comment_id: c[12], user_id: u["Oliver_Hughes"],        vote: 1 },
  { comment_id: c[12], user_id: u["Daniel_Foster"],        vote: 1 },
  { comment_id: c[13], user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[13], user_id: u["Sarah_Collins_NYC"],    vote: 1 },
  { comment_id: c[13], user_id: u["Ryan_Mitchell_LA"],     vote: 1 },
  { comment_id: c[14], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[14], user_id: u["EmmaWatts_UK"],        vote: 1 },
  { comment_id: c[14], user_id: u["Jake_Anderson_DC"],     vote: 1 },

  { comment_id: c[15], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[15], user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[15], user_id: u["Oliver_Hughes"],        vote: 1 },
  { comment_id: c[15], user_id: u["Daniel_Foster"],        vote: 1 },
  { comment_id: c[16], user_id: u["EmmaWatts_UK"],        vote: 1 },
  { comment_id: c[16], user_id: u["Jake_Anderson_DC"],     vote: 1 },
  { comment_id: c[16], user_id: u["Ryan_Mitchell_LA"],     vote: 1 },
  { comment_id: c[17], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[17], user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[17], user_id: u["Sarah_Collins_NYC"],    vote: 1 },

  { comment_id: c[18], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[18], user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[18], user_id: u["Sarah_Collins_NYC"],    vote: 1 },
  { comment_id: c[18], user_id: u["Daniel_Foster"],        vote: 1 },
  { comment_id: c[19], user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[19], user_id: u["Jake_Anderson_DC"],     vote: 1 },
  { comment_id: c[19], user_id: u["Oliver_Hughes"],        vote: 1 },
  { comment_id: c[20], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[20], user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[20], user_id: u["Ryan_Mitchell_LA"],     vote: 1 },

  { comment_id: c[21], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[21], user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[21], user_id: u["Oliver_Hughes"],        vote: 1 },
  { comment_id: c[21], user_id: u["Daniel_Foster"],        vote: 1 },
  { comment_id: c[22], user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[22], user_id: u["EmmaWatts_UK"],        vote: 1 },
  { comment_id: c[22], user_id: u["Ryan_Mitchell_LA"],     vote: 1 },
  { comment_id: c[23], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[23], user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[23], user_id: u["Oliver_Hughes"],        vote: 1 },

  { comment_id: c[24], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[24], user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[24], user_id: u["Sarah_Collins_NYC"],    vote: 1 },
  { comment_id: c[24], user_id: u["Ryan_Mitchell_LA"],     vote: 1 },
  { comment_id: c[25], user_id: u["EmmaWatts_UK"],        vote: 1 },
  { comment_id: c[25], user_id: u["Jake_Anderson_DC"],     vote: 1 },
  { comment_id: c[25], user_id: u["Daniel_Foster"],        vote: 1 },
  { comment_id: c[26], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[26], user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[26], user_id: u["Sarah_Collins_NYC"],    vote: 1 },

  { comment_id: c[27], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[27], user_id: u["Sophie_Laurent"],       vote: 1 },
  { comment_id: c[27], user_id: u["Sarah_Collins_NYC"],    vote: 1 },
  { comment_id: c[27], user_id: u["Ryan_Mitchell_LA"],     vote: 1 },
  { comment_id: c[28], user_id: u["EmmaWatts_UK"],        vote: 1 },
  { comment_id: c[28], user_id: u["Jake_Anderson_DC"],     vote: 1 },
  { comment_id: c[28], user_id: u["Daniel_Foster"],        vote: 1 },
  { comment_id: c[29], user_id: u["Jessica_Miller_PDX"],  vote: 1 },
  { comment_id: c[29], user_id: u["Marcus_Webb"],          vote: 1 },
  { comment_id: c[29], user_id: u["Oliver_Hughes"],        vote: 1 },
];

const { error: cvErr } = await supabase.from("comment_votes").insert(commentVotes);
if (cvErr) throw new Error(`Comment votes insert failed: ${cvErr.message}`);
console.log("✅ Comment votes inserted");

// ── Final count ─────────────────────────────────────────────
const { count } = await supabase.from("posts")
  .select("*", { count: "exact", head: true })
  .eq("community_id", commId).eq("is_deleted", false);
console.log(`\n🎉 Done. Total community posts now: ${count}`);
