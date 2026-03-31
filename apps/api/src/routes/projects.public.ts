import { Hono } from "hono";
import { eq, asc, and } from "drizzle-orm";
import { project } from "../db/schema";
import type { Database } from "../db";

type Vars = { db: Database };

function getDb(c: { var: Vars }): Database {
  return c.var.db;
}

export const publicProjectRoutes = new Hono<{ Variables: Vars }>()
  .get("/projects", async (c) => {
    const db = getDb(c);
    const projects = await db
      .select()
      .from(project)
      .where(eq(project.published, true))
      .orderBy(asc(project.sortOrder))
      .all();
    return c.json({ projects });
  })
  .get("/projects/:slug", async (c) => {
    const db = getDb(c);
    const found = await db
      .select()
      .from(project)
      .where(
        and(eq(project.slug, c.req.param("slug")), eq(project.published, true)),
      )
      .get();

    if (!found) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ project: found });
  });
