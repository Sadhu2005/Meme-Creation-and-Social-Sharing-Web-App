"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/context/auth-context";
import {
  addDemoComment,
  listDemoComments,
  toggleDemoLike
} from "@/lib/memes/demo-store";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { addCommentOnDb, toggleLikeOnDb } from "@/server/actions/memes";
import type { Meme, MemeComment } from "@/types/meme";

interface FeedCardProps {
  meme: Meme;
  onUpdate: (meme: Meme) => void;
}

export function FeedCard({ meme, onUpdate }: FeedCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<MemeComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadComments = async () => {
    if (!hasSupabaseEnv()) {
      setComments(listDemoComments(meme.id));
      return;
    }
    const res = await fetch(`/api/memes/${meme.id}/comments`);
    if (res.ok) setComments(await res.json());
  };

  const toggleComments = async () => {
    if (!commentsOpen) await loadComments();
    setCommentsOpen((v) => !v);
  };

  const handleLike = async () => {
    if (!isAuthenticated || !user) return;
    setBusy(true);
    setError("");
    try {
      if (hasSupabaseEnv()) {
        const result = await toggleLikeOnDb(meme.id);
        if (!result.ok) throw new Error(result.message);
        onUpdate({
          ...meme,
          likedByMe: !meme.likedByMe,
          likeCount: meme.likedByMe ? meme.likeCount - 1 : meme.likeCount + 1
        });
      } else {
        const updated = toggleDemoLike(meme.id, user.id);
        if (updated) onUpdate(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Like failed");
    } finally {
      setBusy(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !commentText.trim()) return;
    setBusy(true);
    setError("");
    try {
      if (hasSupabaseEnv()) {
        const result = await addCommentOnDb(meme.id, commentText);
        if (!result.ok) throw new Error(result.message);
        setCommentText("");
        await loadComments();
        onUpdate({ ...meme, commentCount: meme.commentCount + 1 });
      } else {
        const { meme: updated, comment } = addDemoComment(meme.id, commentText, {
          id: user.id,
          username: user.pet_name
        });
        if (updated) onUpdate(updated);
        setComments((c) => [...c, comment]);
        setCommentText("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/90 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.45)]">
      <div className="relative aspect-square w-full bg-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/profile/${meme.authorUsername}`}
              className="text-sm font-medium text-[var(--color-muted)] hover:underline"
            >
              @{meme.authorUsername}
            </Link>
            <h2 className="font-[family:var(--font-display)] text-xl font-semibold text-[var(--color-ink)] sm:text-2xl">
              {meme.title}
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            {meme.status}
          </span>
        </div>

        {meme.caption && (
          <p className="text-sm leading-6 text-[var(--color-muted)]">{meme.caption}</p>
        )}

        {meme.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {meme.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/10 px-2.5 py-0.5 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-black/8 pt-3">
          <button
            type="button"
            disabled={busy || !isAuthenticated}
            onClick={handleLike}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              meme.likedByMe
                ? "bg-[var(--color-accent)] text-[var(--color-ink)]"
                : "bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-black/5"
            } disabled:opacity-50`}
          >
            {meme.likedByMe ? "♥ Liked" : "♡ Like"} · {meme.likeCount}
          </button>
          <button
            type="button"
            onClick={toggleComments}
            className="rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] hover:bg-black/5"
          >
            💬 {meme.commentCount} comments
          </button>
        </div>

        {!isAuthenticated && (
          <p className="text-xs text-[var(--color-muted)]">
            <Link href="/sign-in" className="font-semibold underline">
              Sign in
            </Link>{" "}
            to like and comment.
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {commentsOpen && (
          <div className="space-y-3 rounded-2xl bg-[var(--color-surface)] p-4">
            {comments.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">No comments yet.</p>
            ) : (
              <ul className="space-y-2">
                {comments.map((c) => (
                  <li key={c.id} className="text-sm">
                    <span className="font-semibold text-[var(--color-ink)]">@{c.authorUsername}</span>{" "}
                    <span className="text-[var(--color-muted)]">{c.content}</span>
                  </li>
                ))}
              </ul>
            )}
            {isAuthenticated && (
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment…"
                  className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="shrink-0 rounded-xl bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Post
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
