"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { RecoveryKeyBox } from "@/components/shared/recovery-key-box";
import { useAuth } from "@/context/auth-context";
import { loginPetName, persistPetNameSession, registerPetName } from "@/lib/auth/pet-name";

export function SignUpCard() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [petName, setPetName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [pending, setPending] = useState<{ petName: string; password: string } | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await registerPetName(petName, password);
      setRecoveryKey(result.recovery_key);
      setPending({ petName, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const finishSignup = async () => {
    if (!pending) return;
    setLoading(true);
    try {
      const result = await loginPetName(pending.petName, pending.password);
      persistPetNameSession(result.user, result.token);
      refresh();
      router.push("/feed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  if (recoveryKey) {
    return (
      <section className="mx-auto max-w-lg rounded-[2rem] border border-black/10 bg-white/90 p-8">
        <h2 className="font-[family:var(--font-display)] text-2xl font-semibold">Save your recovery key</h2>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Store this offline — it is the only way to recover your account.
        </p>
        <RecoveryKeyBox recoveryKey={recoveryKey} />
        <button
          type="button"
          onClick={finishSignup}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
        >
          {loading ? "Entering…" : "I saved it — continue"}
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg rounded-[2rem] border border-black/10 bg-white/90 p-8">
      <h2 className="font-[family:var(--font-display)] text-2xl font-semibold">Create identity</h2>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        No email or phone — pet name + password only. Spaces are fine (e.g. Sadhu Maharaj).
      </p>
      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="petName" className="mb-2 block text-sm font-medium">
            Pet name
          </label>
          <input
            id="petName"
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
            required
            minLength={3}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
            required
            minLength={6}
          />
        </div>
        {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Have an account?{" "}
        <Link href="/sign-in" className="font-semibold underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}
