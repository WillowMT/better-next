import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireSession } from "@/lib/auth-session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Private",
};

export default async function PrivatePage() {
  const session = await requireSession();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Protected route
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Members only</h1>
        <p className="text-muted-foreground">
          This page checks your session on the server before rendering. If you
          are not signed in, you are redirected to sign in.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Signed in as
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-lg font-medium">{session.user.name}</p>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </CardContent>
      </Card>

      <Card className="border-dashed bg-muted/40">
        <CardHeader>
          <CardTitle className="text-sm">How this page is protected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <pre className="overflow-x-auto rounded-lg bg-background p-4 text-xs">
{`import { requireSession } from "@/lib/auth-session";

export default async function PrivatePage() {
  const session = await requireSession();
  // ...
}`}
          </pre>
          <CardDescription>
            <code className="rounded bg-muted px-1 py-0.5 text-xs">proxy.ts</code>{" "}
            also redirects unauthenticated visitors away from{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">/private</code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">/dashboard</code>
            .
          </CardDescription>
        </CardContent>
      </Card>

      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
      >
        Back to dashboard
      </Link>
    </div>
  );
}
