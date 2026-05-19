import Link from "next/link";

import { PageIntro } from "@/components/shared/page-intro";
import { FeedContainer } from "@/features/feed/feed-container";
import { getFeedMemes } from "@/server/services/feed.service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function FeedPage() {
  const supabase = await createServerSupabaseClient();
  let userId: string | undefined;

  if (supabase) {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    userId = user?.id;
  }

  const initialMemes = await getFeedMemes(userId);

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Community feed"
        title="Latest memes from creators"
        description="Like, comment, and explore — privacy-first accounts with no email required."
      />
      <div className="flex justify-end">
        <Link
          href="/editor"
          className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
        >
          Create meme
        </Link>
      </div>
      <FeedContainer initialMemes={initialMemes} />
    </div>
  );
}
