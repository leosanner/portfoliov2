import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { AdminLayout } from "../../components/AdminLayout";
import { ProjectForm } from "../../components/ProjectForm";

interface ProjectFormData {
  title: string;
  description: string;
  youtubeUrl: string;
  githubUrl: string;
  techStack: string[];
  content: string;
  published: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  youtubeUrl: string | null;
  githubUrl: string | null;
  techStack: string[];
  published: boolean;
}

export function EditProjectPage({ id }: { id: string }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const query = useQuery<
    { status: "ok"; project: Project } | { status: "not-found" }
  >({
    queryKey: ["admin", "projects", id],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (api as any).api.admin.projects[":id"].$get({
        param: { id },
      });
      if (res.status === 404) {
        return { status: "not-found" as const };
      }
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      const body = (await res.json()) as { project: Project };
      return { status: "ok" as const, project: body.project };
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ProjectFormData) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (api as any).api.admin.projects[":id"].$put({
        param: { id },
        json: {
          title: values.title,
          description: values.description,
          content: values.content,
          youtubeUrl: values.youtubeUrl || null,
          githubUrl: values.githubUrl || null,
          techStack: values.techStack,
          published: values.published,
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}) as { error?: string });
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      setLocation("/admin/projects");
    },
    onError: (err: Error) => {
      setSubmitError(err.message);
    },
  });

  if (query.isLoading) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-10 text-center">
          <p className="font-body text-sm text-on-surface-variant">
            Loading...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (!query.data || query.data.status === "not-found") {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-low/30 p-16 text-center">
          <p className="font-headline text-lg font-bold text-on-surface">
            Project not found.
          </p>
          <Link
            href="/admin/projects"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 font-label text-xs font-medium uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/10"
          >
            Back to projects
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const project = query.data.project;

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <header className="mb-10">
          <div className="mb-2 font-label text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
            Edit
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            {project.title}
          </h1>
          <p className="mt-2 font-body text-sm text-on-surface-variant">
            Update the fields below and save to apply your changes.
          </p>
        </header>

        {submitError && (
          <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 font-body text-sm text-danger">
            {submitError}
          </div>
        )}

        <ProjectForm
          mode="edit"
          initialData={{
            title: project.title,
            description: project.description,
            content: project.content,
            youtubeUrl: project.youtubeUrl ?? "",
            githubUrl: project.githubUrl ?? "",
            techStack: project.techStack,
            published: project.published,
          }}
          onSubmit={(values) => {
            setSubmitError(null);
            mutation.mutate(values);
          }}
          isSubmitting={mutation.isPending}
        />
      </div>
    </AdminLayout>
  );
}
