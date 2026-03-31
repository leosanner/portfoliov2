import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import type { ReactNode } from "react";

vi.mock("../../src/lib/auth", () => ({
  authClient: {
    useSession: vi.fn(),
    signIn: {
      social: vi.fn(),
    },
  },
}));

import { authClient } from "../../src/lib/auth";
import { LoginPage } from "../../src/pages/LoginPage";

const mockUseSession = vi.mocked(authClient.useSession);
const mockSignInSocial = vi.mocked(authClient.signIn.social);

function renderWithRouter(ui: ReactNode, path = "/login") {
  const { hook } = memoryLocation({ path, static: true });
  return render(<Router hook={hook}>{ui}</Router>);
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    } as ReturnType<typeof authClient.useSession>);
  });

  it("renders the sign-in button", () => {
    renderWithRouter(<LoginPage />);

    expect(
      screen.getByRole("button", { name: /sign in with google/i }),
    ).toBeInTheDocument();
  });

  it("calls Google sign-in when button is clicked", async () => {
    const user = userEvent.setup();
    mockSignInSocial.mockResolvedValue({} as never);

    renderWithRouter(<LoginPage />);

    await user.click(
      screen.getByRole("button", { name: /sign in with google/i }),
    );
    expect(mockSignInSocial).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/admin",
    });
  });

  it("shows loading state while session is pending", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: true,
    } as ReturnType<typeof authClient.useSession>);

    renderWithRouter(<LoginPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("redirects to /admin if user is already authenticated", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "1", name: "Admin" }, session: {} },
      isPending: false,
    } as ReturnType<typeof authClient.useSession>);

    renderWithRouter(<LoginPage />);

    expect(
      screen.queryByRole("button", { name: /sign in/i }),
    ).not.toBeInTheDocument();
  });

  it("displays error message on sign-in failure", async () => {
    const user = userEvent.setup();
    mockSignInSocial.mockRejectedValue(new Error("Auth failed"));

    renderWithRouter(<LoginPage />);

    await user.click(
      screen.getByRole("button", { name: /sign in with google/i }),
    );

    expect(await screen.findByText(/failed to sign in/i)).toBeInTheDocument();
  });
});
