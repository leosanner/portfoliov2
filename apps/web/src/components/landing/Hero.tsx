import { LayoutGroup, motion } from "framer-motion";
import { CartoonButton } from "./CartoonButton";
import { FloatingPaths } from "./FloatingPaths";
import { TextRotate } from "../ui/text-rotate";

export function Hero() {
  return (
    <section
      id="hero"
      className="snap-section relative items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-x-0 top-[35%] bottom-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
        <LayoutGroup>
          <motion.h1
            className="font-headline text-3xl leading-[1.08] font-extrabold tracking-tight text-on-surface sm:text-5xl lg:text-7xl flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4"
            layout
          >
            <motion.span
              layout
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
            >
              Construindo
            </motion.span>
            <TextRotate
              texts={["experiências", "inovação", "soluções", "impacto"]}
              mainClassName="text-background px-2 lg:px-3 bg-primary overflow-hidden py-0.5 lg:py-1 justify-center rounded-md"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 lg:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2500}
            />
          </motion.h1>
        </LayoutGroup>

        <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-on-surface-variant sm:mt-6 sm:text-base lg:text-lg">
          Aplicações web, APIs e automações sob medida para transformar ideias
          em produtos digitais rápidos, sólidos e prontos para evoluir.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-4">
          <CartoonButton label="Ver Projetos" href="#projects" />
          <CartoonButton
            label="Fale Comigo"
            href="#contact"
            variant="outline"
          />
        </div>
      </div>
    </section>
  );
}
