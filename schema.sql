-- SA Policy Space: Supabase/PostgreSQL Schema
-- Run this in the Supabase SQL editor or via psql

-- ============================================================
-- SOURCE LAYER: Raw PMG records (reference, not reproduced)
-- ============================================================

CREATE TABLE IF NOT EXISTS meetings (
    id                  SERIAL PRIMARY KEY,
    pmg_meeting_id      INT UNIQUE NOT NULL,
    committee_name      TEXT NOT NULL,
    committee_id        INT,
    date                DATE,
    title               TEXT,
    summary_clean       TEXT,  -- our metadata note; see PMG URL for full minutes
    pmg_url             TEXT,  -- authoritative source link
    num_documents       INT DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
    id              SERIAL PRIMARY KEY,
    meeting_id      INT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    title           TEXT,
    file_type       TEXT,          -- pdf, pptx, doc, xlsx, etc.
    pmg_file_url    TEXT,          -- link to PMG-hosted file (not reproduced here)
    description     TEXT
);

-- ============================================================
-- CORE VALUE-ADD: Curated policy ideas and assessments
-- ============================================================

-- Using TEXT for binding_constraint and current_status (not enums) because
-- the taxonomy is evolving and the data already uses extended value sets.

CREATE TABLE IF NOT EXISTS policy_ideas (
    id                      SERIAL PRIMARY KEY,
    title                   TEXT NOT NULL,
    description             TEXT,               -- original synthesis, NOT PMG verbatim
    theme                   TEXT,               -- controlled taxonomy (see themes list)
    binding_constraint      TEXT,               -- see ROADMAP.md for 18-type taxonomy
    first_raised_date       DATE,
    times_raised            INT DEFAULT 1,
    current_status          TEXT DEFAULT 'proposed',  -- proposed|debated|drafted|stalled|implemented|abandoned|partially_implemented|under_review
    feasibility_rating      INT CHECK (feasibility_rating BETWEEN 1 AND 5),
    feasibility_note        TEXT,
    growth_impact_rating    INT CHECK (growth_impact_rating BETWEEN 1 AND 5),
    responsible_department  TEXT,
    key_quote               TEXT,               -- representative quote, properly attributed
    source_committee        TEXT,               -- originating parliamentary committee
    reform_package          INT,                -- 1–5 (see data/reform_packages.json)
    time_horizon            TEXT,               -- quick_win | medium_term | long_term
    slug                    TEXT UNIQUE,        -- URL-friendly slug derived from title
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: add slug column to existing databases
-- ALTER TABLE policy_ideas ADD COLUMN slug TEXT UNIQUE;
-- UPDATE policy_ideas SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));

-- Many-to-many: ideas ↔ meetings
CREATE TABLE IF NOT EXISTS idea_meetings (
    idea_id     INT NOT NULL REFERENCES policy_ideas(id) ON DELETE CASCADE,
    meeting_id  INT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    PRIMARY KEY (idea_id, meeting_id)
);

-- Deep-dive implementation plans for high-priority ideas
CREATE TABLE IF NOT EXISTS implementation_plans (
    id                          SERIAL PRIMARY KEY,
    idea_id                     INT UNIQUE NOT NULL REFERENCES policy_ideas(id) ON DELETE CASCADE,
    roadmap_summary             TEXT,
    implementation_steps        JSONB,  -- [{step, description, timeline, responsible_party}, ...]
    estimated_timeline          TEXT,
    estimated_cost              TEXT,
    required_legislation        TEXT,
    draft_legislation_notes     TEXT,
    political_feasibility_notes TEXT,
    international_precedents    TEXT,
    created_at                  TIMESTAMPTZ DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_meetings_date           ON meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_committee_name ON meetings(committee_name);
CREATE INDEX IF NOT EXISTS idx_meetings_committee_id   ON meetings(committee_id);

CREATE INDEX IF NOT EXISTS idx_policy_ideas_theme              ON policy_ideas(theme);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_binding_constraint ON policy_ideas(binding_constraint);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_current_status     ON policy_ideas(current_status);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_growth_impact      ON policy_ideas(growth_impact_rating DESC);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_first_raised       ON policy_ideas(first_raised_date);

CREATE INDEX IF NOT EXISTS idx_documents_meeting_id ON documents(meeting_id);
CREATE INDEX IF NOT EXISTS idx_idea_meetings_idea   ON idea_meetings(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_meetings_meeting ON idea_meetings(meeting_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_policy_ideas
    BEFORE UPDATE ON policy_ideas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_implementation_plans
    BEFORE UPDATE ON implementation_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- VIEWS (convenience)
-- ============================================================

-- High-impact stalled ideas (the core editorial product)
CREATE OR REPLACE VIEW stalled_high_impact AS
SELECT
    pi.id,
    pi.title,
    pi.binding_constraint,
    pi.theme,
    pi.growth_impact_rating,
    pi.feasibility_rating,
    pi.times_raised,
    pi.responsible_department,
    pi.first_raised_date
FROM policy_ideas pi
WHERE pi.current_status = 'stalled'
  AND pi.growth_impact_rating >= 4
ORDER BY pi.growth_impact_rating DESC, pi.times_raised DESC;

-- Constraint summary: idea counts per binding constraint
CREATE OR REPLACE VIEW constraint_summary AS
SELECT
    binding_constraint,
    COUNT(*)                              AS total_ideas,
    AVG(growth_impact_rating)::NUMERIC(3,1) AS avg_growth_impact,
    COUNT(*) FILTER (WHERE current_status = 'stalled')      AS stalled_count,
    COUNT(*) FILTER (WHERE current_status = 'implemented')  AS implemented_count
FROM policy_ideas
GROUP BY binding_constraint
ORDER BY total_ideas DESC;

-- ============================================================
-- MIGRATIONS
-- ============================================================

-- 001: Fix PMG URLs — api.pmg.org.za → pmg.org.za (see data/migrations/001_fix_pmg_urls.sql)
-- UPDATE meetings  SET pmg_url      = replace(pmg_url,      'https://api.pmg.org.za/', 'https://pmg.org.za/') WHERE pmg_url      LIKE 'https://api.pmg.org.za/%';
-- UPDATE documents SET pmg_file_url = replace(pmg_file_url, 'https://api.pmg.org.za/', 'https://pmg.org.za/') WHERE pmg_file_url LIKE 'https://api.pmg.org.za/%';
