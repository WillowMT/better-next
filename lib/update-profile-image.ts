import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function updateAuthUserImage(request: Request, image: string | null) {
  const response = await auth.api.updateUser({
    body: { image },
    headers: request.headers,
    asResponse: true,
  });

  if (!response.ok) {
    const error = (await response.json()) as { message?: string };
    throw new Error(error.message ?? "Unable to update profile.");
  }

  return response;
}

export function jsonWithAuthCookies(authResponse: Response, body: unknown) {
  const nextResponse = NextResponse.json(body);

  for (const cookie of authResponse.headers.getSetCookie()) {
    nextResponse.headers.append("Set-Cookie", cookie);
  }

  return nextResponse;
}
