// lib/config.ts
 
export const APP_NAME = "Dental Fresh AI Assistant";

// Greeting shown when the chat loads
export const GREETING_MESSAGE =
  "Hi! I’m your Dental Fresh AI Assistant. How can I help you today?";

// Placeholder inside the input box
export const INPUT_PLACEHOLDER =
  "Ask me about dentures, treatments, or your dental care...";

// Starter prompt buttons
export const STARTER_PROMPTS = [
  {
    id: "start-here",
    label: "Where should I start?",
    prompt:
      "Guide me on where to start with Dental Fresh based on my dental needs. Provide a simple pathway and link me to the most relevant services, patient information, and team pages from the Dental Fresh website."
  },
  {
    id: "denture-options",
    label: "What denture options are available?",
    prompt:
      "Explain the different denture and tooth replacement options available at Dental Fresh, including partial dentures, custom overdentures, and advanced implant dentures (All-on-4). Reference and link to the relevant pages on the Dental Fresh website."
  },
  {
    id: "denture-care",
    label: "How do I care for my dentures?",
    prompt:
      "Share general care and maintenance information for people who already have dentures. Reference and link to the Denture Care Guide on the Dental Fresh website and explain what patients should expect in ongoing care."
  }
];
