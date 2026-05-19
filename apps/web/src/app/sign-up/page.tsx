import { PageIntro } from "@/components/shared/page-intro";
import { SignUpCard } from "@/features/auth/sign-up-card";

export default function SignUpPage() {
  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Join"
        title="Create your anonymous creator identity"
        description="Privacy-first signup aligned with the internship project — no email required."
      />
      <SignUpCard />
    </div>
  );
}
