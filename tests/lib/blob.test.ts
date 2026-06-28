import { describe, expect, test } from "bun:test";
import {
  isBlobStorageEnabled,
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

  test("validateImageFile accepts supported image types", () => {
    const file = new File(["test"], "avatar.png", { type: "image/png" });

    expect(validateImageFile(file)).toBeNull();
  });

  test("validateImageUrl accepts http and https URLs", () => {
    expect(validateImageUrl("https://example.com/avatar.jpg")).toBeNull();
    expect(validateImageUrl("http://example.com/avatar.jpg")).toBeNull();
  });

  test("validateImageUrl rejects invalid URLs", () => {
    expect(validateImageUrl("not-a-url")).toBe("Enter a valid image URL.");
    expect(validateImageUrl("ftp://example.com/avatar.jpg")).toBe(
      "Image URL must use http or https.",
    );
  });
});
