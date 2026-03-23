import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

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

  // Fetch context data server-side from local DB or Supabase
  let context: unknown;
  try {
    if (reformId.startsWith("pkg_")) {
      const packageId = parseInt(reformId.replace("pkg_", ""), 10);
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { getPackageDetail } = await import("@/lib/supabase-api");
        context = await getPackageDetail(packageId);
      } else {
        const { getPackageDetail } = await import("@/lib/local-api");
        context = getPackageDetail(packageId);
      }
    } else {
      // Strip "Idea: " prefix to get the search term
      const searchTerm = reformLabel.replace(/^Idea:\s*/i, "");
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { getIdeas } = await import("@/lib/supabase-api");
        const ideas = await getIdeas({ search: searchTerm });
        context = ideas.slice(0, 5);
      } else {
        const { getIdeas } = await import("@/lib/local-api");
        const ideas = getIdeas({ search: searchTerm });
        context = ideas.slice(0, 5);
      }
    }
  } catch (err) {
    console.error("[generate-brief] Failed to fetch context:", err);
    // Proceed with empty context so Claude can still generate using general knowledge
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
