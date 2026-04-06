import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../../lib/api";
import { AdminLayout } from "../../components/AdminLayout";
import { ConfirmDialog } from "../../components/ConfirmDialog";

interface Project {
  id: string;
  title: string;
  published: boolean;
}

export function ProjectsListPage() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (api as any).api.admin.projects.$get();
      const data = await res.json();
      return data.projects as Project[];
    },
  });

  async function handleDelete() {
    if (!deleteTarget) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (api as any).api.admin.projects[":id"].$delete({
      param: { id: deleteTarget.id },
    });
    setDeleteTarget(null);
    queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
  }

  return (
    <AdminLayout>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-2 font-label text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
            Workspace
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            Projects
          </h1>
          <p className="mt-2 max-w-xl font-body text-sm text-on-surface-variant">
            Manage your portfolio entries — create, edit, and publish the work
            you want the world to see.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-label text-sm font-medium text-background shadow-[0_0_0_1px_var(--color-primary)] transition-all duration-200 hover:bg-primary-container hover:shadow-[0_0_24px_-4px_var(--color-primary)]"
        >
          <Plus className="h-4 w-4" />
          New project
        </Link>
      </header>

      {isLoading && (
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-10 text-center">
          <p className="font-body text-sm text-on-surface-variant">
            Loading...
          </p>
        </div>
      )}

      {!isLoading && projects && projects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-low/30 p-16 text-center">
          <p className="font-headline text-lg font-bold text-on-surface">
            No projects yet.
          </p>
          <p className="mt-2 font-body text-sm text-on-surface-variant">
            Start by creating your first project.
          </p>
          <Link
            href="/admin/projects/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 font-label text-xs font-medium uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Create project
          </Link>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low/30 backdrop-blur-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/60">
                <th className="px-6 py-4 text-left font-label text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                  Title
                </th>
                <th className="px-6 py-4 text-left font-label text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-label text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="group transition-colors hover:bg-surface-container-low/60"
                >
                  <td className="px-6 py-4 font-body text-sm font-medium text-on-surface">
                    {project.title}
                  </td>
                  <td className="px-6 py-4">
                    {project.published ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-label text-[10px] font-medium uppercase tracking-[0.14em] text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/40 bg-surface-container-high/60 px-2.5 py-1 font-label text-[10px] font-medium uppercase tracking-[0.14em] text-on-surface-variant">
                        <span className="h-1.5 w-1.5 rounded-full bg-on-surface-variant/60" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-label text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            id: project.id,
                            title: project.title,
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-label text-xs font-medium text-on-surface-variant transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
