import { describe, expect, test } from "bun:test";
import {
  deleteProfileImage,
  getProfileImageUploadPath,
  isBlobStorageEnabled,
  uploadProfileImage,
  validateImageFile,
  validateImageUrl,
} from "@/lib/blob";

describe("blob helpers", () => {
  test("isBlobStorageEnabled reflects BLOB_READ_WRITE_TOKEN", () => {
    const originalToken = process.env.BLOB_READ_WRITE_TOKEN;

    process.env.BLOB_READ_WRITE_TOKEN = "";
    expect(isBlobStorageEnabled()).toBe(false);

    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
    expect(isBlobStorageEnabled()).toBe(true);

    process.env.BLOB_READ_WRITE_TOKEN = originalToken;
  });

  test("validateImageFile rejects unsupported types", () => {
    const file = new File(["test"], "avatar.txt", { type: "text/plain" });

    expect(validateImageFile(file)).toBe(
      "Only JPEG, PNG, WebP, and GIF images are allowed.",
    );
  });

  test("validateImageFile rejects files larger than 4 MB", () => {
    const largePayload = new Uint8Array(4 * 1024 * 1024 + 1);
    const file = new File([largePayload], "avatar.png", {
      type: "image/png",
    });

    expect(validateImageFile(file)).toBe("Image must be 4 MB or smaller.");
  });

  test("validateImageFile accepts supported image types", () => {
    expect(
      validateImageFile(new File(["test"], "avatar.png", { type: "image/png" })),
    ).toBeNull();
    expect(
      validateImageFile(new File(["test"], "avatar.jpg", { type: "image/jpeg" })),
    ).toBeNull();
    expect(
      validateImageFile(new File(["test"], "avatar.webp", { type: "image/webp" })),
    ).toBeNull();
    expect(
      validateImageFile(new File(["test"], "avatar.gif", { type: "image/gif" })),
    ).toBeNull();
  });

  test("validateImageUrl accepts https image URLs", () => {
    expect(validateImageUrl("https://example.com/avatar.jpg")).toBeNull();
  });

  test("validateImageUrl rejects invalid and unsafe URLs", () => {
    expect(validateImageUrl("not-a-url")).toBe("Enter a valid image URL.");
    expect(validateImageUrl("http://example.com/avatar.jpg")).toBe(
      "Image URL must use https.",
    );
    expect(validateImageUrl("ftp://example.com/avatar.jpg")).toBe(
      "Image URL must use https.",
    );
    expect(validateImageUrl("https://user:pass@example.com/avatar.jpg")).toBe(
      "Image URL must not include credentials.",
    );
    expect(validateImageUrl("https://localhost/avatar.jpg")).toBe(
      "Image URL host is not allowed.",
    );
    expect(validateImageUrl("")).toBe("Enter a valid image URL.");
  });

  test("validateImageUrl enforces an optional host allowlist", () => {
    expect(
      validateImageUrl("https://cdn.example.com/avatar.jpg", {
        allowedHosts: ["cdn.example.com"],
      }),
    ).toBeNull();
    expect(
      validateImageUrl("https://images.example.com/avatar.jpg", {
        allowedHosts: ["cdn.example.com"],
      }),
    ).toBe("Image URL host is not allowed.");
  });

  test("getProfileImageUploadPath derives extension from MIME type", () => {
    const file = new File(["test"], "avatar.exe", { type: "image/webp" });

    expect(getProfileImageUploadPath("user-123", file, 123456)).toBe(
      "avatars/user-123/123456.webp",
    );
  });

  test("uploadProfileImage throws when blob storage is disabled", async () => {
    const originalToken = process.env.BLOB_READ_WRITE_TOKEN;
    process.env.BLOB_READ_WRITE_TOKEN = "";

    await expect(
      uploadProfileImage(
        "user-123",
        new File(["test"], "avatar.png", { type: "image/png" }),
      ),
    ).rejects.toThrow("File uploads are not configured.");

    process.env.BLOB_READ_WRITE_TOKEN = originalToken;
  });

  test("deleteProfileImage no-ops for non-blob URLs", async () => {
    await expect(
      deleteProfileImage("https://example.com/avatar.jpg"),
    ).resolves.toBeUndefined();
  });

  test("deleteProfileImage no-ops when blob storage is disabled", async () => {
    const originalToken = process.env.BLOB_READ_WRITE_TOKEN;
    process.env.BLOB_READ_WRITE_TOKEN = "";

    await expect(
      deleteProfileImage("https://abc.public.blob.vercel-storage.com/avatar.png"),
    ).resolves.toBeUndefined();

    process.env.BLOB_READ_WRITE_TOKEN = originalToken;
  });
});
