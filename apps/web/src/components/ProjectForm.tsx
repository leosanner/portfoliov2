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
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="youtubeUrl" className="mb-1 block text-sm font-medium">
          YouTube URL
        </label>
        <input
          id="youtubeUrl"
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="githubUrl" className="mb-1 block text-sm font-medium">
          GitHub URL
        </label>
        <input
          id="githubUrl"
          type="text"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="techStack" className="mb-1 block text-sm font-medium">
          Tech Stack
        </label>
        <input
          id="techStack"
          type="text"
          value={techStackStr}
          onChange={(e) => setTechStackStr(e.target.value)}
          placeholder="React, TypeScript, Node.js"
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        <p className="mt-1 text-xs text-gray-500">Comma-separated</p>
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm"
          placeholder="Markdown content..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="published" className="text-sm font-medium">
          Published
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {mode === "create" ? "Create Project" : "Update Project"}
      </button>
    </form>
  );
}
