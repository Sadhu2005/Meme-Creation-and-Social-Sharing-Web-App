export function formatAuthError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many signup attempts. Wait 15–60 minutes, or raise the limit in Supabase → Authentication → Rate limits.";
  }

  if (lower.includes("invalid") && lower.includes("email")) {
    return "Could not create account. Try a shorter pet name (letters and numbers only).";
  }

  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "This pet name is already taken. Sign in instead, or pick another name.";
  }

  return message;
}
