import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../src/lib/auth", () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

import { authClient } from "../src/lib/auth";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

const mockUseSession = vi.mocked(authClient.useSession);

function AdminContent() {
  return <p>Admin content</p>;
}

describe("ProtectedRoute", () => {
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
  });

  it("renders children when authenticated", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "1", name: "Admin" }, session: {} },
      isPending: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);

    render(
      <ProtectedRoute>
        <AdminContent />
      </ProtectedRoute>,
    );

    expect(screen.getByText("Admin content")).toBeInTheDocument();
  });
});
