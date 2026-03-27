import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, body, subject, type } = await request.json();

    // The Webhook URL from your n8n "Webhook" node
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

    if (!N8N_WEBHOOK_URL) {
      throw new Error("n8n Webhook URL is not configured");
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        data: body,
        platform: type,
        subject: subject,
        action: "publish_post",
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n responded with ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Publishing Error:", error);
    return NextResponse.json(
      { error: "Failed to pulish post" },
      { status: 500 },
    );
  }
}
