import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { memoryLocation } from "wouter/memory-location";
import { Router } from "wouter";
import type { ReactNode } from "react";

vi.mock("../src/lib/api", () => ({
  api: {
    api: {
      projects: {
        $get: vi.fn().mockResolvedValue(Response.json({ projects: [] })),
        ":slug": {
          $get: vi.fn().mockReturnValue(new Promise(() => {})),
        },
      },
      admin: {
        projects: {
          $get: vi.fn().mockResolvedValue(Response.json({ projects: [] })),
        },
        me: {
          $get: vi
            .fn()
            .mockResolvedValue(
              Response.json({ ok: true, email: "admin@example.com" }),
            ),
        },
      },
    },
  },
}));

vi.mock("../src/lib/auth", () => ({
  authClient: {
    useSession: vi.fn(),
    signIn: { social: vi.fn() },
    signOut: vi.fn(),
  },
}));

import { authClient } from "../src/lib/auth";
import { App } from "../src/App";

const mockUseSession = vi.mocked(authClient.useSession);

function renderAtPath(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const { hook } = memoryLocation({ path, static: true });
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Router hook={hook}>{children}</Router>
      </QueryClientProvider>
    );
  }
  return render(<App />, { wrapper: Wrapper });
}

describe("Router", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    } as ReturnType<typeof authClient.useSession>);
  });

  it("renders home page at /", async () => {
    renderAtPath("/");
    expect(await screen.findByText(/construindo/i)).toBeInTheDocument();
  });

  it("renders project page at /projects/:slug", () => {
    renderAtPath("/projects/my-project");
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders login page at /login", () => {
    renderAtPath("/login");
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument();
  });

  it("renders projects list at /admin/projects", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "1", name: "Admin" }, session: {} },
      isPending: false,
    } as ReturnType<typeof authClient.useSession>);

    renderAtPath("/admin/projects");
    expect(
      await screen.findByRole("heading", { name: "Projects" }),
    ).toBeInTheDocument();
  });

  it("renders not found for unknown routes", () => {
    renderAtPath("/unknown-route");
    expect(screen.getByText(/página não encontrada/i)).toBeInTheDocument();
  });
});
