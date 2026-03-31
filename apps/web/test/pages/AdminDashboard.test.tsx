import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import type { ReactNode } from "react";

vi.mock("../../src/lib/api", () => ({
  api: {
    api: {
      admin: {
        projects: {
          $get: vi.fn(),
          ":id": {
            $delete: vi.fn(),
          },
        },
      },
    },
  },
}));

vi.mock("../../src/lib/auth", () => ({
  authClient: {
    useSession: vi.fn().mockReturnValue({
      data: { user: { id: "1", name: "Admin" }, session: {} },
      isPending: false,
    }),
    signOut: vi.fn(),
  },
}));

import { api } from "../../src/lib/api";
import { AdminDashboard } from "../../src/pages/AdminDashboard";

 
const mockAdminProjectsGet = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).api.admin.projects.$get,
);
const mockAdminProjectDelete = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).api.admin.projects[":id"].$delete,
);

const fakeProjects = [
  {
    id: "1",
    title: "Project Alpha",
    slug: "project-alpha",
    description: "First project",
    content: "Content",
    youtubeUrl: null,
    githubUrl: null,
    techStack: ["TypeScript"],
    published: true,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Project Beta",
    slug: "project-beta",
    description: "Second project",
    content: "Content",
    youtubeUrl: null,
    githubUrl: null,
    techStack: ["Go"],
    published: false,
    sortOrder: 1,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const { hook } = memoryLocation({ path: "/admin", static: true });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Router hook={hook}>{children}</Router>
      </QueryClientProvider>
    );
  };
}

describe("AdminDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    mockAdminProjectsGet.mockReturnValue(new Promise(() => {}));

    render(<AdminDashboard />, { wrapper: createWrapper() });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders project list with titles", async () => {
    mockAdminProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }),
    );

    render(<AdminDashboard />, { wrapper: createWrapper() });

    expect(await screen.findByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Project Beta")).toBeInTheDocument();
  });

  it("shows published status for each project", async () => {
    mockAdminProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }),
    );

    render(<AdminDashboard />, { wrapper: createWrapper() });

    await screen.findByText("Project Alpha");
    const publishedBadges = screen.getAllByText(/published|draft/i);
    expect(publishedBadges.length).toBeGreaterThanOrEqual(2);
  });

  it("renders edit links for each project", async () => {
    mockAdminProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }),
    );

    render(<AdminDashboard />, { wrapper: createWrapper() });

    await screen.findByText("Project Alpha");
    const editLinks = screen.getAllByRole("link", { name: /edit/i });
    expect(editLinks).toHaveLength(2);
    expect(editLinks[0]).toHaveAttribute("href", "/admin/projects/1/edit");
  });

  it("renders delete buttons for each project", async () => {
    mockAdminProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }),
    );

    render(<AdminDashboard />, { wrapper: createWrapper() });

    await screen.findByText("Project Alpha");
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it("shows confirm dialog when delete is clicked", async () => {
    const user = userEvent.setup();
    mockAdminProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }),
    );

    render(<AdminDashboard />, { wrapper: createWrapper() });

    await screen.findByText("Project Alpha");
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(
      screen.getByText(/are you sure you want to delete/i),
    ).toBeInTheDocument();
  });

  it("deletes project when confirm dialog is confirmed", async () => {
    const user = userEvent.setup();
    mockAdminProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }),
    );
    mockAdminProjectDelete.mockResolvedValue(Response.json({ success: true }));

    render(<AdminDashboard />, { wrapper: createWrapper() });

    await screen.findByText("Project Alpha");
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    await user.click(confirmBtn);

    expect(mockAdminProjectDelete).toHaveBeenCalled();
  });

  it("shows empty state when no projects", async () => {
    mockAdminProjectsGet.mockResolvedValue(Response.json({ projects: [] }));

    render(<AdminDashboard />, { wrapper: createWrapper() });

    expect(await screen.findByText(/no projects/i)).toBeInTheDocument();
  });

  it("renders inside an admin layout with nav", async () => {
    mockAdminProjectsGet.mockResolvedValue(
      Response.json({ projects: fakeProjects }),
    );

    render(<AdminDashboard />, { wrapper: createWrapper() });

    await screen.findByText("Project Alpha");
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
