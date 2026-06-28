import "../setup";
import { describe, expect, test } from "bun:test";
import { auth } from "@/lib/auth";
import { createSessionCookie, sessionHeaders } from "../helpers/auth";

describe("auth configuration", () => {
  test("auth instance exposes email and password provider", () => {
    expect(auth.options.emailAndPassword?.enabled).toBe(true);
  });

  test("session cookie is issued on sign up", async () => {
    const { cookie, email } = await createSessionCookie({
      name: "Cookie Issuance User",
    });

    expect(cookie.startsWith("better-auth.session_token=")).toBe(true);

    const session = await auth.api.getSession({
      headers: sessionHeaders(cookie),
    });

    expect(session?.user.email).toBe(email);
  });
});

describe("environment configuration", () => {
  test("required auth environment variables are present", () => {
    expect(process.env.BETTER_AUTH_SECRET).toBeTruthy();
    expect(process.env.BETTER_AUTH_URL).toBeTruthy();
    expect(process.env.DATABASE_URL).toBeTruthy();
  });

  test("BETTER_AUTH_URL is a valid URL without inline comments", () => {
    const url = process.env.BETTER_AUTH_URL ?? "";

    expect(() => new URL(url)).not.toThrow();
    expect(url).not.toContain("#");
  });
});
