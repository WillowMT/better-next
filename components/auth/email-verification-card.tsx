"use client";

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
import { callAuthApi } from "@/lib/auth-api-client";

interface EmailVerificationCardProps {
  email: string;
  emailVerified: boolean;
  emailDeliveryEnabled: boolean;
}

export function EmailVerificationCard({
  email,
  emailVerified,
  emailDeliveryEnabled,
}: EmailVerificationCardProps) {
  const [isSending, setIsSending] = useState(false);

  async function handleSendVerification() {
    setIsSending(true);

    try {
      await callAuthApi("send-verification-email", {
        method: "POST",
        json: { email },
      });
      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send verification email.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email verification</CardTitle>
        <CardDescription>
          {emailVerified
            ? "Your email address is verified."
            : "Verification is optional for this starter."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">{email}</p>
          <p className="text-sm text-muted-foreground">
            {emailVerified
              ? "Verified"
              : emailDeliveryEnabled
                ? "Ready to send a verification link."
                : "Set AUTH_EMAIL_DELIVERY=console to enable local verification emails."}
          </p>
        </div>
        {!emailVerified && emailDeliveryEnabled ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleSendVerification}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send verification"}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
