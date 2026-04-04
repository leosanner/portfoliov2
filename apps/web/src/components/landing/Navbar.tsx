const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/20 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <span className="font-headline text-lg font-bold tracking-tight text-on-surface">
          Leonardo Sanner
        </span>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-label text-sm tracking-wide text-on-surface-variant transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="rounded-full bg-primary-container px-5 py-2 font-label text-sm font-bold text-on-surface transition-colors hover:bg-primary-container/80"
        >
          Get in touch
        </a>
      </div>
    </nav>
  );
}
