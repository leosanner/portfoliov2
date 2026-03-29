import { createMiddleware } from "hono/factory";
import type { Env } from "../env";
import { createAuth } from "./index";

export const adminOnly = createMiddleware<Env>(async (c, next) => {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
