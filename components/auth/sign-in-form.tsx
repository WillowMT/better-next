"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { AuthFormField } from "./auth-form-field";
import { emailValidation, passwordValidation } from "./auth-form-validation";

interface SignInValues {
  email: string;
  password: string;
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeRedirectPath(searchParams.get("next"));
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignInValues> = async ({ email, password }) => {
    await signIn.email(
      {
        email,
        password,
        callbackURL: nextPath,
      },
      {
        onSuccess: () => {
          router.push(nextPath);
          router.refresh();
        },
        onError: (ctx) => {
          const message = ctx.error.message ?? "Unable to sign in";
          setError("root", { message });
          toast.error(message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-5">
      <AuthFormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        registration={register("email", emailValidation)}
        error={errors.email?.message}
        icon={<Mail className="size-4" aria-hidden="true" />}
      />
      <AuthFormField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        registration={register("password", passwordValidation)}
        error={errors.password?.message}
        icon={<LockKeyhole className="size-4" aria-hidden="true" />}
      />

      {errors.root?.message ? (
        <p className="text-sm text-destructive">{errors.root.message}</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <p className="border-t border-border pt-5 text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
