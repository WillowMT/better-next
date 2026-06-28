import "../setup";
import { describe, expect, test } from "bun:test";
import { auth } from "@/lib/auth";

function uniqueEmail() {
  return `test-${crypto.randomUUID()}@example.com`;
}

describe("auth api", () => {
  test("signUpEmail creates a user", async () => {
    const email = uniqueEmail();
    const password = "password123";

    const result = await auth.api.signUpEmail({
      body: {
        name: "Test User",
        email,
        password,
      },
    });

    expect(result.user.email).toBe(email);
    expect(result.user.name).toBe("Test User");
    expect(result.token).toBeDefined();
  });

  test("signInEmail returns a session for an existing user", async () => {
    const email = uniqueEmail();
    const password = "password123";

    await auth.api.signUpEmail({
      body: {
        name: "Sign In User",
        email,
        password,
      },
    });

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    expect(result.user.email).toBe(email);
    expect(result.token).toBeDefined();
  });

  test("signInEmail rejects invalid credentials", async () => {
    const email = uniqueEmail();
    const password = "password123";

    await auth.api.signUpEmail({
      body: {
        name: "Invalid Login User",
        email,
        password,
      },
    });

    await expect(
      auth.api.signInEmail({
        body: {
          email,
          password: "wrong-password",
        },
      }),
    ).rejects.toThrow();
  });
});
