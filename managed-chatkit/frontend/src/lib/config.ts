import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

console.log("ENV WORKFLOW:", import.meta.env.VITE_CHATKIT_WORKFLOW_ID);

export const WORKFLOW_ID =
  (import.meta.env.VITE_CHATKIT_WORKFLOW_ID as string | undefined)?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Where should I start?",
    prompt:
      "Guide me on where to start with Dental Fresh based on my dental needs. Provide a simple pathway and link me to the most relevant services, team pages, and patient information from the Dental Fresh website.",
    icon: "circle-question",
  },
  {
    label: "What are my denture options?",
    prompt:
      "Explain the different denture and tooth replacement options available at Dental Fresh, including partial dentures, custom overdentures, and advanced implant dentures (All-on-4). Reference and link to the relevant pages on the Dental Fresh website.",
    icon: "circle-question",
  },
  {
    label: "Show me helpful patient resources.",
    prompt:
      "Show me the most helpful patient resources and guides available on the Dental Fresh website, such as denture care guides, what to expect at my first consultation, and information about the Dental Fresh team. Include short explanations of why each resource is useful.",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT = "Ask anything about your dental care...";

export const GREETING =
  "How can I help you with your dental care today?";

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
