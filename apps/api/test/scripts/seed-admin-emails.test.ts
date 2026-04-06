import { describe, it, expect, beforeEach } from "vitest";
import { createTestDb, type TestDatabase } from "../helpers/test-db";
import { seedAdminEmails } from "../../scripts/seed-admin-emails";
import { adminEmails } from "../../src/db/schema";

describe("seedAdminEmails", () => {
  let db: TestDatabase;

  beforeEach(() => {
    db = createTestDb();
  });

  async function listEmails() {
    const rows = await db
      .select({ email: adminEmails.email })
      .from(adminEmails)
      .all();
    return rows.map((r) => r.email).sort();
  }

  it("inserts comma-separated emails normalized to lowercase + trimmed", async () => {
    const result = await seedAdminEmails(
      db,
      "  Alice@Example.com , bob@example.com ",
    );
    expect(result.inserted).toBe(2);
    expect(await listEmails()).toEqual([
      "alice@example.com",
      "bob@example.com",
    ]);
  });

  it("is idempotent — re-running does not error and inserts no duplicates", async () => {
    await seedAdminEmails(db, "admin@example.com");
    const result = await seedAdminEmails(
      db,
      "admin@example.com,ADMIN@example.com",
    );
    expect(result.inserted).toBe(0);
    expect(await listEmails()).toEqual(["admin@example.com"]);
  });

  it("ignores empty entries and whitespace-only segments", async () => {
    const result = await seedAdminEmails(db, " , a@b.co,, ,c@d.co, ");
    expect(result.inserted).toBe(2);
    expect(await listEmails()).toEqual(["a@b.co", "c@d.co"]);
  });

  it("returns inserted: 0 for empty/undefined input", async () => {
    expect((await seedAdminEmails(db, "")).inserted).toBe(0);
    expect((await seedAdminEmails(db, undefined)).inserted).toBe(0);
    expect(await listEmails()).toEqual([]);
  });
});
