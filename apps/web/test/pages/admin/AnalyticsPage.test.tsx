import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import type { ReactNode } from "react";

vi.mock("../../../src/lib/auth", () => ({
  authClient: {
    useSession: vi.fn().mockReturnValue({
      data: { user: { id: "1", name: "Admin" }, session: {} },
      isPending: false,
    }),
    signOut: vi.fn(),
  },
}));

import { AnalyticsPage } from "../../../src/pages/admin/AnalyticsPage";

function createWrapper() {
  const { hook } = memoryLocation({ path: "/admin/analytics", static: true });
  return ({ children }: { children: ReactNode }) => (
    <Router hook={hook}>{children}</Router>
  );
}

describe("AnalyticsPage", () => {
  it("renders analytics heading and coming-soon copy", () => {
    render(<AnalyticsPage />, { wrapper: createWrapper() });

    expect(
      screen.getByRole("heading", { name: /analytics/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/coming soon/i).length).toBeGreaterThan(0);
  });
});
