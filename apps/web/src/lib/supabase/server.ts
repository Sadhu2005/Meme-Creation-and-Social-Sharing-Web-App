import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";

import { readSupabaseEnv } from "@/lib/supabase/env";

export async function createServerSupabaseClient() {
  const env = readSupabaseEnv();

  if (!env) {
    return null;
  }

  const cookieStore = await cookies();
  const setAll: SetAllCookies = (cookiesToSet) => {
    try {
      cookiesToSet.forEach(({ name, value, options }) => {
        cookieStore.set(name, value, options);
      });
    } catch {
      // Server Components can read cookies but might not be allowed to write them.
    }
  };

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll
    }
  });
}
