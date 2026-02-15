import { getEnv } from "@/lib/config/env";
import { getRequestActor, getServerActor } from "@/lib/security/auth-context";
import type { NextRequest } from "next/server";

interface DocsAccessDecision {
  allowed: boolean;
  status: 200 | 401 | 403 | 404;
  reason: string;
}

function evaluateDocsPolicy(role: "admin" | "user" | "anonymous"): DocsAccessDecision {
  const env = getEnv();

  if (!env.apiDocs.enabled) {
    return {
      allowed: false,
      status: 404,
      reason: "API docs are disabled"
    };
  }

  if (env.nodeEnv === "production" && !env.apiDocs.allowInProd) {
    return {
      allowed: false,
      status: 404,
      reason: "API docs are not allowed in production"
    };
  }

  if (env.apiDocs.requireAdmin && role !== "admin") {
    if (role === "anonymous") {
      return {
        allowed: false,
        status: 401,
        reason: "Authentication is required"
      };
    }

    return {
      allowed: false,
      status: 403,
      reason: "Admin role is required"
    };
  }

  return {
    allowed: true,
    status: 200,
    reason: "Allowed"
  };
}

export function evaluateDocsRequestAccess(request: NextRequest): DocsAccessDecision {
  const actor = getRequestActor(request);
  return evaluateDocsPolicy(actor.role);
}

export async function evaluateDocsPageAccess(): Promise<DocsAccessDecision> {
  const actor = await getServerActor();
  return evaluateDocsPolicy(actor.role);
}
