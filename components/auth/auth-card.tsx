import { ArrowRight, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md overflow-hidden border-border/80 bg-card/95 shadow-xl shadow-foreground/5 backdrop-blur">
      <div className="h-1.5 bg-[linear-gradient(90deg,oklch(0.72_0.16_172),oklch(0.68_0.15_245),var(--foreground))]" />
      <CardHeader className="gap-5 p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {eyebrow}
          </div>
          <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-semibold leading-tight tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-base leading-7">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 sm:px-7 sm:pb-7">{children}</CardContent>
    </Card>
  );
}
