import {
  CONSTRAINT_LABELS,
  CONSTRAINT_COLORS,
  STATUS_COLORS,
  type BindingConstraint,
  type PolicyStatus,
} from "@/lib/supabase";

const BINDING_CONSTRAINTS: BindingConstraint[] = [
  "energy",
  "logistics",
  "transport_logistics",
  "skills",
  "skills_education",
  "regulation",
  "regulatory_burden",
  "crime",
  "crime_safety",
  "labor_market",
  "labour_market",
  "land",
  "land_housing",
  "land_reform",
  "digital",
  "digital_infrastructure",
  "government_capacity",
  "corruption",
  "corruption_governance",
  "health_systems",
  "fiscal_space",
  "financial_access",
  "innovation_capacity",
  "trade_openness",
  "climate_environment",
  "water",
  "other",
];

const POLICY_STATUSES: PolicyStatus[] = [
  "proposed",
  "debated",
  "drafted",
  "stalled",
  "implemented",
  "abandoned",
  "under_review",
  "partially_implemented",
];

describe("CONSTRAINT_LABELS", () => {
  it("has an entry for every binding constraint", () => {
    for (const c of BINDING_CONSTRAINTS) {
      expect(CONSTRAINT_LABELS).toHaveProperty(c);
    }
  });

  it("has no extra keys beyond the known constraints", () => {
    expect(Object.keys(CONSTRAINT_LABELS).sort()).toEqual(
      [...BINDING_CONSTRAINTS].sort()
    );
  });

  it("all labels are non-empty strings", () => {
    for (const label of Object.values(CONSTRAINT_LABELS)) {
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    }
  });
});

describe("CONSTRAINT_COLORS", () => {
  it("has an entry for every binding constraint", () => {
    for (const c of BINDING_CONSTRAINTS) {
      expect(CONSTRAINT_COLORS).toHaveProperty(c);
    }
  });

  it("all color values are non-empty Tailwind class strings", () => {
    for (const val of Object.values(CONSTRAINT_COLORS)) {
      expect(typeof val).toBe("string");
      expect(val.length).toBeGreaterThan(0);
    }
  });
});

describe("STATUS_COLORS", () => {
  it("has an entry for every policy status", () => {
    for (const s of POLICY_STATUSES) {
      expect(STATUS_COLORS).toHaveProperty(s);
    }
  });

  it("has no extra keys beyond the known statuses", () => {
    expect(Object.keys(STATUS_COLORS).sort()).toEqual(
      [...POLICY_STATUSES].sort()
    );
  });

  it("all color values are non-empty Tailwind class strings", () => {
    for (const val of Object.values(STATUS_COLORS)) {
      expect(typeof val).toBe("string");
      expect(val.length).toBeGreaterThan(0);
    }
  });
});
