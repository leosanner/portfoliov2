import { eq } from "drizzle-orm";
import type { Database } from "../db";
import { adminEmails } from "../db/schema";

/**
 * Checks whether the given email is present in the admin_emails allowlist.
 * Normalizes input (trim + lowercase) before lookup.
 */
export async function isEmailAllowed(
  db: Database,
  email: string | null | undefined,
): Promise<boolean> {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  const row = await db
    .select({ email: adminEmails.email })
    .from(adminEmails)
    .where(eq(adminEmails.email, normalized))
    .get();

  return !!row;
}
