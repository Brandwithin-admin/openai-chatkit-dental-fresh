import { useMemo } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";

export function ChatKitPanel() {
  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId),
    []
  );

  const chatkit = useChatKit({
    api: { getClientSecret },
  });

  // Inline configuration (no config.ts)
  const APP_NAME = "Dental Fresh AI Assistant";

  const GREETING_MESSAGE =
    "Hi! I’m your Dental Fresh AI Assistant. How can I help you today?";

  const INPUT_PLACEHOLDER =
    "Ask me about dentures, treatments, or booking an appointment...";

  const STARTER_PROMPTS = [
    {
      label: "🦷 Denture Options",
      prompt:
        "Explain the different denture and tooth replacement options offered by Dental Fresh.",
      icon: "circle-question",
    },
    {
      label: "📍 Clinic Location & Hours",
      prompt:
        "Where is Dental Fresh located and what are your clinic opening hours?",
      icon: "circle-question",
    },
    {
      label: "💰 Treatment Prices",
      prompt:
        "What are the general price ranges for Dental Fresh treatments?",
      icon: "circle-question",
    },
    {
      label: "😁 Denture Care Tips",
      prompt:
        "Give simple daily care and maintenance tips for people wearing dentures.",
      icon: "circle-question",
    },
  ];

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-100 p-4">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg">

        {/* Header */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <img
            src="https://www.dentalfresh.com.au/wp-content/uploads/2024/08/Untitled-design-7.png"
            alt="Dental Fresh Logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl font-semibold">{APP_NAME}</h1>
        </div>

        {/* Chat */}
        <div className="flex-1">
          <ChatKit
            control={chatkit.control}
            greetingMessage={GREETING_MESSAGE}
            placeholder={INPUT_PLACEHOLDER}
            startScreenPrompts={STARTER_PROMPTS}
            className="h-full w-full"
          />
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2 text-center text-xs text-slate-500">
          Powered by Dental Fresh AI
        </div>
      </div>
    </div>
  );
}
