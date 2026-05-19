export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

export function readSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (anonKey.startsWith("sb_secret_")) {
    return null;
  }

  return { url, anonKey };
}

export function getSupabaseEnvError(): string | null {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (anonKey?.startsWith("sb_secret_")) {
    return "Use the publishable key in NEXT_PUBLIC_SUPABASE_ANON_KEY, not the secret key.";
  }
  return null;
}

export function hasSupabaseEnv() {
  return readSupabaseEnv() !== null;
}

