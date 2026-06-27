-- ============================================================
-- DiamondCritics Community — 10 Fresh Engaging Posts + 9 Users
-- Paste into: Supabase Dashboard → SQL Editor → New Query
-- Deletes existing community posts first, then re-seeds clean.
-- ============================================================

ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false;

DO $$
DECLARE
  u1 UUID;  -- Jessica_Miller_PDX   auburndazzle@gmail.com
  u2 UUID;  -- Sophie_Laurent       farzanatoma111@gmail.com
  u3 UUID;  -- EmmaWatts_UK         farzanatoma001@gmail.com
  u4 UUID;  -- Marcus_Webb          ironsidesgroup@gmail.com
  u5 UUID;  -- Jake_Anderson_DC     mehedihasan.linkedin@gmail.com
  u6 UUID;  -- Sarah_Collins_NYC    mh6222134567@gmail.com
  u7 UUID;  -- Oliver_Hughes        eh744713@gmail.com
  u8 UUID;  -- Ryan_Mitchell_LA     mh62221345@gmail.com
  u9 UUID;  -- Daniel_Foster        seo.ravi.agency@gmail.com

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

  -- Users (skip if already exist)
  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'auburndazzle@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '210 days', now(), '{"username":"Jessica_Miller_PDX"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'auburndazzle@gmail.com');
  SELECT id INTO u1 FROM auth.users WHERE email = 'auburndazzle@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'farzanatoma111@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '90 days', now(), '{"username":"Sophie_Laurent"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'farzanatoma111@gmail.com');
  SELECT id INTO u2 FROM auth.users WHERE email = 'farzanatoma111@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'farzanatoma001@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '45 days', now(), '{"username":"EmmaWatts_UK"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'farzanatoma001@gmail.com');
  SELECT id INTO u3 FROM auth.users WHERE email = 'farzanatoma001@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'ironsidesgroup@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '150 days', now(), '{"username":"Marcus_Webb"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ironsidesgroup@gmail.com');
  SELECT id INTO u4 FROM auth.users WHERE email = 'ironsidesgroup@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'mehedihasan.linkedin@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '60 days', now(), '{"username":"Jake_Anderson_DC"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mehedihasan.linkedin@gmail.com');
  SELECT id INTO u5 FROM auth.users WHERE email = 'mehedihasan.linkedin@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'mh6222134567@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '120 days', now(), '{"username":"Sarah_Collins_NYC"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mh6222134567@gmail.com');
  SELECT id INTO u6 FROM auth.users WHERE email = 'mh6222134567@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'eh744713@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '75 days', now(), '{"username":"Oliver_Hughes"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'eh744713@gmail.com');
  SELECT id INTO u7 FROM auth.users WHERE email = 'eh744713@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'mh62221345@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '30 days', now(), '{"username":"Ryan_Mitchell_LA"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mh62221345@gmail.com');
  SELECT id INTO u8 FROM auth.users WHERE email = 'mh62221345@gmail.com';

  INSERT INTO auth.users (id, email, email_confirmed_at, aud, role, created_at, updated_at, raw_user_meta_data, raw_app_meta_data)
  SELECT gen_random_uuid(), 'seo.ravi.agency@gmail.com', now(), 'authenticated', 'authenticated',
         now() - interval '180 days', now(), '{"username":"Daniel_Foster"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'seo.ravi.agency@gmail.com');
  SELECT id INTO u9 FROM auth.users WHERE email = 'seo.ravi.agency@gmail.com';

  -- Profiles
  INSERT INTO public.profiles (id, username, display_name, bio, post_karma, comment_karma, created_at)
  VALUES
    (u1, 'Jessica_Miller_PDX',  'Jessica Miller',  'Portland, OR. GIA verified. Princess cut obsessed. Sharing so others don''t overpay.',      2341, 891,  now() - interval '210 days'),
    (u2, 'Sophie_Laurent',      'Sophie Laurent',  'Paris → NYC. Bought 3 rings in 3 years. Expert by necessity.',                               1204, 537,  now() - interval '90 days'),
    (u3, 'EmmaWatts_UK',        'Emma Watts',      'London, UK. 18 months daily wear testing. Honest reviews only.',                              678,  312,  now() - interval '45 days'),
    (u4, 'Marcus_Webb',         'Marcus Webb',     'Chicago, IL. Adjacent to the trade. Former retail, sharing industry truths.',                 3892, 1204, now() - interval '150 days'),
    (u5, 'Jake_Anderson_DC',    'Jake Anderson',   'Washington DC. Budget-conscious buyer. Sub-threshold strategy advocate.',                     456,  189,  now() - interval '60 days'),
    (u6, 'Sarah_Collins_NYC',   'Sarah Collins',   'New York, NY. Researched diamonds for 6 months before buying. Now addicted to learning.',    1083, 445,  now() - interval '120 days'),
    (u7, 'Oliver_Hughes',       'Oliver Hughes',   'Manchester, UK. Love all gemstones but diamonds are the rabbit hole I fell into.',            731,  298,  now() - interval '75 days'),
    (u8, 'Ryan_Mitchell_LA',    'Ryan Mitchell',   'Los Angeles, CA. New here but learning fast. Lab diamond convert.',                           124,  67,   now() - interval '30 days'),
    (u9, 'Daniel_Foster',       'Daniel Foster',   'Seattle, WA. Gem enthusiast and value hunter. VS1 or don''t bother.',                       567,  234,  now() - interval '180 days')
  ON CONFLICT (id) DO NOTHING;

  -- Delete existing posts so we start completely clean
  DELETE FROM public.posts WHERE community_id = comm;

  -- ── 10 Posts ────────────────────────────────────────────────

  INSERT INTO public.posts
    (id, community_id, author_id, title, body, type, score, upvotes, downvotes, comment_count, is_draft, is_deleted, is_pinned, created_at, updated_at)
  VALUES

  -- Post 1: EmmaWatts_UK — returned the ring
  (p1, comm, u3,
   'I returned a $6,800 ring 27 days after my fiancé proposed. Here is exactly what happened and why I have no regrets.',
   E'My fiancé proposed with a 1.5ct round G-VS1 in a platinum solitaire. It was stunning. He spent months researching and I was genuinely moved.\n\nBut three weeks later I started noticing something under certain lighting. A milky, haziness. Not in every light — but in diffuse daylight through a window, the stone looked flat. Dead.\n\nI brought it to a different jeweler for a casual inspection. She put it under a UV light without me asking.\n\nStrong blue fluorescence. Medium-strong, actually.\n\nThe stone was never disclosed as having fluorescence when purchased. It was not on the original receipt. The online listing my fiancé used said "None" for fluorescence. But this stone was clearly strong blue under UV.\n\nWe contacted the retailer. They apologised and confirmed it was a listing error. They offered a $200 credit.\n\nWe returned the ring on day 27 of a 30-day return window.\n\nHere is what we learned and what we bought instead:\n\n• Always filter for None or Faint fluorescence on round brilliants — Strong blue can make a D-H color stone look oily in diffuse natural light.\n• The listing error was not malicious but it cost us a month of uncertainty about a purchase that is supposed to feel perfect.\n• We bought a GIA 1.5ct G-VS1, fluorescence: None, from a different retailer. $6,420. The stone is brilliant in every light condition.\n\nIf something looks off about your diamond in window light: trust your eye. That is the most honest light your stone will ever be in.',
   'text', 247, 263, 16, 3, false, false, false,
   now() - interval '6 days', now() - interval '6 days'),

  -- Post 2: Marcus_Webb — retailer comparison
  (p2, comm, u4,
   'I ordered the same GIA stone from Blue Nile, James Allen, and Whiteflash to compare the experience. The differences were not what I expected.',
   E'Background: I work adjacent to the diamond trade and wanted to do an honest consumer-side comparison of the three major online retailers. I used store credits and returned two of the three stones within the return window. Here is what I found.\n\nThe stone: GIA 1ct G-VS1 round, Excellent cut, no fluorescence. I found what appeared to be equivalent stones (similar proportions, same grade) at all three.\n\nBLUE NILE\n• Price: $5,210\n• Packaging: elegant, secure, arrived in 3 days\n• Certificate: GIA report included digitally and as paper copy\n• Customer service: responsive, knowledgeable by chat\n• Stone quality: good. Proportions in the acceptable Excellent range.\n• Verdict: reliable, competitive pricing, good for buyers who know what they want\n\nJAMES ALLEN\n• Price: $5,480 (same spec)\n• 360-degree video: genuinely useful — I could see the actual stone I was buying, not a stock photo\n• Certificate: GIA digital only (paper available on request)\n• Customer service: 24/7 chat, responded in under 2 minutes\n• Stone quality: the video revealed a slight tilt in the table — not on the certificate, visible on video. I would not have caught this without the 360 view.\n• Verdict: the video technology is a real differentiator. Worth the slight premium to actually see your stone.\n\nWHITEFLASH\n• Price: $5,890 for their A-CUT-ABOVE® branded stone\n• Hearts & Arrows: genuine H&A pattern, verified with their ASET scope images\n• Light performance: measurably better than the other two in side-by-side\n• Customer service: a human called me within an hour of my inquiry. Not a chat bot.\n• Verdict: the best stone. Also the most expensive. If light performance is your priority and budget allows: Whiteflash.\n\nFor most buyers: Blue Nile for price confidence, James Allen if you want to see the actual stone first, Whiteflash if you want the best cut execution regardless of price.',
   'text', 312, 331, 19, 3, false, false, false,
   now() - interval '5 days', now() - interval '5 days'),

  -- Post 3: Jessica_Miller_PDX — newspaper test failure
  (p3, comm, u1,
   'My 1ct round brilliant failed the newspaper test 4 months after buying. Here is what I learned about cut quality that the GIA certificate does not tell you.',
   E'The newspaper test: place the diamond face-down on newspaper text. If you can read the text through the stone, the cut is too deep or the light return is poor.\n\nI did this casually four months after buying. I could read the text. Clearly.\n\nMy stone: GIA 1ct G-VS2, cut grade: Excellent. On paper, this is a well-cut stone.\n\nHere is the problem: GIA Excellent covers a range. The acceptable Excellent range for depth is 59–62.3%. My stone was 62.1% — technically Excellent, physically at the deep end of the range where light leakage through the pavilion begins.\n\nWhat the certificate says vs what matters:\n\nGIA grades: Excellent, Very Good, Good, Fair, Poor.\n\nWhat the certificate does NOT tell you:\n• Table %: should be 53–58% for maximum fire\n• Crown angle: should be 34–35° for optimal light return\n• Pavilion angle: should be 40.6–41° — this is the single most important number\n• Crown height: 15–17% is ideal\n\nMy stone: pavilion angle 41.6°. That is the cause of the newspaper test result. Light that should reflect back through the table is leaking out the bottom.\n\nWhat I do differently now:\n• I filter by pavilion angle 40.6–41.0° before looking at anything else\n• I use Holloway Cut Adviser (free online tool) to score any stone before buying\n• GIA Excellent is a minimum bar, not a guarantee of performance\n\nIf you are shopping right now: request the full proportion data beyond what the basic certificate shows. A 0.4° pavilion angle difference is invisible on paper and visible in your ring.',
   'text', 189, 201, 12, 3, false, false, false,
   now() - interval '4 days 8 hours', now() - interval '4 days 8 hours'),

  -- Post 4: Daniel_Foster — ideal cut myth
  (p4, comm, u9,
   'I asked 6 different jewelers what "ideal cut" means. I got 6 different answers. Here is what it actually means.',
   E'I spent two weeks shopping in-store before buying online. I asked every jeweler the same question: "What does ideal cut mean?"\n\nAnswer 1 (chain store): "It means GIA Excellent grade — the highest cut quality GIA certifies."\n\nAnswer 2 (independent jeweler): "It''s a marketing term. Different retailers define it differently. There is no universal standard."\n\nAnswer 3 (diamond dealer): "Ideal is the original AGS 000 standard. GIA Excellent is broader. True ideal is a subset of Excellent."\n\nAnswer 4 (boutique): "We use it to mean our best stones — Hearts and Arrows pattern, verified by ASET scope."\n\nAnswer 5 (mall jeweler): "Ideal, Excellent, Super Ideal — these all mean basically the same thing."\n\nAnswer 6 (estate jeweler): "Tolkowsky''s 1919 mathematical ideal proportions. Almost nobody cuts to that exact standard today."\n\nAll six answers contain partial truth. Here is the complete picture:\n\n• "Ideal" has no legal or certification definition. Any retailer can use it for any stone.\n• GIA Excellent is the highest cut grade GIA issues. It covers a range — not a single point.\n• AGS 000 (Triple Zero) is a more precise standard from the American Gem Society. Narrower than GIA Excellent.\n• Hearts & Arrows is a visual pattern created by precise cutting. It is evidence of superior craftsmanship but is not a grade.\n• Super Ideal / True Ideal are retailer-coined terms, often (but not always) referring to Hearts & Arrows stones with ideal proportions.\n\nWhen a jeweler says "ideal cut": ask them what standard they are using. If they cannot answer precisely, that tells you everything.',
   'text', 276, 291, 15, 3, false, false, false,
   now() - interval '3 days 20 hours', now() - interval '3 days 20 hours'),

  -- Post 5: Sophie_Laurent — Brilliant Earth markup
  (p5, comm, u2,
   'Brilliant Earth quoted me $1,100 more than Blue Nile for the exact same GIA stone. Here is the receipt.',
   E'I want to be precise about this because "they charge more" is vague. Here is the exact comparison.\n\nI found a GIA 1ct F-VS1 round, Excellent, no fluorescence on Blue Nile: $5,890.\n\nI then searched the same GIA report number on Brilliant Earth.\n\nBrilliant Earth listed the identical stone — same GIA number, same physical diamond — at $6,990.\n\nDifference: $1,100 for the same stone with the same GIA certificate.\n\nI called Brilliant Earth to ask directly. Their response:\n\n"Brilliant Earth offers Beyond Conflict Free™ sourcing, recycled precious metals, and a commitment to ethical supply chains. Our pricing reflects the additional due diligence we perform on every stone."\n\nI asked: "Is the GIA stone itself sourced differently through you vs Blue Nile?"\n\nLong pause. Then: "The stone meets our ethical sourcing standards."\n\nThe GIA certificate is issued to the stone, not the retailer. The same stone in the same GIA report does not have a different provenance depending on which website lists it. The $1,100 is for Brilliant Earth''s brand, packaging, and marketing — not for a different or more ethical diamond.\n\nIf ethical sourcing genuinely matters to you: look at Canadian diamonds (Canadamark certified), or lab-grown diamonds which have zero mining provenance concerns. Both are legitimate and priced fairly.\n\nDo not pay a $1,100 premium for the same GIA stone.',
   'text', 334, 352, 18, 3, false, false, false,
   now() - interval '3 days 4 hours', now() - interval '3 days 4 hours'),

  -- Post 6: Jake_Anderson_DC — moissanite placeholder
  (p6, comm, u5,
   'I proposed with a $180 moissanite placeholder. My fiancée wore it for 4 months while we chose the real stone together. Best decision we made.',
   E'I had a budget of $4,500 for a ring but no idea what my girlfriend actually wanted. Shape, size, setting style, metal — I knew none of it.\n\nInstead of guessing on a $4,500 purchase, I bought a 1ct moissanite in a simple 14K white gold solitaire for $180. I proposed with it.\n\nHer reaction was perfect. The moment was perfect. The ring looked beautiful.\n\nThen I told her the plan.\n\nWe spent the next 4 months: visiting stores together, trying on different shapes (she discovered she loves oval, not round), looking at settings, understanding certificates. She wore the moissanite every day.\n\nBy the time we ordered the real ring, we knew exactly what we wanted:\n• GIA 1.2ct F-VS2 oval, Excellent polish and symmetry\n• 14K white gold 4-prong solitaire with knife-edge band\n• She picked the exact stone herself on James Allen using the 360° view\n\nTotal: $4,340. Under budget.\n\nReactions from her family and friends to the moissanite proposal: "gorgeous," "stunning," "I love the stone."\n\nNobody asked if it was real. Nobody could tell.\n\nThe argument against placeholders is usually "the moment won''t be real." My counter: the moment was completely real. The ring she wears every day now is one she chose herself and loves more than anything I would have picked alone.\n\nFor anyone nervous about picking the wrong ring: this approach costs $180 and removes all the guesswork.',
   'text', 298, 314, 16, 3, false, false, false,
   now() - interval '2 days 16 hours', now() - interval '2 days 16 hours'),

  -- Post 7: Ryan_Mitchell_LA — 4 prong vs 6 prong
  (p7, comm, u8,
   '4-prong vs 6-prong for a round brilliant: I researched this for 3 weeks and talked to 4 bench jewelers. Here is the definitive answer.',
   E'This debate comes up constantly and the advice is contradictory. I did the actual research.\n\nI spoke with four working bench jewelers — not salespeople, actual goldsmiths who set stones daily. I asked the same questions to each.\n\n4-PRONG SETTING\n• Shows more diamond: 4 prongs cover less of the girdle, meaning more of the stone face-up is visible\n• Appears larger: same carat weight, marginally more visible stone\n• More contemporary look: cleaner, more minimal aesthetic\n• Risk: if one prong fails or catches and bends, the stone has only 3 points of contact — can loosen or come out\n• All 4 bench jewelers said: "With quality prong work and regular inspections, 4-prong is completely fine."\n\n6-PRONG SETTING\n• More stone coverage: slight visual reduction in face-up appearance\n• More traditional look: the classic Tiffany-style solitaire is 6-prong\n• Redundancy: if one prong is damaged, 5 remain — stone does not loosen\n• Easier re-tipping: more material to work with during maintenance\n• All 4 jewelers said: "More forgiving for active lifestyles or buyers who will skip inspections."\n\nThe honest conclusion from the goldsmiths:\n\n"With proper prong work and an annual inspection, 4-prong is as secure as 6-prong in daily wear. The difference matters more for buyers who will not maintain the ring."\n\nMy choice: 4-prong. The look is cleaner, the stone shows more, and I have a reminder set for inspection every 12 months.\n\nIf you are hard on your hands (chef, nurse, gym daily, manual work): 6-prong gives you a meaningful safety margin.',
   'text', 156, 167, 11, 3, false, false, false,
   now() - interval '2 days 2 hours', now() - interval '2 days 2 hours'),

  -- Post 8: Oliver_Hughes — cushion cut 6 month review
  (p8, comm, u7,
   'I chose a cushion cut over round brilliant at $4K and wore it for 6 months. Honest review including the one thing nobody warned me about.',
   E'My budget was $4,000 for a stone. I was set on round brilliant until a jeweler suggested I compare cushion cut side by side.\n\nThe comparison at $4K:\n• Round brilliant: GIA 1ct G-VS2, 6.5mm — $3,890\n• Cushion cut: GIA 1.5ct G-VS2, 6.5 × 6.8mm — $3,720\n\nA 1.5ct cushion at the price of a 1ct round, with a similar face-up footprint. The soft corners of the cushion made it look romantic and different from every other engagement ring I had seen.\n\nI bought the cushion. Here is the 6-month honest report.\n\nTHE GOOD:\n• The "crushed ice" sparkle pattern of a cushion is genuinely different from a round — it scatters light in a soft, romantic way rather than the sharp brilliance of a round\n• Nobody else in my social circle has a cushion cut — it is a consistent conversation piece\n• The soft corners feel safer than sharp princess corners for daily wear\n• 1.5ct on a size 6 finger has beautiful finger coverage\n\nTHE THING NOBODY WARNED ME ABOUT:\n• Cushion cuts vary wildly in appearance. "Cushion brilliant" and "cushion modified brilliant" are different facet structures that look completely different face-up. I did not know this before buying.\n• My stone is cushion modified brilliant — crushed ice pattern. Some buyers want this; some hate it and want larger facets.\n• If you are buying a cushion: ask specifically which facet structure you are getting and view a 360° video before committing.\n\nOverall: I love this ring. The 6 months have only made me more certain I made the right choice. But do your cushion research — it is a more complex shape than it first appears.',
   'text', 178, 190, 12, 3, false, false, false,
   now() - interval '1 day 14 hours', now() - interval '1 day 14 hours'),

  -- Post 9: Sarah_Collins_NYC — Hearts and Arrows worth it
  (p9, comm, u6,
   'I held a GIA Triple Excellent and a Hearts & Arrows stone side by side for 45 minutes. Honest verdict on whether H&A is worth $1,400 more.',
   E'I was deciding between two 1ct G-VS1 round brilliants:\n\n• Stone A: GIA Triple Excellent (Excellent cut, polish, symmetry). No H&A verification. $5,210.\n• Stone B: GIA Triple Excellent + confirmed Hearts & Arrows pattern, ASET scope verified. $6,640.\n\nDifference: $1,430.\n\nI arranged a proper side-by-side at a jeweler who carries both types. 45 minutes under different light sources.\n\nOFFICE FLUORESCENT LIGHTING:\nBoth looked excellent. I could detect a slight edge in contrast and scintillation in Stone B — more defined dark-light pattern when moving the stone. Stone A was beautiful. Stone B was slightly more dynamic.\n\nDIFFUSE WINDOW LIGHT (north-facing, overcast):\nThis is where the difference became clearest. Stone B had visibly more life — the light return was more even, more symmetric, with stronger contrast. Stone A was good. Stone B was better. Not dramatically, but consistently.\n\nOUTDOOR DIRECT SUNLIGHT:\nBoth were spectacular. Could not reliably distinguish them in bright direct light.\n\nDIM RESTAURANT LIGHTING:\nStone B showed more noticeable scintillation — the dancing light points were more defined. Stone A was still beautiful.\n\nMy verdict:\n\nThe H&A difference is real but subtle in most conditions. It is most visible in diffuse natural light — the light you live in at home, at the office, on cloudy days. That is actually most of your life.\n\nIs $1,430 worth it? For someone who will wear the ring daily and notice the difference in everyday light: yes. For someone who will mainly see it in restaurants and outdoors: the Triple Excellent is beautiful and the difference is minimal.\n\nI bought Stone B. I see the difference every morning at my desk and I am glad I did.',
   'text', 221, 235, 14, 3, false, false, false,
   now() - interval '20 hours', now() - interval '20 hours'),

  -- Post 10: Marcus_Webb — lab prices dropped
  (p10, comm, u4,
   'Lab diamond prices have dropped 47% in 18 months. Here is what that actually means if you are buying right now in 2025.',
   E'I track this market closely. Here is the data and what it means for buyers today.\n\nJanuary 2023: 1ct D-VVS1 lab round, IGI certified: approximately $3,800.\nJune 2025: Same spec: approximately $2,010.\n\n47% price decline in 18 months.\n\nWhy this happened:\n• Lab diamond production (CVD process) has scaled massively — primarily from Indian manufacturers\n• Supply increased dramatically; demand grew but not at the same rate\n• Retailers who bought lab inventory 18 months ago are sitting on stock that has declined in value\n• The price floor is still falling — analysts expect continued decline through 2026\n\nWhat this means if you are BUYING NOW:\n\n1. For appearance-focused buyers: this is an extraordinary moment. A 2ct D-VVS1 lab round can be had for under $4,000. Six months ago that was $5,200. A year ago it was $6,800.\n\n2. For buyers concerned about resale: the decline is already priced in. Lab diamonds now resell at 10–15 cents on the dollar and that ratio is unlikely to worsen dramatically — you are already near the floor of "commodity gemstone" pricing.\n\n3. For natural diamond buyers: natural prices have held relatively steady. The gap between natural and lab has widened. A GIA 1ct G-VS1 natural costs roughly $4,800. The same spec in lab costs $1,900. That is a 2.5x multiple that did not exist 3 years ago.\n\nThe buying advice right now:\n• If you are buying lab: prices may still fall. But "wait for lower prices" is a trap — there is no signal for when to stop waiting.\n• If you are buying natural: nothing has changed. Natural at good grades has been price-stable.\n• If you are undecided: the lab value case has never been stronger if appearance is your primary criterion.',
   'text', 289, 305, 16, 3, false, false, false,
   now() - interval '6 hours', now() - interval '6 hours');

  -- ── 30 Comments ─────────────────────────────────────────────

  INSERT INTO public.comments
    (id, post_id, author_id, body, score, upvotes, downvotes, is_deleted, created_at)
  VALUES

  -- Post 1 (ring return / fluorescence)
  (c1a, p1, u4,
   'Strong blue fluorescence causing haziness in diffuse light is a documented phenomenon in D–H color stones, particularly D–F. The physics: strong fluorescence emits blue light in all conditions including ambient indoor light, which can create a milky appearance when the blue emission interacts with the stone''s body color. "None" or "Faint" is the correct filter for white diamonds. The retailer''s listing error cost you a month of anxiety — fully justified return.',
   52, 55, 3, false, now() - interval '5 days 22 hours'),
  (c1b, p1, u6,
   'Same situation happened to a friend. GIA Excellent H-VS2, listed as "None" fluorescence. Arrived with medium blue. The stone looked dull on grey overcast days specifically. It is always overcast here. She returned it day 29 of 30. The replacement with verified None is visibly different. Always confirm fluorescence independently from the 360° video if possible — you can sometimes see a haze if you view the stone in simulated diffuse light.',
   38, 40, 2, false, now() - interval '5 days 18 hours'),
  (c1c, p1, u9,
   'The new stone sounds like it was worth the stress. For anyone reading: the rule on fluorescence for white diamonds — D through H color, round brilliant — filter for None. Faint is usually acceptable. Medium, Strong, Very Strong: avoid unless you are buying a lower color (I or J) where blue fluorescence actually corrects warmth and is considered a mild positive.',
   29, 30, 1, false, now() - interval '5 days 14 hours'),

  -- Post 2 (retailer comparison)
  (c2a, p2, u1,
   'The James Allen 360° point cannot be overstated. I bought a stone from a retailer without video and it had a polish mark on the table that was completely invisible in the static photos. I had to return it. Every stone I consider now I filter to retailers with 360° video first. If I cannot see the actual stone rotating, I do not buy it.',
   44, 46, 2, false, now() - interval '4 days 22 hours'),
  (c2b, p2, u3,
   'Whiteflash''s A-CUT-ABOVE is genuinely the best consumer-accessible Hearts and Arrows product on the market. I compared their ASET images against three other H&A vendors and the light return consistency is measurably different. For a once-in-a-lifetime purchase where you want the best possible stone: Whiteflash is the answer regardless of price.',
   31, 33, 2, false, now() - interval '4 days 20 hours'),
  (c2c, p2, u5,
   'Blue Nile is the right choice for buyers who have done their research and know their target specs. Their inventory is vast, their prices are competitive, and their return policy is solid. If you are comfortable reading a GIA report and filtering by pavilion angle, Blue Nile is efficient. If you want hand-holding through the process: James Allen''s customer service is genuinely excellent.',
   26, 27, 1, false, now() - interval '4 days 16 hours'),

  -- Post 3 (newspaper test / cut quality)
  (c3a, p3, u4,
   'Pavilion angle is the single most important number on a round brilliant certificate and it is systematically underemphasized. 40.6–41.0° is the accepted ideal range. Every degree outside that range costs you light return. GIA Excellent extends to 40.4° on the shallow end and 41.8° on the deep end — both produce noticeably different optical performance despite carrying the same grade.',
   58, 62, 4, false, now() - interval '4 days 4 hours'),
  (c3b, p3, u2,
   'Holloway Cut Adviser is the tool I wish I had known about before my first purchase. You input the proportions from the GIA report and it gives you a score from 0–10 (lower is better). Any stone scoring above 2 is getting filtered out of my consideration regardless of what the GIA grade says. This caught a "GIA Excellent" stone that would have given me exactly the newspaper test result you experienced.',
   41, 43, 2, false, now() - interval '4 days 1 hour'),
  (c3c, p3, u7,
   'This is why I always request the full proportion data when buying in-store. Most jewelers will provide it — it is on the detailed GIA report, just not always printed on the summary certificate the customer sees. Ask for pavilion angle, crown angle, and table percentage specifically. If they cannot or will not provide it: that tells you something.',
   33, 35, 2, false, now() - interval '3 days 22 hours'),

  -- Post 4 (ideal cut definition)
  (c4a, p4, u1,
   'The AGS 000 vs GIA Excellent distinction is one of the most practically important things a buyer can understand. GIA Excellent casts a wide net — approximately 55% of round brilliants cut today qualify. AGS Triple Zero is a narrower standard focused specifically on light performance. They are not the same thing and retailers who use "ideal" to mean "GIA Excellent" are technically accurate but misleading.',
   47, 50, 3, false, now() - interval '3 days 16 hours'),
  (c4b, p4, u6,
   'I had this exact experience at a mall store. The salesperson used "ideal cut" eight times in ten minutes. When I asked what standard they were using, she said "our own internal grading." That is when I left. If a retailer cannot tell you precisely what cut standard they are referencing and why their stone meets it, find a different retailer.',
   39, 41, 2, false, now() - interval '3 days 14 hours'),
  (c4c, p4, u8,
   'New buyer here — this thread just saved me from serious confusion. I had three different jewelers tell me three different things about ideal cut and I was starting to think I was the problem. The honest answer is that the term is marketing, not certification. GIA Excellent + good proportions (pavilion 40.6–41°, table 53–58°, crown 34–35°) is what actually matters.',
   22, 23, 1, false, now() - interval '3 days 10 hours'),

  -- Post 5 (Brilliant Earth markup)
  (c5a, p5, u4,
   'The GIA report number is the diamond''s fingerprint. The stone does not change depending on which retailer lists it. Brilliant Earth''s "Beyond Conflict Free" sourcing claim is applied at the point of acquisition — if they acquire a stone that was already in the market, the provenance history is the same as any other retailer handling that stone. The $1,100 is for the Brilliant Earth brand. That is a legitimate business model but buyers should understand what they are and are not paying for.',
   61, 65, 4, false, now() - interval '2 days 22 hours'),
  (c5b, p5, u3,
   'If ethical sourcing is genuinely your priority — not just a premium brand — Canadamark certified Canadian diamonds are the gold standard. Fully traceable mine-to-market, independently audited, no inflated brand premium. Or lab-grown, which eliminates mining provenance entirely. Both of these are legitimate ethical choices that cost less than the Brilliant Earth markup.',
   44, 46, 2, false, now() - interval '2 days 20 hours'),
  (c5c, p5, u9,
   'The GIA number search is a technique every buyer should know. Before committing to any stone you have found in-store or at a premium retailer: photograph the GIA number and search it on Blue Nile, James Allen, and Leibish. You will often find the identical stone listed elsewhere. The price difference funds your education about how diamond retail actually works.',
   37, 39, 2, false, now() - interval '2 days 16 hours'),

  -- Post 6 (moissanite placeholder)
  (c6a, p6, u2,
   'This is genuinely the most sensible proposal strategy I have read on this forum. The emotional moment is completely preserved — the proposal, the yes, the ring on her finger. The collaborative upgrade process means she gets to participate in one of the most meaningful purchases of your shared life. And you do not spend $4,500 on the wrong stone shape.',
   56, 59, 3, false, now() - interval '2 days 12 hours'),
  (c6b, p6, u1,
   'My partner and I did almost exactly this. I proposed with her grandmother''s vintage ring (with permission) as a placeholder while we designed a custom piece together. The shopping process became something we talk about as much as the proposal itself. She knew every decision that went into her ring. The connection to the stone is completely different when you chose it together.',
   43, 45, 2, false, now() - interval '2 days 8 hours'),
  (c6c, p6, u7,
   'The "but the surprise is ruined" concern is worth addressing. The surprise in a proposal is not the ring design — it is the question, the location, the moment you created. The ring design is a 20-year daily wear decision that the person wearing it should have significant input on. These are two separate events and treating them as one is what leads to $4,500 returns.',
   38, 40, 2, false, now() - interval '2 days 4 hours'),

  -- Post 7 (4 prong vs 6 prong)
  (c7a, p7, u4,
   'Speaking from the trade side: 4-prong failure is almost always a maintenance issue, not a design flaw. Prongs work-harden from daily flex and develop micro-cracks that eventually fail. With annual inspections, a 4-prong solitaire will hold a stone indefinitely. Without inspections, any setting — 4 or 6 prong — is a gamble on timing. The setting style matters less than the maintenance habit.',
   34, 36, 2, false, now() - interval '1 day 22 hours'),
  (c7b, p7, u6,
   'I chose 6-prong specifically because I am a nurse and my hands are rough on rings — frequent glove removal, constant hand washing, occasional knocks on hard surfaces. The redundancy matters for my lifestyle. For someone who sits at a desk and handles their ring carefully: 4-prong is completely fine and looks better on most stone sizes.',
   28, 29, 1, false, now() - interval '1 day 20 hours'),
  (c7c, p7, u5,
   'The visual difference is real and worth considering. 4-prong on a round brilliant creates a cleaner, more modern look — the stone appears to float. 6-prong adds visual "noise" at the girdle but provides the traditional Tiffany aesthetic. Neither is objectively better. It is a style preference informed by lifestyle. Try both in person if you can.',
   21, 22, 1, false, now() - interval '1 day 16 hours'),

  -- Post 8 (cushion cut review)
  (c8a, p8, u2,
   'The cushion brilliant vs cushion modified brilliant distinction is genuinely confusing and undersold by most retailers. Cushion brilliant has larger, chunkier facets with a more traditional look. Cushion modified has a smaller, "crushed ice" facet pattern that looks almost like scattered glitter. They are radically different in person. If you are buying a cushion online: request confirmation of the facet structure and view 360° video specifically for the pattern.',
   46, 49, 3, false, now() - interval '1 day 10 hours'),
  (c8b, p8, u1,
   'I love my cushion cut for exactly the "different from everyone else" reason you mentioned. Round brilliants dominate engagement rings and there is something genuinely distinctive about a cushion. The soft corners read as romantic and feminine in a way that feels different from both the sharpness of a princess and the perfection of a round.',
   32, 34, 2, false, now() - interval '1 day 6 hours'),
  (c8c, p8, u9,
   'The 1.5ct cushion at the price of a 1ct round is the math that converts most round-leaning buyers when they see it. Same face-up footprint, 50% more carat weight on the certificate, lower price. The cushion cut premium over round does not exist the way it does with ovals. It is one of the better value shapes in the market right now.',
   27, 28, 1, false, now() - interval '1 day 2 hours'),

  -- Post 9 (H&A comparison)
  (c9a, p9, u4,
   'The diffuse light observation is the most honest part of this review. Direct sunlight makes almost any well-cut stone spectacular — it is an easy condition. The test that separates good cuts from great cuts is overcast daylight or indoor window light. That is where the pavilion angle and crown angle mathematics translate into visible, real-world optical performance. H&A stones are optimised for exactly that condition.',
   51, 54, 3, false, now() - interval '16 hours'),
  (c9b, p9, u3,
   'I made the opposite choice — Triple Excellent without H&A — and I am content with it. My ring is worn primarily outdoors in the UK where overcast is the default, and honestly the difference you describe sounds like it exists but is subtle enough that I am not losing sleep. The $1,430 went toward a platinum setting upgrade. Context matters.',
   29, 31, 2, false, now() - interval '14 hours'),
  (c9c, p9, u5,
   'The dim restaurant lighting point is underrated. That is where most people see your ring in social settings — candlelight, warm Edison bulbs, low ambient. H&A stones have stronger scintillation in low light specifically because the precise facet geometry creates more defined contrast between the bright and dark areas of the stone. It is one of the most compelling practical cases for the premium.',
   24, 25, 1, false, now() - interval '10 hours'),

  -- Post 10 (lab price drop)
  (c10a, p10, u1,
   'The 47% drop is consistent with what I have seen in my own research over the past year. The supply-side story is important context: Indian CVD producers ramped capacity in 2022–2023 anticipating demand growth that did not materialise at the same rate. The result is a supply glut that is still working through the market. Prices will likely stabilise at some point but "the bottom is in" is very difficult to call right now.',
   43, 46, 3, false, now() - interval '4 hours'),
  (c10b, p10, u7,
   'The resale point is the one that matters most to me as a UK buyer. At 10–15 cents on the dollar, lab diamond resale is already at commodity floor pricing. Natural diamonds at 40–50 cents are still poor as investments but less catastrophically so. For a purchase you intend to keep forever: this distinction is irrelevant. For a purchase you might need to liquidate: it is the most important number in the conversation.',
   36, 38, 2, false, now() - interval '3 hours'),
  (c10c, p10, u2,
   'The 2.5x price multiple between natural and lab at equivalent grades is genuinely historic. Three years ago that ratio was approximately 1.5x at the 1ct level. The widening multiple reflects the production economics of CVD becoming fully commoditised. For a buyer whose priority is a large, high-grade stone for daily wear with no resale intention: there has never been a better time to buy lab.',
   31, 33, 2, false, now() - interval '2 hours');

  -- ── Post votes ──────────────────────────────────────────────

  INSERT INTO public.post_votes (post_id, user_id, vote, created_at)
  VALUES
    (p1, u1, 1, now() - interval '5 days 20 hours'),
    (p1, u2, 1, now() - interval '5 days 18 hours'),
    (p1, u4, 1, now() - interval '5 days 16 hours'),
    (p1, u5, 1, now() - interval '5 days 14 hours'),
    (p1, u6, 1, now() - interval '5 days 12 hours'),
    (p1, u7, 1, now() - interval '5 days 10 hours'),
    (p1, u9, 1, now() - interval '5 days 8 hours'),

    (p2, u1, 1, now() - interval '4 days 20 hours'),
    (p2, u2, 1, now() - interval '4 days 18 hours'),
    (p2, u3, 1, now() - interval '4 days 16 hours'),
    (p2, u5, 1, now() - interval '4 days 14 hours'),
    (p2, u6, 1, now() - interval '4 days 12 hours'),
    (p2, u7, 1, now() - interval '4 days 10 hours'),
    (p2, u8, 1, now() - interval '4 days 8 hours'),

    (p3, u2, 1, now() - interval '4 days 4 hours'),
    (p3, u4, 1, now() - interval '4 days 2 hours'),
    (p3, u5, 1, now() - interval '4 days'),
    (p3, u6, 1, now() - interval '3 days 22 hours'),
    (p3, u7, 1, now() - interval '3 days 20 hours'),
    (p3, u8, 1, now() - interval '3 days 18 hours'),
    (p3, u9, 1, now() - interval '3 days 16 hours'),

    (p4, u1, 1, now() - interval '3 days 16 hours'),
    (p4, u2, 1, now() - interval '3 days 14 hours'),
    (p4, u3, 1, now() - interval '3 days 12 hours'),
    (p4, u5, 1, now() - interval '3 days 10 hours'),
    (p4, u6, 1, now() - interval '3 days 8 hours'),
    (p4, u7, 1, now() - interval '3 days 6 hours'),
    (p4, u8, 1, now() - interval '3 days 4 hours'),

    (p5, u1, 1, now() - interval '3 days 2 hours'),
    (p5, u3, 1, now() - interval '3 days'),
    (p5, u5, 1, now() - interval '2 days 22 hours'),
    (p5, u6, 1, now() - interval '2 days 20 hours'),
    (p5, u7, 1, now() - interval '2 days 18 hours'),
    (p5, u8, 1, now() - interval '2 days 16 hours'),
    (p5, u9, 1, now() - interval '2 days 14 hours'),

    (p6, u1, 1, now() - interval '2 days 14 hours'),
    (p6, u2, 1, now() - interval '2 days 12 hours'),
    (p6, u3, 1, now() - interval '2 days 10 hours'),
    (p6, u4, 1, now() - interval '2 days 8 hours'),
    (p6, u6, 1, now() - interval '2 days 6 hours'),
    (p6, u7, 1, now() - interval '2 days 4 hours'),
    (p6, u9, 1, now() - interval '2 days 2 hours'),

    (p7, u2, 1, now() - interval '2 days'),
    (p7, u3, 1, now() - interval '1 day 22 hours'),
    (p7, u4, 1, now() - interval '1 day 20 hours'),
    (p7, u5, 1, now() - interval '1 day 18 hours'),
    (p7, u6, 1, now() - interval '1 day 16 hours'),
    (p7, u8, 1, now() - interval '1 day 14 hours'),
    (p7, u9, 1, now() - interval '1 day 12 hours'),

    (p8, u1, 1, now() - interval '1 day 10 hours'),
    (p8, u2, 1, now() - interval '1 day 8 hours'),
    (p8, u3, 1, now() - interval '1 day 6 hours'),
    (p8, u5, 1, now() - interval '1 day 4 hours'),
    (p8, u6, 1, now() - interval '1 day 2 hours'),
    (p8, u8, 1, now() - interval '1 day'),
    (p8, u9, 1, now() - interval '23 hours'),

    (p9, u1, 1, now() - interval '18 hours'),
    (p9, u2, 1, now() - interval '17 hours'),
    (p9, u4, 1, now() - interval '16 hours'),
    (p9, u5, 1, now() - interval '15 hours'),
    (p9, u7, 1, now() - interval '14 hours'),
    (p9, u8, 1, now() - interval '13 hours'),
    (p9, u9, 1, now() - interval '12 hours'),

    (p10, u1, 1, now() - interval '5 hours'),
    (p10, u2, 1, now() - interval '4 hours 30 minutes'),
    (p10, u3, 1, now() - interval '4 hours'),
    (p10, u5, 1, now() - interval '3 hours 30 minutes'),
    (p10, u6, 1, now() - interval '3 hours'),
    (p10, u7, 1, now() - interval '2 hours 30 minutes'),
    (p10, u8, 1, now() - interval '2 hours')
  ON CONFLICT DO NOTHING;

  -- ── Comment votes ────────────────────────────────────────────

  INSERT INTO public.comment_votes (comment_id, user_id, vote)
  VALUES
    (c1a, u2, 1), (c1a, u5, 1), (c1a, u7, 1), (c1a, u9, 1),
    (c1b, u1, 1), (c1b, u4, 1), (c1b, u6, 1),
    (c1c, u2, 1), (c1c, u3, 1), (c1c, u8, 1),

    (c2a, u2, 1), (c2a, u4, 1), (c2a, u6, 1), (c2a, u9, 1),
    (c2b, u1, 1), (c2b, u5, 1), (c2b, u7, 1),
    (c2c, u3, 1), (c2c, u4, 1), (c2c, u8, 1),

    (c3a, u1, 1), (c3a, u2, 1), (c3a, u6, 1), (c3a, u8, 1),
    (c3b, u3, 1), (c3b, u5, 1), (c3b, u9, 1),
    (c3c, u1, 1), (c3c, u4, 1), (c3c, u7, 1),

    (c4a, u2, 1), (c4a, u3, 1), (c4a, u5, 1), (c4a, u8, 1),
    (c4b, u1, 1), (c4b, u4, 1), (c4b, u7, 1),
    (c4c, u2, 1), (c4c, u6, 1), (c4c, u9, 1),

    (c5a, u1, 1), (c5a, u2, 1), (c5a, u6, 1), (c5a, u8, 1),
    (c5b, u3, 1), (c5b, u5, 1), (c5b, u9, 1),
    (c5c, u1, 1), (c5c, u4, 1), (c5c, u7, 1),

    (c6a, u1, 1), (c6a, u3, 1), (c6a, u4, 1), (c6a, u8, 1),
    (c6b, u2, 1), (c6b, u5, 1), (c6b, u9, 1),
    (c6c, u1, 1), (c6c, u3, 1), (c6c, u6, 1),

    (c7a, u2, 1), (c7a, u3, 1), (c7a, u5, 1),
    (c7b, u1, 1), (c7b, u4, 1), (c7b, u9, 1),
    (c7c, u2, 1), (c7c, u6, 1), (c7c, u8, 1),

    (c8a, u1, 1), (c8a, u3, 1), (c8a, u5, 1), (c8a, u6, 1),
    (c8b, u2, 1), (c8b, u4, 1), (c8b, u7, 1),
    (c8c, u1, 1), (c8c, u3, 1), (c8c, u8, 1),

    (c9a, u1, 1), (c9a, u2, 1), (c9a, u6, 1), (c9a, u8, 1),
    (c9b, u3, 1), (c9b, u5, 1), (c9b, u9, 1),
    (c9c, u1, 1), (c9c, u4, 1), (c9c, u7, 1),

    (c10a, u2, 1), (c10a, u3, 1), (c10a, u7, 1), (c10a, u9, 1),
    (c10b, u1, 1), (c10b, u4, 1), (c10b, u6, 1),
    (c10c, u1, 1), (c10c, u3, 1), (c10c, u5, 1)
  ON CONFLICT DO NOTHING;

  -- ── Sync comment counts ──────────────────────────────────────
  UPDATE public.posts SET
    comment_count = (
      SELECT COUNT(*) FROM public.comments
      WHERE post_id = posts.id AND is_deleted = false
    )
  WHERE id IN (p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);

END $$;

SELECT COUNT(*) AS post_count FROM public.posts WHERE is_deleted = false;
