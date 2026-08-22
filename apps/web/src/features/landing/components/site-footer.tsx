import { Shield, Sparkles, Video } from "lucide-react";
import Link from "next/link";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/sign-up", label: "Instant Meeting" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Sales" },
      { href: "/contact", label: "Support" },
      { href: "/about", label: "Careers" },
    ],
  },
  {
    title: "Legal & Trust",
    links: [
      { href: "/about", label: "Privacy Policy" },
      { href: "/about", label: "Terms of Service" },
      { href: "/about", label: "Security Whitepaper" },
      { href: "/about", label: "Compliance (GDPR)" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-muted/20">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Video className="size-4" />
              </span>
              <span className="text-lg font-bold">Meetstack</span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              Ultra-fast, frictionless video meetings directly in your browser. No downloads, no mandatory accounts for guests, and enterprise-grade privacy by default.
            </p>

            {/* Operational Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational (99.99% uptime)
            </div>
          </div>

          {/* Nav Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-foreground hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Meetstack Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-primary" /> End-to-End Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" /> WebRTC Ultra-Low Latency
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
