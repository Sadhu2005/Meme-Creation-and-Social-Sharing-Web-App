"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import {
  clearPetNameSession,
  readPetNameSession,
  type PetNameUser
} from "@/lib/auth/pet-name";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface AuthContextValue {
  user: PetNameUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readInitialUser(): PetNameUser | null {
  if (typeof window === "undefined") return null;
  return readPetNameSession()?.user ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PetNameUser | null>(readInitialUser);

  const refresh = useCallback(() => {
    const session = readPetNameSession();
    setUser(session?.user ?? null);
  }, []);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          pet_name:
            (session.user.user_metadata?.pet_name as string) ||
            (session.user.user_metadata?.username as string) ||
            "Creator"
        });
      } else if (!readPetNameSession()) {
        setUser(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    clearPetNameSession();
    setUser(null);
    await createBrowserSupabaseClient()?.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading: false,
      isAuthenticated: Boolean(user),
      refresh,
      signOut
    }),
    [user, refresh, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useRequiresAuth() {
  const auth = useAuth();
  return { ...auth, needsSignIn: !auth.isAuthenticated };
}
