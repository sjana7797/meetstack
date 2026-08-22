"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import {
  ArrowRight,
  Check,
  HelpCircle,
  Minus,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const TIERS = [
  {
    name: "Free",
    tagline: "For individuals and quick catch-ups",
    priceMonthly: "$0",
    priceAnnual: "$0",
    period: "forever free",
    badge: null,
    highlighted: false,
    cta: "Start meeting free",
    features: [
      "Up to 8 active video participants",
      "Unlimited daily meetings (45m per call)",
      "High-definition 1080p video",
      "Crisp 60fps screen sharing",
      "1-Click guest access via link",
      "Standard WebRTC encryption",
    ],
  },
  {
    name: "Business Standard",
    tagline: "For growing teams that meet every day",
    priceMonthly: "$12",
    priceAnnual: "$9.60",
    period: "per host / month",
    badge: "Recommended",
    highlighted: true,
    cta: "Start 14-day free trial",
    features: [
      "Up to 50 active video participants",
      "Unlimited call duration (no time caps)",
      "Ultra-clear 4K screen streaming",
      "AI background noise cancellation",
      "Custom branded room URLs",
      "End-to-end encrypted rooms & passwords",
      "Priority 24/7 technical support",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For organizations demanding security & controls at scale",
    priceMonthly: "$29",
    priceAnnual: "$23.20",
    period: "per host / month",
    badge: null,
    highlighted: false,
    cta: "Contact sales",
    features: [
      "Up to 200 interactive participants",
      "Unlimited call duration & cloud rooms",
      "SAML SSO (Okta, Google Workspace, Azure)",
      "Centralized admin & user provisioning",
      "Custom domain & white-label branding",
      "Dedicated account manager & 99.99% SLA",
      "Audit logs & SOC2 compliance reports",
    ],
  },
] as const;

const COMPARISON_FEATURES = [
  {
    category: "Video & Audio Experience",
    rows: [
      { name: "Max Video Participants", free: "8", pro: "50", team: "200" },
      { name: "Meeting Duration Limit", free: "45 mins", pro: "Unlimited", team: "Unlimited" },
      { name: "Video Resolution", free: "1080p HD", pro: "1080p HD / 4K", team: "4K UHD" },
      { name: "Screen Share Frame Rate", free: "30 fps", pro: "60 fps", team: "60 fps" },
      { name: "AI Noise Suppression", free: false, pro: true, team: true },
    ],
  },
  {
    category: "Access & Collaboration",
    rows: [
      { name: "No-Account Guest Join", free: true, pro: true, team: true },
      { name: "Custom Room Links", free: false, pro: true, team: true },
      { name: "White-Label & Custom Branding", free: false, pro: false, team: true },
      { name: "Multi-party Screen Annotation", free: false, pro: true, team: true },
    ],
  },
  {
    category: "Security & Administration",
    rows: [
      { name: "WebRTC E2E Encryption", free: true, pro: true, team: true },
      { name: "Room Passwords & Waiting Gates", free: true, pro: true, team: true },
      { name: "SAML SSO & Directory Sync", free: false, pro: false, team: true },
      { name: "Admin Dashboard & Usage Analytics", free: false, pro: "Basic", team: "Advanced" },
      { name: "99.99% Uptime SLA", free: false, pro: false, team: true },
      { name: "Dedicated Support Support", free: "Community", pro: "Priority Email", team: "24/7 Dedicated" },
    ],
  },
];

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function PricingTiers() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="space-y-16">
      {/* Annual / Monthly Toggle (Google style) */}
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="inline-flex items-center rounded-full border border-border bg-muted/50 p-1">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
              !annual ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly billing
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition-all ${
              annual ? "bg-background text-[#1a73e8] dark:text-[#8ab4f8] shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual billing
            <span className="rounded-full bg-[#00ac47]/10 px-2 py-0.5 text-[10px] font-bold text-[#00ac47]">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards (Google Workspace Style) */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.08 }}
      >
        {TIERS.map((tier) => {
          const price = annual ? tier.priceAnnual : tier.priceMonthly;

          return (
            <motion.div key={tier.name} variants={item}>
              <Card
                className={`relative flex h-full flex-col justify-between rounded-3xl border transition-all duration-200 ${
                  tier.highlighted
                    ? "border-[#1a73e8] bg-card shadow-xl ring-2 ring-[#1a73e8]"
                    : "border-border bg-card shadow-sm hover:shadow-md"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#1a73e8] px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
                      <Sparkles className="size-3" />
                      {tier.badge}
                    </span>
                  </div>
                )}

                <CardHeader className="gap-2 pt-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{tier.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{tier.tagline}</p>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-4xl font-normal tracking-tight text-foreground">
                      {price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tier.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between gap-6 pt-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <Check className="size-4 shrink-0 text-[#1a73e8] dark:text-[#8ab4f8] mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    render={<Link href={tier.name.includes("Enterprise") ? "/contact" : "/sign-up"} />}
                    className={`w-full rounded-full font-semibold shadow-sm ${
                      tier.highlighted
                        ? "bg-[#1a73e8] text-white hover:bg-[#1557b0]"
                        : "border-[#1a73e8] text-[#1a73e8] dark:text-[#8ab4f8] hover:bg-[#1a73e8]/10"
                    }`}
                    variant={tier.highlighted ? "default" : "outline"}
                    size="lg"
                  >
                    {tier.cta}
                    <ArrowRight className="size-4 ml-1.5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Feature Comparison Matrix */}
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-2xl font-normal tracking-tight text-foreground">
            Compare all features
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed breakdown of video capabilities, participants, and security settings across tiers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 font-semibold text-foreground">Feature</th>
                <th className="py-3 px-4 font-semibold text-foreground">Free</th>
                <th className="py-3 px-4 font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">Business Standard</th>
                <th className="py-3 px-4 font-semibold text-foreground">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((section) => (
                <div key={section.category} className="contents">
                  <tr className="border-t border-border/60 bg-muted/40">
                    <td colSpan={4} className="py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.category}
                    </td>
                  </tr>
                  {section.rows.map((row) => (
                    <tr key={row.name} className="border-b border-border/40 hover:bg-muted/20">
                      <td className="py-3 px-4 font-medium text-foreground/90">{row.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {typeof row.free === "boolean" ? (
                          row.free ? (
                            <Check className="size-4 text-[#1a73e8]" />
                          ) : (
                            <Minus className="size-4 text-muted-foreground/40" />
                          )
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? (
                            <Check className="size-4 text-[#1a73e8]" />
                          ) : (
                            <Minus className="size-4 text-muted-foreground/40" />
                          )
                        ) : (
                          row.pro
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {typeof row.team === "boolean" ? (
                          row.team ? (
                            <Check className="size-4 text-[#1a73e8]" />
                          ) : (
                            <Minus className="size-4 text-muted-foreground/40" />
                          )
                        ) : (
                          row.team
                        )}
                      </td>
                    </tr>
                  ))}
                </div>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
