import "../setup";
import { describe, expect, test } from "bun:test";
import { GET, POST } from "@/app/api/profile/image/route";
import { auth } from "@/lib/auth";

function uniqueEmail() {
  return `profile-${crypto.randomUUID()}@example.com`;
}

async function createSessionCookie() {
  const email = uniqueEmail();

  const response = await auth.api.signUpEmail({
    body: {
      name: "Profile Test User",
      email,
      password: "password123",
    },
    asResponse: true,
  });

  const setCookie = response.headers.get("set-cookie") ?? "";
  const cookie = setCookie.split(";")[0];

  return { email, cookie };
}

describe("profile image api", () => {
  test("GET reports whether file upload is configured", async () => {
    const response = await GET();
    const data = (await response.json()) as { fileUploadEnabled: boolean };

    expect(response.status).toBe(200);
    expect(typeof data.fileUploadEnabled).toBe("boolean");
  });

  test("POST with image URL updates the user profile image", async () => {
    const session = await createSessionCookie();
    const imageUrl = "https://example.com/avatar.jpg";

    const request = new Request("http://localhost/api/profile/image", {
      method: "POST",
      headers: {
        cookie: session.cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    const response = await POST(request);
    const data = (await response.json()) as {
      url: string;
      storage: string;
    };

    expect(response.status).toBe(200);
    expect(data.url).toBe(imageUrl);
    expect(data.storage).toBe("url");

    const updatedSession = await auth.api.getSession({
      headers: new Headers({ cookie: session.cookie }),
    });

    expect(updatedSession?.user.image).toBe(imageUrl);
  });

  test("POST multipart without upload storage returns fallback guidance", async () => {
    const originalToken = process.env.BLOB_READ_WRITE_TOKEN;
    process.env.BLOB_READ_WRITE_TOKEN = "";

    const session = await createSessionCookie();
    const formData = new FormData();
    formData.append(
      "file",
      new File(["test"], "avatar.png", { type: "image/png" }),
    );

    const request = new Request("http://localhost/api/profile/image", {
      method: "POST",
      headers: {
        cookie: session.cookie,
      },
      body: formData,
    });

    const response = await POST(request);
    const data = (await response.json()) as {
      error: string;
      fileUploadEnabled: boolean;
    };

    expect(response.status).toBe(503);
    expect(data.fileUploadEnabled).toBe(false);
    expect(data.error).toContain("File uploads are unavailable");

    process.env.BLOB_READ_WRITE_TOKEN = originalToken;
  });
});
