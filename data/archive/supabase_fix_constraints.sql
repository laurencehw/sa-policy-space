-- Fix non-standard binding_constraint values
-- Run in Supabase SQL editor AFTER supabase_housing_migration.sql and supabase_2025_update_migration.sql
-- Generated: 2026-03-23

-- ============================================================
-- Housing/Human Settlements ideas: normalize to known taxonomy
-- ============================================================

-- 'financial_access' → 'land'
-- Affects: 126 (Social Housing Blocked Projects), 128 (First Home Finance), 134 (CRU Programme)
UPDATE policy_ideas
SET binding_constraint = 'land', updated_at = NOW()
WHERE binding_constraint = 'financial_access';

-- 'regulatory_burden' → 'regulation'
-- Affects: 129 (PIE Act), 131 (Building Inspectorate), 135 (Housing Consumer Protection Act),
--          136 (National Human Settlements Bill), 137 (PPRA)
UPDATE policy_ideas
SET binding_constraint = 'regulation', updated_at = NOW()
WHERE binding_constraint = 'regulatory_burden';

-- 'corruption_governance' → 'corruption'
-- Affects: 138 (HDA Reform)
UPDATE policy_ideas
SET binding_constraint = 'corruption', updated_at = NOW()
WHERE binding_constraint = 'corruption_governance';

-- ============================================================
-- SARB idea (id=124): fix fiscal_constraint → government_capacity
-- ============================================================

-- 'fiscal_constraint' → 'government_capacity'
-- Affects: 124 (SARB Inflation Target Reform)
UPDATE policy_ideas
SET binding_constraint = 'government_capacity', updated_at = NOW()
WHERE binding_constraint = 'fiscal_constraint';

-- Verify results (run SELECT to confirm)
-- SELECT id, title, binding_constraint FROM policy_ideas WHERE id IN (124, 126, 128, 129, 131, 134, 135, 136, 137, 138) ORDER BY id;
