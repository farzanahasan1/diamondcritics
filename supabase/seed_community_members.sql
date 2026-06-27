-- ============================================================
-- Add all 9 seed users as members of the 'diamonds' community
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

DO $$
DECLARE
  comm UUID;
  u1 UUID; u2 UUID; u3 UUID; u4 UUID; u5 UUID;
  u6 UUID; u7 UUID; u8 UUID; u9 UUID;
BEGIN
  -- Get community
  SELECT id INTO comm FROM public.communities WHERE slug = 'diamonds' LIMIT 1;
  IF comm IS NULL THEN
    RAISE EXCEPTION 'Community slug=diamonds not found.';
  END IF;

  -- Get user IDs by email
  SELECT id INTO u1 FROM auth.users WHERE email = 'auburndazzle@gmail.com';
  SELECT id INTO u2 FROM auth.users WHERE email = 'farzanatoma111@gmail.com';
  SELECT id INTO u3 FROM auth.users WHERE email = 'farzanatoma001@gmail.com';
  SELECT id INTO u4 FROM auth.users WHERE email = 'ironsidesgroup@gmail.com';
  SELECT id INTO u5 FROM auth.users WHERE email = 'mehedihasan.linkedin@gmail.com';
  SELECT id INTO u6 FROM auth.users WHERE email = 'mh6222134567@gmail.com';
  SELECT id INTO u7 FROM auth.users WHERE email = 'eh744713@gmail.com';
  SELECT id INTO u8 FROM auth.users WHERE email = 'mh62221345@gmail.com';
  SELECT id INTO u9 FROM auth.users WHERE email = 'seo.ravi.agency@gmail.com';

  -- Insert memberships (spread joined_at over last 7 months)
  INSERT INTO public.community_members (community_id, user_id, joined_at)
  VALUES
    (comm, u1, now() - interval '210 days'),
    (comm, u2, now() - interval '90 days'),
    (comm, u3, now() - interval '45 days'),
    (comm, u4, now() - interval '150 days'),
    (comm, u5, now() - interval '60 days'),
    (comm, u6, now() - interval '120 days'),
    (comm, u7, now() - interval '75 days'),
    (comm, u8, now() - interval '30 days'),
    (comm, u9, now() - interval '180 days')
  ON CONFLICT DO NOTHING;

  -- Set a realistic member count that makes the community look established
  -- (actual community_members rows are the 9 seed users; this display number is for social proof)
  UPDATE public.communities
  SET member_count = 2847
  WHERE id = comm;

END $$;

-- Confirm result
SELECT member_count FROM public.communities WHERE slug = 'diamonds';
