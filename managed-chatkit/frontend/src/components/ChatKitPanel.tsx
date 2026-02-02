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
      // RENAME THIS FROM onToolCall TO onClientToolCall
  onClientToolCall: async (toolCall) => {
    console.log("Tool triggered!", toolCall.name);
    
    if (toolCall.name === "handoffToSlack") {
      const args = JSON.parse(toolCall.arguments);

      try {
        const response = await fetch("https://openai-chatkit-dental-fresh.onrender.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        });

console.log("Render Backend Response:", result);
        if (!response.ok) throw new Error("Render backend failed");

        return {
          status: "success",
          content: "The Dental Fresh team has been notified!"
        };
      } catch (error) {
        console.error("Handoff error:", error);
        return { status: "error", content: "Notification failed." };
      }
    }    
      // If the name didn't match, tell the console why
  console.warn("Tool name did not match 'handoff_to_slack'");
  },

    startScreen: {
      greeting: "Welcome! How can I help you today?",
      prompts: [
        { label: "Where should I start?", prompt: "Guide me on where to start with Dental Fresh based on my dental needs. Provide a simple pathway and link me to the most relevant services, patient information, and team pages from the Dental Fresh website." },
        { label: "What denture options are available?", prompt: "Explain the different denture and tooth replacement options available at Dental Fresh, including partial dentures, custom overdentures, and advanced implant dentures (All-on-4). Reference and link to the relevant pages on the Dental Fresh website." },
        { label: "How do I care for my dentures?", prompt: "Share general care and maintenance information for people who already have dentures. Reference and link to the Denture Care Guide on the Dental Fresh website and explain what patients should expect in ongoing care." },
      ],
    },
    composer: {
      placeholder: "Ask me about dentures, treatments, or your dental care..",
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
