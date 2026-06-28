import Link from "next/link";
import { TechStack } from "@/components/tech-stack";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-12 px-6 py-16">
      <div className="space-y-4">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Better Auth + Next.js
        </p>
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {session
            ? `You're signed in as ${session.user.name}.`
            : "Email and password auth, ready to go."}
        </h1>
        <p className="max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {session
            ? "Head to your dashboard to view session details."
            : "Create an account or sign in to try the full auth flow."}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {session ? (
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Create account
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
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
