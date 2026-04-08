import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  youtubeUrl?: string | null;
  githubUrl?: string | null;
}

export function getYoutubeThumbnail(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
}

export function ProjectCard({
  slug,
  title,
  description,
  techStack,
  youtubeUrl,
  githubUrl,
}: ProjectCardProps) {
  const thumbnail = getYoutubeThumbnail(youtubeUrl);

  return (
    <div className="group relative h-115 w-full [perspective:2000px]">
      <div
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d] transition-transform duration-700 ease-out",
          "group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]",
        )}
      >
        {/* FRONT — 16:9 thumbnail on top, title panel below */}
        <Link
          href={`/projects/${slug}`}
          className={cn(
            "absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-3xl",
            "[transform:rotateY(0deg)] [backface-visibility:hidden]",
            "border border-outline-variant/40 bg-surface-container-low",
            "shadow-lg shadow-black/30",
            "transition-shadow duration-700 group-hover:shadow-xl group-hover:shadow-black/50",
          )}
        >
          {/* Thumbnail region — strict 16:9, no text overlay */}
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-surface-container-low to-surface-container-low" />
            )}

            {/* Subtle bottom fade into the title panel */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-container-low to-transparent" />
          </div>

          {/* Title panel — below thumbnail, no overlap */}
          <div className="relative flex flex-1 flex-col justify-between p-7">
            <h3 className="font-headline text-2xl font-bold leading-tight tracking-tight text-on-surface transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
              {title}
            </h3>
            <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-on-surface-variant transition-opacity duration-500 group-hover:opacity-0">
              {description}
            </p>
          </div>

          {/* Hover glow border */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-1 ring-primary/40 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        {/* BACK — description, tech stack, links */}
        <div
          className={cn(
            "absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-3xl",
            "[transform:rotateY(180deg)] [backface-visibility:hidden]",
            "border border-outline-variant/40 bg-surface-container-low",
            "shadow-lg shadow-black/30",
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

          {/* Body — only stack + github */}
          <div className="relative z-10 flex flex-1 flex-col gap-6 p-7">
            <div>
              <div className="mb-3 font-label text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
                Stack
              </div>
              {techStack.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-label text-[10px] font-medium uppercase tracking-[0.14em] text-primary"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-body text-xs text-on-surface-variant/70">
                  Stack a definir
                </p>
              )}
            </div>

            <div className="mt-auto flex items-center gap-2 border-t border-outline-variant/30 pt-4">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 px-4 py-2.5 font-label text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant transition-all duration-300 hover:border-primary/50 hover:text-primary"
                  aria-label={`GitHub do projeto ${title}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.07.78 2.16v3.2c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
                  </svg>
                  Ver repositório
                </a>
              )}
              <Link
                href={`/projects/${slug}`}
                className="group/cta ml-auto flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-label text-xs font-medium uppercase tracking-[0.18em] text-background transition-all duration-300 hover:shadow-lg hover:shadow-primary/40"
              >
                Ver projeto
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Hover glow border */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-1 ring-primary/40 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
}
