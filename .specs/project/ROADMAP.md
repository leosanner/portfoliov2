# Roadmap

**Current Milestone:** M2 — Core Features
**Status:** Planning

**Last completed:** M1 — Foundation

---

## M1 — Foundation

**Goal:** Working monorepo with infrastructure, auth, and CI/CD pipelines in place — deployable to Cloudflare with no features yet, just skeleton.
**Target:** Monorepo boots locally, deploys to preview and production, auth works end-to-end.

### Features

**Monorepo Setup** - DONE

- pnpm workspaces with `apps/web`, `apps/api`, `packages/shared`
- TypeScript configured across all packages
- Vitest configured in `apps/api` and `apps/web`
- Shared ESLint + Prettier config

**Cloudflare Infrastructure** - DONE

- `wrangler.toml` with dev, preview, and production D1 bindings
- `.dev.vars` + `.dev.vars.example` pattern established
- Three D1 databases created (dev local, preview, production)
- CORS configured via environment variables

**CI/CD Pipelines** - DONE

- `deploy-api.yml`: runs migrations + deploys Worker on push to main and PRs
- `deploy-web.yml`: deploys Pages on push to main and PRs
- GitHub Secrets required: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Preview deploys on every PR branch

**Authentication** - DONE

- Better Auth installed and configured in `apps/api`
- Google OAuth provider set up
- Auth routes exposed via Hono (`/api/auth/**`)
- Session validated in admin-only middleware (`adminOnly`)
- Frontend login page with Google sign-in button — PENDING (M1 frontend)

**Drizzle + D1 Baseline** - DONE

- Drizzle configured with D1 adapter
- First migration (user, session, account, verification tables)
- Migration scripts: `db:generate`, `db:migrate` (local), applied automatically in CI
- `migrations_dir` set to `drizzle/` in wrangler.toml for all environments

---

## M2 — Core Features

**Goal:** Admin can create and manage projects; visitors can browse and read them.
**Target:** Full CRUD for projects, public portfolio page, individual project pages live.

### Features

**Project Management (Admin)** - PLANNED

- Admin panel route (protected by auth middleware)
- Create project form: title, description, YouTube URL, GitHub URL, tech stack tags, markdown content
- Edit project
- Delete project (with confirmation)
- Project list in admin dashboard

**Public Portfolio** - PLANNED

- Public homepage listing all projects
- Individual project page: YouTube embed, markdown rendered, tech stack badges, GitHub link
- Basic responsive layout

**Hono RPC Integration** - PLANNED

- Typed route definitions in `packages/shared`
- Frontend consumes API via Hono RPC client (no manual fetch calls)
- End-to-end type safety validated

---

## M3 — Polish

**Goal:** Production-ready portfolio with good UX and performance.

### Features

**UI/UX Refinement** - PLANNED
**SEO & Meta Tags** - PLANNED
**Error Handling & Loading States** - PLANNED
**Performance Audit** - PLANNED

---

## Future Considerations

- Project categories or tags for filtering
- Dark/light theme toggle
- Project ordering / pinning
- Analytics (privacy-friendly)
