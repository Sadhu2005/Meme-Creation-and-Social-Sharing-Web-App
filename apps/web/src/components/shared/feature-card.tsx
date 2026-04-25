import { cx } from "@/lib/utils/cx";

interface FeatureCardProps {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ eyebrow, title, description, className }: FeatureCardProps) {
  return (
    <article
      className={cx(
        "rounded-[2rem] border border-black/10 bg-white/90 p-6 shadow-[0_22px_80px_-48px_rgba(16,24,40,0.55)]",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{description}</p>
    </article>
  );
}

