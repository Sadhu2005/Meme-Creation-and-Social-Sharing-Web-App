import Link from "next/link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/feed", label: "Feed" },
  { href: "/editor", label: "Editor" },
  { href: "/sign-in", label: "Sign in" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-sm font-bold uppercase tracking-[0.25em] text-white">
            MEM
          </div>
          <div>
            <p className="font-[family:var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
              Meme Forge
            </p>
            <p className="text-sm text-[var(--color-muted)]">Create, post, repeat.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-black/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

