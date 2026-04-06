import { Hono } from "hono";
import type { Env } from "../env";

export const adminMeRoutes = new Hono<Env>().get("/me", (c) => {
  const user = c.get("user");
  return c.json({ ok: true, email: user.email });
});
