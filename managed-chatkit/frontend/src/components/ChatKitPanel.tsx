import { useMemo } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";
import {
  GREETING_MESSAGE,
  INPUT_PLACEHOLDER,
  STARTER_PROMPTS,
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
    <div className="flex h-[90vh] w-full rounded-2xl bg-white shadow-sm transition-colors dark:bg-slate-900">
      <ChatKit
        control={chatkit.control}
        greeting={GREETING_MESSAGE}
        placeholderInput={INPUT_PLACEHOLDER}
        starterPrompts={STARTER_PROMPTS}
        className="h-full w-full"
      />
    </div>
  );
}
