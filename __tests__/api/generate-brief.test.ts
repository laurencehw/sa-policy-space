/**
 * Tests for the /api/generate-brief POST endpoint.
 * Verifies origin validation, rate limiting, input validation, and streaming.
 * The Anthropic client is mocked so no real API calls are made.
 */

// Mock Anthropic SDK before importing the route
const mockStream = {
  async *[Symbol.asyncIterator]() {
    yield {
      type: "content_block_delta" as const,
      delta: { type: "text_delta" as const, text: "Generated " },
    };
    yield {
      type: "content_block_delta" as const,
      delta: { type: "text_delta" as const, text: "brief content." },
    };
  },
};

jest.mock("@anthropic-ai/sdk", () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      stream: jest.fn().mockReturnValue(mockStream),
    },
  }));
});

// Mock the API module so we don't need a database
jest.mock("@/lib/api", () => ({
  getPackageDetail: jest.fn().mockResolvedValue({ name: "Test Package", idea_count: 3 }),
  getIdeas: jest.fn().mockResolvedValue([{ id: 1, title: "Test Idea" }]),
}));

import { NextRequest } from "next/server";

// Set required env vars
process.env.ANTHROPIC_API_KEY = "test-key";
// NODE_ENV is already "test" in Jest — localhost origins are allowed in non-production

// Import the route handler after mocks are set up
const importRoute = () => import("@/app/api/generate-brief/route");

function makeRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  const req = new NextRequest("http://localhost:3000/api/generate-brief", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
      "x-forwarded-for": `test-${Math.random().toString(36).slice(2)}`,
      ...headers,
    },
  });
  return req;
}

describe("/api/generate-brief", () => {
  let POST: (req: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    const mod = await importRoute();
    POST = mod.POST;
  });

  // ── Origin validation ───────────────────────────────────────────────────

  it("rejects requests with no origin header", async () => {
    const req = new NextRequest("http://localhost:3000/api/generate-brief", {
      method: "POST",
      body: JSON.stringify({ reformId: "pkg_1", audience: "policymaker", reformLabel: "Test" }),
      headers: { "Content-Type": "application/json", "x-forwarded-for": "origin-test-1" },
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("Forbidden");
  });

  it("rejects requests from unknown origins", async () => {
    const req = new NextRequest("http://localhost:3000/api/generate-brief", {
      method: "POST",
      body: JSON.stringify({ reformId: "pkg_1", audience: "policymaker", reformLabel: "Test" }),
      headers: {
        "Content-Type": "application/json",
        origin: "https://evil-site.com",
        "x-forwarded-for": "origin-test-2",
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  // ── Input validation ────────────────────────────────────────────────────

  it("returns 400 for missing required fields", async () => {
    const req = makeRequest({ reformId: "pkg_1" }); // missing audience and reformLabel
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Missing required fields");
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("http://localhost:3000/api/generate-brief", {
      method: "POST",
      body: "not json",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
        "x-forwarded-for": "json-test",
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid request body");
  });

  // ── Successful streaming response ───────────────────────────────────────

  it("streams a policy brief for a valid request", async () => {
    const req = makeRequest({
      reformId: "pkg_1",
      audience: "policymaker",
      reformLabel: "Energy Reform Package",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");

    // Read the stream
    const text = await res.text();
    expect(text).toContain("Generated ");
    expect(text).toContain("brief content.");
  });

  // ── Rate limiting ──────────────────────────────────────────────────────

  it("returns 429 after exceeding rate limit", async () => {
    const fixedIp = "rate-limit-test-ip";
    // Send 5 requests (the limit)
    for (let i = 0; i < 5; i++) {
      const req = makeRequest(
        { reformId: "pkg_1", audience: "policymaker", reformLabel: "Test" },
        { "x-forwarded-for": fixedIp }
      );
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 6th request should be rate-limited
    const req = makeRequest(
      { reformId: "pkg_1", audience: "policymaker", reformLabel: "Test" },
      { "x-forwarded-for": fixedIp }
    );
    const res = await POST(req);
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toContain("Too many requests");
    expect(res.headers.get("X-RateLimit-Limit")).toBe("5");
  });

  // ── API key check ──────────────────────────────────────────────────────

  it("returns 500 when ANTHROPIC_API_KEY is missing", async () => {
    const saved = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    const req = makeRequest({
      reformId: "pkg_1",
      audience: "researcher",
      reformLabel: "Skills Education",
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toContain("ANTHROPIC_API_KEY");

    process.env.ANTHROPIC_API_KEY = saved;
  });
});
