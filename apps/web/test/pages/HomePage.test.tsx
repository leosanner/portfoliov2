import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomePage } from "../../src/pages/HomePage";

describe("HomePage", () => {
  it("renders the navbar", () => {
    render(<HomePage />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders the hero heading", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /construindo experiências/i,
    );
  });

  it("renders the hero CTA links", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("link", { name: /ver projetos/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /fale comigo/i }),
    ).toBeInTheDocument();
  });
});
