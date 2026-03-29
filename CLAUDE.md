# Portfolio v2 — Claude Instructions

Personal portfolio web application built on Cloudflare. Single admin, public read-only.

> For full agent guidance, conventions, and workflow rules → see [AGENTS.md](./AGENTS.md)

## Quick Reference

**Stack:** TypeScript · Hono (Workers) · React + Vite (Pages) · D1 + Drizzle · Better Auth (Google OAuth) · Hono RPC · pnpm workspaces

**Monorepo layout:**
```
apps/web/      → React + Vite → Cloudflare Pages
apps/api/      → Hono         → Cloudflare Workers
packages/shared/ → Hono RPC types, Zod schemas
```

**Specs & decisions:** `.specs/project/` — PROJECT.md · ROADMAP.md · STATE.md

## Non-Negotiable Rules

1. **TDD always** — write the failing test before any implementation
2. **English in all files** — code, comments, docs, specs (dialogue with user is in PT-BR)
3. **No `rm`/`rmdir`** — destructive filesystem operations require explicit user confirmation
4. **Env vars via `.dev.vars`** — never hardcode secrets; always update `.dev.vars.example` when adding a new var
5. **Granular increments** — implement one thing at a time, verify it works before moving on
