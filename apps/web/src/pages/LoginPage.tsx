import { Redirect } from "wouter";
import { authClient } from "../lib/auth";

export function LoginPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (session?.user) {
    return <Redirect to="/admin" />;
  }

  async function handleGoogleSignIn() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/admin`,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Portfolio Admin</h1>

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
