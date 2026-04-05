import { motion } from "framer-motion";

const techStack = [
  {
    category: "Frontend",
    items: ["React", "TypeScript", "Tailwind CSS", "Vite"],
  },
  { category: "Backend", items: ["Hono", "Node.js", "Cloudflare Workers"] },
  { category: "Data", items: ["D1 / SQLite", "Drizzle ORM", "KV Storage"] },
  { category: "Infra", items: ["Cloudflare", "GitHub Actions", "Wrangler"] },
];

const pillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.4 + i * 0.05,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
};

export function About() {
  return (
    <section
      id="about"
      className="snap-section relative flex items-center overflow-hidden"
    >
      {/* Diagonal accent line */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-[1px] w-[60vw] rotate-[-8deg] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        {/* Left — Statement */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="font-label text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Sobre
          </span>

          <h2 className="font-headline mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-on-surface lg:text-5xl">
            Engenheiro de software focado em{" "}
            <span className="text-primary">Cloudflare</span> e na{" "}
            <span className="text-secondary">edge</span>.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-on-surface-variant font-body">
            Construo aplicações full-stack que rodam o mais perto possível do
            usuário. Do banco de dados à interface, tudo na edge — rápido,
            resiliente, e sem servidores tradicionais.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-outline-variant/30" />
            <span className="font-label text-xs tracking-widest text-outline">
              STACK
            </span>
            <div className="h-px flex-1 bg-outline-variant/30" />
          </div>
        </motion.div>

        {/* Right — Tech grid */}
        <motion.div
          className="flex flex-col justify-center gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {techStack.map((group) => (
            <div key={group.category}>
              <span className="font-label mb-2 block text-[11px] font-medium uppercase tracking-[0.25em] text-outline">
                {group.category}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, i) => (
                  <motion.span
                    key={item}
                    custom={i}
                    variants={pillVariants}
                    className="rounded-full border border-outline-variant/50 bg-surface-container px-4 py-1.5 font-label text-sm tracking-wide text-on-surface transition-colors duration-300 hover:border-primary/40 hover:text-primary"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom corner accent */}
      <div
        className="pointer-events-none absolute bottom-12 right-12 h-24 w-24 rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle, var(--color-secondary), transparent 70%)",
        }}
      />
    </section>
  );
}
