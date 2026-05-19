import { createClient } from "@supabase/supabase-js";

import { usernameToEmail } from "@/lib/auth/username";

export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  if (serviceRoleKey.startsWith("sb_publishable_")) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function findUserByPetName(petName: string) {
  const admin = createAdminSupabaseClient();
  if (!admin) return null;

  const email = usernameToEmail(petName);
  let page = 1;
  const perPage = 200;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(error.message);

    const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;

    if (data.users.length < perPage) break;
    page += 1;
  }

  return null;
}
