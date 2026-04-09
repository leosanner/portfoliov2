import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartoonButton } from "../../../src/components/landing/CartoonButton";

describe("CartoonButton", () => {
  it("renders as a link when href is provided", () => {
    render(<CartoonButton label="Go" href="#test" />);
    const el = screen.getByRole("link", { name: /go/i });
    expect(el).toHaveAttribute("href", "#test");
    expect(el.tagName).toBe("A");
  });

  it("renders as a button when no href is provided", () => {
    render(<CartoonButton label="Press" />);
    const el = screen.getByRole("button", { name: /press/i });
    expect(el.tagName).toBe("BUTTON");
  });

  it("calls onClick when clicked", () => {
    const fn = vi.fn();
    render(<CartoonButton label="Click" onClick={fn} />);
    fireEvent.click(screen.getByRole("button", { name: /click/i }));
    expect(fn).toHaveBeenCalledOnce();
  });

  it("applies primary variant styles by default", () => {
    render(<CartoonButton label="Primary" href="#x" />);
    const el = screen.getByRole("link", { name: /primary/i });
    expect(el).toHaveClass("bg-primary", "border-2");
  });

  it("applies outline variant styles", () => {
    render(<CartoonButton label="Outline" href="#x" variant="outline" />);
    const el = screen.getByRole("link", { name: /outline/i });
    expect(el.className).toContain("bg-surface-container");
    expect(el).toHaveClass("border-2");
  });

  it("renders the highlight sweep element by default", () => {
    const { container } = render(<CartoonButton label="Shiny" href="#x" />);
    const sweep = container.querySelector("[data-highlight]");
    expect(sweep).toBeInTheDocument();
  });

  it("hides highlight sweep when hasHighlight is false", () => {
    const { container } = render(
      <CartoonButton label="No shine" href="#x" hasHighlight={false} />,
    );
    const sweep = container.querySelector("[data-highlight]");
    expect(sweep).not.toBeInTheDocument();
  });

  it("has hover animation classes", () => {
    render(<CartoonButton label="Hover" href="#x" />);
    const el = screen.getByRole("link", { name: /hover/i });
    expect(el).toHaveClass("transition-all");
    expect(el.className).toContain("hover:-translate-y-1");
  });
});
