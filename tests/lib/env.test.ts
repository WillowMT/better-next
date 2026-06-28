import { describe, expect, test } from "bun:test";
import {
  getEnv,
  getOptionalEnv,
  normalizeDatabaseUrl,
} from "@/lib/env";

describe("environment helpers", () => {
  test("getEnv returns a configured value", () => {
    expect(getEnv("DATABASE_URL", { DATABASE_URL: "postgres://local" })).toBe(
      "postgres://local",
    );
  });

  test("getEnv throws a readable error for missing required values", () => {
    expect(() => getEnv("BETTER_AUTH_SECRET", {})).toThrow(
      "Missing required environment variable: BETTER_AUTH_SECRET",
    );
  });

  test("getOptionalEnv treats blank strings as unset", () => {
    expect(getOptionalEnv("BLOB_READ_WRITE_TOKEN", { BLOB_READ_WRITE_TOKEN: " " }))
      .toBeUndefined();
  });

  test("normalizeDatabaseUrl preserves current pg SSL semantics explicitly", () => {
    expect(
      normalizeDatabaseUrl(
        "postgres://user:pass@example.com:5432/app?sslmode=require",
      ),
    ).toBe("postgres://user:pass@example.com:5432/app?sslmode=verify-full");
  });

  test("normalizeDatabaseUrl leaves local and explicit SSL URLs unchanged", () => {
    expect(normalizeDatabaseUrl("postgres://postgres:postgres@localhost/app")).toBe(
      "postgres://postgres:postgres@localhost/app",
    );
    expect(
      normalizeDatabaseUrl(
        "postgres://user:pass@example.com/app?sslmode=disable",
      ),
    ).toBe("postgres://user:pass@example.com/app?sslmode=disable");
  });
});
