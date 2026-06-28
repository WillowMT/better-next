import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "bun:test";

const appDir = resolve(import.meta.dir, "../../app");

describe("App Router route state files", () => {
  test("provides global loading and error boundaries", () => {
    expect(existsSync(resolve(appDir, "loading.tsx"))).toBe(true);
    expect(existsSync(resolve(appDir, "error.tsx"))).toBe(true);
  });

  test("provides protected route loading states", () => {
    expect(existsSync(resolve(appDir, "dashboard/loading.tsx"))).toBe(true);
    expect(existsSync(resolve(appDir, "private/loading.tsx"))).toBe(true);
  });
});
