import { NextRequest } from "next/server";

import { jsonError, jsonSuccess } from "@/lib/http/api-response";
import { AdminGuardError, assertAdminRequest } from "@/lib/security/admin-guard";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

  // Foundation stage: contract-only endpoint.
  return jsonSuccess({
    data: {
      id: params.id,
      status: "deleted"
    }
  });
}
