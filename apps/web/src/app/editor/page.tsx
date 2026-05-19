import { PageIntro } from "@/components/shared/page-intro";
import { EditorShell } from "@/features/meme-editor/editor-shell";

export default function EditorPage() {
  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Editor"
        title="Create and publish memes"
        description="Upload an image or pick a template, add top and bottom text, then publish to the feed."
      />
      <EditorShell />
    </div>
  );
}
