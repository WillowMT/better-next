import { getOptionalEnv } from "@/lib/env";

export function isAuthEmailEnabled(env = process.env) {
  return getOptionalEnv("AUTH_EMAIL_DELIVERY", env) === "console";
}

export async function sendConsoleAuthEmail({
  to,
  subject,
  url,
}: {
  to: string;
  subject: string;
  url: string;
}) {
  console.info(`[better-next auth email] ${subject} for ${to}: ${url}`);
}
