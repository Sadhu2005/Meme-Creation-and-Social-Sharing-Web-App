"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { PublishMemeInput } from "@/types/meme";

export async function publishMemeToDb(input: PublishMemeInput) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false as const, message: "Supabase is not configured." };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, message: "Sign in to publish memes." };
  }

  if (!input.title.trim()) {
    return { ok: false as const, message: "Title is required." };
  }

  if (!input.imageDataUrl.startsWith("data:image/")) {
    return { ok: false as const, message: "Invalid image data." };
  }

  const base64 = input.imageDataUrl.split(",")[1];
  const buffer = Buffer.from(base64, "base64");
  const fileName = `${user.id}/${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("memes")
    .upload(fileName, buffer, { contentType: "image/jpeg", upsert: false });

  let imageUrl = input.imageDataUrl;

  if (!uploadError) {
    const { data: urlData } = supabase.storage.from("memes").getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  const { error: insertError } = await supabase.from("memes").insert({
    author_id: user.id,
    title: input.title.trim(),
    caption: input.caption.trim() || null,
    image_url: imageUrl,
    status: "published"
  });

  if (insertError) {
    return { ok: false as const, message: insertError.message };
  }

  revalidatePath("/feed");
  revalidatePath("/profile/[username]", "page");

  return { ok: true as const, message: "Meme published!" };
}

export async function toggleLikeOnDb(memeId: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { ok: false as const, message: "Supabase not configured." };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, message: "Sign in to like memes." };

  const { data: existing } = await supabase
    .from("likes")
    .select("meme_id")
    .eq("meme_id", memeId)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("meme_id", memeId).eq("profile_id", user.id);
  } else {
    await supabase.from("likes").insert({ meme_id: memeId, profile_id: user.id });
  }

  revalidatePath("/feed");
  return { ok: true as const };
}

export async function addCommentOnDb(memeId: string, content: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { ok: false as const, message: "Supabase not configured." };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, message: "Sign in to comment." };

  if (!content.trim()) {
    return { ok: false as const, message: "Comment cannot be empty." };
  }

  const { error } = await supabase.from("comments").insert({
    meme_id: memeId,
    author_id: user.id,
    content: content.trim()
  });

  if (error) return { ok: false as const, message: error.message };

  revalidatePath("/feed");
  return { ok: true as const };
}
