import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../../src/schemas/project";

describe("createProjectSchema", () => {
  const validInput = {
    title: "My Project",
    description: "A short description of the project",
    content: "# Full markdown content here",
    techStack: ["React", "TypeScript"],
  };

  it("accepts valid input with required fields only", () => {
    const result = createProjectSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts valid input with all optional fields", () => {
    const result = createProjectSchema.safeParse({
      ...validInput,
      slug: "my-project",
      youtubeUrl: "https://youtube.com/watch?v=abc",
      githubUrl: "https://github.com/user/repo",
      published: true,
      sortOrder: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createProjectSchema.safeParse({
      ...validInput,
      title: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty description", () => {
    const result = createProjectSchema.safeParse({
      ...validInput,
      description: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty content", () => {
    const result = createProjectSchema.safeParse({
      ...validInput,
      content: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug format", () => {
    const result = createProjectSchema.safeParse({
      ...validInput,
      slug: "My Invalid Slug!",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid slug format", () => {
    const result = createProjectSchema.safeParse({
      ...validInput,
      slug: "valid-slug-123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid YouTube URL", () => {
    const result = createProjectSchema.safeParse({
      ...validInput,
      youtubeUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid GitHub URL", () => {
    const result = createProjectSchema.safeParse({
      ...validInput,
      githubUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("defaults techStack to empty array when not provided", () => {
    const result = createProjectSchema.safeParse({
      title: validInput.title,
      description: validInput.description,
      content: validInput.content,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.techStack).toEqual([]);
    }
  });

  it("defaults published to false", () => {
    const result = createProjectSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.published).toBe(false);
    }
  });

  it("defaults sortOrder to 0", () => {
    const result = createProjectSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortOrder).toBe(0);
    }
  });

  it("allows null youtubeUrl", () => {
    const result = createProjectSchema.safeParse({
      ...validInput,
      youtubeUrl: null,
    });
    expect(result.success).toBe(true);
  });

  it("allows null githubUrl", () => {
    const result = createProjectSchema.safeParse({
      ...validInput,
      githubUrl: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("updateProjectSchema", () => {
  it("accepts partial input", () => {
    const result = updateProjectSchema.safeParse({ title: "Updated Title" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = updateProjectSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("still validates field constraints", () => {
    const result = updateProjectSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });
});
