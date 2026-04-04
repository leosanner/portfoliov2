import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";

export function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
      </main>
    </>
  );
}
