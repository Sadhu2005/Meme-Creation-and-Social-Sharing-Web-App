import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { PublishMemeInput } from "@/types/meme";

export async function publishMemeWithBrowser(input: PublishMemeInput) {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sign in to publish memes.");

  if (!input.title.trim()) throw new Error("Title is required.");
  if (!input.imageDataUrl.startsWith("data:image/")) throw new Error("Invalid image data.");

  const base64 = input.imageDataUrl.split(",")[1];
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const fileName = `${user.id}/${Date.now()}.jpg`;

  let imageUrl = input.imageDataUrl;

  const { error: uploadError } = await supabase.storage
    .from("memes")
    .upload(fileName, bytes, { contentType: "image/jpeg", upsert: false });

  if (!uploadError) {
    const { data: urlData } = supabase.storage.from("memes").getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  const petName =
    (user.user_metadata?.pet_name as string) || (user.user_metadata?.username as string) || "creator";

  await supabase.from("profiles").update({ username: petName }).eq("id", user.id);

  const { error: insertError } = await supabase.from("memes").insert({
    author_id: user.id,
    title: input.title.trim(),
    caption: input.caption.trim() || null,
    image_url: imageUrl,
    status: "published"
  });

  if (insertError) throw new Error(insertError.message);
}
