import { describe, it, expect, vi } from "vitest";
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
      },
    },
  },
}));

import { App } from "../src/App";

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
  it("renders home page at /", async () => {
    renderAtPath("/");
    expect(await screen.findByText("Portfolio")).toBeInTheDocument();
  });

  it("renders project page at /projects/:slug", () => {
    renderAtPath("/projects/my-project");
    expect(screen.getByText(/project/i)).toBeInTheDocument();
  });

  it("renders login page at /login", () => {
    renderAtPath("/login");
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it("renders admin dashboard at /admin", () => {
    renderAtPath("/admin");
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it("renders not found for unknown routes", () => {
    renderAtPath("/unknown-route");
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
