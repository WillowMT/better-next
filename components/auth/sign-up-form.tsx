"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth-client";
import { AuthFormField } from "./auth-form-field";
import {
  emailValidation,
  nameValidation,
  passwordValidation,
} from "./auth-form-validation";

interface SignUpValues {
  name: string;
  email: string;
  password: string;
}

export function SignUpForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpValues> = async ({
    name,
    email,
    password,
  }) => {
    await signUp.email(
      {
        name,
        email,
        password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
          router.refresh();
        },
        onError: (ctx) => {
          const message = ctx.error.message ?? "Unable to create account";
          setError("root", { message });
          toast.error(message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-5">
      <AuthFormField
        id="name"
        label="Name"
        autoComplete="name"
        registration={register("name", nameValidation)}
        error={errors.name?.message}
        icon={<UserRound className="size-4" aria-hidden="true" />}
      />
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
        autoComplete="new-password"
        registration={register("password", passwordValidation)}
        error={errors.password?.message}
        icon={<LockKeyhole className="size-4" aria-hidden="true" />}
      />

      {errors.root?.message ? (
        <p className="text-sm text-destructive">{errors.root.message}</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>

      <p className="border-t border-border pt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
