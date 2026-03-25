-- Add index on policy_ideas.slug for fast slug lookups.
-- The slug column has a UNIQUE constraint but an explicit index
-- ensures the query planner uses it for equality lookups.

CREATE INDEX IF NOT EXISTS idx_policy_ideas_slug ON policy_ideas(slug);
