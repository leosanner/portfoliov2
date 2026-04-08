import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
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
import { ProjectsPage } from "../../src/pages/ProjectsPage";

const mockProjectsGet = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).api.projects.$get,
);

const fakeProjects = [
  {
    id: "1",
    title: "Project Alpha",
    slug: "project-alpha",
    description: "First project description",
    content: "Content",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    githubUrl: null,
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
    youtubeUrl: null,
    githubUrl: null,
    techStack: ["Go"],
    published: true,
    sortOrder: 1,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const { hook } = memoryLocation({ path: "/projects", static: true });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Router hook={hook}>{children}</Router>
      </QueryClientProvider>
    );
  };
}

describe("ProjectsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state while fetching", () => {
    mockProjectsGet.mockReturnValue(new Promise(() => {}));

    render(<ProjectsPage />, { wrapper: createWrapper() });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows empty state message when no projects exist", async () => {
    mockProjectsGet.mockResolvedValue(Response.json({ projects: [] }));

    render(<ProjectsPage />, { wrapper: createWrapper() });

    expect(
      await screen.findByText(
        /projetos ainda não listados, processo em desenvolvimento/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders a card for each project with title, description and tech stack", async () => {
    mockProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }),
    );

    render(<ProjectsPage />, { wrapper: createWrapper() });

    expect(
      (await screen.findAllByText("Project Alpha")).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Project Beta").length).toBeGreaterThan(0);
    expect(screen.getByText("First project description")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
  });

  it("links each card to its project detail page", async () => {
    mockProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }),
    );

    render(<ProjectsPage />, { wrapper: createWrapper() });

    await screen.findAllByText("Project Alpha");
    const link = screen
      .getAllByRole("link")
      .find((a) => a.getAttribute("href") === "/projects/project-alpha");
    expect(link).toBeDefined();
  });
});
