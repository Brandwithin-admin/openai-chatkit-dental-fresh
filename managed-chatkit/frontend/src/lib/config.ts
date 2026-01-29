import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export const WORKFLOW_ID =
  (import.meta.env.VITE_CHATKIT_WORKFLOW_ID as string | undefined)?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

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

export const PLACEHOLDER_INPUT = "Ask about dentures, your first visit, or our team...";

export const GREETING =
  "Welcome to Dental Fresh. How can I help you today?";


export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      primary: theme === "dark" ? "#f1f5f9" : "#0f172a",
      level: 1,
    },
  },
  radius: "round",
});
