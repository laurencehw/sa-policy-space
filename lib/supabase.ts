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
  | "transport_logistics"
  | "skills_education"
  | "regulatory_burden"
  | "crime_safety"
  | "labour_market"
  | "land_housing"
  | "digital_infrastructure"
  | "government_capacity"
  | "corruption_governance"
  | "health_systems"
  | "fiscal_space"
  | "financial_access"
  | "innovation_capacity"
  | "trade_openness"
  | "climate_environment"
  | "water"
  | "other";

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

// ── New table types (department_budgets, municipal_finance, research_papers) ──

export interface DepartmentBudget {
  department_name: string;
  programme: string | null;
  sub_programme: string | null;
  economic_classification_1: string | null;
  economic_classification_2: string | null;
  financial_year: string;
  budget_phase: string;
  amount_rands: number | null;
  vote_number: number | null;
}

// ── Budget view types ─────────────────────────────────────────────────────────

export interface BudgetSummary {
  financial_year: string;
  budget_phase: string;
  total_budget: number;
  num_departments: number;
  num_programmes: number;
  total_current: number;
  total_capital: number;
}

export interface BudgetByDepartment {
  department_name: string;
  financial_year: string;
  budget_phase: string;
  total_amount: number;
  line_items: number;
  num_programmes: number;
  current_expenditure: number;
  capital_expenditure: number;
}

export interface BudgetByProgramme {
  department_name: string;
  programme: string;
  financial_year: string;
  budget_phase: string;
  total_amount: number;
  line_items: number;
  current_expenditure: number;
  capital_expenditure: number;
}

export interface ConsolidatedByFunction {
  function_group: string;
  financial_year: string;
  budget_year: string;
  total_rthousands: number;
  total_rands: number;
  current_rthousands: number;
  capital_transfers_rthousands: number;
}

export interface MunicipalFinance {
  municipality_code: string;
  municipality_name: string;
  municipality_type: string;
  province: string;
  indicator: string;
  financial_year: string;
  amount_rands: number | null;
}

export interface ResearchPaper {
  id: number;
  title: string;
  authors: string | null;
  publication_date: string | null;
  source_org: string;
  paper_type: string;
  url: string;
  pdf_url?: string | null;
  abstract: string | null;
  themes: string[];
}

// ── Constraint display metadata ────────────────────────────────────────────

export const CONSTRAINT_LABELS: Record<BindingConstraint, string> = {
  energy: "Energy",
  transport_logistics: "Logistics & Transport",
  skills_education: "Skills & Education",
  regulatory_burden: "Regulatory Burden",
  crime_safety: "Crime & Safety",
  labour_market: "Labour Market",
  land_housing: "Land & Housing",
  digital_infrastructure: "Digital Infrastructure",
  government_capacity: "Government Capacity",
  corruption_governance: "Corruption & Governance",
  health_systems: "Health Systems",
  fiscal_space: "Fiscal Space",
  financial_access: "Financial Access",
  innovation_capacity: "Innovation & R&D",
  trade_openness: "Trade Openness",
  climate_environment: "Climate & Environment",
  water: "Water",
  other: "Other",
};

export const CONSTRAINT_COLORS: Record<BindingConstraint, string> = {
  energy: "bg-yellow-100 text-yellow-800",
  transport_logistics: "bg-blue-100 text-blue-800",
  skills_education: "bg-purple-100 text-purple-800",
  regulatory_burden: "bg-orange-100 text-orange-800",
  crime_safety: "bg-red-100 text-red-800",
  labour_market: "bg-pink-100 text-pink-800",
  land_housing: "bg-green-100 text-green-800",
  digital_infrastructure: "bg-cyan-100 text-cyan-800",
  government_capacity: "bg-gray-100 text-gray-800",
  corruption_governance: "bg-rose-100 text-rose-800",
  health_systems: "bg-teal-100 text-teal-800",
  fiscal_space: "bg-emerald-100 text-emerald-800",
  financial_access: "bg-indigo-100 text-indigo-800",
  innovation_capacity: "bg-violet-100 text-violet-800",
  trade_openness: "bg-amber-100 text-amber-800",
  climate_environment: "bg-lime-100 text-lime-800",
  water: "bg-sky-100 text-sky-800",
  other: "bg-gray-100 text-gray-600",
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
