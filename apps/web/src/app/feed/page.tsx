import { PageIntro } from "@/components/shared/page-intro";
import { FeedList } from "@/features/feed/feed-list";
import { getFeedPreview } from "@/server/services/feed.service";

export default async function FeedPage() {
  const memes = await getFeedPreview();

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Community feed"
        title="Preview the content surface before wiring in live queries."
        description="The feed is already structured around reusable cards and a server-side service layer, so replacing mock data with Supabase queries is straightforward."
      />
      <FeedList memes={memes} />
    </div>
  );
}

