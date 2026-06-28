import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <AuthCard
        title="Create an account"
        description="Get started with email and password."
      >
        <SignUpForm />
      </AuthCard>
    </div>
  );
}
