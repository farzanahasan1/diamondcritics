-- ── Admin audit log ──────────────────────────────────────────────────────────
-- Run this in Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  action      text        NOT NULL,
  target_type text,
  target_id   text,
  details     jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_admin_id_idx ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx ON admin_audit_log(created_at DESC);

-- Only admins can read audit log; nobody can insert/update/delete from client
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
  ON admin_audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- ── Upload tracking (rate limiting that survives cold starts) ─────────────────
CREATE TABLE IF NOT EXISTS community_uploads (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_uploads_user_window_idx
  ON community_uploads(user_id, created_at DESC);

-- Users can only see their own uploads; service role handles inserts
ALTER TABLE community_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own uploads"
  ON community_uploads FOR SELECT
  USING (auth.uid() = user_id);
