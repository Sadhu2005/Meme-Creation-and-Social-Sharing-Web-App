import { createBrowserClient } from "@supabase/ssr";

import { readSupabaseEnv } from "@/lib/supabase/env";

export function createBrowserSupabaseClient() {
  const env = readSupabaseEnv();

  if (!env) {
    return null;
  }

  return createBrowserClient(env.url, env.anonKey);
}

