import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { memoryLocation } from "wouter/memory-location";
import { Router } from "wouter";

import { App } from "../src/App";

describe("App", () => {
  it("renders the heading", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { hook } = memoryLocation({ path: "/", static: true });
    render(
      <QueryClientProvider client={queryClient}>
        <Router hook={hook}>
          <App />
        </Router>
      </QueryClientProvider>,
    );
    const heading = await screen.findByRole("heading", { level: 1 });
    expect(heading.textContent).toMatch(/construindo/i);
  });
});
