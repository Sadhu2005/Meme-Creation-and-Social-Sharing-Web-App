import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { listFeedMemesFromDb } from "@/server/repositories/memes.repository";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  let userId: string | undefined;

  if (supabase) {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    userId = user?.id;
  }

  const memes = (await listFeedMemesFromDb(userId)) ?? [];
  return NextResponse.json(memes);
}
