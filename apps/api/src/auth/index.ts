import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "../db";
import * as schema from "../db/schema";
import type { Env } from "../env";
import { signupAllowlistBefore } from "./signup-hook";

export function createAuth(env: Env["Bindings"]) {
  const db = createDb(env.DB);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins: [env.ALLOWED_ORIGIN],
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
      },
    },
    hooks: {
      before: async (context) => {
        const body = context.body as { callbackURL?: string } | undefined;
        if (body?.callbackURL?.startsWith("/")) {
          return {
            context: {
              body: {
                ...body,
                callbackURL: `${env.ALLOWED_ORIGIN}${body.callbackURL}`,
              },
            },
          };
        }
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => signupAllowlistBefore(db, user),
        },
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
