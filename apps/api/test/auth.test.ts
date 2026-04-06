import { describe, it, expect, vi } from "vitest";
import app from "../src/index";

const env = {
  ALLOWED_ORIGIN: "http://localhost:5173",
  BETTER_AUTH_URL: "http://localhost:8787",
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

  it("returns 403 when session email is not in the allowlist", async () => {
    vi.resetModules();
    vi.doMock("../src/auth/index", () => ({
      createAuth: () => ({
        api: {
          getSession: async () => ({
            user: { id: "u1", email: "intruder@example.com" },
            session: { id: "s1" },
          }),
        },
      }),
    }));
    vi.doMock("../src/auth/allowlist", () => ({
      isEmailAllowed: async () => false,
    }));

    const { adminOnly } = await import("../src/auth/middleware");
    const { Hono } = await import("hono");
    const testApp = new Hono<{ Bindings: typeof env }>();
    testApp.use("/admin/*", adminOnly);
    testApp.get("/admin/test", (c) => c.json({ ok: true }));

    const res = await testApp.request("/admin/test", {}, env);
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Forbidden" });

    vi.doUnmock("../src/auth/index");
    vi.doUnmock("../src/auth/allowlist");
  });

  it("calls next when session email is in the allowlist", async () => {
    vi.resetModules();
    vi.doMock("../src/auth/index", () => ({
      createAuth: () => ({
        api: {
          getSession: async () => ({
            user: { id: "u1", email: "admin@example.com" },
            session: { id: "s1" },
          }),
        },
      }),
    }));
    vi.doMock("../src/auth/allowlist", () => ({
      isEmailAllowed: async () => true,
    }));

    const { adminOnly } = await import("../src/auth/middleware");
    const { Hono } = await import("hono");
    const testApp = new Hono<{ Bindings: typeof env }>();
    testApp.use("/admin/*", adminOnly);
    testApp.get("/admin/test", (c) => c.json({ ok: true }));

    const res = await testApp.request("/admin/test", {}, env);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    vi.doUnmock("../src/auth/index");
    vi.doUnmock("../src/auth/allowlist");
  });
});
