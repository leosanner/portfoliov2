import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import type { ReactNode } from "react";

vi.mock("../../../src/lib/api", () => ({
  api: {
    api: {
      admin: {
        projects: {
          $post: vi.fn(),
        },
      },
    },
  },
}));

vi.mock("../../../src/lib/auth", () => ({
  authClient: {
    useSession: vi.fn().mockReturnValue({
      data: { user: { id: "1", name: "Admin" }, session: {} },
      isPending: false,
    }),
    signOut: vi.fn(),
  },
}));

import { api } from "../../../src/lib/api";
import { NewProjectPage } from "../../../src/pages/admin/NewProjectPage";

const mockPost = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).api.admin.projects.$post,
);

function createWrapper(initialPath = "/admin/projects/new") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const { hook, history } = memoryLocation({
    path: initialPath,
    record: true,
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Router hook={hook}>{children}</Router>
    </QueryClientProvider>
  );
  return { Wrapper, history };
}

describe("NewProjectPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders an empty project form", () => {
    const { Wrapper } = createWrapper();
    render(<NewProjectPage />, { wrapper: Wrapper });

    expect(screen.getByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/description/i)).toHaveValue("");
    expect(
      screen.getByRole("button", { name: /create project/i }),
    ).toBeInTheDocument();
  });

  it("submits form and navigates to projects list on success", async () => {
    const user = userEvent.setup();
    mockPost.mockResolvedValue(
      new Response(JSON.stringify({ project: { id: "abc" } }), { status: 201 }),
    );

    const { Wrapper, history } = createWrapper();
    render(<NewProjectPage />, { wrapper: Wrapper });

    await user.type(screen.getByLabelText(/title/i), "My Project");
    await user.type(screen.getByLabelText(/description/i), "Short desc");
    await user.type(screen.getByLabelText(/content/i), "# Hello");
    await user.click(screen.getByRole("button", { name: /create project/i }));

    await waitFor(() => expect(mockPost).toHaveBeenCalled());
    await waitFor(() =>
      expect(history[history.length - 1]).toBe("/admin/projects"),
    );
  });

  it("shows error message when slug is duplicated (409)", async () => {
    const user = userEvent.setup();
    mockPost.mockResolvedValue(
      new Response(JSON.stringify({ error: "slug already exists" }), {
        status: 409,
      }),
    );

    const { Wrapper } = createWrapper();
    render(<NewProjectPage />, { wrapper: Wrapper });

    await user.type(screen.getByLabelText(/title/i), "Dup");
    await user.type(screen.getByLabelText(/description/i), "Desc");
    await user.type(screen.getByLabelText(/content/i), "body");
    await user.click(screen.getByRole("button", { name: /create project/i }));

    expect(await screen.findByText(/slug already exists/i)).toBeInTheDocument();
  });
});
