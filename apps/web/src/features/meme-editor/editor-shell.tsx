export function EditorShell() {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr_0.8fr]">
      <aside className="rounded-[2rem] border border-black/10 bg-white/90 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
          Controls
        </p>
        <div className="mt-5 space-y-4">
          <Control label="Template" value="Classic Top And Bottom Text" />
          <Control label="Top text" value="WHEN THE MVP ACTUALLY SHIPS" />
          <Control label="Bottom text" value="AND THE DEMO WORKS ON FIRST TRY" />
          <Control label="Font size" value="64 px" />
          <Control label="Stroke" value="Black / 6 px" />
        </div>
      </aside>

      <div className="rounded-[2.5rem] border border-black/10 bg-[linear-gradient(180deg,#ffffff_0%,#fff4e2_100%)] p-5 shadow-[0_30px_90px_-48px_rgba(15,23,42,0.55)]">
        <div className="rounded-[2rem] border border-dashed border-black/10 bg-[linear-gradient(135deg,#ffd166_0%,#4ecdc4_100%)] p-4">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_top,#ffffff_0%,#fde7c1_45%,#f1c27d_100%)]">
            <p className="absolute top-6 px-6 text-center font-[family:var(--font-display)] text-2xl font-bold tracking-wide text-[var(--color-ink)] sm:text-4xl">
              WHEN THE MVP ACTUALLY SHIPS
            </p>
            <div className="mx-8 rounded-[1.75rem] border border-black/10 bg-white/60 px-8 py-12 text-center shadow-inner">
              <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-muted)]">Canvas Preview</p>
              <p className="mt-4 max-w-md text-base leading-7 text-[var(--color-ink)]">
                This is the editor stage placeholder. The next step is wiring in image uploads, text layer dragging,
                and export via `react-konva`.
              </p>
            </div>
            <p className="absolute bottom-6 px-6 text-center font-[family:var(--font-display)] text-2xl font-bold tracking-wide text-[var(--color-ink)] sm:text-4xl">
              AND THE DEMO WORKS ON FIRST TRY
            </p>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-black/10 bg-white/90 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Publish checklist
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
            <li>Title and caption ready</li>
            <li>Template selected</li>
            <li>Image export flow to storage pending</li>
            <li>Post insert action scaffolded</li>
          </ul>
        </div>

        <div className="rounded-[2rem] bg-[var(--color-ink)] p-6 text-white">
          <p className="font-[family:var(--font-display)] text-2xl font-semibold">Next build target</p>
          <p className="mt-3 text-sm leading-6 text-white/75">
            Add client-side canvas editing, upload the rendered image to Supabase Storage, then save the post metadata
            in the `memes` table.
          </p>
        </div>
      </aside>
    </section>
  );
}

function Control({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-[var(--color-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

