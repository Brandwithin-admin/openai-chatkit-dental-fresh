"""FastAPI entrypoint for Managed ChatKit with flexible Slack handoff."""

from __future__ import annotations

import json
import os
import uuid
from typing import Any, Mapping

import httpx
from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

DEFAULT_CHATKIT_BASE = "https://api.openai.com"
SESSION_COOKIE_NAME = "chatkit_session_id"
SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30  # 30 days

app = FastAPI(title="Managed ChatKit Session & Handoff API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FLEXIBLE HANDOFF ROUTE ---
# This uses 'dict' to bypass the 422 validation errors you were seeing.

@app.post("/api/handoff")
async def handle_handoff(data: dict = Body(...)):
    # Safely extract data using .get() to handle nulls
    h_type = data.get("type", "unknown")
    name = data.get("name", "Unknown")
    email = data.get("email")
    phone = data.get("phone", "N/A")
    message = data.get("message", "No message provided")
    transcript = data.get("transcript", "No transcript provided")

    print(f"--- Incoming Tool Call: {h_type} for {name} ---")

    # Only send to Slack if it's a real handoff or we finally have an email
    if h_type == "human_handoff" or (email and isinstance(email, str) and "@" in email):
        slack_url = os.environ.get("SLACK_WEBHOOK_URL")
        
        if slack_url:
            payload = {
                "text": (
                    f"🦷 *Dental Fresh Lead*\n"
                    f"*Type:* {h_type}\n"
                    f"*Patient:* {name}\n"
                    f"*Email:* {email or 'Pending...'}\n"
                    f"*Phone:* {phone}\n"
                    f"*Context:* {message}\n"
                    f"--- \n*Summary:* {transcript}"
                )
            }
            async with httpx.AsyncClient() as client:
                await client.post(slack_url, json=payload)
        else:
            print("ERROR: SLACK_WEBHOOK_URL not found in environment variables.")

    return {"status": "success"}

# --- EXISTING SESSION LOGIC ---

@app.get("/health")
async def health() -> Mapping[str, str]:
    return {"status": "ok"}

@app.post("/api/create-session")
async def create_session(request: Request) -> JSONResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return respond({"error": "Missing OPENAI_API_KEY environment variable"}, 500)

    body = await read_json_body(request)
    workflow_id = resolve_workflow_id(body)
    if not workflow_id:
        return respond({"error": "Missing workflow id"}, 400)

    user_id, cookie_value = resolve_user(request.cookies)
    api_base = chatkit_api_base()

    payload = body.copy()
    payload["workflow"] = {"id": workflow_id}
    payload["user"] = user_id

    try:
        async with httpx.AsyncClient(base_url=api_base, timeout=10.0) as client:
            upstream = await client.post(
                "/v1/chatkit/sessions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "OpenAI-Beta": "chatkit_beta=v1",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
    except httpx.RequestError as error:
        return respond({"error": f"Failed to reach ChatKit API: {error}"}, 502, cookie_value)

    payload = parse_json(upstream)
    if not upstream.is_success:
        message = payload.get("error") if isinstance(payload, dict) else None
        message = message or upstream.reason_phrase or "Failed to create session"
        return respond({"error": message}, upstream.status_code, cookie_value)

    client_secret = payload.get("client_secret") if isinstance(payload, dict) else None
    expires_after = payload.get("expires_after") if isinstance(payload, dict) else None

    return respond(
        {"client_secret": client_secret, "expires_after": expires_after},
        200,
        cookie_value,
    )

def respond(payload: Mapping[str, Any], status_code: int, cookie_value: str | None = None) -> JSONResponse:
    response = JSONResponse(payload, status_code=status_code)
    if cookie_value:
        response.set_cookie(
            key=SESSION_COOKIE_NAME,
            value=cookie_value,
            max_age=SESSION_COOKIE_MAX_AGE_SECONDS,
            httponly=True,
            samesite="lax",
            secure=is_prod(),
            path="/",
        )
    return response

def is_prod() -> bool:
    env = (os.getenv("ENVIRONMENT") or os.getenv("NODE_ENV") or "").lower()
    return env == "production"

async def read_json_body(request: Request) -> Mapping[str, Any]:
    raw = await request.body()
    return json.loads(raw) if raw else {}

def resolve_workflow_id(body: Mapping[str, Any]) -> str | None:
    workflow = body.get("workflow", {})
    workflow_id = workflow.get("id") if isinstance(workflow, Mapping) else None
    workflow_id = workflow_id or body.get("workflowId")
    env_workflow = os.getenv("CHATKIT_WORKFLOW_ID") or os.getenv("VITE_CHATKIT_WORKFLOW_ID")
    return (workflow_id or env_workflow or "").strip() or None

def resolve_user(cookies: Mapping[str, str]) -> tuple[str, str | None]:
    existing = cookies.get(SESSION_COOKIE_NAME)
    if existing: return existing, None
    user_id = str(uuid.uuid4())
    return user_id, user_id

def chatkit_api_base() -> str:
    return os.getenv("CHATKIT_API_BASE") or os.getenv("VITE_CHATKIT_API_BASE") or DEFAULT_CHATKIT_BASE

def parse_json(response: httpx.Response) -> Mapping[str, Any]:
    try:
        return response.json()
    except:
        return {}
