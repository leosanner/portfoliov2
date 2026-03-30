import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { memoryLocation } from "wouter/memory-location";
import { Router } from "wouter";
import { App } from "../src/App";

function renderAtPath(path: string) {
  const { hook } = memoryLocation({ path, static: true });
  return render(
    <Router hook={hook}>
      <App />
    </Router>,
  );
}

describe("Router", () => {
  it("renders home page at /", () => {
    renderAtPath("/");
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });

  it("renders project page at /projects/:slug", () => {
    renderAtPath("/projects/my-project");
    expect(screen.getByText(/project/i)).toBeInTheDocument();
  });

  it("renders login page at /login", () => {
    renderAtPath("/login");
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it("renders admin dashboard at /admin", () => {
    renderAtPath("/admin");
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it("renders not found for unknown routes", () => {
    renderAtPath("/unknown-route");
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
