import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormFieldProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  icon?: React.ReactNode;
}

export function AuthFormField({
  id,
  label,
  type = "text",
  autoComplete,
  registration,
  error,
  icon,
}: AuthFormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <Input
          id={id}
          type={type}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={icon ? "h-11 pl-9" : "h-11"}
          {...registration}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
