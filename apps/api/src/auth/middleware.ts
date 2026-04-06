import { createMiddleware } from "hono/factory";
import type { Env } from "../env";
import { createAuth } from "./index";
import { isEmailAllowed } from "./allowlist";
import { createDb } from "../db";

export const adminOnly = createMiddleware<Env>(async (c, next) => {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const db = c.get("db") ?? createDb(c.env.DB);
  const allowed = await isEmailAllowed(db, session.user.email);
  if (!allowed) {
    return c.json({ error: "Forbidden" }, 403);
  }

  c.set("db", db);
  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
