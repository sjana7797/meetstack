import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/db";
import {
  admin,
  jwt,
  openAPI,
  phoneNumber,
  magicLink,
  emailOTP,
  captcha,
  haveIBeenPwned,
  username,
} from "better-auth/plugins";
import { apiKey } from "@better-auth/api-key";

import * as schema from "@repo/db/schema";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  plugins: [
    admin(),
    jwt(),
    openAPI(),
    phoneNumber(),
    magicLink({
      sendMagicLink: async ({ email, token, url, metadata }, ctx) => {
        // send email to user
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    apiKey(),
    captcha({
      provider: "cloudflare-turnstile",
      secretKey: process.env.TURNSTILE_SECRET_KEY!,
    }),
    haveIBeenPwned(),
    username(),
  ],
});
