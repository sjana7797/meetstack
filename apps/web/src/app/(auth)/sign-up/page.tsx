"use client";

import { AuthLayout } from "@/features/auth/components/auth-layout";
import { authClient } from "@repo/auth/auth-client";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { PasswordInput } from "@repo/ui/components/password-input";
import { Loader2, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message ?? "Unable to create account");

      return;
    }

    router.push("/");
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to get started"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-foreground font-medium underline underline-offset-4"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              required
              className="pl-9"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="pl-9"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <p className="text-muted-foreground text-xs">
            Must be at least 8 characters.
          </p>
        </div>
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
