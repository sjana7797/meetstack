import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { map, Observable } from "rxjs";

import { RESPONSE_MESSAGE_KEY } from "@/common/decorators";
import { RESPONSE_STATUS, TApiSuccessResponse } from "@/common/dto";

const DEFAULT_MESSAGE = "Request Successful" as const;

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  TApiSuccessResponse<T> | T
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | TApiSuccessResponse<T>> {
    const http = context.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request & { id?: string }>();
    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? DEFAULT_MESSAGE;

    return next.handle().pipe(
      map((data): TApiSuccessResponse<T> | T => {
        if (response.headersSent) {
          return data;
        }

        return {
          status: RESPONSE_STATUS.SUCCESS,
          message,
          data: data ?? (null as T),
          requestId: String(request.id ?? ""),
        };
      }),
    );
  }
}
