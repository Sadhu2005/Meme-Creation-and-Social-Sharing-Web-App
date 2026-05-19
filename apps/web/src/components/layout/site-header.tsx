"use client";

import Link from "next/link";

import { useAuth } from "@/context/auth-context";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/feed", label: "Feed" },
  { href: "/editor", label: "Editor" }
];

export function SiteHeader() {
  const { user, isAuthenticated, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-sm font-bold uppercase tracking-[0.25em] text-white">
            MEM
          </div>
          <div className="min-w-0">
            <p className="truncate font-[family:var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
              Meme Forge
            </p>
            <p className="hidden text-sm text-[var(--color-muted)] sm:block">Create, post, repeat.</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-xs font-medium text-[var(--color-ink)] transition hover:bg-black/5 sm:px-4 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}

          {!loading && isAuthenticated && user ? (
            <>
              <Link
                href={`/profile/${user.pet_name}`}
                className="max-w-[8rem] truncate rounded-full bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold sm:max-w-none sm:px-4 sm:text-sm"
              >
                @{user.pet_name}
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-full px-3 py-2 text-xs font-medium text-[var(--color-muted)] hover:bg-black/5 sm:text-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold text-[var(--color-ink)] sm:px-4 sm:text-sm"
              >
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
