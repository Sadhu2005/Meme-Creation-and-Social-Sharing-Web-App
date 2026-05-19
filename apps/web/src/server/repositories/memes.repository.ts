import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Meme, MemeComment } from "@/types/meme";

export async function listFeedMemesFromDb(userId?: string): Promise<Meme[] | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data: memes, error } = await supabase
    .from("memes")
    .select("id, title, caption, image_url, author_id, status, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[feed] memes query failed:", error.message);
    return [];
  }

  if (!memes?.length) return [];

  const authorIds = [...new Set(memes.map((m) => m.author_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", authorIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.username ?? "creator"]));

  const memeIds = memes.map((m) => m.id);

  const [{ data: likes }, { data: comments }] = await Promise.all([
    memeIds.length
      ? supabase.from("likes").select("meme_id, profile_id").in("meme_id", memeIds)
      : Promise.resolve({ data: [] as { meme_id: string; profile_id: string }[] }),
    memeIds.length
      ? supabase.from("comments").select("meme_id").in("meme_id", memeIds)
      : Promise.resolve({ data: [] as { meme_id: string }[] })
  ]);

  const likeRows = likes ?? [];
  const commentRows = comments ?? [];

  return memes.map((row) => {
    const likeCount = likeRows.filter((l) => l.meme_id === row.id).length;
    const commentCount = commentRows.filter((c) => c.meme_id === row.id).length;
    const likedByMe = userId
      ? likeRows.some((l) => l.meme_id === row.id && l.profile_id === userId)
      : false;

    return {
      id: row.id,
      title: row.title,
      caption: row.caption ?? "",
      imageUrl: row.image_url,
      authorId: row.author_id,
      authorUsername: profileMap.get(row.author_id) ?? "creator",
      tags: [],
      likeCount,
      commentCount,
      likedByMe,
      status: row.status as Meme["status"],
      createdAt: row.created_at
    };
  });
}

export async function listMemesByUsernameFromDb(
  username: string,
  userId?: string
): Promise<Meme[] | null> {
  const all = await listFeedMemesFromDb(userId);
  if (all === null) return null;
  return all.filter((m) => m.authorUsername.toLowerCase() === username.toLowerCase());
}

export async function listCommentsFromDb(memeId: string): Promise<MemeComment[] | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("comments")
    .select("id, meme_id, content, created_at, author_id")
    .eq("meme_id", memeId)
    .order("created_at", { ascending: true });

  if (error || !data?.length) return [];

  const authorIds = [...new Set(data.map((c) => c.author_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", authorIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.username ?? "user"]));

  return data.map((row) => ({
    id: row.id,
    memeId: row.meme_id,
    authorId: row.author_id,
    authorUsername: profileMap.get(row.author_id) ?? "user",
    content: row.content,
    createdAt: row.created_at
  }));
}
