import { NextRequest, NextResponse } from "next/server";

import { jsonError } from "@/lib/http/api-response";
import { foundationOpenApiSpec } from "@/lib/openapi/foundation.openapi";
import { evaluateDocsRequestAccess } from "@/lib/security/api-docs-guard";

export async function GET(request: NextRequest) {
  const access = evaluateDocsRequestAccess(request);

  if (access.status === 404) {
    return new NextResponse(null, { status: 404 });
  }

  if (!access.allowed) {
    return jsonError({
      code: access.status === 401 ? "AUTH_REQUIRED" : "FORBIDDEN",
      message: access.reason,
      status: access.status,
      retryable: false
    });
  }

  return NextResponse.json(foundationOpenApiSpec, {
    status: 200,
    headers: {
      "cache-control": "no-store"
    }
  });
}
