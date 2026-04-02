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

  it("redirects to Google OAuth when button is clicked", async () => {
    const user = userEvent.setup();
    const setHref = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: {
        ...originalLocation,
        set href(url: string) {
          setHref(url);
        },
      },
      writable: true,
    });

    renderWithRouter(<LoginPage />);

    await user.click(
      screen.getByRole("button", { name: /sign in with google/i }),
    );

    const expectedURL = `${import.meta.env.VITE_API_URL}/api/auth/signin/google?callbackURL=${encodeURIComponent(`${window.location.origin}/admin`)}`;
    expect(setHref).toHaveBeenCalledWith(expectedURL);
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
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
});
