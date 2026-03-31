import type { Auth } from "./auth";
import type { Database } from "./db";

type AuthSession = Awaited<ReturnType<Auth["api"]["getSession"]>>;
type NonNullSession = NonNullable<AuthSession>;

export type Env = {
  Bindings: {
    DB: D1Database;
    ALLOWED_ORIGIN: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    BETTER_AUTH_SECRET: string;
  };
  Variables: {
    user: NonNullSession["user"];
    session: NonNullSession["session"];
    db: Database;
  };
};
