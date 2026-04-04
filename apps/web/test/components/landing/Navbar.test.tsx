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
});
