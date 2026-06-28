import { AccountProfileForm } from "@/components/auth/account-profile-form";
import { ActiveSessionsCard } from "@/components/auth/active-sessions-card";
import type { AccountSession } from "@/components/auth/active-sessions-card";
import { EmailVerificationCard } from "@/components/auth/email-verification-card";
import { PasswordChangeForm } from "@/components/auth/password-change-form";
import { ProfileImageForm } from "@/components/auth/profile-image-form";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireSession } from "@/lib/auth-session";
import { isAuthEmailEnabled } from "@/lib/auth-email";
import { auth } from "@/lib/auth";
import { isBlobStorageEnabled } from "@/lib/blob";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import Link from "next/link";

async function getActiveSessions() {
  try {
    return (await auth.api.listSessions({
      headers: await headers(),
    })) as AccountSession[];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const session = await requireSession();
  const activeSessions = await getActiveSessions();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Account settings
        </h1>
      </div>

      <ProfileImageForm
        name={session.user.name}
        email={session.user.email}
        image={session.user.image}
        fileUploadEnabled={isBlobStorageEnabled()}
      />

      <AccountProfileForm name={session.user.name} />

      <EmailVerificationCard
        email={session.user.email}
        emailVerified={session.user.emailVerified}
        emailDeliveryEnabled={isAuthEmailEnabled()}
      />

      <PasswordChangeForm />

      <ActiveSessionsCard initialSessions={activeSessions} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Protected pages
          </CardTitle>
          <CardDescription>
            See how server-side route protection works.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/private"
            className={cn(buttonVariants(), "inline-flex")}
          >
            Open private page
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
