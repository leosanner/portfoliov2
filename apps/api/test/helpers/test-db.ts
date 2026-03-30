import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../../src/db/schema";

const MIGRATIONS = [
  // 0000 - auth tables
  `CREATE TABLE \`user\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    \`email\` text NOT NULL,
    \`email_verified\` integer NOT NULL,
    \`image\` text,
    \`created_at\` integer NOT NULL,
    \`updated_at\` integer NOT NULL
  );`,
  `CREATE UNIQUE INDEX \`user_email_unique\` ON \`user\` (\`email\`);`,
  // 0001 - project table
  `CREATE TABLE \`project\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`slug\` text NOT NULL,
    \`description\` text NOT NULL,
    \`content\` text NOT NULL,
    \`youtube_url\` text,
    \`github_url\` text,
    \`tech_stack\` text NOT NULL,
    \`published\` integer DEFAULT false NOT NULL,
    \`sort_order\` integer DEFAULT 0 NOT NULL,
    \`created_at\` integer NOT NULL,
    \`updated_at\` integer NOT NULL
  );`,
  `CREATE UNIQUE INDEX \`project_slug_unique\` ON \`project\` (\`slug\`);`,
];

export function createTestDb() {
  const sqlite = new Database(":memory:");
  for (const sql of MIGRATIONS) {
    sqlite.exec(sql);
  }
  return drizzle(sqlite, { schema });
}

export type TestDatabase = ReturnType<typeof createTestDb>;
