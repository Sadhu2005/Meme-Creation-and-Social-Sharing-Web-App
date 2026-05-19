"use client";

import { useCallback, useEffect, useState } from "react";

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
  const [memes, setMemes] = useState<Meme[]>(initialMemes);
  const [loading, setLoading] = useState(false);

  const loadFromSupabase = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/memes/feed", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as Meme[];
        setMemes(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDemo = useCallback(() => {
    setMemes(listDemoMemes(user?.id));
  }, [user?.id]);

  useEffect(() => {
    if (hasSupabaseEnv()) {
      loadFromSupabase();
    } else {
      loadDemo();
    }
  }, [loadFromSupabase, loadDemo]);

  const handleUpdate = (updated: Meme) => {
    setMemes((list) => list.map((m) => (m.id === updated.id ? updated : m)));
  };

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

