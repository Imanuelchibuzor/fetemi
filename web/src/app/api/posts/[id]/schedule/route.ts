import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const { scheduledAt } = await request.json();

  try {
    if (!scheduledAt) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const { error } = await supabaseServer
      .from("posts")
      .update({
        status: "scheduled",
        scheduled_at: new Date(scheduledAt).toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
