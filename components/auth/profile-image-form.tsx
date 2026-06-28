"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { UserAvatar } from "./user-avatar";

interface ProfileImageFormProps {
  name: string;
  email: string;
  image?: string | null;
  fileUploadEnabled: boolean;
}

export function ProfileImageForm({
  name,
  email,
  image,
  fileUploadEnabled,
}: ProfileImageFormProps) {
  const router = useRouter();
  const { refetch } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null | undefined>(
    image,
  );
  const [imageUrl, setImageUrl] = useState(image ?? "");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  async function refreshSession() {
    await refetch({ query: { disableCookieCache: true } });
    router.refresh();
  }

  async function handleFileUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image to upload.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/image", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }

      setPreviewImage(data.url ?? null);
      setImageUrl(data.url ?? "");
      setMessage("Profile picture updated.");
      await refreshSession();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload image.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleUrlSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSavingUrl(true);

    try {
      const response = await fetch("/api/profile/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save image URL.");
      }

      setPreviewImage(data.url ?? null);
      setMessage("Profile picture updated.");
      await refreshSession();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save image URL.",
      );
    } finally {
      setIsSavingUrl(false);
    }
  }

  async function handleRemove() {
    setError(null);
    setMessage(null);
    setIsRemoving(true);

    try {
      const response = await fetch("/api/profile/image", {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to remove profile picture.");
      }

      setPreviewImage(null);
      setImageUrl("");
      setMessage("Profile picture removed.");
      await refreshSession();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Unable to remove profile picture.",
      );
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <UserAvatar name={name} image={previewImage} size="lg" />

        <div className="flex-1 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              {name}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{email}</p>
            <p className="pt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {fileUploadEnabled
                ? "Upload a photo or paste a public image URL."
                : "Paste a public image URL to set your profile picture."}
            </p>
          </div>

          {fileUploadEnabled ? (
            <form onSubmit={handleFileUpload} className="space-y-3">
              <label
                htmlFor="profile-image-file"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Upload image
              </label>
              <input
                ref={fileInputRef}
                id="profile-image-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-800 hover:file:bg-zinc-200 dark:text-zinc-400 dark:file:bg-zinc-900 dark:file:text-zinc-100 dark:hover:file:bg-zinc-800"
              />
              <button
                type="submit"
                disabled={isUploading}
                className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {isUploading ? "Uploading..." : "Upload photo"}
              </button>
            </form>
          ) : null}

          <form onSubmit={handleUrlSave} className="space-y-3">
            <label
              htmlFor="profile-image-url"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {fileUploadEnabled ? "Or use an image URL" : "Image URL"}
            </label>
            <input
              id="profile-image-url"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
            />
            <button
              type="submit"
              disabled={isSavingUrl}
              className="h-10 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {isSavingUrl ? "Saving..." : "Save image URL"}
            </button>
          </form>

          {previewImage ? (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-sm font-medium text-red-600 transition hover:text-red-700 disabled:opacity-60 dark:text-red-400 dark:hover:text-red-300"
            >
              {isRemoving ? "Removing..." : "Remove profile picture"}
            </button>
          ) : null}

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          ) : null}

          {message ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
