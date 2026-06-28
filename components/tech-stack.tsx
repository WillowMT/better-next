interface TechLogoProps {
  className?: string;
}

function NextJsLogo({ className = "size-7" }: TechLogoProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128 32L32 64v128l96 32 96-32V64L128 32Zm0 18.2 73.4 24.5L128 99.2 54.6 74.7 128 50.2Zm-80 36.8 80 26.7v89.3l-80-26.7V87Zm96 116V113.9l80-26.7v89.3l-80 26.7Z" />
    </svg>
  );
}

function ReactLogo({ className = "size-7" }: TechLogoProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <circle cx="128" cy="128" r="16" fill="currentColor" />
      <ellipse cx="128" cy="128" rx="88" ry="36" stroke="currentColor" strokeWidth="14" />
      <ellipse
        cx="128"
        cy="128"
        rx="88"
        ry="36"
        stroke="currentColor"
        strokeWidth="14"
        transform="rotate(60 128 128)"
      />
      <ellipse
        cx="128"
        cy="128"
        rx="88"
        ry="36"
        stroke="currentColor"
        strokeWidth="14"
        transform="rotate(120 128 128)"
      />
    </svg>
  );
}

function TypeScriptLogo({ className = "size-7" }: TechLogoProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M32 32h192v192H32V32Zm118.4 118.4V176c8.8 4.8 18.4 7.2 28.8 7.2 23.2 0 37.6-11.2 37.6-29.6 0-14.4-6.4-23.2-28-31.2l-9.6-3.6c-12.8-4.8-18.4-8.8-18.4-16.8 0-8 7.2-13.6 18.4-13.6 10.4 0 18.4 4 23.2 11.2l16-12.8c-8.8-12-24.8-18.4-44.8-18.4-26.4 0-44 14.4-44 35.2 0 17.6 9.6 28 30.4 35.2l9.6 3.6c14.4 5.6 20 10.4 20 19.2 0 10.4-10.4 14.4-24.8 14.4-14.4 0-26.4-6.4-33.6-16.8l-16.8 12.8Z" />
    </svg>
  );
}

function BetterAuthLogo({ className = "size-7" }: TechLogoProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path
        d="M128 40 56 80v96l72 40 72-40V80l-72-40Z"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinejoin="round"
      />
      <path
        d="M96 128.5 118 148l42-46"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DrizzleLogo({ className = "size-7" }: TechLogoProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M48 56h160l-20 40H68L48 56Zm0 72h160l-20 40H68l-20-40Zm0 72h160l-20 40H68l-20-40Z" opacity="0.28" />
      <path d="M68 96h120l-20 40H48l20-40Zm0 72h120l-20 40H48l20-40Z" />
    </svg>
  );
}

function PostgresLogo({ className = "size-7" }: TechLogoProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128 24c-38.4 0-69.6 28.8-72.8 65.6-5.6 1.6-10.4 4.8-14.4 9.6-10.4 9.6-12.8 28-8.8 50.4 4 20 13.6 36 26.4 42.4 2.4 30.4 22.4 54.4 49.6 54.4 4 0 8-0.8 11.2-2.4 6.4 16 22.4 27.2 40.8 27.2s34.4-11.2 40.8-27.2c3.2 1.6 7.2 2.4 11.2 2.4 27.2 0 47.2-24 49.6-54.4 12.8-6.4 22.4-22.4 26.4-42.4 4-22.4 1.6-40.8-8.8-50.4-4-4.8-8.8-8-14.4-9.6C197.6 52.8 166.4 24 128 24Zm-28 72c4.8 0 8.8 4 8.8 8.8v19.2h40v-19.2c0-4.8 4-8.8 8.8-8.8s8.8 4 8.8 8.8v28c0 4.8-4 8.8-8.8 8.8h-49.6c-4.8 0-8.8-4-8.8-8.8v-28c0-4.8 4-8.8 8.8-8.8Z" />
    </svg>
  );
}

function TailwindLogo({ className = "size-7" }: TechLogoProps) {
  return (
    <svg className={className} viewBox="0 0 256 154" fill="currentColor" aria-hidden="true">
      <path d="M128 0C93.6 0 72.8 17.2 65.6 51.6 49.6 34.4 32.8 28.4 21.6 30.8 8 34 0 45.2 0 64.4c0 19.2 6.4 42.4 19.2 69.6C44.8 172.4 72 192 104 192c32 0 56-12.4 72-44.8 16 32.4 40 44.8 72 44.8 32 0 59.2-19.6 84.8-57.6 12.8-27.2 19.2-50.4 19.2-69.6 0-19.2-8-30.4-21.6-33.6-11.2-2.4-28 3.6-50.4 20.8C183.2 17.2 162.4 0 128 0Zm0 51.6c22.4 0 34.4 11.2 36 33.6 16-12.8 28-17.6 36-15.2 11.2 2.4 16.8 9.6 16.8 21.6 0 12-4 26.4-12 43.2-12.8 22.4-28.8 34.4-48 34.4-19.2 0-35.2-12-48-34.4-8-16.8-12-31.2-12-43.2 0-12 5.6-19.2 16.8-21.6 8-2.4 20 2.4 36 15.2 1.6-22.4 13.6-33.6 36-33.6Z" />
    </svg>
  );
}

const stack = [
  { name: "Next.js", Logo: NextJsLogo },
  { name: "React", Logo: ReactLogo },
  { name: "TypeScript", Logo: TypeScriptLogo },
  { name: "Better Auth", Logo: BetterAuthLogo },
  { name: "Drizzle ORM", Logo: DrizzleLogo },
  { name: "PostgreSQL", Logo: PostgresLogo },
  { name: "Tailwind CSS", Logo: TailwindLogo },
] as const;

export function TechStack() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Tech stack
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Built with modern tools for auth, data, and UI.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {stack.map(({ name, Logo }) => (
          <li
            key={name}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
              <Logo className="size-5" />
            </span>
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
