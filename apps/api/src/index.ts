import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env";

const app = new Hono<Env>();

app.use("*", async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.ALLOWED_ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
  return corsMiddleware(c, next);
});

app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
