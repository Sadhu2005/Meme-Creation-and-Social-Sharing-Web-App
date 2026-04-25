import { PageIntro } from "@/components/shared/page-intro";
import { ProfileSummary } from "@/features/profile/profile-summary";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Profile"
        title={`Creator profile for @${username}`}
        description="Profile routes are in place and ready to load live creator data, post grids, and saved memes from Supabase."
      />
      <ProfileSummary username={username} />
    </div>
  );
}

