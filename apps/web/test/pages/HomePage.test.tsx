import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

vi.mock("../../src/lib/api", () => ({
  api: {
    api: {
      projects: {
        $get: vi.fn(),
      },
    },
  },
}));

import { api } from "../../src/lib/api";
import { HomePage } from "../../src/pages/HomePage";

const mockProjectsGet = vi.mocked(api.api.projects.$get);
type ProjectsResponse = Awaited<ReturnType<typeof mockProjectsGet>>;

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

const fakeProjects = [
  {
    id: "1",
    title: "Project Alpha",
    slug: "project-alpha",
    description: "First project description",
    content: "Content",
    youtubeUrl: null,
    githubUrl: "https://github.com/test/alpha",
    techStack: ["TypeScript", "React"],
    published: true,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Project Beta",
    slug: "project-beta",
    description: "Second project description",
    content: "Content",
    youtubeUrl: "https://youtube.com/watch?v=123",
    githubUrl: null,
    techStack: ["Go", "Docker"],
    published: true,
    sortOrder: 1,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockProjectsGet.mockReturnValue(new Promise(() => {}));

    render(<HomePage />, { wrapper: createWrapper() });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders project cards when data loads", async () => {
    mockProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }) as unknown as ProjectsResponse,
    );

    render(<HomePage />, { wrapper: createWrapper() });

    expect(await screen.findByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Project Beta")).toBeInTheDocument();
    expect(screen.getByText("First project description")).toBeInTheDocument();
  });

  it("renders tech stack badges", async () => {
    mockProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }) as unknown as ProjectsResponse,
    );

    render(<HomePage />, { wrapper: createWrapper() });

    expect(await screen.findByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
  });

  it("renders links to project detail pages", async () => {
    mockProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }) as unknown as ProjectsResponse,
    );

    render(<HomePage />, { wrapper: createWrapper() });

    const link = await screen.findByRole("link", { name: /project alpha/i });
    expect(link).toHaveAttribute("href", "/projects/project-alpha");
  });

  it("shows empty state when no projects", async () => {
    mockProjectsGet.mockResolvedValue(
      Response.json({ projects: [] }) as unknown as ProjectsResponse,
    );

    render(<HomePage />, { wrapper: createWrapper() });

    expect(await screen.findByText(/no projects/i)).toBeInTheDocument();
  });
});
