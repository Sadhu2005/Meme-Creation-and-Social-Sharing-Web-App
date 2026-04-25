import type { MemePreview } from "@/types/meme";

const demoMemes: MemePreview[] = [
  {
    id: "launch-mode",
    title: "Launch Mode",
    caption: "Shipping the first version while the coffee is still hot.",
    author: "Sadhu",
    imageLabel: "Laptop, stickered water bottle, and an overexcited launch checklist",
    tags: ["launch", "startup", "relatable"],
    likes: 128,
    comments: 24,
    status: "published"
  },
  {
    id: "debug-face",
    title: "Debug Face",
    caption: "That moment when the bug disappears during screen share.",
    author: "Asha",
    imageLabel: "A dramatic side-eye reaction shot lit by a blue monitor glow",
    tags: ["coding", "bugs", "team-life"],
    likes: 231,
    comments: 38,
    status: "published"
  },
  {
    id: "monday-energy",
    title: "Monday Energy",
    caption: "Opening the editor with a big plan and one remaining battery bar.",
    author: "Ravi",
    imageLabel: "A slumped chair, giant task board, and one blinking battery icon",
    tags: ["mood", "work", "meme-editor"],
    likes: 84,
    comments: 11,
    status: "published"
  }
];

export async function listFeedMemes() {
  return demoMemes;
}

