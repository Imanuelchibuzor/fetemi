import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    // Fetch specific columns where job_id matches the passed ID
    const { data: articles, error } = await supabaseServer
      .from("articles")
      .select("id, title, excerpt, body, image_url")
      .eq("job_id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ articles: articles || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
