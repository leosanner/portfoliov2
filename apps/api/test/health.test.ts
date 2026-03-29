import { describe, it, expect } from "vitest";
import app from "../src/index";

describe("GET /health", () => {
  it("returns status ok", async () => {
    const res = await app.request("/health", {}, {
      ALLOWED_ORIGIN: "http://localhost:5173",
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
