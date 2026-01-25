import type { VercelRequest, VercelResponse } from "@vercel/node";

type HandoffPayload = {
  type: "progressive_profile" | "human_handoff";
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  transcript?: string | null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = req.body as HandoffPayload;

    if (!body.name || !body.email) {
      return res.status(400).json({
        error: "Missing required fields: name and email",
      });
    }

    const slackWebhook = process.env.SLACK_WEBHOOK_URL;

    if (!slackWebhook) {
      console.error("Missing SLACK_WEBHOOK_URL env variable");
      return res.status(500).json({ error: "Server misconfiguration" });
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

*Message:*
${body.message || "_No message provided_"}

*Transcript:*
${body.transcript || "_No transcript provided_"}
    `.trim();

    const slackRes = await fetch(slackWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: slackText }),
    });

    if (!slackRes.ok) {
      const errText = await slackRes.text();
      console.error("Slack error:", errText);
      return res.status(500).json({ error: "Slack webhook failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error in /api/handoff:", err);
    return res.status(500).json({ error: "Failed to process handoff" });
  }
}
