import { useEffect, useState, type ReactNode } from "react";
import { Redirect } from "wouter";
import { authClient } from "../lib/auth";
import { api } from "../lib/api";
import { AccessDenied } from "./AccessDenied";

type MeState = "loading" | "allowed" | "denied";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [meState, setMeState] = useState<MeState>("loading");

  useEffect(() => {
    if (isPending || !session?.user) return;
    let cancelled = false;
    setMeState("loading");
    (async () => {
      const res = await api.api.admin.me.$get();
      if (cancelled) return;
      setMeState(res.status === 200 ? "allowed" : "denied");
    })();
    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!session?.user) {
    return <Redirect to="/login" />;
  }

  if (meState === "loading") {
    return <p>Loading...</p>;
  }

  if (meState === "denied") {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
