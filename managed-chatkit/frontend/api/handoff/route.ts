import { NextResponse } from "next/server";

export const runtime = "edge";

type HandoffPayload = {
  type: "progressive_profile" | "human_handoff";
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  transcript?: string | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as HandoffPayload;

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields: name and email" },
        { status: 400 }
      );
    }

    const slackWebhook = process.env.SLACK_WEBHOOK_URL;

    if (!slackWebhook) {
      console.error("Missing SLACK_WEBHOOK_URL env variable");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const ticketId = Math.random().toString(36).substring(2, 10).toUpperCase();

    const handoffType =
      body.type === "progressive_profile"
        ? "🟣 Progressive Profile"
        : "🟢 Human Handoff";

    const slackText = `
${handoffType} (#${ticketId})

*Name:* ${body.name}
*Email:* ${body.email}
*Phone:* ${body.phone || "N/A"}
*Company:* ${body.company || "N/A"}

*Message:*
${body.message || "_No message provided_"}

*Transcript (context):*
${body.transcript || "_No transcript provided_"}
    `.trim();

    const slackRes = await fetch(slackWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: slackText }),
    });

    if (!slackRes.ok) {
      console.error("Slack error:", await slackRes.text());
      return NextResponse.json(
        { error: "Slack webhook failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error in /api/handoff:", err);
    return NextResponse.json(
      { error: "Failed to process handoff" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
