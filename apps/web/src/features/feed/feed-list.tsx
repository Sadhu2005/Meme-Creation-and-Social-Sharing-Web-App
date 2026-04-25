import type { MemePreview } from "@/types/meme";

interface FeedListProps {
  memes: MemePreview[];
}

export function FeedList({ memes }: FeedListProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {memes.map((meme) => (
        <article
          key={meme.id}
          className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/90 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.45)]"
        >
          <div className="border-b border-black/10 bg-[linear-gradient(135deg,#ffd166_0%,#ff8a5b_45%,#4ecdc4_100%)] p-6">
            <div className="rounded-[1.5rem] border border-white/30 bg-black/15 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/90">{meme.title}</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/85">{meme.imageLabel}</p>
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Posted by @{meme.author.toLowerCase()}</p>
                <h2 className="font-[family:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                  {meme.title}
                </h2>
              </div>
              <span className="rounded-full bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                {meme.status}
              </span>
            </div>

            <p className="text-sm leading-6 text-[var(--color-muted)]">{meme.caption}</p>

            <div className="flex flex-wrap gap-2">
              {meme.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-[var(--color-ink)]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
              <span>{meme.likes} likes</span>
              <span>{meme.comments} comments</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

