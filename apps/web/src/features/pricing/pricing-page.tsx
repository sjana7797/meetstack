import { FaqSection } from "@/features/landing/components/faq-section";
import { SiteFooter } from "@/features/landing/components/site-footer";
import { SiteNav } from "@/features/landing/components/site-nav";
import { PricingTiers } from "@/features/pricing/components/pricing-tiers";
import { CheckCircle2, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";

const TRUST_BADGES = [
  { label: "End-to-End Encryption", desc: "DTLS-SRTP WebRTC security", icon: Lock },
  { label: "SOC2 Type II Certified", desc: "Enterprise operational standard", icon: ShieldCheck },
  { label: "GDPR & Privacy Compliant", desc: "Zero tracking & data brokering", icon: CheckCircle2 },
  { label: "99.99% Global Uptime SLA", desc: "Edge routed media servers", icon: Zap },
];

export function PricingPage() {
  return (
    <div className="flex min-h-svh flex-col selection:bg-primary/20 selection:text-primary">
      <SiteNav />
      <main className="flex-1">
        <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
              <Sparkles className="size-3" />
              Simple, Predictable Plans
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground text-balance sm:text-6xl">
              Start free. Scale with your team.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-balance leading-relaxed">
              No hidden fees, no seat minimums on self-serve plans, and free meeting rooms forever.
            </p>
          </div>

          {/* Pricing Tiers & Comparison Table */}
          <div className="mt-14">
            <PricingTiers />
          </div>

          {/* Trust & Compliance Bar */}
          <div className="mt-20 rounded-2xl border border-border/80 bg-muted/20 p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_BADGES.map(({ label, desc, icon: Icon }) => (
                <div key={label} className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{label}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing FAQ */}
          <div className="mt-16">
            <FaqSection />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
