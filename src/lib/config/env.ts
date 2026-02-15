import "server-only";

type NodeEnv = "development" | "test" | "production";
type AppTheme = "light" | "dark";
type AppCode = "health" | "league" | "default";

export interface AppEnv {
  nodeEnv: NodeEnv;
  appTheme: AppTheme;
  appCode: AppCode;
  supabase: {
    url: string;
    publishableKey: string;
    secretKey: string;
  };
  apiDocs: {
    enabled: boolean;
    requireAdmin: boolean;
    allowInProd: boolean;
  };
  otpPolicy: {
    ttlSeconds: number;
    resendCooldownSeconds: number;
    requestMaxPerPhoneWindow: number;
    requestMaxPerIpWindow: number;
    requestWindowMinutes: number;
    verifyMaxAttempts: number;
    verifyLockoutMinutes: number;
  };
}

let cachedEnv: AppEnv | null = null;

function required(key: string, fallbackKey?: string): string {
  const primaryValue = process.env[key]?.trim();
  const fallbackValue = fallbackKey ? process.env[fallbackKey]?.trim() : undefined;
  const value = primaryValue || fallbackValue;

  if (!value) {
    const legacyHint = fallbackKey ? ` (or ${fallbackKey})` : "";
    throw new Error(`Missing required environment variable: ${key}${legacyHint}`);
  }

  return value;
}

function optional(key: string, fallback: string, fallbackKey?: string): string {
  const primaryValue = process.env[key]?.trim();
  const legacyValue = fallbackKey ? process.env[fallbackKey]?.trim() : undefined;
  return primaryValue || legacyValue || fallback;
}

function parseBoolean(key: string, fallback: boolean): boolean {
  const raw = process.env[key]?.trim().toLowerCase();

  if (!raw) {
    return fallback;
  }

  if (raw === "true") {
    return true;
  }

  if (raw === "false") {
    return false;
  }

  throw new Error(`Invalid boolean value for ${key}: ${raw}`);
}

function parsePositiveInt(key: string, fallback: number): number {
  const raw = process.env[key]?.trim();

  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid positive integer for ${key}: ${raw}`);
  }

  return parsed;
}

function parseNodeEnv(): NodeEnv {
  const value = (process.env.NODE_ENV ?? "development").trim();

  if (value === "development" || value === "test" || value === "production") {
    return value;
  }

  throw new Error(`Invalid NODE_ENV: ${value}`);
}

function parseAppTheme(nodeEnv: NodeEnv): AppTheme {
  const raw = optional("APP_THEME", nodeEnv === "production" ? "dark" : "light").toLowerCase();

  if (raw === "light" || raw === "dark") {
    return raw;
  }

  throw new Error(`Invalid APP_THEME: ${raw}. Expected light or dark.`);
}

function parseAppCode(): AppCode {
  const raw = optional("APP_CODE", "default").toLowerCase();

  if (raw === "health" || raw === "league" || raw === "default") {
    return raw;
  }

  throw new Error(`Invalid APP_CODE: ${raw}. Expected health, league, or default.`);
}

function buildEnv(): AppEnv {
  const nodeEnv = parseNodeEnv();

  return {
    nodeEnv,
    appTheme: parseAppTheme(nodeEnv),
    appCode: parseAppCode(),
    supabase: {
      url: required("NEXT_PUBLIC_SUPABASE_URL"),
      publishableKey: required(
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
      ),
      secretKey: required("SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY")
    },
    apiDocs: {
      enabled: parseBoolean("API_DOCS_ENABLED", nodeEnv === "development"),
      requireAdmin: parseBoolean("API_DOCS_REQUIRE_ADMIN", true),
      allowInProd: parseBoolean("API_DOCS_ALLOW_IN_PROD", false)
    },
    otpPolicy: {
      ttlSeconds: parsePositiveInt("OTP_TTL_SECONDS", 300),
      resendCooldownSeconds: parsePositiveInt("OTP_RESEND_COOLDOWN_SECONDS", 30),
      requestMaxPerPhoneWindow: parsePositiveInt("OTP_REQUEST_MAX_PER_PHONE_WINDOW", 5),
      requestMaxPerIpWindow: parsePositiveInt("OTP_REQUEST_MAX_PER_IP_WINDOW", 10),
      requestWindowMinutes: parsePositiveInt("OTP_REQUEST_WINDOW_MINUTES", 15),
      verifyMaxAttempts: parsePositiveInt("OTP_VERIFY_MAX_ATTEMPTS", 5),
      verifyLockoutMinutes: parsePositiveInt("OTP_VERIFY_LOCKOUT_MINUTES", 15)
    }
  };
}

export function getEnv(): AppEnv {
  if (!cachedEnv) {
    cachedEnv = buildEnv();
  }

  return cachedEnv;
}
