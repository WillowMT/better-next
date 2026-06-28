import { ProfileImageForm } from "@/components/auth/profile-image-form";
import { requireSession } from "@/lib/auth-session";
import { isBlobStorageEnabled } from "@/lib/blob";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Account settings
        </h1>
      </div>

      <ProfileImageForm
        name={session.user.name}
        email={session.user.email}
        image={session.user.image}
        fileUploadEnabled={isBlobStorageEnabled()}
      />

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Protected pages
        </h2>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          See how server-side route protection works.
        </p>
        <Link
          href="/private"
          className="inline-flex h-10 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Open private page
        </Link>
      </div>
    </div>
  );
}
