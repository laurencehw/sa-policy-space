import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

// ── Rate limiter (5 requests per IP per hour) ────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Purge expired entries every 10 minutes to prevent unbounded growth.
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 10 * 60 * 1000).unref();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 5;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

type Audience = "policymaker" | "civil_society" | "researcher";

const AUDIENCE_SECTIONS: Record<Audience, string[]> = {
  policymaker: [
    "Problem Statement",
    "Proposed Intervention",
    "Evidence Base",
    "Implementation Pathway",
    "Cost Estimate",
    "International Precedents",
  ],
  civil_society: [
    "Plain-Language Summary",
    "What Government Promised",
    "Current Status",
    "Accountability Checklist",
    "Who to Contact",
  ],
  researcher: [
    "Formal Problem Definition",
    "Literature Context",
    "Data Sources",
    "Methodology",
    "Policy Implications",
    "References",
  ],
};

const AUDIENCE_TONE: Record<Audience, string> = {
  policymaker:
    "Write for ministers, senior officials, and advisors. Use technical but action-oriented language. Focus on implementation detail, costs, and timelines. Be concise and directive — this brief should enable a decision or an instruction.",
  civil_society:
    "Write for NGOs, advocacy groups, and engaged citizens. Use plain English — no jargon. Focus on government commitments, what has or hasn't happened, and how citizens and organisations can engage or hold decision-makers accountable.",
  researcher:
    "Write for academics, think-tanks, and graduate students. Use formal academic structure. Include theoretical framing, empirical evidence base, identification strategy, and policy implications. Be rigorous and cite specific data sources.",
};

const WORD_TARGETS: Record<Audience, string> = {
  policymaker: "700",
  civil_society: "450",
  researcher: "1100",
};

function buildPrompt(audience: Audience, reformLabel: string, context: unknown): string {
  const sections = AUDIENCE_SECTIONS[audience];
  const tone = AUDIENCE_TONE[audience];
  const wordTarget = WORD_TARGETS[audience];
  const sectionList = sections.map((s, i) => `${i + 1}. ${s}`).join("\n");

  return `You are an expert policy analyst at SA Policy Space, a South African parliamentary data research initiative. You have access to real structured data sourced from parliamentary committee proceedings and government documents.

${tone}

Write a complete policy brief on: **${reformLabel}**

Data from the SA Policy Space database (use this as your primary source):
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

Structure the brief with these sections, using ## as section headers:
${sectionList}

Rules:
- Ground every claim in data from the above context; note gaps honestly rather than inventing facts
- Use South African institutional names (National Treasury, SARB, Stats SA, PMG, NEDLAC, DPME) where relevant
- For the researcher brief: include APA-style references where sources can be inferred from the data
- Aim for approximately ${wordTarget} words total
- Format section headers exactly as: ## Section Name`;
}

export async function POST(request: NextRequest) {
  // ── Origin validation ──────────────────────────────────────────────────────
  // Reject requests not originating from the app itself. This prevents
  // external scripts from burning Anthropic API credits via direct POST.
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    "https://sa-policy-space.vercel.app",
    // Allow localhost during development
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://localhost:3001"]
      : []),
  ];
  if (!origin || !allowedOrigins.some((o) => origin.startsWith(o))) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // ── Rate limiting ──────────────────────────────────────────────────────────
  // Note: in-memory map resets on cold start; this is a best-effort guard.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Window": "3600",
        },
      }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  let body: { reformId: string; audience: Audience; reformLabel: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { reformId, audience, reformLabel } = body;
  if (!reformId || !audience || !reformLabel) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Fetch context data server-side
  let context: unknown;
  try {
    const { getPackageDetail, getIdeas } = await import("@/lib/api");
    if (reformId.startsWith("pkg_")) {
      const packageId = parseInt(reformId.replace("pkg_", ""), 10);
      context = await getPackageDetail(packageId);
    } else {
      const searchTerm = reformLabel.replace(/^Idea:\s*/i, "");
      const ideas = await getIdeas({ search: searchTerm });
      context = ideas.slice(0, 5);
    }
  } catch (err) {
    console.error("[generate-brief] Failed to fetch context:", err);
    context = { note: "Database context unavailable for this session." };
  }

  const prompt = buildPrompt(audience, reformLabel, context);
  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 2048,
          thinking: { type: "adaptive" },
          messages: [{ role: "user", content: prompt }],
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Generation failed";
        controller.enqueue(encoder.encode(`\n\n[Error: ${msg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
