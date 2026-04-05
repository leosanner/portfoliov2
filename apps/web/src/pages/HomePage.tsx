import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { FeaturedProjects } from "../components/landing/FeaturedProjects";

export function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProjects />
      </main>
    </>
  );
}
