import { auth } from "@/lib/auth";

export function uniqueEmail(prefix = "test") {
  return `${prefix}-${crypto.randomUUID()}@example.com`;
}

export async function signUpTestUser(options?: {
  name?: string;
  email?: string;
  password?: string;
}) {
  const email = options?.email ?? uniqueEmail();
  const password = options?.password ?? "password123";
  const name = options?.name ?? "Test User";

  const result = await auth.api.signUpEmail({
    body: { name, email, password },
  });

  return { ...result, email, password, name };
}

export async function createSessionCookie(options?: {
  name?: string;
  email?: string;
  password?: string;
}) {
  const email = options?.email ?? uniqueEmail("session");
  const password = options?.password ?? "password123";
  const name = options?.name ?? "Session Test User";

  const response = await auth.api.signUpEmail({
    body: { name, email, password },
    asResponse: true,
  });

  const setCookie = response.headers.get("set-cookie") ?? "";
  const cookie = setCookie.split(";")[0];

  if (!cookie) {
    throw new Error("Expected auth session cookie from sign up.");
  }

  return { email, password, name, cookie };
}

export function sessionHeaders(cookie: string) {
  return new Headers({ cookie });
}
