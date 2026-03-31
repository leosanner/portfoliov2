import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().min(1).max(500),
  content: z.string().min(1),
  youtubeUrl: z.string().url().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  techStack: z.array(z.string().min(1)).default([]),
  published: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
