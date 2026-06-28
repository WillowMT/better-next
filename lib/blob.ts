export function isBlobStorageEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const maxImageSizeBytes = 4 * 1024 * 1024;

export function validateImageFile(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed.";
  }

  if (file.size > maxImageSizeBytes) {
    return "Image must be 4 MB or smaller.";
  }

  return null;
}

export function validateImageUrl(value: string) {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "Image URL must use http or https.";
    }

    return null;
  } catch {
    return "Enter a valid image URL.";
  }
}

export async function uploadProfileImage(userId: string, file: File) {
  if (!isBlobStorageEnabled()) {
    throw new Error("File uploads are not configured.");
  }

  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const { put } = await import("@vercel/blob");
  const extension = file.name.split(".").pop() ?? "jpg";

  return put(`avatars/${userId}/${Date.now()}.${extension}`, file, {
    access: "public",
    addRandomSuffix: false,
  });
}

export async function deleteProfileImage(url: string) {
  if (!isBlobStorageEnabled() || !url.includes("blob.vercel-storage.com")) {
    return;
  }

  const { del } = await import("@vercel/blob");
  await del(url);
}
