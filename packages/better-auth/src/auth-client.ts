import { apiKeyClient } from "@better-auth/api-key/client";
import {
  emailOTPClient,
  jwtClient,
  magicLinkClient,
  phoneNumberClient,
  usernameClient,
  adminClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // NEXT_PUBLIC_ prefix required: this file runs in the browser (createAuthClient
  // is a client-side API), and Next.js only inlines env vars with that prefix
  // into the client bundle. Plain BETTER_AUTH_URL would be undefined here.
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    usernameClient(),
    phoneNumberClient(),
    magicLinkClient(),
    emailOTPClient(),
    adminClient(),
    apiKeyClient(),
    jwtClient(),
  ],
});
