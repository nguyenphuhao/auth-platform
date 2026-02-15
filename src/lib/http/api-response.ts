import { NextResponse } from "next/server";

import type { ApiErrorCode, PaginationRequest, PaginationResponse } from "@/lib/types/api";

export function createRequestId(): string {
  return crypto.randomUUID();
}

export function jsonSuccess<T>(payload: T, status = 200) {
  return NextResponse.json(payload, { status });
}

export function jsonError({
  code,
  message,
  status,
  retryable = false,
  requestId = createRequestId()
}: {
  code: ApiErrorCode;
  message: string;
  status: number;
  retryable?: boolean;
  requestId?: string;
}) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        requestId,
        retryable
      }
    },
    { status }
  );
}

export function parsePaginationQuery(searchParams: URLSearchParams, sortWhitelist: string[]) {
  const requestedLimit = Number.parseInt(searchParams.get("limit") ?? "20", 10);
  const limit = Number.isNaN(requestedLimit) ? 20 : Math.min(Math.max(requestedLimit, 1), 100);
  const cursor = searchParams.get("cursor");
  const sort = searchParams.get("sort");

  if (sort && !sortWhitelist.includes(sort)) {
    return {
      ok: false as const,
      error: jsonError({
        code: "VALIDATION_ERROR",
        message: `Unsupported sort value: ${sort}`,
        status: 400,
        retryable: false
      })
    };
  }

  const query: PaginationRequest = {
    limit,
    cursor,
    sort
  };

  return {
    ok: true as const,
    query
  };
}

export function buildPagination(limit: number, nextCursor: string | null, hasMore: boolean): PaginationResponse {
  return {
    nextCursor,
    hasMore,
    limit
  };
}
