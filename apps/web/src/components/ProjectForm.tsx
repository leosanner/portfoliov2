import { useState } from "react";

interface ProjectFormData {
  title: string;
  description: string;
  youtubeUrl: string;
  githubUrl: string;
  techStack: string[];
  content: string;
  published: boolean;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void | Promise<void>;
  isSubmitting?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  content?: string;
}

const fieldWrap = "flex flex-col gap-2";
const labelClass =
  "font-label text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface-variant";
const inputClass =
  "w-full rounded-lg border border-outline-variant/40 bg-surface-container-low/60 px-4 py-2.5 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 transition-colors focus:border-primary/60 focus:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20";
const errorClass = "font-body text-xs text-danger";
const hintClass = "font-body text-xs text-on-surface-variant/70";

export function ProjectForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
}: ProjectFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl ?? "");
  const [techStackStr, setTechStackStr] = useState(
    initialData?.techStack?.join(", ") ?? "",
  );
  const [content, setContent] = useState(initialData?.content ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!description.trim()) errs.description = "Description is required";
    if (!content.trim()) errs.content = "Content is required";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const techStack = techStackStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title,
      description,
      youtubeUrl,
      githubUrl,
      techStack,
      content,
      published,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={fieldWrap}>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="My amazing project"
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      <div className={fieldWrap}>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="A short summary that will appear on the card."
        />
        {errors.description && (
          <p className={errorClass}>{errors.description}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className={fieldWrap}>
          <label htmlFor="youtubeUrl" className={labelClass}>
            YouTube URL
          </label>
          <input
            id="youtubeUrl"
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className={inputClass}
            placeholder="https://youtube.com/..."
          />
        </div>

        <div className={fieldWrap}>
          <label htmlFor="githubUrl" className={labelClass}>
            GitHub URL
          </label>
          <input
            id="githubUrl"
            type="text"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className={inputClass}
            placeholder="https://github.com/..."
          />
        </div>
      </div>

      <div className={fieldWrap}>
        <label htmlFor="techStack" className={labelClass}>
          Tech Stack
        </label>
        <input
          id="techStack"
          type="text"
          value={techStackStr}
          onChange={(e) => setTechStackStr(e.target.value)}
          placeholder="React, TypeScript, Node.js"
          className={inputClass}
        />
        <p className={hintClass}>Comma-separated</p>
      </div>

      <div className={fieldWrap}>
        <label htmlFor="content" className={labelClass}>
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className={`${inputClass} font-mono text-[13px] leading-relaxed`}
          placeholder="# Markdown content..."
        />
        {errors.content && <p className={errorClass}>{errors.content}</p>}
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-low/40 px-4 py-3 transition-colors hover:bg-surface-container-low/60">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        <div>
          <div className="font-label text-xs font-medium uppercase tracking-[0.16em] text-on-surface">
            Published
          </div>
          <div className="font-body text-xs text-on-surface-variant">
            Visible to visitors on the public portfolio.
          </div>
        </div>
      </label>

      <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-label text-sm font-medium text-background transition-all duration-200 hover:bg-primary-container hover:shadow-[0_0_24px_-4px_var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Project"
              : "Update Project"}
        </button>
      </div>
    </form>
  );
}
