import { afterEach, describe, expect, test } from "bun:test";
import { getAppUrl } from "@/lib/app-url";

describe("getAppUrl", () => {
  const originalPublic = process.env.NEXT_PUBLIC_APP_URL;
  const originalAuth = process.env.BETTER_AUTH_URL;

  afterEach(() => {
    if (originalPublic === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = originalPublic;
    }

    if (originalAuth === undefined) {
      delete process.env.BETTER_AUTH_URL;
    } else {
      process.env.BETTER_AUTH_URL = originalAuth;
    }
  });

  test("prefers NEXT_PUBLIC_APP_URL", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://app.example.com";
    process.env.BETTER_AUTH_URL = "https://auth.example.com";

    expect(getAppUrl()).toBe("https://app.example.com");
  });

  test("falls back to BETTER_AUTH_URL", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    process.env.BETTER_AUTH_URL = "https://auth.example.com";

    expect(getAppUrl()).toBe("https://auth.example.com");
  });

  test("falls back to localhost", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.BETTER_AUTH_URL;

    expect(getAppUrl()).toBe("http://localhost:3000");
  });
});
