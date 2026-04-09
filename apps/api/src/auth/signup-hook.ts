import { APIError } from "better-auth/api";
import type { Database } from "../db";
import { isEmailAllowed } from "./allowlist";

type UserInput = { email: string; [key: string]: unknown };

/**
 * Better Auth `databaseHooks.user.create.before` implementation.
 * Rejects user creation when the email is not present in the
 * admin_emails allowlist. This prevents orphan accounts in the DB
 * for unauthorized Google sign-ins.
 */
export async function signupAllowlistBefore<T extends UserInput>(
  db: Database,
  user: T,
): Promise<{ data: T }> {
  const allowed = await isEmailAllowed(db, user.email);
  if (!allowed) {
    throw new APIError("FORBIDDEN", {
      message: "This email is not authorized to access the admin area.",
    });
  }
  return { data: user };
}
