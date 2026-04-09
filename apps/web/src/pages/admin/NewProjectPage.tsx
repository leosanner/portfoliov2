import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export function NewProjectPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (values: ProjectFormData) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (api as any).api.admin.projects.$post({
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

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <header className="mb-10">
          <div className="mb-2 font-label text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
            Create
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            New Project
          </h1>
          <p className="mt-2 font-body text-sm text-on-surface-variant">
            Fill in the details below. Save as draft or publish immediately.
          </p>
        </header>

        {submitError && (
          <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 font-body text-sm text-danger">
            {submitError}
          </div>
        )}

        <ProjectForm
          mode="create"
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
