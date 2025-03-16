"use client";

import { useState } from "react";
import { getGameByID } from "@/lib/game";
import { createPlayer } from "@/lib/player";
import { useRouter } from "next/navigation";
import { Game } from "@/app/context/AppCxt";

export const JoinForm = () => {
  const [gameID, setGameID] = useState<string>();
  const [playerName, setPlayerName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onJoin = async () => {
    if (!gameID?.trim() || !playerName?.trim()) {
      return;
    }

    const game: Game = await getGameByID(gameID);

    if (game) {
      const newPlayer = await createPlayer({ name: playerName, game: game.id });
      localStorage.setItem("player", JSON.stringify(newPlayer));

      router.push(`/game/${gameID}`);
    } else {
      alert("Game not found!");
    }

    setLoading(false);
    setGameID("");
    setPlayerName("");
  };

  return (
    <div className="form vertical">
      <input
        onChange={(ev) => setGameID(ev?.target?.value)}
        type="text"
        placeholder="Game ID... *"
      />
      <input
        onChange={(ev) => setPlayerName(ev?.target?.value)}
        type="text"
        placeholder="Your Name... *"
      />
      <button onClick={() => onJoin()} disabled={loading}>
        Join
      </button>
    </div>
  );
};
