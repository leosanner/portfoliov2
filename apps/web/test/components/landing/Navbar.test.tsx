import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "../../../src/components/landing/Navbar";

describe("Navbar", () => {
  it("renders a nav element", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("displays the logo text", () => {
    render(<Navbar />);
    expect(screen.getByText("Leonardo Sanner")).toBeInTheDocument();
  });

  it("contains anchor links for sections", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /projetos/i })).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByRole("link", { name: /sobre/i })).toHaveAttribute(
      "href",
      "#about",
    );
    expect(screen.getByRole("link", { name: /contato/i })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("has a CTA button with contact text", () => {
    render(<Navbar />);
    const cta = screen.getByRole("button", { name: /fale comigo/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveClass("bg-primary-container", "border-2", "rounded-full");
  });

  it("shows contact social links", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      "mailto:leosanner.dev@gmail.com",
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/leosanner",
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/leosanner",
    );
  });

  describe("hover animations", () => {
    it("nav links have transition and underline animation classes", () => {
      render(<Navbar />);
      const link = screen.getByRole("link", { name: /projetos/i });
      expect(link).toHaveClass(
        "relative",
        "transition-all",
        "duration-300",
        "ease-out",
      );
      expect(link).toHaveClass("nav-link-underline");
    });

    it("logo text has tracking and color hover transition", () => {
      render(<Navbar />);
      const logo = screen.getByText("Leonardo Sanner");
      expect(logo).toHaveClass("transition-all", "duration-300", "ease-out");
      expect(logo.className).toContain("hover:tracking-normal");
      expect(logo.className).toContain("hover:text-primary");
    });
  });
});
