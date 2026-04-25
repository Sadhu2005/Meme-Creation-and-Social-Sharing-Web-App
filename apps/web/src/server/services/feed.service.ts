import { listFeedMemes } from "@/server/repositories/memes.repository";

export async function getFeedPreview() {
  return listFeedMemes();
}

