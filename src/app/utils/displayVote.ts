import { T_SHIRT } from "../constants";
import { Game, Player } from "../types";

export const displayVote = (player: Player, game: Game) => {
  if (game?.type === "t-shirt") {
    return T_SHIRT?.find((size) => size.value === player?.vote)?.text || "🤔";
  } else {
    if (
      player?.vote !== null &&
      player?.vote !== undefined &&
      player?.vote >= 0
    ) {
      return player?.vote;
    } else {
      return "🤔";
    }
  }
};
