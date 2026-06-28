import { describe, expect, test } from "bun:test";
import { jsonWithAuthCookies } from "@/lib/update-profile-image";

describe("update profile image helpers", () => {
  test("jsonWithAuthCookies forwards Set-Cookie headers from auth response", async () => {
    const authResponse = new Response(JSON.stringify({ success: true }), {
      headers: {
        "Set-Cookie":
          "better-auth.session_token=test-token; Path=/; HttpOnly; SameSite=Lax",
      },
    });

    const response = jsonWithAuthCookies(authResponse, {
      url: "https://example.com/avatar.jpg",
      storage: "url",
    });

    expect(response.status).toBe(200);

    const body = (await response.json()) as { url: string; storage: string };
    expect(body.url).toBe("https://example.com/avatar.jpg");
    expect(body.storage).toBe("url");

    const cookies = response.headers.getSetCookie();
    expect(cookies.some((cookie) => cookie.includes("better-auth.session_token"))).toBe(
      true,
    );
  });

  test("jsonWithAuthCookies works when auth response has no cookies", async () => {
    const authResponse = new Response(JSON.stringify({ success: true }));
    const response = jsonWithAuthCookies(authResponse, { success: true });

    expect(response.status).toBe(200);
    expect(response.headers.getSetCookie()).toEqual([]);
  });
});
