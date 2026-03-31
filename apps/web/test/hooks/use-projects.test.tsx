import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

vi.mock("../../src/lib/api", () => ({
  api: {
    api: {
      projects: {
        $get: vi.fn(),
      },
      admin: {
        projects: {
          $get: vi.fn(),
          $post: vi.fn(),
        },
      },
    },
  },
}));

import { api } from "../../src/lib/api";
import { useProjects } from "../../src/hooks/use-projects";

const mockProjectsGet = vi.mocked(api.api.projects.$get);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

const fakeProject = {
  id: "1",
  title: "Test Project",
  slug: "test-project",
  description: "A test",
  content: "Content here",
  youtubeUrl: null,
  githubUrl: "https://github.com/test",
  techStack: ["TypeScript"],
  published: true,
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("useProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches published projects", async () => {
    mockProjectsGet.mockResolvedValue(
      Response.json({
        projects: [fakeProject],
      }) as unknown as Awaited<ReturnType<typeof mockProjectsGet>>,
    );

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([fakeProject]);
    expect(mockProjectsGet).toHaveBeenCalledOnce();
  });
});

describe("useProjectBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches a single project by slug", async () => {
    const mockSlugGet = vi
      .fn()
      .mockResolvedValue(Response.json({ project: fakeProject }));

    // Hono RPC uses $get on the slug param endpoint
    vi.mocked(api.api.projects as Record<string, unknown>)[":slug"] = {
      $get: mockSlugGet,
    };

    // Re-import to pick up the mock
    const { useProjectBySlug: hook } =
      await import("../../src/hooks/use-projects");

    const { result } = renderHook(() => hook("test-project"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(fakeProject);
    expect(mockSlugGet).toHaveBeenCalledWith({
      param: { slug: "test-project" },
    });
  });
});
