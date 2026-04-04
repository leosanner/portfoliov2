import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "../../../src/components/landing/Hero";

describe("Hero", () => {
  it("renders without crashing", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("displays the headline", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /building digital experiences/i,
    );
  });

  it("displays a subtitle paragraph", () => {
    render(<Hero />);
    expect(screen.getByText(/full-stack/i)).toBeInTheDocument();
  });

  it("has two CTA links", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: /view projects/i }),
    ).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("link", { name: /contact me/i })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  describe("hover animations", () => {
    it("primary CTA has scale, lift and glow hover classes", () => {
      render(<Hero />);
      const cta = screen.getByRole("link", { name: /view projects/i });
      expect(cta).toHaveClass("transition-all", "duration-300", "ease-out");
      expect(cta.className).toContain("hover:scale-[1.06]");
      expect(cta.className).toContain("hover:-translate-y-1");
    });

    it("secondary CTA has fill, border glow and shadow hover classes", () => {
      render(<Hero />);
      const cta = screen.getByRole("link", { name: /contact me/i });
      expect(cta).toHaveClass("transition-all", "duration-300", "ease-out");
      expect(cta.className).toContain("hover:border-primary");
      expect(cta.className).toContain("hover:bg-primary-container/10");
    });
  });
});
