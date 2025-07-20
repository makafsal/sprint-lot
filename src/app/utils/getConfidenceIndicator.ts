import { Game } from "../types";

export const getConfidenceIndicator = (game?: Game) => {
  if (game?.type === "confidence" && game?.status === "done") {
    const average = game?.average;

    if (average !== undefined && average >= 0 && average < 3) {
      return "🔴 Low";
    } else if (average !== undefined && average >= 3 && average < 4) {
      return "🟡 Moderate";
    } else if (average !== undefined && average >= 4) {
      return "🟢 High";
    } else {
      return "🤔 Uncertain";
    }
  }
};
