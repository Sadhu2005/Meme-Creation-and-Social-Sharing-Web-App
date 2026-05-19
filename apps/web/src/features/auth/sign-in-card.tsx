"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { loginPetName } from "@/lib/auth/pet-name";
import { getSupabaseEnvError, hasSupabaseEnv } from "@/lib/supabase/env";

export function SignInCard() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [petName, setPetName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const envError = getSupabaseEnvError();
    if (envError) {
      setError(envError);
      return;
    }
    setLoading(true);
    try {
      await loginPetName(petName, password);
      refresh();
      router.push("/feed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-black/10 bg-[var(--color-ink)] p-8 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
          Creator access
        </p>
        <h2 className="mt-4 font-[family:var(--font-display)] text-3xl font-semibold">
          Sign in with your pet name — no email required.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">
          {hasSupabaseEnv()
            ? "Connected to Supabase Auth. One identity per device for privacy."
            : "Demo mode stores your account securely on this device until Supabase keys are added."}
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white/90 p-8">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label htmlFor="petName" className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
              Pet name
            </label>
            <input
              id="petName"
              type="text"
              placeholder="Your anonymous username"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-[var(--color-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
              required
              minLength={3}
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-[var(--color-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
              required
              minLength={6}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:translate-y-[-1px] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
          <Link href="/recover" className="font-semibold text-[var(--color-ink)] underline">
            Forgot password or pet name?
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
          New here?{" "}
          <Link href="/sign-up" className="font-semibold text-[var(--color-ink)] underline">
            Create an identity
          </Link>
        </p>
      </div>
    </section>
  );
}
