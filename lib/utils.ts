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

/**
 * Format a Rand amount (in Rands, not thousands) into a human-readable string.
 * e.g. 1_200_000_000 → "R1.2bn", 450_000_000 → "R450m", 15_000 → "R15k"
 */
export function formatRands(amountRands: number): string {
  const abs = Math.abs(amountRands);
  const sign = amountRands < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}R${(abs / 1_000_000_000).toFixed(1)}bn`;
  if (abs >= 1_000_000) return `${sign}R${(abs / 1_000_000).toFixed(0)}m`;
  if (abs >= 1_000) return `${sign}R${(abs / 1_000).toFixed(0)}k`;
  return `${sign}R${abs.toLocaleString("en-ZA")}`;
}
