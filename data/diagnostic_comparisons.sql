-- Diagnostic: check international_comparisons for mismatched idea_id assignments
-- Run this in the Supabase SQL editor and share the output

-- 1. How many comparisons exist?
SELECT COUNT(*) AS total_comparisons FROM international_comparisons;

-- 2. Show each comparison with the idea it's linked to
-- Look for mismatches: e.g., a "fiscal consolidation" comparison linked to a "crime" idea
SELECT
  ic.id AS comp_id,
  ic.idea_id,
  p.title AS idea_title,
  p.binding_constraint AS idea_constraint,
  ic.country,
  ic.outcome_summary,
  -- Flag if the comparison topic seems unrelated to the idea
  CASE
    WHEN ic.outcome_summary ILIKE '%homicide%' AND p.binding_constraint NOT IN ('crime_safety', 'crime') THEN 'MISMATCH'
    WHEN ic.outcome_summary ILIKE '%cable car%' AND p.binding_constraint NOT IN ('transport_logistics', 'logistics') THEN 'MISMATCH'
    WHEN ic.outcome_summary ILIKE '%water%' AND p.binding_constraint NOT IN ('water') THEN 'POSSIBLE MISMATCH'
    ELSE 'OK'
  END AS flag
FROM international_comparisons ic
LEFT JOIN policy_ideas p ON p.id = ic.idea_id
ORDER BY ic.idea_id, ic.country;

-- 3. Show comparisons where the idea_id doesn't exist in policy_ideas (orphaned)
SELECT ic.id, ic.idea_id, ic.country, ic.outcome_summary
FROM international_comparisons ic
LEFT JOIN policy_ideas p ON p.id = ic.idea_id
WHERE p.id IS NULL;

-- 4. Show ideas with the most comparisons (to spot over/under-allocation)
SELECT p.id, p.title, p.binding_constraint, COUNT(ic.id) AS comparison_count
FROM policy_ideas p
LEFT JOIN international_comparisons ic ON ic.idea_id = p.id
GROUP BY p.id, p.title, p.binding_constraint
HAVING COUNT(ic.id) > 0
ORDER BY comparison_count DESC;
