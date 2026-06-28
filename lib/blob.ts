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
const imageExtensionByType = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

interface ValidateImageUrlOptions {
  allowedHosts?: string[];
}

export function validateImageFile(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed.";
  }

  if (file.size > maxImageSizeBytes) {
    return "Image must be 4 MB or smaller.";
  }

  return null;
}

export function getAllowedProfileImageHosts() {
  return (process.env.PROFILE_IMAGE_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function isPrivateHostname(hostname: string) {
  const normalized = hostname.toLowerCase();

  if (
    normalized === "localhost" ||
    normalized === "::1" ||
    normalized === "[::1]" ||
    normalized.endsWith(".localhost")
  ) {
    return true;
  }

  const parts = normalized.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) {
    return false;
  }

  const [first, second] = parts;
  return (
    first === 10 ||
    first === 127 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 169 && second === 254)
  );
}

function isAllowedHost(hostname: string, allowedHosts: string[]) {
  if (isPrivateHostname(hostname)) {
    return false;
  }

  if (allowedHosts.length === 0) {
    return true;
  }

  const normalized = hostname.toLowerCase();

  return allowedHosts.some((host) => {
    const allowedHost = host.toLowerCase();

    if (allowedHost.startsWith("*.")) {
      const suffix = allowedHost.slice(1);
      return normalized.endsWith(suffix);
    }

    return normalized === allowedHost;
  });
}

export function validateImageUrl(
  value: string,
  options: ValidateImageUrlOptions = {},
) {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return "Image URL must use https.";
    }

    if (url.username || url.password) {
      return "Image URL must not include credentials.";
    }

    const allowedHosts = options.allowedHosts ?? getAllowedProfileImageHosts();
    if (!isAllowedHost(url.hostname, allowedHosts)) {
      return "Image URL host is not allowed.";
    }

    return null;
  } catch {
    return "Enter a valid image URL.";
  }
}

export function getProfileImageUploadPath(
  userId: string,
  file: File,
  timestamp = Date.now(),
) {
  const extension = imageExtensionByType.get(file.type) ?? "jpg";
  return `avatars/${userId}/${timestamp}.${extension}`;
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

  return put(getProfileImageUploadPath(userId, file), file, {
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
