import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUpRight,
  BarChart3,
  FolderKanban,
  LogOut,
  Plus,
} from "lucide-react";
import { authClient } from "../lib/auth";
import { ThemeToggle } from "./ThemeToggle";

function NavItem({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 font-body text-sm transition-all duration-200 ${
        active
          ? "bg-surface-container-high text-on-surface"
          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-all duration-300 ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
        }`}
      />
      <span
        className={`flex h-4 w-4 items-center justify-center transition-colors ${
          active
            ? "text-primary"
            : "text-on-surface-variant group-hover:text-on-surface"
        }`}
      >
        {icon}
      </span>
      {children}
    </Link>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 pb-1 font-label text-[10px] font-medium uppercase tracking-[0.18em] text-on-surface-variant/70">
      {children}
    </div>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [location] = useLocation();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-body text-sm text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isProjects = location.startsWith("/admin/projects");
  const isAnalytics = location.startsWith("/admin/analytics");

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <nav
        aria-label="Admin navigation"
        className="flex w-64 flex-col border-r border-outline-variant/20 bg-surface-container-low/40 px-4 py-6 backdrop-blur-sm"
      >
        <div className="mb-10 flex items-center justify-between px-2">
          <Link
            href="/admin"
            className="logo-fill font-headline text-base font-bold tracking-tight"
          >
            Leonardo
          </Link>
          <span className="font-label text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
            Admin
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-1">
            <SectionLabel>Projects</SectionLabel>
            <NavItem
              href="/admin/projects"
              active={isProjects}
              icon={<FolderKanban className="h-4 w-4" />}
            >
              All projects
            </NavItem>
            <NavItem
              href="/admin/projects/new"
              active={false}
              icon={<Plus className="h-4 w-4" />}
            >
              New project
            </NavItem>
          </div>

          <div className="flex flex-col gap-1">
            <SectionLabel>Analytics</SectionLabel>
            <NavItem
              href="/admin/analytics"
              active={isAnalytics}
              icon={<BarChart3 className="h-4 w-4" />}
            >
              Overview
            </NavItem>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-outline-variant/20 pt-4">
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="font-label text-[10px] font-medium uppercase tracking-[0.18em] text-on-surface-variant/70">
              Theme
            </span>
            <ThemeToggle />
          </div>

          <Link
            href="/"
            className="flex items-center justify-between rounded-lg px-3 py-2 font-body text-sm text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            Back to site
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => authClient.signOut()}
            className="flex items-center justify-between rounded-lg px-3 py-2 font-body text-sm text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            Logout
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </nav>

      <main className="relative flex-1 overflow-x-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-outline-variant/40 to-transparent" />
        <div className="mx-auto max-w-6xl px-10 py-10">{children}</div>
      </main>
    </div>
  );
}
