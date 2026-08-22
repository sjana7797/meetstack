import Link from "next/link";
import SignInForm from "@/features/auth/sign-in/components/sign-in-form";
import { AuthLayout } from "@/features/auth/components/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account to continue"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-foreground font-medium underline underline-offset-4"
          >
            Sign up
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}
