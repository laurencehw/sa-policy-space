-- Migration 010: Add economic_impact_estimate and source_url columns to policy_ideas
-- These fields allow each idea to carry a concise economic impact estimate and
-- a primary source URL (usually a PMG committee page or official policy document).
--
-- Compatible with both SQLite (via init_local_db.py) and PostgreSQL/Supabase.
-- SQLite silently ignores unsupported column defaults; we rely on UPDATE migrations
-- in 011 to populate values.
-- ─────────────────────────────────────────────────────────────────────────────────────

ALTER TABLE policy_ideas ADD COLUMN economic_impact_estimate TEXT;
ALTER TABLE policy_ideas ADD COLUMN source_url TEXT;
