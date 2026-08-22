import type { IAuthTokenPayload } from "@repo/auth-verify";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthTokenPayload;
    }
  }
}

export {};
