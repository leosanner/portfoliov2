import { describe, it, expect } from "vitest";
import { slugify } from "../../src/lib/slugify";

describe("slugify", () => {
  it("converts basic text to slug", () => {
    expect(slugify("My Project")).toBe("my-project");
  });

  it("handles multiple spaces", () => {
    expect(slugify("My   Cool   Project")).toBe("my-cool-project");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World! #2024")).toBe("hello-world-2024");
  });

  it("handles leading and trailing spaces", () => {
    expect(slugify("  Padded Title  ")).toBe("padded-title");
  });

  it("handles leading and trailing hyphens", () => {
    expect(slugify("--my-project--")).toBe("my-project");
  });

  it("collapses consecutive hyphens", () => {
    expect(slugify("my---project")).toBe("my-project");
  });

  it("converts accented characters", () => {
    expect(slugify("Café Résumé")).toBe("cafe-resume");
  });

  it("handles numbers", () => {
    expect(slugify("Project V2 Beta 3")).toBe("project-v2-beta-3");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("handles string with only special characters", () => {
    expect(slugify("!!!@@@###")).toBe("");
  });
});
