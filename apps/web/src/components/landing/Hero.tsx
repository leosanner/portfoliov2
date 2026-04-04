export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-24 pb-20 lg:pt-40 lg:pb-32"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(168,240,200,0.04) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="font-headline text-5xl leading-[1.08] font-extrabold tracking-tight text-on-surface lg:text-7xl">
          Building Digital <span className="text-primary">Experiences</span>
        </h1>

        <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant lg:text-xl">
          Full-stack developer crafting performant, elegant web applications on
          the modern cloud.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-full bg-primary-container px-7 py-3 font-label text-sm font-bold text-on-surface transition-all duration-300 ease-out hover:scale-[1.06] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(26,154,90,0.4)]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-outline-variant px-7 py-3 font-label text-sm font-bold text-on-surface-variant transition-all duration-300 ease-out hover:border-primary hover:text-primary hover:bg-primary-container/10 hover:shadow-[0_0_15px_rgba(26,154,90,0.2)]"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
