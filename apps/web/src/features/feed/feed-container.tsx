"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { listDemoMemes } from "@/lib/memes/demo-store";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Meme } from "@/types/meme";

import { FeedCard } from "./feed-card";

interface FeedContainerProps {
  initialMemes?: Meme[];
}

export function FeedContainer({ initialMemes = [] }: FeedContainerProps) {
  const { user } = useAuth();
  const useSupabase = hasSupabaseEnv();

  const demoMemes = useMemo(
    () => (useSupabase ? [] : listDemoMemes(user?.id)),
    [useSupabase, user?.id]
  );

  const [supabaseMemes, setSupabaseMemes] = useState<Meme[]>(initialMemes);
  const [loading, setLoading] = useState(useSupabase);
  const [overrides, setOverrides] = useState<Record<string, Meme>>({});

  useEffect(() => {
    if (!useSupabase) return;

    let active = true;

    void (async () => {
      try {
        const res = await fetch("/api/memes/feed", { cache: "no-store" });
        if (!active || !res.ok) return;
        const data = (await res.json()) as Meme[];
        setSupabaseMemes(data);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [useSupabase, user?.id]);

  const baseMemes = useSupabase ? supabaseMemes : demoMemes;
  const memes = baseMemes.map((meme) => overrides[meme.id] ?? meme);

  const handleUpdate = useCallback((updated: Meme) => {
    setOverrides((prev) => ({ ...prev, [updated.id]: updated }));
  }, []);

  if (loading && memes.length === 0) {
    return <p className="text-center text-[var(--color-muted)]">Loading feed…</p>;
  }

  if (memes.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-black/15 bg-white/80 p-10 text-center">
        <p className="text-lg font-semibold text-[var(--color-ink)]">No memes yet</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Be the first to publish from the editor.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {memes.map((meme) => (
        <FeedCard key={meme.id} meme={meme} onUpdate={handleUpdate} />
      ))}
    </div>
  );
}
