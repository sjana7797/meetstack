import { AboutPage } from "@/features/about/about-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Meetstack",
  description:
    "Meetstack was founded to make video meetings frictionless. Learn about our mission, principles, and the team building ultra-low latency communication.",
};

export default function About() {
  return <AboutPage />;
}
