import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { isAuthEmailEnabled, sendConsoleAuthEmail } from "@/lib/auth-email";

const authEmailEnabled = isAuthEmailEnabled();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    ...(authEmailEnabled
      ? {
          sendResetPassword: async ({ user, url }) => {
            await sendConsoleAuthEmail({
              to: user.email,
              subject: "Reset your password",
              url,
            });
          },
        }
      : {}),
  },
  ...(authEmailEnabled
    ? {
        emailVerification: {
          sendVerificationEmail: async ({ user, url }) => {
            await sendConsoleAuthEmail({
              to: user.email,
              subject: "Verify your email",
              url,
            });
          },
          autoSignInAfterVerification: true,
          sendOnSignUp: false,
        },
      }
    : {}),
  plugins: [nextCookies()],
});
