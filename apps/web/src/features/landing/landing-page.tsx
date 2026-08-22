import { CtaSection } from "@/features/landing/components/cta-section";
import { FaqSection } from "@/features/landing/components/faq-section";
import { FeatureGrid } from "@/features/landing/components/feature-grid";
import { Hero } from "@/features/landing/components/hero";
import { InteractiveShowcase } from "@/features/landing/components/interactive-showcase";
import { LogoStrip } from "@/features/landing/components/logo-strip";
import { SiteFooter } from "@/features/landing/components/site-footer";
import { SiteNav } from "@/features/landing/components/site-nav";
import { Testimonials } from "@/features/landing/components/testimonials";

export function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col selection:bg-primary/20 selection:text-primary">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <LogoStrip />
        <InteractiveShowcase />
        <FeatureGrid />
        <Testimonials />
        <FaqSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
