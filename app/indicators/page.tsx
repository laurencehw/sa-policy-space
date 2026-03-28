import type { Metadata } from "next";
import { Suspense } from "react";
import IndicatorsClient from "./IndicatorsClient";
import indicatorsFull from "@/data/indicators_full.json";

export const metadata: Metadata = {
  title: "Economic Indicators",
  description:
    "Key South African economic indicators mapped to binding growth constraints — GDP, unemployment, load shedding, inequality, trade, and more.",
};

export default function IndicatorsPage() {
  return (
    <Suspense fallback={<div className="space-y-4"><div className="h-10 bg-gray-100 rounded animate-pulse" /><div className="h-64 bg-gray-50 rounded-lg animate-pulse" /></div>}>
      <IndicatorsClient indicators={indicatorsFull} />
    </Suspense>
  );
}
