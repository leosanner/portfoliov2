import { Navbar } from "../components/landing/Navbar";
import { ProjectCard } from "../components/projects/ProjectCard";
import { useProjects } from "../hooks/use-projects";

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <header className="mb-12">
          <div className="mb-2 font-label text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
            Portfólio
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            Projetos
          </h1>
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
            <p className="font-body text-base text-on-surface-variant">
              Projetos ainda não listados, processo em desenvolvimento.
            </p>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="grid gap-10 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                slug={project.slug}
                title={project.title}
                description={project.description}
                techStack={project.techStack ?? []}
                youtubeUrl={project.youtubeUrl}
                githubUrl={project.githubUrl}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
