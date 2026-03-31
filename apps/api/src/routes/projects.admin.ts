import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { createProjectSchema, updateProjectSchema } from "@portfolio/shared";
import { project } from "../db/schema";
import { slugify } from "../lib/slugify";
import type { Database } from "../db";

type Vars = { db: Database };

function getDb(c: { var: Vars }): Database {
  return c.var.db;
}

export const adminProjectRoutes = new Hono<{ Variables: Vars }>()
  .post("/projects", async (c) => {
    const body = await c.req.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        { error: "Validation failed", details: parsed.error.issues },
        400,
      );
    }

    const data = parsed.data;
    const db = getDb(c);
    const now = new Date();
    const id = crypto.randomUUID();
    const slug = data.slug || slugify(data.title);

    try {
      await db.insert(project).values({
        id,
        title: data.title,
        slug,
        description: data.description,
        content: data.content,
        youtubeUrl: data.youtubeUrl ?? null,
        githubUrl: data.githubUrl ?? null,
        techStack: data.techStack,
        published: data.published,
        sortOrder: data.sortOrder,
        createdAt: now,
        updatedAt: now,
      });
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("UNIQUE constraint failed")
      ) {
        return c.json(
          { error: "A project with this slug already exists" },
          409,
        );
      }
      throw err;
    }

    const created = await db
      .select()
      .from(project)
      .where(eq(project.id, id))
      .get();
    return c.json({ project: created }, 201);
  })
  .get("/projects", async (c) => {
    const db = getDb(c);
    const projects = await db.select().from(project).all();
    return c.json({ projects });
  })
  .get("/projects/:id", async (c) => {
    const db = getDb(c);
    const found = await db
      .select()
      .from(project)
      .where(eq(project.id, c.req.param("id")))
      .get();

    if (!found) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ project: found });
  })
  .put("/projects/:id", async (c) => {
    const body = await c.req.json();
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        { error: "Validation failed", details: parsed.error.issues },
        400,
      );
    }

    const db = getDb(c);
    const id = c.req.param("id");
    const existing = await db
      .select()
      .from(project)
      .where(eq(project.id, id))
      .get();

    if (!existing) {
      return c.json({ error: "Project not found" }, 404);
    }

    const data = parsed.data;
    await db
      .update(project)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(project.id, id));

    const updated = await db
      .select()
      .from(project)
      .where(eq(project.id, id))
      .get();
    return c.json({ project: updated });
  })
  .delete("/projects/:id", async (c) => {
    const db = getDb(c);
    const id = c.req.param("id");
    const existing = await db
      .select()
      .from(project)
      .where(eq(project.id, id))
      .get();

    if (!existing) {
      return c.json({ error: "Project not found" }, 404);
    }

    await db.delete(project).where(eq(project.id, id));
    return c.json({ success: true });
  });
