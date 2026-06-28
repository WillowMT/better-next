import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  deleteProfileImage,
  isBlobStorageEnabled,
  uploadProfileImage,
  validateImageUrl,
} from "@/lib/blob";
import {
  jsonWithAuthCookies,
  updateAuthUserImage,
} from "@/lib/update-profile-image";
import { replaceProfileImage } from "@/lib/profile-image-service";

async function getSession(request: Request) {
  return auth.api.getSession({
    headers: request.headers,
  });
}

export async function GET() {
  return NextResponse.json({
    fileUploadEnabled: isBlobStorageEnabled(),
  });
}

export async function POST(request: Request) {
  const session = await getSession(request);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    if (!isBlobStorageEnabled()) {
      return NextResponse.json(
        {
          error: "File uploads are unavailable. Use an image URL instead.",
          fileUploadEnabled: false,
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    try {
      let authResponse: Response | null = null;
      const blobUrl = await replaceProfileImage({
        currentImage: session.user.image,
        upload: async () => {
          const blob = await uploadProfileImage(session.user.id, file);
          return blob.url;
        },
        updateUserImage: async (url) => {
          authResponse = await updateAuthUserImage(request, url);
        },
        deleteImage: deleteProfileImage,
      });

      if (!authResponse) {
        throw new Error("Unable to update profile.");
      }

      return jsonWithAuthCookies(authResponse, {
        url: blobUrl,
        storage: "upload",
        fileUploadEnabled: true,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to upload image.";

      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  const body = (await request.json()) as { imageUrl?: string };
  const imageUrl = body.imageUrl?.trim();

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
  }

  const validationError = validateImageUrl(imageUrl);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const authResponse = await updateAuthUserImage(request, imageUrl);

    return jsonWithAuthCookies(authResponse, {
      url: imageUrl,
      storage: "url",
      fileUploadEnabled: isBlobStorageEnabled(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update profile.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession(request);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.image) {
    await deleteProfileImage(session.user.image);
  }

  try {
    const authResponse = await updateAuthUserImage(request, null);

    return jsonWithAuthCookies(authResponse, { success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to remove profile picture.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
