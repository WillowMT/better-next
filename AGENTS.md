<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- All UI components must use shadcn/ui (`components/ui/*`); add missing primitives via `bunx shadcn@latest add`
- Do not expose Vercel Blob branding in profile or upload UI; use neutral "file upload" wording instead
- Prefer bun for package management and running tests (`bun add`, `bun test`)

## Learned Workspace Facts

- Next.js 16.2.9 app with Better Auth, Drizzle ORM, and PostgreSQL
- Auth tables use camelCase DB column names from a prior Prisma setup; Drizzle schema must match those names exactly
- Route protection uses `proxy.ts` with a static `config.matcher` array (dynamic matchers fail the build)
- Protected routes: `/dashboard` and `/private`
- Profile images: optional file upload when `BLOB_READ_WRITE_TOKEN` is set; URL paste fallback when not
- Dark mode is class-based (`.dark` on `<html>`) with navbar toggle and `localStorage` persistence
- Auth API at `app/api/auth/[...all]/route.ts`; server session via `lib/auth.ts`, client via `lib/auth-client.ts`
- Drizzle scripts: `db:generate`, `db:migrate`, `db:push`
- shadcn/ui initialized with Tailwind v4; UI primitives live in `components/ui/`
