import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Private",
};

export default async function PrivatePage() {
  const session = await requireSession();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Protected route
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Members only
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          This page checks your session on the server before rendering. If you
          are not signed in, you are redirected to sign in.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Signed in as
        </h2>
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          {session.user.name}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {session.user.email}
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          How this page is protected
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-white p-4 text-xs text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
{`import { requireSession } from "@/lib/auth-session";

export default async function PrivatePage() {
  const session = await requireSession();
  // ...
}`}
        </pre>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          <code className="rounded bg-zinc-200/60 px-1 py-0.5 text-xs dark:bg-zinc-800">
            proxy.ts
          </code>{" "}
          also redirects unauthenticated visitors away from{" "}
          <code className="rounded bg-zinc-200/60 px-1 py-0.5 text-xs dark:bg-zinc-800">
            /private
          </code>{" "}
          and{" "}
          <code className="rounded bg-zinc-200/60 px-1 py-0.5 text-xs dark:bg-zinc-800">
            /dashboard
          </code>
          .
        </p>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex h-10 w-fit items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
