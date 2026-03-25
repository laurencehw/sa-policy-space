-- ============================================================
-- Migration: Assign Housing, Health & Higher Education ideas
--            to reform packages
-- Date: 2026-03-23
-- ============================================================
-- Context:
--   Housing ideas (IDs 125–139) were added via supabase_housing_ideas.sql
--   Health ideas (IDs 104–113) were added via supabase_health_higered_ideas.sql
--   Higher Education ideas (IDs 50–57) were added via supabase_enrichment_migration.sql
--
-- Most ideas were already assigned when first inserted. This migration
-- fills the six housing ideas that were left with NULL reform_package,
-- and verifies all Health/Higher Ed/SARB assignments are correct.
-- ============================================================

-- ------------------------------------------------------------
-- Package 3: Human Capital Pipeline
-- "Invest now because the lags are a decade long"
--
-- These five housing ideas belong here alongside the rest of
-- the DHS/housing cluster (125–130, 132, 134, 139 already assigned).
--
-- 131 — Building Inspectorate Reform Post-George Collapse
--        Binding constraint: regulation | Time: quick_win
--        DHS/NHBRC/CIDB housing safety regulation reform.
--
-- 133 — Emergency Housing Response Fund Centralisation
--        Binding constraint: government_capacity | Time: quick_win
--        National disaster-readiness for housing; DHS-led.
--
-- 135 — Housing Consumer Protection Act Full Rollout
--        Binding constraint: regulation | Time: quick_win
--        HCPA (2024) implementation; NHBRC-administered.
--
-- 136 — National Human Settlements Bill — Legislative Consolidation
--        Binding constraint: regulation | Time: long_term
--        Consolidates 9 housing statutes; DHS-led.
--
-- 137 — Property Practitioners Regulatory Authority
--        Binding constraint: regulation | Time: quick_win
--        PPRA governance reform; housing market consumer protection.
-- ------------------------------------------------------------
UPDATE policy_ideas
SET    reform_package = 3,
       updated_at     = NOW()
WHERE  id IN (131, 133, 135, 136, 137)
  AND  reform_package IS NULL;

-- ------------------------------------------------------------
-- Package 5: State Capacity & Governance
-- "None of the above works without a capable state"
--
-- 138 — Housing Development Agency Reform — Tackling Procurement Corruption
--        Binding constraint: corruption | Time: medium_term
--        SIU investigation (May 2025 Presidential Proclamation);
--        HDA CEO suspended 2026. Fits squarely with anti-corruption
--        and consequence-management reforms in Package 5.
-- ------------------------------------------------------------
UPDATE policy_ideas
SET    reform_package = 5,
       updated_at     = NOW()
WHERE  id = 138
  AND  reform_package IS NULL;

-- ------------------------------------------------------------
-- Verification: confirm all new-committee ideas are assigned
-- (run as a sanity check after applying the migration)
-- ------------------------------------------------------------
-- SELECT id, title, reform_package
-- FROM   policy_ideas
-- WHERE  id IN (
--   -- Higher Education (50–57)
--   50, 51, 52, 53, 54, 55, 56, 57,
--   -- Health (104–113)
--   104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
--   -- SARB inflation target
--   124,
--   -- Housing (125–139)
--   125, 126, 127, 128, 129, 130, 131, 132, 133, 134,
--   135, 136, 137, 138, 139
-- )
-- ORDER BY id;
--
-- Expected package assignments:
--   50–54, 56–57        → 3 (Human Capital Pipeline)
--   55                  → 5 (State Capacity & Governance) — NSFAS fraud/admin overhaul
--   104–110, 112–113    → 3 (Human Capital Pipeline)
--   111                 → 5 (State Capacity & Governance) — Provincial Health Turnaround
--   124                 → 2 (SMME & Employment Acceleration) — SARB inflation target
--   125–137, 139        → 3 (Human Capital Pipeline) — Housing DHS cluster
--   138                 → 5 (State Capacity & Governance) — HDA corruption
