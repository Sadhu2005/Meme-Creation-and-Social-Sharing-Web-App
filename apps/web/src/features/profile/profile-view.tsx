"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { FeedCard } from "@/features/feed/feed-card";
import { listDemoMemesByAuthor } from "@/lib/memes/demo-store";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Meme } from "@/types/meme";

interface ProfileViewProps {
  username: string;
  initialMemes?: Meme[];
}

export function ProfileView({ username, initialMemes = [] }: ProfileViewProps) {
  const { user } = useAuth();
  const useSupabase = hasSupabaseEnv();
  const [overrides, setOverrides] = useState<Record<string, Meme>>({});

  const baseMemes = useMemo(
    () => (useSupabase ? initialMemes : listDemoMemesByAuthor(username, user?.id)),
    [useSupabase, initialMemes, username, user?.id]
  );

  const memes = baseMemes.map((meme) => overrides[meme.id] ?? meme);
  const isOwnProfile = user?.pet_name.toLowerCase() === username.toLowerCase();

  const handleUpdate = useCallback((updated: Meme) => {
    setOverrides((prev) => ({ ...prev, [updated.id]: updated }));
  }, []);

  const totalLikes = memes.reduce((sum, m) => sum + m.likeCount, 0);

  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white/90 p-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[linear-gradient(135deg,#4ecdc4_0%,#1a936f_100%)] font-[family:var(--font-display)] text-3xl font-bold text-white">
            {username.slice(0, 2).toUpperCase()}
          </div>
          <h2 className="mt-6 font-[family:var(--font-display)] text-3xl font-semibold">@{username}</h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {isOwnProfile ? "Your creator profile" : "Creator on Meme Forge"}
          </p>
          {isOwnProfile && (
            <Link
              href="/editor"
              className="mt-6 inline-block rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
            >
              New meme
            </Link>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Memes" value={String(memes.length)} />
          <StatCard label="Likes received" value={String(totalLikes)} />
          <StatCard label="Status" value={isOwnProfile ? "You" : "Creator"} />
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-[family:var(--font-display)] text-xl font-semibold">Posts</h3>
        {memes.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">No memes published yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {memes.map((meme) => (
              <FeedCard key={meme.id} meme={meme} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[2rem] border border-black/10 bg-white/90 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</p>
      <p className="mt-4 font-[family:var(--font-display)] text-3xl font-semibold sm:text-4xl">{value}</p>
    </article>
  );
}
