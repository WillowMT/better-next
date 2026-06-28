import { describe, expect, test } from "bun:test";
import { resolveTheme } from "@/lib/theme";

describe("theme helpers", () => {
  test("resolveTheme returns explicit light and dark themes", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });
});
