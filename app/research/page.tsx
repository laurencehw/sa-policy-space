export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { ResearchPaper, PolicyIdea } from "@/lib/supabase";
import ResearchClient from "./ResearchClient";

export const metadata: Metadata = {
  title: "Research & Evidence Base",
  description:
    "Academic and policy research papers with evidence mapping to South African reform themes and binding constraints.",
};

export default async function ResearchPage() {
  let papers: ResearchPaper[] = [];
  let ideas: Pick<PolicyIdea, "id" | "title" | "slug" | "binding_constraint" | "current_status">[] = [];

  if (supabase) {
    try {
      const [papersResult, ideasResult] = await Promise.all([
        supabase
          .from("research_papers")
          .select("id, title, authors, publication_date, source_org, paper_type, url, pdf_url, abstract, themes")
          .order("publication_date", { ascending: false }),
        supabase
          .from("policy_ideas")
          .select("id, title, slug, binding_constraint, current_status"),
      ]);
      papers = (papersResult.data ?? []) as ResearchPaper[];
      ideas = (ideasResult.data ?? []) as typeof ideas;
    } catch (e) {
      console.error("[research] data fetch failed:", e);
    }
  }

  return <ResearchClient initialPapers={papers} policyIdeas={ideas} />;
}
