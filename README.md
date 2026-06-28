# better-next

Next.js 16 starter with email/password auth, PostgreSQL, Drizzle ORM, and shadcn/ui.

## Stack

- **Next.js 16** (App Router, `proxy.ts` for route protection)
- **Better Auth** — sessions, sign up/in/out, profile updates
- **Drizzle ORM** + **PostgreSQL**
- **Tailwind CSS 4** + **shadcn/ui**
- **Optional file uploads** via Vercel Blob (URL fallback when not configured)
- **Playwright E2E** coverage for the auth happy path

## Quick start

### 1. Clone and install

```bash
bun install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Fill in `BETTER_AUTH_SECRET` (generate with `openssl rand -base64 32`).

### 3. Database

**Option A — Docker (recommended for local dev)**

```bash
docker compose up -d
```

Uses Postgres on `localhost:5432` with credentials matching `.env.example`.

**Option B — Hosted Postgres**

Set `DATABASE_URL` to your provider connection string. For hosted DBs, prefer an explicit SSL mode, e.g. `?sslmode=verify-full`.

### 4. Push schema and run

```bash
bun run db:push
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun test` | Run test suite |
| `bun run test:e2e` | Run Playwright browser tests |
| `bun run test:e2e:ui` | Open the Playwright UI |
| `bun run test:watch` | Tests in watch mode |
| `bun run lint` | ESLint |
| `bun run typecheck` | TypeScript check |
| `bun run check` | Lint + typecheck + tests |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Run migrations |
| `bun run db:push` | Push schema to database (dev) |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BETTER_AUTH_SECRET` | Yes | Auth signing secret |
| `BETTER_AUTH_URL` | Yes | Server app URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Yes* | Client app URL (usually same as above) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BLOB_READ_WRITE_TOKEN` | No | Enables profile photo file uploads |
| `PROFILE_IMAGE_ALLOWED_HOSTS` | No | Comma-separated allowlist for pasted profile image URL hosts |
| `AUTH_EMAIL_DELIVERY` | No | Set to `console` to log verification/reset links locally |

\* Falls back to `BETTER_AUTH_URL`, then `http://localhost:3000`.

## Project structure

```
app/
  api/auth/[...all]/   Better Auth API handler
  api/profile/image/   Profile image upload/URL/DELETE
  dashboard/           Account settings (protected)
  private/             Protected page example
  sign-in/ sign-up/    Auth pages
components/
  auth/                Auth UI
  ui/                  shadcn primitives
lib/
  auth.ts              Better Auth server config
  auth-client.ts       Client auth hooks
  auth-session.ts      requireSession() for RSC
proxy.ts               Redirects unauthenticated users
db/schema.ts           Drizzle schema (camelCase columns)
```

## Auth & route protection

Two layers:

1. **`proxy.ts`** — redirects unauthenticated requests away from `/dashboard` and `/private` to `/sign-in?next=…`
2. **`requireSession()`** — server-side check in pages; redirects if no session

Sign-in redirect targets are sanitized via `getSafeRedirectPath()` to block open redirects.

Protected subroutes under `/dashboard/*` and `/private/*` are covered by the static proxy matcher.

## Database notes

Auth tables use **camelCase** column names (`emailVerified`, `createdAt`, etc.) to match Better Auth + Drizzle conventions. If you migrate from a snake_case schema, align `db/schema.ts` with your existing columns.

- **New project:** `bun run db:push` or `db:migrate`
- **Schema changes:** `bun run db:generate` then `bun run db:migrate`

## Deploying

1. Set all required env vars on your host (Vercel, etc.)
2. `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must match your production domain
3. Run migrations against production: `bun run db:migrate`
4. Optional: add `BLOB_READ_WRITE_TOKEN` for file uploads
5. Optional: set `PROFILE_IMAGE_ALLOWED_HOSTS` to the CDN/image hosts you trust

For hosted Postgres URLs using `sslmode=require`, the app normalizes the URL to `sslmode=verify-full` to preserve the current `pg` security behavior explicitly.

`AUTH_EMAIL_DELIVERY=console` is intended for local development only. For production email verification and password reset flows, replace the console sender in `lib/auth-email.ts` with a real mail provider.

Health check: `GET /api/auth/ok` → `{"ok":true}`

## Testing

```bash
bun test
```

Integration tests use `.env.local` and a real Postgres database. Use Docker Compose locally or point `DATABASE_URL` at a test database.

Browser tests:

```bash
bunx playwright install chromium
bun run test:e2e
```

Run `bun run db:push` before the first local E2E run. CI does this automatically before launching Playwright.

## License

MIT
