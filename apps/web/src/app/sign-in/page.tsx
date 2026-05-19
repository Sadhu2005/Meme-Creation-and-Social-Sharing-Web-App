import { PageIntro } from "@/components/shared/page-intro";
import { SignInCard } from "@/features/auth/sign-in-card";

export default function SignInPage() {
  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Authentication"
        title="Sign in with your pet name"
        description="Privacy-first auth — no email or phone. One account per device."
      />
      <SignInCard />
    </div>
  );
}

