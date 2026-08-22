"use client";

import { Input } from "@repo/ui/components/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { ComponentProps } from "react";
import { Button } from "./button";

export function PasswordInput(props: ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className="pr-10"
      />
      <Button
        variant="ghost"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-0"
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </div>
  );
}
