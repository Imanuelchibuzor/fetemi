import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req: Request) {
  const { email, token } = await req.json();

  const { data: user } = await supabaseServer
    .from("Users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized: User not found" }, { status: 404 });
  }

  if (user.login_token !== token) {
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
  }

  if (new Date(user.token_expires_at) < new Date()) {
    return NextResponse.json({ error: "Unauthorized: Token expired" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
  });
}
