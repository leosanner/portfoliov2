# Project State

## Decisions

- **Monorepo:** pnpm workspaces with `apps/web`, `apps/api`, `packages/shared`
- **Deployment:** Two Cloudflare deployments — Pages (frontend) + Workers (backend); separate but same repo
- **Video hosting:** YouTube embeds only — no self-hosted storage for v1
- **Auth:** Better Auth with Google OAuth only — no email/password
- **ORM:** Drizzle (chosen over Prisma — Prisma's binary query engine is incompatible with Cloudflare Workers runtime)
- **API style:** Hono RPC for end-to-end type safety between backend and frontend
- **CORS:** Configured via `ALLOWED_ORIGIN` env var injected per environment — no hardcoded origins
- **Database strategy:** Three D1 databases — dev (local Wrangler simulation), preview (per-branch), production
- **Migrations:** Drizzle-kit generates migration files; CI applies them automatically before deploy. `migrations_dir` = `drizzle/` in wrangler.toml
- **Testing:** TDD is mandatory — Vitest, tests written before implementation, no exceptions
- **Env vars:** `.dev.vars` for local (gitignored), `.dev.vars.example` committed as contract, Cloudflare secrets for remote
- **Drizzle schema location:** `apps/api/src/db/schema.ts`
- **Auth routes:** Mounted at `/api/auth/*` with `basePath: "/api/auth"` — Better Auth handles all sub-routes. `baseURL` set via `BETTER_AUTH_URL` env var, `trustedOrigins` set via `ALLOWED_ORIGIN`. OAuth callback uses `window.location.origin` for correct frontend redirect. Requires `nodejs_compat` compatibility flag in wrangler.toml for AsyncLocalStorage support.
- **Admin middleware:** `adminOnly` middleware in `apps/api/src/auth/middleware.ts` — validates session via Better Auth, sets `user` and `session` on Hono context
- **Frontend route protection:** `/admin` route wrapped with `ProtectedRoute` component — redirects unauthenticated users to `/login`. Session checks use `session?.user` to avoid false positives from empty response objects.
- **CI/CD secrets required:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` in GitHub Secrets
- **pnpm version:** 9.15.4 via corepack

## Preferences

- Development is granular — one increment at a time, verify before moving forward
- Dialogue in Portuguese; all project files in English

## Blockers

_None_

## Deferred Ideas

- Self-hosted video (Cloudflare R2 + Stream) — deferred to post-v1
- Multi-user / roles — explicitly out of scope
- Project categories/filtering — future consideration
- Analytics — future consideration
