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
import { isBlobStorageEnabled } from "@/lib/blob";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireSession();

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
