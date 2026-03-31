import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "../../src/components/ConfirmDialog";

const defaultProps = {
  open: true,
  title: "Delete Project",
  message: "Are you sure? This cannot be undone.",
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};

describe("ConfirmDialog", () => {
  it("does not render when open is false", () => {
    render(<ConfirmDialog {...defaultProps} open={false} />);

    expect(screen.queryByText("Delete Project")).not.toBeInTheDocument();
  });

  it("renders title and message when open", () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByText("Delete Project")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure? This cannot be undone."),
    ).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onCancel when backdrop is clicked", () => {
    const onCancel = vi.fn();

    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    const backdrop = screen.getByTestId("dialog-backdrop");
    fireEvent.click(backdrop);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onCancel when Escape is pressed", () => {
    const onCancel = vi.fn();

    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("applies red styling to confirm button in danger variant", () => {
    render(<ConfirmDialog {...defaultProps} variant="danger" />);

    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    expect(confirmBtn.className).toMatch(/red/);
  });

  it("uses default labels when not provided", () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("uses custom labels when provided", () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmLabel="Delete"
        cancelLabel="Keep"
      />,
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument();
  });

  it("has proper dialog role and aria-modal", () => {
    render(<ConfirmDialog {...defaultProps} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });
});
