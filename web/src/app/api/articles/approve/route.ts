import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, body: articleBody, image } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 },
      );
    }

    const { error: supabaseError } = await supabaseServer
      .from("articles")
      .update({
        title,
        body: articleBody,
        is_approved: true,
      })
      .eq("id", id);

    if (supabaseError) {
      return NextResponse.json(
        { error: "Failed to update article in database" },
        { status: 500 },
      );
    }

    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    if (N8N_WEBHOOK_URL) {
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: id,
          data: articleBody,
          image: image,
          action: "generate_posts",
        }),
      });

      if (!n8nResponse.ok) {
        return NextResponse.json(
          { error: "n8n trigger failed, but database was updated." },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Article approved and generation initiated.",
    });
  } catch (error) {
    console.error("Approval Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
