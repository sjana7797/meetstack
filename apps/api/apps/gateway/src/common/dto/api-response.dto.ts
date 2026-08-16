import { ApiProperty } from "@nestjs/swagger";

export const RESPONSE_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type TResponseStatus = typeof RESPONSE_STATUS;

export type TResponseStatusKey = keyof typeof RESPONSE_STATUS;

export type TResponseStatuses = TResponseStatus[TResponseStatusKey];

export type TApiSuccessResponse<T> = {
  status: typeof RESPONSE_STATUS.SUCCESS;
  data: T;
  message: string;
  requestId: string;
};

export type TApiErrorResponse = {
  status: typeof RESPONSE_STATUS.ERROR;
  error: string;
  message: string;
  requestId: string;
};

export class ApiSuccessResponseDto<T = unknown> {
  @ApiProperty({ enum: RESPONSE_STATUS, example: RESPONSE_STATUS.SUCCESS })
  status: typeof RESPONSE_STATUS.SUCCESS;

  @ApiProperty({ example: "Request Successful" })
  message: string;

  @ApiProperty({ example: "Response data as per endpoints" })
  data: T;

  @ApiProperty({ example: "01a00985-4224-727c-b533-fa2a8c6fb220" })
  requestId: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ enum: RESPONSE_STATUS, example: RESPONSE_STATUS.ERROR })
  status: typeof RESPONSE_STATUS.ERROR;

  @ApiProperty({ example: "Invalid Credentials" })
  message: string;

  @ApiProperty({ example: "AUTH_INVALID_CREDENTIALS" })
  error: string;

  @ApiProperty({ example: "01a00985-4224-727c-b533-fa2a8c6fb220" })
  requestId: string;
}
