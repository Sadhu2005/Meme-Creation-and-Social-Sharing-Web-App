import type { Meme, MemeComment, PublishMemeInput } from "@/types/meme";

const MEMES_KEY = "meme_app_memes";
const LIKES_KEY = "meme_app_likes";
const COMMENTS_KEY = "meme_app_comments";
const SEEDED_KEY = "meme_app_seeded";

type StoredLike = { memeId: string; userId: string };
type StoredComment = MemeComment;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedIfNeeded() {
  if (localStorage.getItem(SEEDED_KEY)) return;

  const memes: Array<{
    id: string;
    title: string;
    caption: string;
    imageUrl: string;
    authorId: string;
    authorUsername: string;
    tags: string[];
    status: "published";
    createdAt: string;
  }> = [
    {
      id: "seed-1",
      title: "Launch Mode",
      caption: "Shipping the first version while the coffee is still hot.",
      imageUrl:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=800&fit=crop",
      authorId: "seed-user",
      authorUsername: "sadhu",
      tags: ["launch", "startup"],
      status: "published",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: "seed-2",
      title: "Debug Face",
      caption: "That moment when the bug disappears during screen share.",
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=800&fit=crop",
      authorId: "seed-user-2",
      authorUsername: "asha",
      tags: ["coding", "bugs"],
      status: "published",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  writeJson(MEMES_KEY, memes);
  writeJson(LIKES_KEY, [
    { memeId: "seed-1", userId: "seed-user-2" },
    { memeId: "seed-2", userId: "seed-user" }
  ] as StoredLike[]);
  writeJson(COMMENTS_KEY, [
    {
      id: "c1",
      memeId: "seed-1",
      authorId: "seed-user-2",
      authorUsername: "asha",
      content: "This is too real 😂",
      createdAt: new Date().toISOString()
    }
  ] as StoredComment[]);
  localStorage.setItem(SEEDED_KEY, "1");
}

type RawMeme = {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  authorId: string;
  authorUsername: string;
  tags: string[];
  status: "published" | "draft" | "archived";
  createdAt: string;
};

function toMeme(raw: RawMeme, likes: StoredLike[], comments: StoredComment[], userId?: string): Meme {
  const likeCount = likes.filter((l) => l.memeId === raw.id).length;
  const commentCount = comments.filter((c) => c.memeId === raw.id).length;
  return {
    id: raw.id,
    title: raw.title,
    caption: raw.caption,
    imageUrl: raw.imageUrl,
    authorId: raw.authorId,
    authorUsername: raw.authorUsername,
    tags: raw.tags,
    likeCount,
    commentCount,
    likedByMe: userId ? likes.some((l) => l.memeId === raw.id && l.userId === userId) : false,
    status: raw.status,
    createdAt: raw.createdAt
  };
}

export function listDemoMemes(userId?: string): Meme[] {
  seedIfNeeded();
  const memes = readJson<RawMeme[]>(MEMES_KEY, []);
  const likes = readJson<StoredLike[]>(LIKES_KEY, []);
  const comments = readJson<StoredComment[]>(COMMENTS_KEY, []);
  return memes
    .filter((m) => m.status === "published")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((m) => toMeme(m, likes, comments, userId));
}

export function listDemoMemesByAuthor(username: string, userId?: string): Meme[] {
  return listDemoMemes(userId).filter(
    (m) => m.authorUsername.toLowerCase() === username.toLowerCase()
  );
}

export function publishDemoMeme(
  input: PublishMemeInput,
  author: { id: string; username: string }
): Meme {
  seedIfNeeded();
  const memes = readJson<RawMeme[]>(MEMES_KEY, []);
  const raw: RawMeme = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    caption: input.caption.trim(),
    imageUrl: input.imageDataUrl,
    authorId: author.id,
    authorUsername: author.username,
    tags: input.tags ?? [],
    status: "published",
    createdAt: new Date().toISOString()
  };
  memes.unshift(raw);
  writeJson(MEMES_KEY, memes);
  return toMeme(raw, readJson(LIKES_KEY, []), readJson(COMMENTS_KEY, []), author.id);
}

export function toggleDemoLike(memeId: string, userId: string): Meme | null {
  const memes = readJson<RawMeme[]>(MEMES_KEY, []);
  const meme = memes.find((m) => m.id === memeId);
  if (!meme) return null;

  const likes = readJson<StoredLike[]>(LIKES_KEY, []);
  const idx = likes.findIndex((l) => l.memeId === memeId && l.userId === userId);
  if (idx >= 0) likes.splice(idx, 1);
  else likes.push({ memeId, userId });
  writeJson(LIKES_KEY, likes);

  return toMeme(meme, likes, readJson(COMMENTS_KEY, []), userId);
}

export function addDemoComment(
  memeId: string,
  content: string,
  author: { id: string; username: string }
): { meme: Meme | null; comment: MemeComment } {
  const memes = readJson<RawMeme[]>(MEMES_KEY, []);
  const meme = memes.find((m) => m.id === memeId);
  if (!meme) return { meme: null, comment: null! };

  const comments = readJson<StoredComment[]>(COMMENTS_KEY, []);
  const comment: MemeComment = {
    id: crypto.randomUUID(),
    memeId,
    authorId: author.id,
    authorUsername: author.username,
    content: content.trim(),
    createdAt: new Date().toISOString()
  };
  comments.push(comment);
  writeJson(COMMENTS_KEY, comments);

  const likes = readJson<StoredLike[]>(LIKES_KEY, []);
  return { meme: toMeme(meme, likes, comments, author.id), comment };
}

export function listDemoComments(memeId: string): MemeComment[] {
  return readJson<StoredComment[]>(COMMENTS_KEY, [])
    .filter((c) => c.memeId === memeId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
