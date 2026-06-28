import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  mode: "sign-in" | "sign-up";
  children: React.ReactNode;
}

const shellCopy = {
  "sign-in": {
    eyebrow: "Return session",
    title: "Pick up right where you left off.",
    description:
      "Your dashboard, profile, and private routes stay behind the same quiet account gate.",
    rows: ["Session cookie", "Dashboard access", "Private route"],
  },
  "sign-up": {
    eyebrow: "New session",
    title: "Create the account shell first.",
    description:
      "Start with email and password, then tune profile, sessions, and verification from the dashboard.",
    rows: ["Account record", "Credential link", "Profile space"],
  },
};

export function AuthShell({ mode, children }: AuthShellProps) {
  const copy = shellCopy[mode];

  return (
    <div className="relative flex flex-1 overflow-hidden bg-[linear-gradient(135deg,color-mix(in_oklch,var(--background),var(--muted)_52%),var(--background)_58%)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.42] dark:opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-6xl flex-1 gap-10 px-6 py-10 md:grid-cols-[minmax(0,0.9fr)_minmax(380px,440px)] md:items-center md:px-8 lg:px-10">
        <section className="hidden min-h-[520px] flex-col justify-between rounded-xl border border-border bg-background/70 p-8 shadow-sm backdrop-blur md:flex">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-foreground text-background">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {copy.eyebrow}
                </p>
                <p className="font-mono text-sm text-foreground">better-next</p>
              </div>
            </div>

            <div className="max-w-md space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight">
                {copy.title}
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                {copy.description}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {copy.rows.map((row, index) => (
              <div
                key={row}
                className={cn(
                  "flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 shadow-xs",
                  index === 1 && "ml-8",
                  index === 2 && "ml-16",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-md bg-muted">
                    {index === 0 ? (
                      <KeyRound className="size-4" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    )}
                  </span>
                  <span className="text-sm font-medium">{row}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center md:min-h-[520px]">
          {children}
        </section>
      </div>
    </div>
  );
}
