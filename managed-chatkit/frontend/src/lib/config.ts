// lib/config.ts
import type { StartScreenPrompt } from "@openai/chatkit-react";

export const APP_NAME = "Dental Fresh AI Assistant";

export const GREETING_MESSAGE =
  "Hi! I’m your Dental Fresh AI Assistant. How can I help you today?";

export const INPUT_PLACEHOLDER =
  "Ask me about dentures, treatments, or your dental care...";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Where should I start?",
    prompt:
      "Guide me on where to start with Dental Fresh based on my dental needs. Provide a simple pathway and link me to the most relevant services, patient information, and team pages from the Dental Fresh website.",
    icon: "circle-question",
  },
  {
    label: "What denture options are available?",
    prompt:
      "Explain the different denture and tooth replacement options available at Dental Fresh, including partial dentures, custom overdentures, and advanced implant dentures (All-on-4). Reference and link to the relevant pages on the Dental Fresh website.",
    icon: "circle-question",
  },
  {
    label: "How do I care for my dentures?",
    prompt:
      "Share general care and maintenance information for people who already have dentures. Reference and link to the Denture Care Guide on the Dental Fresh website and explain what patients should expect in ongoing care.",
    icon: "circle-question",
  },
];
