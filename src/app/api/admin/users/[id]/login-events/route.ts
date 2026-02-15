import { NextRequest } from "next/server";

import { mockLoginEventsByUser } from "@/lib/admin/foundation-mock-data";
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

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

  const params = await context.params;
  if (!params.id) {
    return jsonError({
      code: "VALIDATION_ERROR",
      message: "User id is required",
      status: 400
    });
  }

  const pagination = parsePaginationQuery(request.nextUrl.searchParams, ["occurred_at_desc", "occurred_at_asc"]);
  if (!pagination.ok) {
    return pagination.error;
  }

  const events = mockLoginEventsByUser[params.id] ?? [];
  const sortedEvents = [...events].sort((a, b) => {
    if (pagination.query.sort === "occurred_at_asc") {
      return Date.parse(a.occurredAt) - Date.parse(b.occurredAt);
    }

    return Date.parse(b.occurredAt) - Date.parse(a.occurredAt);
  });

  const start = decodeCursor(pagination.query.cursor);
  const end = start + pagination.query.limit;
  const pageData = sortedEvents.slice(start, end);
  const hasMore = end < sortedEvents.length;

  return jsonSuccess({
    data: pageData,
    page: buildPagination(
      pagination.query.limit,
      hasMore ? encodeCursor(end) : null,
      hasMore
    )
  });
}
