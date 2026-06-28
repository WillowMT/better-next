import { describe, expect, test } from "bun:test";
import { getSafeRedirectPath } from "@/lib/safe-redirect";

describe("getSafeRedirectPath", () => {
  test("returns fallback for null, empty, and unsafe paths", () => {
    expect(getSafeRedirectPath(null)).toBe("/dashboard");
    expect(getSafeRedirectPath("")).toBe("/dashboard");
    expect(getSafeRedirectPath("//evil.com")).toBe("/dashboard");
    expect(getSafeRedirectPath("https://evil.com")).toBe("/dashboard");
    expect(getSafeRedirectPath("dashboard")).toBe("/dashboard");
  });

  test("allows same-origin relative paths", () => {
    expect(getSafeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(getSafeRedirectPath("/private")).toBe("/private");
    expect(getSafeRedirectPath("/sign-in?next=/dashboard")).toBe(
      "/sign-in?next=/dashboard",
    );
  });

  test("supports custom fallback", () => {
    expect(getSafeRedirectPath(null, "/sign-in")).toBe("/sign-in");
    expect(getSafeRedirectPath("//evil.com", "/home")).toBe("/home");
  });
});
