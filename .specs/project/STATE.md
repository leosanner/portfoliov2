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
- **Migrations:** Drizzle-kit generates migration files; CI applies them automatically before deploy
- **Testing:** TDD is mandatory — Vitest, tests written before implementation, no exceptions
- **Env vars:** `.dev.vars` for local (gitignored), `.dev.vars.example` committed as contract, Cloudflare secrets for remote

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
