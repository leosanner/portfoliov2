import { spawnSync } from "node:child_process";
import type { Database } from "../src/db/index.ts";
import { adminEmails } from "../src/db/schema.ts";

export interface SeedResult {
  inserted: number;
}

/**
 * Parses a CSV list of admin emails and inserts each one into the
 * `admin_emails` table. Normalizes (trim + lowercase), drops empty
 * segments, and uses INSERT OR IGNORE so re-running is idempotent.
 */
export async function seedAdminEmails(
  db: Database,
  csv: string | undefined | null,
): Promise<SeedResult> {
  if (!csv) return { inserted: 0 };

  const emails = Array.from(
    new Set(
      csv
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0),
    ),
  );

  if (emails.length === 0) return { inserted: 0 };

  const now = new Date();
  let inserted = 0;
  for (const email of emails) {
    const result = await db
      .insert(adminEmails)
      .values({ email, createdAt: now })
      .onConflictDoNothing()
      .run();
    // better-sqlite3 returns { changes } via the underlying driver result
    const changes =
      (result as unknown as { changes?: number; rowsAffected?: number })
        .changes ??
      (result as unknown as { rowsAffected?: number }).rowsAffected ??
      0;
    inserted += changes;
  }

  return { inserted };
}

/**
 * Builds the SQL statements that the CLI runner forwards to
 * `wrangler d1 execute`. Exported for testing.
 */
export function buildSeedSql(csv: string | undefined | null): string {
  if (!csv) return "";
  const emails = Array.from(
    new Set(
      csv
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0),
    ),
  );
  if (emails.length === 0) return "";
  const now = Date.now();
  return emails
    .map(
      (email) =>
        `INSERT OR IGNORE INTO admin_emails (email, created_at) VALUES ('${email.replace(/'/g, "''")}', ${now});`,
    )
    .join("\n");
}

// CLI entry: `pnpm db:seed:admins [-- --remote]`
// Reads ADMIN_BOOTSTRAP_EMAILS from the environment and forwards
// generated SQL to `wrangler d1 execute DB`. Defaults to --local.
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const csv = process.env.ADMIN_BOOTSTRAP_EMAILS;
  const sqlText = buildSeedSql(csv);
  if (!sqlText) {
    console.log("No emails in ADMIN_BOOTSTRAP_EMAILS — nothing to seed.");
    process.exit(0);
  }
  const passthrough = process.argv.slice(2);
  const wranglerArgs = ["wrangler", "d1", "execute", "DB"];
  if (!passthrough.includes("--remote")) wranglerArgs.push("--local");
  wranglerArgs.push(...passthrough, "--command", sqlText);
  const result = spawnSync("pnpm", ["exec", ...wranglerArgs], {
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}
