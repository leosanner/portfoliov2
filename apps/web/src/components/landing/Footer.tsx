import { Link } from "wouter";

const sitemap = [
  { label: "Início", href: "#hero", route: false },
  { label: "Projetos", href: "/projects", route: true },
  { label: "Sobre", href: "#about", route: false },
  { label: "Contato", href: "#contact", route: false },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-auto w-full">
      {/* Subtle hairline separator */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px w-full bg-linear-to-r from-transparent via-outline-variant/40 to-transparent" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-6 md:flex-row md:justify-between md:gap-8">
        {/* Signature */}
        <Link
          href="/"
          className="font-label text-[11px] uppercase tracking-[0.25em] text-outline transition-colors duration-300 hover:text-on-surface"
        >
          Leonardo Sanner
        </Link>

        {/* Sitemap */}
        <nav
          aria-label="Sitemap"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {sitemap.map((item) =>
            item.route ? (
              <Link
                key={item.label}
                href={item.href}
                className="nav-link-underline relative font-label text-[11px] uppercase tracking-[0.2em] text-outline transition-colors duration-300 hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="nav-link-underline relative font-label text-[11px] uppercase tracking-[0.2em] text-outline transition-colors duration-300 hover:text-primary"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        {/* Copyright */}
        <span className="font-label text-[11px] tracking-widest text-outline/60">
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
