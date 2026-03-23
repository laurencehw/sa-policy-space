/**
 * Shared utility functions — safe to import in both client and server components.
 */

/**
 * Convert a title string to a URL-friendly slug.
 * "Transport Economic Regulator: Operationalising the EROT Act"
 * → "transport-economic-regulator-operationalising-the-erot-act"
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")  // strip special chars (keep spaces & hyphens)
    .trim()
    .replace(/\s+/g, "-")           // spaces → hyphens
    .replace(/-+/g, "-")            // collapse multiple hyphens
    .replace(/^-|-$/g, "");         // trim leading/trailing hyphens
}
