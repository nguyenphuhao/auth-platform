import { NextRequest } from "next/server";

import { mockUsers } from "@/lib/admin/foundation-mock-data";
import { buildPagination, jsonError, jsonSuccess, parsePaginationQuery } from "@/lib/http/api-response";
import { AdminGuardError, assertAdminRequest } from "@/lib/security/admin-guard";

function encodeCursor(index: number): string {
  return Buffer.from(String(index), "utf8").toString("base64url");
}

function decodeCursor(cursor: string | null): number {
  if (!cursor) {
    return 0;
  }

  const decoded = Buffer.from(cursor, "base64url").toString("utf8");
  const parsed = Number.parseInt(decoded, 10);

  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    assertAdminRequest(request);
  } catch (error) {
    if (error instanceof AdminGuardError) {
      return jsonError({
        code: error.code,
        message: error.message,
        status: error.status
      });
    }

    return jsonError({
      code: "INTERNAL_ERROR",
      message: "Unexpected admin guard error",
      status: 500,
      retryable: true
    });
  }

  const pagination = parsePaginationQuery(request.nextUrl.searchParams, ["created_at_desc", "created_at_asc"]);
  if (!pagination.ok) {
    return pagination.error;
  }

  const sortedUsers = [...mockUsers].sort((a, b) => {
    if (pagination.query.sort === "created_at_asc") {
      return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    }

    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });

  const start = decodeCursor(pagination.query.cursor);
  const end = start + pagination.query.limit;
  const pageData = sortedUsers.slice(start, end);
  const hasMore = end < sortedUsers.length;

  return jsonSuccess({
    data: pageData,
    page: buildPagination(
      pagination.query.limit,
      hasMore ? encodeCursor(end) : null,
      hasMore
    )
  });
}
