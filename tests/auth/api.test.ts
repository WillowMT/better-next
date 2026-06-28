import "../setup";
import { describe, expect, test } from "bun:test";
import { auth } from "@/lib/auth";
import {
  createSessionCookie,
  sessionHeaders,
  signUpTestUser,
  uniqueEmail,
} from "../helpers/auth";

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
    expect(result.user.id).toBeDefined();
  });

  test("signUpEmail rejects duplicate email addresses", async () => {
    const email = uniqueEmail("duplicate");
    const password = "password123";

    await auth.api.signUpEmail({
      body: {
        name: "First User",
        email,
        password,
      },
    });

    await expect(
      auth.api.signUpEmail({
        body: {
          name: "Second User",
          email,
          password,
        },
      }),
    ).rejects.toThrow();
  });

  test("signInEmail returns a session for an existing user", async () => {
    const { email, password } = await signUpTestUser({
      name: "Sign In User",
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
    const { email } = await signUpTestUser({
      name: "Invalid Login User",
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

  test("signInEmail rejects unknown email", async () => {
    await expect(
      auth.api.signInEmail({
        body: {
          email: uniqueEmail("missing"),
          password: "password123",
        },
      }),
    ).rejects.toThrow();
  });

  test("getSession returns null without a session cookie", async () => {
    const session = await auth.api.getSession({
      headers: new Headers(),
    });

    expect(session).toBeNull();
  });

  test("getSession returns the authenticated user with a valid cookie", async () => {
    const { email, cookie } = await createSessionCookie({
      name: "Session Lookup User",
    });

    const session = await auth.api.getSession({
      headers: sessionHeaders(cookie),
    });

    expect(session?.user.email).toBe(email);
    expect(session?.session.token).toBeDefined();
  });

  test("signOut clears the session", async () => {
    const { cookie } = await createSessionCookie({ name: "Sign Out User" });

    const signOutResponse = await auth.api.signOut({
      headers: sessionHeaders(cookie),
      asResponse: true,
    });

    expect(signOutResponse.ok).toBe(true);

    const clearedCookie =
      signOutResponse.headers.get("set-cookie") ?? cookie.split("=")[0];
    expect(clearedCookie.length).toBeGreaterThan(0);

    const session = await auth.api.getSession({
      headers: sessionHeaders(cookie),
    });

    expect(session).toBeNull();
  });

  test("updateUser updates profile image for authenticated user", async () => {
    const { cookie } = await createSessionCookie({ name: "Update User" });
    const imageUrl = "https://example.com/new-avatar.jpg";

    const response = await auth.api.updateUser({
      body: { image: imageUrl },
      headers: sessionHeaders(cookie),
      asResponse: true,
    });

    expect(response.ok).toBe(true);

    const session = await auth.api.getSession({
      headers: sessionHeaders(cookie),
    });

    expect(session?.user.image).toBe(imageUrl);
  });
});
