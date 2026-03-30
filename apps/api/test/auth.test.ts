import { describe, it, expect } from "vitest";
import app from "../src/index";

const env = {
  ALLOWED_ORIGIN: "http://localhost:5173",
  GOOGLE_CLIENT_ID: "test-client-id",
  GOOGLE_CLIENT_SECRET: "test-client-secret",
  BETTER_AUTH_SECRET: "test-secret-at-least-32-chars-long!!",
};

describe("Auth routes", () => {
  it("GET /api/auth/ok returns Better Auth status", async () => {
    const res = await app.request("/api/auth/ok", {}, env);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("ok");
  });
});

describe("Admin middleware", () => {
  it("returns 401 when no session cookie is present", async () => {
    const { adminOnly } = await import("../src/auth/middleware");
    const { Hono } = await import("hono");
    const testApp = new Hono<{ Bindings: typeof env }>();
    testApp.use("/admin/*", adminOnly);
    testApp.get("/admin/test", (c) => c.json({ ok: true }));

    const res = await testApp.request("/admin/test", {}, env);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });
});
