import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("articles")
      .select("*")
      .eq("is_approved", true)
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ articles: data });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
