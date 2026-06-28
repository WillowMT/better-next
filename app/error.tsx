"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium text-muted-foreground">Something broke</p>
      <h1 className="text-3xl font-semibold tracking-tight">
        This page could not be loaded.
      </h1>
      <p className="max-w-lg text-muted-foreground">
        Try again. If the problem continues, check the server logs with the
        error digest.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-muted-foreground">
          Digest: {error.digest}
        </p>
      ) : null}
      <Button type="button" className="w-fit" onClick={() => unstable_retry()}>
        Try again
      </Button>
    </div>
  );
}
