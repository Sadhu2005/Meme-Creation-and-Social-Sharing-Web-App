"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  lookupDemoPetNameByRecoveryKey,
  resetPetNamePassword
} from "@/lib/auth/pet-name";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { lookupPetNameByRecoveryKey, resetPasswordWithRecoveryKey } from "@/server/actions/auth";

export function RecoverCard() {
  const router = useRouter();
  const [petName, setPetName] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);

  const onLookupPetName = async () => {
    setError("");
    setMessage("");
    setLookupLoading(true);
    try {
      if (hasSupabaseEnv()) {
        const result = await lookupPetNameByRecoveryKey(recoveryKey);
        if (!result.ok) throw new Error(result.message);
        setPetName(result.petName);
        setMessage(`Found account: @${result.petName}`);
      } else {
        const name = await lookupDemoPetNameByRecoveryKey(recoveryKey);
        setPetName(name);
        setMessage(`Found account: @${name}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLookupLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (hasSupabaseEnv()) {
        const result = await resetPasswordWithRecoveryKey({
          petName,
          recoveryKey,
          newPassword
        });
        if (!result.ok) throw new Error(result.message);
        setMessage(result.message);
      } else {
        await resetPetNamePassword(petName, recoveryKey, newPassword);
        setMessage("Password updated. You can sign in now.");
      }
      setTimeout(() => router.push("/sign-in"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg space-y-6">
      <div className="rounded-[2rem] border border-black/10 bg-[var(--color-ink)] p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
          Account recovery
        </p>
        <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold">
          Reset password with your recovery key
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/75">
          We do not use email reset. When you signed up, you received a one-time recovery key — that is how you get back
          in if you forget your password or pet name.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-[2rem] border border-black/10 bg-white/90 p-6 sm:p-8"
      >
        <div>
          <label htmlFor="recoveryKey" className="mb-2 block text-sm font-medium">
            Recovery key
          </label>
          <input
            id="recoveryKey"
            value={recoveryKey}
            onChange={(e) => setRecoveryKey(e.target.value)}
            placeholder="Paste the key you saved at signup"
            className="w-full rounded-2xl border border-black/10 bg-[var(--color-surface)] px-4 py-3 font-mono text-sm outline-none focus:border-[var(--color-accent)]"
            required
            minLength={12}
          />
          <button
            type="button"
            onClick={onLookupPetName}
            disabled={lookupLoading || recoveryKey.length < 12}
            className="mt-2 text-sm font-semibold text-[var(--color-ink)] underline disabled:opacity-50"
          >
            {lookupLoading ? "Looking up…" : "Forgot pet name? Look up from recovery key"}
          </button>
        </div>

        <div>
          <label htmlFor="petName" className="mb-2 block text-sm font-medium">
            Pet name
          </label>
          <input
            id="petName"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Your username (not email)"
            className="w-full rounded-2xl border border-black/10 bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
            required
            minLength={3}
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-2 block text-sm font-medium">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
            required
            minLength={6}
          />
        </div>

        {message && (
          <p className="rounded-2xl bg-green-500/10 px-4 py-3 text-sm text-green-800">{message}</p>
        )}
        {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-60"
        >
          {loading ? "Updating…" : "Reset password"}
        </button>

        <p className="text-center text-sm text-[var(--color-muted)]">
          <Link href="/sign-in" className="font-semibold underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </section>
  );
}
