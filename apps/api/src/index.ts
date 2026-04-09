// API entry point
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env";
import { createAuth } from "./auth";
import { createDb } from "./db";
import { adminOnly } from "./auth/middleware";
import { adminProjectRoutes } from "./routes/projects.admin";
import { adminMeRoutes } from "./routes/admin.me";
import { publicProjectRoutes } from "./routes/projects.public";

const app = new Hono<Env>()
  .use("*", async (c, next) => {
    const corsMiddleware = cors({
      origin: c.env.ALLOWED_ORIGIN,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    });
    return corsMiddleware(c, next);
  })
  .use("/api/admin/*", async (c, next) => {
    c.set("db", createDb(c.env.DB));
    return adminOnly(c, next);
  })
  .use("/api/projects/*", async (c, next) => {
    c.set("db", createDb(c.env.DB));
    await next();
  })
  .use("/api/projects", async (c, next) => {
    c.set("db", createDb(c.env.DB));
    await next();
  })
  .get("/health", (c) => c.json({ status: "ok" }))
  .route("/api/admin", adminProjectRoutes)
  .route("/api/admin", adminMeRoutes)
  .route("/api", publicProjectRoutes)
  .on(["POST", "GET"], "/api/auth/*", (c) => {
    const auth = createAuth(c.env);
    return auth.handler(c.req.raw);
  });

export type AppType = typeof app;
export default app;
