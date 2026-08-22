"use client";

import { ValuesGrid } from "@/features/about/components/values-grid";
import { SiteFooter } from "@/features/landing/components/site-footer";
import { SiteNav } from "@/features/landing/components/site-nav";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Radio,
  Sparkles,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const MILESTONES = [
  { value: "10M+", label: "Meeting minutes hosted" },
  { value: "140+", label: "Countries connected" },
  { value: "99.99%", label: "Platform uptime" },
  { value: "0", label: "Downloads required" },
];

const COMPARISONS = [
  {
    category: "Guest Experience",
    legacy: "Download 150MB installer, create account, allow 5 system permissions",
    meetstack: "Click link, enter name, join in 2 seconds directly in browser",
  },
  {
    category: "Screen Sharing",
    legacy: "Laggy 15-30fps stream with compressed blurry fonts and delayed clicks",
    meetstack: "Ultra-sharp 60fps WebRTC stream with pristine sub-pixel rendering",
  },
  {
    category: "Privacy & Data",
    legacy: "Track attendees, inject telemetry, upsell ad products and cloud services",
    meetstack: "End-to-end encrypted streams, zero data brokering, zero trackers",
  },
  {
    category: "Interface Bloat",
    legacy: "Hundreds of hidden settings, floating popups, and confusing controls",
    meetstack: "Distraction-free interface focused purely on conversation and content",
  },
];

const LEADERSHIP = [
  {
    name: "Alex Chen",
    role: "Co-Founder & Chief Architect",
    bio: "Ex-WebRTC protocol engineer. Obsessed with sub-40ms latency and high-performance video codecs.",
    avatar: "/images/avatar-alex.jpg",
  },
  {
    name: "Elena Cruz",
    role: "Co-Founder & CEO",
    bio: "Product designer turned founder. Passionate about removing software friction and unnecessary clicks.",
    avatar: "/images/avatar-elena.jpg",
  },
  {
    name: "Marcus Webb",
    role: "VP of Engineering",
    bio: "Distributed systems specialist. Leads global edge infrastructure and media server clustering.",
    avatar: "/images/avatar-marcus.jpg",
  },
  {
    name: "Priya Nair",
    role: "Head of Operations & Trust",
    bio: "Scaled security and customer operations across 3 high-growth collaborative SaaS platforms.",
    avatar: "/images/avatar-priya.jpg",
  },
];

export function AboutPage() {
  return (
    <div className="flex min-h-svh flex-col selection:bg-primary/20 selection:text-primary">
      <SiteNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-20">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[32rem] rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
              <Sparkles className="size-3" />
              Our Mission & Story
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground text-balance sm:text-6xl">
              Meetings shouldn&apos;t feel like a chore
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed text-balance">
              Meetstack started with a simple frustration: too many clicks, downloads, and logins
              between wanting to talk to someone and actually talking to them. We are building the
              streamlined version of video conferencing that gets out of your way.
            </p>
          </div>

          {/* Team Collaboration Banner Image */}
          <div className="relative mx-auto mt-12 max-w-5xl px-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/80 bg-muted/20 shadow-2xl shadow-primary/10">
              <Image
                src="/images/about-team-collab.jpg"
                alt="Meetstack Team Collaborating Across the Globe"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-2 text-foreground sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold">Global, Distributed & Remote-First</p>
                  <p className="text-xs text-muted-foreground">
                    Building the future of friction-free real-time communication
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-md">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Distributed across 12 timezones
                </div>
              </div>
            </div>
          </div>

          {/* Milestones Stats */}
          <div className="mx-auto mt-14 max-w-5xl px-6">
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md sm:grid-cols-4">
              {MILESTONES.map(({ value, label }) => (
                <div key={label} className="text-center p-3">
                  <div className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Legacy vs Meetstack Comparison */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why we built Meetstack
            </h2>
            <p className="mt-3 text-muted-foreground text-balance">
              Video software evolved into bloated desktop platforms that slow you down. Here is how we differ.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            {COMPARISONS.map((item) => (
              <Card key={item.category} className="border-border/70 bg-card/80 p-6 backdrop-blur-sm">
                <CardContent className="p-0 space-y-4">
                  <h3 className="text-base font-bold text-foreground">{item.category}</h3>

                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400 mb-1">
                      <XCircle className="size-4 shrink-0" />
                      Legacy Meeting Apps
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.legacy}</p>
                  </div>

                  <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3.5 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                      <CheckCircle2 className="size-4 shrink-0" />
                      The Meetstack Way
                    </div>
                    <p className="text-foreground/90 leading-relaxed font-medium">{item.meetstack}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Grid */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What drives our engineering
            </h2>
            <p className="mt-3 text-muted-foreground text-balance">
              Our principles determine every line of code we write and every feature we choose not to build.
            </p>
          </div>
          <div className="mt-12">
            <ValuesGrid />
          </div>
        </section>

        {/* Team Leadership */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
              <Users className="size-3" />
              Leadership
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Meet the builders behind Meetstack
            </h2>
            <p className="mt-3 text-muted-foreground text-balance">
              A distributed team of engineers and designers dedicated to making real-time communication effortless.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((member) => (
              <Card key={member.name} className="overflow-hidden border-border/70 bg-card/80 transition-all hover:border-primary/40 hover:shadow-md">
                <div className="relative aspect-square w-full bg-muted">
                  <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                </div>
                <CardContent className="p-5 space-y-1.5">
                  <h3 className="font-bold text-foreground">{member.name}</h3>
                  <p className="text-xs font-semibold text-primary">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-2">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Join CTA */}
        <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
          <div className="rounded-3xl border border-border/80 bg-muted/30 p-10 backdrop-blur-md">
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              Ready to experience meetings without friction?
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Try your first room in seconds. No credit card required.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button render={<Link href="/sign-up" />} size="lg" className="px-6 font-semibold">
                Start a meeting free
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
