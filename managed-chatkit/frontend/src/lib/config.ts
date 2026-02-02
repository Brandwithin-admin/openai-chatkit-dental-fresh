// File: src/lib/config.ts
export const CHAT_CONFIG = {
  startScreen: {
    greeting: "Welcome to the FastAPI-powered ChatKit!",
    prompts: [
      { label: "🚀 Feature Tour", prompt: "Tell me about the top features." },
      { label: "🛠️ Support", prompt: "I need help with my account." },
      { label: "💳 Pricing", prompt: "What are your subscription plans?" },
    ],
  },
  composer: {
    placeholder: "Type a message...",
  }
};
