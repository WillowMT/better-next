"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";

export function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24 rounded-full" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full")}
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <UserAvatar
          name={session.user.name}
          image={session.user.image}
          size="sm"
        />
        <span className="hidden sm:inline">{session.user.name}</span>
      </Link>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={async () => {
          await signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/");
                router.refresh();
              },
            },
          });
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
