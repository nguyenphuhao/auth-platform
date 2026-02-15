export type ApiErrorCode =
  | "AUTH_REQUIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "OTP_INVALID"
  | "OTP_EXPIRED"
  | "OTP_RATE_LIMITED"
  | "INTERNAL_ERROR";

export interface ApiErrorEnvelope {
  error: {
    code: ApiErrorCode;
    message: string;
    requestId: string;
    retryable: boolean;
  };
}

export interface PaginationRequest {
  limit: number;
  cursor: string | null;
  sort: string | null;
}

export interface PaginationResponse {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}
