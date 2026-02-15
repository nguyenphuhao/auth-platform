import { NextRequest } from "next/server";

import { getEnv } from "@/lib/config/env";
import { jsonError, jsonSuccess } from "@/lib/http/api-response";

interface OtpRequestBody {
  phone?: string;
}

export async function POST(request: NextRequest) {
  const env = getEnv();

  let body: OtpRequestBody;
  try {
    body = (await request.json()) as OtpRequestBody;
  } catch {
    return jsonError({
      code: "VALIDATION_ERROR",
      message: "Invalid JSON body",
      status: 400,
      retryable: false
    });
  }

  if (!body.phone || body.phone.trim().length < 8) {
    return jsonError({
      code: "VALIDATION_ERROR",
      message: "A valid phone number is required",
      status: 400,
      retryable: false
    });
  }

  // Foundation stage: contract only, service and provider wiring intentionally deferred.
  return jsonSuccess({
    data: {
      status: "PENDING",
      ttlSeconds: env.otpPolicy.ttlSeconds,
      resendCooldownSeconds: env.otpPolicy.resendCooldownSeconds
    }
  });
}
