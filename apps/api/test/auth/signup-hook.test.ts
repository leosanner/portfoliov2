import { describe, it, expect, beforeEach } from "vitest";
import { APIError } from "better-auth/api";
import { signupAllowlistBefore } from "../../src/auth/signup-hook";
import { createTestDb, type TestDatabase } from "../helpers/test-db";
import { adminEmails } from "../../src/db/schema";

describe("signupAllowlistBefore", () => {
  let db: TestDatabase;

  beforeEach(() => {
    db = createTestDb();
    db.insert(adminEmails)
      .values({ email: "admin@example.com", createdAt: new Date() })
      .run();
  });

  it("returns the user data when email is in the allowlist", async () => {
    const result = await signupAllowlistBefore(db, {
      email: "admin@example.com",
      name: "Admin",
    });
    expect(result).toEqual({
      data: { email: "admin@example.com", name: "Admin" },
    });
  });

  it("throws APIError when email is not in the allowlist", async () => {
    await expect(
      signupAllowlistBefore(db, { email: "intruder@example.com", name: "X" }),
    ).rejects.toBeInstanceOf(APIError);
  });

  it("is case-insensitive", async () => {
    const result = await signupAllowlistBefore(db, {
      email: "Admin@Example.COM",
      name: "Admin",
    });
    expect(result.data.email).toBe("Admin@Example.COM");
  });
});
