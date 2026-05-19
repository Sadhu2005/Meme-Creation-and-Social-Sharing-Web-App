/** Supabase rejects .local emails — use a normal TLD for synthetic auth emails. */
export const SYNTHETIC_EMAIL_DOMAIN = "pet.memeforge.app";

export function petNameToSlug(input: string) {
  return normalizePetNameInput(input)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_]/g, "");
}

export function normalizePetNameInput(input: string) {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Pet name is required.");
  }

  if (trimmed.includes("@") && !trimmed.endsWith(`@${SYNTHETIC_EMAIL_DOMAIN}`)) {
    throw new Error("Use your pet name only — not an email address.");
  }

  if (trimmed.endsWith(`@${SYNTHETIC_EMAIL_DOMAIN}`)) {
    return trimmed.split("@")[0] ?? trimmed;
  }

  return trimmed;
}

export function usernameToEmail(username: string) {
  const slug = petNameToSlug(username);

  if (slug.length < 3) {
    throw new Error("Pet name must be at least 3 letters or numbers.");
  }

  return `${slug}@${SYNTHETIC_EMAIL_DOMAIN}`;
}
