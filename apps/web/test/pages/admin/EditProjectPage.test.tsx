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
          ":id": {
            $get: vi.fn(),
            $put: vi.fn(),
          },
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
import { EditProjectPage } from "../../../src/pages/admin/EditProjectPage";

const mockGet = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).api.admin.projects[":id"].$get,
);
const mockPut = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).api.admin.projects[":id"].$put,
);

const sampleProject = {
  id: "abc",
  title: "Existing Project",
  slug: "existing-project",
  description: "Original desc",
  content: "Original content",
  youtubeUrl: null,
  githubUrl: null,
  techStack: ["TypeScript"],
  published: true,
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function createWrapper(initialPath = "/admin/projects/abc/edit") {
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

describe("EditProjectPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state while fetching", () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    const { Wrapper } = createWrapper();
    render(<EditProjectPage id="abc" />, { wrapper: Wrapper });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows not-found message when API returns 404", async () => {
    mockGet.mockResolvedValue(
      new Response(JSON.stringify({ error: "not found" }), { status: 404 }),
    );
    const { Wrapper } = createWrapper();
    render(<EditProjectPage id="abc" />, { wrapper: Wrapper });

    expect(await screen.findByText(/project not found/i)).toBeInTheDocument();
  });

  it("populates form with fetched project values", async () => {
    mockGet.mockResolvedValue(
      new Response(JSON.stringify({ project: sampleProject }), { status: 200 }),
    );
    const { Wrapper } = createWrapper();
    render(<EditProjectPage id="abc" />, { wrapper: Wrapper });

    await waitFor(() =>
      expect(screen.getByLabelText(/title/i)).toHaveValue("Existing Project"),
    );
    expect(screen.getByLabelText(/description/i)).toHaveValue("Original desc");
    expect(screen.getByLabelText(/content/i)).toHaveValue("Original content");
  });

  it("submits updates via $put and redirects to projects list", async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValue(
      new Response(JSON.stringify({ project: sampleProject }), { status: 200 }),
    );
    mockPut.mockResolvedValue(
      new Response(JSON.stringify({ project: sampleProject }), { status: 200 }),
    );

    const { Wrapper, history } = createWrapper();
    render(<EditProjectPage id="abc" />, { wrapper: Wrapper });

    await waitFor(() =>
      expect(screen.getByLabelText(/title/i)).toHaveValue("Existing Project"),
    );

    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Title");
    await user.click(screen.getByRole("button", { name: /update project/i }));

    await waitFor(() => expect(mockPut).toHaveBeenCalled());
    const call = mockPut.mock.calls[0][0];
    expect(call.param).toEqual({ id: "abc" });
    expect(call.json.title).toBe("Updated Title");
    await waitFor(() =>
      expect(history[history.length - 1]).toBe("/admin/projects"),
    );
  });
});
