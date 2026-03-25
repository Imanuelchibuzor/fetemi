import { Resend } from "resend";
import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase";
const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const { data: user } = await supabaseServer
    .from("Users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized: User not found" },
      { status: 404 },
    );
  }

  const token = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save token
  await supabaseServer
    .from("Users")
    .update({
      login_token: token,
      token_expires_at: expiresAt,
    })
    .eq("email", email);

  // Send email with token
  await resend.emails.send({
    from: "Auth <onboarding@resend.dev>",
    to: email,
    subject: "Your login code",
    html: `<p>Your OTP is <strong>${token}</strong></p>`,
  });

  return NextResponse.json({
    message: "Token sent",
  });
}
