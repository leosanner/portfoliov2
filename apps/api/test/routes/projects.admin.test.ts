import { describe, it, expect, beforeEach } from "vitest";
import { Hono } from "hono";
import { createTestDb, type TestDatabase } from "../helpers/test-db";
import { adminProjectRoutes } from "../../src/routes/projects.admin";

function createTestApp(db: TestDatabase) {
  const app = new Hono();
  app.use("*", async (c, next) => {
    c.set("db" as never, db);
    await next();
  });
  app.route("/api/admin", adminProjectRoutes);
  return app;
}

const validProject = {
  title: "My Test Project",
  description: "A short description",
  content: "# Hello World\n\nThis is the content.",
  techStack: ["React", "TypeScript"],
  youtubeUrl: "https://youtube.com/watch?v=abc",
  githubUrl: "https://github.com/user/repo",
};

describe("POST /api/admin/projects", () => {
  let db: TestDatabase;
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    db = createTestDb();
    app = createTestApp(db);
  });

  it("creates a project and returns it", async () => {
    const res = await app.request("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validProject),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.project.title).toBe("My Test Project");
    expect(body.project.slug).toBe("my-test-project");
    expect(body.project.techStack).toEqual(["React", "TypeScript"]);
    expect(body.project.published).toBe(false);
    expect(body.project.id).toBeDefined();
  });

  it("uses custom slug when provided", async () => {
    const res = await app.request("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validProject, slug: "custom-slug" }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.project.slug).toBe("custom-slug");
  });

  it("returns 400 for invalid input", async () => {
    const res = await app.request("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });

    expect(res.status).toBe(400);
  });

  it("returns 409 for duplicate slug", async () => {
    await app.request("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validProject),
    });

    const res = await app.request("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validProject),
    });

    expect(res.status).toBe(409);
  });
});

describe("GET /api/admin/projects", () => {
  let db: TestDatabase;
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    db = createTestDb();
    app = createTestApp(db);
  });

  it("returns empty list when no projects exist", async () => {
    const res = await app.request("/api/admin/projects");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.projects).toEqual([]);
  });

  it("returns all projects including unpublished", async () => {
    await app.request("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validProject),
    });
    await app.request("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validProject,
        title: "Published Project",
        published: true,
      }),
    });

    const res = await app.request("/api/admin/projects");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.projects).toHaveLength(2);
  });
});

describe("GET /api/admin/projects/:id", () => {
  let db: TestDatabase;
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    db = createTestDb();
    app = createTestApp(db);
  });

  it("returns a project by id", async () => {
    const createRes = await app.request("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validProject),
    });
    const { project } = (await createRes.json()) as { project: { id: string } };

    const res = await app.request(`/api/admin/projects/${project.id}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.project.title).toBe("My Test Project");
  });

  it("returns 404 for non-existent id", async () => {
    const res = await app.request("/api/admin/projects/non-existent");
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/admin/projects/:id", () => {
  let db: TestDatabase;
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    db = createTestDb();
    app = createTestApp(db);
  });

  it("updates project fields", async () => {
    const createRes = await app.request("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validProject),
    });
    const { project } = (await createRes.json()) as { project: { id: string } };

    const res = await app.request(`/api/admin/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated Title", published: true }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.project.title).toBe("Updated Title");
    expect(body.project.published).toBe(true);
    expect(body.project.description).toBe("A short description");
  });

  it("returns 404 for non-existent id", async () => {
    const res = await app.request("/api/admin/projects/non-existent", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/admin/projects/:id", () => {
  let db: TestDatabase;
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    db = createTestDb();
    app = createTestApp(db);
  });

  it("deletes a project", async () => {
    const createRes = await app.request("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validProject),
    });
    const { project } = (await createRes.json()) as { project: { id: string } };

    const res = await app.request(`/api/admin/projects/${project.id}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });

    const getRes = await app.request(`/api/admin/projects/${project.id}`);
    expect(getRes.status).toBe(404);
  });

  it("returns 404 for non-existent id", async () => {
    const res = await app.request("/api/admin/projects/non-existent", {
      method: "DELETE",
    });
    expect(res.status).toBe(404);
  });
});
