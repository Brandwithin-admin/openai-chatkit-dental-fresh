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
    // ADD THIS SECTION BELOW
    startScreen: {
      greeting: "Welcome! How can I help you today?",
      prompts: [
        { label: "🚀 Features", prompt: "What are the main features?" },
        { label: "🛠️ Support", prompt: "How do I contact support?" },
        { label: "💳 Pricing", prompt: "Tell me about your plans." },
      ],
    },
    composer: {
      placeholder: "Ask me anything...",
    }
  });

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
          <h1 className="text-xl font-semibold">Dental Fresh AI Assistant</h1>
        </div>

        {/* Chat */}
        <div className="flex-1">
          <ChatKit control={chatkit.control} className="h-full w-full" />
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2 text-center text-xs text-slate-500">
          Powered by Dental Fresh AI
        </div>
      </div>
    </div>
  );
}
