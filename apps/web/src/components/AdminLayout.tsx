import type { ReactNode } from "react";
import { Link } from "wouter";
import { authClient } from "../lib/auth";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <nav className="flex w-64 flex-col border-r border-gray-200 bg-gray-50 p-4">
        <div className="mb-8 text-lg font-bold">Admin</div>

        <div className="flex flex-1 flex-col gap-1">
          <Link
            href="/admin"
            className="rounded px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/projects/new"
            className="rounded px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            New Project
          </Link>
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-gray-200 pt-4">
          <Link
            href="/"
            className="rounded px-3 py-2 text-gray-600 hover:bg-gray-200"
          >
            Back to site
          </Link>
          <button
            type="button"
            onClick={() => authClient.signOut()}
            className="rounded px-3 py-2 text-left text-gray-600 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
