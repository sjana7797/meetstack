"use client";

import { Button } from "@repo/ui/components/button";
import { HelpCircle, Menu, Settings, Video, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing & Plans" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Sales" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
      setTimeStr(`${time} • ${date}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Google Meet style Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-medium text-foreground">
            {/* Google Meet inspired multi-hue icon */}
            <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1a73e8] via-[#00ac47] to-[#f9ab00] p-0.5 shadow-sm">
              <div className="flex size-full items-center justify-center rounded-[10px] bg-[#202124] text-white">
                <Video className="size-4.5 text-[#8ab4f8]" />
              </div>
            </div>
            <span className="text-xl font-normal tracking-tight text-foreground">
              Meet<span className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">stack</span>
            </span>
          </Link>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : link.href.startsWith("/#")
                    ? pathname === "/"
                    : pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1a73e8]/10 text-[#1a73e8] dark:text-[#8ab4f8] font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Real-time Date/Time & Controls (Google Meet style) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {timeStr && (
            <span className="hidden text-sm font-medium text-muted-foreground lg:inline-block">
              {timeStr}
            </span>
          )}

          <Link
            href="/contact"
            title="Help & Support"
            className="hidden rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            <HelpCircle className="size-5" />
          </Link>

          <div className="flex items-center gap-2">
            <Button
              render={<Link href="/sign-in" />}
              variant="ghost"
              size="sm"
              className="text-[#1a73e8] dark:text-[#8ab4f8] font-medium hover:bg-[#1a73e8]/10"
            >
              Sign in
            </Button>
            <Button
              render={<Link href="/sign-up" />}
              size="sm"
              className="rounded-full bg-[#1a73e8] px-4 font-medium text-white hover:bg-[#1557b0] shadow-sm"
            >
              Join Meetstack
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/40 text-foreground md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
