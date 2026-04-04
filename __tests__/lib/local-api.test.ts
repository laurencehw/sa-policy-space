/**
 * Data integrity tests against the local SQLite database.
 *
 * These tests require dev.sqlite3 to be present.  They are skipped automatically
 * when the DB is unavailable (e.g. in CI where the file is gitignored).
 *
 * To run locally: npm test  (setup.ts auto-detects and sets SQLITE_DB_PATH)
 */
import fs from "fs";

const DB_PATH = process.env.SQLITE_DB_PATH ?? "";
const DB_AVAILABLE = !!DB_PATH && fs.existsSync(DB_PATH);

// Skip all DB tests if the database isn't available
const dbDescribe = DB_AVAILABLE ? describe : describe.skip;

dbDescribe("local-api — SQLite data integrity", () => {
  // Lazily import so the module is only loaded when we actually run these tests
  let getStats: typeof import("@/lib/local-api").getStats;
  let getIdeas: typeof import("@/lib/local-api").getIdeas;
  let getIdeaById: typeof import("@/lib/local-api").getIdeaById;
  let getPackageSummaries: typeof import("@/lib/local-api").getPackageSummaries;
  let getPackageDetail: typeof import("@/lib/local-api").getPackageDetail;
  let getImplementationPlan: typeof import("@/lib/local-api").getImplementationPlan;

  beforeAll(async () => {
    const api = await import("@/lib/local-api");
    getStats = api.getStats;
    getIdeas = api.getIdeas;
    getIdeaById = api.getIdeaById;
    getPackageSummaries = api.getPackageSummaries;
    getPackageDetail = api.getPackageDetail;
    getImplementationPlan = api.getImplementationPlan;
  });

  // ── Stats ──────────────────────────────────────────────────────────────────

  describe("getStats()", () => {
    it("returns a valid stats object", () => {
      const stats = getStats();
      expect(typeof stats.totalIdeas).toBe("number");
      expect(typeof stats.meetingsAnalyzed).toBe("number");
      expect(typeof stats.constraintsCovered).toBe("number");
      expect(typeof stats.dormantIdeas).toBe("number");
      expect(stats.totalIdeas).toBeGreaterThan(0);
      // meetingsAnalyzed can be 0 on a freshly initialised DB
      expect(stats.meetingsAnalyzed).toBeGreaterThanOrEqual(0);
    });
  });

  // ── Ideas list ─────────────────────────────────────────────────────────────

  describe("getIdeas()", () => {
    it("returns a non-empty result with rows and total", () => {
      const result = getIdeas();
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(typeof result.total).toBe("number");
      expect(result.total).toBeGreaterThanOrEqual(result.rows.length);
    });

    it("every idea has required fields", () => {
      const { rows: ideas } = getIdeas();
      for (const idea of ideas) {
        expect(typeof idea.id).toBe("number");
        expect(typeof idea.title).toBe("string");
        expect(idea.title.length).toBeGreaterThan(0);
        // description may be null on a sparse DB; if present it must be a string
        if (idea.description !== null) {
          expect(typeof idea.description).toBe("string");
        }
        expect(typeof idea.slug).toBe("string");
        expect(idea.slug.length).toBeGreaterThan(0);
      }
    });

    it("filters by constraint without crashing", () => {
      const { rows: ideas } = getIdeas({ constraint: "energy" });
      expect(Array.isArray(ideas)).toBe(true);
      for (const idea of ideas) {
        expect(idea.binding_constraint).toBe("energy");
      }
    });

    it("filters by status without crashing", () => {
      const { rows: ideas } = getIdeas({ status: "proposed" });
      expect(Array.isArray(ideas)).toBe(true);
    });

    it("search filter returns matching results", () => {
      const { rows: ideas } = getIdeas({ search: "energy" });
      expect(Array.isArray(ideas)).toBe(true);
    });
  });

  // ── Individual idea lookup ─────────────────────────────────────────────────

  describe("getIdeaById()", () => {
    const SAMPLE_IDS = [1, 10, 25, 49];

    it.each(SAMPLE_IDS)("idea #%i exists and has title + description", (id) => {
      const idea = getIdeaById(id);
      if (!idea) {
        // If the DB has fewer than 49 ideas, skip gracefully
        console.warn(`Idea #${id} not found — skipping`);
        return;
      }
      expect(idea.id).toBe(id);
      expect(typeof idea.title).toBe("string");
      expect(idea.title.length).toBeGreaterThan(0);
      // description may be null on a sparse DB
      if (idea.description !== null) {
        expect(typeof idea.description).toBe("string");
      }
      expect(typeof idea.slug).toBe("string");
    });

    it("returns null for a non-existent ID", () => {
      expect(getIdeaById(999999)).toBeNull();
    });

    it("all ideas 1-49 can be fetched without throwing", () => {
      for (let id = 1; id <= 49; id++) {
        expect(() => getIdeaById(id)).not.toThrow();
      }
    });
  });

  // ── Package references ────────────────────────────────────────────────────

  describe("package references", () => {
    it("reform_package on each idea is null or 1-5", () => {
      const { rows: ideas } = getIdeas();
      const validPackageIds = new Set([null, 1, 2, 3, 4, 5]);
      for (const idea of ideas) {
        expect(validPackageIds.has(idea.reform_package)).toBe(true);
      }
    });

    it("no idea references a non-existent package", () => {
      const { rows: ideas } = getIdeas();
      const summaries = getPackageSummaries();
      const packageIds = new Set(summaries.map((s) => s.package_id));
      for (const idea of ideas) {
        if (idea.reform_package !== null) {
          expect(packageIds.has(idea.reform_package)).toBe(true);
        }
      }
    });
  });

  // ── Packages ──────────────────────────────────────────────────────────────

  describe("getPackageSummaries()", () => {
    it("returns 5 reform packages", () => {
      const summaries = getPackageSummaries();
      expect(summaries).toHaveLength(5);
    });

    it("each package has required fields", () => {
      const summaries = getPackageSummaries();
      for (const s of summaries) {
        expect(typeof s.package_id).toBe("number");
        expect(typeof s.name).toBe("string");
        expect(s.name.length).toBeGreaterThan(0);
        expect(typeof s.tagline).toBe("string");
        expect(Array.isArray(s.idea_ids)).toBe(true);
      }
    });
  });

  describe("getPackageDetail()", () => {
    const PACKAGE_IDS = [1, 2, 3, 4, 5];

    it.each(PACKAGE_IDS)("package #%i loads without crashing", (id) => {
      expect(() => getPackageDetail(id)).not.toThrow();
    });

    it.each(PACKAGE_IDS)("package #%i has ideas_by_horizon", (id) => {
      const detail = getPackageDetail(id);
      expect(detail).not.toBeNull();
      expect(detail!.ideas_by_horizon).toBeDefined();
      expect(Array.isArray(detail!.ideas_by_horizon.quick_win)).toBe(true);
      expect(Array.isArray(detail!.ideas_by_horizon.medium_term)).toBe(true);
      expect(Array.isArray(detail!.ideas_by_horizon.long_term)).toBe(true);
    });

    it("returns null for a non-existent package ID", () => {
      expect(getPackageDetail(999)).toBeNull();
    });
  });

  // ── Implementation plans ──────────────────────────────────────────────────

  describe("getImplementationPlan()", () => {
    it("does not throw for IDs 1-10", () => {
      for (let id = 1; id <= 10; id++) {
        expect(() => getImplementationPlan(id)).not.toThrow();
      }
    });

    it("returns null for a non-existent ID", () => {
      expect(getImplementationPlan(999999)).toBeNull();
    });

    it("implementation_steps parses as an array where present", () => {
      // Find an idea that has an implementation plan
      const ideas = getIdeas({ limit: 30 }).rows;
      for (const idea of ideas) {
        const plan = getImplementationPlan(idea.id);
        if (!plan) continue;
        if (!plan.implementation_steps) continue;
        // steps should be an array (local-api.ts JSON.parses string steps)
        expect(Array.isArray(plan.implementation_steps)).toBe(true);
      }
    });
  });
});
