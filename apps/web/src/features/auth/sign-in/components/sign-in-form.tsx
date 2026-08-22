"use client";

import { authClient } from "@repo/auth/auth-client";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { PasswordInput } from "@repo/ui/components/password-input";
import { Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type Props = {};

function SignInForm({}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message ?? "Unable to sign in");

      return;
    }

    router.push("/");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        Sign in
      </Button>
    </form>
  );
}

export default SignInForm;
