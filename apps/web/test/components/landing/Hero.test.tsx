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
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
      /construindo/i,
    );
  });

  it("has two CTA links", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /ver projetos/i })).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByRole("link", { name: /fale comigo/i })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("primary CTA uses CartoonButton with primary variant", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /ver projetos/i });
    expect(cta).toHaveClass("bg-primary", "border-2", "rounded-full");
  });

  it("secondary CTA uses CartoonButton with outline variant", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /fale comigo/i });
    expect(cta.className).toContain("bg-surface-container");
    expect(cta).toHaveClass("border-2", "rounded-full");
  });

  it("CTAs have hover animation classes", () => {
    render(<Hero />);
    const primary = screen.getByRole("link", { name: /ver projetos/i });
    const secondary = screen.getByRole("link", { name: /fale comigo/i });
    expect(primary).toHaveClass("transition-all");
    expect(primary.className).toContain("hover:-translate-y-1");
    expect(secondary).toHaveClass("transition-all");
    expect(secondary.className).toContain("hover:-translate-y-1");
  });
});
