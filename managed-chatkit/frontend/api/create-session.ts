import type { VercelRequest, VercelResponse } from "@vercel/node";

const DEFAULT_CHATKIT_BASE = "https://api.openai.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  const workflowId =
    req.body?.workflow?.id ||
    req.body?.workflowId ||
    process.env.VITE_CHATKIT_WORKFLOW_ID;

  if (!openaiApiKey) {
    return res.status(500).json({
      error: "Missing OPENAI_API_KEY environment variable",
    });
  }

  if (!workflowId) {
    return res.status(400).json({ error: "Missing workflow id" });
  }

  try {
    const response = await fetch(`${DEFAULT_CHATKIT_BASE}/v1/chatkit/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "OpenAI-Beta": "chatkit_beta=v1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        chatkit_configuration: {
          file_upload: { enabled: true },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Create session error", err);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
