import { describe, it, expect, beforeEach } from "vitest";
import { isEmailAllowed } from "../../src/auth/allowlist";
import { createTestDb, type TestDatabase } from "../helpers/test-db";
import { adminEmails } from "../../src/db/schema";

describe("isEmailAllowed", () => {
  let db: TestDatabase;

  beforeEach(() => {
    db = createTestDb();
    db.insert(adminEmails)
      .values({ email: "admin@example.com", createdAt: new Date() })
      .run();
  });

  it("returns true for an email present in admin_emails", async () => {
    expect(await isEmailAllowed(db, "admin@example.com")).toBe(true);
  });

  it("is case-insensitive", async () => {
    expect(await isEmailAllowed(db, "Admin@Example.COM")).toBe(true);
  });

  it("trims whitespace", async () => {
    expect(await isEmailAllowed(db, "  admin@example.com  ")).toBe(true);
  });

  it("returns false for unknown emails", async () => {
    expect(await isEmailAllowed(db, "intruder@example.com")).toBe(false);
  });

  it("returns false for empty or invalid input", async () => {
    expect(await isEmailAllowed(db, "")).toBe(false);
    expect(await isEmailAllowed(db, "   ")).toBe(false);
  });
});
