import { PageIntro } from "@/components/shared/page-intro";
import { SignInCard } from "@/features/auth/sign-in-card";

export default function SignInPage() {
  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Authentication"
        title="Connect Supabase auth and bring creators into the app."
        description="This page is ready for email login, OAuth, protected routes, and profile creation once your Supabase credentials are added."
      />
      <SignInCard />
    </div>
  );
}

