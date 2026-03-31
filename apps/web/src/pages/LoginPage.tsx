import { useState } from "react";
import { Redirect } from "wouter";
import { authClient } from "../lib/auth";

export function LoginPage() {
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (session) {
    return <Redirect to="/admin" />;
  }

  async function handleGoogleSignIn() {
    try {
      setError(null);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/admin",
      });
    } catch {
      setError("Failed to sign in. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Portfolio Admin</h1>

        {error && (
          <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
