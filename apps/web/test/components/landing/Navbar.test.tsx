import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "../../../src/components/landing/Navbar";

describe("Navbar", () => {
  it("renders a nav element", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("displays the logo as a link to the landing page", () => {
    render(<Navbar />);
    const logo = screen.getByRole("link", { name: /leonardo sanner/i });
    expect(logo).toHaveAttribute("href", "/");
  });

  it("contains anchor links for sections", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /projetos/i })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: /sobre/i })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(
      screen.queryByRole("link", { name: /contato/i }),
    ).not.toBeInTheDocument();
  });

  it("has a CTA button with contact text", () => {
    render(<Navbar />);
    const cta = screen.getByRole("button", { name: /fale comigo/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveClass("bg-primary", "border-2", "rounded-full");
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

    it("logo text has color fill animation class", () => {
      render(<Navbar />);
      const logo = screen.getByRole("link", { name: /leonardo sanner/i });
      expect(logo).toHaveClass("logo-fill");
    });
  });
});
