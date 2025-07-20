import { FIBONACCI } from "../constants";
import { GameType } from "../types";

export const getHint = (gameType?: GameType, size?: number) => {
  if (gameType === "fibonacci") {
    switch (size) {
      case FIBONACCI[0]:
        return "No effort";

      case FIBONACCI[1]:
        return "Trivial change, very quick and clear";

      case FIBONACCI[2]:
        return "Small, easy task with minor work";

      case FIBONACCI[3]:
        return "Typical task, clear, some effort";

      case FIBONACCI[4]:
        return "Medium task, needs thought, some complexity";

      case FIBONACCI[5]:
        return "Large task, higher complexity";

      case FIBONACCI[6]:
        return "Very large or unclear, likely needs splitting";
    }
  }

  return "";
};
