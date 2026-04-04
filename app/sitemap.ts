import type { MetadataRoute } from "next";
import { slugify } from "@/lib/utils";

const BASE_URL = "https://sa-policy-space.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/ideas`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/packages`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/themes`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/analytics`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/budget`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/municipal`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/research`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/comparisons`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/methodology`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Package pages
  const packagePages: MetadataRoute.Sitemap = [1, 2, 3, 4, 5].map((id) => ({
    url: `${BASE_URL}/packages/${id}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Idea pages — fetched from DB
  let ideaPages: MetadataRoute.Sitemap = [];
  try {
    const isLocal = !process.env.NEXT_PUBLIC_SUPABASE_URL;
    let ideas: { slug?: string | null; title: string }[];
    if (isLocal) {
      const { getIdeas } = await import("@/lib/local-api");
      ideas = getIdeas() as { slug?: string | null; title: string }[];
    } else {
      const { getIdeas } = await import("@/lib/supabase-api");
      ideas = await getIdeas();
    }
    ideaPages = ideas.map((idea) => ({
      url: `${BASE_URL}/ideas/${idea.slug || slugify(idea.title)}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Skip idea pages if data fetch fails
  }

  return [...staticPages, ...packagePages, ...ideaPages];
}
