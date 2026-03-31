import { Link } from "wouter";
import { marked } from "marked";
import { useProjectBySlug } from "../hooks/use-projects";

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  return match ? match[1] : null;
}

export function ProjectPage({ slug }: { slug: string }) {
  const { data: project, isLoading } = useProjectBySlug(slug);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p>Project not found.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          &larr; Back to portfolio
        </Link>
      </div>
    );
  }

  const youtubeId = project.youtubeUrl
    ? extractYouTubeId(project.youtubeUrl)
    : null;

  const renderedContent = project.content
    ? marked.parse(project.content, { async: false })
    : "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-blue-600 hover:underline"
      >
        &larr; Back to portfolio
      </Link>

      <h1 className="mb-4 text-3xl font-bold">{project.title}</h1>

      <p className="mb-6 text-gray-600">{project.description}</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {project.techStack.map((tech: string) => (
          <span
            key={tech}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
          >
            {tech}
          </span>
        ))}
      </div>

      {youtubeId && (
        <div className="mb-6 aspect-video">
          <iframe
            className="h-full w-full rounded-lg"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 inline-block text-blue-600 hover:underline"
        >
          View on GitHub
        </a>
      )}

      {renderedContent && (
        <div
          className="prose mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent as string }}
        />
      )}
    </div>
  );
}
