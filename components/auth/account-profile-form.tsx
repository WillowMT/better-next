"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { callAuthApi } from "@/lib/auth-api-client";
import { useSession } from "@/lib/auth-client";

interface AccountProfileFormProps {
  name: string;
}

export function AccountProfileForm({ name }: AccountProfileFormProps) {
  const router = useRouter();
  const { refetch } = useSession();
  const [displayName, setDisplayName] = useState(name);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = displayName.trim();

    if (!nextName) {
      toast.error("Name is required.");
      return;
    }

    setIsSaving(true);

    try {
      await callAuthApi("update-user", {
        method: "POST",
        json: { name: nextName },
      });
      await refetch({ query: { disableCookieCache: true } });
      router.refresh();
      toast.success("Name updated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update name.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update the display name stored with your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              autoComplete="name"
              className="h-11"
            />
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save name"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
