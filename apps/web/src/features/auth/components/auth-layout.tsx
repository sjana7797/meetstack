import { Video } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: Readonly<{
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 sm:p-10">
      <Link href="/" className="flex items-center gap-2 font-medium lg:hidden">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Video className="size-4" />
        </span>{" "}
        Meetstack
      </Link>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {children}

        <p className="text-muted-foreground text-center text-sm">{footer}</p>
      </div>
    </div>
  );
}
