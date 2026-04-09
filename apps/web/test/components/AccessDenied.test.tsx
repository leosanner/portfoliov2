import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("../../src/lib/auth", () => ({
  authClient: {
    signOut: vi.fn(),
  },
}));

import { authClient } from "../../src/lib/auth";
import { AccessDenied } from "../../src/components/AccessDenied";

const signOutMock = vi.mocked(authClient.signOut);

describe("AccessDenied", () => {
  beforeEach(() => {
    signOutMock.mockReset();
    signOutMock.mockResolvedValue(undefined);
  });

  it("renders an access-denied message", () => {
    render(<AccessDenied />);
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it("calls authClient.signOut on mount", async () => {
    render(<AccessDenied />);
    await waitFor(() => expect(signOutMock).toHaveBeenCalledTimes(1));
  });
});
