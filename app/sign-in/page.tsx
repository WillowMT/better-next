import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <AuthCard
        title="Welcome back"
        description="Sign in to your account to continue."
      >
        <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />}>
          <SignInForm />
        </Suspense>
      </AuthCard>
    </div>
  );
}
