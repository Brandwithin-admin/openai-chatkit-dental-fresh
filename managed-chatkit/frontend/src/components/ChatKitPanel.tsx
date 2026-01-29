import { useMemo } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";
import {
  GREETING_MESSAGE,
  INPUT_PLACEHOLDER,
  STARTER_PROMPTS,
  APP_NAME,
} from "../lib/config";

export function ChatKitPanel() {
  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId),
    []
  );

  const chatkit = useChatKit({
    api: { getClientSecret },
  });

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-100 p-4">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-colors">

        {/* Header with Dental Fresh logo */}
        <div className="flex items-center gap-3 border-b px-4 py-3 bg-white">
          <img
            src="https://www.dentalfresh.com.au/wp-content/uploads/2024/08/Untitled-design-7.png"
            alt="Dental Fresh Logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl font-semibold text-slate-800">
            {APP_NAME}
          </h1>
        </div>

        {/* Chat */}
        <div className="flex-1">
          <ChatKit
            control={chatkit.control}
            greeting={GREETING_MESSAGE}
            placeholderInput={INPUT_PLACEHOLDER}
            starterPrompts={STARTER_PROMPTS}
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
