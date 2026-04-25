export function SignInCard() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-black/10 bg-[var(--color-ink)] p-8 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
          Creator access
        </p>
        <h2 className="mt-4 font-[family:var(--font-display)] text-3xl font-semibold">
          Sign in and start posting memes in minutes.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">
          The auth wiring is ready for Supabase. Once your keys are added, this page becomes the live
          entry point for email auth, social login, and protected publishing.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white/90 p-8">
        <form className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-black/10 bg-[var(--color-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
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
              className="w-full rounded-2xl border border-black/10 bg-[var(--color-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-accent)]"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:translate-y-[-1px]"
          >
            Continue with Supabase
          </button>
        </form>
      </div>
    </section>
  );
}

