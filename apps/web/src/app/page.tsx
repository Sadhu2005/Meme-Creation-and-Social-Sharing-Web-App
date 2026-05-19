import Link from "next/link";

import { FeatureCard } from "@/components/shared/feature-card";

const features = [
  {
    eyebrow: "Create",
    title: "A meme editor designed for speed",
    description: "Build the first meme fast with templates, bold text layers, and export-friendly composition."
  },
  {
    eyebrow: "Share",
    title: "A social feed that feels alive",
    description: "Publish to a clean feed with reactions, comments, saved posts, and creator profiles."
  },
  {
    eyebrow: "Scale",
    title: "A stack that stays cheap early",
    description: "Run the MVP on Vercel and Supabase, then add more services only when the traffic asks for it."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 rounded-[2.5rem] bg-[linear-gradient(135deg,#182430_0%,#29435c_55%,#182430_100%)] px-6 py-10 text-white shadow-[0_35px_100px_-55px_rgba(15,23,42,0.95)] sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-accent-soft)]">
            Build the meme platform
          </p>
          <h1 className="mt-4 max-w-2xl font-[family:var(--font-display)] text-5xl font-semibold tracking-tight sm:text-6xl">
            Create memes, ship an audience-ready feed, and grow from one repo.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/76">
            Privacy-first meme social app — create with the canvas editor, publish to the feed, like and comment. No email
            or phone required to join.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/editor"
              className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:translate-y-[-1px]"
            >
              Open editor
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Join free
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white/8 p-4 backdrop-blur">
          <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,#fff4de_0%,#ffffff_100%)] p-5 text-[var(--color-ink)]">
            <div className="rounded-[1.5rem] border border-black/10 bg-[linear-gradient(135deg,#ffd166_0%,#ff8a5b_100%)] p-4">
              <div className="rounded-[1.25rem] bg-black/10 px-4 py-14 text-center text-white backdrop-blur">
                <p className="font-[family:var(--font-display)] text-3xl font-bold">WHEN THE BUILD FINALLY PASSES</p>
                <p className="mt-12 text-sm uppercase tracking-[0.28em] text-white/80">Meme Canvas Preview</p>
                <p className="mt-12 font-[family:var(--font-display)] text-3xl font-bold">AND YOU DIDN&apos;T TOUCH PROD</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Metric label="Creator pages" value="Ready" />
              <Metric label="Supabase hooks" value="Wired" />
              <Metric label="Feed surface" value="Live" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-black/10 bg-[var(--color-surface)] px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</p>
      <p className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold">{value}</p>
    </div>
  );
}

