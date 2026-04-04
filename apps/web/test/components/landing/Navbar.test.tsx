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
    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
      "href",
      "#about",
    );
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("has a CTA button", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("link", { name: /get in touch/i }),
    ).toBeInTheDocument();
  });

  describe("hover animations", () => {
    it("nav links have transition and underline animation classes", () => {
      render(<Navbar />);
      const link = screen.getByRole("link", { name: /projects/i });
      expect(link).toHaveClass(
        "relative",
        "transition-all",
        "duration-300",
        "ease-out",
      );
      expect(link).toHaveClass("nav-link-underline");
    });

    it("CTA button has scale, lift and glow hover classes", () => {
      render(<Navbar />);
      const cta = screen.getByRole("link", { name: /get in touch/i });
      expect(cta).toHaveClass("transition-all", "duration-300", "ease-out");
      expect(cta.className).toContain("hover:scale-105");
      expect(cta.className).toContain("hover:-translate-y-0.5");
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
