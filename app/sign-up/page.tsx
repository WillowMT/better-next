import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <AuthShell mode="sign-up">
      <AuthCard
        eyebrow="Create access"
        title="Create an account"
        description="Set up your credentials and continue to your dashboard."
      >
        <SignUpForm />
      </AuthCard>
    </AuthShell>
  );
}
