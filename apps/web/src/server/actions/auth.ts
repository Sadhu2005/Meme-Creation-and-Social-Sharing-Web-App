"use server";

import { createAdminSupabaseClient, findUserByPetName } from "@/lib/supabase/admin";
import { normalizePetNameInput } from "@/lib/auth/username";

export async function resetPasswordWithRecoveryKey(input: {
  petName: string;
  recoveryKey: string;
  newPassword: string;
}) {
  const petName = normalizePetNameInput(input.petName);
  const recoveryKey = input.recoveryKey.trim();
  const newPassword = input.newPassword;

  if (recoveryKey.length < 12) {
    return { ok: false as const, message: "Recovery key looks too short." };
  }

  if (newPassword.length < 6) {
    return { ok: false as const, message: "New password must be at least 6 characters." };
  }

  const admin = createAdminSupabaseClient();
  if (!admin) {
    return {
      ok: false as const,
      message:
        "Password reset needs SUPABASE_SERVICE_ROLE_KEY on the server. Use demo mode locally or add the secret key in Vercel (server only)."
    };
  }

  const user = await findUserByPetName(petName);
  if (!user) {
    return { ok: false as const, message: "No account found for that pet name." };
  }

  const storedKey = user.user_metadata?.recovery_key as string | undefined;
  if (!storedKey || storedKey !== recoveryKey) {
    return { ok: false as const, message: "Invalid recovery key for this pet name." };
  }

  const { error } = await admin.auth.admin.updateUserById(user.id, { password: newPassword });
  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const, message: "Password updated. You can sign in now." };
}

export async function lookupPetNameByRecoveryKey(recoveryKey: string) {
  const key = recoveryKey.trim();
  if (key.length < 12) {
    return { ok: false as const, message: "Enter your full recovery key." };
  }

  const admin = createAdminSupabaseClient();
  if (!admin) {
    return { ok: false as const, message: "Lookup requires server configuration." };
  }

  let page = 1;
  const perPage = 200;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) return { ok: false as const, message: error.message };

    const user = data.users.find((u) => (u.user_metadata?.recovery_key as string) === key);
    if (user) {
      const petName =
        (user.user_metadata?.pet_name as string) ||
        (user.user_metadata?.username as string) ||
        user.email?.split("@")[0] ||
        "";
      return { ok: true as const, petName };
    }

    if (data.users.length < perPage) break;
    page += 1;
  }

  return { ok: false as const, message: "No account matches this recovery key." };
}
