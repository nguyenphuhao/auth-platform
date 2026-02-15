import { cookies } from "next/headers";
import { createServerClient as createSsrServerClient } from "@supabase/ssr";

import { getEnv } from "@/lib/config/env";

export async function createServerClient() {
  const env = getEnv();
  const cookieStore = await cookies();
  type CookieToSet = {
    name: string;
    value: string;
    options?: Record<string, unknown>;
  };
  const mutableCookieStore = cookieStore as unknown as {
    getAll: () => Array<{ name: string; value: string }>;
    set: (name: string, value: string, options?: Record<string, unknown>) => void;
  };

  return createSsrServerClient(env.supabase.url, env.supabase.publishableKey, {
    cookies: {
      getAll() {
        return mutableCookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            mutableCookieStore.set(name, value, options);
          } catch {
            // No-op for contexts where response cookies are immutable.
          }
        });
      }
    }
  });
}
