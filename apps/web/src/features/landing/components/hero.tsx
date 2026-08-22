"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Copy,
  Globe,
  Keyboard,
  Link as LinkIcon,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

const SLIDES = [
  {
    image: "/images/feature-guest-join.jpg",
    title: "Get a link you can share",
    description:
      "Click New meeting to get a link you can send to people you want to meet with — no downloads required.",
  },
  {
    image: "/images/hero-meeting-preview.jpg",
    title: "See everyone together in HD",
    description:
      "Adaptive HD video tiles, 60fps screen sharing, and speaking indicators tuned for real collaboration.",
  },
  {
    image: "/images/feature-screenshare.jpg",
    title: "Crystal-clear screen sharing",
    description:
      "Present documents, slide decks, and code with high-framerate clarity directly in your browser.",
  },
  {
    image: "/images/feature-encryption.jpg",
    title: "Your meeting is safe & private",
    description:
      "No one can join a meeting unless invited. All media streams are encrypted end-to-end.",
  },
];

export function Hero() {
  const router = useRouter();
  const [meetingCode, setMeetingCode] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    if (meetingCode.trim()) {
      let code = meetingCode.trim();
      if (code.includes("/")) {
        code = code.split("/").pop() || code;
      }
      router.push(`/meeting/${code}`);
    }
  };

  const startInstantMeeting = () => {
    const randomRoom = `meet-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
    router.push(`/meeting/${randomRoom}`);
  };

  const createMeetingForLater = () => {
    const randomRoom = `meet-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
    const fullUrl = `${window.location.origin}/meeting/${randomRoom}`;
    setGeneratedLink(fullUrl);
    setShowNewMenu(false);
  };

  const copyGeneratedLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-28">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Google Meet Style Action Hub */}
        <div className="space-y-8 lg:col-span-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-normal tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
              Video calls and meetings for{" "}
              <span className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">
                everyone
              </span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              Meetstack connects you with teammates, clients, and friends with ultra-low latency,
              crystal-clear screen sharing, and zero mandatory downloads or signups.
            </p>
          </div>

          {/* Action Row: + New meeting & Enter code or link */}
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* + New Meeting Dropdown Button (Google Meet Style) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNewMenu(!showNewMenu)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-6 text-sm font-semibold text-white shadow-md shadow-[#1a73e8]/25 transition-colors hover:bg-[#1557b0]"
              >
                <Plus className="size-5" />
                <span>New meeting</span>
              </button>

              {/* Google Meet Dropdown Menu */}
              {showNewMenu && (
                <div className="absolute left-0 top-14 z-30 w-72 rounded-2xl border border-border bg-card p-2 shadow-2xl backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={startInstantMeeting}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <Video className="size-4.5 text-[#1a73e8]" />
                    <div>
                      <p className="font-semibold">Start an instant meeting</p>
                      <p className="text-xs text-muted-foreground">Jump into a room now</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={createMeetingForLater}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <LinkIcon className="size-4.5 text-[#00ac47]" />
                    <div>
                      <p className="font-semibold">Create a meeting for later</p>
                      <p className="text-xs text-muted-foreground">Get a shareable link</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Enter a code or link (Google Meet style) */}
            <form onSubmit={handleJoin} className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Keyboard className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter a code or link"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  className="h-12 w-full rounded-lg border border-border bg-background pl-11 pr-4 text-sm outline-none transition-colors focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"
                />
              </div>

              <Button
                type="submit"
                disabled={!meetingCode.trim()}
                variant="ghost"
                className={`h-12 px-5 font-semibold transition-colors ${
                  meetingCode.trim()
                    ? "text-[#1a73e8] dark:text-[#8ab4f8] hover:bg-[#1a73e8]/10"
                    : "text-muted-foreground/40 cursor-not-allowed"
                }`}
              >
                Join
              </Button>
            </form>
          </div>

          {/* Modal for "Create a meeting for later" */}
          {generatedLink && (
            <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Here&apos;s your joining info</span>
                <button
                  type="button"
                  onClick={() => setGeneratedLink(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Dismiss
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Send this link to people you want to meet with.
              </p>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/60 px-3.5 py-2.5">
                <span className="truncate text-xs font-mono text-foreground mr-2">{generatedLink}</span>
                <button
                  type="button"
                  onClick={copyGeneratedLink}
                  className="flex items-center gap-1 text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8] shrink-0"
                >
                  <Copy className="size-3.5" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          <hr className="border-border/60" />

          {/* Bottom reassurance link */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/about"
              className="font-medium text-[#1a73e8] dark:text-[#8ab4f8] hover:underline underline-offset-4"
            >
              Learn more
            </Link>
            <span>about Meetstack secure meetings</span>
          </div>
        </div>

        {/* Right Column: Google Meet Style Carousel Card */}
        <div className="flex flex-col items-center justify-center lg:col-span-6">
          <div className="relative w-full max-w-lg">
            {/* Carousel Visual Frame */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={SLIDES[currentSlide].image}
                    alt={SLIDES[currentSlide].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Slide text overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                    <h3 className="text-xl font-bold tracking-tight">
                      {SLIDES[currentSlide].title}
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {SLIDES[currentSlide].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Floating Arrows */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Carousel Dots */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className={`size-2.5 rounded-full transition-all ${
                    currentSlide === i
                      ? "w-6 bg-[#1a73e8]"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
