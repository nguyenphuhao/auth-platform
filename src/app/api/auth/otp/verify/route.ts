import { NextRequest } from "next/server";

import { jsonError, jsonSuccess } from "@/lib/http/api-response";

interface OtpVerifyBody {
  phone?: string;
  code?: string;
}

export async function POST(request: NextRequest) {
  let body: OtpVerifyBody;

  try {
    body = (await request.json()) as OtpVerifyBody;
  } catch {
    return jsonError({
      code: "VALIDATION_ERROR",
      message: "Invalid JSON body",
      status: 400,
      retryable: false
    });
  }

  if (!body.phone || body.phone.trim().length < 8 || !body.code) {
    return jsonError({
      code: "VALIDATION_ERROR",
      message: "Phone and OTP code are required",
      status: 400,
      retryable: false
    });
  }

  if (body.code.length < 4 || body.code.length > 8) {
    return jsonError({
      code: "OTP_INVALID",
      message: "OTP must be between 4 and 8 characters",
      status: 400,
      retryable: false
    });
  }

  // Foundation stage: contract only, no real session issue yet.
  return jsonSuccess({
    data: {
      status: "VERIFIED",
      session: null
    }
  });
}
