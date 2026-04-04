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
});
