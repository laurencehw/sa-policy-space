-- Add slug column to policy_ideas and populate from titles.
-- This enables fast slug-based lookups instead of title-scanning.

-- 1. Add the column
ALTER TABLE policy_ideas ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Populate slugs from titles
-- Lowercase, strip non-alphanumeric (except spaces and hyphens), replace spaces with hyphens
UPDATE policy_ideas
SET slug = lower(
  regexp_replace(
    regexp_replace(
      regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
)
WHERE slug IS NULL;

-- 3. Add unique constraint and index
ALTER TABLE policy_ideas ADD CONSTRAINT policy_ideas_slug_unique UNIQUE (slug);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_slug ON policy_ideas(slug);
