"use client";

import { Button } from "@repo/ui/components/button";
import { ArrowRight, CheckCircle2, Video } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function CtaSection() {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-[#1a73e8]/10 via-card to-card px-8 py-16 text-center shadow-lg sm:px-16 sm:py-20"
      >
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Start meeting with{" "}
            <span className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">
              Meetstack today
            </span>
          </h2>

          <p className="mx-auto text-base text-muted-foreground leading-relaxed text-balance">
            Zero setup, no mandatory accounts for guests, and enterprise-grade privacy right in your browser.
          </p>

          <div className="pt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              render={<Link href="/sign-up" />}
              size="lg"
              className="rounded-full bg-[#1a73e8] px-8 text-sm font-semibold text-white hover:bg-[#1557b0] shadow-md shadow-[#1a73e8]/20"
            >
              <Video className="size-4 mr-2" />
              Start a meeting now
            </Button>
            <Button
              render={<Link href="/pricing" />}
              variant="outline"
              size="lg"
              className="rounded-full border-border text-foreground hover:bg-muted font-medium"
            >
              View pricing & plans
            </Button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-[#00ac47]" /> Free forever tier
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-[#00ac47]" /> No software downloads
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-[#00ac47]" /> End-to-end encrypted
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
