import { PricingPage } from "@/features/pricing/pricing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans & Features — Meetstack",
  description:
    "Simple, predictable pricing for individuals, teams, and enterprises. Start free forever with 1-click guest access and HD video.",
};

export default function Pricing() {
  return <PricingPage />;
}
