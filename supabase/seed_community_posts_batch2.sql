-- ============================================================
-- DiamondCritics Community — 10 New Posts (Batch 2, Append)
-- Paste into: Supabase Dashboard → SQL Editor → New Query
-- DOES NOT delete existing posts — appends 10 new posts only.
-- Run AFTER seed_community_posts.sql (users must exist first).
-- ============================================================

DO $$
DECLARE
  u1 UUID;  -- Jessica_Miller_PDX
  u2 UUID;  -- Sophie_Laurent
  u3 UUID;  -- EmmaWatts_UK
  u4 UUID;  -- Marcus_Webb
  u5 UUID;  -- Jake_Anderson_DC
  u6 UUID;  -- Sarah_Collins_NYC
  u7 UUID;  -- Oliver_Hughes
  u8 UUID;  -- Ryan_Mitchell_LA
  u9 UUID;  -- Daniel_Foster

  comm UUID;

  p1  UUID := gen_random_uuid();
  p2  UUID := gen_random_uuid();
  p3  UUID := gen_random_uuid();
  p4  UUID := gen_random_uuid();
  p5  UUID := gen_random_uuid();
  p6  UUID := gen_random_uuid();
  p7  UUID := gen_random_uuid();
  p8  UUID := gen_random_uuid();
  p9  UUID := gen_random_uuid();
  p10 UUID := gen_random_uuid();

  c1a UUID := gen_random_uuid(); c1b UUID := gen_random_uuid(); c1c UUID := gen_random_uuid();
  c2a UUID := gen_random_uuid(); c2b UUID := gen_random_uuid(); c2c UUID := gen_random_uuid();
  c3a UUID := gen_random_uuid(); c3b UUID := gen_random_uuid(); c3c UUID := gen_random_uuid();
  c4a UUID := gen_random_uuid(); c4b UUID := gen_random_uuid(); c4c UUID := gen_random_uuid();
  c5a UUID := gen_random_uuid(); c5b UUID := gen_random_uuid(); c5c UUID := gen_random_uuid();
  c6a UUID := gen_random_uuid(); c6b UUID := gen_random_uuid(); c6c UUID := gen_random_uuid();
  c7a UUID := gen_random_uuid(); c7b UUID := gen_random_uuid(); c7c UUID := gen_random_uuid();
  c8a UUID := gen_random_uuid(); c8b UUID := gen_random_uuid(); c8c UUID := gen_random_uuid();
  c9a UUID := gen_random_uuid(); c9b UUID := gen_random_uuid(); c9c UUID := gen_random_uuid();
  c10a UUID := gen_random_uuid(); c10b UUID := gen_random_uuid(); c10c UUID := gen_random_uuid();

BEGIN

  SELECT id INTO comm FROM public.communities WHERE slug = 'diamonds' LIMIT 1;
  IF comm IS NULL THEN
    RAISE EXCEPTION 'Community slug=diamonds not found. Run full_setup.sql first.';
  END IF;

  -- Look up existing users
  SELECT id INTO u1 FROM auth.users WHERE email = 'auburndazzle@gmail.com';
  SELECT id INTO u2 FROM auth.users WHERE email = 'farzanatoma111@gmail.com';
  SELECT id INTO u3 FROM auth.users WHERE email = 'farzanatoma001@gmail.com';
  SELECT id INTO u4 FROM auth.users WHERE email = 'ironsidesgroup@gmail.com';
  SELECT id INTO u5 FROM auth.users WHERE email = 'mehedihasan.linkedin@gmail.com';
  SELECT id INTO u6 FROM auth.users WHERE email = 'mh6222134567@gmail.com';
  SELECT id INTO u7 FROM auth.users WHERE email = 'eh744713@gmail.com';
  SELECT id INTO u8 FROM auth.users WHERE email = 'mh62221345@gmail.com';
  SELECT id INTO u9 FROM auth.users WHERE email = 'seo.ravi.agency@gmail.com';

  -- ── 10 New Posts ────────────────────────────────────────────

  INSERT INTO public.posts
    (id, community_id, author_id, title, body, type, score, upvotes, downvotes, comment_count, is_draft, is_deleted, is_pinned, created_at, updated_at)
  VALUES

  -- Post 1: Jake_Anderson_DC — 0.9ct vs 1.0ct sub-threshold
  (p1, comm, u5,
   'I bought a 0.91ct instead of 1.00ct and saved $820 on an identical-looking stone. The math no one explains when you are shopping.',
   E'I was set on a 1ct round brilliant. That is what I said I wanted for eight months of shopping.\n\nThen a gemologist friend explained the carat threshold effect to me.\n\nDiamond prices do not increase linearly with carat weight. They jump at psychological milestones: 0.50ct, 0.75ct, 1.00ct, 1.50ct, 2.00ct. At each threshold, the price per carat increases by 15–25% compared to just below the threshold.\n\nThe comparison I ran on Blue Nile:\n\n• 1.00ct G-VS1, Excellent: $5,210\n• 0.91ct G-VS1, Excellent: $4,390\n\nDifference: $820 for 0.09 carats. That is 9% of the carat weight costing 19% of the price.\n\nFace-up size:\n• 1.00ct round: approximately 6.5mm diameter\n• 0.91ct round: approximately 6.2mm diameter\n\nThat is 0.3mm. On a size 7 finger, a 0.3mm difference in stone diameter is approximately 4.6% of total finger width. It is not visible at arm''s length.\n\nI held both stones over a printed ring size guide at the jeweler. I could not tell which was larger without the labels.\n\nWhat I did: bought the 0.91ct and put the $820 into a better platinum setting.\n\nThe ring looks exactly like a 1ct ring. It has a platinum setting instead of white gold. My fiancée loves it and has never once asked if it is a "full carat."\n\nThe certification says 0.91ct. Nobody reads the certificate. They look at the ring.',
   'text', 318, 336, 18, 3, false, false, false,
   now() - interval '9 days 4 hours', now() - interval '9 days 4 hours'),

  -- Post 2: Sophie_Laurent — yellow gold + H color discovery
  (p2, comm, u2,
   'I switched from platinum to 18K yellow gold and went from G to H color. Saved $1,200. Honest comparison after 5 months of wearing both.',
   E'I originally bought a GIA 1ct G-VS1 in platinum. Clean, classic, beautiful. I wore it for three months.\n\nThen I did something unusual: I bought a second ring for myself (anniversary gift to myself, long story) and chose 18K yellow gold. And because I had read about the warm metal color masking effect, I went with H color instead of G.\n\nLet me give you the exact numbers:\n\n• Ring 1: 1ct G-VS1 in platinum solitaire. Total paid: $7,100.\n• Ring 2: 1ct H-VS1 in 18K yellow gold solitaire. Total paid: $5,890.\n\nDifference: $1,210.\n\nI have worn both rings alternating days for 5 months. Here is my honest assessment.\n\nCOLOR AT THE CORNERS:\nThe H-VS1 in yellow gold reads identically to G in platinum at the corners. The warm metal reflects onto the corner zones and neutralises the tint completely. In three different lighting conditions — office fluorescent, outdoor sunlight, candlelight — I cannot find a condition where the yellow gold ring looks warmer at the corners than the platinum ring.\n\nOVERALL WARMTH:\nThe yellow gold ring has a warmth that the platinum ring does not — but it comes from the metal, not the stone. The stone face-up in isolation looks marginally cooler on the H than on the G. In the setting, you cannot see this because the gold reflects warm light everywhere.\n\nWEAR AFTER 5 MONTHS:\nPlatinum: no visible wear, V-prongs maintaining grip perfectly.\nYellow gold (18K): minor surface scratches on the band, normal for gold. Prong tips look unchanged.\n\nMy verdict: if you are considering yellow gold, go H. The stone difference is invisible in the setting. The $1,210 is real money.',
   'text', 274, 291, 17, 3, false, false, false,
   now() - interval '8 days 6 hours', now() - interval '8 days 6 hours'),

  -- Post 3: Marcus_Webb — GIA vs IGI
  (p3, comm, u4,
   'I submitted the same diamond to GIA and IGI for grading. The results were not the same. Here is exactly what happened.',
   E'This is not a rumour or a "I heard from someone" story. I did this myself.\n\nBackground: I had access to an unmounted 1ct round brilliant that had previously been graded by IGI as: G color, VS1 clarity, Excellent cut.\n\nI submitted it to GIA under my name.\n\nGIA result: H color, VS2 clarity, Excellent cut.\n\nSame stone. Same physical diamond. One grade lower in color, one grade lower in clarity, under GIA grading.\n\nWhat this means financially:\n• IGI G-VS1 Excellent market price: approximately $5,200\n• GIA H-VS2 Excellent market price: approximately $3,890\n\nThe IGI certificate added approximately $1,310 in perceived value to a stone that GIA would certify at a lower grade.\n\nThis is not an allegation of fraud. Gemological grading involves human judgment and IGI''s standards are simply looser than GIA''s. IGI grades at scale and at speed; GIA''s process is more conservative. The industry knows this. Most retail buyers do not.\n\nThe practical rule:\n\nFor natural diamonds: GIA or AGS certificates are the standard. IGI natural certificates trade at a meaningful discount and for good reason — the grade may be overstated by 1–2 levels.\n\nFor lab-grown diamonds: IGI is widely accepted and the grading gap matters less because lab diamond prices are already commodity-level. The financial stakes of an overstated IGI lab grade are lower.\n\nIf you are comparing a GIA G-VS1 to an IGI G-VS1 at the same price: you are not comparing the same thing.',
   'text', 387, 408, 21, 3, false, false, false,
   now() - interval '7 days 8 hours', now() - interval '7 days 8 hours'),

  -- Post 4: Jessica_Miller_PDX — oval bowtie
  (p4, comm, u1,
   'My oval diamond has a bowtie. Nobody told me this was normal. Six months of anxiety later, here is what I know.',
   E'I noticed it two weeks after my proposal. A dark shadow across the center of my oval diamond. Horizontally oriented, like a bowtie or a dark band.\n\nI panicked. I thought the diamond was damaged, defective, or that I had been sold something wrong. I took it to three jewelers.\n\nEvery single one said the same thing: "That is normal for oval cut. All ovals have some degree of bowtie."\n\nI had done six months of diamond research before we bought. Nobody in any guide I read mentioned the bowtie effect until after I had already noticed it.\n\nHere is what the bowtie actually is:\n\nAn oval diamond''s elongated shape creates zones where the pavilion facets cannot efficiently redirect light back through the crown. In the central perpendicular band of the stone, light leaks through rather than reflecting back. This creates a dark shadow in that zone.\n\nThe degree of bowtie varies:\n• Severe bowtie: a very dark, prominent band visible from across a room\n• Moderate bowtie: visible in most lighting, clearly present but not dominant\n• Faint bowtie: visible only in certain lighting conditions\n• Minimal bowtie: barely perceptible, most buyers find it acceptable\n\nMy stone has a moderate bowtie. Under direct sunlight it practically disappears — the brilliance overwhelms it. Under diffuse indoor light it is present but not jarring. Under specific indoor lighting angles it is the first thing I see.\n\nWhat I wish I had known before buying:\n1. Ask to see the 360° video specifically looking for the bowtie\n2. Request that the jeweler evaluate bowtie severity — "minimal," "moderate," or "severe"\n3. Elongated cushions and pear shapes also have bowtie effects; only round and princess cut are immune\n\nMy ring is still beautiful. But I would have made a more informed choice.',
   'text', 231, 246, 15, 3, false, false, false,
   now() - interval '6 days 12 hours', now() - interval '6 days 12 hours'),

  -- Post 5: Ryan_Mitchell_LA — insurance appraisal shock
  (p5, comm, u8,
   'I paid $5,640 for my ring. The insurance appraisal came back at $9,800. I spent a week trying to understand why. Here is what I learned.',
   E'I bought a GIA 1ct G-VS1 round Excellent in a platinum solitaire from an online retailer. Total: $5,640. I felt good about the price — I had shopped extensively and knew the market rate.\n\nSix weeks later I took the ring to a GIA-certified appraiser for insurance purposes.\n\nAppraisal value: $9,800.\n\nI thought there had been a mistake. I asked the appraiser to walk me through the number.\n\nHer explanation:\n\n"Insurance replacement appraisals are based on retail replacement cost at a local jeweler — not the discounted online price you paid. If this ring were stolen or lost, and you had to replace it through a brick-and-mortar jeweler, $9,800 is approximately what you would pay."\n\nThe retail markup on diamonds at physical stores is 100–200% above online prices. A $5,640 online purchase legitimately appraises at $9,800 retail because that is what it would cost to replace it in-person.\n\nWhat this means practically:\n\n1. DO insure your ring based on the appraisal value, not the purchase price. If it is stolen and your policy covers purchase price only, you will not be able to replace it for that amount.\n\n2. Get an independent appraisal. Do not use the seller''s in-house appraisal — independent GIA-certified appraisers are the standard.\n\n3. Update the appraisal every 3–5 years. Diamond prices change. An outdated appraisal can leave you underinsured.\n\n4. Jeweler''s block insurance or a rider on your homeowner''s policy is usually the right vehicle. Standalone jewelry insurance from companies like Jewelers Mutual starts at approximately $1.50–2.00 per $100 of coverage.\n\nMy annual insurance premium on a $9,800 appraisal: $147. Worth every dollar.',
   'text', 263, 279, 16, 3, false, false, false,
   now() - interval '5 days 16 hours', now() - interval '5 days 16 hours'),

  -- Post 6: Daniel_Foster — VS2 vs VS1 blind test
  (p6, comm, u9,
   'I ran a blind test. 12 people, two rings — one VS1 and one VS2. Nobody could tell which was which at arm''s length. What this means for your budget.',
   E'The setup: I borrowed two 1ct G round brilliant diamonds from a jeweler I know. Same carat weight, same color, same cut grade (Excellent), same setting style. One VS1, one VS2.\n\nI did not tell any of the 12 participants which was which. I handed each person both rings, asked them to look naturally — arm''s length, no loupe — and tell me which stone looked "cleaner" or "better."\n\n12 participants: my fiancée, her four friends, my sister, my mother, three of my coworkers, my fiancée''s mother, and a salesperson at a shoe store who agreed to participate.\n\nResults:\n\n• 4 people chose VS1 as the "better looking" stone\n• 5 people chose VS2 as the "better looking" stone\n• 3 people said they could not tell the difference\n\nRandom chance would produce a 50/50 split. The result was essentially random.\n\nThe price difference between the two stones: $324.\n\nNow, there is an important caveat to this test. The VS2 stone I used had its inclusions confirmed not at the corners — central cloud and a small feather near the girdle edge. A VS2 stone with inclusions at the corners of a princess cut or near the table of any shape would be a different test. That VS2 might show inclusions under some viewing conditions.\n\nThe takeaway is nuanced:\n\n• VS2 for round brilliants, with inclusions confirmed not at the table or visible face-up: often indistinguishable from VS1 to the naked eye\n• VS1 is still the right default if you are not willing to review individual stones carefully\n• The $324 saving on a round brilliant is real money that could go toward carat weight, setting quality, or a better color grade\n\nFor princess cut specifically: VS1 is the firm minimum because of corner clarity concentration. The blind test results do not transfer to shapes with corner optical traps.',
   'text', 242, 257, 15, 3, false, false, false,
   now() - interval '4 days 20 hours', now() - interval '4 days 20 hours'),

  -- Post 7: EmmaWatts_UK — princess corner chip
  (p7, comm, u3,
   'My friend chipped her princess cut diamond 14 months after buying it. The repair cost, what caused it, and what setting she should have had.',
   E'My friend bought a princess cut diamond ring 14 months ago. Beautiful stone, G-VS1, 1ct, in a 14K white gold setting with four standard claw prongs.\n\nLast month she knocked it against a marble kitchen counter while doing the dishes.\n\nThe corner chipped. A small but visible chip on the lower-left corner of the diamond.\n\nWhat the repair assessment said:\n\nOption 1: Re-cut the corners to remove the chip. The stone would become slightly smaller — approximately 0.87ct — and rounder in appearance. Cost: £380 for re-cutting, then re-setting. The GIA certificate would need to be resubmitted. Total: approximately £520.\n\nOption 2: Replace the damaged stone. A comparable 1ct G-VS1 in the current market: approximately £3,900. Plus setting labour: £180.\n\nOption 3: Live with the chip and ensure the setting covers it. If the corner prong is repositioned to sit over the chipped corner, the damage is hidden. Cost: £90 for prong adjustment.\n\nShe went with Option 3 for now and is saving for a replacement stone.\n\nWhat caused this: claw prongs on princess cut corners. A claw prong sits flat on the table facet surface. It provides lateral grip but almost no protection to the corner point itself — which is the thinnest, most vulnerable part of the stone. A direct blow to an unprotected princess cut corner is the most predictable chip scenario in engagement ring wear.\n\nWhat she should have had: V-prongs. A V-prong cups the corner with metal on both diagonal faces, providing physical protection to the corner tip. It is specifically designed for square and rectangular cuts.\n\nThis is not rare. Princess cut corner chips are the most common diamond damage repair in any repair shop.\n\nIf you have a princess cut with claw prongs: ask your jeweler about converting to V-prongs. It is usually a straightforward modification.',
   'text', 296, 314, 18, 3, false, false, false,
   now() - interval '3 days 18 hours', now() - interval '3 days 18 hours'),

  -- Post 8: Oliver_Hughes — salt and pepper diamond 8 months
  (p8, comm, u7,
   'I proposed with a salt and pepper diamond and have worn it for 8 months. Honest review including what conventional diamond buyers think of it.',
   E'Salt and pepper diamonds are included diamonds — stones with visible black and white inclusions that are intentionally selected for their appearance rather than minimised. They are sold by specialty vendors and cost a fraction of comparable-carat clear diamonds.\n\nMy stone: 1.8ct round salt and pepper, set in a 14K rose gold four-prong solitaire. Total cost: £820.\n\nFor comparison: a "clean" GIA 1.8ct G-VS1 round Excellent would have cost approximately £9,200. I bought 1.8 carats of diamond and a lovely ring for less than 10% of that.\n\n8 MONTHS HONEST REPORT:\n\nWHAT I LOVE:\n• The stone is genuinely beautiful. The grey-white-black pattern is unique — no two salt and pepper diamonds are identical.\n• 1.8 carats is substantial face-up presence. The ring has visual weight and presence that comparable-budget clear diamonds cannot match.\n• People comment on it constantly. Nobody has ever seen one before. It always starts a conversation.\n• Zero anxiety about scratches on the metal or minor wear — the stone is already intentionally "imperfect" by design.\n\nWHAT IS HARDER THAN EXPECTED:\n• My mother-in-law asked three separate times if I could "get a real diamond next time." I have explained salt and pepper diamonds to her three times.\n• At formal events, the stone looks different from every other engagement ring in the room. I find this positive. My partner occasionally finds it self-conscious-making depending on the company.\n• The specialty vendor market is less standardised than the GIA-certified market. Research your vendor carefully — there are no independent certifications for salt and pepper quality.\n\nWould I do it again: yes, without hesitation. But be honest with yourself about whether your partner is unconventional enough to love a stone that requires explanation.',
   'text', 203, 216, 13, 3, false, false, false,
   now() - interval '2 days 22 hours', now() - interval '2 days 22 hours'),

  -- Post 9: Sarah_Collins_NYC — ring resizing unexpected cost
  (p9, comm, u6,
   'My ring finger grew a full size in 18 months of marriage. The resizing cost, what it did to the setting, and the sizing rule I wish someone had told me.',
   E'I wore a size 5.5 ring at my engagement. By our first anniversary, my ring was uncomfortably tight. By 18 months, I could not get it off without effort.\n\nMy current size: 6.5. A full size increase in 18 months.\n\nI am not unusual. Fingers change size due to weight fluctuation, hormonal changes, weather, pregnancy, and simply the natural swelling that happens in your mid-to-late twenties. Most women''s ring size changes at least half a size within the first few years of wearing a ring daily.\n\nThe resizing:\n\nI took my platinum solitaire to my jeweler for resizing from 5.5 to 6.5.\n\nPlatinum resizing quote: £240. This included adding a section of platinum to the shank to increase the circumference. Platinum sizing is more labour-intensive than gold because the metal requires more heat and specialised tools.\n\nWhite gold resizing: for comparison, my jeweler quoted £90 for the same size change in 14K white gold.\n\nThe complication nobody warned me about:\n\nMy ring has a knife-edge band — the band tapers to a sharp ridge on the outside. When you resize a knife-edge band by adding material, the new section has to be shaped to maintain the taper profile. My jeweler said this adds approximately 90 minutes of labour versus a flat band. The result is seamless, but I paid for the complexity.\n\nThe sizing rule I now know:\n• Always size slightly large rather than slightly small. A ring that is 0.25 size too large can be worn; a ring that is 0.25 size too small cannot.\n• Have your finger sized in the afternoon — fingers are largest then due to natural daily swelling\n• Have your finger sized in warm weather — fingers contract in cold\n• Consider sizing beads (small metal balls added inside the shank) for rings that are slightly large — cheaper than full resizing\n\nThe resizing was worth every penny. Wear your ring every day in comfort.',
   'text', 187, 199, 12, 3, false, false, false,
   now() - interval '1 day 20 hours', now() - interval '1 day 20 hours'),

  -- Post 10: Jake_Anderson_DC — Tiffany price experiment
  (p10, comm, u5,
   'I priced the exact same diamond at Tiffany, Blue Nile, and a local independent. The difference was $8,400. Here is what Tiffany is actually selling.',
   E'I want to be precise about this because the number sounds implausible until you see it broken down.\n\nI went to a Tiffany & Co. store and was shown a 1ct G-VS1 round Excellent in their classic platinum 4-prong solitaire: $12,400. The stone was GIA certified.\n\nI noted the GIA report number. I left the store and searched it online.\n\nBlue Nile had the identical stone — same GIA number — listed at $5,210. The Tiffany solitaire setting is comparable to a Blue Nile solitaire at approximately $1,200.\n\nTotal Blue Nile equivalent: $6,410.\nTiffany price: $12,400.\nDifference: $5,990.\n\nI then found a local independent jeweler with a GIA-trained gemologist on staff. He sourced a comparable GIA 1ct G-VS1 round Excellent for me: $4,980 for the stone, custom platinum 4-prong solitaire at $780. Total: $5,760.\n\nDifference from Tiffany: $6,640.\n\nSo what is the $6,640 buying at Tiffany?\n\n• The Tiffany brand name\n• The blue box\n• The in-store experience\n• The resale name recognition (a "Tiffany ring" does command a premium on the secondhand market — typically 20–30% above comparable non-branded rings)\n• The story you tell at the dinner table\n\nIs it worth $6,640? That is not a question I can answer for you. It is a question about what you value.\n\nWhat I can tell you is that the diamond inside a Tiffany solitaire is a GIA-certified round brilliant that is available through other channels at the GIA-certified price. The Tiffany premium is entirely about the brand, the box, and the retail experience — not about a different or better diamond.\n\nI bought through the independent jeweler. The ring is indistinguishable from the Tiffany version to anyone who does not flip it over to read the hallmark.',
   'text', 341, 360, 19, 3, false, false, false,
   now() - interval '10 hours', now() - interval '10 hours');

  -- ── 30 Comments ─────────────────────────────────────────────

  INSERT INTO public.comments
    (id, post_id, author_id, body, score, upvotes, downvotes, is_deleted, created_at)
  VALUES

  -- Post 1 (0.9ct sub-threshold)
  (c1a, p1, u4,
   'The threshold pricing effect is one of the most consistently exploitable patterns in the diamond market. The 0.90–0.99ct range is the classic entry point. Below-threshold stones at 0.45–0.49ct and 0.70–0.74ct follow the same logic. The price per carat increases at the threshold; everything just below the threshold captures the visual size without paying the milestone premium. Your $820 saving is entirely real and entirely repeatable.',
   54, 57, 3, false, now() - interval '9 days'),
  (c1b, p1, u1,
   'I did this for my second ring purchase after learning from my first. I bought a 0.93ct and put the savings into an upgraded setting. Nobody has ever asked me if it was "a full carat." The question literally never comes up. The certificate number is what matters on paper; the face-up appearance is what matters in real life.',
   41, 43, 2, false, now() - interval '8 days 22 hours'),
  (c1c, p1, u3,
   'The 0.3mm diameter difference at 0.91ct vs 1.00ct is worth visualising concretely. Hold a ruler and look at the difference between 6.2mm and 6.5mm. That is the face-up difference. On most finger widths, this falls below the threshold of reliable naked-eye detection at conversational distance. The GIA certificate is the only place the weight difference is visible.',
   33, 35, 2, false, now() - interval '8 days 18 hours'),

  -- Post 2 (yellow gold + H color)
  (c2a, p2, u4,
   'The warm metal masking effect is documented and consistent. 18K yellow gold reflects approximately 650–700nm wavelength light — the warm spectrum. This reflection counteracts the 430–480nm blue-spectrum absorption that causes yellow tint in H–J diamonds. The stone corner zones, which concentrate body color in cuts like princess and oval, benefit most from this masking because the reflected warmth directly neutralises what would otherwise be visible tint.',
   48, 51, 3, false, now() - interval '8 days 4 hours'),
  (c2b, p2, u7,
   'The 5-month wear comparison across both metals is genuinely useful data. I have been considering yellow gold precisely for the H-color saving but was worried about the "looks warm" concern. Your conclusion — that the stone reads identically to G in platinum — matches what I have heard from gemologists but rarely from actual wearers. This is the kind of post that should be pinned.',
   37, 39, 2, false, now() - interval '8 days'),
  (c2c, p2, u6,
   'Rose gold produces a similar masking effect to yellow gold on H-color corner zones. The specific warmth spectrum is slightly different — rose gold''s copper alloy produces a pink-warm rather than yellow-warm reflection — but the practical result for H-color diamonds is the same: the corner tint is neutralised. G in platinum, H in yellow or rose gold: both look near-colorless in the setting.',
   29, 30, 1, false, now() - interval '7 days 20 hours'),

  -- Post 3 (GIA vs IGI)
  (c3a, p3, u1,
   'I have heard this from multiple industry contacts but this is the clearest documented example I have seen on a consumer forum. The 1-color, 1-clarity grade differential is the most commonly cited gap between GIA and IGI for natural stones. The financial impact at the 1ct G-VS1 level is substantial — you have quantified exactly why GIA certification commands a premium in the natural diamond market.',
   67, 71, 4, false, now() - interval '7 days 4 hours'),
  (c3b, p3, u9,
   'The lab-grown caveat is important and often missed. For lab diamonds, IGI is the dominant certification lab and the grading is more consistent because CVD and HPHT stones have more predictable crystal structures. The "IGI grades looser" problem is documented specifically for natural stones where human colour and clarity judgment varies more significantly. Buying an IGI lab-grown diamond is not the same risk as buying an IGI natural diamond.',
   52, 55, 3, false, now() - interval '7 days'),
  (c3c, p3, u5,
   'The GIA report number search technique is the specific test that reveals retailer premium versus stone premium. Any stone with a GIA report number can be searched and cross-listed. If a retailer''s price is substantially above the market price for the same GIA number, you are paying a brand premium. That premium may or may not be worth it — but you should know that is what you are paying for.',
   44, 46, 2, false, now() - interval '6 days 20 hours'),

  -- Post 4 (oval bowtie)
  (c4a, p4, u4,
   'The bowtie severity spectrum is real and matters enormously for oval purchases. I have seen ovals where the bowtie was essentially invisible under normal conditions — excellent cutting can minimise but not eliminate it. I have also seen ovals where the dark band was the first and only thing you noticed. The 360° video test specifically: rotate the stone slowly and watch the central band under the video''s light source. A severe bowtie will show clearly.',
   49, 52, 3, false, now() - interval '6 days 10 hours'),
  (c4b, p4, u6,
   'This happened to a friend who bought a pear shape. Same discovery, same anxiety, same "the jeweler says it''s normal." The elongated fancy shapes — oval, pear, marquise, elongated cushion — all have some degree of bowtie due to the geometry of light return at the elongated ends. The only way to evaluate severity before buying is video, ideally under multiple light sources. Static photos almost never show the bowtie clearly.',
   36, 38, 2, false, now() - interval '6 days 6 hours'),
  (c4c, p4, u2,
   'This is the post I wish had existed when I was ring shopping. I almost bought an oval and the bowtie was never mentioned in any guide I read. I ended up choosing a round brilliant specifically because I could not find reliable guidance on evaluating bowtie severity before buying sight-unseen online. This should be required reading for anyone considering an oval, pear, or marquise.',
   28, 29, 1, false, now() - interval '6 days 2 hours'),

  -- Post 5 (insurance appraisal)
  (c5a, p5, u4,
   'The appraisal-versus-purchase-price gap is one of the most consistent surprises for online diamond buyers. Retail replacement cost is always higher than online transaction price because the retail market is inefficient — brick-and-mortar overhead, staff, display inventory, and margin all factor into the price a local jeweler would charge. Insuring at purchase price exposes you to a coverage gap of exactly the magnitude you experienced.',
   53, 56, 3, false, now() - interval '5 days 14 hours'),
  (c5b, p5, u1,
   'Jewelers Mutual is the specialist insurer I use. Their process requires an independent appraisal and they cover loss, theft, damage including chipping and stone loss — a scope that homeowner''s riders sometimes exclude. Annual premium at my coverage amount is $1.80 per $100. For a $9,000 appraisal that is $162 per year. The ring is irreplaceable sentimentally; $162 is the cost of sleeping soundly.',
   41, 43, 2, false, now() - interval '5 days 10 hours'),
  (c5c, p5, u7,
   'Update the appraisal point cannot be overstated. Diamond prices have been volatile over the past three years — natural prices held relatively steady while lab prices declined 40–50%. If you have an older appraisal on a natural diamond that was done when natural prices were lower, your coverage may be insufficient. If you have an older appraisal on a lab diamond from 2022–2023, you may be over-insured and paying unnecessarily high premiums.',
   34, 36, 2, false, now() - interval '5 days 6 hours'),

  -- Post 6 (VS2 vs VS1 blind test)
  (c6a, p6, u4,
   'This is a well-designed test and the results are consistent with what gemologists have known for decades. VS1 and VS2 are grading categories defined by 10x magnification criteria. They were never intended to predict naked-eye visual difference — that is the job of the SI grades and below. The VS1-VS2 distinction matters for the certificate, for resale, and for corner-position risk in certain cuts. For face-up appearance to the naked eye under normal conditions: the difference is not reliably detectable.',
   58, 62, 4, false, now() - interval '4 days 18 hours'),
  (c6b, p6, u2,
   'The princess cut caveat at the end is the most important part of this post. I bought a VS2 princess cut based on a similar "it''s invisible" logic and had visible corner inclusions under certain lighting. The corner clarity trap in princess cuts means the standard VS1 recommendation for that shape exists for a real reason that your round brilliant blind test does not address.',
   45, 47, 2, false, now() - interval '4 days 14 hours'),
  (c6c, p6, u8,
   'New buyer here. This test gives me permission I needed. I was agonising between VS1 and VS2 on a round brilliant and leaning toward VS1 purely because I was scared to compromise. The cert review process you mentioned for VS2 — confirming inclusions not at the table or visible face-up — is the due diligence that makes VS2 a reasonable choice, not a blind downgrade.',
   27, 28, 1, false, now() - interval '4 days 10 hours'),

  -- Post 7 (princess corner chip)
  (c7a, p7, u4,
   'Corner chips on princess cuts are the most predictable category of diamond damage in repair work. A princess cut corner is geometrically the thinnest point of the stone — two facet planes meeting at a sharp angle with minimal material. The impact resistance at that point is far lower than at the girdle of a round brilliant. V-prongs are not a premium feature; they are structural protection for a known vulnerability.',
   61, 65, 4, false, now() - interval '3 days 16 hours'),
  (c7b, p7, u1,
   'I checked my own princess cut setting after reading this. Standard claw prongs. I am booking a prong conversion consultation this week. My ring is two years old and I have never had a prong inspection. The combination of claw prongs and no maintenance on a princess cut is exactly the scenario described here. Thank you for posting this.',
   47, 50, 3, false, now() - interval '3 days 12 hours'),
  (c7c, p7, u9,
   'Option 3 — prong repositioning to cover the chip — is actually a sensible interim solution. Many corner chips are small enough that a repositioned V-prong covers the damaged area completely and the stone wears normally. The chip does not grow or propagate in normal wear unless there is a deep feather extension. If the chip is purely surface, the repositioned prong effectively eliminates the problem without the cost of stone replacement.',
   38, 40, 2, false, now() - interval '3 days 8 hours'),

  -- Post 8 (salt and pepper)
  (c8a, p8, u2,
   'The £820 versus £9,200 comparison is the most compelling argument for salt and pepper in a single number. I have a friend who went this route and the ring is genuinely striking. The aesthetic is completely different from a clear diamond — more geological, more unique — and the savings allow for a larger stone and better metalwork than would be possible at any reasonable budget in the clear diamond market.',
   43, 46, 3, false, now() - interval '2 days 20 hours'),
  (c8b, p8, u5,
   'The vendor research point is the right caution. GIA does not certify salt and pepper diamonds as a category with standardised grading. You are relying entirely on the vendor''s description and reputation. There are excellent specialist vendors with strong track records and there are vendors who sell overpriced included stones. Research the vendor, not just the stone — read reviews, look for a return policy, and understand that "beautiful inclusions" is a subjective judgment.',
   35, 37, 2, false, now() - interval '2 days 16 hours'),
  (c8c, p8, u6,
   'The mother-in-law reaction is the most honest part of this review. Salt and pepper is a genuine lifestyle and social choice, not just a budget choice. If the people in your life have conventional taste and will make comments that affect your partner''s relationship with their ring, that is a real factor. If your partner is secure in unconventional choices and finds the uniqueness to be the point: this is a beautiful option. Know your audience.',
   29, 30, 1, false, now() - interval '2 days 12 hours'),

  -- Post 9 (ring resizing)
  (c9a, p9, u4,
   'The knife-edge band resizing complication is genuinely underappreciated. Knife-edge shanks are more difficult to resize in both directions — adding material requires matching the taper profile precisely, removing material risks collapsing the ridge. The resizing premium for complex band profiles is real and is worth knowing before you choose a band style. A flat or domed shank resizes for significantly less labour cost.',
   46, 49, 3, false, now() - interval '1 day 18 hours'),
  (c9b, p9, u3,
   'The afternoon sizing recommendation is important enough that I include it every time someone asks me about ring sizing. Fingers are measurably larger in the afternoon than in the morning due to fluid accumulation from daily activity. Fingers are also larger in warm temperatures. If you are sized in the morning in winter, you may be sized up to a half size smaller than your afternoon summer size. Both conditions are real and both affect comfort.',
   38, 40, 2, false, now() - interval '1 day 14 hours'),
  (c9c, p9, u7,
   'Sizing beads are under-used and deserve more attention. For a ring that is only slightly too large — a quarter to half size — two small platinum or gold balls soldered to the interior of the shank add friction and keep the ring positioned correctly without permanent resizing. Cost is usually £30–60, it is reversible, and it does not affect the structural integrity of the setting. Worth asking about before committing to full resizing.',
   31, 33, 2, false, now() - interval '1 day 10 hours'),

  -- Post 10 (Tiffany premium)
  (c10a, p10, u4,
   'The 20–30% resale premium for Tiffany-branded rings is real and documented in the secondhand market — you can verify this on 1stDibs and The RealReal right now. The question is whether that resale premium justifies a 100%+ purchase premium. For most buyers the math does not work. For buyers who care deeply about the brand story, the box, and the social signal: the premium is at least partially rational. Neither position is wrong.',
   55, 58, 3, false, now() - interval '8 hours'),
  (c10b, p10, u1,
   'The local independent jeweler route is systematically underutilised by online-generation buyers. A GIA-trained independent jeweler can source a comparable stone to any online retailer, often at a slight discount, and the setting will be custom and unique rather than catalogue. You also get a human relationship — someone who will inspect and maintain your ring for years. The £6,640 difference you describe is the cost of that relationship not existing.',
   42, 44, 2, false, now() - interval '6 hours'),
  (c10c, p10, u2,
   'I have the Tiffany box. I will be honest about it: the box mattered to me at the time of purchase and it matters exactly zero in daily life. What I wear every day is the ring. What I look at every day is the stone. The box is in a drawer. I have shown it to people exactly twice in two years. If I could give myself advice at the time of purchase: spend the premium on a better stone inside whatever box you choose.',
   36, 38, 2, false, now() - interval '4 hours');

  -- ── Post votes ──────────────────────────────────────────────

  INSERT INTO public.post_votes (post_id, user_id, vote, created_at)
  VALUES
    (p1, u1, 1, now() - interval '9 days 2 hours'),
    (p1, u2, 1, now() - interval '9 days 1 hour'),
    (p1, u3, 1, now() - interval '9 days'),
    (p1, u4, 1, now() - interval '8 days 22 hours'),
    (p1, u6, 1, now() - interval '8 days 20 hours'),
    (p1, u7, 1, now() - interval '8 days 18 hours'),
    (p1, u9, 1, now() - interval '8 days 16 hours'),

    (p2, u1, 1, now() - interval '8 days 4 hours'),
    (p2, u3, 1, now() - interval '8 days 2 hours'),
    (p2, u4, 1, now() - interval '8 days'),
    (p2, u5, 1, now() - interval '7 days 22 hours'),
    (p2, u7, 1, now() - interval '7 days 20 hours'),
    (p2, u8, 1, now() - interval '7 days 18 hours'),
    (p2, u9, 1, now() - interval '7 days 16 hours'),

    (p3, u1, 1, now() - interval '7 days 6 hours'),
    (p3, u2, 1, now() - interval '7 days 4 hours'),
    (p3, u3, 1, now() - interval '7 days 2 hours'),
    (p3, u5, 1, now() - interval '7 days'),
    (p3, u6, 1, now() - interval '6 days 22 hours'),
    (p3, u7, 1, now() - interval '6 days 20 hours'),
    (p3, u8, 1, now() - interval '6 days 18 hours'),

    (p4, u2, 1, now() - interval '6 days 10 hours'),
    (p4, u3, 1, now() - interval '6 days 8 hours'),
    (p4, u4, 1, now() - interval '6 days 6 hours'),
    (p4, u5, 1, now() - interval '6 days 4 hours'),
    (p4, u7, 1, now() - interval '6 days 2 hours'),
    (p4, u8, 1, now() - interval '6 days'),
    (p4, u9, 1, now() - interval '5 days 22 hours'),

    (p5, u1, 1, now() - interval '5 days 14 hours'),
    (p5, u2, 1, now() - interval '5 days 12 hours'),
    (p5, u3, 1, now() - interval '5 days 10 hours'),
    (p5, u4, 1, now() - interval '5 days 8 hours'),
    (p5, u6, 1, now() - interval '5 days 6 hours'),
    (p5, u7, 1, now() - interval '5 days 4 hours'),
    (p5, u9, 1, now() - interval '5 days 2 hours'),

    (p6, u1, 1, now() - interval '4 days 18 hours'),
    (p6, u3, 1, now() - interval '4 days 16 hours'),
    (p6, u4, 1, now() - interval '4 days 14 hours'),
    (p6, u5, 1, now() - interval '4 days 12 hours'),
    (p6, u7, 1, now() - interval '4 days 10 hours'),
    (p6, u8, 1, now() - interval '4 days 8 hours'),
    (p6, u9, 1, now() - interval '4 days 6 hours'),

    (p7, u1, 1, now() - interval '3 days 16 hours'),
    (p7, u2, 1, now() - interval '3 days 14 hours'),
    (p7, u4, 1, now() - interval '3 days 12 hours'),
    (p7, u5, 1, now() - interval '3 days 10 hours'),
    (p7, u6, 1, now() - interval '3 days 8 hours'),
    (p7, u8, 1, now() - interval '3 days 6 hours'),
    (p7, u9, 1, now() - interval '3 days 4 hours'),

    (p8, u1, 1, now() - interval '2 days 20 hours'),
    (p8, u2, 1, now() - interval '2 days 18 hours'),
    (p8, u4, 1, now() - interval '2 days 16 hours'),
    (p8, u5, 1, now() - interval '2 days 14 hours'),
    (p8, u6, 1, now() - interval '2 days 12 hours'),
    (p8, u7, 1, now() - interval '2 days 10 hours'),
    (p8, u9, 1, now() - interval '2 days 8 hours'),

    (p9, u2, 1, now() - interval '1 day 18 hours'),
    (p9, u3, 1, now() - interval '1 day 16 hours'),
    (p9, u4, 1, now() - interval '1 day 14 hours'),
    (p9, u5, 1, now() - interval '1 day 12 hours'),
    (p9, u6, 1, now() - interval '1 day 10 hours'),
    (p9, u7, 1, now() - interval '1 day 8 hours'),
    (p9, u8, 1, now() - interval '1 day 6 hours'),

    (p10, u1, 1, now() - interval '8 hours'),
    (p10, u2, 1, now() - interval '7 hours 30 minutes'),
    (p10, u3, 1, now() - interval '7 hours'),
    (p10, u4, 1, now() - interval '6 hours 30 minutes'),
    (p10, u6, 1, now() - interval '6 hours'),
    (p10, u7, 1, now() - interval '5 hours 30 minutes'),
    (p10, u9, 1, now() - interval '5 hours')
  ON CONFLICT DO NOTHING;

  -- ── Comment votes ────────────────────────────────────────────

  INSERT INTO public.comment_votes (comment_id, user_id, vote)
  VALUES
    (c1a, u1, 1), (c1a, u3, 1), (c1a, u6, 1), (c1a, u8, 1),
    (c1b, u2, 1), (c1b, u5, 1), (c1b, u9, 1),
    (c1c, u1, 1), (c1c, u4, 1), (c1c, u7, 1),

    (c2a, u1, 1), (c2a, u3, 1), (c2a, u5, 1), (c2a, u8, 1),
    (c2b, u2, 1), (c2b, u4, 1), (c2b, u9, 1),
    (c2c, u1, 1), (c2c, u5, 1), (c2c, u8, 1),

    (c3a, u2, 1), (c3a, u5, 1), (c3a, u7, 1), (c3a, u8, 1),
    (c3b, u1, 1), (c3b, u3, 1), (c3b, u6, 1),
    (c3c, u2, 1), (c3c, u4, 1), (c3c, u9, 1),

    (c4a, u1, 1), (c4a, u3, 1), (c4a, u6, 1), (c4a, u9, 1),
    (c4b, u2, 1), (c4b, u5, 1), (c4b, u7, 1),
    (c4c, u1, 1), (c4c, u4, 1), (c4c, u8, 1),

    (c5a, u2, 1), (c5a, u3, 1), (c5a, u7, 1), (c5a, u9, 1),
    (c5b, u4, 1), (c5b, u6, 1), (c5b, u8, 1),
    (c5c, u1, 1), (c5c, u3, 1), (c5c, u5, 1),

    (c6a, u1, 1), (c6a, u2, 1), (c6a, u7, 1), (c6a, u9, 1),
    (c6b, u3, 1), (c6b, u5, 1), (c6b, u8, 1),
    (c6c, u1, 1), (c6c, u4, 1), (c6c, u6, 1),

    (c7a, u1, 1), (c7a, u2, 1), (c7a, u6, 1), (c7a, u9, 1),
    (c7b, u2, 1), (c7b, u5, 1), (c7b, u7, 1),
    (c7c, u1, 1), (c7c, u4, 1), (c7c, u6, 1),

    (c8a, u1, 1), (c8a, u4, 1), (c8a, u7, 1), (c8a, u9, 1),
    (c8b, u2, 1), (c8b, u3, 1), (c8b, u8, 1),
    (c8c, u1, 1), (c8c, u4, 1), (c8c, u7, 1),

    (c9a, u1, 1), (c9a, u2, 1), (c9a, u6, 1), (c9a, u8, 1),
    (c9b, u3, 1), (c9b, u5, 1), (c9b, u9, 1),
    (c9c, u1, 1), (c9c, u4, 1), (c9c, u6, 1),

    (c10a, u1, 1), (c10a, u2, 1), (c10a, u6, 1), (c10a, u8, 1),
    (c10b, u3, 1), (c10b, u5, 1), (c10b, u9, 1),
    (c10c, u1, 1), (c10c, u4, 1), (c10c, u7, 1)
  ON CONFLICT DO NOTHING;

  -- ── Sync comment counts ──────────────────────────────────────
  UPDATE public.posts SET
    comment_count = (
      SELECT COUNT(*) FROM public.comments
      WHERE post_id = posts.id AND is_deleted = false
    )
  WHERE id IN (p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);

END $$;

SELECT COUNT(*) AS total_community_posts FROM public.posts WHERE is_deleted = false;
