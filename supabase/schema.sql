-- ============================================================
-- DiamondCritics Community — Full Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Tables ─────────────────────────────────────────────────

CREATE TABLE public.profiles (
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

CREATE TABLE public.communities (
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

CREATE TABLE public.community_members (
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (community_id, user_id)
);

CREATE TABLE public.posts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id  UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  author_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title         TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 300),
  body          TEXT CHECK (char_length(body) <= 40000),
  url           TEXT CHECK (url IS NULL OR url ~ '^https?://'),
  image_url     TEXT CHECK (image_url IS NULL OR image_url ~ '^https?://'),
  type          TEXT NOT NULL CHECK (type IN ('text', 'link', 'image')) DEFAULT 'text',
  score         INTEGER DEFAULT 1 NOT NULL,
  upvotes       INTEGER DEFAULT 1 NOT NULL,
  downvotes     INTEGER DEFAULT 0 NOT NULL,
  comment_count INTEGER DEFAULT 0 NOT NULL,
  is_deleted    BOOLEAN DEFAULT FALSE NOT NULL,
  is_pinned     BOOLEAN DEFAULT FALSE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.post_votes (
  post_id    UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote       SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE public.comments (
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

CREATE TABLE public.comment_votes (
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote       SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
  PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE public.badges (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#C6973E',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.user_badges (
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id   UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  awarded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, badge_id)
);

-- ─── Indexes ─────────────────────────────────────────────────

CREATE INDEX idx_posts_community   ON public.posts(community_id, created_at DESC);
CREATE INDEX idx_posts_author      ON public.posts(author_id);
CREATE INDEX idx_posts_score       ON public.posts(score DESC);
CREATE INDEX idx_comments_post     ON public.comments(post_id, created_at ASC);
CREATE INDEX idx_comments_parent   ON public.comments(parent_id);
CREATE INDEX idx_post_votes_user   ON public.post_votes(user_id);
CREATE INDEX idx_comment_votes_user ON public.comment_votes(user_id);

-- ─── Row Level Security ───────────────────────────────────────

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_votes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_votes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges     ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- Communities (public read, admin write)
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

-- Community members
CREATE POLICY "members_select"  ON public.community_members FOR SELECT USING (true);
CREATE POLICY "members_insert"  ON public.community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members_delete"  ON public.community_members FOR DELETE USING (auth.uid() = user_id);

-- Posts (public read, auth insert, author/admin update/delete)
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

-- Post votes
CREATE POLICY "post_votes_select" ON public.post_votes FOR SELECT USING (true);
CREATE POLICY "post_votes_insert" ON public.post_votes FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_banned = TRUE)
);
CREATE POLICY "post_votes_update" ON public.post_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "post_votes_delete" ON public.post_votes FOR DELETE USING (auth.uid() = user_id);

-- Comments
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

-- Comment votes
CREATE POLICY "comment_votes_select" ON public.comment_votes FOR SELECT USING (true);
CREATE POLICY "comment_votes_insert" ON public.comment_votes FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_banned = TRUE)
);
CREATE POLICY "comment_votes_update" ON public.comment_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comment_votes_delete" ON public.comment_votes FOR DELETE USING (auth.uid() = user_id);

-- Badges (public read, admin write)
CREATE POLICY "badges_select" ON public.badges FOR SELECT USING (true);
CREATE POLICY "badges_admin"  ON public.badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- User badges (public read, admin write)
CREATE POLICY "user_badges_select" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "user_badges_admin"  ON public.user_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ─── Functions & Triggers ────────────────────────────────────

-- Auto-create profile on sign-up
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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Post vote score trigger
CREATE OR REPLACE FUNCTION public.update_post_score()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET
      score     = score + NEW.vote,
      upvotes   = upvotes   + CASE WHEN NEW.vote =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes + CASE WHEN NEW.vote = -1 THEN 1 ELSE 0 END
    WHERE id = NEW.post_id;
    UPDATE profiles SET post_karma = post_karma + NEW.vote
    WHERE id = (SELECT author_id FROM posts WHERE id = NEW.post_id);

  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE posts SET
      score     = score + (NEW.vote - OLD.vote),
      upvotes   = upvotes   + CASE WHEN NEW.vote =  1 THEN 1 WHEN OLD.vote =  1 THEN -1 ELSE 0 END,
      downvotes = downvotes + CASE WHEN NEW.vote = -1 THEN 1 WHEN OLD.vote = -1 THEN -1 ELSE 0 END
    WHERE id = NEW.post_id;
    UPDATE profiles SET post_karma = post_karma + (NEW.vote - OLD.vote)
    WHERE id = (SELECT author_id FROM posts WHERE id = NEW.post_id);

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET
      score     = score - OLD.vote,
      upvotes   = upvotes   - CASE WHEN OLD.vote =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes - CASE WHEN OLD.vote = -1 THEN 1 ELSE 0 END
    WHERE id = OLD.post_id;
    UPDATE profiles SET post_karma = post_karma - OLD.vote
    WHERE id = (SELECT author_id FROM posts WHERE id = OLD.post_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_post_vote
  AFTER INSERT OR UPDATE OR DELETE ON public.post_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_score();

-- Comment vote score trigger
CREATE OR REPLACE FUNCTION public.update_comment_score()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET
      score     = score + NEW.vote,
      upvotes   = upvotes   + CASE WHEN NEW.vote =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes + CASE WHEN NEW.vote = -1 THEN 1 ELSE 0 END
    WHERE id = NEW.comment_id;
    UPDATE profiles SET comment_karma = comment_karma + NEW.vote
    WHERE id = (SELECT author_id FROM comments WHERE id = NEW.comment_id);

  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE comments SET
      score     = score + (NEW.vote - OLD.vote),
      upvotes   = upvotes   + CASE WHEN NEW.vote =  1 THEN 1 WHEN OLD.vote =  1 THEN -1 ELSE 0 END,
      downvotes = downvotes + CASE WHEN NEW.vote = -1 THEN 1 WHEN OLD.vote = -1 THEN -1 ELSE 0 END
    WHERE id = NEW.comment_id;
    UPDATE profiles SET comment_karma = comment_karma + (NEW.vote - OLD.vote)
    WHERE id = (SELECT author_id FROM comments WHERE id = NEW.comment_id);

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET
      score     = score - OLD.vote,
      upvotes   = upvotes   - CASE WHEN OLD.vote =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes - CASE WHEN OLD.vote = -1 THEN 1 ELSE 0 END
    WHERE id = OLD.comment_id;
    UPDATE profiles SET comment_karma = comment_karma - OLD.vote
    WHERE id = (SELECT author_id FROM comments WHERE id = OLD.comment_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_comment_vote
  AFTER INSERT OR UPDATE OR DELETE ON public.comment_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_comment_score();

-- Comment count trigger
CREATE OR REPLACE FUNCTION public.update_comment_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    UPDATE communities SET post_count = post_count + 0 WHERE id = (SELECT community_id FROM posts WHERE id = NEW.post_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_comment_insert
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comment_count();

-- Post count trigger
CREATE OR REPLACE FUNCTION public.update_post_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities SET post_count = post_count + 1 WHERE id = NEW.community_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_insert
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_post_count();

-- Member count trigger
CREATE OR REPLACE FUNCTION public.update_member_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.community_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_membership_change
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION public.update_member_count();

-- ─── Seed Data ───────────────────────────────────────────────

INSERT INTO public.communities (slug, name, description, rules) VALUES
  ('diamonds', 'Diamonds', 'Everything about diamonds — quality, pricing, GIA reports, buying advice, and more.',
   '1. Be respectful to all members
2. No spam or self-promotion links
3. Provide sources for price claims
4. No buying/selling posts
5. Include diamond specs when asking for advice (carat, cut, color, clarity)');

INSERT INTO public.badges (name, description, icon, color) VALUES
  ('Diamond Expert',   'Verified diamond industry professional',    '💎', '#C6973E'),
  ('GIA Certified',    'Holds a GIA gemology certification',        '🎓', '#2563EB'),
  ('Jeweler',          'Verified jewelry retail professional',       '💍', '#7C3AED'),
  ('Top Contributor',  'One of our most helpful community members',  '⭐', '#D97706'),
  ('First Post',       'Made their first post in the community',     '🌱', '#16A34A'),
  ('Verified Buyer',   'Has purchased a diamond and shared proof',   '✅', '#0891B2');
