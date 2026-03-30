import { Link } from "wouter";
import { useProjects } from "../hooks/use-projects";

export function HomePage() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Portfolio</h1>
        <p>No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Portfolio</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="block rounded-lg border border-gray-200 p-6 transition hover:shadow-md"
          >
            <h2 className="mb-2 text-xl font-semibold">{project.title}</h2>
            <p className="mb-4 text-gray-600">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string) => (
                <span
                  key={tech}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
