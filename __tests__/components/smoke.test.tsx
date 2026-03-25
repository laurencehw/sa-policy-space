/**
 * Component smoke tests — verify key client components render without crashing.
 * Uses jsdom environment for React rendering.
 *
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// ── Mock next/navigation ────────────────────────────────────────────────────
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

// ── Mock next/link ──────────────────────────────────────────────────────────
jest.mock("next/link", () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// ── Mock recharts (heavy library, not needed for smoke tests) ───────────────
jest.mock("recharts", () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  ComposedChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  Legend: () => null,
  BarChart: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
}));

// ── Tests ───────────────────────────────────────────────────────────────────

describe("IdeasClient", () => {
  it("renders with empty ideas array", async () => {
    const IdeasClient = (await import("@/app/ideas/IdeasClient")).default;
    render(<IdeasClient initialIdeas={[]} />);
    expect(screen.getByText("Policy Ideas")).toBeInTheDocument();
  });

  it("renders with sample ideas", async () => {
    const IdeasClient = (await import("@/app/ideas/IdeasClient")).default;
    const sampleIdeas = [
      {
        id: 1,
        title: "Test Idea",
        description: "A test description",
        binding_constraint: "energy" as const,
        current_status: "proposed" as const,
        growth_impact_rating: 4,
        feasibility_rating: 3,
        times_raised: 2,
        reform_package: 1,
        time_horizon: "quick_win",
        slug: "test-idea",
        first_raised: "2024-01-01",
        last_discussed: "2024-06-01",
        dormant: 0,
        source_committee: "Test Committee",
        responsible_department: "Test Dept",
      },
    ];
    render(<IdeasClient initialIdeas={sampleIdeas as any} />);
    expect(screen.getByText("Test Idea")).toBeInTheDocument();
    expect(screen.getByText(/1 idea/)).toBeInTheDocument();
  });
});

describe("IndicatorsClient", () => {
  it("renders with sample indicators", async () => {
    const IndicatorsClient = (await import("@/app/indicators/IndicatorsClient")).default;
    const sampleIndicators = [
      {
        id: "test_indicator",
        name: "Test Indicator",
        source: "Test Source",
        source_code: "TST001",
        unit: "%",
        frequency: "annual",
        binding_constraints: ["energy"],
        latest_value: 42.5,
        latest_period: "2025",
        sparkline: [{ period: "2024", value: 40 }, { period: "2025", value: 42.5 }],
        values: [{ period: "2024", value: 40 }, { period: "2025", value: 42.5 }],
      },
    ];
    render(<IndicatorsClient indicators={sampleIndicators} />);
    expect(screen.getByText("Economic Indicators")).toBeInTheDocument();
    expect(screen.getAllByText("Test Indicator").length).toBeGreaterThan(0);
  });

  it("renders empty state", async () => {
    const IndicatorsClient = (await import("@/app/indicators/IndicatorsClient")).default;
    render(<IndicatorsClient indicators={[]} />);
    expect(screen.getByText("Economic Indicators")).toBeInTheDocument();
  });
});

describe("BudgetGapChart", () => {
  it("renders with package data", async () => {
    const BudgetGapChart = (await import("@/components/BudgetGapChart")).default;
    const packages = [
      { name: "Infrastructure", score: 35, package_id: 1 },
      { name: "SMME", score: 28, package_id: 2 },
    ];
    const { container } = render(<BudgetGapChart packages={packages} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders nothing with empty data", async () => {
    const BudgetGapChart = (await import("@/components/BudgetGapChart")).default;
    const { container } = render(<BudgetGapChart packages={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("SearchModal", () => {
  it("renders the search trigger button", async () => {
    const SearchModal = (await import("@/components/SearchModal")).default;
    render(<SearchModal />);
    // Search modal renders a button with Cmd+K hint
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
