import "../dom-setup";
import { afterEach, describe, expect, test } from "bun:test";
import {
  applyTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  themeStorageKey,
} from "@/lib/theme";

describe("theme helpers", () => {
  afterEach(() => {
    localStorage.removeItem(themeStorageKey);
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  });

  test("resolveTheme returns explicit light and dark themes", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });

  test("resolveTheme uses system preference when theme is system", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query.includes("dark"),
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    });

    expect(resolveTheme("system")).toBe("dark");
  });

  test("readStoredTheme defaults to system for missing or invalid values", () => {
    expect(readStoredTheme()).toBe("system");

    localStorage.setItem(themeStorageKey, "invalid");
    expect(readStoredTheme()).toBe("system");
  });

  test("storeTheme and readStoredTheme round-trip valid themes", () => {
    storeTheme("dark");
    expect(readStoredTheme()).toBe("dark");

    storeTheme("light");
    expect(readStoredTheme()).toBe("light");

    storeTheme("system");
    expect(readStoredTheme()).toBe("system");
  });

  test("applyTheme toggles document class and color-scheme", () => {
    applyTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");

    applyTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("light");
  });
});
