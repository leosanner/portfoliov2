import type { ReactNode } from "react";
import { Redirect } from "wouter";
import { authClient } from "../lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!session?.user) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
