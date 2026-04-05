import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { FeaturedProjects } from "../components/landing/FeaturedProjects";
import { About } from "../components/landing/About";
import { Contact } from "../components/landing/Contact";

export function HomePage() {
  return (
    <>
      <Navbar />
      <main className="snap-container">
        <Hero />
        <FeaturedProjects />
        <About />
        <Contact />
      </main>
    </>
  );
}
