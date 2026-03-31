import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectForm } from "../../src/components/ProjectForm";

const mockOnSubmit = vi.fn();

describe("ProjectForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ProjectForm mode="create" onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/youtube url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/github url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tech stack/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/published/i)).toBeInTheDocument();
  });

  it("shows 'Create Project' button in create mode", () => {
    render(<ProjectForm mode="create" onSubmit={mockOnSubmit} />);

    expect(
      screen.getByRole("button", { name: /create project/i }),
    ).toBeInTheDocument();
  });

  it("shows 'Update Project' button in edit mode", () => {
    render(<ProjectForm mode="edit" onSubmit={mockOnSubmit} />);

    expect(
      screen.getByRole("button", { name: /update project/i }),
    ).toBeInTheDocument();
  });

  it("pre-fills fields with initialData in edit mode", () => {
    render(
      <ProjectForm
        mode="edit"
        onSubmit={mockOnSubmit}
        initialData={{
          title: "My Project",
          description: "A description",
          youtubeUrl: "https://youtube.com/watch?v=123",
          githubUrl: "https://github.com/test",
          techStack: ["React", "Node"],
          content: "# Markdown",
          published: true,
        }}
      />,
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue("My Project");
    expect(screen.getByLabelText(/description/i)).toHaveValue("A description");
    expect(screen.getByLabelText(/youtube url/i)).toHaveValue(
      "https://youtube.com/watch?v=123",
    );
    expect(screen.getByLabelText(/github url/i)).toHaveValue(
      "https://github.com/test",
    );
    expect(screen.getByLabelText(/tech stack/i)).toHaveValue("React, Node");
    expect(screen.getByLabelText(/content/i)).toHaveValue("# Markdown");
    expect(screen.getByLabelText(/published/i)).toBeChecked();
  });

  it("shows validation errors for required fields on empty submit", async () => {
    const user = userEvent.setup();

    render(<ProjectForm mode="create" onSubmit={mockOnSubmit} />);

    await user.click(screen.getByRole("button", { name: /create project/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/content is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with form data on valid submission", async () => {
    const user = userEvent.setup();

    render(<ProjectForm mode="create" onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New Project" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A description" },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "Some content" },
    });
    fireEvent.change(screen.getByLabelText(/tech stack/i), {
      target: { value: "React, TypeScript" },
    });

    await user.click(screen.getByRole("button", { name: /create project/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: "New Project",
      description: "A description",
      content: "Some content",
      youtubeUrl: "",
      githubUrl: "",
      techStack: ["React", "TypeScript"],
      published: false,
    });
  });

  it("disables submit button when isSubmitting is true", () => {
    render(<ProjectForm mode="create" onSubmit={mockOnSubmit} isSubmitting />);

    expect(
      screen.getByRole("button", { name: /create project/i }),
    ).toBeDisabled();
  });

  it("handles tech stack as comma-separated tags", async () => {
    const user = userEvent.setup();

    render(<ProjectForm mode="create" onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Desc" },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "Content" },
    });
    fireEvent.change(screen.getByLabelText(/tech stack/i), {
      target: { value: " React , Node.js , " },
    });

    await user.click(screen.getByRole("button", { name: /create project/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        techStack: ["React", "Node.js"],
      }),
    );
  });
});
