import { describe, it, expect, vi, beforeEach } from "vitest";

const env = {
  ALLOWED_ORIGIN: "http://localhost:5173",
  BETTER_AUTH_URL: "http://localhost:8787",
  GOOGLE_CLIENT_ID: "test-client-id",
  GOOGLE_CLIENT_SECRET: "test-client-secret",
  BETTER_AUTH_SECRET: "test-secret-at-least-32-chars-long!!",
};

describe("GET /api/admin/me", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns 401 when no session is present", async () => {
    vi.doMock("../../src/auth/index", () => ({
      createAuth: () => ({
        api: { getSession: async () => null },
      }),
    }));

    const { default: app } = await import("../../src/index");
    const res = await app.request("/api/admin/me", {}, env);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });

    vi.doUnmock("../../src/auth/index");
  });

  it("returns 403 when session email is not in the allowlist", async () => {
    vi.doMock("../../src/auth/index", () => ({
      createAuth: () => ({
        api: {
          getSession: async () => ({
            user: { id: "u1", email: "intruder@example.com" },
            session: { id: "s1" },
          }),
        },
      }),
    }));
    vi.doMock("../../src/auth/allowlist", () => ({
      isEmailAllowed: async () => false,
    }));

    const { default: app } = await import("../../src/index");
    const res = await app.request("/api/admin/me", {}, env);
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Forbidden" });

    vi.doUnmock("../../src/auth/index");
    vi.doUnmock("../../src/auth/allowlist");
  });

  it("returns 200 with email when session is allowlisted", async () => {
    vi.doMock("../../src/auth/index", () => ({
      createAuth: () => ({
        api: {
          getSession: async () => ({
            user: { id: "u1", email: "admin@example.com" },
            session: { id: "s1" },
          }),
        },
      }),
    }));
    vi.doMock("../../src/auth/allowlist", () => ({
      isEmailAllowed: async () => true,
    }));

    const { default: app } = await import("../../src/index");
    const res = await app.request("/api/admin/me", {}, env);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, email: "admin@example.com" });

    vi.doUnmock("../../src/auth/index");
    vi.doUnmock("../../src/auth/allowlist");
  });
});
