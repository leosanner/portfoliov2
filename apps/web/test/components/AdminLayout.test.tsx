import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import type { ReactNode } from "react";

vi.mock("../../src/lib/auth", () => ({
  authClient: {
    useSession: vi.fn(),
    signOut: vi.fn(),
  },
}));

import { authClient } from "../../src/lib/auth";
import { AdminLayout } from "../../src/components/AdminLayout";

const mockUseSession = vi.mocked(authClient.useSession);
const mockSignOut = vi.mocked(authClient.signOut);

function renderWithRouter(ui: ReactNode, path = "/admin") {
  const { hook } = memoryLocation({ path, static: true });
  return render(<Router hook={hook}>{ui}</Router>);
}

describe("AdminLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: { user: { id: "1", name: "Admin" }, session: {} },
      isPending: false,
    } as ReturnType<typeof authClient.useSession>);
  });

  it("renders children when authenticated", () => {
    renderWithRouter(
      <AdminLayout>
        <p>Admin content</p>
      </AdminLayout>,
    );

    expect(screen.getByText("Admin content")).toBeInTheDocument();
  });

  it("shows loading when session is pending", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: true,
    } as ReturnType<typeof authClient.useSession>);

    renderWithRouter(
      <AdminLayout>
        <p>Admin content</p>
      </AdminLayout>,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
  });

  it("renders Projects and Analytics nav links", () => {
    renderWithRouter(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
    );

    expect(screen.getByRole("link", { name: /all projects/i })).toHaveAttribute(
      "href",
      "/admin/projects",
    );
    expect(screen.getByRole("link", { name: /overview/i })).toHaveAttribute(
      "href",
      "/admin/analytics",
    );
  });

  it("marks Projects link active when on /admin/projects", () => {
    renderWithRouter(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
      "/admin/projects",
    );

    const link = screen.getByRole("link", { name: /all projects/i });
    expect(link.className).toMatch(/bg-surface-container-high/);
  });

  it("marks Analytics link active when on /admin/analytics", () => {
    renderWithRouter(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
      "/admin/analytics",
    );

    const link = screen.getByRole("link", { name: /overview/i });
    expect(link.className).toMatch(/bg-surface-container-high/);
  });

  it("renders New Project nav link", () => {
    renderWithRouter(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
    );

    const link = screen.getByRole("link", { name: /new project/i });
    expect(link).toHaveAttribute("href", "/admin/projects/new");
  });

  it("renders Back to site link", () => {
    renderWithRouter(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
    );

    const link = screen.getByRole("link", { name: /back to site/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders a logout button", () => {
    renderWithRouter(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
    );

    expect(
      screen.getByRole("button", { name: /log\s?out/i }),
    ).toBeInTheDocument();
  });

  it("calls signOut when logout button is clicked", async () => {
    const user = userEvent.setup();
    mockSignOut.mockResolvedValue({} as never);

    renderWithRouter(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
    );

    await user.click(screen.getByRole("button", { name: /log\s?out/i }));
    expect(mockSignOut).toHaveBeenCalled();
  });

  it("renders children inside a main element", () => {
    renderWithRouter(
      <AdminLayout>
        <p>Main content</p>
      </AdminLayout>,
    );

    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByText("Main content"));
  });

  it("renders a nav element", () => {
    renderWithRouter(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
