import type { Metadata } from "next";

export const appMetadata: Metadata = {
  title: {
    default: "better-next",
    template: "%s | better-next",
  },
  description:
    "Next.js 16 starter with Better Auth, PostgreSQL, Drizzle ORM, and shadcn/ui.",
  applicationName: "better-next",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ??
      process.env.BETTER_AUTH_URL ??
      "http://localhost:3000",
  ),
  openGraph: {
    title: "better-next",
    description:
      "A production-minded Next.js 16 starter with Better Auth and shadcn/ui.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "better-next",
    description:
      "A production-minded Next.js 16 starter with Better Auth and shadcn/ui.",
  },
};
