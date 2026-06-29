-- ============================================================
-- DiamondCritics Community — Full Setup Script
-- Paste into: Supabase Dashboard → SQL Editor → New Query
-- 100% safe to re-run: deduplicates, uses IF NOT EXISTS etc.
-- ============================================================

-- ─── Tables ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  bio           TEXT CHECK (char_length(bio) <= 500),
  post_karma    INTEGER DEFAULT 0 NOT NULL,
  comment_karma INTEGER DEFAULT 0 NOT NULL,
  is_admin      BOOLEAN DEFAULT FALSE NOT NULL,
  is_banned     BOOLEAN DEFAULT FALSE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.communities (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9\-]+$'),
  name         TEXT NOT NULL,
  description  TEXT,
  rules        TEXT,
  icon_url     TEXT,
  banner_url   TEXT,
  member_count INTEGER DEFAULT 0 NOT NULL,
  post_count   INTEGER DEFAULT 0 NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.community_members (
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (community_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.posts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id  UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  author_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title         TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 300),
  body          TEXT CHECK (char_length(body) <= 40000),
  url           TEXT CHECK (url IS NULL OR url ~ '^https?://'),
  image_url     TEXT CHECK (image_url IS NULL OR image_url ~ '^https?://'),
  type          TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'link', 'image')),
  score         INTEGER DEFAULT 1 NOT NULL,
  upvotes       INTEGER DEFAULT 1 NOT NULL,
  downvotes     INTEGER DEFAULT 0 NOT NULL,
  comment_count INTEGER DEFAULT 0 NOT NULL,
  is_deleted    BOOLEAN DEFAULT FALSE NOT NULL,
  is_pinned     BOOLEAN DEFAULT FALSE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.post_votes (
  post_id    UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote       SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  parent_id  UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  body       TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  score      INTEGER DEFAULT 1 NOT NULL,
  upvotes    INTEGER DEFAULT 1 NOT NULL,
  downvotes  INTEGER DEFAULT 0 NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.comment_votes (
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote       SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
  PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.badges (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#C6973E',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id   UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  awarded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS public.reports (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'user')),
  target_id   UUID NOT NULL,
  reason      TEXT NOT NULL CHECK (reason IN ('spam', 'harassment', 'misinformation', 'inappropriate', 'other')),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (reporter_id, target_type, target_id)
);

-- ─── Indexes ─────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_posts_community    ON public.posts(community_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author       ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_score        ON public.posts(score DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post      ON public.comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_parent    ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user    ON public.post_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_user ON public.comment_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status     ON public.reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_target     ON public.reports(target_type, target_id);

-- ─── Row Level Security ───────────────────────────────────────

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_votes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_votes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports           ENABLE ROW LEVEL SECURITY;

-- ─── Policies (drop first so re-runs don't error) ────────────

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "communities_select" ON public.communities;
DROP POLICY IF EXISTS "communities_insert" ON public.communities;
DROP POLICY IF EXISTS "communities_update" ON public.communities;
DROP POLICY IF EXISTS "communities_delete" ON public.communities;
CREATE POLICY "communities_select" ON public.communities FOR SELECT USING (true);
CREATE POLICY "communities_insert" ON public.communities FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "communities_update" ON public.communities FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "communities_delete" ON public.communities FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

DROP POLICY IF EXISTS "members_select" ON public.community_members;
DROP POLICY IF EXISTS "members_insert" ON public.community_members;
DROP POLICY IF EXISTS "members_delete" ON public.community_members;
CREATE POLICY "members_select" ON public.community_members FOR SELECT USING (true);
CREATE POLICY "members_insert" ON public.community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members_delete" ON public.community_members FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "posts_select" ON public.posts;
DROP POLICY IF EXISTS "posts_insert" ON public.posts;
DROP POLICY IF EXISTS "posts_update" ON public.posts;
DROP POLICY IF EXISTS "posts_delete" ON public.posts;
CREATE POLICY "posts_select" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON public.posts FOR INSERT WITH CHECK (
  auth.uid() = author_id
  AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_banned = TRUE)
);
CREATE POLICY "posts_update" ON public.posts FOR UPDATE USING (
  auth.uid() = author_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "posts_delete" ON public.posts FOR DELETE USING (
  auth.uid() = author_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

DROP POLICY IF EXISTS "post_votes_select" ON public.post_votes;
DROP POLICY IF EXISTS "post_votes_insert" ON public.post_votes;
DROP POLICY IF EXISTS "post_votes_update" ON public.post_votes;
DROP POLICY IF EXISTS "post_votes_delete" ON public.post_votes;
CREATE POLICY "post_votes_select" ON public.post_votes FOR SELECT USING (true);
CREATE POLICY "post_votes_insert" ON public.post_votes FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_banned = TRUE)
);
CREATE POLICY "post_votes_update" ON public.post_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "post_votes_delete" ON public.post_votes FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_select" ON public.comments;
DROP POLICY IF EXISTS "comments_insert" ON public.comments;
DROP POLICY IF EXISTS "comments_update" ON public.comments;
DROP POLICY IF EXISTS "comments_delete" ON public.comments;
CREATE POLICY "comments_select" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON public.comments FOR INSERT WITH CHECK (
  auth.uid() = author_id
  AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_banned = TRUE)
);
CREATE POLICY "comments_update" ON public.comments FOR UPDATE USING (
  auth.uid() = author_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "comments_delete" ON public.comments FOR DELETE USING (
  auth.uid() = author_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

DROP POLICY IF EXISTS "comment_votes_select" ON public.comment_votes;
DROP POLICY IF EXISTS "comment_votes_insert" ON public.comment_votes;
DROP POLICY IF EXISTS "comment_votes_update" ON public.comment_votes;
DROP POLICY IF EXISTS "comment_votes_delete" ON public.comment_votes;
CREATE POLICY "comment_votes_select" ON public.comment_votes FOR SELECT USING (true);
CREATE POLICY "comment_votes_insert" ON public.comment_votes FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_banned = TRUE)
);
CREATE POLICY "comment_votes_update" ON public.comment_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comment_votes_delete" ON public.comment_votes FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "badges_select" ON public.badges;
DROP POLICY IF EXISTS "badges_admin"  ON public.badges;
CREATE POLICY "badges_select" ON public.badges FOR SELECT USING (true);
CREATE POLICY "badges_admin"  ON public.badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

DROP POLICY IF EXISTS "user_badges_select" ON public.user_badges;
DROP POLICY IF EXISTS "user_badges_admin"  ON public.user_badges;
CREATE POLICY "user_badges_select" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "user_badges_admin"  ON public.user_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

DROP POLICY IF EXISTS "reports_insert" ON public.reports;
DROP POLICY IF EXISTS "reports_select" ON public.reports;
DROP POLICY IF EXISTS "reports_update" ON public.reports;
CREATE POLICY "reports_insert" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reports_select" ON public.reports FOR SELECT USING (
  auth.uid() = reporter_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "reports_update" ON public.reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ─── Functions & Triggers ────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g'))
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_post_score()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET
      score     = score + NEW.vote,
      upvotes   = upvotes   + CASE WHEN NEW.vote =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes + CASE WHEN NEW.vote = -1 THEN 1 ELSE 0 END
    WHERE id = NEW.post_id;
    UPDATE public.profiles SET post_karma = post_karma + NEW.vote
    WHERE id = (SELECT author_id FROM public.posts WHERE id = NEW.post_id);
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.posts SET
      score     = score + (NEW.vote - OLD.vote),
      upvotes   = upvotes   + CASE WHEN NEW.vote =  1 THEN 1 WHEN OLD.vote =  1 THEN -1 ELSE 0 END,
      downvotes = downvotes + CASE WHEN NEW.vote = -1 THEN 1 WHEN OLD.vote = -1 THEN -1 ELSE 0 END
    WHERE id = NEW.post_id;
    UPDATE public.profiles SET post_karma = post_karma + (NEW.vote - OLD.vote)
    WHERE id = (SELECT author_id FROM public.posts WHERE id = NEW.post_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET
      score     = score - OLD.vote,
      upvotes   = upvotes   - CASE WHEN OLD.vote =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes - CASE WHEN OLD.vote = -1 THEN 1 ELSE 0 END
    WHERE id = OLD.post_id;
    UPDATE public.profiles SET post_karma = post_karma - OLD.vote
    WHERE id = (SELECT author_id FROM public.posts WHERE id = OLD.post_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_post_vote ON public.post_votes;
CREATE TRIGGER on_post_vote
  AFTER INSERT OR UPDATE OR DELETE ON public.post_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_score();

CREATE OR REPLACE FUNCTION public.update_comment_score()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments SET
      score     = score + NEW.vote,
      upvotes   = upvotes   + CASE WHEN NEW.vote =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes + CASE WHEN NEW.vote = -1 THEN 1 ELSE 0 END
    WHERE id = NEW.comment_id;
    UPDATE public.profiles SET comment_karma = comment_karma + NEW.vote
    WHERE id = (SELECT author_id FROM public.comments WHERE id = NEW.comment_id);
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.comments SET
      score     = score + (NEW.vote - OLD.vote),
      upvotes   = upvotes   + CASE WHEN NEW.vote =  1 THEN 1 WHEN OLD.vote =  1 THEN -1 ELSE 0 END,
      downvotes = downvotes + CASE WHEN NEW.vote = -1 THEN 1 WHEN OLD.vote = -1 THEN -1 ELSE 0 END
    WHERE id = NEW.comment_id;
    UPDATE public.profiles SET comment_karma = comment_karma + (NEW.vote - OLD.vote)
    WHERE id = (SELECT author_id FROM public.comments WHERE id = NEW.comment_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments SET
      score     = score - OLD.vote,
      upvotes   = upvotes   - CASE WHEN OLD.vote =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes - CASE WHEN OLD.vote = -1 THEN 1 ELSE 0 END
    WHERE id = OLD.comment_id;
    UPDATE public.profiles SET comment_karma = comment_karma - OLD.vote
    WHERE id = (SELECT author_id FROM public.comments WHERE id = OLD.comment_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_comment_vote ON public.comment_votes;
CREATE TRIGGER on_comment_vote
  AFTER INSERT OR UPDATE OR DELETE ON public.comment_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_comment_score();

CREATE OR REPLACE FUNCTION public.update_comment_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_comment_insert ON public.comments;
CREATE TRIGGER on_comment_insert
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comment_count();

CREATE OR REPLACE FUNCTION public.update_post_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities SET post_count = post_count + 1 WHERE id = NEW.community_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_post_insert ON public.posts;
CREATE TRIGGER on_post_insert
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_post_count();

CREATE OR REPLACE FUNCTION public.update_member_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.community_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_membership_change ON public.community_members;
CREATE TRIGGER on_membership_change
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION public.update_member_count();

-- ─── Seed Communities & Badges ───────────────────────────────

INSERT INTO public.communities (slug, name, description, rules)
VALUES (
  'diamonds',
  'Diamonds',
  'Everything about diamonds — quality, pricing, GIA reports, buying advice, and more.',
  E'1. Be respectful to all members\n2. No spam or self-promotion links\n3. Provide sources for price claims\n4. No buying/selling posts\n5. Include diamond specs when asking for advice (carat, cut, color, clarity)'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.badges (name, description, icon, color) VALUES
  ('Diamond Expert',  'Verified diamond industry professional',   '💎', '#C6973E'),
  ('GIA Certified',   'Holds a GIA gemology certification',       '🎓', '#2563EB'),
  ('Jeweler',         'Verified jewelry retail professional',      '💍', '#7C3AED'),
  ('Top Contributor', 'One of our most helpful community members', '⭐', '#D97706'),
  ('First Post',      'Made their first post in the community',    '🌱', '#16A34A'),
  ('Verified Buyer',  'Has purchased a diamond and shared proof',  '✅', '#0891B2')
ON CONFLICT (name) DO NOTHING;

-- ─── Admin Setup ─────────────────────────────────────────────

UPDATE public.profiles
SET is_admin = TRUE
WHERE id = 'fd2ef02d-c2a0-4907-8730-43a5f3fbf996';

-- ─── Deduplicate Posts ────────────────────────────────────────
-- Keeps the OLDEST post per (title, author_id), deletes all later duplicates.
-- Safe to run even if there are no duplicates — will just delete 0 rows.

DELETE FROM public.posts
WHERE id IN (
  SELECT id FROM (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY title, author_id
        ORDER BY created_at ASC, id ASC
      ) AS rn
    FROM public.posts
  ) ranked
  WHERE rn > 1
);

-- ─── Fix NULL is_deleted ──────────────────────────────────────

UPDATE public.posts
SET is_deleted = FALSE
WHERE is_deleted IS NULL;

-- ─── Fix post_count ───────────────────────────────────────────
-- The INSERT trigger only increments — it never decrements on DELETE.
-- This recalculates the true count after any deduplication above.

UPDATE public.communities c
SET post_count = (
  SELECT COUNT(*)
  FROM public.posts p
  WHERE p.community_id = c.id
    AND p.is_deleted = FALSE
);

-- ─── Seed Posts (127 blog posts as community link posts) ──────
-- NOT EXISTS check: each title is only inserted once per author.
-- Safe to re-run — skips any post whose title already exists.

INSERT INTO public.posts (community_id, author_id, title, body, url, type, score, upvotes, is_pinned, created_at)
SELECT
  c.id,
  'fd2ef02d-c2a0-4907-8730-43a5f3fbf996'::uuid,
  v.title,
  v.body,
  v.url,
  'link',
  1, 1, false,
  NOW() - (ROW_NUMBER() OVER () * INTERVAL '2 hours')
FROM public.communities c,
(VALUES
  ('0.5 Carat Round Diamond Price Guide 2026: The Half-Carat Trap', 'Read the full guide at diamondcritics.com', 'https://diamondcritics.com/0-5-carat-round-diamond-price'),
  ('0.75 Carat Round Diamond Price Guide 2026: The Three-Quarter Compromise', 'Read the full guide at diamondcritics.com', 'https://diamondcritics.com/0-75-carat-round-diamond-price'),
  ('1.5 Carat Round Diamond Price Guide 2026 — The $8,500 Sweet Spot Explained', 'How much does a 1.5 carat round diamond cost? GIA Excellent G-VS2 naturals start at $8,430 on Blue Nile. Lab-grown 1.5ct starts at $1,930. Full grade breakdown with live prices and Farzana''s verdict on whether 1.5ct is worth it vs 1ct or 2ct.', 'https://diamondcritics.com/1-5-carat-round-diamond-price'),
  ('1 Carat Diamond Engagement Ring: 2026 Guide', 'Every 1 carat round diamond engagement ring decision — cut, setting, and budget — with real Blue Nile prices from $3,230 and lab alternatives from $1,950.', 'https://diamondcritics.com/1-carat-diamond-engagement-ring'),
  ('1 Carat Round Diamond Price: The Complete 2026 Buyer''s Audit', 'A 1 carat round diamond ranges from $3,200 to over $10,000 — the $6,800 spread hides three traps most buyers fall into. Here is the 2026 price audit with live Blue Nile data.', 'https://diamondcritics.com/1-carat-round-diamond-price'),
  ('2 Carat Diamond Engagement Ring: The Complete 2026 Buyer''s Guide', '2ct round G-VS2 starts at $16,490 on Blue Nile. Lab 2ct D-VVS1 costs $2,810. The 2ct Commitment — every grade priced, every setting compared, real data only.', 'https://diamondcritics.com/2-carat-diamond-engagement-ring'),
  ('2 Carat Round Diamond Price: Complete Guide (2026)', 'A 2ct round diamond costs 3–4× more than two 1ct stones of the same quality. Here is exactly what you pay, what you get, and where the money goes at each tier.', 'https://diamondcritics.com/2-carat-round-diamond-price'),
  ('3 Carat Diamond Engagement Ring: The Complete 2026 Buyer''s Guide', '3ct G-VS2 GIA Excellent starts at $48,780 on Blue Nile. Lab 3ct E-VVS1 IGI costs $5,800. The 3ct Statement — every grade priced, real size data, honest verdict.', 'https://diamondcritics.com/3-carat-diamond-engagement-ring'),
  ('3 Carat Round Diamond Price Guide (2026): What You Actually Pay at Every Grade', 'Real 3 carat round diamond prices from $44,500 to $84,710 natural and $5,800 lab-grown. Full price breakdown by color and clarity with live Blue Nile data, Farzana''s expert picks, and exactly which grade gives you the best value.', 'https://diamondcritics.com/3-carat-round-diamond-price'),
  ('4 Carat Round Diamond Price Guide 2026 — The Statement Diamond Explained', 'How much does a 4 carat round diamond cost? Natural 4ct GIA Excellent starts at $58,110 on Blue Nile. Lab-grown 4ct D-VVS1 starts at $9,680 — an 83% saving. Full grade breakdown, real prices, and Farzana''s verdict on who should buy 4ct.', 'https://diamondcritics.com/4-carat-round-diamond-price'),
  ('5 Carat Round Diamond Price in 2026: Real Costs, Lab vs Natural Guide', '5 carat round diamond: $147,110–$409,260 natural GIA, from $12,730 lab-grown. The Prestige Premium explained with 15 real Blue Nile stones analyzed.', 'https://diamondcritics.com/5-carat-round-diamond-price'),
  ('6 Carat Round Diamond Price: 2026 Buying Guide', 'A 6 carat round diamond starts at $187,650 on Blue Nile. The Six-Figure Threshold: real prices, per-carat math, which specs to target, and the lab option at $18,410.', 'https://diamondcritics.com/6-carat-round-diamond-price'),
  ('7 Carat Round Diamond Price: 2026 Buying Guide', 'A 7 carat round diamond starts at $243,640 on Blue Nile — only 7 GIA Excellent stones available. Real prices, per-carat math, and The Custom Order Diamond explained.', 'https://diamondcritics.com/7-carat-round-diamond-price'),
  ('8 Carat Round Diamond Price: 2026 Buying Guide', 'An 8 carat round diamond starts at $329,500 on Blue Nile — only 6 GIA Excellent stones exist. Real prices, per-carat data, and The Ultra-Rare Tier explained.', 'https://diamondcritics.com/8-carat-round-diamond-price'),
  ('Asscher Cut Diamond: The Complete Buying Guide (2026 Prices, Cut Quality & Clarity Rules)', 'The Asscher cut''s Hall of Mirrors effect demands higher clarity and color grades than brilliant cuts — here is the 2026 data on cut quality, prices, and the step-cut traps buyers miss.', 'https://diamondcritics.com/asscher-cut-diamond'),
  ('Best Round Cut Diamond Engagement Ring: The Complete 2026 Buyer''s Guide', 'The Buyer''s Triangle: cut, color, and clarity — you can only optimize two within any budget. Real Blue Nile data, every price tier audited, best picks across $3K–$50K.', 'https://diamondcritics.com/best-round-cut-diamond-engagement-ring'),
  ('Blue Nile Bracelets Review: The 5-Point Checklist Before You Checkout', 'Hovering over checkout? Read this Blue Nile bracelets review first. Run through our 5-point expert checklist covering clasps, sizing, and diamond clarity.', 'https://diamondcritics.com/blue-nile-bracelets-review'),
  ('Blue Nile Earrings Review: Avoid the 2025 Price Trap (The $1,850 Market Floor)', 'Reading a Blue Nile earrings review in 2026? Stop paying 2025 prices. Capitalize on the 14% market crash, learn the 1.50ct jumbo back hack, and audit the merger.', 'https://diamondcritics.com/blue-nile-earrings-review'),
  ('Blue Nile Lab Grown Diamond Rings Review: I Audited 500+ Stones So You Don''t Waste $2,930–$21,540', 'Blue Nile lab grown diamond rings review with live 2026 prices. I audited 40+ stones from $2,930 to $21,540. Full comparison vs Brilliant Earth & Ritani.', 'https://diamondcritics.com/blue-nile-lab-grown-diamond-rings-review'),
  ('Blue Nile Men''s Bracelets Review: Every Style Analyzed With Live 2026 Prices', 'This review is for men — and partners buying for men — who are looking at Blue Nile''s bracelet catalog with $570 to $40,000 in hand and want a direct answer before buying.', 'https://diamondcritics.com/blue-nile-mens-bracelets-review'),
  ('Blue Nile Men''s Chains Review: I Analyzed Every Chain So You Don''t Waste $615–$40,000', 'Honest Blue Nile men''s chains review for 2026. Cuban links from $615, rope chains from $635, Franco chains, Figaro, Byzantine — real prices, chain type guide, length guide, and who should buy what.', 'https://diamondcritics.com/blue-nile-mens-chains-review'),
  ('Blue Nile Men''s Rings Review: I Analyzed 50+ Rings So You Don''t Waste $800–$5,000', 'Honest Blue Nile men''s rings review for 2026. Real price breakdowns, material comparisons, craftsmanship truth, sizing guide, and who should — and shouldn''t — buy from Blue Nile.', 'https://diamondcritics.com/blue-nile-mens-rings-review'),
  ('Blue Nile Review 2026: Why Most Buyers Overpay (And How to Save Thousands)', 'Discover the truth in our Blue Nile Review 2026. Learn how buyers overpay, avoid costly mistakes, and save thousands on diamonds with expert tips.', 'https://diamondcritics.com/blue-nile-review'),
  ('Cushion Cut Diamond: The Complete 2026 Buying Guide (Crushed Ice vs. Chunky, Prices & Proportions)', 'The complete cushion cut diamond guide for 2026. Live prices from $1,760, crushed ice vs chunky explained, ideal proportions, color retention truth, lab-grown arbitrage, and every question answered.', 'https://diamondcritics.com/cushion-cut-diamond'),
  ('D Color Diamond: Avoid the 30% Fake Purity Trap With the Type IIa Audit', 'Buying a D color diamond in 2026? Stop paying for standard stones. Learn the Type IIa purity secret, avoid the hazy fluorescence trap, and save 30% today.', 'https://diamondcritics.com/d-color-diamond'),
  ('Master the Diamond 4Cs: Save 35% on Your Engagement Ring', 'What are the best diamond 4Cs for your budget? Stop paying for invisible perfection. Learn the GIA proportion hacks to prioritize cut, drop clarity, and save 35% on your engagement ring in 2026.', 'https://diamondcritics.com/diamond-4cs'),
  ('Diamond Color Scale: Stop Paying the D-E-F Luxury Tax', 'Master the GIA diamond color scale with my 2026 visual arbitrage guide. Stop overpaying for D-E-F colors. Learn the BGG nuance and save 30% on your engagement ring.', 'https://diamondcritics.com/diamond-color-scale'),
  ('Diamond Prices 2026: Why 1-Carat Stones Just Dropped 14% to $3,449', 'Are diamond prices 2026 crashing? Yes. My March 2026 data reveals a massive 14% drop in 1-carat stones. Learn why natural prices are falling and how to buy.', 'https://diamondcritics.com/diamond-prices'),
  ('Diamond Shapes Guide: All 10 Shapes Compared by Price, Brilliance, and Value (2026)', 'The complete diamond shapes guide for 2026. All 10 shapes compared by brilliance, price, clarity requirements, finger appearance, and live Blue Nile data. Find your shape before you buy.', 'https://diamondcritics.com/diamond-shapes-guide'),
  ('Diamond Size Chart: Stop Buying Invisible Carats (Save 30% at 6.5mm)', 'Reading a diamond size chart in 2026? Stop paying for invisible weight hidden inside the stone. Learn the 6.5mm rule, the Oval arbitrage, and how to save 30% today.', 'https://diamondcritics.com/diamond-size-chart'),
  ('E Color Diamond: Stop Overpaying for D-Grades (The 15% Arbitrage Hack)', 'Buying an E color diamond in 2026? Stop paying the D-grade luxury tax. Learn the 15% purity arbitrage, avoid lab-grown CVD strain, and master the fluorescence hack.', 'https://diamondcritics.com/e-color-diamond'),
  ('Emerald Cut Diamond: The Complete 2026 Buying Guide (Hall-of-Mirrors, Prices & Clarity Rules)', 'Complete emerald cut diamond guide for 2026. Live prices from $3,350 natural to $2,040 lab-grown, the hall-of-mirrors explained, VS1 clarity rule, ideal L/W ratios, and every question answered.', 'https://diamondcritics.com/emerald-cut-diamond'),
  ('F Color Diamond: Don''t Pay the Colorless Premium (The G-Grade Solution)', 'Buying an F color diamond in 2026? Stop paying for an invisible status. Learn the G-grade solution, the BGG purity audit, and save 15% today.', 'https://diamondcritics.com/f-color-diamond'),
  ('G Color Diamond: Don''t Pay 2025 Prices (The 14% Market Floor Solution)', 'Buying a G color diamond in 2026? Stop overpaying. Capitalize on the 14% market crash, avoid the muddy BGG tint trap, and learn the Blue Nile arbitrage hack today.', 'https://diamondcritics.com/g-color-diamond'),
  ('GIA Certified Round Diamond: Why the Certificate Matters and What to Look For', 'GIA vs IGI vs AGS certification for round diamonds explained — what each certificate covers, why GIA Excellent is the gold standard, and how to read your certificate with real Blue Nile examples from $3,230 to $54,840.', 'https://diamondcritics.com/gia-certified-round-diamond'),
  ('H Color Diamond: Avoid the $7,500 VVS Trap (The $3,250 Market Floor)', 'Buying an H color diamond in 2026? Stop paying 2025 prices. Capitalize on the March price crash, avoid muddy BGG undertones, and secure the $3,449 market floor.', 'https://diamondcritics.com/h-color-diamond'),
  ('Heart Shape Diamond Guide: Cut, Price & The Cleft Symmetry Trap (2026)', 'A heart shape diamond costs 15–20% less than a round brilliant at identical specs — but 60% of hearts fail the cleft symmetry test. Here is the 2026 data.', 'https://diamondcritics.com/heart-shape-diamond'),
  ('Hearts and Arrows Diamond: Is the 2026 Premium Worth It?', 'A jeweler just told you to upgrade to Hearts and Arrows and pay 20% more. Before you do — here is what H&A actually means, how to verify one is real, and when the premium is and is not worth paying.', 'https://diamondcritics.com/hearts-and-arrows-diamond'),
  ('How to Buy a Round Diamond in 2026: The 5-Step Checklist That Saves $3,000+', 'How to buy a round diamond without overpaying — 5 steps from GIA Excellent cut to the G sweet spot to avoiding the VVS trap. Real 1ct prices from $3,230 with Farzana''s complete buying checklist for Blue Nile in 2026.', 'https://diamondcritics.com/how-to-buy-round-diamond'),
  ('How to Read a GIA Diamond Report: Full Field Guide 2026', 'A GIA report has 22+ fields. Most buyers read 4. The other 18 contain 80% of the price-relevant information. Here is every field explained with what to act on.', 'https://diamondcritics.com/how-to-read-gia-diamond-report'),
  ('Lab Grown Round Diamond: The Complete 2026 Price & Buying Guide', 'A lab grown round diamond D-IF Ideal costs $1,560 on Blue Nile in 2026. The equivalent natural diamond costs $7,000+. Here is everything you need to know to buy one correctly — and the one thing most lab diamond guides do not tell you about resale.', 'https://diamondcritics.com/lab-grown-round-diamond'),
  ('Lab Grown vs Natural Diamond Price: The 2026 $0 Resale Trap', 'Comparing lab grown vs natural diamond price in 2026? Stop treating lab diamonds like investments. Discover the $0 resale trap, the HPHT blue nuance secret, and real equity data.', 'https://diamondcritics.com/lab-grown-vs-natural-diamond-price'),
  ('Marquise Cut Diamond Buying Guide: Avoid the Bowtie Trap (2026)', 'The marquise cut delivers 43% more finger coverage per carat than round at 37% lower cost — but the bowtie myth and tip color trap cost buyers thousands. Here is the 2026 data.', 'https://diamondcritics.com/marquise-cut-diamond'),
  ('Oval Cut Diamond: The Complete 2026 Buying Guide (Bow-Tie, Prices & L/W Ratios)', 'Complete oval cut diamond guide for 2026. Live prices from $5,720 natural to $1,790 lab-grown, the bow-tie effect explained, ideal L/W ratios, color tips, and every question answered.', 'https://diamondcritics.com/oval-cut-diamond'),
  ('Pear Cut Diamond: The Complete 2026 Buying Guide (Bow-Tie, Prices & L/W Ratios)', 'Complete pear cut diamond guide for 2026. Live prices from $3,150 natural to $3,060 lab-grown, the bow-tie audit, ideal L/W ratios, and every question answered.', 'https://diamondcritics.com/pear-cut-diamond'),
  ('Princess Cut Diamond: The Complete Buying Guide, Prices & Honest Verdict (2026)', 'Princess cut diamond buying guide 2026. Live prices from $1,860 natural to $1,640 lab-grown, ideal proportions, chevron facets, V-prong rules, chipping truth, and every question answered.', 'https://diamondcritics.com/princess-cut-diamond'),
  ('Radiant Cut Diamond: The Complete 2026 Buying Guide (70 Facets, Prices & Honest Verdict)', 'Complete radiant cut diamond guide for 2026. Live prices from $1,910, 70-facet brilliance explained, ideal proportions, radiant vs cushion vs emerald question answered.', 'https://diamondcritics.com/radiant-cut-diamond'),
  ('Round Cut Diamond: The Complete Buying Guide (2026 Price Data + 57-Facet Truth)', 'Everything about round cut diamonds: 57 facets explained, live 2026 prices from $3,200, ideal proportions, princess cut comparison, lab-grown arbitrage, and the exact specs to buy.', 'https://diamondcritics.com/round-cut-diamond'),
  ('0.9 Carat vs 1 Carat Round Diamond: The $743 Face-Up Trick 2026', 'A 0.90ct round diamond is 6.2mm face-up. A 1ct is 6.4mm. The human eye cannot detect 0.2mm at arm''s length — but the price gap is $743. Here is the math.', 'https://diamondcritics.com/round-diamond-0-9-carat-vs-1-carat'),
  ('1 Carat vs 2 Carat Round Diamond: 2026 Price & Size Comparison', 'A 1ct round is 6.4mm. A 2ct is 8.1mm. The price jumps from $3,230 to $16,490 — a 410% increase for a 60% larger face. Here is The Size Jump Tax with every Blue Nile stone.', 'https://diamondcritics.com/round-diamond-1-carat-vs-2-carat'),
  ('2 Carat vs 3 Carat Round Diamond: 2026 Prices', 'A 2ct round costs $16,490. A 3ct costs $48,780. That''s $32,290 more for 1.3mm more diameter. The Luxury Jump Tax — with every Blue Nile stone priced.', 'https://diamondcritics.com/round-diamond-2-carat-vs-3-carat'),
  ('Round Diamond 4-Prong vs 6-Prong Setting: The Definitive Guide 2026', '4-prong shows more diamond and maximizes sparkle. 6-prong grips tighter and looks rounder. Here is the exact prong math every round diamond buyer needs.', 'https://diamondcritics.com/round-diamond-4-prong-vs-6-prong'),
  ('9 Carat Round Diamond Price: Only 7 Stones Exist on Blue Nile 2026', '9 carat round diamonds start at $329,500 on Blue Nile. Only 7 stones exist in the 8–9ct range. At this tier, every diamond is priced individually. Here is the full guide.', 'https://diamondcritics.com/round-diamond-9-carat-price'),
  ('Round Diamond Anniversary Ring Guide 2026', 'Anniversary rings are diamond bands added to the engagement ring stack on a significant anniversary. Here is exactly how to choose one, which styles stack correctly, and what the right budget is.', 'https://diamondcritics.com/round-diamond-anniversary-ring'),
  ('Round Diamond Bezel Setting Engagement Ring: The Bezel Sparkle Tax 2026', 'Bezel settings cost $990–$1,310 vs $510 for prong solitaires and reduce light return by 8–12%. 20 Blue Nile bezel rings from $990. The Bezel Sparkle Tax: what protection costs, what sparkle costs, and when the trade-off is worth it.', 'https://diamondcritics.com/round-diamond-bezel-setting'),
  ('Round Diamond Buying Checklist: 12-Point Audit 2026', 'The complete 12-point round diamond buying checklist. Every checkpoint with exact pass/fail values — from GIA certificate to video inspection to return policy verification.', 'https://diamondcritics.com/round-diamond-buying-checklist'),
  ('Round Diamond Cathedral Setting: Snag Risk Guide 2026', 'Cathedral settings elevate the center diamond 2–4mm above the band on arched shoulders. The arch is beautiful and introduces a real daily snag risk. Here is exactly when to choose it and when to avoid it.', 'https://diamondcritics.com/round-diamond-cathedral-setting'),
  ('Round Diamond Certification Guide: The Certificate Inflation Scale 2026', 'GIA and AGS grade diamonds strictly. IGI inflates natural stone grades by 1 step. EGL inflates by 1–2 steps. Buying on a non-GIA certificate means paying a higher grade''s price for a lower grade''s stone. Here is the full lab comparison.', 'https://diamondcritics.com/round-diamond-certification-guide'),
  ('Round Diamond Clarity Guide: Which Grade is Eye-Clean in 2026?', 'Exactly which clarity grade is eye-clean for round diamonds — VS1, VS2, SI1, SI2 explained with real price data from $3,230 to $26,610 at 1ct and 2ct. Farzana''s Clarity Cliff and when VVS is a waste of money.', 'https://diamondcritics.com/round-diamond-clarity-guide'),
  ('Round Diamond Color Guide: The Best Color Grade to Buy in 2026', 'Exactly which color grade to buy for a round diamond — D vs E vs F vs G vs H explained with real prices from $3,230 to $3,790 at 1 carat. Farzana''s verdict on the G Sweet Spot and when color actually matters.', 'https://diamondcritics.com/round-diamond-color-guide'),
  ('Round Diamond Crown Angle in 2026: The Scintillation Gate Explained', 'Round diamond crown angle: 34–35° is the Scintillation Gate for maximum fire. Below 32° causes fisheye. Above 36.5° causes nailhead. How to verify on your GIA report.', 'https://diamondcritics.com/round-diamond-crown-angle'),
  ('Round Diamond Culet in 2026: Why No Culet or Pointed Wins Every Time', 'Round diamond culet: None or Pointed is the only correct answer. Medium+ culets create The Pinhole Effect — a dark circle visible to the naked eye. Price data and GIA standards explained.', 'https://diamondcritics.com/round-diamond-culet'),
  ('Round Diamond D Color Guide: The True Colorless Test 2026', 'D-VS2 at 1ct costs $3,790 — only $560 more than G-VS2. At 2ct, the D premium hits $10,000. At 2ct D-FL: $54,840. The True Colorless Test: when D is worth it and when G wins.', 'https://diamondcritics.com/round-diamond-d-color-guide'),
  ('D Color vs G Color Round Diamond: 2026 Price Comparison', 'At 1ct, D color costs $560 more than G. At 2ct, the gap is $10,000. Both appear colorless in white gold. Here is The Colorless Premium — with every Blue Nile stone.', 'https://diamondcritics.com/round-diamond-d-color-vs-g-color'),
  ('Round Diamond Depth Percentage Guide 2026 — The Deep-Cut Trap and Ideal Range', 'What depth percentage should a round diamond be? Ideal range is 59–62.3% for GIA Excellent. Diamonds above 63% depth look small for their carat weight. Real price examples showing the Deep-Cut Trap and how to avoid it on Blue Nile.', 'https://diamondcritics.com/round-diamond-depth-percentage'),
  ('Round Diamond E vs F Color: The Near-Colorless Ceiling 2026', 'E-VS2 costs $3,540 at 1ct. F-VS2 costs $3,490 — a $50 gap. At 2ct, E and F overlap in the $26,510–$27,310 band. Here is The Near-Colorless Ceiling with every Blue Nile stone.', 'https://diamondcritics.com/round-diamond-e-vs-f-color'),
  ('Best Round Diamond Engagement Ring Settings: The 2026 Guide', 'The wrong ring setting does not just look bad — it can make a $4,000 diamond look like a $900 stone, or hide a great stone behind visual noise. Here is the complete 2026 guide to round diamond settings with real Blue Nile data.', 'https://diamondcritics.com/round-diamond-engagement-ring-settings'),
  ('Round Diamond Engagement Ring Under $3,000: The Complete 2026 Guide', 'Lab 2ct D-VVS1 IGI costs $2,810 on Blue Nile. Lab 1.5ct D-VVS1 costs $1,950. The $3,000 Diamond Window — maximum size and quality for a tight budget, real data only.', 'https://diamondcritics.com/round-diamond-engagement-ring-under-3000'),
  ('Round Diamond Engagement Ring Under $7000: The $7K Crossover 2026', 'At $7,000 you cross from 1ct into 1.25ct territory — or from H color into F with the same stone. 8 Blue Nile ring combinations under $7K with full price data. The $7K Crossover explained.', 'https://diamondcritics.com/round-diamond-engagement-ring-under-7000'),
  ('Round Diamond Eye-Clean Guide: The Eye-Clean Audit 2026', 'VS2 is eye-clean 85–95% of the time in round brilliants. SI1 is eye-clean only 70% at 1ct. Here is The Eye-Clean Audit — how to verify any stone before buying.', 'https://diamondcritics.com/round-diamond-eye-clean-guide'),
  ('F vs G Color Round Diamond: 2026 Price Data', 'F color costs $260 more than G at 1ct. At 2ct it costs $1,650 more. At 3ct it''s $11,010 more. The Colorless Entry Tax — with every Blue Nile F and G stone priced.', 'https://diamondcritics.com/round-diamond-f-vs-g-color'),
  ('Round Diamond Face-Up Size Chart (MM) 2026', 'The complete MM face-up diameter chart for round brilliant diamonds from 0.25ct to 10ct. Every carat weight, typical diameter, and how cut quality affects visible size.', 'https://diamondcritics.com/round-diamond-face-up-size-guide'),
  ('Round Diamond Fluorescence Guide: Save 5–15% 2026', 'Strong Blue fluorescence discounts a diamond 5–15% with zero visible effect in indoor LED lighting. Here is exactly when fluorescence saves money and when it costs you.', 'https://diamondcritics.com/round-diamond-fluorescence-guide'),
  ('Round Diamond Fluorescence: The Complete Buying Guide (2026)', 'Strong Blue fluorescence discounts a round diamond by 15–25%. In G-H color, that discount is free money. In D-F color, it can ruin the stone. Here is exactly how to read fluorescence on a GIA report.', 'https://diamondcritics.com/round-diamond-fluorescence'),
  ('G vs H Color Round Diamond: 2026 Visual Test and Price Data', 'G-VS2 at 1ct costs $3,230. H-VS2 costs approximately $2,750–$2,900 — saving $330–$480. At 2ct, the gap grows to $2,500–$3,000. When does H color make sense? Real Blue Nile data by Farzana Hasan.', 'https://diamondcritics.com/round-diamond-g-vs-h-color'),
  ('GIA vs IGI for Round Diamonds in 2026 — Which Certificate Actually Matters?', 'GIA vs IGI for round diamonds: GIA is the only credible certificate for natural diamonds. IGI is acceptable for lab-grown. The Certificate Arbitrage: a lab-grown IGI D-VVS1 at $1,950 delivers what a natural GIA G-VS2 costs $3,230 to achieve. Full comparison with real Blue Nile prices.', 'https://diamondcritics.com/round-diamond-gia-vs-igi'),
  ('Round Diamond Girdle Thickness in 2026: The Invisible Weight Trap', 'Round diamond girdle thickness: Very Thick girdles hide 5–7% of carat weight, making stones appear smaller than their weight. GIA grades, ideal range, and how to check.', 'https://diamondcritics.com/round-diamond-girdle-thickness'),
  ('Round Diamond H vs I Color: The I-Color Boundary 2026', 'H-VS2 at 1ct saves $330–$480 vs G-VS2. I-VS2 saves another $300–$450 vs H — $700–$930 total. In yellow gold, I color is invisible. Here is The I-Color Boundary with full data.', 'https://diamondcritics.com/round-diamond-h-vs-i-color'),
  ('Round Diamond Halo vs Solitaire: Which Ring Should You Buy?', 'Halo rings make a 1ct diamond look 30% larger but cost $800–$2,000 more and lock you into one style. Here''s the honest trade-off so you can choose correctly.', 'https://diamondcritics.com/round-diamond-halo-vs-solitaire'),
  ('How to Compare Round Diamonds Online: Step-by-Step 2026', 'Five steps every online round diamond buyer must follow before clicking buy. Certificate filter, proportion filters, 360° video, per-carat price, return policy.', 'https://diamondcritics.com/round-diamond-how-to-compare-online'),
  ('Round Diamond Ideal Proportions: The Complete Guide (2026)', 'GIA Excellent is a broad range, not a single standard. Within that range, some rounds return 95% of light while others return 75%. These proportion numbers tell you exactly which stones perform at the top.', 'https://diamondcritics.com/round-diamond-ideal-proportions'),
  ('Round Diamond IF and FL Clarity: The FL Tax 2026', 'A 2ct D-FL costs $54,840 versus $26,490 for D-VS2 — a $28,350 premium for clarity that disappears under the ring prong. Here is The FL Tax with every Blue Nile stone.', 'https://diamondcritics.com/round-diamond-if-fl-clarity'),
  ('Round Diamond Inclusion Types: Full Risk Guide 2026', '11 inclusion types ranked by structural risk, optical impact, and eye-visibility. Feathers can compromise durability. Clouds not shown on GIA plots can ruin a stone. Here is the full hierarchy.', 'https://diamondcritics.com/round-diamond-inclusions-types'),
  ('Are Round Diamonds a Good Investment? The Honest Answer 2026', 'Round diamonds are not investments. They lose 40–60% of value the moment you buy. Here is the real resale math on a $16,490 diamond and what to do instead.', 'https://diamondcritics.com/round-diamond-investment-value'),
  ('Round Diamond Length to Width Ratio: The Perfect Circle Rule', 'Round diamonds should have a 1.00–1.01 L:W ratio for a true circle face-up. A 1.04+ looks oval. Here''s how to check it and why GIA Excellent doesn''t guarantee it.', 'https://diamondcritics.com/round-diamond-length-to-width-ratio'),
  ('Round Diamond Men''s Ring Guide 2026', 'Men''s diamond wedding rings range from subtle pavé edge bands to full-channel statement rings. Here is every style, metal choice, and price tier with current Blue Nile inventory data.', 'https://diamondcritics.com/round-diamond-mens-ring'),
  ('Round Diamond Natural vs Lab Grown: The 2026 Buyer''s Decision Guide', 'Natural 1ct G-VS2 costs $3,230. Lab 2ct D-VVS1 costs $2,810. The Origin Tax is real and quantified — here is exactly when it is worth paying and when it is not. Real Blue Nile data by Farzana Hasan.', 'https://diamondcritics.com/round-diamond-natural-vs-lab'),
  ('Round Diamond Pavé Engagement Ring: The Pavé Upgrade Trap 2026', 'Pavé engagement ring shanks add $350–$3,000 over a plain solitaire. This guide breaks down every pavé style (micropavé, French, scalloped, fishtail), every price tier from $1,200 to $3,925, and exactly when the upgrade is worth it — and when it is not.', 'https://diamondcritics.com/round-diamond-pave-engagement-ring'),
  ('Round Diamond Pavilion Angle in 2026: The Return Gate Explained', 'Round diamond pavilion angle: 40.6–41.0° is The Return Gate for maximum light return. Below 40° leaks light; above 41.8°: nailhead. GIA Excellent guide with real prices.', 'https://diamondcritics.com/round-diamond-pavilion-angle'),
  ('Round Diamond Platinum vs White Gold Engagement Ring: The Platinum Premium Myth 2026', 'Platinum costs $380–$964 more than 14K white gold for the same ring. Is it worth it? The Platinum Premium Myth: 8 setting pairs compared with full price data and Blue Nile affiliate links.', 'https://diamondcritics.com/round-diamond-platinum-vs-white-gold'),
  ('Round Diamond Polish in 2026: Does GIA Excellent Polish Actually Matter?', 'Round diamond polish: Very Good polish performs the same as Excellent in real-world conditions. The Polish Premium Myth costs buyers 3–5% with zero visual benefit. Data and GIA standards explained.', 'https://diamondcritics.com/round-diamond-polish'),
  ('Round Diamond Price Per Carat Chart: The Per-Carat Multiplier 2026', '1ct G-VS2 costs $3,230/ct. 2ct G-VS2 costs $8,245/ct. 6ct costs $31,108/ct. Here is The Per-Carat Multiplier — every Blue Nile per-carat rate from 1ct to 6ct.', 'https://diamondcritics.com/round-diamond-price-per-carat-chart'),
  ('Round Diamond Resale Value: The 50-Cent Dollar 2026', 'Natural round diamonds resell at 40–50% of retail. Lab-grown: 10–20%. A 2ct G-VS2 bought for $16,490 returns $6,596–$8,245 on resale. Here is The 50-Cent Dollar.', 'https://diamondcritics.com/round-diamond-resale-value'),
  ('Round Diamond Right Hand Ring: The RHR Rule 2026', 'Right-hand rings follow their own visual grammar — bolder design, smaller center stone, contrasting metal. Here is what The RHR Rule means, what settings work best, and where Blue Nile right-hand ring options start at $825.', 'https://diamondcritics.com/round-diamond-right-hand-ring'),
  ('Round Diamond Rose Gold Engagement Ring: The Rose Gold Color Trap 2026', 'Rose gold masks I color completely — same $730 saving as yellow gold. 20 Blue Nile rose gold settings from $730. The Rose Gold Color Trap: buyers overpay for color they don''t need.', 'https://diamondcritics.com/round-diamond-rose-gold-engagement-ring'),
  ('Round Diamond SI1 Clarity — Is It Eye-Clean in 2026? The 70% Rule Explained', 'Is SI1 clarity eye-clean for a round diamond? 70% of SI1 rounds are eye-clean at 1ct — but 30% are not. What makes the difference, how to tell before you buy, and when to upgrade to VS2. Real Blue Nile prices from $2,680.', 'https://diamondcritics.com/round-diamond-si1-eye-clean'),
  ('Round Diamond SI2 Clarity: Is It Eye-Clean in 2026? The Risk Assessment', 'SI2 saves $730–$1,030 over VS2 at 1ct — but only 30–40% of SI2 rounds are eye-clean. The SI2 Gamble explained with Blue Nile price data, inclusion types, carat weight risk, and when to walk away. By Farzana Hasan.', 'https://diamondcritics.com/round-diamond-si2-clarity'),
  ('Round Diamond Size Chart: Every Carat Weight to Scale (2026)', 'A 1ct round diamond is 6.5mm. A 2ct is 8.2mm. A 3ct is 9.4mm. This chart maps every major carat weight to its actual face-up millimeter size, with live prices at each level.', 'https://diamondcritics.com/round-diamond-size-chart'),
  ('Round Diamond Solitaire Ring: The Complete Guide', 'A solitaire strips every crutch away — no halo, no melee, no distraction. It is the ultimate performance test for cut quality. Here is every decision, with live Blue Nile prices.', 'https://diamondcritics.com/round-diamond-solitaire-ring'),
  ('Round Diamond Symmetry in 2026: EX vs VG and The EX/VG/VG Rule', 'Round diamond symmetry: GIA Very Good symmetry performs the same as Excellent in real-world conditions. The EX/VG/VG Rule and what symmetry deviations actually cost you. Real price data.', 'https://diamondcritics.com/round-diamond-symmetry'),
  ('Round Diamond Table Percentage Guide 2026 — The Flash Trap and Ideal Range', 'What table percentage should a round diamond have? Ideal range is 54–57% for balanced fire and brilliance. Large tables above 58% kill fire — the colored rainbow flashes that distinguish a premium round brilliant. Real price examples from Blue Nile.', 'https://diamondcritics.com/round-diamond-table-percentage'),
  ('Round Diamond Three Stone Ring: The Complete 2026 Guide', 'Round diamond three-stone rings: past, present, future symbolism with real Blue Nile price data. Center stone ratios, flanker selection, metal choices, and budget builds from $5,500 to $25,000. By Farzana Hasan.', 'https://diamondcritics.com/round-diamond-three-stone-ring'),
  ('Round Diamond Engagement Ring Under $1000 2026: The $1K Lab Gate', 'Read the full guide at diamondcritics.com', 'https://diamondcritics.com/round-diamond-under-1000'),
  ('Best Round Diamond Under $10,000: 2026 Buying Guide', 'At $10,000, you can buy a GIA Excellent 1ct G-VS2 with a platinum setting — or a lab-grown 4ct D-VVS1 for $9,680. Here''s the $10K Threshold explained with real stones.', 'https://diamondcritics.com/round-diamond-under-10000'),
  ('Round Diamond Engagement Ring Under $2000 2026: The $2K Lab Leap', 'Read the full guide at diamondcritics.com', 'https://diamondcritics.com/round-diamond-under-2000'),
  ('Best Round Diamond Under $5,000: 2026 Buying Guide', 'At $5,000, you can buy a GIA Excellent 1ct G-VS2 for $3,230 and still have ring budget left. Or a lab-grown 2ct for $2,810. Here''s the $5K Sweet Spot explained.', 'https://diamondcritics.com/round-diamond-under-5000'),
  ('Round Diamond Video Inspection: The Video Mandate 2026', 'GIA Excellent and perfect proportions do not guarantee a beautiful diamond. 360° video reveals dark centers, extinction zones, and haze that numbers miss. Here is what to look for.', 'https://diamondcritics.com/round-diamond-video-inspection-guide'),
  ('Round Diamond Vintage Engagement Ring: The Vintage Setting Premium 2026', 'Vintage engagement ring settings add milgrain, filigree, hand-engraving, and Art Deco geometric details for $1,100–$3,940. This guide breaks down every vintage technique, every price tier, which details justify the premium, and when the plain solitaire wins.', 'https://diamondcritics.com/round-diamond-vintage-engagement-ring'),
  ('Round Diamond vs Asscher Cut: Which to Buy in 2026?', 'Round diamond vs Asscher cut compared on sparkle, the Window Effect, clarity requirements, and price. A 1ct round G-VS2 GIA Excellent starts at $3,230 vs Asscher at ~$2,100–$2,500. Asscher needs VVS2 clarity to look clean — the Clarity Tax is even steeper than emerald.', 'https://diamondcritics.com/round-diamond-vs-asscher-cut'),
  ('Round Diamond vs Cushion Cut: Which Should You Buy in 2026?', 'Round diamond vs cushion cut compared on brilliance, price, size, and the Crushed Ice Effect. Real price data from Blue Nile — 1ct round $3,230 vs cushion cut difference explained with Farzana''s expert verdict.', 'https://diamondcritics.com/round-diamond-vs-cushion-cut'),
  ('Round Diamond vs Emerald Cut: Which to Buy in 2026?', 'Round diamond vs emerald cut compared on brilliance, clarity requirements, price, and the Clarity Tax. A 1ct round G-VS2 starts at $3,230 vs emerald G-VS1 at $2,600. Farzana''s verdict on which cut wins at every budget.', 'https://diamondcritics.com/round-diamond-vs-emerald-cut'),
  ('Round Diamond vs Heart Shape in 2026: Which Should You Buy?', 'Round diamond vs heart shape: round wins on light performance and value. Heart shapes need F-G color and VS1 clarity vs G-H/VS2 for round. The Romance Tax explained.', 'https://diamondcritics.com/round-diamond-vs-heart-shape'),
  ('Round Diamond vs Marquise Cut in 2026: Size, Price, and Trade-Offs', 'Round vs marquise cut: marquise faces up 10–15% larger per carat but 40–50% have bow-tie. The Elongation Trade-Off — real price data and which cut to buy.', 'https://diamondcritics.com/round-diamond-vs-marquise'),
  ('Round Diamond vs Moissanite: Full 2026 Comparison', 'Round diamond vs moissanite compared on fire, hardness, price, and long-term value. Real Blue Nile prices versus Charles & Colvard data.', 'https://diamondcritics.com/round-diamond-vs-moissanite'),
  ('Round Diamond vs Old European Cut: Modern Brilliant vs Vintage 2026', 'Old European Cut diamonds cost 20–30% less than modern rounds but cannot earn a GIA Excellent grade. Here is exactly what you trade and what you gain.', 'https://diamondcritics.com/round-diamond-vs-old-european-cut'),
  ('Round Diamond vs Oval Diamond: The 2026 Verdict Nobody Gives You', 'Every ''round vs oval'' article ends with ''it''s personal preference.'' Mine doesn''t. One shape wins on sparkle, one wins on price, and the bow-tie problem affects over half of all ovals sold. Here is the actual verdict.', 'https://diamondcritics.com/round-diamond-vs-oval-diamond'),
  ('Round Diamond vs Pear Shape in 2026: The Teardrop Compromise', 'Round diamond vs pear shape: pear faces up 5–10% larger per carat with a flattering elongated silhouette. The Teardrop Compromise — bow-tie risk, tip color, price data, and when to buy each.', 'https://diamondcritics.com/round-diamond-vs-pear-shape'),
  ('Round Diamond vs Princess Cut: Which Should You Buy? (2026)', 'Princess cut is 20–40% cheaper than round per carat. Round brilliant returns more light and costs less to set. The choice between them depends on four specific factors — not personal preference alone.', 'https://diamondcritics.com/round-diamond-vs-princess-cut'),
  ('Round Diamond vs Radiant Cut: Which to Buy in 2026?', 'Round diamond vs radiant cut compared on sparkle, price, cut grade, and resale value. A 1ct round G-VS2 GIA Excellent starts at $3,230. Radiant cuts are 15-25% cheaper but carry no GIA cut grade — Farzana''s verdict on which is the better buy.', 'https://diamondcritics.com/round-diamond-vs-radiant-cut'),
  ('Round Diamond VS1 vs VS2: The VS Split (2026)', 'VS1 costs $70 more than VS2 at 1ct. At 2ct it costs $5,970 more. Same eye result either way. Every Blue Nile G-VS1 and G-VS2 priced and audited.', 'https://diamondcritics.com/round-diamond-vs1-vs-vs2'),
  ('VVS vs VS2 Round Diamond: 2026 Clarity Comparison', 'At 1ct, VVS2 costs $420 more than VS2. At 2ct, the gap is $10,000. Neither is visible to the naked eye. Here is The Invisible Clarity Tax — with every Blue Nile stone.', 'https://diamondcritics.com/round-diamond-vvs-vs-vs2'),
  ('Round Diamond VVS1 vs VVS2 Clarity: The VVS Divide 2026', 'VVS1 costs $4,720 more than VVS2 at 2ct D-color. Neither is visible to the naked eye. Here is The VVS Divide — every Blue Nile stone, full price data.', 'https://diamondcritics.com/round-diamond-vvs1-vs-vvs2'),
  ('Round Diamond Yellow Gold Engagement Ring: The Yellow Gold Color Hack 2026', 'Yellow gold masks I color completely — saving $730 vs G-VS2. 20 Blue Nile yellow gold settings from $860. The Yellow Gold Color Hack: buy less color, spend more on ring.', 'https://diamondcritics.com/round-diamond-yellow-gold-engagement-ring'),
  ('SI Clarity Diamond: The $1,140 Saving, the 70% Eye-Clean Rule, and the Full 2026 Audit Guide', 'What is an SI clarity diamond? Live 2026 data: natural G-SI1 from $2,840, lab SI1 from $730. The 70% eye-clean rule, SI1 vs SI2 breakdown, shape-by-shape audit guide, and exactly when SI saves you $1,140 over VS1.', 'https://diamondcritics.com/si-clarity-diamond'),
  ('VS1 Clarity Diamonds: The $850 Sweet Spot Nobody Tells You About', 'VS1 clarity diamonds are the eye-clean sweet spot of 2026. Live price data from $4,590 natural to $740 lab-grown, shape rules, inclusion types, and the exact decision matrix to buy smart.', 'https://diamondcritics.com/vs1-clarity-diamonds'),
  ('VS2 Clarity Diamond: Is It Really Eye-Clean? The $610 Audit Rule (2026)', 'Is a VS2 clarity diamond actually eye-clean? Live 2026 data from $3,980 natural to $750 lab-grown, the 85% eye-clean rule, shape-by-shape audit guide, and exactly when VS2 beats VS1.', 'https://diamondcritics.com/vs2-clarity-diamond'),
  ('What Is a Round Brilliant Cut Diamond: The 57-Facet System 2026', 'A round brilliant diamond has 57 facets arranged to redirect every photon entering the table directly back to the viewer''s eye. Tolkowsky defined the ideal in 1919. GIA still grades by those proportions. Here is the complete guide.', 'https://diamondcritics.com/what-is-round-brilliant-cut-diamond')
) AS v(title, body, url)
WHERE c.slug = 'diamonds'
  AND NOT EXISTS (
    SELECT 1 FROM public.posts existing
    WHERE existing.title = v.title
      AND existing.author_id = 'fd2ef02d-c2a0-4907-8730-43a5f3fbf996'::uuid
  );

-- ─── Welcome Post (pinned, keyword-rich) ─────────────────────
-- Only inserts if this post title doesn't already exist.

INSERT INTO public.posts (community_id, author_id, title, body, type, score, upvotes, is_pinned, is_deleted, created_at)
SELECT
  c.id,
  'fd2ef02d-c2a0-4907-8730-43a5f3fbf996'::uuid,
  'Welcome to Diamond Community — Real Advice From a GIA-Certified Expert',
  E'Hi everyone — I''m Farzana Hasan, GIA-certified diamond expert and founder of DiamondCritics.com. Welcome to the Diamond Community.\n\nThis is the place to ask real questions and get real answers about diamonds. No salespeople, no commission bias — just honest advice from people who know diamonds.\n\n**What you can ask here:**\n- Cut, color, clarity, and carat questions — the full 4Cs\n- GIA vs IGI certification comparisons\n- Natural vs lab-grown diamond comparisons\n- Engagement ring settings and styles\n- Price checks — is this diamond good value?\n- Blue Nile, James Allen, Brilliant Earth comparisons\n- Reading your GIA diamond report\n- Round, oval, cushion, emerald, princess cut differences\n- Hearts and Arrows, ideal cut, proportions\n- Fluorescence — when it saves money and when to avoid it\n\n**My quick buying rules (the ones I tell every buyer):**\n1. Cut is everything. GIA Excellent only. Never compromise here.\n2. G color in white gold. H in yellow or rose gold. You cannot see the difference vs D.\n3. VS2 clarity for most people. SI1 if you watch the video and it''s eye-clean.\n4. Lab-grown saves 60–80%. For a 2ct diamond, that''s $10,000+ in your pocket.\n5. Always get a GIA certificate for natural diamonds. IGI is fine for lab-grown.\n\nI post guides here daily from diamondcritics.com. Browse the posts, ask questions in comments, or start a new post with your specific situation.\n\nI answer every question personally. Drop your question below.',
  'text',
  50, 50, true, false,
  NOW() - INTERVAL '300 hours'
FROM public.communities c
WHERE c.slug = 'diamonds'
  AND NOT EXISTS (
    SELECT 1 FROM public.posts existing
    WHERE existing.title = 'Welcome to Diamond Community — Real Advice From a GIA-Certified Expert'
      AND existing.author_id = 'fd2ef02d-c2a0-4907-8730-43a5f3fbf996'::uuid
  );

-- ─── Final post_count sync ────────────────────────────────────
-- Recalculates again after all inserts to ensure accuracy.

UPDATE public.communities c
SET post_count = (
  SELECT COUNT(*)
  FROM public.posts p
  WHERE p.community_id = c.id
    AND p.is_deleted = FALSE
);
