export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { MunicipalFinance } from "@/lib/supabase";
import MunicipalClient from "./MunicipalClient";

export const metadata: Metadata = {
  title: "Municipal Finance",
  description:
    "Financial health dashboard for South Africa's 8 metropolitan municipalities — revenue, expenditure, capital spending, and cash position trends.",
};

export default async function MunicipalPage() {
  let rows: MunicipalFinance[] = [];

  if (supabase) {
    try {
      const { data } = await supabase
        .from("municipal_finance")
        .select("municipality_code, municipality_name, municipality_type, province, indicator, financial_year, amount_rands")
        .order("municipality_name")
        .order("financial_year");
      rows = (data ?? []) as MunicipalFinance[];
    } catch (e) {
      console.error("[municipal] data fetch failed:", e);
    }
  }

  return <MunicipalClient initialData={rows} />;
}
