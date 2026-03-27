"use server"

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n responded with ${n8nResponse.status}`);
    }

    const data = await n8nResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Workflow Error:", error);
    return NextResponse.json(
      { error: "Failed to trigger workflow" },
      { status: 500 },
    );
  }
}
