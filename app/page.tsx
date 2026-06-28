import Link from "next/link";
import { TechStack } from "@/components/tech-stack";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-12 px-6 py-16">
      <div className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">
          Better Auth + Next.js
        </p>
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight">
          {session
            ? `You're signed in as ${session.user.name}.`
            : "Email and password auth, ready to go."}
        </h1>
        <p className="max-w-lg text-lg leading-8 text-muted-foreground">
          {session
            ? "Head to your dashboard to view session details."
            : "Create an account or sign in to try the full auth flow."}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {session ? (
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6")}
          >
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/sign-up"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6")}
            >
              Create account
            </Link>
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-6",
              )}
            >
              Sign in
            </Link>
          </>
        )}
      </div>

      <TechStack />
    </div>
  );
}
