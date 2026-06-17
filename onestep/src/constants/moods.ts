export type MoodId = "tired" | "stressed" | "okay" | "good";

export interface MoodOption {
  id: MoodId;
  emoji: string;
  label: string;
  description: string;
  response: string;
}

export const moods: MoodOption[] = [
  {
    id: "tired",
    emoji: "😴",
    label: "Tired",
    description: "Low energy, need something gentle.",
    response: "You don’t need to do everything. Just one small step is enough.",
  },
  {
    id: "stressed",
    emoji: "😟",
    label: "Stressed",
    description: "Mind feels busy or pressured.",
    response: "Let’s slow things down and focus on only one thing.",
  },
  {
    id: "okay",
    emoji: "😐",
    label: "Okay",
    description: "Not bad, not great. Just present.",
    response: "That’s okay. Let’s choose one simple task and begin gently.",
  },
  {
    id: "good",
    emoji: "😊",
    label: "Good",
    description: "Feeling ready to make progress.",
    response: "Nice. Let’s use this energy for one focused session.",
  },
];