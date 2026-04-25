import { PageIntro } from "@/components/shared/page-intro";
import { EditorShell } from "@/features/meme-editor/editor-shell";

export default function EditorPage() {
  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Editor"
        title="A dedicated workspace for building and publishing memes."
        description="This is the foundation for the interactive meme canvas. The next pass should wire in drag-and-drop text layers, uploads, and export-to-storage."
      />
      <EditorShell />
    </div>
  );
}

