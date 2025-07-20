import { FIBONACCI, CONFIDENCE, T_SHIRT } from "../constants";
import { GameType } from "../types";

const fibonacciHints: Record<number, string> = {
  [FIBONACCI[0]]: "No effort",
  [FIBONACCI[1]]: "Trivial change, very quick and clear",
  [FIBONACCI[2]]: "Small, easy task with minor work",
  [FIBONACCI[3]]: "Typical task, clear, some effort",
  [FIBONACCI[4]]: "Medium task, needs thought, some complexity",
  [FIBONACCI[5]]: "Large task, higher complexity",
  [FIBONACCI[6]]: "Very large or unclear, likely needs splitting"
};

const confidenceHints: Record<number, string> = {
  [CONFIDENCE[0]]:
    "No confidence: I have no understanding at all and cannot estimate",
  [CONFIDENCE[1]]: "Low confidence: I have many unknowns or no clue yet",
  [CONFIDENCE[2]]: "Some confidence: I know a bit, but unsure about details",
  [CONFIDENCE[3]]:
    "Moderate confidence: I know what to do, but there are some risks",
  [CONFIDENCE[4]]: "High confidence: I’m clear on the work, few uncertainties",
  [CONFIDENCE[5]]:
    "Very high confidence: I’m fully confident, can start immediately"
};

const tShirtHints: Record<string, string> = {
  [T_SHIRT[0].text]: "Extra Extra Small: Tiny, near-zero effort",
  [T_SHIRT[1].text]: "Extra Small: Very small, trivial, quick task",
  [T_SHIRT[2].text]: "Small: Small task, clear, low effort",
  [T_SHIRT[3].text]: "Medium: Typical task, some effort, moderate complexity",
  [T_SHIRT[4].text]: "Large: Big task, higher complexity or multiple parts",
  [T_SHIRT[5].text]: "Extra Large: Very big, unclear, likely needs splitting",
  [T_SHIRT[6].text]: "Double XL: Too large to estimate, must break down"
};

export const getHint = (
  gameType?: GameType,
  size?: number | string
): string => {
  if (!gameType || size === undefined) return "";

  switch (gameType) {
    case "fibonacci":
      return fibonacciHints[size as number] ?? "";
    case "confidence":
      return confidenceHints[size as number] ?? "";
    case "t-shirt":
      return tShirtHints[size as string] ?? "";
    default:
      return "";
  }
};
