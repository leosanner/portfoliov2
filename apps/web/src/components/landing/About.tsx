import { motion } from "framer-motion";

const techStack = [
  {
    category: "AI / ML",
    items: ["Python", "Machine Learning", "Deep Learning", "NLP"],
  },
  {
    category: "Frontend",
    items: ["TypeScript", "React", "Next.js"],
  },
  {
    category: "Backend & Data",
    items: ["Spring Boot", "PostgreSQL", "MongoDB"],
  },
  {
    category: "Cloud & DevOps",
    items: ["Azure", "Cloudflare", "Vercel", "GitHub Actions"],
  },
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
      className="snap-section relative items-center justify-center overflow-x-hidden pt-20 md:pt-0"
    >
      {/* Diagonal accent line */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-[1px] w-[60vw] rotate-[-8deg] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 py-16 md:py-0 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
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

          <h2 className="font-headline mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-on-surface md:text-4xl lg:text-5xl">
            Antes do código, o <span className="text-primary">problema</span>.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-on-surface-variant font-body">
            Há cerca de um ano atuo com desenvolvimento prestando serviço e
            consultoria. Meu foco não está na tecnologia em si, mas em entender
            o problema do cliente e encontrar o caminho mais simples para
            resolvê-lo — a stack vem depois.
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
