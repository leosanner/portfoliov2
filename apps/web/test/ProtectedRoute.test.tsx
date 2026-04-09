import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const meGetMock = vi.fn();

vi.mock("../src/lib/auth", () => ({
  authClient: {
    useSession: vi.fn(),
    signOut: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("../src/lib/api", () => ({
  api: {
    api: {
      admin: {
        me: {
          $get: (...args: unknown[]) => meGetMock(...args),
        },
      },
    },
  },
}));

import { authClient } from "../src/lib/auth";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

const mockUseSession = vi.mocked(authClient.useSession);

function AdminContent() {
  return <p>Admin content</p>;
}

function makeResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    meGetMock.mockReset();
  });

  it("shows loading state while session is pending", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: true,
      error: null,
    } as ReturnType<typeof authClient.useSession>);

    render(
      <ProtectedRoute>
        <AdminContent />
      </ProtectedRoute>,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);

    render(
      <ProtectedRoute>
        <AdminContent />
      </ProtectedRoute>,
    );

    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
    expect(meGetMock).not.toHaveBeenCalled();
  });

  it("renders children when /api/admin/me returns 200", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "1", name: "Admin" }, session: {} },
      isPending: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);
    meGetMock.mockResolvedValue(
      makeResponse(200, { ok: true, email: "admin@example.com" }),
    );

    render(
      <ProtectedRoute>
        <AdminContent />
      </ProtectedRoute>,
    );

    await waitFor(() =>
      expect(screen.getByText("Admin content")).toBeInTheDocument(),
    );
  });

  it("renders AccessDenied when /api/admin/me returns 403", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "1", name: "Admin" }, session: {} },
      isPending: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);
    meGetMock.mockResolvedValue(makeResponse(403, { error: "Forbidden" }));

    render(
      <ProtectedRoute>
        <AdminContent />
      </ProtectedRoute>,
    );

    await waitFor(() =>
      expect(screen.getByText(/access denied/i)).toBeInTheDocument(),
    );
    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
  });

  it("shows loading while /api/admin/me is in flight", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "1", name: "Admin" }, session: {} },
      isPending: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);
    meGetMock.mockReturnValue(new Promise(() => {}));

    render(
      <ProtectedRoute>
        <AdminContent />
      </ProtectedRoute>,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
  });
});
