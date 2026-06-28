import "../setup";
import { describe, expect, test } from "bun:test";
import { GET, POST } from "@/app/api/profile/image/route";
import { auth } from "@/lib/auth";
import { createSessionCookie, sessionHeaders } from "../helpers/auth";

describe("profile image api", () => {
  test("GET reports whether file upload is configured", async () => {
    const response = await GET();
    const data = (await response.json()) as { fileUploadEnabled: boolean };

    expect(response.status).toBe(200);
    expect(typeof data.fileUploadEnabled).toBe("boolean");
  });

  test("POST without session returns 401", async () => {
    const request = new Request("http://localhost/api/profile/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: "https://example.com/avatar.jpg" }),
    });

    const response = await POST(request);
    const data = (await response.json()) as { error: string };

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
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
      headers: sessionHeaders(session.cookie),
    });

    expect(updatedSession?.user.image).toBe(imageUrl);
  });

  test("POST with empty image URL returns 400", async () => {
    const session = await createSessionCookie();

    const request = new Request("http://localhost/api/profile/image", {
      method: "POST",
      headers: {
        cookie: session.cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: "   " }),
    });

    const response = await POST(request);
    const data = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(data.error).toBe("Image URL is required.");
  });

  test("POST with invalid image URL returns 400", async () => {
    const session = await createSessionCookie();

    const request = new Request("http://localhost/api/profile/image", {
      method: "POST",
      headers: {
        cookie: session.cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: "not-a-url" }),
    });

    const response = await POST(request);
    const data = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(data.error).toBe("Enter a valid image URL.");
  });

  test("POST multipart without file returns 400", async () => {
    const originalToken = process.env.BLOB_READ_WRITE_TOKEN;
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";

    const session = await createSessionCookie();
    const formData = new FormData();

    const request = new Request("http://localhost/api/profile/image", {
      method: "POST",
      headers: {
        cookie: session.cookie,
      },
      body: formData,
    });

    const response = await POST(request);
    const data = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(data.error).toBe("Image file is required.");

    process.env.BLOB_READ_WRITE_TOKEN = originalToken;
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

  test("DELETE removes profile image for authenticated user", async () => {
    const session = await createSessionCookie();
    const imageUrl = "https://example.com/remove-me.jpg";

    await POST(
      new Request("http://localhost/api/profile/image", {
        method: "POST",
        headers: {
          cookie: session.cookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      }),
    );

    const { DELETE } = await import("@/app/api/profile/image/route");

    const response = await DELETE(
      new Request("http://localhost/api/profile/image", {
        method: "DELETE",
        headers: { cookie: session.cookie },
      }),
    );

    const data = (await response.json()) as { success: boolean };

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    const updatedSession = await auth.api.getSession({
      headers: sessionHeaders(session.cookie),
    });

    expect(updatedSession?.user.image).toBeNull();
  });

  test("DELETE without session returns 401", async () => {
    const { DELETE } = await import("@/app/api/profile/image/route");

    const response = await DELETE(
      new Request("http://localhost/api/profile/image", {
        method: "DELETE",
      }),
    );

    const data = (await response.json()) as { error: string };

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });
});
