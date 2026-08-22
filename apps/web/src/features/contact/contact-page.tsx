"use client";

import { ContactForm } from "@/features/contact/components/contact-form";
import { SiteFooter } from "@/features/landing/components/site-footer";
import { SiteNav } from "@/features/landing/components/site-nav";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

const CONTACT_CHANNELS = [
  {
    title: "Engineering Support",
    email: "support@meetstack.live",
    desc: "Technical troubleshooting, WebRTC connections & bugs",
    icon: Headphones,
  },
  {
    title: "Enterprise & Sales",
    email: "sales@meetstack.live",
    desc: "Custom deployments, SSO, volume discounts & invoicing",
    icon: Mail,
  },
  {
    title: "Security & Legal",
    email: "security@meetstack.live",
    desc: "Vulnerability disclosures, compliance & DPA requests",
    icon: ShieldCheck,
  },
];

const LOCATIONS = [
  { city: "San Francisco, CA", address: "500 Howard St, Suite 400" },
  { city: "London, UK", address: "100 Bishopsgate, Level 18" },
  { city: "Bengaluru, IN", address: "Indiranagar 100ft Rd, 3rd Floor" },
];

export function ContactPage() {
  return (
    <div className="flex min-h-svh flex-col selection:bg-primary/20 selection:text-primary">
      <SiteNav />
      <main className="flex-1">
        <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
              <Sparkles className="size-3" />
              We&apos;re Here to Help
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground text-balance sm:text-6xl">
              Let&apos;s talk about frictionless meetings
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-balance leading-relaxed">
              Have questions about Meetstack, custom enterprise plans, or WebRTC integrations?
              We respond promptly.
            </p>
          </div>

          {/* Dual-Column Grid */}
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Info Column */}
            <div className="space-y-6 lg:col-span-5">
              {/* Visual Support Graphic Card */}
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-md backdrop-blur-md">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted/40">
                  <Image
                    src="/images/contact-support.jpg"
                    alt="Meetstack 24/7 Global Support Hub"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold text-foreground">Support Engineers Online</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Clock className="size-3.5" />
                    &lt; 15 min avg response
                  </div>
                </div>
              </div>

              {/* Direct Channels */}
              <div className="space-y-3">
                {CONTACT_CHANNELS.map(({ title, email, desc, icon: Icon }) => (
                  <Card key={title} className="border-border/70 bg-card/70 backdrop-blur-sm transition-colors hover:border-primary/40">
                    <CardContent className="flex items-start gap-3.5 p-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <Icon className="size-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-foreground">{title}</h4>
                        <a
                          href={`mailto:${email}`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          {email}
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Global Hubs */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                  <MapPin className="size-3.5 text-primary" />
                  Global Hubs & Presence
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
                  {LOCATIONS.map((loc) => (
                    <div key={loc.city} className="text-xs">
                      <p className="font-semibold text-foreground">{loc.city}</p>
                      <p className="text-muted-foreground">{loc.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
