import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatAuthError } from "@/lib/auth/supabase-errors";
import { normalizePetNameInput, usernameToEmail } from "@/lib/auth/username";

const DEVICE_KEY = "meme_device_id";
const DEMO_DB_KEY = "meme_demo_users";
const SESSION_KEY = "meme_session";

export interface PetNameUser {
  id: string;
  pet_name: string;
  recovery_key?: string;
}

function getDeviceId() {
  if (typeof window === "undefined") return "";
  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, deviceId);
  }
  return deviceId;
}

async function hashPassword(password: string, salt: string) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits"
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 120_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type StoredUser = {
  user_id: string;
  pet_name: string;
  password_hash: string;
  device_id: string;
  recovery_key: string;
};

function readDemoDb(): StoredUser[] {
  try {
    const raw = localStorage.getItem(DEMO_DB_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeDemoDb(users: StoredUser[]) {
  localStorage.setItem(DEMO_DB_KEY, JSON.stringify(users));
}

export function readPetNameSession(): { user: PetNameUser; token: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as { user: PetNameUser; token: string }) : null;
  } catch {
    return null;
  }
}

export function persistPetNameSession(user: PetNameUser, token: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
}

export function clearPetNameSession() {
  localStorage.removeItem(SESSION_KEY);
  createBrowserSupabaseClient()?.auth.signOut();
}

export async function resetPetNamePassword(
  petName: string,
  recoveryKey: string,
  newPassword: string
) {
  const name = normalizePetNameInput(petName);
  const key = recoveryKey.trim();

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters.");
  }

  const users = readDemoDb();
  const user = users.find((u) => u.pet_name.toLowerCase() === name.toLowerCase());
  if (!user || user.recovery_key !== key) {
    throw new Error("Invalid pet name or recovery key.");
  }

  const salt = crypto.randomUUID();
  user.password_hash = `${salt}:${await hashPassword(newPassword, salt)}`;
  writeDemoDb(users);
}

export async function lookupDemoPetNameByRecoveryKey(recoveryKey: string) {
  const key = recoveryKey.trim();
  const user = readDemoDb().find((u) => u.recovery_key === key);
  if (!user) throw new Error("No account matches this recovery key.");
  return user.pet_name;
}

export async function registerPetName(petName: string, password: string) {
  const supabase = createBrowserSupabaseClient();
  const name = normalizePetNameInput(petName);

  if (supabase) {
    const recovery_key = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
    const { data, error } = await supabase.auth.signUp({
      email: usernameToEmail(name),
      password,
      options: {
        data: { username: name, pet_name: name, device_id: getDeviceId(), recovery_key }
      }
    });
    if (error) throw new Error(formatAuthError(error.message));
    if (!data.user || !data.session) {
      throw new Error(
        "Account created but no session yet. In Supabase turn off “Confirm email”, or check Authentication → Users and sign in."
      );
    }
    return {
      user: { id: data.user.id, pet_name: name, recovery_key },
      token: data.session.access_token,
      recovery_key
    };
  }

  if (name.length < 3) throw new Error("Pet name must be at least 3 characters.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");

  const users = readDemoDb();
  const deviceId = getDeviceId();
  if (users.some((u) => u.pet_name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Pet name already taken.");
  }
  if (users.some((u) => u.device_id === deviceId)) {
    throw new Error("This device already has an account.");
  }

  const salt = crypto.randomUUID();
  const password_hash = `${salt}:${await hashPassword(password, salt)}`;
  const recovery_key = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
  const stored: StoredUser = {
    user_id: crypto.randomUUID(),
    pet_name: name,
    password_hash,
    device_id: deviceId,
    recovery_key
  };
  users.push(stored);
  writeDemoDb(users);

  const token = btoa(`${stored.user_id}:${Date.now()}`);
  return {
    user: { id: stored.user_id, pet_name: name, recovery_key },
    token,
    recovery_key
  };
}

export async function loginPetName(petName: string, password: string) {
  const supabase = createBrowserSupabaseClient();
  const name = normalizePetNameInput(petName);

  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(name),
      password
    });
    if (error) throw new Error(formatAuthError(error.message));
    if (!data.session) throw new Error("Login failed.");
    const user: PetNameUser = {
      id: data.user.id,
      pet_name:
        (data.user.user_metadata?.pet_name as string) ||
        (data.user.user_metadata?.username as string) ||
        name
    };
    persistPetNameSession(user, data.session.access_token);
    return { user, token: data.session.access_token };
  }

  const users = readDemoDb();
  const deviceId = getDeviceId();
  const stored = users.find((u) => u.pet_name.toLowerCase() === name.toLowerCase());
  if (!stored) throw new Error("Invalid credentials.");

  const [salt, expected] = stored.password_hash.split(":");
  const actual = await hashPassword(password, salt);
  if (actual !== expected) throw new Error("Invalid credentials.");
  if (stored.device_id !== deviceId) throw new Error("Unauthorized device.");

  const user: PetNameUser = { id: stored.user_id, pet_name: stored.pet_name };
  const token = btoa(`${stored.user_id}:${Date.now()}`);
  persistPetNameSession(user, token);
  return { user, token };
}
