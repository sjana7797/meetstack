import type { IAuthTokenPayload } from "@app/auth-verify";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthTokenPayload;
    }
  }
}

export {};
