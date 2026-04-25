export type MemeStatus = "draft" | "published" | "archived";

export interface MemePreview {
  id: string;
  title: string;
  caption: string;
  author: string;
  imageLabel: string;
  tags: string[];
  likes: number;
  comments: number;
  status: MemeStatus;
}

