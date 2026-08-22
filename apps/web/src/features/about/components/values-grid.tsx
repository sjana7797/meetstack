"use client";

import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { EyeOff, Feather, Heart, Layers, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { motion, type Variants } from "motion/react";

const VALUES = [
  {
    icon: Zap,
    tag: "Speed First",
    title: "Fast by default",
    description:
      "Every millisecond matters. Every single architecture decision is measured against one standard: does this get participants into their conversation faster?",
  },
  {
    icon: Feather,
    tag: "Clarity",
    title: "Simple over feature-bloated",
    description:
      "We resist clutter. Instead of burying calls in endless configuration menus, every control in Meetstack is intuitive, obvious, and immediate.",
  },
  {
    icon: ShieldCheck,
    tag: "Integrity",
    title: "Private by fundamental design",
    description:
      "We never sell participant telemetry or record conversations without explicit permission. Privacy is standard, not an expensive enterprise add-on.",
  },
  {
    icon: Heart,
    tag: "Human-Centric",
    title: "Crafted for real human collaboration",
    description:
      "Engineered around how real remote engineers, designers, and teams work — spontaneous pair programming, design reviews, and client pitches.",
  },
] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function ValuesGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.1 }}
    >
      {VALUES.map(({ icon: Icon, tag, title, description }) => (
        <motion.div key={title} variants={item}>
          <Card className="group h-full border-border/70 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-5" />
              </span>
              <span className="rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {tag}
              </span>
            </CardHeader>
            <CardContent className="space-y-2 pt-3">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
