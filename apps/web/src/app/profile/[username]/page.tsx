import { PageIntro } from "@/components/shared/page-intro";
import { ProfileView } from "@/features/profile/profile-view";
import { listMemesByUsernameFromDb } from "@/server/repositories/memes.repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createServerSupabaseClient();
  let userId: string | undefined;

  if (supabase) {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    userId = user?.id;
  }

  const initialMemes = (await listMemesByUsernameFromDb(username, userId)) ?? [];

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Profile"
        title={`@${username}`}
        description="Creator posts and stats from the meme feed."
      />
      <ProfileView username={username} initialMemes={initialMemes} />
    </div>
  );
}
