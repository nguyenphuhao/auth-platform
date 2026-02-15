import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getEnv } from "@/lib/config/env";

export function createAdminClient() {
  const env = getEnv();

  return createClient(env.supabase.url, env.supabase.secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
