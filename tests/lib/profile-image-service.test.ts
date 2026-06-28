import { describe, expect, test } from "bun:test";
import { replaceProfileImage } from "@/lib/profile-image-service";

describe("replaceProfileImage", () => {
  test("updates auth before deleting the previous image", async () => {
    const calls: string[] = [];

    const result = await replaceProfileImage({
      currentImage: "https://old.example/avatar.png",
      upload: async () => {
        calls.push("upload");
        return "https://new.example/avatar.png";
      },
      updateUserImage: async (url) => {
        calls.push(`update:${url}`);
      },
      deleteImage: async (url) => {
        calls.push(`delete:${url}`);
      },
    });

    expect(result).toBe("https://new.example/avatar.png");
    expect(calls).toEqual([
      "upload",
      "update:https://new.example/avatar.png",
      "delete:https://old.example/avatar.png",
    ]);
  });

  test("deletes the new upload when the auth update fails", async () => {
    const calls: string[] = [];

    await expect(
      replaceProfileImage({
        currentImage: "https://old.example/avatar.png",
        upload: async () => {
          calls.push("upload");
          return "https://new.example/avatar.png";
        },
        updateUserImage: async () => {
          calls.push("update");
          throw new Error("Auth update failed");
        },
        deleteImage: async (url) => {
          calls.push(`delete:${url}`);
        },
      }),
    ).rejects.toThrow("Auth update failed");

    expect(calls).toEqual([
      "upload",
      "update",
      "delete:https://new.example/avatar.png",
    ]);
  });
});
