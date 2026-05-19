export type MemeStatus = "draft" | "published" | "archived";

export interface Meme {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  authorId: string;
  authorUsername: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  status: MemeStatus;
  createdAt: string;
}

export interface MemeComment {
  id: string;
  memeId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  createdAt: string;
}

export interface PublishMemeInput {
  title: string;
  caption: string;
  imageDataUrl: string;
  tags?: string[];
}
