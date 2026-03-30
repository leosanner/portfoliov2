import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { memoryLocation } from "wouter/memory-location";
import { Router } from "wouter";
import { App } from "../src/App";

describe("App", () => {
  it("renders the heading", () => {
    const { hook } = memoryLocation({ path: "/", static: true });
    render(
      <Router hook={hook}>
        <App />
      </Router>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Portfolio",
    );
  });
});
