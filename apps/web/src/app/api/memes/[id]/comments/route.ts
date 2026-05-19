import { NextResponse } from "next/server";

import { listCommentsFromDb } from "@/server/repositories/memes.repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await listCommentsFromDb(id);

  if (comments === null) {
    return NextResponse.json({ error: "Not available" }, { status: 503 });
  }

  return NextResponse.json(comments);
}
