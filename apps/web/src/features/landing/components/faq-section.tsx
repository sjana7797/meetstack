"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { HelpCircle, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const FAQS = [
  {
    question: "Do meeting guests need to create an account or download an app?",
    answer:
      "Absolutely not. Anyone with your meeting link can join in one click directly inside their web browser (Chrome, Safari, Edge, Firefox, Brave). No plugins, no installers, and no password setup required for attendees.",
  },
  {
    question: "How is screen sharing quality and frame rate handled?",
    answer:
      "Meetstack supports high-definition 1080p and 4K screen streaming up to 60 frames per second. We use specialized sub-packet encoding optimized for text, terminal code, and fluid UI animations with ultra-low latency.",
  },
  {
    question: "How many participants are supported per meeting room?",
    answer:
      "The Free tier supports up to 8 participants with unlimited daily meetings. Pro plans support up to 50 active video participants, and Team/Enterprise plans support up to 200 interactive attendees.",
  },
  {
    question: "How does Meetstack protect privacy and call security?",
    answer:
      "All media streams are encrypted using industry-standard WebRTC DTLS and SRTP encryption protocols. We do not store unencrypted audio or video on our servers, and rooms are locked exclusively to people with your meeting URL.",
  },
  {
    question: "Can I use Meetstack on mobile phones and tablets?",
    answer:
      "Yes! Meetstack works directly in mobile browsers like Safari on iOS and Chrome on Android without needing an app store download. You can toggle cameras, switch audio devices, and view shared screens smoothly.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
          <HelpCircle className="size-3" />
          Got Questions?
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-sm text-muted-foreground text-balance">
          Everything you need to know about getting started, audio/video quality, and security.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="mt-10"
      >
        <Accordion defaultValue={[FAQS[0].question]}>
          {FAQS.map(({ question, answer }) => (
            <AccordionItem key={question} value={question} className="border-border/70">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Still have questions?</span>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline underline-offset-4"
        >
          <MessageSquare className="size-3.5" />
          Talk to our team
        </Link>
      </div>
    </section>
  );
}
