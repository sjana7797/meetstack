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
  baseURL: process.env.BETTER_AUTH_URL!,
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
