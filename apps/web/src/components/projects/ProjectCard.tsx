import { Link } from "wouter";

export interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  youtubeUrl?: string | null;
}

export function getYoutubeThumbnail(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}

export function ProjectCard({
  slug,
  title,
  description,
  techStack,
  youtubeUrl,
}: ProjectCardProps) {
  const thumbnail = getYoutubeThumbnail(youtubeUrl);

  return (
    <Link
      href={`/projects/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_32px_-8px_var(--color-primary)]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-surface-container-high/60">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-label text-xs uppercase tracking-[0.18em] text-on-surface-variant/60">
            Sem capa
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface group-hover:text-primary">
          {title}
        </h3>
        <p className="line-clamp-3 font-body text-sm text-on-surface-variant">
          {description}
        </p>
        {techStack.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2 pt-2">
            {techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-label text-[10px] font-medium uppercase tracking-[0.14em] text-primary"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
