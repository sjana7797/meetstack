import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { IAuthTokenPayload } from "@repo/auth-verify";
import type { Request } from "express";

export const CurrentUser = createParamDecorator(
  (field: keyof IAuthTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as IAuthTokenPayload;

    return field ? user[field] : user;
  },
);
