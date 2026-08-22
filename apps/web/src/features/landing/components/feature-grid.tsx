"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import {
  Globe2,
  Lock,
  Mic2,
  Monitor,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Video,
  Zap,
} from "lucide-react";
import { motion, type Variants } from "motion/react";

const FEATURES = [
  {
    icon: Video,
    color: "text-[#1a73e8] bg-[#1a73e8]/10",
    title: "HD Video & Audio",
    description:
      "Engineered with adaptive WebRTC simulcast so your calls stay sharp and continuous even over unpredictable Wi-Fi connections.",
  },
  {
    icon: Monitor,
    color: "text-[#00ac47] bg-[#00ac47]/10",
    title: "Crystal-Clear Screen Sharing",
    description:
      "Present slide decks, Figma prototypes, or code editor tabs in 60fps high definition with pristine text readability.",
  },
  {
    icon: UserCheck,
    color: "text-[#f9ab00] bg-[#f9ab00]/10",
    title: "Frictionless 1-Click Join",
    description:
      "Guests can join directly from their browser without downloading software or creating an account.",
  },
  {
    icon: ShieldCheck,
    color: "text-[#ea4335] bg-[#ea4335]/10",
    title: "Secure & Encrypted",
    description:
      "All video and audio streams are encrypted in transit. Meeting rooms are locked exclusively to the people you invite.",
  },
  {
    icon: Mic2,
    color: "text-[#1a73e8] bg-[#1a73e8]/10",
    title: "Intelligent Audio Suppression",
    description:
      "Acoustic noise suppression filters out background keyboard typing, room echo, and ambient sounds for clearer voice.",
  },
  {
    icon: Smartphone,
    color: "text-[#00ac47] bg-[#00ac47]/10",
    title: "Cross-Device Compatibility",
    description:
      "Join seamlessly from Chrome, Safari, Firefox, Edge, iOS, Android, or tablet browsers with zero plugin requirements.",
  },
];

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          Everything you need for{" "}
          <span className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">
            productive meetings
          </span>
        </h2>
        <p className="mt-3 text-base text-muted-foreground text-balance">
          Simple, helpful tools built to make every conversation feel natural and effortless.
        </p>
      </div>

      <motion.div
        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.08 }}
      >
        {FEATURES.map(({ icon: Icon, color, title, description }) => (
          <motion.div key={title} variants={item}>
            <Card className="h-full rounded-2xl border-border/80 bg-card p-6 shadow-sm transition-all hover:border-border hover:shadow-md">
              <CardContent className="p-0 space-y-3">
                <div className={`flex size-12 items-center justify-center rounded-2xl ${color}`}>
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
