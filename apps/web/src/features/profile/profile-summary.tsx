interface ProfileSummaryProps {
  username: string;
}

export function ProfileSummary({ username }: ProfileSummaryProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <div className="rounded-[2rem] border border-black/10 bg-white/90 p-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[linear-gradient(135deg,#4ecdc4_0%,#1a936f_100%)] font-[family:var(--font-display)] text-3xl font-bold text-white">
          {username.slice(0, 2).toUpperCase()}
        </div>
        <h2 className="mt-6 font-[family:var(--font-display)] text-3xl font-semibold text-[var(--color-ink)]">
          @{username}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Profile records will be read from Supabase once auth and profile queries are wired in. This page already
          matches the app structure we planned.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Memes" value="24" />
        <StatCard label="Followers" value="1.2k" />
        <StatCard label="Saved" value="87" />
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[2rem] border border-black/10 bg-white/90 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</p>
      <p className="mt-4 font-[family:var(--font-display)] text-4xl font-semibold text-[var(--color-ink)]">{value}</p>
    </article>
  );
}

