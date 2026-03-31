import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { AdminLayout } from "../components/AdminLayout";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function AdminDashboard() {
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
      return data.projects;
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
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Link
            href="/admin/projects/new"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            New Project
          </Link>
        </div>

        {isLoading && <p>Loading...</p>}

        {!isLoading && projects && projects.length === 0 && (
          <p className="text-gray-500">No projects yet.</p>
        )}

        {projects && projects.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium">Title</th>
                  <th className="px-4 py-3 text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {projects.map(
                  (project: {
                    id: string;
                    title: string;
                    published: boolean;
                  }) => (
                    <tr key={project.id}>
                      <td className="px-4 py-3">{project.title}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            project.published
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {project.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="mr-2 text-sm text-blue-600 hover:underline"
                        >
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
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ),
                )}
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
      </div>
    </AdminLayout>
  );
}
