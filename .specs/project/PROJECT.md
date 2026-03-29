# Portfolio v2

**Vision:** A personal portfolio web application to showcase projects with rich content — videos, markdown, tech stack details, and GitHub links — managed through a private admin panel.
**For:** Visitors (public read-only) and the owner (admin management).
**Solves:** Having a centralized, self-managed space to present personal projects professionally without depending on third-party portfolio platforms.

## Goals

- Ship a publicly accessible portfolio where each project has its own rich page (video, markdown, technologies, GitHub link)
- Provide a secure admin panel for the owner to create, edit, and manage projects independently

## Tech Stack

**Core:**

- Language: TypeScript
- Backend: Hono (Cloudflare Workers)
- Frontend: React + Vite (Cloudflare Pages)
- Database: Cloudflare D1 (SQLite) via Drizzle ORM
- Auth: Better Auth (Google OAuth only)

**Key dependencies:**

- `hono` — backend framework + RPC for type-safe client
- `drizzle-orm` + `drizzle-kit` — ORM and migrations
- `better-auth` — authentication with Google social provider
- `react` + `vite` — frontend SPA
- `vitest` — testing framework (TDD-first)

**Infrastructure:**

- Monorepo: pnpm workspaces
- Structure: `apps/web` (Pages), `apps/api` (Workers), `packages/shared` (Hono RPC types, Zod schemas)
- CI/CD: GitHub Actions (two independent workflows: deploy-web, deploy-api)
- Environments: dev (local D1), preview (branch D1 + auto migrations), production (D1 + auto migrations)

## Scope

**v1 includes:**

- Public project listing page
- Individual project pages (YouTube embed, markdown content, technologies, GitHub link)
- Admin panel: create, edit, delete projects
- Google OAuth authentication for admin access
- Automated migrations on preview and production deployments
- TDD: Vitest tests written before implementation

**Explicitly out of scope:**

- Multi-user support or roles beyond single admin
- Email/password authentication
- Self-hosted video storage (using YouTube embeds)
- Comments, likes, or any social interaction features
- Blog or content types other than projects

## Constraints

- **Technical:** Must run entirely on Cloudflare (Workers, Pages, D1) — no other cloud providers
- **Auth:** Single admin user only, authenticated via Google OAuth
- **Testing:** TDD is non-negotiable — tests precede every implementation
- **Env vars:** Stable across environments via `.dev.vars` + `.dev.vars.example` pattern; no hardcoded secrets
- **Development style:** Granular increments — each change is verified before moving forward
