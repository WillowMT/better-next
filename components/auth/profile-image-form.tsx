"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  async function refreshSession() {
    await refetch({ query: { disableCookieCache: true } });
    router.refresh();
  }

  async function handleFileUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Choose an image to upload.");
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
      toast.success("Profile picture updated.");
      await refreshSession();
    } catch (uploadError) {
      toast.error(
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
      toast.success("Profile picture updated.");
      await refreshSession();
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save image URL.",
      );
    } finally {
      setIsSavingUrl(false);
    }
  }

  async function handleRemove() {
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
      toast.success("Profile picture removed.");
      await refreshSession();
    } catch (removeError) {
      toast.error(
        removeError instanceof Error
          ? removeError.message
          : "Unable to remove profile picture.",
      );
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <UserAvatar name={name} image={previewImage} size="lg" />

          <div className="flex-1 space-y-6">
            <CardHeader className="p-0">
              <CardTitle>{name}</CardTitle>
              <CardDescription>{email}</CardDescription>
              <CardDescription className="pt-2">
                {fileUploadEnabled
                  ? "Upload a photo or paste a public image URL."
                  : "Paste a public image URL to set your profile picture."}
              </CardDescription>
            </CardHeader>

            {fileUploadEnabled ? (
              <form onSubmit={handleFileUpload} className="space-y-3">
                <Label htmlFor="profile-image-file">Upload image</Label>
                <Input
                  ref={fileInputRef}
                  id="profile-image-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="h-auto file:mr-4 file:rounded-lg file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground"
                />
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload photo"}
                </Button>
              </form>
            ) : null}

            <form onSubmit={handleUrlSave} className="space-y-3">
              <Label htmlFor="profile-image-url">
                {fileUploadEnabled ? "Or use an image URL" : "Image URL"}
              </Label>
              <Input
                id="profile-image-url"
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="h-11"
              />
              <Button type="submit" variant="outline" disabled={isSavingUrl}>
                {isSavingUrl ? "Saving..." : "Save image URL"}
              </Button>
            </form>

            {previewImage ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={isRemoving}
              >
                {isRemoving ? "Removing..." : "Remove profile picture"}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
