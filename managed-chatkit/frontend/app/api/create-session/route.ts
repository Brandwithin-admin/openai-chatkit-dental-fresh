import { WORKFLOW_ID } from "@/lib/config";

export const runtime = "edge";

const DEFAULT_CHATKIT_BASE = "https://api.openai.com";
const SESSION_COOKIE_NAME = "chatkit_session_id";
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(request: Request): Promise<Response> {
  let sessionCookie: string | null = null;

  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return json({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    const body = await safeParseJson(request);
    const { userId, sessionCookie: resolvedCookie } = await resolveUserId(request);
    sessionCookie = resolvedCookie;

    const workflowId =
      body?.workflow?.id ??
      body?.workflowId ??
      WORKFLOW_ID;

    if (!workflowId) {
      return json({ error: "Missing workflow id" }, 400, sessionCookie);
    }

    const response = await fetch(`${DEFAULT_CHATKIT_BASE}/v1/chatkit/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "OpenAI-Beta": "chatkit_beta=v1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: userId,
        chatkit_configuration: {
          file_upload: { enabled: true },
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return json(data, response.status, sessionCookie);
    }

    return json(
      { client_secret: data.client_secret, expires_after: data.expires_after },
      200,
      sessionCookie
    );
  } catch (err) {
    console.error("Create session error", err);
    return json({ error: "Unexpected error" }, 500, sessionCookie);
  }
}

function json(payload: unknown, status = 200, cookie?: string | null) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (cookie) headers.append("Set-Cookie", cookie);
  return new Response(JSON.stringify(payload), { status, headers });
}

async function safeParseJson(req: Request) {
  try {
    const text = await req.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

async function resolveUserId(request: Request) {
  const cookie = getCookie(request.headers.get("cookie"), SESSION_COOKIE_NAME);
  if (cookie) return { userId: cookie, sessionCookie: null };

  const id = crypto.randomUUID();
  return { userId: id, sessionCookie: serializeCookie(id) };
}

function getCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [k, v] = part.split("=");
    if (k.trim() === name) return v;
  }
  return null;
}

function serializeCookie(value: string) {
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; Max-Age=${SESSION_COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax`;
}
