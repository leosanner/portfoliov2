import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.api.projects.$get();
      const data = await res.json();
      return data.projects;
    },
  });
}

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ["projects", slug],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Hono RPC dynamic param access
      const res = await (api.api.projects as Record<string, any>)[":slug"].$get(
        {
          param: { slug },
        },
      );
      const data = await res.json();
      return data.project;
    },
    enabled: !!slug,
  });
}
