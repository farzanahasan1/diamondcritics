-- ============================================================
-- Remove duplicate community posts (keep the oldest per title)
-- Run ONCE in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Step 1: Preview what will be deleted (run this first to confirm)
-- SELECT id, title, created_at FROM public.posts
-- WHERE id NOT IN (
--   SELECT DISTINCT ON (community_id, title) id
--   FROM public.posts
--   ORDER BY community_id, title, created_at ASC
-- )
-- ORDER BY title, created_at;

-- Step 2: Delete duplicates — keeps the OLDEST post per title per community
DELETE FROM public.posts
WHERE id NOT IN (
  SELECT DISTINCT ON (community_id, title) id
  FROM public.posts
  ORDER BY community_id, title, created_at ASC
);

-- Confirm: show remaining post count
SELECT COUNT(*) AS post_count FROM public.posts WHERE is_deleted = false;
