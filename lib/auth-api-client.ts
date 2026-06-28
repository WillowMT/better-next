"use client";

interface AuthApiOptions extends RequestInit {
  json?: unknown;
}

export async function callAuthApi<T>(path: string, options: AuthApiOptions = {}) {
  const headers = new Headers(options.headers);

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`/api/auth/${path}`, {
    ...options,
    headers,
    credentials: "include",
    body:
      options.json === undefined ? options.body : JSON.stringify(options.json),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : "Request failed.";

    throw new Error(message);
  }

  return data as T;
}
