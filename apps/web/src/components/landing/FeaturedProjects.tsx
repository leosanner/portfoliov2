import { motion } from "framer-motion";
import { Cloud, Database, Globe } from "lucide-react";
import CardFlip from "../ui/flip-card";

const projects = [
  {
    title: "Portfolio v2",
    subtitle: "Site pessoal com painel admin",
    description:
      "Portfolio full-stack com autenticação, painel administrativo, e deploy na edge via Cloudflare Workers e Pages.",
    features: ["Hono + D1", "React + Vite", "Better Auth", "Cloudflare Edge"],
    color: "#27f576",
    icon: <Globe className="h-7 w-7 text-background" />,
    href: "#",
  },
  {
    title: "API Gateway",
    subtitle: "Gateway de APIs distribuído",
    description:
      "API gateway com rate limiting, caching inteligente e observabilidade integrada para microserviços.",
    features: ["Workers", "KV Storage", "Rate Limiting", "Analytics"],
    color: "#7ecbf5",
    icon: <Cloud className="h-7 w-7 text-background" />,
    href: "#",
  },
  {
    title: "Data Pipeline",
    subtitle: "Pipeline de dados em tempo real",
    description:
      "Sistema de ingestão e processamento de dados em tempo real com filas distribuídas e storage durável.",
    features: ["Queues", "Durable Objects", "R2 Storage", "D1 Analytics"],
    color: "#e8c170",
    icon: <Database className="h-7 w-7 text-background" />,
    href: "#",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function FeaturedProjects() {
  return (
    <section id="projects" className="relative py-28 px-6">
      {/* Subtle top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-label text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Projetos em Destaque
          </span>
          <h2 className="font-headline mt-3 text-3xl font-bold tracking-tight text-on-surface lg:text-4xl">
            O que eu tenho construído
          </h2>
          <p className="mt-4 text-on-surface-variant max-w-lg mx-auto">
            Uma seleção dos projetos mais recentes e relevantes do meu
            portfólio.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((project) => (
            <motion.div key={project.title} variants={cardVariants}>
              <CardFlip
                title={project.title}
                subtitle={project.subtitle}
                description={project.description}
                features={project.features}
                color={project.color}
                icon={project.icon}
                href={project.href}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
