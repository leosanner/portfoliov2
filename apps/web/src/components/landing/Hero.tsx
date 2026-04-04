import { CartoonButton } from "./CartoonButton";
import { FloatingPaths } from "./FloatingPaths";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
        <h1 className="font-headline text-5xl leading-[1.08] font-extrabold tracking-tight text-on-surface lg:text-7xl">
          Construindo <span className="text-primary">experiências</span>
        </h1>

        <div className="mt-16 flex flex-wrap justify-center gap-4">
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
