import { Video } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const HIGHLIGHTS = [
  "HD video and audio for every call",
  "Guest access, no account required",
  "Screen sharing built in",
];

type Props = { children: ReactNode };

function AuthLayout({ children }: Readonly<Props>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklch,var(--primary-foreground)_18%,transparent)_1px,transparent_0)] bg-size-[28px_28px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-primary-foreground/10 blur-3xl"
        />

        <Link
          href="/"
          className="relative z-10 flex items-center gap-2 font-medium text-lg"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary-foreground/10">
            <Video className="size-4" />
          </span>
          Meetstack
        </Link>

        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-3">
            <p className="text-2xl leading-snug font-medium text-balance">
              Meetings, minus the friction.
            </p>
            <p className="text-primary-foreground/70 text-sm text-balance">
              Spin up a room in seconds and jump straight into the conversation.
            </p>
          </blockquote>
          <ul className="space-y-2.5">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-primary-foreground/80"
              >
                <span className="size-1 shrink-0 rounded-full bg-primary-foreground/60" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-primary-foreground/50 text-xs">
          © {new Date().getFullYear()} Meetstack. All rights reserved.
        </p>
      </div>

      {children}
    </div>
  );
}

export default AuthLayout;
