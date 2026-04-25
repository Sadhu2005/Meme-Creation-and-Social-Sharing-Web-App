interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-[family:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-[var(--color-muted)] sm:text-lg">{description}</p>
    </div>
  );
}

