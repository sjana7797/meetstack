import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

export interface IAuthTokenPayload extends JWTPayload {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
}

// Lazily initialized: process.env.BETTER_AUTH_URL is only populated once
// ConfigModule.forRoot() loads .env, which happens after this module is
// first imported (imports resolve before a file's own top-level code runs),
// so building the JWKS at import time would read an unset env var.
let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

function getJwks() {
  jwks ??= createRemoteJWKSet(
    new URL("/api/auth/jwks", process.env.BETTER_AUTH_URL),
  );

  return jwks;
}

export async function verifyAuthToken(
  token: string,
): Promise<IAuthTokenPayload> {
  const { payload } = await jwtVerify<IAuthTokenPayload>(token, getJwks());

  return payload;
}
