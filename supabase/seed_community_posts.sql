-- ============================================================
-- DiamondCritics Community — 10 Engaging Posts + 9 Users
-- Paste into: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run: uses ON CONFLICT DO NOTHING + WHERE NOT EXISTS
-- ============================================================

-- Step 0: Ensure is_draft column exists
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false;

DO $$
DECLARE
  -- ── User UUIDs ──────────────────────────────────────────────
  u1 UUID;  -- Jessica_Miller_PDX   auburndazzle@gmail.com
  u2 UUID;  -- Sophie_Laurent       farzanatoma111@gmail.com
  u3 UUID;  -- EmmaWatts_UK         farzanatoma001@gmail.com
  u4 UUID;  -- Marcus_Webb          ironsidesgroup@gmail.com
  u5 UUID;  -- Jake_Anderson_DC     mehedihasan.linkedin@gmail.com
  u6 UUID;  -- Sarah_Collins_NYC    mh6222134567@gmail.com
  u7 UUID;  -- Oliver_Hughes        eh744713@gmail.com
  u8 UUID;  -- Ryan_Mitchell_LA     mh62221345@gmail.com
  u9 UUID;  -- Daniel_Foster        seo.ravi.agency@gmail.com

  -- ── Community ───────────────────────────────────────────────
  comm UUID;

  -- ── Post UUIDs ──────────────────────────────────────────────
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

  -- ── Comment UUIDs (3 per post = 30 comments) ────────────────
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

  -- ── Get community ────────────────────────────────────────────
  SELECT id INTO comm FROM public.communities WHERE slug = 'diamonds' LIMIT 1;
  IF comm IS NULL THEN
    RAISE EXCEPTION 'Community slug=diamonds not found. Run full_setup.sql first.';
  END IF;

  -- ── Create auth users (skip if email already exists) ─────────

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'auburndazzle@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '210 days', now(), '{"username":"Jessica_Miller_PDX"}'::jsonb,
         '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'auburndazzle@gmail.com');
  SELECT id INTO u1 FROM auth.users WHERE email = 'auburndazzle@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'farzanatoma111@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '90 days', now(), '{"username":"Sophie_Laurent"}'::jsonb,
         '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'farzanatoma111@gmail.com');
  SELECT id INTO u2 FROM auth.users WHERE email = 'farzanatoma111@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'farzanatoma001@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '45 days', now(), '{"username":"EmmaWatts_UK"}'::jsonb,
         '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'farzanatoma001@gmail.com');
  SELECT id INTO u3 FROM auth.users WHERE email = 'farzanatoma001@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'ironsidesgroup@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '150 days', now(), '{"username":"Marcus_Webb"}'::jsonb,
         '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ironsidesgroup@gmail.com');
  SELECT id INTO u4 FROM auth.users WHERE email = 'ironsidesgroup@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'mehedihasan.linkedin@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '60 days', now(), '{"username":"Jake_Anderson_DC"}'::jsonb,
         '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mehedihasan.linkedin@gmail.com');
  SELECT id INTO u5 FROM auth.users WHERE email = 'mehedihasan.linkedin@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'mh6222134567@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '120 days', now(), '{"username":"Sarah_Collins_NYC"}'::jsonb,
         '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mh6222134567@gmail.com');
  SELECT id INTO u6 FROM auth.users WHERE email = 'mh6222134567@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'eh744713@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '75 days', now(), '{"username":"Oliver_Hughes"}'::jsonb,
         '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'eh744713@gmail.com');
  SELECT id INTO u7 FROM auth.users WHERE email = 'eh744713@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'mh62221345@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '30 days', now(), '{"username":"Ryan_Mitchell_LA"}'::jsonb,
         '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mh62221345@gmail.com');
  SELECT id INTO u8 FROM auth.users WHERE email = 'mh62221345@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'seo.ravi.agency@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '180 days', now(), '{"username":"Daniel_Foster"}'::jsonb,
         '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'seo.ravi.agency@gmail.com');
  SELECT id INTO u9 FROM auth.users WHERE email = 'seo.ravi.agency@gmail.com';

  -- ── Create profiles ───────────────────────────────────────────
  INSERT INTO public.profiles (id, username, display_name, bio, post_karma, comment_karma, created_at)
  VALUES
    (u1, 'Jessica_Miller_PDX',  'Jessica Miller',   'Portland, OR. GIA verified. Princess cut obsessed. Sharing so others don''t overpay.',       2341, 891,  now() - interval '210 days'),
    (u2, 'Sophie_Laurent',      'Sophie Laurent',   'Paris → NYC. Bought 3 rings in 3 years. Expert by necessity.',                                1204, 537,  now() - interval '90 days'),
    (u3, 'EmmaWatts_UK',        'Emma Watts',       'London, UK. 18 months daily wear testing. Honest reviews only.',                               678,  312,  now() - interval '45 days'),
    (u4, 'Marcus_Webb',         'Marcus Webb',      'Chicago, IL. Adjacent to the trade. Former retail, sharing industry truths.',                  3892, 1204, now() - interval '150 days'),
    (u5, 'Jake_Anderson_DC',    'Jake Anderson',    'Washington DC. Budget-conscious buyer. Sub-threshold strategy advocate.',                      456,  189,  now() - interval '60 days'),
    (u6, 'Sarah_Collins_NYC',   'Sarah Collins',    'New York, NY. Researched diamonds for 6 months before buying. Now addicted to learning.',     1083, 445,  now() - interval '120 days'),
    (u7, 'Oliver_Hughes',       'Oliver Hughes',    'Manchester, UK. Love all gemstones but diamonds are the rabbit hole I fell into.',             731,  298,  now() - interval '75 days'),
    (u8, 'Ryan_Mitchell_LA',    'Ryan Mitchell',    'Los Angeles, CA. New here but learning fast. Lab diamond convert.',                            124,  67,   now() - interval '30 days'),
    (u9, 'Daniel_Foster',       'Daniel Foster',    'Seattle, WA. Gem enthusiast and value hunter. VS1 or don''t bother.',                        567,  234,  now() - interval '180 days')
  ON CONFLICT (id) DO NOTHING;

  -- ── 10 Posts (skip if already seeded — idempotency guard) ───

  IF EXISTS (
    SELECT 1 FROM public.posts
    WHERE community_id = comm
    AND title = 'My jeweler insisted I needed VVS2 clarity for a princess cut. 3 days of research later, here''s what I actually found.'
  ) THEN
    RAISE NOTICE 'Posts already seeded — skipping post insert.';
  ELSE

  INSERT INTO public.posts
    (id, community_id, author_id, title, body, type, score, upvotes, downvotes, comment_count, is_draft, is_deleted, is_pinned, created_at, updated_at)
  VALUES

  -- Post 1: Jessica_Miller_PDX — VVS vs VS1 upsell
  (p1, comm, u1,
   'My jeweler insisted I needed VVS2 clarity for a princess cut. 3 days of research later, here''s what I actually found.',
   E'So I walked into a local jeweler last week with a $3,000 budget for a 1ct princess cut.\n\nThe salesperson was polite. After 20 minutes I walked out feeling like I absolutely HAD to have VVS2 clarity or I''d be buying an "inferior" stone. She showed me a GIA 1ct G-VVS2 at $2,532. Beautiful. But something felt off.\n\nI spent 3 days actually learning about this. Here''s what I found:\n\n• VS1 is the CORRECT minimum for princess cuts — not VVS2\n• The reason: the "Corner Clarity Rule" — princess cuts have 90-degree corners that are structural weak points. VS1 inclusions are definitionally positioned away from corners on any GIA-certified stone.\n• VVS2 on a princess is paying for clarity your naked eye will never detect under any lighting condition\n• The GIA 1ct G-VS1 I found costs $2,536 — literally $4 more than the VVS2 she pushed\n\nKicker: the same store had a D-VVS1 they ''strongly recommended'' at $5,114. Stone only. No setting budget.\n\nI bought the G-VS1 at $2,536 from Blue Nile instead. Complete ring with platinum V-tip solitaire: $3,636. Under my $4K total budget.\n\nHas anyone else had jewelers push VVS specifically on princess cuts? Is this a known upsell pattern for this shape?',
   'text', 89, 94, 5, 3, false, false, false,
   now() - interval '5 days', now() - interval '5 days'),

  -- Post 2: Sophie_Laurent — GIA number trick
  (p2, comm, u2,
   'Local jeweler quoted $4,600 for a stone. I wrote down the GIA number. Found the exact same stone on Blue Nile for $3,200.',
   E'I want to share this because I almost paid $1,400 more for the identical diamond.\n\nMy strategy was to visit local stores and "feel" diamonds before buying online. Smart shopper move, right?\n\nAt store #3, the salesperson showed me a GIA 1ct G-VS1 princess. I asked to see the full paper certificate. She handed it over. I subtly photographed the GIA report number.\n\nPrice: $4,600 for the stone alone.\n\nThat night I searched the exact GIA number on Blue Nile. Same stone. $3,200.\n\nI called the local store the next day and asked directly: "Why is your price $1,400 more than Blue Nile for the same GIA certificate?"\n\nTheir answer: "We offer a relationship, lifetime cleaning and resizing, in-store expertise."\n\nMy math:\n• Price difference: $1,400\n• Cleaning: local jewelers clean for free as walk-ins; Blue Nile ships a cleaning kit\n• Blue Nile 30-day return: full refund if anything is wrong\n• $1,400 I keep: real money in my bank account\n\nBought online. Stone arrived in 3 days, GIA cert included digitally, perfectly packaged.\n\nHas anyone else tried the ''photograph the GIA number'' trick? What did you find at local stores vs online?',
   'text', 134, 142, 8, 3, false, false, false,
   now() - interval '4 days', now() - interval '4 days'),

  -- Post 3: EmmaWatts_UK — Corner chip warning
  (p3, comm, u3,
   'My princess cut diamond chipped at the corner after 8 months. $3,200 and an expensive lesson about V-tip prongs nobody told me about.',
   E'I need to share this so nobody makes the same mistake.\n\nBought a 1ct G-VS1 princess cut last August. Standard 4-prong solitaire, rounded tips. The jeweler picked the setting. I focused on the stone and didn''t ask about prong style.\n\n8 months of daily wear. Knocked the ring against a marble counter — not even hard, barely felt it. Looked down. Corner gone. Clean fracture.\n\nRepair quote: $650 to re-tip the corner. Stone integrity permanently affected.\n\nWhat the jeweler NEVER told me:\n\n• Princess cuts have 90-degree pointed corners — the most physically fragile part of the stone\n• The ONLY correct prong is a V-tip (or V-prong) that physically wraps around and covers each corner\n• Rounded prongs sit beside the corners but don''t protect them — the corner is exposed to impact\n• This is not an optional upgrade. It is structural.\n\nWhen I went back to the jeweler, their response: "Yes, V-tip prongs are better for princess cuts. Did you want to specify that originally?"\n\nI didn''t KNOW to ask. That is their responsibility to disclose.\n\nIf you are buying a princess cut right now: demand V-tip prongs. Not as an upgrade. As the baseline. Non-negotiable regardless of budget.\n\nHas anyone else had a corner chip? How did your jeweler handle it?',
   'text', 201, 218, 17, 3, false, false, false,
   now() - interval '3 days 14 hours', now() - interval '3 days 14 hours'),

  -- Post 4: Marcus_Webb — Lab vs natural side by side
  (p4, comm, u4,
   'I showed my girlfriend $4,000 of natural diamond vs $4,000 of lab diamond side by side. Her reaction surprised both of us.',
   E'We had a $4,000 stone budget. I wanted her to have a genuinely informed choice. So I arranged a proper side-by-side viewing at a store that carries both.\n\nNatural ($4,000 budget):\n• GIA 1ct G-VS2 round brilliant, 6.5mm face-up\n• GIA Excellent cut, no fluorescence\n• Price: $3,890\n\nLab ($4,000 budget):\n• IGI 2ct D-VVS1 round brilliant, 8.1mm face-up\n• IGI Excellent cut\n• Price: $2,810 — leaving $1,190 for a premium platinum setting\n\nThe size difference between 6.5mm and 8.1mm is not subtle. In a ring display, the lab stone is obviously larger.\n\nHer immediate reaction, unprompted: "That one." She pointed at the lab stone.\n\nThen the jeweler disclosed which was lab and which was natural.\n\nShe paused for a full 30 seconds.\n\nThen: "I think I still want the bigger one."\n\nWe talked seriously about it for a week. What changed her mind: resale math, not sentiment.\n\n• Natural 1ct resale: approximately $1,500–$1,950 (40–50 cents on the dollar)\n• Lab 2ct resale: approximately $280–$560 (10–20 cents on the dollar)\n\nWe bought the 1ct natural G-VS2 in platinum. Total ring: $5,180. She loves it. But she still mentions "that 2ct" occasionally.\n\nFor buyers who are appearance-first and won''t resell: lab is objectively more stone per dollar. That is just math.',
   'text', 178, 189, 11, 3, false, false, false,
   now() - interval '3 days 2 hours', now() - interval '3 days 2 hours'),

  -- Post 5: Jake_Anderson_DC — Sub-threshold trick
  (p5, comm, u5,
   'Bought 0.90ct instead of 1.00ct and saved $743. Six months later, nobody has noticed. Not even my fiancée.',
   E'My target was 1ct but the GIA 1ct G-VS2 round I wanted was $3,230. My stone budget was $2,600.\n\nA friend who works in the industry told me about the sub-threshold strategy.\n\nA 0.90ct round diamond measures 6.2mm face-up. A 1.00ct round measures 6.4mm face-up.\n\nThe difference: 0.2mm.\n\nThe human eye at arm''s length cannot detect 0.2mm. GIA lab instruments can. Your dinner guests cannot.\n\nI found a GIA 0.90ct G-VS2 at $2,487. The 1ct equivalent: $3,230. I saved $743.\n\nMy fiancée''s finger is a size 5. On her slim finger, the 0.90ct looks proportionally perfect — honestly better than 1ct might have looked.\n\n6 months of real-world results:\n• Her friends have seen the ring: no comments about size\n• Her mother has seen the ring: "gorgeous," "stunning"\n• Her coworkers: "the sparkle is incredible"\n• Comments about "is that a full carat": zero\n\nThe sub-threshold principle works at every magic-number weight:\n• 0.49ct vs 0.50ct · 0.74ct vs 0.75ct · 0.90ct vs 1ct · 1.49ct vs 1.50ct · 1.90ct vs 2ct\n\nThe price drops below each threshold. The face-up difference is invisible at conversational distance.\n\nSave the $743. Put it toward a platinum setting, a matching band, or anything else.',
   'text', 267, 281, 14, 3, false, false, false,
   now() - interval '2 days 18 hours', now() - interval '2 days 18 hours'),

  -- Post 6: Sarah_Collins_NYC — SI1 PSA
  (p6, comm, u6,
   'PSA: SI1 clarity on a princess cut is NOT the same risk as SI1 on a round brilliant. Most guides don''t explain why and people are paying for it.',
   E'I see this mistake constantly and need to address it directly.\n\nFor round brilliant diamonds: SI1 is often acceptable. The 57-facet pattern masks inclusions effectively. About 70% of SI1 rounds are genuinely eye-clean at 1ct.\n\nFor princess cut: SI1 is a completely different situation. Here is the physics:\n\nPrincess cuts have 90-degree corners — the most structurally vulnerable point of the stone. SI1 inclusions are defined as visible under 10x magnification, potentially approaching unaided visibility.\n\nWhen an SI1 inclusion sits at or near a corner:\n\n1. It can be visible under normal lighting in daily wear\n2. More critically: it is a structural fracture risk. The inclusion weakens the corner physically. A corner impact (countertop, steering wheel, doorframe) can fracture along the inclusion line.\n3. This is not theoretical — I know people in this community whose princess corners fractured at SI1 inclusion sites.\n\nThe Corner Clarity Rule for princess cuts:\n• VS1: always safe, no verification needed\n• VS2: acceptable ONLY with GIA plot confirming inclusions are centered in the table, away from all four corners\n• SI1: never. The dollar savings (~$400–$600 vs VS1 at 1ct) do not justify the structural and optical risk.\n\nTag anyone buying a princess cut who is considering SI1 to save money. They need to read this first.',
   'text', 312, 334, 22, 3, false, false, false,
   now() - interval '2 days 4 hours', now() - interval '2 days 4 hours'),

  -- Post 7: Sophie_Laurent — GIA vs IGI on lab
  (p7, comm, u2,
   'Paid $1,200 more for a GIA certificate on a lab-grown diamond vs IGI. Honest verdict 8 months later: I made the wrong call.',
   E'This question doesn''t get answered honestly anywhere, so here is my actual experience.\n\nFor NATURAL diamonds: GIA is the only certificate that matters. Full stop. IGI grades natural stones 1 GIA step softer — you pay G-VS1 price for a stone GIA would grade H-VS2. Non-negotiable for natural.\n\nFor LAB-GROWN diamonds: it is genuinely more complicated.\n\nI was choosing between:\n• IGI 2ct D-VVS1 lab round: $2,810\n• GIA 2ct D-VVS1 lab round: $4,010\n\nSame spec on paper. $1,200 difference. I bought GIA.\n\nHonest verdict 8 months later: it was not worth the extra $1,200.\n\nHere is why for lab specifically:\n\n• IGI''s lab-grown certification is MORE consistent than their natural stone grading — they built dedicated lab-specific standards\n• The physical stone is identical regardless of lab: same CVD process, same post-growth treatment\n• GIA lab certification was launched more recently and uses comparable methods\n• Resale value: lab diamonds resell at 10–20 cents on the dollar regardless of which lab certified them. GIA cert does not change the resale math for lab.\n• The $1,200 premium does not recover at resale.\n\nClean rule for almost every buying decision:\n• Natural diamond: GIA only\n• Lab-grown diamond: IGI is completely fine\n\nI wish I had kept the $1,200.',
   'text', 98, 105, 7, 3, false, false, false,
   now() - interval '1 day 20 hours', now() - interval '1 day 20 hours'),

  -- Post 8: Oliver_Hughes — 18-month ring review
  (p8, comm, u7,
   '18-month daily wear update: our 1ct princess cut engagement ring. What nobody tells you about long-term ownership.',
   E'18 months engaged. I wear this ring every single day — cooking, gym, office, sleep. Real daily wear, no careful storage.\n\nHere is what 18 months of honest use taught me.\n\nTHE GOOD:\n• The diamond itself looks identical to day one. Zero dulling, zero scratching — diamonds are Mohs 10, they don''t scratch.\n• Our V-tip prongs have protected all four corners perfectly. No chip, no mark.\n• The brilliance in office LED lighting is still spectacular. Princess chevron facets create a unique cross-fire pattern I''ve genuinely grown to love over rounds.\n\nTHE NOT-AS-GOOD:\n• 14K white gold band has developed fine surface scratches visible in direct light — normal and expected for any gold setting.\n• One prong developed slight roughness at 12 months that caught on knitwear. Got it inspected and smoothed at no charge.\n• Inside of band accumulates lotion/soap buildup. Needs cleaning every 2–3 weeks to look pristine.\n\nWHAT I WISH SOMEONE HAD TOLD ME:\n• Schedule a prong inspection every 6–12 months even when everything looks fine. Prong metal work-hardens from daily flex. Catching a hairline crack before it fails saves the stone.\n• Clean weekly: warm water, dish soap, soft toothbrush. Takes 2 minutes. Non-optional for consistent sparkle.\n• Princess corners trap more lint than round stones — minor but real if you skip cleaning.\n\nOverall: The stone needs almost zero maintenance. The setting is what needs your attention.\n\nHappy to answer specific questions.',
   'text', 143, 151, 8, 3, false, false, false,
   now() - interval '1 day 6 hours', now() - interval '1 day 6 hours'),

  -- Post 9: Daniel_Foster — Under $3K princess vs round
  (p9, comm, u9,
   'Under $3,000: princess cut gives you the full GIA 1ct market. Round brilliant is completely locked out. The numbers genuinely shocked me.',
   E'I was shopping for a round brilliant under $3,000 and kept hitting a wall. A friend suggested princess cut. I was skeptical. Then I ran the actual numbers.\n\nWhat $3,000 buys in ROUND BRILLIANT:\n• GIA 1ct G-VS2 round: $3,230 — above the $3,000 ceiling\n• Best round under $3K: approximately 0.90ct G-VS2 at ~$2,600\n• The full GIA 1ct round market: unavailable under $3,000\n\nWhat $3,000 buys in PRINCESS CUT:\n• GIA 1ct F-VS2 entry: $2,141\n• GIA 1ct G-VS2 entry: $2,212\n• GIA 1ct G-VS1 (recommended minimum): $2,536\n• GIA 1ct E-VS1: $2,721\n• GIA 1ct F-VS1 (top of market under $3K): $2,737\n• 27 GIA Ideal Cut 1ct princess stones, ALL under $3,000\n\nFace-up comparison:\n• 1ct princess: 5.5 × 5.5mm square\n• 1ct round: 6.5mm diameter (10% more face-up area)\n\nThe real choice at $3K: 1ct princess at 5.5mm, or 0.90ct round at 6.2mm?\n• The round is slightly larger face-up even at 0.90ct\n• The princess is a full GIA-certified 1ct in your choice of grade\n• Budget remaining after the princess stone for a quality setting\n\nI went princess. GIA 1ct G-VS1 at $2,536, platinum V-tip solitaire at $1,100. Complete ring: $3,636. Within a $4K total budget.\n\nWhat would you choose at this budget level?',
   'text', 223, 237, 14, 3, false, false, false,
   now() - interval '14 hours', now() - interval '14 hours'),

  -- Post 10: Ryan_Mitchell_LA — G vs H color test
  (p10, comm, u8,
   'I held G and H color diamonds side by side in a white gold setting for 30 minutes. Honest verdict on the $480 color question.',
   E'There is so much conflicting advice about G vs H color that I decided to go see it for myself.\n\nA local jeweler let me spend real time examining two stones side by side:\n\n• 1ct G-VS2 round brilliant in white gold — GIA Excellent cut\n• 1ct H-VS2 round brilliant in white gold — GIA Excellent cut\n\nSame carat, same cut, same clarity. Price difference: $480.\n\nI tested both under real conditions for 30 minutes:\n\nUnder store LED lighting: Identical. Could not tell which was which.\n\nIn north-facing window light (most revealing for color): I thought I detected faint warmth in one stone. Guessed correctly 3 times out of 5. That is 60% — barely above random chance (50%).\n\nIn the white gold prong head only, no finger: Identical in every attempt.\n\nConclusion:\n\nIn white gold, G and H are visually indistinguishable in real-world conditions. The H showed zero detectable warmth when mounted.\n\nWhat $480 actually buys:\n• In yellow gold: absolutely nothing. H is invisible in yellow gold. So is I color.\n• In white gold: a "G" on the GIA certificate. That is the entire difference.\n• In platinum: same as white gold — no visible advantage.\n\nI bought H-VS2. My fiancée has worn it for 4 months. Her friends, her mother, her coworkers: zero comments about color. The ring is stunning.\n\nIf $480 genuinely doesn''t matter to you: buy G for peace of mind. If it matters at all: buy H in white gold and spend the $480 on a better setting or a matching band.',
   'text', 189, 200, 11, 3, false, false, false,
   now() - interval '8 hours', now() - interval '8 hours');

  END IF; -- end idempotency guard

  -- ── 30 Comments ──────────────────────────────────────────────

  INSERT INTO public.comments
    (id, post_id, author_id, body, score, upvotes, downvotes, is_deleted, created_at)
  VALUES

  -- Post 1 (VVS vs VS1 princess)
  (c1a, p1, u2,
   'This happened to me almost word for word. Got quoted VVS2 at $4,200 on a 1.2ct princess. Spent two days on this sub, learned the Corner Clarity Rule, realized VS1 was the correct target, saved over $800. The insight nobody explains in-store: VS1 on a GIA cert means corner-safe by definition. You don''t have to verify the plot.',
   34, 36, 2, false, now() - interval '4 days 21 hours'),
  (c1b, p1, u4,
   'I work adjacent to the trade. The VVS push on princess cuts is a systematic pattern. The logic: VVS sells at a meaningful premium AND it can be framed as "we only recommend the best for this delicate shape." VS1 is harder to argue against because it IS the correct answer. The $4 gap between the VVS2 and VS1 you found is not unusual — you saved nothing in stone quality and nothing in visual outcome.',
   28, 29, 1, false, now() - interval '4 days 18 hours'),
  (c1c, p1, u6,
   'Worth adding: VVS2 and VS1 are visually identical to any human eye including a trained gemologist looking at a mounted stone in a ring. The only context where VVS matters is under 10x loupe magnification during grading. When was the last time your family examined your ring under a loupe? Buy VS1. Done.',
   19, 20, 1, false, now() - interval '4 days 12 hours'),

  -- Post 2 (Blue Nile vs local)
  (c2a, p2, u1,
   'Ran this same experiment. Found GIA 1ct G-VS1 locally at $4,800. Exact same GIA number on James Allen: $3,100. When I pointed this out the salesperson became visibly uncomfortable and pivoted to "certified gemologists on staff." I bought online. The $1,700 difference covered our rehearsal dinner.',
   41, 43, 2, false, now() - interval '3 days 22 hours'),
  (c2b, p2, u3,
   'Fair counterpoint: local stores carry real overhead — staff, rent, insurance, inventory. That $1,400 is going somewhere real. For first-time buyers who want someone to physically walk them through GIA report reading and prong selection, the local experience has genuine value. For buyers who are comfortable with certificates and return policies, the math doesn''t support it.',
   15, 18, 3, false, now() - interval '3 days 20 hours'),
  (c2c, p2, u9,
   'The GIA number trick works because GIA is a third-party certifier, not a retailer. The same stone can list on multiple platforms simultaneously. If you''re shopping in person: always ask to see the paper GIA report, photograph the certificate number, and check Blue Nile and James Allen before committing. You may find the identical stone for significantly less.',
   32, 33, 1, false, now() - interval '3 days 16 hours'),

  -- Post 3 (corner chip)
  (c3a, p3, u1,
   'I am so sorry this happened. V-tip prongs are not an optional upgrade — they are the only structurally correct setting for a princess cut. A rounded prong sits beside a corner; a V-tip wraps around it. These protect entirely differently. Every jeweler who sets a princess in rounded prongs without disclosing this is failing their customer at the most important point of the purchase.',
   67, 72, 5, false, now() - interval '3 days 10 hours'),
  (c3b, p3, u7,
   'How did the repair turn out? Is the stone structurally compromised or just aesthetically chipped? I''ve read that re-tipping can restore the corner profile, but if the fracture runs deep enough it affects the corner facet angles permanently and shows as a distortion in the stone.',
   22, 23, 1, false, now() - interval '3 days 8 hours'),
  (c3c, p3, u5,
   'For anyone reading this who hasn''t bought yet: look at your setting photos before finalising. V-tip prongs appear as small "V" shapes at each corner — not round dots. If you see round prong dots at a princess diamond corner, ask specifically for V-tip. If they don''t carry it in your chosen style, find a different setting. There is no acceptable alternative for princess cut corners.',
   48, 51, 3, false, now() - interval '3 days 6 hours'),

  -- Post 4 (lab vs natural)
  (c4a, p4, u3,
   'The resale calculation is what actually converts most natural-leaning buyers in my experience. Lab resale at 10–20 cents means a $3,000 lab stone returns roughly $300–600 if you ever need to sell. Natural round at the same budget returns $1,200–1,500. Neither is a good investment, but the gap is significant if circumstances change.',
   29, 31, 2, false, now() - interval '2 days 22 hours'),
  (c4b, p4, u1,
   'The "natural is more meaningful" sentiment is real and valid for many buyers. But for people under 35 I see it weakening. GIA literally cannot distinguish lab from natural without advanced spectroscopy. The physical and chemical properties are identical. The meaning is in the relationship, not in the geological formation process of a carbon crystal.',
   38, 42, 4, false, now() - interval '2 days 18 hours'),
  (c4c, p4, u8,
   'The 2ct vs 1ct visual side by side is a gut check. 8.1mm vs 6.5mm is not subtle in a ring display or on a hand. If you have a $4K budget and your priority is face-up size, the lab math is genuinely hard to argue against. I went lab for exactly this reason and have zero regrets six months in.',
   24, 25, 1, false, now() - interval '2 days 14 hours'),

  -- Post 5 (sub-threshold trick)
  (c5a, p5, u4,
   'The sub-threshold principle works cleanly at every magic-number weight. At 1.5ct, buying 1.49ct saves approximately $900 for zero visible face-up difference. At 2ct, buying 1.90ct saves roughly $2,000. The face-up differences are all sub-0.2mm — unmeasurable by eye in a ring at arm''s length.',
   31, 33, 2, false, now() - interval '2 days 14 hours'),
  (c5b, p5, u3,
   'Did the same with 0.74ct vs 0.75ct on my engagement ring. Saved £180. Literally zero visible difference — both are 5.0mm face-up. The jeweler I bought from confirmed they regularly sell sub-threshold stones because informed buyers specifically request them.',
   26, 27, 1, false, now() - interval '2 days 10 hours'),
  (c5c, p5, u6,
   'One clarification for new readers: sub-threshold means buying a stone that physically weighs 0.90ct — not buying a 1ct stone "as" 0.90ct. Diamonds are weighed to exact carat on the GIA certificate. You are selecting a stone that happens to weigh just under a pricing threshold, which is entirely legitimate and smart.',
   18, 19, 1, false, now() - interval '2 days 6 hours'),

  -- Post 6 (SI1 on princess cut PSA)
  (c6a, p6, u2,
   'Cannot upvote this enough. A friend bought SI1 princess 1ct and I can see an inclusion at the lower right corner with my naked eye at 6 inches under good LED. The store said "eye-clean." It is not. SI1 on princess is both an optical risk AND a structural risk — the inclusion sits at the most physically vulnerable point of the shape.',
   54, 58, 4, false, now() - interval '1 day 22 hours'),
  (c6b, p6, u5,
   'The structural fracture point is what most articles miss entirely. It is not only about whether you can see the inclusion aesthetically. A feather-type SI1 inclusion at a princess corner is a fracture waiting to happen on any moderate impact. The aesthetic risk and the structural risk are separate concerns, and both are real.',
   41, 43, 2, false, now() - interval '1 day 20 hours'),
  (c6c, p6, u9,
   'SI1 is sometimes marketed as "eye-clean for rounds, therefore fine for princess." The reason this logic fails: round brilliant''s 57-facet geometry disperses inclusions optically across multiple facets. Princess cut''s chevron pattern does NOT diffuse inclusions the same way — they concentrate visually at corners and remain structurally risky at corner locations.',
   37, 39, 2, false, now() - interval '1 day 18 hours'),

  -- Post 7 (GIA vs IGI on lab)
  (c7a, p7, u1,
   'This matches everything I researched. For lab stones specifically, IGI''s certification is more consistent than their natural grading — they built dedicated lab-specific standards and instruments. The GIA premium on a lab diamond is for the name recognition, not for meaningfully better stone evaluation. Save the $1,200.',
   22, 23, 1, false, now() - interval '1 day 16 hours'),
  (c7b, p7, u4,
   'The one marginal counterpoint: if you resell a lab diamond (you''ll get 10–20 cents regardless), a GIA cert might help with secondhand buyers who don''t understand lab nuances but trust the GIA name. In practice the resale premium for GIA vs IGI on a lab stone is small. The $1,200 does not recover. IGI is the correct choice for lab.',
   17, 18, 1, false, now() - interval '1 day 14 hours'),
  (c7c, p7, u3,
   'Simple rule that covers 95% of buying decisions: GIA only for natural diamonds. IGI completely acceptable for lab-grown. Everything else is noise.',
   29, 30, 1, false, now() - interval '1 day 12 hours'),

  -- Post 8 (18-month ring review)
  (c8a, p8, u4,
   'The 6–12 month prong inspection is critical and under-discussed in every buying guide. Prong metal work-hardens from the constant small stresses of daily wear. An inspection catches a developing crack before it fails — once a prong actually cracks, the stone can loosen or come out entirely. A £40 check-up protects a £3,000 stone. Make it a calendar habit.',
   33, 35, 2, false, now() - interval '22 hours'),
  (c8b, p8, u1,
   'The lint-at-corners observation is accurate and completely underrated. Princess 90-degree corners accumulate debris differently than rounded stones. Weekly cleaning with warm soapy water and a soft brush takes under 2 minutes. I set a phone reminder every Sunday. The sparkle difference between cleaned and uncleaned is genuinely noticeable.',
   19, 20, 1, false, now() - interval '20 hours'),
  (c8c, p8, u5,
   'Quick question on this: have you needed rhodium replating on the 14K white gold band? I''ve read that white gold naturally yellows as the rhodium plating wears off — typically needs replating every 1–2 years. Has that come up for you yet at 18 months?',
   12, 12, 0, false, now() - interval '18 hours'),

  -- Post 9 (under $3K princess vs round)
  (c9a, p9, u2,
   'This math is exactly why princess cut at the $2,500–$3,000 budget level is so underrated. 27 GIA 1ct princess stones available vs zero GIA 1ct rounds under $3,000 is a decisive structural market advantage. The 1mm face-up difference is real but you are comparing a full certified 1ct stone to a sub-1ct alternative.',
   44, 46, 2, false, now() - interval '10 hours'),
  (c9b, p9, u3,
   'The face-up comparison is closer than it sounds. 1ct princess at 5.5mm vs 0.90ct round at 6.2mm — the round is actually slightly larger face-up because of circular geometry even at lower carat. But many buyers weight the "1ct" certification number heavily, and the princess delivers that within the budget.',
   27, 28, 1, false, now() - interval '8 hours'),
  (c9c, p9, u1,
   'Went this exact path. GIA 1ct G-VS1 princess at $2,536. Platinum V-tip solitaire at $1,100. Total ring $3,636, within a $4K budget. Nobody looks at my fiancée''s ring and thinks "that''s a compromise shape." They see a stunning square diamond that catches every light source in the room.',
   36, 38, 2, false, now() - interval '6 hours'),

  -- Post 10 (G vs H color test)
  (c10a, p10, u4,
   '3 out of 5 correct guesses at 60% is just barely above random chance (50%). Functionally: you cannot reliably distinguish G from H in a white gold setting in real conditions. The $480 buys a letter on a certificate, not a visible property. The certificate matters for resale reference. The visual difference does not exist in practice.',
   28, 29, 1, false, now() - interval '5 hours'),
  (c10b, p10, u2,
   'The yellow gold point deserves more emphasis than it gets. In yellow gold, H color and even I color are completely masked by the warm metal reflection. Buying G for a yellow gold ring is genuinely wasted money — H or I is the correct choice and the visual result is beautiful. The colour premium only has any justification in white metal settings.',
   22, 23, 1, false, now() - interval '4 hours'),
  (c10c, p10, u9,
   'Counterpoint worth considering: for a ring someone plans to wear every day for decades, the psychological comfort of hitting the G standard has real value for some buyers. That is not irrational — it is a personal preference. If the $480 does not stress the budget: buy G. If it matters at all to you financially: H in white gold is genuinely beautiful and no one will ever see the difference.',
   15, 16, 1, false, now() - interval '2 hours');

  -- ── Post votes ─────────────────────────────────────────────────

  INSERT INTO public.post_votes (post_id, user_id, vote, created_at)
  VALUES
    (p1, u2, 1, now() - interval '4 days 22 hours'),
    (p1, u3, 1, now() - interval '4 days 20 hours'),
    (p1, u4, 1, now() - interval '4 days 18 hours'),
    (p1, u5, 1, now() - interval '4 days 15 hours'),
    (p1, u6, 1, now() - interval '4 days 12 hours'),
    (p1, u7, 1, now() - interval '4 days 10 hours'),
    (p1, u9, 1, now() - interval '4 days 8 hours'),

    (p2, u1, 1, now() - interval '3 days 22 hours'),
    (p2, u3, 1, now() - interval '3 days 20 hours'),
    (p2, u4, 1, now() - interval '3 days 18 hours'),
    (p2, u5, 1, now() - interval '3 days 15 hours'),
    (p2, u7, 1, now() - interval '3 days 12 hours'),
    (p2, u8, 1, now() - interval '3 days 10 hours'),
    (p2, u9, 1, now() - interval '3 days 8 hours'),
    (p2, u6, -1, now() - interval '3 days 6 hours'),

    (p3, u1, 1, now() - interval '3 days 10 hours'),
    (p3, u2, 1, now() - interval '3 days 8 hours'),
    (p3, u4, 1, now() - interval '3 days 6 hours'),
    (p3, u5, 1, now() - interval '3 days 4 hours'),
    (p3, u6, 1, now() - interval '3 days 2 hours'),
    (p3, u7, 1, now() - interval '3 days 1 hour'),
    (p3, u8, 1, now() - interval '3 days'),
    (p3, u9, 1, now() - interval '2 days 22 hours'),

    (p4, u1, 1, now() - interval '2 days 22 hours'),
    (p4, u2, 1, now() - interval '2 days 20 hours'),
    (p4, u3, 1, now() - interval '2 days 18 hours'),
    (p4, u5, 1, now() - interval '2 days 15 hours'),
    (p4, u6, 1, now() - interval '2 days 12 hours'),
    (p4, u7, 1, now() - interval '2 days 10 hours'),
    (p4, u9, 1, now() - interval '2 days 8 hours'),

    (p5, u1, 1, now() - interval '2 days 14 hours'),
    (p5, u2, 1, now() - interval '2 days 12 hours'),
    (p5, u3, 1, now() - interval '2 days 10 hours'),
    (p5, u4, 1, now() - interval '2 days 8 hours'),
    (p5, u6, 1, now() - interval '2 days 6 hours'),
    (p5, u7, 1, now() - interval '2 days 4 hours'),
    (p5, u9, 1, now() - interval '2 days 2 hours'),

    (p6, u2, 1, now() - interval '1 day 22 hours'),
    (p6, u3, 1, now() - interval '1 day 20 hours'),
    (p6, u4, 1, now() - interval '1 day 18 hours'),
    (p6, u5, 1, now() - interval '1 day 16 hours'),
    (p6, u7, 1, now() - interval '1 day 14 hours'),
    (p6, u8, 1, now() - interval '1 day 12 hours'),
    (p6, u9, 1, now() - interval '1 day 10 hours'),

    (p7, u1, 1, now() - interval '1 day 18 hours'),
    (p7, u3, 1, now() - interval '1 day 16 hours'),
    (p7, u4, 1, now() - interval '1 day 14 hours'),
    (p7, u5, 1, now() - interval '1 day 12 hours'),
    (p7, u6, 1, now() - interval '1 day 10 hours'),
    (p7, u8, 1, now() - interval '1 day 8 hours'),
    (p7, u9, 1, now() - interval '1 day 6 hours'),

    (p8, u1, 1, now() - interval '1 day 4 hours'),
    (p8, u2, 1, now() - interval '1 day 2 hours'),
    (p8, u4, 1, now() - interval '23 hours'),
    (p8, u5, 1, now() - interval '22 hours'),
    (p8, u6, 1, now() - interval '21 hours'),
    (p8, u8, 1, now() - interval '20 hours'),
    (p8, u9, 1, now() - interval '19 hours'),

    (p9, u1, 1, now() - interval '12 hours'),
    (p9, u2, 1, now() - interval '11 hours'),
    (p9, u3, 1, now() - interval '10 hours'),
    (p9, u5, 1, now() - interval '9 hours'),
    (p9, u6, 1, now() - interval '8 hours'),
    (p9, u7, 1, now() - interval '7 hours'),
    (p9, u8, 1, now() - interval '6 hours'),

    (p10, u1, 1, now() - interval '7 hours'),
    (p10, u2, 1, now() - interval '6 hours'),
    (p10, u3, 1, now() - interval '5 hours'),
    (p10, u4, 1, now() - interval '4 hours'),
    (p10, u5, 1, now() - interval '3 hours 30 minutes'),
    (p10, u7, 1, now() - interval '3 hours'),
    (p10, u9, 1, now() - interval '2 hours 30 minutes')
  ON CONFLICT DO NOTHING;

  -- ── Comment votes ──────────────────────────────────────────────

  INSERT INTO public.comment_votes (comment_id, user_id, vote)
  VALUES
    (c1a, u3, 1), (c1a, u4, 1), (c1a, u5, 1), (c1a, u9, 1),
    (c1b, u1, 1), (c1b, u3, 1), (c1b, u5, 1),
    (c1c, u1, 1), (c1c, u2, 1), (c1c, u4, 1),

    (c2a, u2, 1), (c2a, u3, 1), (c2a, u4, 1), (c2a, u7, 1),
    (c2b, u1, 1), (c2b, u4, 1), (c2b, u6, -1),
    (c2c, u1, 1), (c2c, u2, 1), (c2c, u3, 1),

    (c3a, u2, 1), (c3a, u3, 1), (c3a, u5, 1), (c3a, u6, 1),
    (c3b, u1, 1), (c3b, u4, 1),
    (c3c, u1, 1), (c3c, u3, 1), (c3c, u4, 1),

    (c4a, u1, 1), (c4a, u2, 1), (c4a, u5, 1),
    (c4b, u2, 1), (c4b, u4, 1), (c4b, u5, 1), (c4b, u8, 1),
    (c4c, u1, 1), (c4c, u3, 1), (c4c, u4, 1),

    (c5a, u1, 1), (c5a, u2, 1), (c5a, u3, 1),
    (c5b, u1, 1), (c5b, u4, 1), (c5b, u6, 1),
    (c5c, u2, 1), (c5c, u3, 1), (c5c, u4, 1),

    (c6a, u1, 1), (c6a, u3, 1), (c6a, u4, 1), (c6a, u7, 1),
    (c6b, u2, 1), (c6b, u3, 1), (c6b, u4, 1),
    (c6c, u1, 1), (c6c, u2, 1), (c6c, u4, 1),

    (c7a, u2, 1), (c7a, u4, 1), (c7a, u5, 1),
    (c7b, u1, 1), (c7b, u3, 1), (c7b, u5, 1),
    (c7c, u1, 1), (c7c, u2, 1), (c7c, u5, 1),

    (c8a, u1, 1), (c8a, u2, 1), (c8a, u3, 1),
    (c8b, u2, 1), (c8b, u4, 1), (c8b, u6, 1),
    (c8c, u4, 1), (c8c, u3, 1),

    (c9a, u1, 1), (c9a, u3, 1), (c9a, u4, 1),
    (c9b, u1, 1), (c9b, u2, 1), (c9b, u5, 1),
    (c9c, u2, 1), (c9c, u4, 1), (c9c, u6, 1),

    (c10a, u1, 1), (c10a, u3, 1), (c10a, u5, 1),
    (c10b, u1, 1), (c10b, u3, 1), (c10b, u4, 1),
    (c10c, u1, 1), (c10c, u2, 1), (c10c, u4, 1)
  ON CONFLICT DO NOTHING;

  -- ── Update comment_count on posts ──────────────────────────────
  UPDATE public.posts SET
    comment_count = (
      SELECT COUNT(*) FROM public.comments
      WHERE post_id = posts.id AND is_deleted = false
    )
  WHERE id IN (p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);

END $$;
