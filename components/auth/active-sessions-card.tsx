"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { callAuthApi } from "@/lib/auth-api-client";

export interface AccountSession {
  id?: string;
  token?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt?: string | Date;
  expiresAt?: string | Date;
}

function formatDate(value?: string | Date) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function isMobileSession(userAgent?: string | null) {
  return /android|iphone|ipad|mobile/i.test(userAgent ?? "");
}

interface ActiveSessionsCardProps {
  initialSessions: AccountSession[];
}

export function ActiveSessionsCard({ initialSessions }: ActiveSessionsCardProps) {
  const [sessions, setSessions] = useState<AccountSession[]>(initialSessions);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  async function loadSessions() {
    setIsLoading(true);

    try {
      const data = await callAuthApi<AccountSession[]>("list-sessions");
      setSessions(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load sessions.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function revokeOtherSessions() {
    setIsRevoking(true);

    try {
      await callAuthApi("revoke-other-sessions", { method: "POST" });
      await loadSessions();
      toast.success("Other sessions revoked.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to revoke sessions.",
      );
    } finally {
      setIsRevoking(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active sessions</CardTitle>
        <CardDescription>
          Review signed-in devices and revoke every session except this one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : sessions.length > 0 ? (
          <ul className="space-y-3">
            {sessions.map((session, index) => {
              const Icon = isMobileSession(session.userAgent)
                ? Smartphone
                : Monitor;

              return (
                <li
                  key={session.id ?? session.token ?? index}
                  className="flex gap-3 rounded-lg border border-border p-3"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-sm font-medium">
                      {session.userAgent ?? "Unknown device"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.ipAddress ?? "Unknown IP"} · Created{" "}
                      {formatDate(session.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No active sessions were returned.
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() => void revokeOtherSessions()}
          disabled={isRevoking || isLoading}
        >
          {isRevoking ? "Revoking..." : "Revoke other sessions"}
        </Button>
      </CardContent>
    </Card>
  );
}
