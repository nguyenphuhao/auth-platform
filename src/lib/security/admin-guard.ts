import type { NextRequest } from "next/server";

import type { ApiErrorCode } from "@/lib/types/api";
import { getRequestActor, getServerActor } from "@/lib/security/auth-context";

export class AdminGuardError extends Error {
  public readonly status: number;
  public readonly code: ApiErrorCode;

  constructor({ code, status, message }: { code: ApiErrorCode; status: number; message: string }) {
    super(message);
    this.name = "AdminGuardError";
    this.status = status;
    this.code = code;
  }
}

export function assertAdminRequest(request: NextRequest) {
  const actor = getRequestActor(request);

  if (actor.role === "admin") {
    return;
  }

  if (actor.role === "anonymous") {
    throw new AdminGuardError({
      code: "AUTH_REQUIRED",
      status: 401,
      message: "Authentication is required"
    });
  }

  throw new AdminGuardError({
    code: "FORBIDDEN",
    status: 403,
    message: "Admin role is required"
  });
}

export async function assertAdminServerContext() {
  const actor = await getServerActor();

  if (actor.role === "admin") {
    return;
  }

  if (actor.role === "anonymous") {
    throw new AdminGuardError({
      code: "AUTH_REQUIRED",
      status: 401,
      message: "Authentication is required"
    });
  }

  throw new AdminGuardError({
    code: "FORBIDDEN",
    status: 403,
    message: "Admin role is required"
  });
}
