/**
 * API route smoke tests — exercise each GET route end-to-end against the
 * local SQLite database. Verifies that routes return valid JSON with the
 * expected shapes. Skips gracefully if no database is available.
 */

import fs from "fs";

const HAS_DB = !!process.env.SQLITE_DB_PATH && fs.existsSync(process.env.SQLITE_DB_PATH);
const dbDescribe = HAS_DB ? describe : describe.skip;

// Ensure Supabase is NOT active so routes use local-api
delete process.env.NEXT_PUBLIC_SUPABASE_URL;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Import a route handler and call its GET function with a mock Request.
 *  Uses NextRequest for routes that access nextUrl.searchParams. */
async function callGET(routePath: string, query = "") {
  const mod = await import(`@/app/api/${routePath}/route`);
  const url = `http://localhost:3000/api/${routePath}${query ? `?${query}` : ""}`;
  // Build a Request with nextUrl attached (mimics NextRequest)
  const request = new Request(url);
  (request as any).nextUrl = new URL(url);
  const response: Response = await mod.GET(request);
  return { response, json: await response.json() };
}

/** Import a route handler that takes params and call GET */
async function callGETWithParams(routePath: string, params: Record<string, string>) {
  const mod = await import(`@/app/api/${routePath}/route`);
  const url = `http://localhost:3000/api/${routePath}`;
  const request = new Request(url);
  const response: Response = await mod.GET(request, { params });
  return { response, json: await response.json() };
}

// ── Tests ───────────────────────────────────────────────────────────────────

dbDescribe("API Route Smoke Tests", () => {
  describe("GET /api/stats", () => {
    it("returns stats with expected shape", async () => {
      const { response, json } = await callGET("stats");
      expect(response.status).toBe(200);
      expect(json).toHaveProperty("totalIdeas");
      expect(json).toHaveProperty("meetingsAnalyzed");
      expect(json).toHaveProperty("constraintsCovered");
      expect(json).toHaveProperty("dormantIdeas");
      expect(typeof json.totalIdeas).toBe("number");
      expect(json.totalIdeas).toBeGreaterThan(0);
    });
  });

  describe("GET /api/ideas", () => {
    it("returns an array of ideas", async () => {
      const { response, json } = await callGET("ideas");
      expect(response.status).toBe(200);
      expect(Array.isArray(json)).toBe(true);
      expect(json.length).toBeGreaterThan(0);
    });

    it("each idea has required fields", async () => {
      const { json } = await callGET("ideas");
      const idea = json[0];
      expect(idea).toHaveProperty("id");
      expect(idea).toHaveProperty("title");
      expect(idea).toHaveProperty("binding_constraint");
      expect(idea).toHaveProperty("current_status");
      expect(idea).toHaveProperty("growth_impact_rating");
      expect(idea).toHaveProperty("feasibility_rating");
    });

    it("supports search filter", async () => {
      const { json } = await callGET("ideas", "search=energy");
      expect(Array.isArray(json)).toBe(true);
      // Search should return fewer results than full list
      const { json: all } = await callGET("ideas");
      expect(json.length).toBeLessThanOrEqual(all.length);
    });

    it("supports constraint filter", async () => {
      const { json } = await callGET("ideas", "constraint=energy");
      expect(Array.isArray(json)).toBe(true);
      for (const idea of json) {
        expect(idea.binding_constraint).toBe("energy");
      }
    });
  });

  describe("GET /api/ideas/[id]", () => {
    it("returns idea with plan and meetings", async () => {
      const { response, json } = await callGETWithParams("ideas/[id]", { id: "1" });
      expect(response.status).toBe(200);
      expect(json).toHaveProperty("idea");
      expect(json).toHaveProperty("plan");
      expect(json).toHaveProperty("meetings");
      expect(json.idea).toHaveProperty("title");
    });

    it("returns 404 for invalid id", async () => {
      const { response } = await callGETWithParams("ideas/[id]", { id: "abc" });
      expect(response.status).toBe(404);
    });

    it("returns 404 for non-existent id", async () => {
      const { response } = await callGETWithParams("ideas/[id]", { id: "99999" });
      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/themes", () => {
    it("returns array of constraint summaries", async () => {
      const { response, json } = await callGET("themes");
      expect(response.status).toBe(200);
      expect(Array.isArray(json)).toBe(true);
      expect(json.length).toBeGreaterThan(0);
      expect(json[0]).toHaveProperty("binding_constraint");
      expect(json[0]).toHaveProperty("total_ideas");
    });
  });

  describe("GET /api/packages", () => {
    it("returns array of packages with horizon counts", async () => {
      const { response, json } = await callGET("packages");
      expect(response.status).toBe(200);
      expect(Array.isArray(json)).toBe(true);
      expect(json.length).toBe(5);
      expect(json[0]).toHaveProperty("package_id");
      expect(json[0]).toHaveProperty("name");
      expect(json[0]).toHaveProperty("horizon_counts");
    });
  });

  describe("GET /api/packages/[id]", () => {
    it("returns package detail", async () => {
      const { response, json } = await callGETWithParams("packages/[id]", { id: "1" });
      expect(response.status).toBe(200);
      expect(json).toHaveProperty("name");
      expect(json).toHaveProperty("ideas_by_horizon");
    });

    it("returns 400 for invalid id", async () => {
      const { response } = await callGETWithParams("packages/[id]", { id: "abc" });
      expect(response.status).toBe(400);
    });

    it("returns 404 for non-existent package", async () => {
      const { response } = await callGETWithParams("packages/[id]", { id: "999" });
      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/timeline", () => {
    it("returns array", async () => {
      const { response, json } = await callGET("timeline");
      expect(response.status).toBe(200);
      expect(Array.isArray(json)).toBe(true);
    });
  });

  describe("GET /api/comparisons", () => {
    it("returns array", async () => {
      const { response, json } = await callGET("comparisons");
      expect(response.status).toBe(200);
      expect(Array.isArray(json)).toBe(true);
    });

    it("supports ideaId filter", async () => {
      const { response, json } = await callGET("comparisons", "ideaId=1");
      expect(response.status).toBe(200);
      expect(Array.isArray(json)).toBe(true);
    });
  });

  describe("GET /api/search", () => {
    it("returns structured results", async () => {
      const { response, json } = await callGET("search", "q=energy");
      expect(response.status).toBe(200);
      expect(json).toHaveProperty("ideas");
      expect(json).toHaveProperty("packages");
      expect(json).toHaveProperty("stakeholders");
      expect(json).toHaveProperty("comparisons");
      expect(json).toHaveProperty("chapters");
      expect(Array.isArray(json.ideas)).toBe(true);
    });

    it("returns empty results for short query", async () => {
      const { json } = await callGET("search", "q=a");
      expect(json.ideas).toEqual([]);
    });
  });

  describe("GET /api/dependency-graph", () => {
    it("returns graph data", async () => {
      const { response, json } = await callGET("dependency-graph");
      expect(response.status).toBe(200);
      expect(json).toHaveProperty("nodes");
      expect(json).toHaveProperty("links");
    });
  });

  // ── v1 public API ─────────────────────────────────────────────────────────

  describe("GET /api/v1/stats", () => {
    it("returns versioned stats", async () => {
      const { response, json } = await callGET("v1/stats");
      expect(response.status).toBe(200);
      expect(json).toHaveProperty("version", "1");
      expect(json).toHaveProperty("data");
      expect(json.data).toHaveProperty("totalIdeas");
    });
  });

  describe("GET /api/v1/ideas", () => {
    it("returns versioned ideas array", async () => {
      const { response, json } = await callGET("v1/ideas");
      expect(response.status).toBe(200);
      expect(json).toHaveProperty("version", "1");
      expect(json).toHaveProperty("data");
      expect(json).toHaveProperty("meta");
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.meta.count).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/packages", () => {
    it("returns versioned packages array", async () => {
      const { response, json } = await callGET("v1/packages");
      expect(response.status).toBe(200);
      expect(json).toHaveProperty("version", "1");
      expect(json).toHaveProperty("data");
      expect(json.meta.count).toBe(5);
    });
  });
});
