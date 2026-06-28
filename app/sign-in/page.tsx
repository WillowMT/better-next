import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Skeleton } from "@/components/ui/skeleton";

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
        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
          <SignInForm />
        </Suspense>
      </AuthCard>
    </div>
  );
}
