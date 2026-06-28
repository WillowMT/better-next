import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <AuthShell mode="sign-in">
      <AuthCard
        eyebrow="Secure sign in"
        title="Welcome back"
        description="Enter your credentials to open your workspace."
      >
        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
          <SignInForm />
        </Suspense>
      </AuthCard>
    </AuthShell>
  );
}
