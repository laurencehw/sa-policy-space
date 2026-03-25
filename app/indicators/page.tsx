import type { Metadata } from "next";
import IndicatorsClient from "./IndicatorsClient";
import indicatorsFull from "@/data/indicators_full.json";

export const metadata: Metadata = {
  title: "Economic Indicators",
  description:
    "Key South African economic indicators mapped to binding growth constraints — GDP, unemployment, load shedding, inequality, trade, and more.",
};

export default function IndicatorsPage() {
  return <IndicatorsClient indicators={indicatorsFull} />;
}
