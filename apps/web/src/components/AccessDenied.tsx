import { useEffect } from "react";
import { authClient } from "../lib/auth";

export function AccessDenied() {
  useEffect(() => {
    void authClient.signOut();
  }, []);

  return (
    <div>
      <h1>Access denied</h1>
      <p>Your account is not authorized to access this area.</p>
    </div>
  );
}
