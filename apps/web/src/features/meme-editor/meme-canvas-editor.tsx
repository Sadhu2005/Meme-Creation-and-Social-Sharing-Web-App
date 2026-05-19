"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { publishDemoMeme } from "@/lib/memes/demo-store";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { publishMemeWithBrowser } from "@/lib/memes/publish-client";

const TEMPLATES = [
  {
    name: "Coder desk",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&h=900&fit=crop"
  },
  {
    name: "Reaction",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=900&fit=crop"
  },
  {
    name: "Team vibe",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=900&fit=crop"
  }
];

export function MemeCanvasEditor() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const drawCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxWidth = Math.min(640, canvas.parentElement?.clientWidth ?? 640);
    const scale = maxWidth / image.width;
    canvas.width = maxWidth;
    canvas.height = image.height * scale;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.max(2, Math.floor(canvas.width / 120));
    ctx.font = `bold ${Math.floor(canvas.width / 10)}px Impact, "Arial Black", sans-serif`;
    ctx.textAlign = "center";
    ctx.lineJoin = "round";

    if (topText) {
      ctx.textBaseline = "top";
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 12);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 12);
    }

    if (bottomText) {
      ctx.textBaseline = "bottom";
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 12);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 12);
    }
  }, [image, topText, bottomText]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const loadImageFromUrl = (url: string) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImage(img);
    img.src = url;
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => setImage(img);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!isAuthenticated || !user) {
      router.push("/sign-in");
      return;
    }
    if (!image || !canvasRef.current) {
      setError("Add an image first.");
      return;
    }
    if (!title.trim()) {
      setError("Give your meme a title.");
      return;
    }

    setPosting(true);
    setError("");

    const imageDataUrl = canvasRef.current.toDataURL("image/jpeg", 0.92);
    const payload = {
      title: title.trim(),
      caption: caption.trim(),
      imageDataUrl,
      tags: ["meme"]
    };

    try {
      if (hasSupabaseEnv()) {
        await publishMemeWithBrowser(payload);
      } else {
        publishDemoMeme(payload, { id: user.id, username: user.pet_name });
      }
      router.push("/feed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish");
    } finally {
      setPosting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white/90 p-8 text-center">
        <p className="text-lg font-semibold text-[var(--color-ink)]">Sign in to create memes</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Privacy-first accounts — pet name only, no email required.
        </p>
        <button
          type="button"
          onClick={() => router.push("/sign-in")}
          className="mt-6 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)]"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <aside className="space-y-4 rounded-[2rem] border border-black/10 bg-white/90 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
          Create
        </p>

        {!image ? (
          <>
            <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-black/15 bg-[var(--color-surface)] px-4 py-8 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-accent)]">
              Upload image
              <input type="file" accept="image/*" className="sr-only" onChange={handleUpload} />
            </label>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Or pick a template
            </p>
            <div className="grid gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.url}
                  type="button"
                  onClick={() => loadImageFromUrl(t.url)}
                  className="rounded-xl border border-black/10 px-3 py-2 text-left text-sm font-medium transition hover:bg-black/5"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <Field label="Title" value={title} onChange={setTitle} placeholder="My meme title" />
            <Field label="Caption" value={caption} onChange={setCaption} placeholder="Optional caption" />
            <Field label="Top text" value={topText} onChange={setTopText} placeholder="TOP TEXT" />
            <Field
              label="Bottom text"
              value={bottomText}
              onChange={setBottomText}
              placeholder="BOTTOM TEXT"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setImage(null)}
                className="flex-1 rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold"
              >
                Change image
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={posting}
                className="flex-1 rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-60"
              >
                {posting ? "Publishing…" : "Publish"}
              </button>
            </div>
          </>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </aside>

      <div className="rounded-[2rem] border border-black/10 bg-black p-3">
        {image ? (
          <canvas ref={canvasRef} className="mx-auto block max-w-full rounded-xl" />
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-muted)]">
            Canvas preview
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/10 bg-[var(--color-surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
      />
    </div>
  );
}
