import { PageIntro } from "@/components/shared/page-intro";
import { RecoverCard } from "@/features/auth/recover-card";

export default function RecoverPage() {
  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Recovery"
        title="Forgot password or pet name?"
        description="Use the recovery key you saved when you created your account. Email reset is not used on this app."
      />
      <RecoverCard />
    </div>
  );
}
