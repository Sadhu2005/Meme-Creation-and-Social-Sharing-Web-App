import { listFeedMemesFromDb } from "@/server/repositories/memes.repository";

export async function getFeedMemes(userId?: string) {
  const fromDb = await listFeedMemesFromDb(userId);
  return fromDb ?? [];
}
