export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getIdeas } from "@/lib/api";
import type { PolicyIdea } from "@/lib/supabase";
import IdeasClient from "./IdeasClient";

export const metadata: Metadata = {
  title: "Policy Ideas",
  description:
    "Browse 132 South African policy reform ideas with filtering by constraint, package, status, and more.",
};

export default async function IdeasPage() {
  let ideas: PolicyIdea[] = [];
  try {
    ideas = await getIdeas() as unknown as PolicyIdea[];
  } catch {
    // Fallback to empty — IdeasClient handles the empty state
  }
  return <IdeasClient initialIdeas={ideas} />;
}
