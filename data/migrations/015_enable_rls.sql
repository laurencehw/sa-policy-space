-- Enable Row Level Security on all public tables.
-- All data is public/read-only, so we add a permissive SELECT policy for anon.
-- This resolves the Supabase Security Advisor "RLS Disabled in Public" errors.

-- ── Enable RLS ──────────────────────────────────────────────────────────────

ALTER TABLE public.international_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.implementation_plans ENABLE ROW LEVEL SECURITY;

-- ── Allow public read access (anon + authenticated) ─────────────────────────

CREATE POLICY "Allow public read" ON public.international_comparisons
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.meetings
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.documents
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.policy_ideas
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.idea_meetings
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.implementation_plans
  FOR SELECT USING (true);

-- ── Fix Security Definer Views ──────────────────────────────────────────────
-- Recreate the two flagged views with SECURITY INVOKER instead of
-- SECURITY DEFINER. This ensures they run with the caller's permissions
-- (respecting RLS) rather than the view owner's permissions.

DROP VIEW IF EXISTS public.stalled_high_impact;
CREATE VIEW public.stalled_high_impact
  WITH (security_invoker = true) AS
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

DROP VIEW IF EXISTS public.constraint_summary;
CREATE VIEW public.constraint_summary
  WITH (security_invoker = true) AS
SELECT
    binding_constraint,
    COUNT(*)                              AS total_ideas,
    AVG(growth_impact_rating)::NUMERIC(3,1) AS avg_growth_impact,
    COUNT(*) FILTER (WHERE current_status = 'stalled')      AS stalled_count,
    COUNT(*) FILTER (WHERE current_status = 'implemented')  AS implemented_count
FROM policy_ideas
GROUP BY binding_constraint
ORDER BY total_ideas DESC;
