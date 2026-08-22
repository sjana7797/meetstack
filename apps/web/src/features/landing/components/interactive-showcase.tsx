"use client";

import { Card } from "@repo/ui/components/card";
import {
  CheckCircle2,
  Lock,
  Monitor,
  Share2,
  Sparkles,
  UserCheck,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const TABS = [
  {
    id: "guest-join",
    title: "1-Click Guest Join",
    subtitle: "Zero signups or downloads",
    icon: UserCheck,
    image: "/images/feature-guest-join.jpg",
    heading: "Invite anyone with a simple link. They're in.",
    description:
      "Guests don't want to install an app, create an account, or navigate security prompts just for a quick 10-minute sync. With Meetstack, they click your link and join instantly in their browser.",
    points: [
      "No account creation required for participants",
      "Instant joining on mobile Safari, Chrome, and desktop",
      "Custom room nicknames and guest moderation",
    ],
  },
  {
    id: "screen-share",
    title: "Crystal-Clear Screen Share",
    subtitle: "High-FPS docs & code streams",
    icon: Monitor,
    image: "/images/feature-screenshare.jpg",
    heading: "Share any window, tab, or screen in 4K clarity",
    description:
      "Engineered with adaptive WebRTC simulcast. Whether sharing complex source code, high-motion prototypes, or slide decks, visual fidelity remains sharp with near-zero latency.",
    points: [
      "Up to 60fps buttery-smooth motion",
      "Integrated laser pointer and collaborative spotlight",
      "Select specific application windows or whole display",
    ],
  },
  {
    id: "encryption",
    title: "End-to-End Privacy",
    subtitle: "Locked to your participants",
    icon: Lock,
    image: "/images/feature-encryption.jpg",
    heading: "Enterprise security baked into every packet",
    description:
      "Every video stream is encrypted end-to-end. We don't store recordings without consent, sell meeting metadata, or train models on your private conversations.",
    points: [
      "AES-256 encrypted peer-to-peer data channels",
      "Private room passwords and waiting room gates",
      "GDPR and SOC2 compliance ready",
    ],
  },
  {
    id: "video-grid",
    title: "Adaptive HD Video",
    subtitle: "Flawless on any network",
    icon: Video,
    image: "/images/hero-meeting-preview.jpg",
    heading: "Crisp multi-party video that adjusts to your bandwidth",
    description:
      "Our intelligent SFU architecture automatically adapts video resolution and bitrate based on each participant's connection strength, preventing stutter and frozen screens.",
    points: [
      "Adaptive bitrate scaling for unstable connections",
      "AI-powered background noise suppression",
      "Minimal CPU and battery consumption",
    ],
  },
];

export function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const current = TABS[activeTab];

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3" />
          Interactive Product Tour
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Engineered for the way modern teams work
        </h2>
        <p className="mt-3 text-muted-foreground text-balance">
          Explore how Meetstack eliminates every barrier between starting a conversation and collaborating effectively.
        </p>
      </div>

      {/* Tab Selectors */}
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isSelected = activeTab === idx;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10 ring-1 ring-primary"
                  : "border-border/70 bg-card/60 hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <div
                className={`flex size-9 items-center justify-center rounded-lg mb-2.5 ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <Icon className="size-4.5" />
              </div>
              <div className={`text-sm font-semibold ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                {tab.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{tab.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Showcase Card Display */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Card className="overflow-hidden border-border/80 bg-card/90 shadow-xl backdrop-blur-md">
              <div className="grid grid-cols-1 items-center gap-8 p-6 lg:grid-cols-12 lg:p-10">
                {/* Left Description Column */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <current.icon className="size-3.5" />
                    {current.title}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {current.heading}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {current.description}
                  </p>

                  <ul className="space-y-2.5 pt-2">
                    {current.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/90">
                        <CheckCircle2 className="size-4.5 shrink-0 text-primary mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Image Mockup Preview */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/70 bg-muted/20 shadow-lg lg:col-span-7">
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    className="object-cover transition-all duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
