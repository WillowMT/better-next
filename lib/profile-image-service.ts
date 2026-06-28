interface ReplaceProfileImageOptions {
  currentImage?: string | null;
  upload: () => Promise<string>;
  updateUserImage: (url: string) => Promise<void>;
  deleteImage: (url: string) => Promise<void>;
}

export async function replaceProfileImage({
  currentImage,
  upload,
  updateUserImage,
  deleteImage,
}: ReplaceProfileImageOptions) {
  let uploadedUrl: string | null = null;

  try {
    uploadedUrl = await upload();
    await updateUserImage(uploadedUrl);
  } catch (error) {
    if (uploadedUrl) {
      await deleteImage(uploadedUrl).catch(() => undefined);
    }

    throw error;
  }

  if (currentImage) {
    await deleteImage(currentImage).catch(() => undefined);
  }

  return uploadedUrl;
}
