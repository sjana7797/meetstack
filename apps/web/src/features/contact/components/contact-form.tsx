"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { ArrowRight, CheckCircle2, Send, Sparkles } from "lucide-react";
import { type FormEvent, useState } from "react";

const TOPICS = ["General Inquiry", "Enterprise Sales", "Technical Support", "Partnership"];

export function ContactForm() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  if (submitted) {
    return (
      <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-md">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-8" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Message Received!</h3>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            Thanks for reaching out regarding <span className="font-semibold text-foreground">{topic}</span>. Our team will review and reply to your email in under 15 minutes.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setSubmitted(false)}
          >
            Send another message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-md">
      <CardContent className="p-6 sm:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Topic selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              What can we help with?
            </Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TOPICS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTopic(item)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                    topic === item
                      ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
                      : "border-border/80 bg-muted/30 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold">
                Your Full Name
              </Label>
              <Input id="name" placeholder="Sarah Connor" required className="h-10 text-sm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold">
                Work Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="sarah@company.com"
                required
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-xs font-semibold">
              Company / Team Name (Optional)
            </Label>
            <Input id="company" placeholder="Acme Technologies" className="h-10 text-sm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-xs font-semibold">
              How can we assist you?
            </Label>
            <textarea
              id="message"
              rows={4}
              required
              placeholder="Tell us about your team size, requirements, or questions..."
              className="w-full rounded-lg border border-input bg-background/80 px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20"
          >
            {isSubmitting ? (
              <span>Sending...</span>
            ) : (
              <>
                Send Message
                <Send className="size-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            🔒 We respect your privacy. We never share or sell your contact information.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
