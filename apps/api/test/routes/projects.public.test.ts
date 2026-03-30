import { describe, it, expect, beforeEach } from "vitest";
import { Hono } from "hono";
import { createTestDb, type TestDatabase } from "../helpers/test-db";
import { publicProjectRoutes } from "../../src/routes/projects.public";
import { adminProjectRoutes } from "../../src/routes/projects.admin";

function createTestApp(db: TestDatabase) {
  const app = new Hono();
  app.use("*", async (c, next) => {
    c.set("db" as never, db);
    await next();
  });
  app.route("/api/admin", adminProjectRoutes);
  app.route("/api", publicProjectRoutes);
  return app;
}

async function seedProject(
  app: ReturnType<typeof createTestApp>,
  overrides: Record<string, unknown> = {},
) {
  const res = await app.request("/api/admin/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Test Project",
      description: "A test project",
      content: "# Content",
      techStack: ["TypeScript"],
      ...overrides,
    }),
  });
  return ((await res.json()) as { project: Record<string, unknown> }).project;
}

describe("GET /api/projects", () => {
  let db: TestDatabase;
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    db = createTestDb();
    app = createTestApp(db);
  });

  it("returns only published projects", async () => {
    await seedProject(app, { title: "Draft", published: false });
    await seedProject(app, { title: "Published", published: true });

    const res = await app.request("/api/projects");
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      projects: { title: string }[];
    };
    expect(body.projects).toHaveLength(1);
    expect(body.projects[0].title).toBe("Published");
  });

  it("returns empty list when no published projects", async () => {
    await seedProject(app, { published: false });

    const res = await app.request("/api/projects");
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      projects: unknown[];
    };
    expect(body.projects).toEqual([]);
  });

  it("orders by sortOrder ascending", async () => {
    await seedProject(app, {
      title: "Second",
      published: true,
      sortOrder: 2,
    });
    await seedProject(app, {
      title: "First",
      published: true,
      sortOrder: 1,
    });

    const res = await app.request("/api/projects");
    const body = (await res.json()) as {
      projects: { title: string }[];
    };
    expect(body.projects[0].title).toBe("First");
    expect(body.projects[1].title).toBe("Second");
  });
});

describe("GET /api/projects/:slug", () => {
  let db: TestDatabase;
  let app: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    db = createTestDb();
    app = createTestApp(db);
  });

  it("returns a published project by slug", async () => {
    await seedProject(app, {
      title: "My Project",
      slug: "my-project",
      published: true,
    });

    const res = await app.request("/api/projects/my-project");
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      project: { title: string; slug: string };
    };
    expect(body.project.title).toBe("My Project");
    expect(body.project.slug).toBe("my-project");
  });

  it("returns 404 for unpublished project", async () => {
    await seedProject(app, {
      slug: "draft-project",
      published: false,
    });

    const res = await app.request("/api/projects/draft-project");
    expect(res.status).toBe(404);
  });

  it("returns 404 for non-existent slug", async () => {
    const res = await app.request("/api/projects/does-not-exist");
    expect(res.status).toBe(404);
  });
});
