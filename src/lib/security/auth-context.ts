import { headers, cookies } from "next/headers";
import type { NextRequest } from "next/server";

export type ActorRole = "admin" | "user" | "anonymous";

export interface ActorContext {
  role: ActorRole;
}

function normalizeRole(raw: string | undefined): ActorRole {
  const value = raw?.toLowerCase().trim();

  if (value === "admin") {
    return "admin";
  }

  if (value === "user") {
    return "user";
  }

  return "anonymous";
}

export function getRequestActor(request: NextRequest): ActorContext {
  const roleHint = request.headers.get("x-dev-role") ?? request.cookies.get("dev_role")?.value;

  return {
    role: normalizeRole(roleHint)
  };
}

export async function getServerActor(): Promise<ActorContext> {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const roleHint = headerStore.get("x-dev-role") ?? cookieStore.get("dev_role")?.value;

  return {
    role: normalizeRole(roleHint)
  };
}
