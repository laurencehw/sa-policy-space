import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only instantiate when env vars are present (not in local SQLite dev mode)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ── Types matching schema.sql ──────────────────────────────────────────────

export type PolicyStatus =
  | "proposed"
  | "debated"
  | "drafted"
  | "stalled"
  | "implemented"
  | "abandoned"
  | "under_review"
  | "partially_implemented";

export type BindingConstraint =
  | "energy"
  | "logistics"
  | "skills"
  | "regulation"
  | "crime"
  | "labor_market"
  | "land"
  | "digital"
  | "government_capacity"
  | "corruption";

export interface Meeting {
  id: number;
  pmg_meeting_id: number;
  committee_name: string;
  committee_id: number | null;
  date: string;
  title: string;
  summary_clean: string;
  pmg_url: string;
  num_documents: number;
  created_at: string;
}

export interface PolicyIdea {
  id: number;
  title: string;
  description: string;
  theme: string;
  binding_constraint: BindingConstraint;
  first_raised_date: string;
  times_raised: number;
  current_status: PolicyStatus;
  feasibility_rating: number;
  growth_impact_rating: number;
  responsible_department: string;
  key_quote: string;
  source_committee: string | null;
  reform_package: number | null;
  time_horizon: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  // Derived from idea_meetings → meetings
  first_raised: string | null;
  last_discussed: string | null;
  dormant: number; // 1 = last discussed > 12 months ago
  // Enriched fields (may be absent in older records)
  feasibility_note?: string | null;    // DB column name (singular) — populated by enrichment migration
  key_quotes?: string[] | string | null;
  growth_impact_pct?: number | null;
  fiscal_impact_zar_bn?: number | null;
  responsible_departments?: string[] | string | null;
  // Migration 010: economic impact and primary source link
  economic_impact_estimate?: string | null;
  source_url?: string | null;
  oecd_references?: string | null;
}

export interface ImplementationPlan {
  id: number;
  idea_id: number;
  roadmap_summary: string;
  implementation_steps: Array<{
    step: string | number;  // stored as integer (1,2,3…) in DB
    description: string;
    timeline: string;
    responsible_party: string;
  }>;
  estimated_timeline: string;
  estimated_cost: string;
  required_legislation: string;
  draft_legislation_notes: string;
  political_feasibility_notes: string;
  international_precedents: string;
}

// ── Constraint display metadata ────────────────────────────────────────────

export const CONSTRAINT_LABELS: Record<BindingConstraint, string> = {
  energy: "Energy",
  logistics: "Logistics & Transport",
  skills: "Skills & Education",
  regulation: "Regulation",
  crime: "Crime & Safety",
  labor_market: "Labour Market",
  land: "Land & Property",
  digital: "Digital Infrastructure",
  government_capacity: "Government Capacity",
  corruption: "Corruption",
};

export const CONSTRAINT_COLORS: Record<BindingConstraint, string> = {
  energy: "bg-yellow-100 text-yellow-800",
  logistics: "bg-blue-100 text-blue-800",
  skills: "bg-purple-100 text-purple-800",
  regulation: "bg-orange-100 text-orange-800",
  crime: "bg-red-100 text-red-800",
  labor_market: "bg-pink-100 text-pink-800",
  land: "bg-green-100 text-green-800",
  digital: "bg-cyan-100 text-cyan-800",
  government_capacity: "bg-gray-100 text-gray-800",
  corruption: "bg-rose-100 text-rose-800",
};

export const STATUS_COLORS: Record<PolicyStatus, string> = {
  proposed: "bg-blue-50 text-blue-700 ring-blue-600/20",
  debated: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  drafted: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  stalled: "bg-red-50 text-red-700 ring-red-600/20",
  implemented: "bg-green-50 text-green-700 ring-green-600/20",
  abandoned: "bg-gray-50 text-gray-600 ring-gray-500/20",
  under_review: "bg-amber-50 text-amber-700 ring-amber-600/20",
  partially_implemented: "bg-teal-50 text-teal-700 ring-teal-600/20",
};
