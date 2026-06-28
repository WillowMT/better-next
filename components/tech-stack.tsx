import type { IconType } from "react-icons";
import {
  SiBetterauth,
  SiDrizzle,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StackItem {
  name: string;
  Icon: IconType;
  iconClassName: string;
}

const stack: StackItem[] = [
  { name: "Next.js", Icon: SiNextdotjs, iconClassName: "text-foreground" },
  { name: "React", Icon: SiReact, iconClassName: "text-[#61DAFB]" },
  { name: "TypeScript", Icon: SiTypescript, iconClassName: "text-[#3178C6]" },
  { name: "Better Auth", Icon: SiBetterauth, iconClassName: "text-foreground" },
  { name: "Drizzle ORM", Icon: SiDrizzle, iconClassName: "text-[#C5F74F]" },
  {
    name: "PostgreSQL",
    Icon: SiPostgresql,
    iconClassName: "text-[#4169E1]",
  },
  {
    name: "Tailwind CSS",
    Icon: SiTailwindcss,
    iconClassName: "text-[#06B6D4]",
  },
];

export function TechStack() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-muted-foreground">Tech stack</h2>
        <p className="text-sm text-muted-foreground">
          Built with modern tools for auth, data, and UI.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {stack.map(({ name, Icon, iconClassName }) => (
          <li key={name}>
            <Card className="transition hover:bg-muted/50">
              <CardContent className="flex items-center gap-3 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon
                    className={cn("size-5", iconClassName)}
                    aria-hidden="true"
                  />
                </span>
                <span className="text-sm font-medium">{name}</span>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
