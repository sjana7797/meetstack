"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { CheckCircle2, Quote, Star } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    quote:
      "We replaced three legacy video tools with Meetstack. Meetings start in literal seconds, and client guests never fumble with app store downloads or sign-up screens.",
    name: "Priya Nair",
    role: "Head of Operations",
    company: "Northwind Tech",
    avatar: "/images/avatar-priya.jpg",
    rating: 5,
  },
  {
    quote:
      "Screen sharing crisp terminal code and Figma boards at 60fps with zero latency lag has transformed our remote engineering standups and design reviews.",
    name: "Marcus Webb",
    role: "Engineering Director",
    company: "Vertex Cloud",
    avatar: "/images/avatar-marcus.jpg",
    rating: 5,
  },
  {
    quote:
      "The instant guest link is our secret superpower. We send a calendar invite with the URL, and clients jump straight into our pitch room with no friction whatsoever.",
    name: "Elena Cruz",
    role: "Founder & CEO",
    company: "Kestrel Co.",
    avatar: "/images/avatar-elena.jpg",
    rating: 5,
  },
] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Testimonials() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-2xl text-center"
      >
        <div className="flex items-center justify-center gap-1 text-amber-500 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="size-4 fill-amber-500" />
          ))}
          <span className="ml-2 text-xs font-semibold text-foreground">4.9 / 5.0 rating</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Loved by teams that value their time
        </h2>
        <p className="mt-3 text-muted-foreground text-balance">
          Here&apos;s why engineering leads, operations directors, and founders choose Meetstack every single day.
        </p>
      </motion.div>

      <motion.div
        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.12 }}
      >
        {TESTIMONIALS.map(({ quote, name, role, company, avatar, rating }) => (
          <motion.div key={name} variants={item}>
            <Card className="flex h-full flex-col justify-between border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md">
              <CardContent className="p-0 space-y-4">
                <Quote className="size-6 text-primary/40" />
                <p className="text-sm leading-relaxed text-foreground/90">&ldquo;{quote}&rdquo;</p>
              </CardContent>

              <div className="mt-6 flex items-center gap-3.5 border-t border-border/60 pt-4">
                <div className="relative size-12 overflow-hidden rounded-full border border-border/80 bg-muted shrink-0">
                  <Image src={avatar} alt={name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                    <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {role} • <span className="font-medium text-foreground/80">{company}</span>
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
