import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

vi.mock("../../src/lib/api", () => ({
  api: {
    api: {
      projects: {
        ":slug": {
          $get: vi.fn(),
        },
      },
    },
  },
}));

import { api } from "../../src/lib/api";
import { ProjectPage } from "../../src/pages/ProjectPage";

const mockSlugGet = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api.api.projects as Record<string, any>)[":slug"].$get,
);

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
  title: "Project Alpha",
  slug: "project-alpha",
  description: "A great project",
  content: "# Hello\n\nThis is **bold** text.",
  youtubeUrl: "https://www.youtube.com/watch?v=abc123",
  githubUrl: "https://github.com/test/alpha",
  techStack: ["TypeScript", "React"],
  published: true,
  sortOrder: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("ProjectPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockSlugGet.mockReturnValue(new Promise(() => {}));

    render(<ProjectPage slug="project-alpha" />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders project title", async () => {
    mockSlugGet.mockResolvedValue(Response.json({ project: fakeProject }));

    render(<ProjectPage slug="project-alpha" />, {
      wrapper: createWrapper(),
    });

    expect(
      await screen.findByRole("heading", { name: "Project Alpha" }),
    ).toBeInTheDocument();
  });

  it("renders tech stack badges", async () => {
    mockSlugGet.mockResolvedValue(Response.json({ project: fakeProject }));

    render(<ProjectPage slug="project-alpha" />, {
      wrapper: createWrapper(),
    });

    expect(await screen.findByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders YouTube embed when youtubeUrl is present", async () => {
    mockSlugGet.mockResolvedValue(Response.json({ project: fakeProject }));

    render(<ProjectPage slug="project-alpha" />, {
      wrapper: createWrapper(),
    });

    await screen.findByText("Project Alpha");
    const iframe = screen.getByTitle(/youtube/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("youtube.com/embed/abc123"),
    );
  });

  it("does not render YouTube embed when youtubeUrl is null", async () => {
    mockSlugGet.mockResolvedValue(
      Response.json({
        project: { ...fakeProject, youtubeUrl: null },
      }),
    );

    render(<ProjectPage slug="project-alpha" />, {
      wrapper: createWrapper(),
    });

    await screen.findByText("Project Alpha");
    expect(screen.queryByTitle(/youtube/i)).not.toBeInTheDocument();
  });

  it("renders GitHub link when githubUrl is present", async () => {
    mockSlugGet.mockResolvedValue(Response.json({ project: fakeProject }));

    render(<ProjectPage slug="project-alpha" />, {
      wrapper: createWrapper(),
    });

    const link = await screen.findByRole("link", { name: /github/i });
    expect(link).toHaveAttribute("href", "https://github.com/test/alpha");
  });

  it("does not render GitHub link when githubUrl is null", async () => {
    mockSlugGet.mockResolvedValue(
      Response.json({
        project: { ...fakeProject, githubUrl: null },
      }),
    );

    render(<ProjectPage slug="project-alpha" />, {
      wrapper: createWrapper(),
    });

    await screen.findByText("A great project");
    expect(screen.queryByText(/github/i)).not.toBeInTheDocument();
  });

  it("renders markdown content as HTML", async () => {
    mockSlugGet.mockResolvedValue(Response.json({ project: fakeProject }));

    render(<ProjectPage slug="project-alpha" />, {
      wrapper: createWrapper(),
    });

    await screen.findByText("Project Alpha");
    const bold = screen.getByText("bold");
    expect(bold.tagName).toBe("STRONG");
  });

  it("renders description", async () => {
    mockSlugGet.mockResolvedValue(Response.json({ project: fakeProject }));

    render(<ProjectPage slug="project-alpha" />, {
      wrapper: createWrapper(),
    });

    expect(await screen.findByText("A great project")).toBeInTheDocument();
  });

  it("shows not found when project is null", async () => {
    mockSlugGet.mockResolvedValue(Response.json({ project: null }));

    render(<ProjectPage slug="nonexistent" />, {
      wrapper: createWrapper(),
    });

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("renders a back link to home", async () => {
    mockSlugGet.mockResolvedValue(Response.json({ project: fakeProject }));

    render(<ProjectPage slug="project-alpha" />, {
      wrapper: createWrapper(),
    });

    const link = await screen.findByRole("link", { name: /back/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
